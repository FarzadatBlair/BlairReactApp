import React, { FC, ReactNode } from 'react';
import clsx from 'clsx';

interface InputProps {
  value: string;
  name?: string;
  placeholder?: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => void;
  type?: 'text' | 'select' | 'date' | 'email' | 'password' | 'number';
  options?: { value: string; label: string }[]; // For select type
  color?: 'default' | 'secondary';
  disabled?: boolean;
  error?: boolean;
  errorMessage?: string | undefined;
  className?: string;
}

const Input: FC<InputProps> = ({
  value,
  name,
  placeholder,
  onChange,
  onBlur,
  type = 'text',
  options,
  color = 'default',
  disabled = false,
  error = false,
  errorMessage,
  className,
}) => {
  const getColorClasses = () => {
    if (error) return 'border-error bg-error-100';
    const colorMap = {
      default: 'border-primary-200 bg-white focus-within:border-primary-500',
      secondary:
        'border-secondary-100 bg-secondary-100 focus-within:border-secondary-500',
    };
    return colorMap[color];
  };

  const wrapperClasses = clsx(
    'relative w-full rounded-lg border-2 p-2 transition focus-within:ring ring-insets ring-primary-500/40',
    getColorClasses(),
    {
      'text-primary-900': !error,
      'text-error-700': error,
    },
    className,
  );

  const inputClasses = clsx(
    'w-full bg-transparent border-none outline-none px-2 py-1 text-primary-900 placeholder-primary-900/50',
    {
      'text-error-700 placeholder-error-700/50': error,
    },
  );

  const renderInput = (): ReactNode => {
    if (type === 'select' && options) {
      return (
        <select
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          className={inputClasses}
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
      );
    }

    return (
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        className={inputClasses}
      />
    );
  };

  return (
    <div>
      <div className={wrapperClasses}>{renderInput()}</div>
      {error && errorMessage && (
        <p className="mt-1 text-sm text-error">{errorMessage}</p>
      )}
    </div>
  );
};

export default Input;
