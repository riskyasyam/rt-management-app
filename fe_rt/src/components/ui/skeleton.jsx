import * as React from 'react'
import { cn } from '@/lib/utils'

function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn('animate-pulse rounded-[var(--radius-sm)] bg-[hsl(0_0%_93%)]', className)}
      {...props}
    />
  )
}

export { Skeleton }
