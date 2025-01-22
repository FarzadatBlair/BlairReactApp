'use client';
import React, { useState } from "react";
import questions from "./questions.json"; // Import the JSON file with questions
import QuestionPage from "./QuestionPage"; // Import the QuestionPage component
import GenericPage from '@components/layout/GenericPage';

const QuestionsPage: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0); // Track the current question index
  const [answers, setAnswers] = useState<Record<number, any>>({}); // Store answers for all questions

  // Get the current question based on the index
  const currentQuestion = questions[currentIndex];

  // Handle the "Continue" button click
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
      console.log("All questions completed", answers);
      // Handle final submission logic here, e.g., send answers to an API
    }
  };

  return (
    <GenericPage className="flex flex-col">
      {/* Render the current question */}
      <QuestionPage
        title={currentQuestion.title}
        desc={currentQuestion.desc}
        type={currentQuestion.type as "multiple_choice" | "multi_select"}
        options={currentQuestion.options}
        specialField={currentQuestion.specialField}
        otherField={currentQuestion.otherField}
        onContinue={handleContinue} // Pass the handler for the "Continue" button
      />
          </GenericPage>
  );
};

export default QuestionsPage;
