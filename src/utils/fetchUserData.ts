import { supabase } from '@/utils/supabase/supabase';
import { User } from '@/types/user';

export const fetchUserData = async (): Promise<User> => {
  try {
    // Get the authenticated user
    const { data: authData, error: authError } = await supabase.auth.getUser();

    if (authError || !authData?.user) {
      throw new Error('User not authenticated');
    }

    const userId = authData.user.id;

    // Fetch user profile from the public.users table
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('first_name, last_name, dob, sex, address, province')
      .eq('user_id', userId)
      .single();

    if (profileError) {
      throw new Error(profileError.message);
    }

    if (!userProfile) {
      throw new Error('User profile not found');
    }

    // Convert `dob` from string to Date object
    return {
      ...userProfile,
      dob: new Date(userProfile.dob), // Convert string to Date
    };
  } catch (err) {
    console.error(
      'Error fetching user data:',
      err instanceof Error ? err.message : err,
    );
    throw err;
  }
};
