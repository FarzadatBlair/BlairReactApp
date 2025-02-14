import React from 'react';
import { createClient } from '@/utils/supabase/server';
import MedicalProfileQuestions from '@/components/HealthWellnessQuestions';
import { redirect } from 'next/navigation';

export default async function HealthAndWellnessPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect('/sign-in');
  }

  return <MedicalProfileQuestions />;
}
