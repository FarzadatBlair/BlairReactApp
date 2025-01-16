'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // Import Next.js router
import { supabase } from '../../utils/supabase';

import GenericPage from '@components/layout/GenericPage';
import Button from '@components/common/Button';

const ResetPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter(); // Next.js router for navigation

  const handleResetPassword = () => {
    supabase.auth.resetPasswordForEmail(email);
    console.log(`Password reset email sent to: ${email}`);
    setSubmitted(true);
  };

  return (
    <GenericPage className="justify-center text-primary-900">
      {!submitted ? (
        <div className="flex flex-col">
          <h1 className="mb-2">Reset your password</h1>
          <p>
            Enter the email associated with your Blair account to receive a
            password reset link.
          </p>

          <div className="mt-6 flex flex-col space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="mt-4 w-full rounded-lg border-2 border-primary-200 px-4 py-2 text-primary-900 placeholder-primary-900/50"
            />
            <Button onClick={handleResetPassword}>Reset password</Button>
            <button
              onClick={() => router.push('./')}
              className="font-bold underline"
            >
              Go back
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col">
          <h1 className="mb-2">Reset email sent</h1>
          <p className="">
            We&apos;ve sent an email with instructions to reset your password to{' '}
            <span className="font-bold">{email}</span>.
          </p>
          <p className="mt-4">
            It may take a couple of minutes to arrive. Make sure to check your
            spam folder!
          </p>
          <Button onClick={() => router.push('./')} className="mt-6">
            Back to log in
          </Button>
        </div>
      )}
    </GenericPage>
  );
};

export default ResetPassword;
