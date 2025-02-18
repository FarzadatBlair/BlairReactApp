'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

import { loginOTP, verifyOTP } from '@/utils/actions';

import welcomeImage from '@img/splashImage.jpeg';

import GenericPage from '@components/layout/GenericPage';
import Button from '@components/common/Button';
import Input from '@components/common/Input';
import ButtonLink from '@/components/common/ButtonLink';

const WelcomePage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string>('');
  const [inputError, setInputError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const SUPABASE_TOKEN_ERROR_MESSAGE = 'Token has expired or is invalid';
  const otpRegex = /^\d{6}$/;

  const router = useRouter();

  // Handle countdown timer for OTP resend
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOtpSent && countdown > 0) {
      timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
    } else if (countdown === 0) {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [isOtpSent, countdown]);

  const handleSendOTP = async () => {
    setError('');
    if (isOtpSent) {
      setIsResending(true);
    } else {
      setIsLoading(true);
    }

    const result = await loginOTP(email);

    setIsLoading(false);
    setIsResending(false);

    if (!result.success) {
      setError(result.error || 'An unexpected error occurred.');
    } else {
      setIsOtpSent(true);
      setCountdown(60);
      setCanResend(false);
    }
  };

  const handleVerifyOTP = async () => {
    setError('');
    setIsLoading(true);

    const result = await verifyOTP(email, otp);

    setIsLoading(false);

    if (!result.success) {
      if (result.error === SUPABASE_TOKEN_ERROR_MESSAGE) {
        setError('The code entered is wrong or has expired. Please try again.');
      } else {
        setError(result.error || 'An unexpected error occurred.');
      }
    } else {
      router.push('/get-started'); // Redirect after successful login
    }
  };

  const handleOtpBlur = () => {
    if (!otpRegex.test(otp)) {
      setInputError('You must enter a 6-digit code. Example: 123456');
    } else {
      setInputError('');
    }
  };

  return (
    <GenericPage bgCol="secondary" className="pt-20">
      <div className="mb-6 flex flex-1 flex-col space-y-6">
        {/* Welcome Text */}
        <div>
          <h1>
            Welcome to <span className="italic text-secondary-500">Blair</span>
          </h1>
          <p className="mt-2 text-primary-900">
            Your partner in navigating midlife and beyond.
          </p>
        </div>

        {/* Graphic */}
        <div>
          <Image src={welcomeImage} alt="Illustration" className="w-full" />
        </div>

        {/* Email Input Screen */}
        {!isOtpSent ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                color="secondary"
              />
              {error && <p className="text-error">{error}</p>}
            </div>
            <Button onClick={handleSendOTP} disabled={isLoading}>
              Continue
            </Button>
          </div>
        ) : (
          // OTP Verification Screen
          <div className="space-y-4">
            <div className="space-y-2">
              <p>
                A one-time code has been sent to <strong>{email}</strong>.
                Please enter the six-digit code to continue.
              </p>
              <p>
                The email with the code may take a couple minutes to arrive. If
                you still have not received it, check your spam folder or send
                another code.
              </p>
            </div>
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="6-digit code"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                onBlur={handleOtpBlur}
                color="secondary"
                error={!!inputError}
                errorMessage={inputError}
              />
              {error && <p className="mt-2 text-error">{error}</p>}
            </div>
            <Button
              onClick={handleVerifyOTP}
              className="mt-6"
              disabled={isLoading || !otpRegex.test(otp)}
            >
              Confirm Code
            </Button>

            {/* Resend OTP */}
            <div className="text-center text-primary-900">
              {canResend ? (
                <ButtonLink onClick={handleSendOTP}>
                  {isResending ? 'Resending...' : 'Resend Code'}
                </ButtonLink>
              ) : (
                <p>Resend available in {countdown}s</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Terms & Privacy */}
      <div className="mt-auto text-center text-sm text-primary-900">
        By continuing, I agree to Blair&apos;s{' '}
        <Link href="/terms" className="font-bold underline">
          Terms of Service
        </Link>{' '}
        and authorize Blair to receive my medical information. See our{' '}
        <Link href="/privacy" className="font-bold underline">
          Privacy Policy
        </Link>{' '}
        to learn more about our privacy practices.
      </div>
    </GenericPage>
  );
};

export default WelcomePage;
