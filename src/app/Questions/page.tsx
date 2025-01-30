'use client';
import React, { useEffect, useState } from 'react';
import QuestionPage from '@components/QuestionPage';
import { fetchQuestions } from '@/utils/fetchQuestions';
import { Question } from '@/types/question';

const QuestionsPage: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]); // Use Question[] for proper typing
  const [currentIndex, setCurrentIndex] = useState(0); // Track the current question index
  const [answers, setAnswers] = useState<Record<number, any>>({}); // Store answers for all questions
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState<string | null>(null); // Track error state

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const data: Question[] = await fetchQuestions(); // Ensure fetched data matches the Question type
        setQuestions(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load questions. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, []);

  const handleContinue = (answer: any) => {
    // Save the answer for the current question
    setAnswers((prev) => ({
      ...prev,
      [currentIndex]: answer,
    }));

    // Move to the next question or handle the end of the questionnaire
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      console.log('All questions completed', answers);
      // Handle final submission logic here, e.g., send answers to an API
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!questions.length) {
    return <div>No questions available.</div>;
  }

  const currentQuestion = questions[currentIndex];

  return (
    <QuestionPage
      title={currentQuestion.title}
      desc={currentQuestion.desc}
      type={currentQuestion.type}
      options={currentQuestion.options}
      specialField={currentQuestion.specialField}
      otherField={currentQuestion.otherField}
      onContinue={handleContinue}
    />
  );
};

export default QuestionsPage;
