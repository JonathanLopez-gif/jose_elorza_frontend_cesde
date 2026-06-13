import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent";
  size?: "sm" | "md" | "lg";
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) => {
  const baseStyles =
    "font-sans font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variants: Record<string, string> = {
    primary: "bg-brand text-white hover:bg-brand-light focus:ring-brand",
    secondary:
      "bg-neutral-light text-brand hover:bg-neutral-dark focus:ring-neutral-dark",
    accent: "bg-accent text-white hover:bg-accent-soft focus:ring-accent",
  };

  const sizes: Record<string, string> = {
    sm: "px-sm py-2xs text-sm",
    md: "px-md py-xs text-base",
    lg: "px-lg py-sm text-lg",
  };

  const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};

