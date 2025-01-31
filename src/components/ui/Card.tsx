import React from 'react';

interface CardProps {
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ children }) => {
  return (
    <div className="flex w-full flex-col space-y-2 rounded-lg bg-white p-6 shadow-md">
      {React.Children.map(children, (child, index) => (
        <>
          {child}
          {index !== React.Children.count(children) - 1 && (
            <hr className="my-4 border-gray-300" />
          )}
        </>
      ))}
    </div>
  );
};

export default Card;
