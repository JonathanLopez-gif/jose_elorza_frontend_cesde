import React from "react";

interface CardProps {
  title?: string;
  description?: string;
  children?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ title, description, children }) => {
  return (
    <div className="bg-white border border-neutral-light rounded-lg shadow-md p-lg">
      {title && (
        <h3 className="font-sans font-bold text-lg text-brand mb-sm">{title}</h3>
      )}
      {description && (
        <p className="font-sans text-sm text-neutral-dark mb-md">{description}</p>
      )}
      {children && <div>{children}</div>}
    </div>
  );
};
