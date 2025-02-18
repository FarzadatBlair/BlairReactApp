'use client';
import React, { useEffect, useState } from 'react';
import HWQuestionPage from '@components/HWQuestionPage';
import questions from '@data/health_wellness_questions.json';
import { useRouter } from 'next/navigation';
import { supabase } from '@utils/supabase/supabase';
import { fetchHealthWellnessQuestions } from '@/utils/fetchHWQuestions';
import { HealthWellnessQuestion } from '@/types/HWquestion';

const HealthWellnessAssessment: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<{
    [key: string]: string | string[];
  }>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const router = useRouter();

  const currentQuestion = questions[currentIndex];

  const handleContinue = async (answer: string | string[]) => {
    setResponses((prev) => ({
      ...prev,
      [currentQuestion.column]: answer,
    }));

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Submit to Supabase after last question
      try {
        // const user = await supabase.auth.getUser();
        // const { data, error } = await supabase
        //   .from('users')
        //   .update(responses)
        //   .eq('user_id', user.data.user?.id);

        if (error) {
          setSubmitError('Error submitting responses. Please try again.');
        } else {
          router.push('/home'); // Redirect after completion
        }
      } catch (err) {
        setSubmitError('An unexpected error occurred.');
      }
    }
  };

  return (
    <div>
      {submitError && <div className="mt-4 text-error-500">{submitError}</div>}
      {currentQuestion && (
        <HWQuestionPage
          title={currentQuestion.title}
          description={currentQuestion.description}
          type={currentQuestion.type}
          options={currentQuestion.options}
          info={currentQuestion.info}
          unitType={
            currentQuestion.column === 'weight'
              ? 'weight'
              : currentQuestion.column === 'height'
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
