import type { TextareaHTMLAttributes } from 'react'
import { cn } from './cn'

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>

export function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(
        'min-h-28 w-full rounded-2xl border border-(--color-border) bg-(--color-surface) px-4 py-3 text-sm text-(--color-text)',
        'placeholder:text-(--color-text-soft) focus:border-(--color-accent) focus:outline-none focus:ring-2 focus:ring-(--color-accent)/24',
        className
      )}
      {...props}
    />
  )
}
