import { NavLink } from "react-router-dom";

import { NAVIGATION } from "@/constants/navigation";
import { cn } from "@/lib/utils";

type NavigationProps = {
    direction?: "row" | "column";
    onNavigate?: () => void;
};

export function Navigation({
    direction = "row",
    onNavigate,
}: NavigationProps) {
    return (
        <nav aria-label="Navegación principal">
            <ul
                className={cn(
                    "flex items-center gap-8",
                    direction === "column" && "flex-col items-start gap-6"
                )}
            >
                {NAVIGATION.map((item) => (
                    <li key={item.label}>
                        <NavLink
                            to={item.href}
                            onClick={onNavigate}
                            className={({ isActive }) =>
                                cn(
                                    "text-sm font-medium text-muted-foreground transition-colors hover:text-primary",
                                    isActive && item.href === "/" && "text-primary"
                                )
                            }
                        >
                            {item.label}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </nav>
    );
}