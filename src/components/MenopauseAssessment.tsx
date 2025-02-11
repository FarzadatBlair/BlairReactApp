'use client';
import React, { useEffect, useState } from 'react';
import QuestionPage from '@components/QuestionPage';
import { fetchQuestions } from '@/utils/fetchQuestions';
import { Question, FlowStep } from '@/types/question';
import { supabase } from '@utils/supabase/supabase';
import flowData from '@data/flow.json';
import { useQuestionStore } from '@/store/useQuestionStore';
import { getNextStep, getFinalResult } from '@/utils/flowManager';
import { useRouter } from 'next/navigation';

const MenopauseAssessment: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionId, setCurrentQuestionId] = useState<string | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const flow = flowData as unknown as FlowStep[];
  const router = useRouter();

  // Zustand store
  const { setAnswer, resetAnswers } = useQuestionStore();

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleContinue = async (answer: string[]) => {
    if (isSubmitting || !currentQuestionId) return;
    setSubmitError(null);
    setIsSubmitting(true);

    console.log(
      `Handling continue for question: ${currentQuestionId}, selected answers:`,
      answer,
    );

    setAnswer(currentQuestionId, answer);
    const updatedAnswers = useQuestionStore.getState().answers;
    console.log(`Updated answers state:`, updatedAnswers);

    if (!Array.isArray(questions)) {
      console.error('Error: `questions` is not an array!', questions);
      setSubmitError('Internal error: Unable to process questions.');
      setIsSubmitting(false);
      return;
    }

    const nextStep = getNextStep(flow, questions, currentQuestionId, answer);
    if (!nextStep) {
      setSubmitError(
        `Error: No valid next step found from ${currentQuestionId}`,
      );
      console.log(`No valid next step found from ${currentQuestionId}`);
      setIsSubmitting(false);
      return;
    }

    if (nextStep.to === '') {
      console.log(`Reached final step, determining result...`);
      try {
        const result = await getFinalResult(
          flow,
          questions,
          currentQuestionId,
          answer,
        );
        if (!result) {
          console.log(
            `Failed to determine result for question: ${currentQuestionId}`,
          );
          throw new Error('Failed to determine result.');
        }

        console.log(`Final result determined: ${result}`);
        await submitUserResponses(updatedAnswers, result);
        resetAnswers();
      } catch (err) {
        console.log(`Submission error:`, err);
        setSubmitError(
          `Submission error: ${err instanceof Error ? err.message : JSON.stringify(err)}`,
        );
      }
      setIsSubmitting(false);
      return;
    }

    setCurrentQuestionId(nextStep.to);
    setIsSubmitting(false);
  };

  const submitUserResponses = async (
    answers: Record<string, string[]>,
    result: string,
  ) => {
    console.log(`Submitting user responses with final result: ${result}`);

    try {
      const { data: user, error: authError } = await supabase.auth.getUser();
      if (authError || !user?.user?.id)
        throw new Error('User not authenticated');

      const user_id = user.user.id;
      console.log(`User ID for result submission: ${user_id}`);

      // Create assessment entry first
      const { data: newAssessment, error: createError } = await supabase
        .schema('menopause_assessment')
        .from('assess_results_user')
        .insert([{ user_id, result_id: result }])
        .select('id')
        .single();

      if (createError) throw createError;
      const assessment_id = newAssessment.id;

      console.log(`Created assessment_id: ${assessment_id}`);

      // Map answers to correct tables
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const updatesByTable: Record<string, Record<string, any>> = {
        meno_assess_user_master: {},
        meno_assess_user_period: {},
        meno_assess_user_no_hysterectomy: {},
        meno_assess_user_ovaries_in: {},
        meno_assess_user_ovaries_out: {},
      };

      Object.entries(answers).forEach(([questionId, answer]) => {
        const question = questions.find((q) => q.id === questionId);
        if (!question) return;

        const { category, column, type } = question;
        if (!category || !column) return;

        const tableName = `meno_assess_user_${category.toLowerCase()}`;

        if (type === 'MC') {
          updatesByTable[tableName][column] = answer[0] === 'Yes';
        } else {
          updatesByTable[tableName][column] =
            `{${answer.map((a) => `"${a}"`).join(',')}}`;
        }
      });

      for (const [tableName, updateData] of Object.entries(updatesByTable)) {
        if (Object.keys(updateData).length < 2) continue;

        updateData.user_id = user_id;
        updateData.assessment_id = assessment_id;

        console.log(`Inserting into ${tableName}:`, updateData);

        const { error } = await supabase
          .schema('menopause_assessment')
          .from(`${tableName}`)
          .insert([updateData]);

        if (error) {
          console.error(`Supabase Insert Error in ${tableName}:`, error);
          throw error;
        }
      }

      console.log('User responses successfully saved.');
      router.push('/results');
    } catch (err) {
      console.error('Error submitting responses:', err);
      setSubmitError(
        `Failed to submit responses: ${err instanceof Error ? err.message : JSON.stringify(err)}`,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-error-500">{error}</div>;
  if (!currentQuestionId) return <div>Questionnaire complete.</div>;

  const currentQuestion = questions.find((q) => q.id === currentQuestionId);
  if (!currentQuestion)
    return <div className="text-error-500">Error: Question not found</div>;

  return (
    <div>
      {submitError && <div className="mt-4 text-error-500">{submitError}</div>}
      <QuestionPage
        title={currentQuestion.title}
        description={currentQuestion.description}
        type={currentQuestion.type}
        options={currentQuestion.options}
        onContinue={handleContinue}
        disabled={isSubmitting}
      />
    </div>
  );
};

export default MenopauseAssessment;
