import type { InputHTMLAttributes } from 'react'
import { cn } from './cn'

type InputProps = InputHTMLAttributes<HTMLInputElement>

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        'w-full rounded-2xl border border-(--color-border) bg-(--color-surface) px-4 py-3 text-sm text-(--color-text)',
        'placeholder:text-(--color-text-soft) focus:border-(--color-accent) focus:outline-none focus:ring-2 focus:ring-(--color-accent)/24',
        className
      )}
      {...props}
    />
  )
}
