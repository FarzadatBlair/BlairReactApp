'use client';

import React, { useState } from 'react';
import { signup } from '@/utils/actions';
import GenericPage from '@components/layout/GenericPage';
import Button from '@components/common/Button';
import Link from 'next/link';
import Input from '@components/common/Input';

const SignUp = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false); // Track if signup was successful

  const handleSignUp = async () => {
    setError('');
    setIsLoading(true);

    const result = await signup({ email, password });

    setIsLoading(false);

    if (!result.success) {
      setError(result.error || 'An unexpected error occurred.');
    } else {
      setIsSuccess(true); // Mark success to show verification message
    }
  };

  return (
    <GenericPage className="flex flex-col text-primary-900">
      {isSuccess ? (
        // Success Message
        <div className="text-center">
          <h1 className="mb-2">Check your email!</h1>
          <p>
            We’ve sent a verification link to <b>{email}</b>. Please check your
            inbox to complete the sign-up process.
          </p>
          <div className="mt-4 flex justify-center">
            <Link href={'/'} className="font-bold underline">
              Go back
            </Link>
          </div>
        </div>
      ) : (
        // Sign-up Form
        <>
          <h1 className="mb-2">Start your journey with Blair</h1>
          <p>Provide an email to create a Blair account.</p>
          <div className="mt-4 flex w-full flex-col space-y-4">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
            />
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
          </div>
          {error && <p className="mt-2 text-error">{error}</p>}
          <Button onClick={handleSignUp} className="mt-6" disabled={isLoading}>
            {isLoading ? 'Creating account...' : 'Continue'}
          </Button>
          <div className="mt-4 flex justify-center">
            <Link href={'/'} className="font-bold underline">
              Go back
            </Link>
          </div>
        </>
      )}
    </GenericPage>
  );
};

export default SignUp;
