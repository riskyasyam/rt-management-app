import * as React from 'react'
import { cn } from '@/lib/utils'

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        'flex h-8 w-full rounded-[var(--radius-sm)] border border-[hsl(var(--input-border))] bg-white px-3 text-sm text-[hsl(var(--text-primary))] placeholder:text-[hsl(var(--text-muted))] shadow-none transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[hsl(var(--input-focus))] focus-visible:border-[hsl(var(--input-focus))] disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[hsl(0_0%_96%)]',
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = 'Input'

export { Input }
