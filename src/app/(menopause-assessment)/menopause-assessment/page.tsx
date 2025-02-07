import React from 'react';
import { createClient } from '@/utils/supabase/server';
import MenopauseAssessment from '@/components/MenopauseAssessment';
import { redirect } from 'next/navigation';

export default async function MenopauseAssessmentPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect('/sign-in');
  }

  return <MenopauseAssessment />;
}
