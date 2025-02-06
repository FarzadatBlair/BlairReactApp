import React from 'react';
import { createClient } from '@/utils/supabase/server';
import QuestionsPage from './QuestionsPage';
import { redirect } from 'next/navigation';

export default async function QuestionsPageFile(){
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect('/sign-in');
  }

  return <QuestionsPage/>;
} 
