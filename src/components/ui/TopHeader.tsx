import React from 'react';

type TopHeaderProps = {
  variant: 'Get Care' | 'Learn' | 'Profile' | 'Home'; // Add more variants as needed
};

const TopHeader: React.FC<TopHeaderProps> = ({ variant }) => {
  const renderContent = () => {
    switch (variant) {
      case 'Get Care':
        return (
          <>
            <h1 className="text-2xl font-bold">Get care</h1>
            <p className="text-sm text-gray-600">
              Book a video call or message one of our top-rated providers.{' '}
              <span className="font-semibold">We’re here for you.</span>
            </p>
            <div className="mt-4">
              <input
                type="text"
                placeholder="Search treatments and providers"
                className="w-full rounded-md border border-gray-300 p-2"
              />
            </div>
          </>
        );

      case 'Learn':
        return (
          <>
            <h1 className="text-2xl font-bold">Learn</h1>
            <p className="text-sm text-gray-600">
              Essential resources to help you understand, manage, and navigate
              menopausal changes with confidence.
            </p>
            <div className="mt-4">
              <input
                type="text"
                placeholder="Search articles, podcasts, and interviews"
                className="w-full rounded-md border border-gray-300 p-2"
              />
            </div>
          </>
        );

      case 'Profile':
        return (
          <>
            <h1 className="text-2xl font-bold">Learn</h1>
            <p className="text-sm text-gray-600">
              Essential resources to help you understand, manage, and navigate
              menopausal changes with confidence.
            </p>
            <div className="mt-4">
              <input
                type="text"
                placeholder="Search articles, podcasts, and interviews"
                className="w-full rounded-md border border-gray-300 p-2"
              />
            </div>
          </>
        );

      case 'Home':
        return (
          <>
            <h2>Welcome, Meredith!</h2>

            <p className="text-sm text-gray-600">
              Essential resources to help you understand, manage, and navigate
              menopausal changes with confidence.
            </p>
          </>
        );

      default:
        return null; // Fallback for unsupported variants
    }
  };

  return (
    <header className="rounded-md bg-secondary-100 p-4 shadow-md">
      {renderContent()}
    </header>
  );
};

export default TopHeader;
