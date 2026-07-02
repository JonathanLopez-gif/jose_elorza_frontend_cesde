import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/90",

        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/90",

        outline:
          "border-border bg-background text-foreground",

        destructive:
          "border-transparent bg-destructive text-primary-foreground hover:bg-destructive/90",

        success:
          "border-transparent bg-green-600 text-white hover:bg-green-700",

        warning:
          "border-transparent bg-yellow-500 text-black hover:bg-yellow-600",

        info:
          "border-transparent bg-sky-600 text-white hover:bg-sky-700",
      },
    },

    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof badgeVariants>) {
  return (
    <div
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

Badge.displayName = "Badge"

export { Badge, badgeVariants }