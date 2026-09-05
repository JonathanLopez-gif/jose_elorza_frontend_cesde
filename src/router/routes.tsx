import type { RouteObject } from "react-router-dom";

import { PublicLayout } from "@/layouts/PublicLayout";
import { HomePage } from "@/features/services/pages/HomePage";
import { LegalPage } from "@/features/services/pages/LegalPage";
import { AuthPage } from "@/features/auth/pages/AuthPage";

export const routes: RouteObject[] = [
    {
        element: <PublicLayout />,
        children: [
            {
                path: "/",
                element: <HomePage />,
            },
            {
                path: "/terminos",
                element: <LegalPage title="Términos de uso" />,
            },
            {
                path: "/privacidad",
                element: <LegalPage title="Política de privacidad" />,
            },
            {
                path: "/login",
                element: <AuthPage />,
            },
            {
                path: "/registro",
                element: <AuthPage />,
            },
            {
                path: "/recuperar",
                element: <AuthPage />,
            },
        ],
    },
];