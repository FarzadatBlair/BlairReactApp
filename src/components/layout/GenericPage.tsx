import { FC, ReactNode } from 'react';
import clsx from 'clsx';

/**
 * Props interface for the GenericPage component
 * @interface GenericPageProps
 */
interface GenericPageProps {
  /** The content to be rendered inside the page layout */
  children: ReactNode;
  /** Optional Tailwind background color class name (without the 'bg-' prefix) */
  bgCol?: 'default' | 'secondary';
  className?: string;
}

/**
 * A reusable page wrapper component that provides consistent layout and styling
 *
 * @component
 * @example
 * ```tsx
 * <GenericPage bgCol="gray-100">
 *   <YourContent />
 * </GenericPage>
 * ```
 *
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - The content to be rendered inside the page layout
 * @param {string} [props.bgCol='background'] - Tailwind background color class name
 * @returns {JSX.Element} A full-height, centered page layout with configurable background
 */
const GenericPage: FC<GenericPageProps> = ({
  children,
  bgCol = 'default',
  className,
}) => {
  return (
    <div
      className={clsx(
        'flex min-h-screen w-full flex-col px-6 py-16 text-primary-900',
        {
          'bg-background': bgCol === 'default',
          'bg-secondary': bgCol === 'secondary',
        },
        className,
      )}
    >
      {children}
    </div>
  );
};

export default GenericPage;
