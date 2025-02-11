import { supabase } from '@utils/supabase/supabase';
import { fetchResults } from '@utils/fetchResults';
import { Result } from '@/types/results';

export const fetchLatestResult = async (): Promise<Result | null> => {
  try {
    const { data: user, error: authError } = await supabase.auth.getUser();
    if (authError || !user?.user?.id) throw new Error('User not authenticated');

    const user_id = user.user.id;

    // Get the latest menopause assessment for the user
    const { data: latestAssessment, error: fetchError } = await supabase
      .schema('menopause_assessment')
      .from('assess_results_user')
      .select('result_id')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        throw new Error('No assessment found.');
      }
      throw fetchError;
    }

    if (!latestAssessment?.result_id) {
      throw new Error('No assessment result found.');
    }

    const resultId = latestAssessment.result_id;
    console.log(`User ${user_id} latest result ID: ${resultId}`);

    // Fetch the result details
    const fetchedResult = await fetchResults(resultId);
    if (!fetchedResult) {
      throw new Error(`Invalid result ID: ${resultId}`);
    }

    return fetchedResult;
  } catch (err) {
    // console.error('Error fetching latest result:', err);
    throw err;
  }
};
