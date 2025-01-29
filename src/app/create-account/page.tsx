import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import SignUp from '@components/SignUp';

export default async function CreateAccountPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (!error && data?.user) {
    redirect('/get-started');
  }

  return <SignUp />;
}
