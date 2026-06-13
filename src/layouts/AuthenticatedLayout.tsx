import React from "react";
import { Outlet, Link } from "react-router-dom";

export const AuthenticatedLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex bg-neutral-light">
      {/* Sidebar */}
      <aside className="w-64 bg-brand text-white p-md space-y-md">
        <h2 className="font-sans font-bold text-lg">Panel</h2>
        <nav className="flex flex-col gap-sm">
          <Link to="/dashboard" className="hover:text-accent-soft">Dashboard</Link>
          <Link to="/profile" className="hover:text-accent-soft">Perfil</Link>
          <Link to="/settings" className="hover:text-accent-soft">Configuración</Link>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-lg">
        <Outlet />
      </main>
    </div>
  );
};
