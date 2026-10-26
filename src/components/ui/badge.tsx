import * as React from 'react'
import { type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

import { badgeVariants } from './badge-variants'

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof badgeVariants>) {
  return <div data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />
}

Badge.displayName = 'Badge'

export { Badge }
