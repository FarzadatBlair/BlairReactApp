import { FC, ReactNode, MouseEvent } from 'react';
import clsx from 'clsx';

interface ButtonProps {
  children?: ReactNode;
  className?: string;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
}

const Button: FC<ButtonProps> = ({ children, className, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'w-full rounded-full bg-primary py-3 text-background transition hover:bg-primary-900 active:scale-95',
        className,
      )}
    >
      {children}
    </button>
  );
};

export default Button;
