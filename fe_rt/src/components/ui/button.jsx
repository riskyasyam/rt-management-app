import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-sm)] text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20 focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-40 cursor-pointer select-none',
  {
    variants: {
      variant: {
        default:
          'bg-[hsl(var(--accent))] text-[hsl(var(--accent-fg))] hover:bg-[hsl(var(--accent-hover))] shadow-sm',
        destructive:
          'bg-[hsl(var(--danger))] text-white hover:opacity-90',
        outline:
          'border border-[hsl(var(--border-strong))] bg-white text-[hsl(var(--text-primary))] hover:bg-[hsl(var(--card-hover))]',
        secondary:
          'bg-[hsl(0_0%_94%)] text-[hsl(var(--text-primary))] hover:bg-[hsl(0_0%_90%)]',
        ghost:
          'text-[hsl(var(--text-secondary))] hover:bg-[hsl(0_0%_94%)] hover:text-[hsl(var(--text-primary))]',
        link: 'text-[hsl(var(--text-primary))] underline-offset-4 hover:underline p-0 h-auto',
        success: 'bg-[hsl(var(--success))] text-white hover:opacity-90 shadow-sm',
        warning: 'bg-[hsl(var(--warning))] text-white hover:opacity-90 shadow-sm',
      },
      size: {
        default: 'h-8 px-3.5 py-1.5 text-sm',
        sm: 'h-7 px-2.5 text-xs rounded-[var(--radius-sm)]',
        lg: 'h-10 px-5 rounded-[var(--radius)]',
        icon: 'h-8 w-8',
        'icon-sm': 'h-7 w-7',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
