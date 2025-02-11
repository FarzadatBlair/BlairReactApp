'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@utils/supabase/supabase';

import GenericPage from '@components/layout/GenericPage';
import Button from '@components/common/Button';
import ButtonLink from '@/components/common/ButtonLink';
import Input from '@components/common/Input';

import {
  HEALTH_CARD_FORMATS,
  PROVINCES,
  ProvinceCode,
} from '@/utils/constants';

interface FormDataType {
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
  const [formData, setFormData] = useState<FormDataType>({
    firstName: '',
    lastName: '',
    dob: '',
    gender: '',
    address: '',
    province: null,
    healthcareProvince: null,
    healthcareNumber: '',
  });
  const [isHealthcareNumberValid, setIsHealthcareNumberValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [healthCareError, setHealthCareError] = useState('');
  const [isStepOneValid, setIsStepOneValid] = useState(false);

  useEffect(() => {
    const requiredFields: (keyof FormDataType)[] = [
      'firstName',
      'lastName',
      'dob',
      'gender',
      'address',
      'province',
    ];
    const isValid = requiredFields.every((field) => formData[field]);
    setIsStepOneValid(isValid);
  }, [formData]);

  const validateHealthcareNumber = useCallback(
    (number: string) => {
      if (formData.healthcareProvince === null) {
        return true;
      }

      const regex = HEALTH_CARD_FORMATS[formData.healthcareProvince]?.regex;
      const healthCardName =
        HEALTH_CARD_FORMATS[formData.healthcareProvince]?.name;

      if (!regex) {
        return true;
      }

      const isValid = regex.test(number);
      if (!isValid) {
        setHealthCareError(
          `Invalid ${healthCardName} format. Example: ${HEALTH_CARD_FORMATS[formData.healthcareProvince]?.example}`,
        );
      }
      return isValid;
    },
    [formData.healthcareProvince, setHealthCareError],
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'healthcareProvince' || name === 'healthcareNumber') {
      setHealthCareError('');
      setIsHealthcareNumberValid(true);
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    if (name === 'healthcareNumber') {
      setIsHealthcareNumberValid(validateHealthcareNumber(value));
    }
  };

  const handleStepOneSubmit = () => {
    if (!isStepOneValid) {
      setErrorMessage('Please fill out all required fields.');
      return;
    }

    setErrorMessage('');
    setStep(2);
  };

  const handleStepTwoSubmit = async () => {
    if (formData.healthcareProvince && !formData.healthcareNumber) {
      setErrorMessage(
        'Healthcare number is required if a healthcare province is selected.',
      );
      return;
    }

    if (
      formData.healthcareProvince &&
      formData.healthcareNumber &&
      !isHealthcareNumberValid
    ) {
      setErrorMessage('Please correct the healthcare number format.');
      return;
    }

    setErrorMessage('');

    try {
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

      const userId = (await supabase.auth.getUser()).data.user?.id;

      const { error: userInsertError } = await supabase.from('users').insert([
        {
          user_id: userId,
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

      if (healthcareProvince && healthcareNumber) {
        const { error: healthcareInsertError } = await supabase
          .from('user_healthcare')
          .insert([
            {
              user_id: userId,
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
      }

      router.push('/');
    } catch (err) {
      console.error('Error submitting data:', err);
      setErrorMessage('An error occurred. Please try again.');
    }
  };

  const handleSubmit = () => {
    if (step === 1) {
      handleStepOneSubmit();
    } else {
      handleStepTwoSubmit();
    }
  };

  const renderStepOne = () => (
    <>
      <div>
        <h1>
          Tell us a bit
          <br />
          about yourself
        </h1>
        <p className="mt-4">Please fill out all fields.</p>
      </div>
      <div className="flex w-full flex-grow flex-col space-y-4">
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
      </div>
      <div className="flex flex-col space-y-4">
        <div>
          <Button onClick={handleSubmit} disabled={!isStepOneValid}>
            Continue
          </Button>
          {errorMessage && (
            <p className="mt-2 text-error-500">{errorMessage}</p>
          )}
        </div>
      </div>
    </>
  );

  const renderStepTwo = () => (
    <>
      <div>
        <h1>What&apos;s your healthcare coverage plan?</h1>
        <p className="mt-4">Enter the province of your healthcare plan</p>
      </div>
      <div className="flex w-full flex-grow flex-col space-y-4">
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
          errorMessage={healthCareError}
        />
      </div>
      <div className="flex flex-col space-y-4">
        <div>
          <Button
            onClick={handleSubmit}
            disabled={
              !isHealthcareNumberValid &&
              formData.healthcareProvince !== null &&
              formData.healthcareNumber !== ''
            }
          >
            Submit
          </Button>
          {errorMessage && (
            <p className="mt-2 text-error-500">{errorMessage}</p>
          )}
        </div>
        <ButtonLink onClick={() => setStep(1)}>Back</ButtonLink>
      </div>
    </>
  );

  return (
    <GenericPage className="flex flex-col space-y-6">
      {step === 1 ? renderStepOne() : renderStepTwo()}
    </GenericPage>
  );
};

export default GetStarted;
