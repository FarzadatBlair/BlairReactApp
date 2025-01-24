'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../utils/supabase';

import GenericPage from '@components/layout/GenericPage';
import Button from '@components/common/Button';
import ButtonLink from '@/components/common/ButtonLink';
import Input from '@components/common/Input';

import { HEALTH_CARD_FORMATS, PROVINCES } from '@/utils/constants';

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
    healthcareProvince: '' as keyof typeof HEALTH_CARD_FORMATS, //! create new type for this
    healthcareNumber: '',
    isHealthcareNumberValid: true,
  });
  const [errorMessage, setErrorMessage] = useState('');

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
      // Upsert formData into the 'profiles' table in the 'public' schema
      try {
        const { data: user } = await supabase.auth.getUser(); // Get the authenticated user's ID
        const userId = user?.user?.id;

        if (!userId) {
          console.error('User not authenticated');
          return;
        }

        const { data, error } = await supabase.from('profiles').upsert({
          ...formData,
          user_id: userId, // Ensure the user_id matches your schema
        });

        if (error) {
          console.error('Error upserting data:', error);
          return;
        }

        console.log('Data successfully upserted:', data);
      } catch (err) {
        console.error('Unexpected error:', err);
      }
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    if (name === 'healthcareNumber') {
      const isValid = validateHealthcareNumber(value);
      setFormData((prev) => ({
        ...prev,
        isHealthcareNumberValid: isValid,
      }));
    }
  };

  const validateHealthcareNumber = (number: string) => {
    const regex = HEALTH_CARD_FORMATS[formData.healthcareProvince]?.regex;
    const healthCardName =
      HEALTH_CARD_FORMATS[formData.healthcareProvince]?.name;
    if (regex) {
      const isValid = regex.test(number);
      if (!isValid) {
        setErrorMessage(
          `Invalid ${healthCardName} format. Example: ${HEALTH_CARD_FORMATS[formData.healthcareProvince]?.example}`,
        );
      }
      return isValid;
    }
    return true;
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
          <Input
            type="select"
            name="healthcareProvince"
            value={formData.healthcareProvince}
            onChange={handleChange}
            placeholder="Select Province"
            options={PROVINCES}
            className="w-full"
          />
          <Input
            type="text"
            name="healthcareNumber"
            value={formData.healthcareNumber}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={
              HEALTH_CARD_FORMATS[
                formData.healthcareProvince as keyof typeof HEALTH_CARD_FORMATS
              ]?.name || 'Enter healthcare number'
            }
            disabled={!formData.healthcareProvince}
            error={!formData.isHealthcareNumberValid}
            errorMessage={errorMessage}
          />
          <Button onClick={handleSubmit} className="mt-6">
            Submit
          </Button>
          <div className="mt-4 text-center">
            <ButtonLink onClick={handleBack}>Back</ButtonLink>
            {' | '}
            <ButtonLink onClick={handleSignOut} variant="secondary">
              Sign Out
            </ButtonLink>
          </div>
        </div>
      </GenericPage>
    );
  }

  return (
    <GenericPage className="flex flex-col">
      <h1 className="mb-6">Tell us about yourself</h1>
      <div className="flex w-full flex-col space-y-4">
        <Input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          placeholder="First Name"
        />
        <Input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          placeholder="Last Name"
        />
        <Input
          type="date"
          name="dob"
          value={formData.dob}
          onChange={handleChange}
          placeholder="Date of Birth"
        />
        <Input
          type="select"
          name="gender"
          onChange={handleChange}
          value={formData.gender}
          placeholder="Select gender 2"
          options={[
            { value: 'M', label: 'Male' },
            { value: 'F', label: 'Female' },
          ]}
        />
        <Input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Address"
        />
        <Input
          type="select"
          name="province"
          value={formData.province}
          onChange={handleChange}
          placeholder="Province"
          options={PROVINCES}
          className="w-full"
        />
        <Button onClick={handleSubmit} className="mt-6">
          Continue
        </Button>
        <div className="mt-4 text-center">
          <ButtonLink onClick={handleSignOut} variant="secondary">
            Sign Out
          </ButtonLink>
        </div>
      </div>
    </GenericPage>
  );
};

export default GetStarted;
