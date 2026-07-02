import type { ComponentProps, ElementType } from "react";

import { cn } from "@/lib/utils";

type ContainerProps<T extends ElementType = "div"> = {
    as?: T;
} & ComponentProps<T>;

export function Container<T extends ElementType = "div">({
    as,
    className,
    children,
    ...props
}: ContainerProps<T>) {
    const Component = as ?? "div";

    return (
        <Component
            className={cn(
                "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8",
                className
            )}
            {...props}
        >
            {children}
        </Component>
    );
}