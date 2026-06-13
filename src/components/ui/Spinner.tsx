import React from "react";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  color?: "brand" | "accent" | "neutral";
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = "md",
  color = "brand",
}) => {
  const sizes: Record<string, string> = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  const colors: Record<string, string> = {
    brand: "text-brand",
    accent: "text-accent",
    neutral: "text-neutral-dark",
  };

  return (
    <svg
      className={`animate-spin ${sizes[size]} ${colors[color]}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      ></path>
    </svg>
  );
};
