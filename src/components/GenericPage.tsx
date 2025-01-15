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
  bgCol?: string;
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
  bgCol = 'background', // Set a default that exists in Tailwind
  className,
}) => {
  return (
    <div
      className={clsx(
        `bg-${bgCol}`,
        'flex min-h-screen flex-col items-center justify-center px-6',
        className,
      )}
    >
      {children}
    </div>
  );
};

export default GenericPage;
