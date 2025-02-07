import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import GetStarted from '@components/GetStarted';

export default async function GetStartedPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  // check if user exists in public.users
  const userIsOnboarded = async () => {
    const { data: user, error } = await supabase.auth.getUser();
    if (error || !user?.user) return false; // No authenticated user

    const { data } = await supabase
      .from('users')
      .select('user_id')
      .eq('user_id', user.user.id)
      .single();

    return !!data; // True if user exists
  };

  // check if user is authenticated at all
  if (error || !data?.user) {
    redirect('/sign-in');
  }

  const userOnboarded = await userIsOnboarded();

  if (userOnboarded) {
    console.log('User exists in public.users');
    redirect('/');
  }

  return <GetStarted />;
}
