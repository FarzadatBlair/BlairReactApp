'use client';
import React, { useState } from 'react';
import { supabase } from '@utils/supabase/supabase';
import { useRouter } from 'next/navigation'; // Import Next.js router

import GenericPage from '@components/layout/GenericPage';
import Button from '@components/common/Button';
import Input from '@components/common/Input';

const ChangePassword = () => {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter(); // Next.js router for navigation

  const handlePasswordChange = async () => {
    setMessage('');
    setError('');

    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        setError('Failed to update password: ' + error.message);
      } else {
        setMessage('Password updated successfully!');
        setSubmitted(true);
      }
    } catch (err) {
      setError(`An unexpected error occurred. ${err}`);
    }
  };

  return (
    <GenericPage className="justify-center text-primary-900">
      {!submitted ? (
        <div className="flex flex-col">
          <h1 className="mb-2">Enter a new password</h1>
          <p>Please enter a new password.</p>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter a new password"
            className="mt-4"
          />
          <Button onClick={handlePasswordChange} className="mt-6">
            Set new password
          </Button>
          {message && <p className="mt-4 text-green-600">{message}</p>}
          {error && <p className="mt-4 text-error">{error}</p>}
        </div>
      ) : (
        <div className="flex flex-col">
          <h1 className="mb-2">Password reset complete</h1>
          <p>Sign in using your new password.</p>
          <Button
            onClick={() => router.push('./')} // Adjust the route as needed
            className="mt-6"
          >
            Back to sign in
          </Button>
        </div>
      )}
    </GenericPage>
  );
};

export default ChangePassword;
