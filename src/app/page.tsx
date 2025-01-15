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
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      //! do something with data
      console.log(data);
      console.log(error);

      if (error) {
        if (error.message === 'Invalid login credentials') {
          setError('The email and/or password is incorrect.');
        } else {
          setError(error.message);
        }
      } else {
        router.push('/success'); // Navigate to the success page
      }
    } catch (err) {
      setError(`An unexpected error occurred. ${err}`); // Catch unexpected errors
    }
  };

  return (
    <GenericPage bgCol="secondary" className="pt-20">
      <div className="mb-10 flex flex-1 flex-col space-y-6">
        {/* Welcome Text */}
        <div className="">
          <h1 className="text-primary-900">
            Welcome to <span className="italic text-white">Blair</span>
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
              <Button>Create an account</Button>
              <div className="text-center text-primary-900">
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
            <div className="">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-secondary-100 w-full rounded-lg px-4 py-2 text-primary-900 placeholder-primary-900/50"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-secondary-100 mt-4 w-full rounded-lg px-4 py-2 text-primary-900 placeholder-primary-900/50"
              />
              {error && <p className="text-error mt-2">{error}</p>}{' '}
              {/* Error message */}
              <Button onClick={handleLogin} className="mt-6">
                Continue
              </Button>
              <div className="mt-4 px-8 text-center text-primary-900">
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

export default Splash;
