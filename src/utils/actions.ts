'use server';

import { createClient } from '@/utils/supabase/server';

interface LoginFormData {
  email: string;
  password: string;
}

export async function login(formData: LoginFormData) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: formData.email,
    password: formData.password,
  });

  if (error) {
    return { success: false, error: error.message };
  } else {
    return { success: true, error: null };
  }
}

export async function signup(formData: LoginFormData) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
  });

  if (error) {
    return { success: false, error: error.message };
  } else {
    return { success: true, error: null };
  }
}

export async function logout() {
  const supabase = await createClient();

  await supabase.auth.signOut();
}
