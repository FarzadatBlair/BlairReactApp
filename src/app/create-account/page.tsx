'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../utils/supabase';
// import { User } from '@supabase/supabase-js';

import GenericPage from '@components/layout/GenericPage';
import Button from '@components/common/Button';
import Link from 'next/link';

const GetStarted = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check current auth status
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        router.replace('/get-started');
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        router.replace('/get-started');
      }
    });

    // Cleanup subscription
    return () => subscription.unsubscribe();
  }, [router]);

  const handleSignUp = async () => {
    setError('');
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      } else if (data.user) {
        console.log(data.user);
      }
    } catch (err) {
      setError(`An unexpected error occurred. ${err}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GenericPage className="flex flex-col text-primary-900">
      <h1 className="mb-2">Start your journey with Blair</h1>
      <p>Provide an email to create a Blair account.</p>
      <div className="mt-4 flex w-full flex-col items-center">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full rounded-lg border-2 border-primary-200 px-4 py-2 text-primary-900 placeholder-primary-900/50"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="mt-4 w-full rounded-lg border-2 border-primary-200 px-4 py-2 text-primary-900 placeholder-primary-900/50"
        />
        {error && <p className="text-error mt-2">{error}</p>}
        <Button onClick={handleSignUp} className="mt-6" disabled={isLoading}>
          {isLoading ? 'Creating account...' : 'Continue'}
        </Button>
        <Link href={'/'} className="mt-4 font-bold underline">
          Go back
        </Link>
      </div>
    </GenericPage>
  );
};

export default GetStarted;
