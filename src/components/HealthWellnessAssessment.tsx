'use client';

import React, { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
import { fetchHealthWellnessQuestions } from '@/utils/fetchHWQuestions';
import { useQuestionStore } from '@/store/useQuestionStore';

import HWQuestionPage from '@components/HWQuestionPage';
import flowData from '@data/health_wellness_flow.json';
import { getNextStep } from '@/utils/flowHWManager';
import { HealthWellnessQuestion, FlowStep } from '@/types/HWquestion';

const HealthWellnessAssessment: React.FC = () => {
  // State management
  const [questions, setQuestions] = useState<HealthWellnessQuestion[]>([]);
  const [currentQuestionId, setCurrentQuestionId] = useState<string | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Flow data
  const flow = flowData as FlowStep[];
  // const router = useRouter();

  // Zustand store
  // TODO: create a separate store for health wellness questions
  const { setAnswer, resetAnswers } = useQuestionStore();

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const parsedQuestions: HealthWellnessQuestion[] =
          await fetchHealthWellnessQuestions();
        setQuestions(parsedQuestions);

        console.log('QUESTION DATA:', parsedQuestions);

        // Find the start question in the flow
        const startStep = flow.find((step) => step['is-start']);
        if (!startStep) throw new Error('No start question found!');

        setCurrentQuestionId(startStep.to);
      } catch (err: unknown) {
        if (err instanceof Error)
          setError(`Failed to load questions: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleContinue = async (answer: string[] | string) => {
    if (isSubmitting || !currentQuestionId) return;

    setSubmitError(null);
    setIsSubmitting(true);

    const selectedAnswers = Array.isArray(answer) ? answer : [answer];
    console.log(
      `Handling question: ${currentQuestionId}, answers:`,
      selectedAnswers,
    );

    setAnswer(currentQuestionId, selectedAnswers);
    const updatedAnswers = useQuestionStore.getState().answers;
    console.log('Updated answers state:', updatedAnswers);

    if (!Array.isArray(questions)) {
      console.error('Error: `questions` is not an array!', questions);
      setSubmitError('Internal error: Unable to process questions.');
      setIsSubmitting(false);
      return;
    }

    const nextStep = getNextStep(
      flowData,
      questions,
      currentQuestionId,
      selectedAnswers,
    );
    if (!nextStep) {
      setSubmitError(
        `Error: No valid next step found from ${currentQuestionId}`,
      );
      console.log(`No valid next step from ${currentQuestionId}`);
      setIsSubmitting(false);
      return;
    }

    if (nextStep['is-end']) {
      console.log('Reached final step.', updatedAnswers);
      setIsSubmitting(false);
      resetAnswers();
      return;
    }

    setCurrentQuestionId(nextStep.to);
    setIsSubmitting(false);
  };

  const currentQuestion = questions.find((q) => q.id === currentQuestionId);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-error-500">{error}</div>;

  return (
    <div className="w-full">
      {submitError && <div className="mt-4 text-error-500">{submitError}</div>}
      {currentQuestion && (
        <HWQuestionPage
          title={currentQuestion.title || ''}
          description={currentQuestion.description}
          type={currentQuestion.type || 'MC'}
          options={currentQuestion.options || []}
          info={currentQuestion.info}
          unitType={
            ['weight', 'height'].includes(currentQuestion.unitType ?? '')
              ? currentQuestion.unitType
              : undefined
          }
          onContinue={handleContinue}
          disabled={false}
        />
      )}
    </div>
  );
};

export default HealthWellnessAssessment;
