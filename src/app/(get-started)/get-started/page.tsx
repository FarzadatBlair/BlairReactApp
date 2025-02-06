import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import GetStarted from '@components/GetStarted';



export default async function GetStartedPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  const checkUserExists = async () => {
    const { data: user, error } = await supabase.auth.getUser();
    if (error || !user?.user) return false; // No authenticated user

    const { data, error: queryError } = await supabase
      .from('users')
      .select('user_id')
      .eq('user_id', user.user.id)
      .single();

    return !!data; // True if user exists
  };

  if (error || !data?.user) {
    redirect('/sign-in');
  }
  
  const userExists = await checkUserExists();
  if (userExists) {
    console.log("User exists in public.users");
    redirect('/');
  }else{
    console.log("wtf");
  }

  


  return <GetStarted />;
}
