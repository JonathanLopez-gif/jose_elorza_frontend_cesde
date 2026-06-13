import React from "react";
import { Outlet } from "react-router-dom";

export const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-light">
      <header className="p-md bg-brand text-white font-sans">
        <h1 className="text-xl font-bold">José Elorza</h1>
      </header>

      <main className="flex-1 p-lg">
        <Outlet />
      </main>

      <footer className="p-md bg-neutral-dark text-white text-sm text-center">
        © 2026 José Fernando Elorza
      </footer>
    </div>
  );
};
