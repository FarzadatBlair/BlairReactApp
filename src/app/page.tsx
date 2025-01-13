'use client'
import React, { useState } from 'react';

const Splash: React.FC = () => {
  const [isLogin, setIsLogin] = useState(false); // State to toggle between signup and login views

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {/* Welcome Text */}
      <div className="text-center mb-8">
        <h1 className="text-brown">
          Welcome to <span className="italic text-white">Blair</span>
        </h1>
        <p className="text-brown mt-2">
          Your partner in navigating midlife and beyond.
        </p>
      </div>

      {/* Graphic */}
      <div className="mb-10">
        <img
          src="./img/splashImage.jpeg" // Replace with the actual path to your image
          alt="Illustration"
          className="w-80 h-auto"
        />
      </div>

      {/* Conditional Rendering */}
      {!isLogin ? (
        // Signup View
        <div className="flex flex-col space-y-4 w-3/4 max-w-md">
          <button className="bg-brown-700 text-white py-3 rounded-full font-bold">
            Create an account
          </button>

          <div className="text-center text-sm text-brown-500 mt-10 px-8">
            Already registered?{' '}
            <button
              onClick={() => setIsLogin(true)}
              className="text-pink-600 underline"
            >
              Log in
            </button>
          </div>
        </div>
      ) : (
        // Login View
        <div className="flex flex-col space-y-4 w-3/4 max-w-md">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
          <button className="bg-brown-700 text-white py-3 rounded-full font-bold">
            Sign in
          </button>
          <div className="text-center text-sm text-brown-500 mt-10 px-8">
            Don't have an account?{' '}
            <button
              onClick={() => setIsLogin(false)}
              className="text-pink-600 underline"
            >
              Sign up
            </button>
          </div>
        </div>
      )}

      {/* Terms & Privacy */}
      <div className="text-center text-sm text-brown-500 mt-10 px-8">
        By continuing, I agree to Blair's{' '}
        <a href="/terms" className="text-pink-600 underline">
          Terms of Service
        </a>{' '}
        and authorize Blair to receive my medical information. See our{' '}
        <a href="/privacy" className="text-pink-600 underline">
          Privacy Policy
        </a>{' '}
        to learn more about our privacy practices.
      </div>
    </div>
  );
};

export default Splash;
