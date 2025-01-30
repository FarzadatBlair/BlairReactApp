import React, { useState } from 'react';
import Button from '@/components/common/Button';
import GenericPage from './layout/GenericPage';
import QuestionOption from '@/components/common/QuestionOption';
import Input from '@/components/common/Input';
import { Options } from '@/types/question';

interface QuestionPageProps {
  title: string;
  description?: string;
  type: 'MC' | 'MS';
  options: Options[];
  onContinue: (answer: string[]) => void;
}

const QuestionPage: React.FC<QuestionPageProps> = ({
  title,
  description,
  type,
  options,
  onContinue,
}) => {
  // For both MC and MS, 'selected' is always a string array
  const [selected, setSelected] = useState<string[]>([]); // Initially empty or containing one empty string for MC
  const [otherValue, setOtherValue] = useState('');

  const handleOptionChange = (option: string) => {
    if (type === 'MC') {
      // For MC, ensure selected is always an array with one element
      setSelected([option]);
    } else {
      // For MS, 'selected' is an array, add/remove the option
      setSelected((prev: string[]) =>
        prev.includes(option)
          ? prev.filter((o) => o !== option)
          : [...prev, option],
      );
    }
  };

  const handleContinue = () => {
    const answer =
      selected.includes('Other') && otherValue
        ? [...selected.filter((o) => o !== 'Other'), otherValue]
        : selected;
    onContinue(answer);
  };

  return (
    <GenericPage>
      <div className="mb-4">
        <h1>{title}</h1>
      </div>
      {description && <p>{description}</p>}

      <div className="mt-4 flex flex-col space-y-4">
        {options.map((option, index) => (
          <QuestionOption
            key={index}
            option={option.label}
            isSelected={selected.includes(option.label)}
            isMultiSelect={type === 'MS'}
            onClick={() => handleOptionChange(option.label)}
          />
        ))}

        {/* Handle "Other" field separately */}
        {options.some((o) => o.special === 'text') && (
          <Input
            type="text"
            placeholder="Other (please specify)"
            value={otherValue}
            onChange={(e) => setOtherValue(e.target.value)}
          />
        )}
      </div>

      <Button
        onClick={handleContinue}
        disabled={selected.length === 0 && !otherValue.trim()}
        className="mt-4"
      >
        Continue
      </Button>
    </GenericPage>
  );
};

export default QuestionPage;
