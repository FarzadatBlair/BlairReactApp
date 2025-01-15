'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // Import Next.js router
import { supabase } from '../../utils/supabase';

const ResetPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter(); // Next.js router for navigation

  const handleResetPassword = () => {
    // Simulate sending reset password email
    // Replace with actual logic using Supabase or your backend
    supabase.auth.resetPasswordForEmail(email);
    console.log(`Password reset email sent to: ${email}`);
    setSubmitted(true);
  };

  return (
    <div className="bg-100 flex min-h-screen flex-col items-center justify-center">
      {!submitted ? (
        <div className="w-full max-w-md rounded-md p-6">
          <h2 className="text-brown">Reset password</h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter the email associated with your Blair account to receive a
            password reset link.
          </p>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="mt-4 w-full rounded-lg border border-gray-300 p-3"
          />
          <button
            onClick={handleResetPassword}
            className="mt-4 w-full rounded-full bg-primary py-3 font-bold text-white"
          >
            Reset password
          </button>
          <button
            onClick={() => console.log('Go back to previous page')}
            className="text-brown-600 mt-4 text-sm underline"
          >
            Go back
          </button>
        </div>
      ) : (
        <div className="w-full max-w-md rounded-md p-6">
          <h1 className="text-2xl font-semibold text-primary-900">
            Reset password
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            We&apos;ve sent an email with instructions to reset your password to{' '}
            <span className="font-semibold">{email}</span>.
          </p>
          <p className="mt-2 text-sm text-gray-600">
            It may take a couple of minutes to arrive. Make sure to check your
            spam folder!
          </p>
          <button
            onClick={() => router.push('./')}
            className="mt-4 w-full rounded-full bg-primary py-3 font-bold text-white"
          >
            Back to log in
          </button>
        </div>
      )}
    </div>
  );
};

export default ResetPassword;
