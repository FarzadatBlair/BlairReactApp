import { Question } from '@/types/question';

export const fetchQuestions = async (): Promise<Question[]> => {
  const minDelay = 100; // Minimum delay in milliseconds
  const maxDelay = 500; // Maximum delay in milliseconds

  // Simulate network delay
  const delay = Math.random() * (maxDelay - minDelay) + minDelay;

  await new Promise((resolve) => setTimeout(resolve, delay)); // Delay for the simulated time

  // Fetch questions from the JSON file
  const res = await fetch('/data/questions.json');
  if (!res.ok) {
    throw new Error('Failed to fetch questions');
  }
  return res.json();
};
