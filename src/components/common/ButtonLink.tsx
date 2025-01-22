import { FC, ReactNode, MouseEvent } from 'react';
import clsx from 'clsx';

interface ButtonProps {
  children?: ReactNode;
  className?: string;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
}

const ButtonLink: FC<ButtonProps> = ({
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
        'font-bold underline',
        variant === 'secondary' && 'text-error',
        className,
      )}
    >
      {children}
    </button>
  );
};

export default ButtonLink;
