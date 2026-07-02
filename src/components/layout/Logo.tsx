import type { ComponentProps } from "react";
import { Link } from "react-router-dom";

import { BRAND } from "@/constants/brand";
import { cn } from "@/lib/utils";

type LogoProps = Omit<ComponentProps<"a">, "href"> & {
    showSubtitle?: boolean;
};

export function Logo({
    className,
    showSubtitle = true,
}: LogoProps) {
    return (
        <Link
            to="/"
            className={cn(
                "inline-flex flex-col items-start leading-none",
                className
            )}
        >
            <span className="text-xl font-bold tracking-tight text-foreground">
                {BRAND.name}
            </span>

            {showSubtitle && (
                <span className="mt-1 text-sm font-medium text-muted-foreground">
                    {BRAND.profession}
                </span>
            )}
        </Link>
    );
}