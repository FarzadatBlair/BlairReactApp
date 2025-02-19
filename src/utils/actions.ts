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

export async function loginOTP(email: string) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithOtp({
    email: email,
    options: {
      shouldCreateUser: true,
    },
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function verifyOTP(email: string, token: string) {
  const supabase = await createClient();

  const {
    // TODO: do something with session, https://supabase.com/docs/guides/auth/auth-email-passwordless?queryGroups=language&language=js#step-2-verify-the-otp-to-create-a-session
    // data: { session },
    error,
  } = await supabase.auth.verifyOtp({
    email,
    token: token,
    type: 'email',
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
