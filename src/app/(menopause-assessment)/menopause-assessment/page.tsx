'use client';
import React, { useEffect, useState } from 'react';
import QuestionPage from '@components/QuestionPage';
import { fetchQuestions } from '@/utils/fetchQuestions';
import { Question, FlowStep } from '@/types/question';
// import { FlowStep } from '@/types/flow';
import { supabase } from '@utils/supabase/supabase';
import flowData from '@data/flow.json';
import { useQuestionStore } from '@/store/useQuestionStore';
import { getNextStep, getFinalResult } from '@/utils/flowManager';

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
  }, []);

  const handleContinue = async (answer: string[]) => {
    setSubmitError(null);
    if (!currentQuestionId) return;

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
      return;
    }

    const nextStep = getNextStep(flow, questions, currentQuestionId, answer);
    if (!nextStep) {
      setSubmitError(
        `Error: No valid next step found from ${currentQuestionId}`,
      );
      console.log(`No valid next step found from ${currentQuestionId}`);
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
        await submitFinalResultToSupabase(result, updatedAnswers);
        resetAnswers();
      } catch (err) {
        console.log(`Submission error:`, err);
        setSubmitError(
          `Submission error: ${err instanceof Error ? err.message : JSON.stringify(err)}`,
        );
      }
      return;
    }

    setCurrentQuestionId(nextStep.to);
  };

  const submitFinalResultToSupabase = async (
    result: string,
    answers: Record<string, string[]>,
  ) => {
    console.log(`Submitting final result: ${result}`);

    try {
      const { data: user, error: authError } = await supabase.auth.getUser();
      if (authError || !user?.user?.id)
        throw new Error('User not authenticated');

      const user_id = user.user.id;
      console.log(`User ID for result submission: ${user_id}`);

      const { error } = await supabase
        .from('meno_assess_results') // Ensure this matches the actual table name in Supabase
        .insert([{ user_id, result, answers: JSON.stringify(answers) }]);

      if (error) {
        console.error('Supabase insert error:', error);
        throw new Error(`Supabase insert failed: ${error.message}`);
      }

      console.log(`Final result ${result} submitted successfully.`);
      resetAnswers();
    } catch (err) {
      console.error(`Failed to submit result:`, err);
      setSubmitError(
        `Failed to submit result: ${err instanceof Error ? err.message : JSON.stringify(err)}`,
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
