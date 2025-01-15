'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // Import Next.js router
import {supabase} from '../../utils/supabase';

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
    <div className="flex flex-col items-center justify-center min-h-screen bg-100">
      {!submitted ? (
        <div className="w-full max-w-md p-6 rounded-md">
          <h2 className="text-brown">Reset your password</h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter the email associated with your Blair account to receive a password reset link.
          </p>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full mt-4 p-3 border border-gray-300 rounded-lg"
          />
          <button
            onClick={handleResetPassword}
            className="w-full mt-4 py-3 bg-brown-700 text-white rounded-full font-bold"
          >
            Reset password
          </button>
          <button
            onClick={() => router.push('./')}
            className="mt-4 text-sm text-brown-600 underline"
          >
            Go back
          </button>
        </div>
      ) : (
        <div className="w-full max-w-md p-6 rounded-md">
          <h1 className="text-brown-700">Reset email sent</h1>
          <p className="mt-2 text-sm text-gray-600">
            We’ve sent an email with instructions to reset your password to{' '}
            <span className="font-semibold">{email}</span>.
          </p>
          <p className="mt-2 text-sm text-gray-600">
            It may take a couple of minutes to arrive. Make sure to check your spam folder!
          </p>
          <button
            onClick={() => router.push('./')}
            className="w-full mt-4 py-3 bg-brown-700 text-white rounded-full font-bold"
          >
            Back to log in
          </button>
        </div>
      )}
    </div>
  );
};

export default ResetPassword;
