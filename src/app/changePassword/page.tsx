'use client';
import React, { useState } from "react";
import { supabase } from '../../utils/supabase';
import { useRouter } from 'next/navigation'; // Import Next.js router

const ChangePassword = () => {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter(); // Next.js router for navigation

  const handlePasswordChange = async () => {
    setMessage("");
    setError("");

    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        setError("Failed to update password: " + error.message);
      } else {
        setMessage("Password updated successfully!");
        setSubmitted(true);
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-100">
      {!submitted ? (
        <div className="w-full max-w-md p-6 rounded-md">
          <h1 className="text-brown-700">Enter a new password</h1>
          <p className="mt-2 text-sm text-gray-600">
            Please enter a new password.
          </p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter a new password"
            className="w-full mt-4 p-3 border border-gray-300 rounded-lg"
          />
          <button
            onClick={handlePasswordChange}
            className="w-full mt-4 py-3 bg-brown-700 text-white rounded-full font-bold"
          >
            Set new password
          </button>
          {message && <p className="text-green-600 mt-4">{message}</p>}
          {error && <p className="text-red-600 mt-4">{error}</p>}
        </div>
      ) : (
        <div className="w-full max-w-md p-6 rounded-md text-center">
          <h1 className="text-brown-700">Password reset complete</h1>
          <p className="mt-2 text-sm text-gray-600">
            Sign in using your new password.
          </p>
          <button
            onClick={() => router.push('./')} // Adjust the route as needed
            className="w-full mt-4 py-3 bg-brown-700 text-white rounded-full font-bold"
          >
            Back to sign in
          </button>
        </div>
      )}
    </div>
  );
};

export default ChangePassword;
