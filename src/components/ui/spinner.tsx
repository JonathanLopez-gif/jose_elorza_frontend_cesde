import { LoaderCircle } from "lucide-react"

import { cn } from "@/lib/utils"

type SpinnerSize = "sm" | "md" | "lg" | "xl"

interface SpinnerProps {
    className?: string
    size?: SpinnerSize
}

const sizeClasses: Record<SpinnerSize, string> = {
    sm: "size-4",
    md: "size-6",
    lg: "size-8",
    xl: "size-10",
}

function Spinner({
    className,
    size = "md",
}: SpinnerProps) {
    return (
        <LoaderCircle
            data-slot="spinner"
            className={cn(
                "animate-spin text-primary",
                sizeClasses[size],
                className
            )}
        />
    )
}

Spinner.displayName = "Spinner"

export { Spinner }