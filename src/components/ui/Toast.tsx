import React, { useEffect } from "react";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  onClose: () => void;
  duration?: number; // en milisegundos
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = "info",
  onClose,
  duration = 3000,
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const baseStyles =
    "fixed bottom-lg right-lg px-md py-xs rounded-md shadow-lg font-sans text-sm";

  const variants: Record<string, string> = {
    success: "bg-turquoise text-white",
    error: "bg-accent text-white",
    info: "bg-brand text-white",
  };

  return (
    <div className={`${baseStyles} ${variants[type]}`}>
      {message}
    </div>
  );
};
