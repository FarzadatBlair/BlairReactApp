'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

import { login } from '@/utils/actions';

import welcomeImage from '@img/splashImage.jpeg';

import GenericPage from '@components/layout/GenericPage';
import Button from '@components/common/Button';
import ButtonLink from '@/components/common/ButtonLink';
import Input from '@components/common/Input';

//TODO: HAVE THIS PAGE GO IN A /welcome ROUTE AND AUTO REDIRECT TO HOME PAGE IF LOGGED IN, NEEDS SERVER COMPONENT CHECK

const WelcomePage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string>('');
  const router = useRouter();

  const handleLogin = async () => {
    setError(''); // Clear any previous errors
    const result = await login({ email, password });

    if (!result.success) {
      if (result.error === 'Invalid login credentials') {
        setError('The email and/or password is incorrect.');
      } else {
        setError(result.error || 'An unexpected error occurred.');
      }
    } else {
      router.push('/get-started');
    }
  };

  return (
    <GenericPage bgCol="secondary" className="pt-20">
      <div className="mb-10 flex flex-1 flex-col space-y-6">
        {/* Welcome Text */}
        <div className="">
          <h1 className="mb-2">
            Welcome to <span className="italic text-secondary-500">Blair</span>
          </h1>
          <p className="text-primary-900">
            Your partner in navigating midlife and beyond.
          </p>
        </div>

        {/* Graphic */}
        <div className="my-24">
          <Image src={welcomeImage} alt="Illustration" className="w-full" />
        </div>

        {/* Conditional Rendering */}
        <div className="flex w-full flex-col">
          {!isLogin ? (
            // Signup View
            <div className="space-y-4">
              <Button onClick={() => router.push('/create-account')}>
                Create an account
              </Button>
              <div className="text-center text-primary-900">
                Already registered?{' '}
                <ButtonLink onClick={() => setIsLogin(true)}>Log in</ButtonLink>
              </div>
            </div>
          ) : (
            // Login View
            <div className="">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                color="secondary"
                className="mt-4"
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                color="secondary"
                className="mt-4"
              />
              {error && <p className="mt-2 text-error">{error}</p>}{' '}
              {/* Error message */}
              <Button onClick={handleLogin} className="mt-6">
                Continue
              </Button>
              <div className="mt-4 px-8 text-center text-primary-900">
                <Link href="/reset-password" className="font-bold underline">
                  Forgot Password
                </Link>{' '}
                |{' '}
                <ButtonLink onClick={() => setIsLogin(false)}>
                  Create Account
                </ButtonLink>
              </div>
            </div>
          )}
        </div>
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
