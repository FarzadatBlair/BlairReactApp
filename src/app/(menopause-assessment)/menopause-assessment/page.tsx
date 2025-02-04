'use client';
import React, { useEffect, useState } from 'react';
import QuestionPage from '@components/QuestionPage';
import { fetchQuestions } from '@/utils/fetchQuestions';
import { Question } from '@/types/question';
import { supabase } from '@utils/supabase/supabase';

const QuestionsPage: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null); // Track answer submission errors

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const data: Question[] = await fetchQuestions();
        setQuestions(data);
      } catch (err) {
        setError('Failed to load questions. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, []);

  const handleContinue = async (answer: string[]) => {
    setSubmitError(null);

    try {
      // Get authenticated user
      const { data: user, error: authError } = await supabase.auth.getUser();
      if (authError || !user?.user?.id)
        throw new Error('User not authenticated');

      const user_id = user.user.id;
      const currentQuestion = questions[currentIndex];
      if (!currentQuestion) throw new Error('Invalid question reference');

      // Check if the user already has an assessment entry
      const { data: existingAssessment, error: fetchError } = await supabase
        .schema('menopause_assessment')
        .from('meno_assess_user_master')
        .select('assessment_id')
        .eq('user_id', user_id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw new Error(`Failed to fetch assessment: ${fetchError.message}`);
      }

      let assessment_id = existingAssessment?.assessment_id;
      if (!assessment_id) {
        // Create a new assessment entry if one does not exist
        const { data: newAssessment, error: createError } = await supabase
          .schema('menopause_assessment')
          .from('meno_assess_user_master')
          .insert([
            {
              user_id,
              assessment_id: crypto.randomUUID(), // Generate assessment ID
              master_symptoms: [], // Ensure empty array instead of null
              treatment_status: [],
              treatment_type: [],
              sexual_function_issues: [],
            },
          ])
          .select('assessment_id')
          .single();

        if (createError) throw createError;
        assessment_id = newAssessment.assessment_id;
      }

      // Determine the correct column to update based on question type
      let updatePayload: Record<string, any> = {};

      switch (currentQuestion.id) {
        case 'Q-001': // Diagnosed with POI (Boolean)
          updatePayload.has_poi = answer.includes('Yes');
          break;

        case 'Q-002': // Master symptoms (Multi-select)
          updatePayload.master_symptoms = answer.length > 0 ? answer : [];
          updatePayload.other_symptoms = answer.includes('Other')
            ? answer.find(
                (a) =>
                  a !== 'Other' &&
                  a.trim() !== '' &&
                  !currentQuestion.options.some((opt) => opt.label === a),
              )
            : null;
          break;

        case 'Q-003': // Current treatment status (Multi-select)
          updatePayload.treatment_status = answer.length > 0 ? answer : [];
          break;

        case 'Q-004': // Specific treatment type (Multi-select)
          updatePayload.treatment_type = answer.length > 0 ? answer : [];
          break;

        case 'Q-005': // Sexual function issues (Conditional Multi-select)
          updatePayload.sexual_function_issues =
            answer.length > 0 ? answer : [];
          break;

        default:
          throw new Error('Unexpected question ID');
      }

      // Update the user's assessment entry with the answer
      const { error: updateError } = await supabase
        .schema('menopause_assessment')
        .from('meno_assess_user_master')
        .update(updatePayload)
        .eq('user_id', user_id)
        .eq('assessment_id', assessment_id);

      if (updateError) throw updateError;

      // Move to next question
      setCurrentIndex((prev) =>
        prev < questions.length - 1 ? prev + 1 : prev,
      );
    } catch (err) {
      setSubmitError(
        `Error submitting answer: ${err instanceof Error ? err.message : JSON.stringify(err)}`,
      );
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!questions.length) return <div>No questions available.</div>;

  return (
    <div>
      {submitError && <div className="mt-4 text-red-500">{submitError}</div>}
      <QuestionPage
        title={questions[currentIndex].title}
        description={questions[currentIndex].description}
        type={questions[currentIndex].type}
        options={questions[currentIndex].options}
        onContinue={handleContinue}
      />
    </div>
  );
};

export default QuestionsPage;
