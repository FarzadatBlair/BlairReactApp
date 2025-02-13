import React, { useState, useEffect } from 'react';
import Button from '@/components/common/Button';
import QuestionOption from '@/components/common/QuestionOption';
import Input from '@/components/common/Input';
import { Options } from '@/types/question';
import Link from 'next/link';

interface MPQuestionPageProps {
  title: string;
  description?: string;
  type: 'MC' | 'MS' | 'NUM' | 'list-text';
  options?: Options[];
  FYI?: string;
  unitType?: 'weight' | 'height'; // Determines unit selection for NUM type
  onContinue: (answer: string | string[]) => void;
  disabled: boolean;
}

const MPQuestionPage: React.FC<MPQuestionPageProps> = ({
  title,
  description,
  type,
  options = [],
  FYI,
  unitType,
  onContinue,
  disabled,
}) => {
  const [selected, setSelected] = useState<string[]>([]);
  const [otherValue, setOtherValue] = useState('');
  const [numericValue, setNumericValue] = useState('');
  const [unit, setUnit] = useState(unitType === 'weight' ? 'lbs' : 'cm');
  const [listText, setListText] = useState<string[]>([]);

  useEffect(() => {
    setSelected([]);
    setOtherValue('');
    setNumericValue('');
    setListText([]);
  }, [title]);

  const handleOptionChange = (option: string) => {
    if (type === 'MS') {
      setSelected((prev) =>
        prev.includes(option)
          ? prev.filter((o) => o !== option)
          : [...prev, option],
      );
    } else {
      setSelected([option]);
    }
  };

  const handleListTextChange = (index: number, value: string) => {
    const updatedList = [...listText];
    updatedList[index] = value;
    setListText(updatedList);
  };

  const handleAddListText = () => {
    setListText([...listText, '']);
  };

  const handleRemoveListText = (index: number) => {
    setListText(listText.filter((_, i) => i !== index));
  };

  const handleContinue = () => {
    let answer: string | string[] = '';
    if (type === 'NUM') {
      answer = `${numericValue} ${unit}`;
    } else if (type === 'list-text') {
      answer = listText.filter((text) => text.trim().length > 0);
    } else {
      answer = selected;
      if (
        selected.some(
          (o) =>
            options.find((opt) => opt.label === o)?.special === 'free-text',
        )
      ) {
        answer.push(otherValue);
      }
    }
    onContinue(answer);
  };

  return (
    <div className="flex min-h-screen w-full flex-grow flex-col space-y-4 bg-background px-6 py-16 text-primary-900">
      <div>
        <h1>{title}</h1>
      </div>
      {description && <p>{description}</p>}

      <div className="flex flex-grow flex-col space-y-4">
        {/* Multiple Choice & Multi-Select */}
        {(type === 'MC' || type === 'MS') &&
          options.map((option, index) => (
            <QuestionOption
              key={index}
              option={option.label}
              isSelected={selected.includes(option.label)}
              isMultiSelect={type === 'MS'}
              onClick={() => handleOptionChange(option.label)}
            />
          ))}

        {/* Free Text Input for "Other" option */}
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

        {/* Numerical Input */}
        {type === 'NUM' && (
          <div className="flex flex-row space-x-4">
            <Input
              type="number"
              value={numericValue}
              onChange={(e) => setNumericValue(e.target.value)}
              placeholder="Enter value"
              className="w-3/4"
            />
            {/* Unit Selection */}
            {unitType && (
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-1/4 rounded-lg border border-gray-300 p-2"
              >
                {unitType === 'weight' ? (
                  <>
                    <option value="lbs">lbs</option>
                    <option value="kg">kg</option>
                  </>
                ) : (
                  <>
                    <option value="cm">cm</option>
                    <option value="ft-in">ft/in</option>
                  </>
                )}
              </select>
            )}
          </div>
        )}

        {/* List-Text Input */}
        {type === 'list-text' && (
          <div className="flex flex-col space-y-2">
            {listText.map((text, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  type="text"
                  value={text}
                  onChange={(e) => handleListTextChange(index, e.target.value)}
                  placeholder="Enter text"
                  className="w-full"
                />
                <button
                  onClick={() => handleRemoveListText(index)}
                  className="text-red-500"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              onClick={handleAddListText}
              className="text-primary-700 underline"
            >
              + Add another
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-col items-center space-y-4">
        <Button
          onClick={handleContinue}
          disabled={
            (type === 'MC' || type === 'MS') &&
            selected.length === 0 &&
            !otherValue.trim()
          }
        >
          Continue
        </Button>
        <div>
          <Link href="/privacy" className="font-bold underline">
            Privacy Policy
          </Link>
          {' | '}
          <Link href="/terms" className="font-bold underline">
            Terms of Service
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MPQuestionPage;
