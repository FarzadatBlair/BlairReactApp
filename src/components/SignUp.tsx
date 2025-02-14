'use client';

import React, { useState } from 'react';
import { loginOTP, verifyOTP } from '@/utils/actions';
import GenericPage from '@components/layout/GenericPage';
import Button from '@components/common/Button';
import Link from 'next/link';
import Input from '@components/common/Input';

const SignUp = () => {
  const [email, setEmail] = useState<string>('');
  const [otp, setOtp] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const handleSendOTP = async () => {
    setError('');
    setIsLoading(true);

    const result = await loginOTP(email);

    setIsLoading(false);

    if (!result.success) {
      setError(result.error || 'An unexpected error occurred.');
    } else {
      setOtpSent(true);
    }
  };

  const handleVerifyOTP = async () => {
    setError('');
    setIsLoading(true);

    const result = await verifyOTP(email, otp);

    setIsLoading(false);

    if (!result.success) {
      setError(result.error || 'Invalid or expired OTP.');
    } else {
      setIsSuccess(true);
    }
  };

  return (
    <GenericPage className="flex flex-col text-primary-900">
      {isSuccess ? (
        // Success Message
        <div className="text-center">
          <h1 className="mb-2">You&apos;re signed in!</h1>
          <p>Welcome to Blair. You can now start using your account.</p>
          <div className="mt-4 flex justify-center">
            <Link href={'/'} className="font-bold underline">
              Go to Dashboard
            </Link>
          </div>
        </div>
      ) : otpSent ? (
        // OTP Verification Form
        <>
          <h1 className="mb-2">Enter your verification code</h1>
          <p>
            We&apos;ve sent a one-time code to <b>{email}</b>. Check your inbox.
          </p>
          <div className="mt-4 flex w-full flex-col space-y-4">
            <Input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="6-digit code"
              // maxLength={6}
            />
          </div>
          {error && <p className="mt-2 text-error">{error}</p>}
          <Button
            onClick={handleVerifyOTP}
            className="mt-6"
            disabled={isLoading || otp.length !== 6}
          >
            {isLoading ? 'Verifying...' : 'Confirm Code'}
          </Button>
          <div className="mt-4 flex justify-center">
            <button onClick={handleSendOTP} className="font-bold underline">
              Resend Code
            </button>
          </div>
        </>
      ) : (
        // Email Input Form
        <>
          <h1 className="mb-2">Start your journey with Blair</h1>
          <p>Enter your email to receive a login code.</p>
          <div className="mt-4 flex w-full flex-col space-y-4">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
            />
          </div>
          {error && <p className="mt-2 text-error">{error}</p>}
          <Button onClick={handleSendOTP} className="mt-6" disabled={isLoading}>
            {isLoading ? 'Sending code...' : 'Continue'}
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
