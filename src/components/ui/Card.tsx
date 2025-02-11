import React from 'react';

interface CardProps {
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ children }) => {
  return (
    <div className="flex w-full flex-col space-y-4 rounded-lg border border-gray-300 bg-white p-6 shadow-sm">
      {React.Children.map(children, (child, index) => (
        <>
          <div className="flex flex-col space-y-2">{child}</div>
          {index !== React.Children.count(children) - 1 && (
            <hr className="my-4 border-gray-300" />
          )}
        </>
      ))}
    </div>
  );
};

export default Card;
