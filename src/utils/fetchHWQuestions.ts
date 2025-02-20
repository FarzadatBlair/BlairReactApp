import {
  HealthWellnessQuestion,
  RawHealthWellnessQuestion,
  parseHealthWellnessQuestions,
} from '@/types/HWquestion';

const data = '/data/health_wellness_questions.json';

export const fetchHealthWellnessQuestions = async (
  mockDelay = 100,
): Promise<HealthWellnessQuestion[]> => {
  try {
    // Simulate latency
    await new Promise((resolve) => setTimeout(resolve, mockDelay));

    // Fetch JSON data
    const response = await fetch(data);
    if (!response.ok) {
      throw new Error('Failed to fetch health wellness questions');
    }

    const rawQuestions: RawHealthWellnessQuestion[] = await response.json();
    return parseHealthWellnessQuestions(rawQuestions);
  } catch (error) {
    console.error('❌ Error in fetchHealthWellnessQuestions:', error);
    throw new Error('Failed to fetch mock health wellness questions');
  }
};
