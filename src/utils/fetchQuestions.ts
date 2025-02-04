import { supabase } from './supabase/supabase';
import { Question, Options } from '@/types/question';

export const fetchQuestions = async (mockDelay = 100): Promise<Question[]> => {
  try {
    // 1. Fetch only question IDs from Supabase
    const { data: questionsData, error: questionsError } = await supabase
      .schema('menopause_assessment')
      .from('questions')
      .select('id'); // Fetch only question IDs

    if (questionsError) {
      console.error('❌ Error fetching questions:', questionsError);
      throw new Error('Failed to fetch questions');
    }

    // 2. Fetch only necessary option data from Supabase
    const { data: optionsData, error: optionsError } = await supabase
      .schema('menopause_assessment')
      .from('question_options')
      .select('question_id, sequence, label, special')
      .order('question_id', { ascending: true })
      .order('sequence', { ascending: true });

    if (optionsError) {
      console.error('❌ Error fetching options:', optionsError);
      throw new Error('Failed to fetch options');
    }

    // 3. Fetch questions.json as a network request (instead of fs)
    const response = await fetch('/data/questions.json'); // Ensure the file is inside the public/ folder
    if (!response.ok) throw new Error('Failed to fetch questions.json');

    const cmsQuestions: Question[] = await response.json();

    // Simulate network latency
    await new Promise((resolve) => setTimeout(resolve, mockDelay));

    // 4. Merge CMS Data with Supabase Data
    const enrichedQuestions: Question[] = questionsData
      .map(({ id }) => {
        const cmsQuestion = cmsQuestions.find((q) => q.id === id);

        if (!cmsQuestion) {
          console.warn(`⚠️ Question ID ${id} not found in CMS. Skipping.`);
          return null;
        }

        const linkedOptions: Options[] = optionsData
          .filter((opt) => opt.question_id === id)
          .map(({ label, special }) => ({
            label,
            special: special as 'free-text' | 'none-above' | 'not-special',
          }));

        return {
          id,
          category: cmsQuestion.category,
          title: cmsQuestion.title,
          description: cmsQuestion.description ?? '',
          type: cmsQuestion.type,
          options: linkedOptions,
        };
      })
      .filter(Boolean) as Question[];

    return enrichedQuestions;
  } catch (error) {
    console.error('❌ Error in fetchQuestions:', error);
    throw new Error('Failed to fetch and merge questions');
  }
};
