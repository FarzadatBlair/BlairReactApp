import React from 'react';
import clsx from 'clsx';

interface QuestionOptionProps {
  option: string;
  isSelected: boolean;
  isMultiSelect: boolean;
  onClick: () => void;
}

const QuestionOption: React.FC<QuestionOptionProps> = ({
  option,
  isSelected,
  // isMultiSelect,
  onClick,
}) => {
  const buttonClasses = clsx(
    // 'rounded-3xl px-4 py-2 transition-colors trasnsition ease-in-out',
    {
      // Selected state
      'border-primary-500 bg-primary-200/60': isSelected,
      // Non-selected state
      'border-transparent bg-primary-200/40': !isSelected,
    },
  );

  return (
    <button
      className={clsx(
        'text-left',
        'trasnsition rounded-3xl border-2 px-4 py-2 transition ease-in-out hover:bg-primary-200/60 active:scale-95',
        buttonClasses,
      )}
      onClick={onClick}
    >
      <p>{option}</p>
    </button>
  );
};

export default QuestionOption;
