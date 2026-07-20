import type { SelectHTMLAttributes } from 'react'
import { cn } from './cn'

type SelectProps = SelectHTMLAttributes<HTMLSelectElement>

export function Select({ className, ...props }: SelectProps) {
  return (
    <select
      className={cn(
        'w-full appearance-none rounded-2xl border border-(--color-border) bg-(--color-surface) px-4 py-3 text-sm text-(--color-text)',
        'focus:border-(--color-accent) focus:outline-none focus:ring-2 focus:ring-(--color-accent)/24',
        className
      )}
      {...props}
    />
  )
}
