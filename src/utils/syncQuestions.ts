import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs/promises';
import path from 'path';

// Load environment variables safely
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error('Missing Supabase environment variables. Check .env file.');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Path to questions JSON
const QUESTIONS_FILE_PATH = path.join(
  process.cwd(),
  'public/data/questions.json',
);

// Type Definitions
interface Question {
  id: string;
  category: string;
  title: string;
  type: string;
  options: Option[];
}

interface Option {
  label: string;
  special?: 'free-text' | 'none-above' | 'not-special';
}

const syncQuestionsToSupabase = async () => {
  console.log(`🚀 Starting data synchronization...`);
  const startTime = Date.now();

  try {
    console.log(`📂 Reading questions from file: ${QUESTIONS_FILE_PATH}`);
    const jsonData = await fs.readFile(QUESTIONS_FILE_PATH, 'utf-8');
    const questions: Question[] = JSON.parse(jsonData);
    console.log(`✅ Loaded ${questions.length} questions from JSON file.`);

    // Prepare upsert data for questions
    const questionRecords = questions.map((question) => ({
      id: question.id,
      category: question.category,
      title: question.title,
      type: question.type,
      updated_at: new Date(),
      created_at: new Date(), // `upsert` ensures `created_at` is only set on insert
    }));

    console.log(
      `🔄 Upserting ${questionRecords.length} questions into Supabase...`,
    );
    const { error: questionError } = await supabase
      .schema('menopause_assessment')
      .from('questions')
      .upsert(questionRecords, { onConflict: 'id' });

    if (questionError) {
      throw new Error(`❌ Error upserting questions: ${questionError.message}`);
    }
    console.log(`✅ Questions successfully synced to Supabase.`);

    // Prepare upsert data for question options
    const optionRecords: {
      question_id: string;
      sequence: number;
      label: string;
      special: 'free-text' | 'none-above' | 'not-special';
      updated_at: Date;
      created_at: Date;
    }[] = [];

    console.log(`📦 Processing question options...`);
    questions.forEach((question) => {
      question.options.forEach((option, index) => {
        optionRecords.push({
          question_id: question.id,
          sequence: index + 1, // Ensure sequence is assigned correctly
          label: option.label,
          special: option.special || 'not-special',
          updated_at: new Date(),
          created_at: new Date(),
        });
      });
    });

    console.log(
      `🔄 Upserting ${optionRecords.length} question options into Supabase...`,
    );
    if (optionRecords.length > 0) {
      const { error: optionError } = await supabase
        .schema('menopause_assessment')
        .from('question_options')
        .upsert(optionRecords, { onConflict: 'question_id, label' });

      if (optionError) {
        throw new Error(`❌ Error upserting options: ${optionError.message}`);
      }
    }
    console.log(`✅ Question options successfully synced to Supabase.`);

    const endTime = Date.now();
    console.log(
      `🎉 Sync completed in ${(endTime - startTime) / 1000} seconds.`,
    );
  } catch (error) {
    console.error('❌ Error syncing data:', error);
    process.exit(1); // Ensure the script exits on failure
  }
};

// Run the sync function
syncQuestionsToSupabase();
