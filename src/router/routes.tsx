import type { RouteObject } from "react-router-dom";

import { PublicLayout } from "@/layouts/PublicLayout";
import { HomePage } from "@/features/services/pages/HomePage";

export const routes: RouteObject[] = [
    {
        element: <PublicLayout />,
        children: [
            {
                path: "/",
                element: <HomePage />,
            },
        ],
    },
];