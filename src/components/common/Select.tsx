import React, { FC } from 'react';
import clsx from 'clsx';

interface SelectProps {
  options: { value: string; label: string }[];
  value: string;
  name?: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  color?: 'default' | 'secondary';
  disabled?: boolean;
  error?: boolean;
  errorMessage?: string | undefined;
  className?: string;
}

const Select: FC<SelectProps> = ({
  options,
  value,
  name,
  placeholder,
  onChange,
  color = 'default',
  disabled = false,
  error = false,
  errorMessage,
  className,
}) => {
  const colorClasses = {
    default: 'border-primary-200 bg-white focus:border-primary-500',
    secondary:
      'border-secondary-100 bg-secondary-100 focus:border-secondary-500',
  };

  const errorClass = 'text-error-700 bg-error-100 border-error';

  return (
    <div>
      <select
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={clsx(
          'w-full rounded-lg border-2 px-4 py-2 text-primary-900 placeholder-primary-900/50 outline-none focus:box-border',
          error ? errorClass : colorClasses[color],
          className,
        )}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-error">{errorMessage}</p>}
    </div>
  );
};

export default Select;
