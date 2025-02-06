'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@utils/supabase/supabase';
import { logout } from '@/utils/actions';

import GenericPage from '@components/layout/GenericPage';
import Button from '@components/common/Button';
import ButtonLink from '@/components/common/ButtonLink';
import Input from '@components/common/Input';

import {
  HEALTH_CARD_FORMATS,
  PROVINCES,
  ProvinceCode,
} from '@/utils/constants';

interface formDataType {
  firstName: string;
  lastName: string;
  dob: string;
  gender: string;
  address: string;
  province: ProvinceCode | null;
  healthcareProvince: ProvinceCode | null;
  healthcareNumber: string;
}

const GetStarted = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<formDataType>({
    firstName: '',
    lastName: '',
    dob: '',
    gender: '',
    address: '',
    province: null,
    healthcareProvince: null,
    healthcareNumber: '',
  });
  const [isHealthcareNumberValid, setIsHealthcareNumberValid] =
    useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSignOut = async () => {
    await logout();
    router.replace('/');
  };

  const handleSubmit = async () => {
    if (step === 1) {
      const requiredFields: (keyof formDataType)[] = [
        'firstName',
        'lastName',
        'dob',
        'gender',
        'address',
        'province',
      ];
      const isFormValid = requiredFields.every((field) => formData[field]);

      if (!isFormValid) {
        setErrorMessage('Please fill out all required fields.');
        return;
      }

      setErrorMessage('');
      setStep(2);
    } else {
      if (formData.healthcareProvince && !formData.healthcareNumber) {
        setErrorMessage(
          'Healthcare number is required if a healthcare province is selected.',
        );
        return;
      }

      setErrorMessage('');

      try {
        // Extract necessary fields
        const {
          firstName,
          lastName,
          dob,
          gender,
          address,
          province,
          healthcareProvince,
          healthcareNumber,
        } = formData;

        // Insert into `users` table
        const { data: userInsertData, error: userInsertError } = await supabase
          .from('users')
          .insert([
            {
              user_id: (await supabase.auth.getUser()).data.user?.id, // Get the current user's ID
              first_name: firstName,
              last_name: lastName,
              dob,
              sex: gender,
              address,
              province,
            },
          ]);

        if (userInsertError) {
          console.error(userInsertError);
          setErrorMessage('Failed to save user information. Please try again.');
          return;
        }

        console.log('User data inserted:', userInsertData);

        // If healthcare info is provided, insert into `user_healthcare` table
        if (healthcareProvince && healthcareNumber) {
          const { data: healthcareInsertData, error: healthcareInsertError } =
            await supabase.from('user_healthcare').insert([
              {
                user_id: (await supabase.auth.getUser()).data.user?.id, // Same user ID
                healthcare_province: healthcareProvince,
                healthcare_number: healthcareNumber,
              },
            ]);

          if (healthcareInsertError) {
            console.error(healthcareInsertError);
            setErrorMessage(
              'Failed to save healthcare information. Please try again.',
            );
            return;
          }

          console.log('Healthcare data inserted:', healthcareInsertData);
        }

        // Redirect or notify success
        console.log('Data submitted successfully!');
        router.push('/');
      } catch (err) {
        console.error('Error submitting data:', err);
        setErrorMessage('An error occurred. Please try again.');
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
      // setFormData((prev) => ({
      //   ...prev,
      //   isHealthcareNumberValid: isValid,
      // }));
      setIsHealthcareNumberValid(isValid);
    }
  };

  const validateHealthcareNumber = (number: string) => {
    // Ensure healthcareProvince is not null before accessing HEALTH_CARD_FORMATS
    if (formData.healthcareProvince !== null) {
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
    }
    // If healthcareProvince is null, return true as no validation is needed
    return true;
  };

  const handleBack = () => {
    setStep(1);
  };

  return (
    <GenericPage className="flex flex-col">
      {step === 1 ? (
        <>
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
              placeholder="Select Gender"
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
              value={formData.province ?? ''}
              onChange={handleChange}
              placeholder="Province"
              options={PROVINCES}
              className="w-full"
            />
            <Button onClick={handleSubmit} className="mt-6">
              Continue
            </Button>
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            <div className="mt-4 text-center">
              <ButtonLink onClick={handleSignOut} variant="secondary">
                Sign Out
              </ButtonLink>
            </div>
          </div>
        </>
      ) : (
        <>
          <h1 className="mb-2">What&apos;s your healthcare coverage plan?</h1>
          <p className="">Enter the province of your healthcare plan</p>
          <div className="mt-4 flex w-full flex-col space-y-4">
            <Input
              type="select"
              name="healthcareProvince"
              value={formData.healthcareProvince ?? ''}
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
              error={!isHealthcareNumberValid}
              errorMessage={errorMessage}
            />
            <Button onClick={handleSubmit} className="mt-6">
              Submit
            </Button>
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            <div className="mt-4 text-center">
              <ButtonLink onClick={handleBack}>Back</ButtonLink>
              {' | '}
              <ButtonLink onClick={handleSignOut} variant="secondary">
                Sign Out
              </ButtonLink>
            </div>
          </div>
        </>
      )}
    </GenericPage>
  );
};

export default GetStarted;
