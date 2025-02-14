import { supabase } from './supabase/supabase';
import { HealthWellnessQuestion, Options } from '@/types/HWquestion';

export const fetchHealthWellnessQuestions = async (
  mockDelay = 100,
): Promise<HealthWellnessQuestion[]> => {
  try {
    // 1. Fetch question IDs from Supabase
    const { data: questionsData, error: questionsError } = await supabase
      .schema('medical_profile')
      .from('questions') // ✅ Updated table name
      .select('id');

    if (questionsError) {
      console.error(
        '❌ Error fetching health wellness questions:',
        questionsError,
      );
      throw new Error('Failed to fetch questions');
    }

    // 2. Fetch options data
    const { data: optionsData, error: optionsError } = await supabase
      .schema('medical_profile')
      .from('question_options') // Assuming options table exists
      .select('question_id, sequence, label, special')
      .order('question_id', { ascending: true })
      .order('sequence', { ascending: true });

    if (optionsError) {
      console.error('❌ Error fetching health wellness options:', optionsError);
      throw new Error('Failed to fetch options');
    }

    // 3. Fetch JSON data
    const response = await fetch('/data/health_wellness_questions.json'); // ✅ Updated file name
    if (!response.ok)
      throw new Error('Failed to fetch health_wellness_questions.json');

    const cmsQuestions: HealthWellnessQuestion[] = await response.json();

    // Simulate latency
    await new Promise((resolve) => setTimeout(resolve, mockDelay));

    // 4. Merge CMS Data with Supabase Data
    const enrichedQuestions: Question[] = questionsData
      .map(({ id }) => {
        const cmsQuestion = cmsQuestions.find((q) => q.id === id);

        if (!cmsQuestion) {
          console.warn(
            `⚠️ Health Wellness Question ID ${id} not found in CMS. Skipping.`,
          );
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
          type: cmsQuestion.type as 'NUM' | 'MS' | 'MC' | 'list-text',
          options: linkedOptions,
          column: cmsQuestion.column,
        };
      })
      .filter(Boolean) as Question[];

    return enrichedQuestions;
  } catch (error) {
    console.error('❌ Error in fetchHealthWellnessQuestions:', error);
    throw new Error('Failed to fetch and merge health wellness questions');
  }
};
