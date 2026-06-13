import { createBrowserRouter } from "react-router-dom";
import { PublicLayout } from "../layouts/PublicLayout";
import { AuthenticatedLayout } from "../layouts/AuthenticatedLayout";

// Definición de rutas
export const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      { path: "/", element: <h2>Página pública</h2> },
      { path: "/login", element: <h2>Login</h2> },
      { path: "/about", element: <h2>Sobre José Elorza</h2> },
    ],
  },
  {
    path: "/app",
    element: <AuthenticatedLayout />,
    children: [
      { path: "/app/dashboard", element: <h2>Dashboard</h2> },
      { path: "/app/profile", element: <h2>Perfil</h2> },
      { path: "/app/settings", element: <h2>Configuración</h2> },
    ],
  },
]);

