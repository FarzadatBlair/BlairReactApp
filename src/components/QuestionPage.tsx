import React, { useState, useEffect } from 'react';
import Button from '@/components/common/Button';
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
  const [selected, setSelected] = useState<string[]>([]);
  const [otherValue, setOtherValue] = useState('');

  // Reset selections when a new question is displayed
  useEffect(() => {
    setSelected([]);
    setOtherValue('');
  }, [title]);

  const handleOptionChange = (option: string) => {
    const optionMeta = options.find((o) => o.label === option);
    if (!optionMeta) return;

    const isNoneOption = optionMeta.special === 'none-above';
    const isFreeTextOption = optionMeta.special === 'free-text';

    // Handle single-choice (MC) questions
    if (type === 'MC') {
      setSelected([option]);
      if (isFreeTextOption) setOtherValue('');
      return;
    }

    // Handle multi-select (MS) questions
    setSelected((prev) => {
      if (isNoneOption) {
        return [option]; // Selecting "None of the above" clears all others
      } else {
        return prev.includes(option)
          ? prev.filter((o) => o !== option) // Deselect if already selected
          : [
              ...prev.filter(
                (o) =>
                  options.find((opt) => opt.label === o)?.special !==
                  'none-above',
              ),
              option,
            ]; // Remove "None of the above" if selecting anything else
      }
    });

    if (isFreeTextOption) setOtherValue('');
  };

  const handleContinue = () => {
    let finalAnswer = selected;

    if (otherValue.trim()) {
      finalAnswer = [
        ...selected.filter(
          (o) =>
            options.find((opt) => opt.label === o)?.special !== 'free-text',
        ),
        otherValue,
      ];
    }

    onContinue(finalAnswer);
  };

  return (
    <div className="flex min-h-screen w-full flex-grow flex-col space-y-4 bg-background px-6 py-16 text-primary-900">
      <div>
        <h1>{title}</h1>
      </div>
      {description && <p>{description}</p>}

      <div className="flex flex-grow flex-col space-y-4">
        {options.map((option, index) => (
          <QuestionOption
            key={index}
            option={option.label}
            isSelected={selected.includes(option.label)}
            isMultiSelect={type === 'MS'}
            onClick={() => handleOptionChange(option.label)}
          />
        ))}

        {/* Render input box only if "Other" is selected */}
        {selected.some(
          (o) =>
            options.find((opt) => opt.label === o)?.special === 'free-text',
        ) && (
          <Input
            type="text"
            placeholder="Other (please specify)"
            value={otherValue}
            onChange={(e) => setOtherValue(e.target.value)}
          />
        )}
      </div>

      <div>
        <Button
          onClick={handleContinue}
          disabled={selected.length === 0 && !otherValue.trim()}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default QuestionPage;
