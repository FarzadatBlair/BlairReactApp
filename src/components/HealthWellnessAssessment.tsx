'use client';

import React, { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
import { fetchHealthWellnessQuestions } from '@/utils/fetchHWQuestions';
import { useQuestionStore } from '@/store/useQuestionStore';
import { supabase } from '@utils/supabase/supabase';
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
      await submitUserResponses(updatedAnswers);
      setIsSubmitting(false);
      resetAnswers();
      return;
    }

    setCurrentQuestionId(nextStep.to);
    setIsSubmitting(false);
  };

  const submitUserResponses = async (answers: Record<string, string[]>) => {
    try {
      // Get the current user's ID
      const { data: user, error: authError } = await supabase.auth.getUser();
      if (authError || !user?.user?.id)
        throw new Error('User not authenticated');

      const user_id = user.user.id;
      console.log(`User ID for submission: ${user_id}`);

      // Iterate through each answer
      for (const [questionId, answer] of Object.entries(answers)) {
        // Find question metadata from the questions JSON
        const question = questions.find((q) => q.id === questionId);
        if (!question) {
          console.warn(
            `Question ID ${questionId} not found in questions JSON.`,
          );
          continue;
        }

        const { type, table, column } = question;

        // Handle each type of question
        if (type === 'NUM') {
          // For numerical answers, take the value and insert into the appropriate table/column
          const numericValue = parseFloat(answer[0]);
          if (isNaN(numericValue)) {
            console.warn(`Invalid numeric value for question ${questionId}.`);
            continue;
          }

          await supabase
            .from(table)
            .upsert([{ user_id, [column]: numericValue }], {
              onConflict: 'user_id',
            });
        } else if (type === 'MC') {
          // For single-choice answers, look up the condition_id from the lookup table
          const { data: conditionData, error: conditionError } = await supabase
            .schema('lookup')
            .from('condition')
            .select('condition_id')
            .eq('name', answer[0])
            .single();

          if (conditionError || !conditionData) {
            console.warn(
              `Condition not found for answer ${answer[0]} in question ${questionId}.`,
            );
            continue;
          }

          await supabase
            .from(table)
            .upsert([{ user_id, [column]: conditionData.condition_id }], {
              onConflict: 'user_id',
            });
        } else if (type === 'MS') {
          // For multi-select answers, insert multiple entries
          for (const item of answer) {
            const { data: conditionData, error: conditionError } =
              await supabase
                .schema('lookup')
                .from('condition')
                .select('condition_id')
                .eq('name', item)
                .single();

            if (conditionError || !conditionData) {
              console.warn(
                `Condition not found for answer ${item} in question ${questionId}.`,
              );
              continue;
            }

            await supabase
              .from(table)
              .insert([{ user_id, [column]: conditionData.condition_id }]);
          }
        } else {
          console.warn(
            `Unsupported question type ${type} for question ${questionId}.`,
          );
        }
      }

      console.log('All answers submitted successfully!');
    } catch (err) {
      console.error('Error submitting user responses:', err);
    }
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
