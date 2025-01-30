import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs/promises';
import path from 'path';
import { Question } from '@/types/question';

// Load environment variables
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error('Missing Supabase environment variables. Check .env file.');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const QUESTIONS_FILE_PATH = path.join(
  process.cwd(),
  'public/data/questions.json',
);

const syncQuestionsToSupabase = async () => {
  try {
    // Read questions.json
    const jsonData = await fs.readFile(QUESTIONS_FILE_PATH, 'utf-8');
    const questions: Question[] = JSON.parse(jsonData);

    for (const question of questions) {
      // Check if the question already exists in Supabase
      const { data: existing, error: fetchError } = await supabase
        .schema('menopause_assessment')
        .from('questions')
        .select('id')
        .eq('title', question.title)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error(`Error fetching question: ${fetchError.message}`);
        continue;
      }

      if (existing) {
        // If the question exists, update it
        await supabase
          .from('questions')
          .update({
            category: question.category,
            description: question.description,
            type: question.type,
            options: question.options,
          })
          .eq('id', existing.id);
      } else {
        // If the question doesn't exist, insert it
        await supabase.from('questions').insert([question]);
      }
    }

    console.log('✅ Questions synced successfully.');
  } catch (error) {
    console.error('❌ Error syncing questions:', error);
  }
};

// Run the sync
syncQuestionsToSupabase();
