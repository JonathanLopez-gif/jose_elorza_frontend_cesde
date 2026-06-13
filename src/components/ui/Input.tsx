import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  className = "",
  ...props
}) => {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="font-sans text-sm font-medium text-brand-dark">
          {label}
        </label>
      )}
      <input
        className={`px-sm py-xs border rounded-md font-sans text-base focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand ${className}`}
        {...props}
      />
      {error && (
        <span className="text-accent-soft text-xs font-sans">{error}</span>
      )}
    </div>
  );
};
