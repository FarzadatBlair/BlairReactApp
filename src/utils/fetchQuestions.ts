import { supabase } from './supabase/supabase';
import { Question } from '@/types/question';

export const fetchQuestions = async (): Promise<Question[]> => {
  const { data, error } = await supabase
    .schema('menopause_assessment')
    .from('questions')
    .select('*');

  if (error) {
    console.error('Error fetching questions:', error);
    throw new Error('Failed to fetch questions');
  }

  return data;
};
