import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/utils";

type SectionHeaderProps = ComponentProps<"div"> & {
    badge?: string;
    title: ReactNode;
    description?: ReactNode;
    align?: "left" | "center";
};

export function SectionHeader({
    badge,
    title,
    description,
    align = "center",
    className,
    ...props
}: SectionHeaderProps) {
    return (
        <div
            className={cn(
                "mx-auto mb-12 max-w-3xl",
                align === "center" ? "text-center" : "text-left",
                className
            )}
            {...props}
        >
            {badge && (
                <span className="mb-4 inline-flex rounded-full bg-primary/10 px-4 py-1 text-sm font-semibold uppercase tracking-wider text-primary">
                    {badge}
                </span>
            )}

            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                {title}
            </h2>

            {description && (
                <p className="mt-4 text-lg leading-8 text-muted-foreground">
                    {description}
                </p>
            )}
        </div>
    );
}