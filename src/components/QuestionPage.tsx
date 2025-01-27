import React, { useState } from 'react';
import Button from '@/components/common/Button';
import GenericPage from './layout/GenericPage';
import QuestionOption from '@/components/common/QuestionOption';
import ButtonLink from '@/components/common/ButtonLink';
import Input from '@/components/common/Input';
import { QUESTION_TITLE_CHAR_LIMIT } from '@/utils/constants';
import clsx from 'clsx';

interface QuestionPageProps {
  title: string;
  desc?: string;
  type: 'multiple_choice' | 'multi_select';
  options: string[];
  specialField?: string;
  otherField?: boolean;
  onContinue: (answer: any) => void;
}

const QuestionPage: React.FC<QuestionPageProps> = ({
  title,
  desc,
  type,
  options,
  specialField,
  otherField,
  onContinue,
}) => {
  const [selected, setSelected] = useState<any>(
    type === 'multi_select' ? [] : null,
  );
  const [otherValue, setOtherValue] = useState('');

  const handleOptionChange = (option: string) => {
    if (type === 'multiple_choice') {
      setSelected(option);
    } else {
      // Toggle the selection for multi-select
      setSelected((prev: string[]) =>
        prev.includes(option)
          ? prev.filter((o) => o !== option)
          : [...prev, option],
      );
    }
  };

  const handleSpecialField = () => {
    if (type === 'multi_select') {
      setSelected((prev: string[]) =>
        prev.includes(specialField!)
          ? prev.filter((o) => o !== specialField)
          : [...prev, specialField],
      );
    } else {
      setSelected(specialField);
    }
  };

  const handleContinue = () => {
    const answer =
      otherField && otherValue
        ? type === 'multi_select'
          ? [...selected, otherValue]
          : otherValue
        : selected;
    onContinue(answer);
  };

  // Check if "Continue" button should be disabled
  const isContinueDisabled =
    type === 'multi_select'
      ? selected.length === 0 && !otherValue.trim() // No options or other field selected
      : !selected && !otherValue.trim(); // No option or other value in single-choice mode

  return (
    <GenericPage>
      {/* THE WIDTH IS 5/6 TO PREVENT AWKWARD LINE BREAKING */}
      <div className="mb-4">
        <h1
          className={clsx(
            title.length > QUESTION_TITLE_CHAR_LIMIT && 'text-[2.5rem]',
          )}
        >
          {title}
        </h1>
      </div>
      {desc && <p>{desc}</p>}

      <div className="mt-4 space-y-4">
        {options.map((option, index) => (
          <QuestionOption
            key={index}
            option={option}
            isSelected={
              type === 'multi_select'
                ? selected.includes(option)
                : selected === option
            }
            isMultiSelect={type === 'multi_select'}
            onClick={() => handleOptionChange(option)}
          />
        ))}

        {specialField && (
          <QuestionOption
            option={specialField}
            isSelected={
              type === 'multi_select'
                ? selected.includes(specialField)
                : selected === specialField
            }
            isMultiSelect={type === 'multi_select'}
            onClick={handleSpecialField}
          />
        )}

        {otherField && (
          <div className="mt-4">
            <Input
              type="text"
              placeholder="Other (please specify)"
              value={otherValue}
              onChange={(e) => setOtherValue(e.target.value)}
              className="rounded-3xl"
            />
          </div>
        )}
      </div>

      <div className="mt-6 flex flex-col justify-between">
        <Button onClick={handleContinue} disabled={isContinueDisabled}>
          Continue
        </Button>
        <ButtonLink onClick={() => window.history.back()}>Go back</ButtonLink>
      </div>

      <div className="mt-6 text-center text-xs text-gray-500">
        <a href="/terms" className="hover:underline">
          Terms of Service
        </a>{' '}
        |{' '}
        <a href="/privacy" className="hover:underline">
          Privacy Policy
        </a>
      </div>
    </GenericPage>
  );
};

export default QuestionPage;
