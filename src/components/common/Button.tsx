import { FC, ReactNode, MouseEvent } from 'react';
import clsx from 'clsx';

interface ButtonProps {
  children?: ReactNode;
  className?: string;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
}

const Button: FC<ButtonProps> = ({
  children,
  className,
  onClick,
  disabled,
  variant = 'primary',
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        'w-full rounded-full py-3 transition active:scale-95',
        {
          'bg-primary text-background hover:bg-primary-900':
            variant === 'primary',
          'border-2 border-primary text-primary hover:bg-primary/10':
            variant === 'secondary',
          'cursor-not-allowed opacity-50 hover:bg-primary active:scale-100':
            disabled,
        },
        className,
      )}
    >
      {children}
    </button>
  );
};

export default Button;
