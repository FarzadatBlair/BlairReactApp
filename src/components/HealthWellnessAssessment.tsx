'use client';
import React, { useEffect, useState } from 'react';
import HWQuestionPage from '@components/HWQuestionPage';
import QuestionsJson from '@data/health_wellness_questions.json';
import { useRouter } from 'next/navigation';
import { supabase } from '@utils/supabase/supabase';
// import { fetchHealthWellnessQuestions } from '@/utils/fetchHWQuestions';
import {
  HealthWellnessQuestion,
  FlowStep,
  parseHealthWellnessQuestions,
} from '@/types/HWquestion';
import flowData from '@data/health_wellness_flow.json';
import { useQuestionStore } from '@/store/useQuestionStore';
import { getNextStep } from '@/utils/flowHWManager';

const HealthWellnessAssessment: React.FC = () => {
  const [questions, setQuestions] = useState<HealthWellnessQuestion[]>([]);
  const [currentQuestionId, setCurrentQuestionId] = useState<string | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const flow = flowData as unknown as FlowStep[];
  const router = useRouter();

  const { setAnswer, resetAnswers } = useQuestionStore();

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const data: HealthWellnessQuestion[] =
          parseHealthWellnessQuestions(QuestionsJson);
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

  const handleContinue = async (answer: string[] | string) => {
    // Ensure answer is always treated as an array
    const selectedAnswers = Array.isArray(answer) ? answer : [answer];

    if (isSubmitting || !currentQuestionId) return;
    setSubmitError(null);
    setIsSubmitting(true);

    console.log(
      `Handling continue for question: ${currentQuestionId}, selected answers:`,
      selectedAnswers,
    );

    setAnswer(currentQuestionId, selectedAnswers);
    const updatedAnswers = useQuestionStore.getState().answers;
    console.log(`Updated answers state:`, updatedAnswers);

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
      console.log(`No valid next step found from ${currentQuestionId}`);
      setIsSubmitting(false);
      return;
    }

    if (nextStep['is-end']) {
      console.log(`Reached final step.`);
      console.log('Final answers:', updatedAnswers);

      setIsSubmitting(false);
      return;
    }

    setCurrentQuestionId(nextStep.to);
    setIsSubmitting(false);
  };

  return (
    <div>
      {submitError && <div className="mt-4 text-error-500">{submitError}</div>}
      {currentQuestionId && questions.length > 0 && (
        <HWQuestionPage
          title={questions.find((q) => q.id === currentQuestionId)?.title || ''}
          description={
            questions.find((q) => q.id === currentQuestionId)?.description
          }
          type={questions.find((q) => q.id === currentQuestionId)?.type || 'MC'}
          options={
            questions.find((q) => q.id === currentQuestionId)?.options || []
          }
          info={questions.find((q) => q.id === currentQuestionId)?.info}
          unitType={
            questions.find((q) => q.id === currentQuestionId)?.unitType ===
            'weight'
              ? 'weight'
              : questions.find((q) => q.id === currentQuestionId)?.unitType ===
                  'height'
                ? 'height'
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
