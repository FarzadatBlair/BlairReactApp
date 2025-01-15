import { FC, ReactNode } from 'react';
import clsx from 'clsx';

interface ButtonProps {
  children?: ReactNode;
  className?: string;
}

const Button: FC<ButtonProps> = ({ children, className }) => {
  return (
    <button
      className={clsx(
        'w-full rounded-full bg-primary py-3 text-background',
        className,
      )}
    >
      {children}
    </button>
  );
};

export default Button;
