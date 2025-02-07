import resultsData from '@data/results.json';
import { Result } from '@/types/results';

export const fetchResults = async (
  resultId: string,
): Promise<Result | null> => {
  return new Promise((resolve) => {
    setTimeout(
      () => {
        const result = resultsData.find((r) => r.id === resultId) || null;
        resolve(result);
      },
      Math.random() * 50 + 100,
    ); // Simulated delay between 100-150ms
  });
};
