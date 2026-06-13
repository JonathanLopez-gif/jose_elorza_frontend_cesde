import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "brand" | "accent" | "neutral";
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = "brand" }) => {
  const baseStyles =
    "inline-flex items-center px-sm py-2xs rounded-full font-sans text-xs font-medium";

  const variants: Record<string, string> = {
    brand: "bg-brand text-white",
    accent: "bg-accent text-white",
    neutral: "bg-neutral-light text-neutral-dark",
  };

  return <span className={`${baseStyles} ${variants[variant]}`}>{children}</span>;
};
