'use client';
import React, { useEffect, useState } from 'react';
import QuestionPage from '@components/QuestionPage';
import { fetchQuestions } from '@/utils/fetchQuestions';
import { Question } from '@/types/question';
import { supabase } from '@utils/supabase/supabase';
import flowData from '@data/flow.json';
import { useQuestionStore } from '@/store/useQuestionStore';

interface FlowStep {
  from: string;
  to: string;
  includes: number[];
  excludes: number[];
  'is-start': boolean;
  'is-end': boolean;
  note: string;
}

const QuestionsPage: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionId, setCurrentQuestionId] = useState<string | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const flow = flowData as unknown as FlowStep[];

  // Zustand store
  const { answers, setAnswer, resetAnswers } = useQuestionStore();

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const data: Question[] = await fetchQuestions();
        setQuestions(data);

        console.log('QUESTION DATA', data);

        // Find the start question
        const startStep = flow.find((step) => step['is-start']);
        if (!startStep) throw new Error('No start question found!');

        setCurrentQuestionId(startStep.to);
      } catch (err: unknown) {
        if (err instanceof Error)
          setError('Failed to load questions: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, []);

  const handleContinue = async (answer: string[]) => {
    setSubmitError(null);
    if (!currentQuestionId) return;

    console.log('ANSWERS BEFORE:', useQuestionStore.getState().answers);

    // Store answer in Zustand store
    setAnswer(currentQuestionId, answer);

    const updatedAnswers = useQuestionStore.getState().answers;
    console.log('ANSWERS AFTER:', updatedAnswers);

    // Find the next step in the flow
    const nextStep = flow.find((step) => {
      if (step.from !== currentQuestionId) return false;

      // Convert answer labels to indices
      const selectedIndices = answer
        .map((ans) =>
          questions
            .find((q) => q.id === currentQuestionId)
            ?.options.findIndex((opt) => opt.label === ans),
        )
        .filter((i) => i !== -1); // Remove invalid indices

      // Modify the includes condition to check if at least one option is present
      const matchesIncludes =
        step.includes.length === 0 ||
        step.includes.some((inc) => selectedIndices.includes(inc));
      const matchesExcludes = step.excludes.every(
        (exc) => !selectedIndices.includes(exc),
      );

      return matchesIncludes && matchesExcludes;
    });

    if (!nextStep) {
      setSubmitError(
        `Error: No valid next step found from ${currentQuestionId}`,
      );
      return;
    }

    if (nextStep['is-end']) {
      console.log('FINAL STEP REACHED - SUBMITTING FINAL ANSWERS');
      try {
        await submitAnswersToSupabase(updatedAnswers);
        resetAnswers();
      } catch (err) {
        setSubmitError(
          `Submission error: ${err instanceof Error ? err.message : JSON.stringify(err)}`,
        );
      }
      return;
    }

    setCurrentQuestionId(nextStep.to);
  };

  const submitAnswersToSupabase = async (
    finalAnswers: Record<string, string[]>,
  ) => {
    console.log('FINAL ANSWERS', finalAnswers);
    try {
      // Get authenticated user
      const { data: user, error: authError } = await supabase.auth.getUser();
      if (authError || !user?.user?.id)
        throw new Error('User not authenticated');

      const user_id = user.user.id;

      // Group answers by table
      const tableData: Record<string, Record<string, any>> = {
        meno_assess_user_master: {},
        meno_assess_user_period: {},
      };

      for (const [questionId, answer] of Object.entries(finalAnswers)) {
        switch (questionId) {
          case 'Q-001':
            tableData.meno_assess_user_master['has_poi'] =
              answer.includes('Yes');
            break;
          case 'Q-002':
            tableData.meno_assess_user_master['master_symptoms'] =
              answer.length > 0 ? answer : [];
            break;
          case 'Q-002.5':
            tableData.meno_assess_user_master['sexual_function_issues'] =
              answer.length > 0 ? answer : [];
            break;
          case 'Q-003':
            tableData.meno_assess_user_master['treatment_status'] =
              answer.length > 0 ? answer : [];
            break;
          case 'Q-004':
            tableData.meno_assess_user_period['has_period'] = answer.includes(
              'Yes, I still get periods.',
            );
            break;
          default:
            throw new Error(`Unhandled question ID: ${questionId}`);
        }
      }

      // Process each table
      for (const [tableName, updateData] of Object.entries(tableData)) {
        if (Object.keys(updateData).length === 0) continue; // Skip empty updates

        // Check if user already has an entry
        const { data: existingAssessment, error: fetchError } = await supabase
          .schema('menopause_assessment')
          .from(tableName)
          .select('assessment_id')
          .eq('user_id', user_id)
          .maybeSingle();

        if (fetchError && fetchError.code !== 'PGRST116') {
          throw new Error(
            `Failed to fetch assessment from ${tableName}: ${fetchError.message}`,
          );
        }

        let assessment_id = existingAssessment?.assessment_id;
        if (!assessment_id) {
          await supabase
            .schema('menopause_assessment')
            .from(tableName)
            .insert([
              { user_id, assessment_id: crypto.randomUUID(), ...updateData },
            ])
            .select('assessment_id')
            .single();
        } else {
          await supabase
            .schema('menopause_assessment')
            .from(tableName)
            .update(updateData)
            .eq('user_id', user_id)
            .eq('assessment_id', assessment_id);
        }
      }

      resetAnswers();
    } catch (err) {
      setSubmitError(
        `Failed to submit answers: ${err instanceof Error ? err.message : JSON.stringify(err)}`,
      );
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!currentQuestionId) return <div>Questionnaire complete.</div>;

  const currentQuestion = questions.find((q) => q.id === currentQuestionId);
  if (!currentQuestion)
    return <div className="text-red-500">Error: Question not found</div>;

  return (
    <div>
      {submitError && <div className="mt-4 text-red-500">{submitError}</div>}
      <QuestionPage
        title={currentQuestion.title}
        description={currentQuestion.description}
        type={currentQuestion.type}
        options={currentQuestion.options}
        onContinue={handleContinue}
      />
    </div>
  );
};

export default QuestionsPage;
