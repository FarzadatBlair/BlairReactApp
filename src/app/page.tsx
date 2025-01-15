'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // Import Next.js router
import Image from 'next/image';
import Link from 'next/link';

import { supabase } from '../utils/supabase';
import welcomeImage from '@img/splashImage.jpeg';

import GenericPage from '@components/GenericPage';
import Button from '@/components/Button';

const Splash: React.FC = () => {
  const [isLogin, setIsLogin] = useState(false); // State to toggle between signup and login views
  const [email, setEmail] = useState(''); // State for email
  const [password, setPassword] = useState(''); // State for password
  const [error, setError] = useState(''); // State for error messages
  const router = useRouter(); // Next.js router for navigation

  const handleLogin = async () => {
    setError(''); // Clear any previous errors
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message); // Display error message
      } else {
        router.push('/success'); // Navigate to the success page
      }
    } catch (_err) {
      //! _err is not used
      setError('An unexpected error occurred. Please try again.'); // Catch unexpected errors
    }
  };

  return (
    <GenericPage bgCol="secondary">
      {/* Welcome Text */}
      <div className="mb-8">
        <h1 className="text-primary-900">
          Welcome to <span className="italic text-white">Blair</span>
        </h1>
        <p className="mt-2 text-primary-900">
          Your partner in navigating midlife and beyond.
        </p>
      </div>

      {/* Graphic */}
      <div className="mb-10">
        <Image src={welcomeImage} alt="Illustration" className="h-auto w-80" />
      </div>

      {/* Conditional Rendering */}
      {!isLogin ? (
        // Signup View
        <div className="flex w-3/4 max-w-md flex-col space-y-4">
          <Button>Create an account</Button>
          <div className="mt-10 px-8 text-center text-sm text-primary-900">
            Already registered?{' '}
            <button
              onClick={() => setIsLogin(true)}
              className="font-bold underline"
            >
              Log in
            </button>
          </div>
        </div>
      ) : (
        // Login View
        <div className="flex w-3/4 max-w-md flex-col space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-gray-300 p-3"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-gray-300 p-3"
          />
          {error && <p className="text-sm text-red-500">{error}</p>}{' '}
          {/* Error message */}
          <Button onClick={handleLogin}>Continue</Button>
          <div className="mt-10 px-8 text-center text-sm text-primary-900">
            <Link href="/forgot-password" className="font-bold underline">
              Forgot Password
            </Link>{' '}
            |{' '}
            <button
              onClick={() => setIsLogin(false)}
              className="font-bold underline"
            >
              Create Account
            </button>
          </div>
        </div>
      )}

      {/* Terms & Privacy */}
      <div className="mt-10 px-8 text-center text-sm text-primary-900">
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

export default Splash;
