import React from "react";

interface CardSectionProps {
  title?: string;
  icon?: React.ReactNode;
  bodytext?: string;
  list?: string[];
  custom?: React.ReactNode;
}

const CardSections: React.FC<CardSectionProps> = ({
  title,
  icon,
  bodytext,
  list,
  custom,
}) => {
  return (
<>
      {/* Title & Icon Row */}
      <div className="flex items-center gap-2">
        {icon && <div className="text-2xl text-secondary-500">{icon}</div>}
        {title && <h5 className="text-primary font-sans font-black">{title}</h5>}
      </div>

      {/* Body Content */}
      {bodytext && <p className="">{bodytext}</p>}

      {/* List Items */}
      {list && (
        <ul className="list-disc pl-5 text-primary">
          {list.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      )}

      {/* Custom Content */}
      {custom && <div>{custom}</div>}
</>
  );
};

export default CardSections;
