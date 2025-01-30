import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import GetStarted from '@components/GetStarted';

export default async function GetStartedPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect('/create-account');
  }

  return <GetStarted />;
}
