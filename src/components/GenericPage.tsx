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
  bgColTailwind?: string;
  className?: string;
}

/**
 * A reusable page wrapper component that provides consistent layout and styling
 *
 * @component
 * @example
 * ```tsx
 * <GenericPage bgColTailwind="gray-100">
 *   <YourContent />
 * </GenericPage>
 * ```
 *
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - The content to be rendered inside the page layout
 * @param {string} [props.bgColTailwind='background'] - Tailwind background color class name
 * @returns {JSX.Element} A full-height, centered page layout with configurable background
 */
const GenericPage: FC<GenericPageProps> = ({
  children,
  bgColTailwind,
  className,
}) => {
  const bgCol = `bg-${bgColTailwind ? bgColTailwind : 'background'}`;

  return (
    <div
      className={clsx(
        bgCol,
        'flex min-h-screen flex-col items-center justify-center px-6',
        className,
      )}
    >
      {children}
    </div>
  );
};

export default GenericPage;
