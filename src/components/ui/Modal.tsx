import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-dark bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-lg relative">
        {title && (
          <h2 className="font-sans font-bold text-lg text-brand mb-md">{title}</h2>
        )}
        <div>{children}</div>
        <button
          onClick={onClose}
          className="absolute top-sm right-sm text-neutral-dark hover:text-brand"
        >
          ✕
        </button>
      </div>
    </div>
  );
};
