'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../utils/supabase';

import GenericPage from '@components/layout/GenericPage';
import Button from '@components/common/Button';

const GetStarted = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    gender: '',
    address: '',
    province: '',
    healthcareProvince: '',
    healthcareNumber: '',
  });

  useEffect(() => {
    // Check current auth status
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.user) {
        router.replace('/');
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        router.replace('/');
      }
    });

    // Cleanup subscription
    return () => subscription.unsubscribe();
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.replace('/');
  };

  const handleSubmit = async () => {
    if (step === 1) {
      setStep(2);
    } else {
      // TODO: Handle final form submission
      console.log(formData);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleBack = () => {
    setStep(1);
  };

  if (step === 2) {
    return (
      <GenericPage className="flex flex-col">
        <h1 className="mb-2">What&apos;s your healthcare coverage plan?</h1>
        <p className="">Enter the province of your healthcare plan</p>
        <div className="mt-4 flex w-full flex-col space-y-4">
          <select
            name="healthcareProvince"
            value={formData.healthcareProvince}
            onChange={handleChange}
            className="w-full rounded-lg border-2 border-primary-200 px-4 py-2 text-primary-900"
          >
            <option value="">Select Province</option>
            <option value="AB">Alberta</option>
            <option value="BC">British Columbia</option>
            <option value="MB">Manitoba</option>
            <option value="NB">New Brunswick</option>
            <option value="NL">Newfoundland and Labrador</option>
            <option value="NT">Northwest Territories</option>
            <option value="NS">Nova Scotia</option>
            <option value="NU">Nunavut</option>
            <option value="ON">Ontario</option>
            <option value="PE">Prince Edward Island</option>
            <option value="QC">Quebec</option>
            <option value="SK">Saskatchewan</option>
            <option value="YT">Yukon</option>
          </select>
          <input
            type="text"
            name="healthcareNumber"
            value={formData.healthcareNumber}
            onChange={handleChange}
            placeholder="Provincial health care number"
            className="w-full rounded-lg border-2 border-primary-200 px-4 py-2 text-primary-900 placeholder-primary-900/50"
          />
          <Button onClick={handleSubmit} className="mt-6">
            Continue
          </Button>
          <div className="mt-4 text-center">
            <button onClick={handleBack} className="font-bold underline">
              Back
            </button>
            {' | '}
            <button
              onClick={handleSignOut}
              className="text-error font-bold underline"
            >
              Sign Out
            </button>
          </div>
        </div>
      </GenericPage>
    );
  }

  return (
    <GenericPage className="flex flex-col">
      <h1 className="mb-6">Tell us about yourself</h1>
      <div className="flex w-full flex-col space-y-4">
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          placeholder="First Name"
          className="w-full rounded-lg border-2 border-primary-200 px-4 py-2 text-primary-900 placeholder-primary-900/50"
        />
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          placeholder="Last Name"
          className="w-full rounded-lg border-2 border-primary-200 px-4 py-2 text-primary-900 placeholder-primary-900/50"
        />
        <input
          type="date"
          name="dob"
          value={formData.dob}
          onChange={handleChange}
          placeholder="Date of Birth"
          className="w-full rounded-lg border-2 border-primary-200 px-4 py-2 text-primary-900 placeholder-primary-900/50"
        />
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          className="w-full rounded-lg border-2 border-primary-200 px-4 py-2 text-primary-900"
        >
          <option value="">Select Gender</option>
          <option value="M">Male</option>
          <option value="F">Female</option>
        </select>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Address"
          className="w-full rounded-lg border-2 border-primary-200 px-4 py-2 text-primary-900 placeholder-primary-900/50"
        />
        <input
          type="text"
          name="province"
          value={formData.province}
          onChange={handleChange}
          placeholder="Province"
          className="w-full rounded-lg border-2 border-primary-200 px-4 py-2 text-primary-900 placeholder-primary-900/50"
        />
        <Button onClick={handleSubmit} className="mt-6">
          Continue
        </Button>
        <div className="mt-4 text-center">
          <button
            onClick={handleSignOut}
            className="text-error font-bold underline"
          >
            Sign Out
          </button>
        </div>
      </div>
    </GenericPage>
  );
};

export default GetStarted;
