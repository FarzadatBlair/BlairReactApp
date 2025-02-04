import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs/promises';
import path from 'path';

// Load environment variables
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error('Missing Supabase environment variables. Check .env file.');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Path to questions JSON
const QUESTIONS_FILE_PATH = path.join(
  process.cwd(),
  'public/data/questions.json',
);

const syncQuestionsToSupabase = async () => {
  let hasError = false; // Track if any errors occur

  try {
    const jsonData = await fs.readFile(QUESTIONS_FILE_PATH, 'utf-8');
    const questions = JSON.parse(jsonData);

    for (const question of questions) {
      // Check if the question already exists in Supabase
      const { data: existingQuestion, error: fetchError } = await supabase
        .schema('menopause_assessment')
        .from('questions')
        .select('id')
        .eq('id', question.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error(
          `❌ Error fetching question ${question.id}: ${fetchError.message}`,
        );
        hasError = true;
        continue;
      }

      if (existingQuestion) {
        // Update existing question
        const { error: updateError } = await supabase
          .schema('menopause_assessment')
          .from('questions')
          .update({
            category: question.category,
            title: question.title,
            type: question.type,
            updated_at: new Date(),
          })
          .eq('id', existingQuestion.id);

        if (updateError) {
          console.error(
            `❌ Error updating question ${question.id}: ${updateError.message}`,
          );
          hasError = true;
          continue;
        }
      } else {
        // Insert new question
        const { error: insertError } = await supabase
          .schema('menopause_assessment')
          .from('questions')
          .insert([
            {
              id: question.id,
              category: question.category,
              title: question.title,
              type: question.type,
              created_at: new Date(),
              updated_at: new Date(),
            },
          ]);

        if (insertError) {
          console.error(
            `❌ Error inserting question ${question.id}: ${insertError.message}`,
          );
          hasError = true;
          continue;
        }
      }

      // **Assign sequence manually for each question**
      let sequenceNumber = 1;

      // Insert or update options for this question
      for (const option of question.options) {
        const specialValue = option.special as
          | 'free-text'
          | 'none-above'
          | 'not-special';

        const { data: existingOption, error: fetchOptionError } = await supabase
          .schema('menopause_assessment')
          .from('question_options')
          .select('id')
          .eq('question_id', question.id)
          .eq('label', option.label)
          .single();

        if (fetchOptionError && fetchOptionError.code !== 'PGRST116') {
          console.error(
            `❌ Error fetching option for question ${question.id}: ${fetchOptionError.message}`,
          );
          hasError = true;
          continue;
        }

        if (existingOption) {
          // Update existing option
          const { error: updateOptionError } = await supabase
            .schema('menopause_assessment')
            .from('question_options')
            .update({
              special: specialValue,
              updated_at: new Date(),
            })
            .eq('id', existingOption.id);

          if (updateOptionError) {
            console.error(
              `❌ Error updating option for question ${question.id}: ${updateOptionError.message}`,
            );
            hasError = true;
          }
        } else {
          // Insert new option with manually assigned sequence number
          const { error: insertOptionError } = await supabase
            .schema('menopause_assessment')
            .from('question_options')
            .insert([
              {
                question_id: question.id,
                sequence: sequenceNumber, // Assign the correct sequence number manually
                label: option.label,
                special: specialValue,
                created_at: new Date(),
                updated_at: new Date(),
              },
            ]);

          if (insertOptionError) {
            console.error(
              `❌ Error inserting option for question ${question.id}: ${insertOptionError.message}`,
            );
            hasError = true;
          }
        }

        sequenceNumber++; // Increment sequence manually for next option
      }
    }

    if (hasError) {
      console.error('❌ Errors occurred during sync.');
      process.exit(1); // Exit with failure status
    } else {
      console.log('✅ Questions and options synced successfully.');
    }
  } catch (error) {
    console.error('❌ Error syncing questions:', error);
    process.exit(1); // Ensure the script exits on failure
  }
};

// Run the sync function
syncQuestionsToSupabase();
