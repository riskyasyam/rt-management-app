import * as React from 'react'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium whitespace-nowrap transition-colors',
  {
    variants: {
      variant: {
        default:   'bg-[hsl(0_0%_10%)] text-white',
        secondary: 'bg-[hsl(0_0%_93%)] text-[hsl(var(--text-secondary))]',
        outline:   'border border-[hsl(var(--border-strong))] text-[hsl(var(--text-secondary))] bg-transparent',
        success:   'bg-[hsl(var(--success-bg))] text-[hsl(var(--success))]',
        warning:   'bg-[hsl(var(--warning-bg))] text-[hsl(var(--warning))]',
        destructive: 'bg-[hsl(var(--danger-bg))] text-[hsl(var(--danger))]',
        info:      'bg-[hsl(var(--info-bg))] text-[hsl(var(--info))]',
      },
    },
    defaultVariants: { variant: 'secondary' },
  }
)

function Badge({ className, variant, ...props }) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
