import type { ButtonHTMLAttributes } from 'react'
import { cn } from './cn'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
}

const variantClassNames: Record<ButtonVariant, string> = {
  primary:
    'bg-(--color-accent) text-white shadow-[0_12px_30px_-16px_var(--color-accent)] hover:bg-(--color-accent-strong) hover:shadow-[0_16px_36px_-18px_var(--color-accent)]',
  secondary:
    'bg-(--color-surface-strong) text-(--color-text) hover:bg-(--color-accent)/24 hover:text-white',
  ghost:
    'bg-transparent text-(--color-text-muted) hover:bg-(--color-surface-strong) hover:text-(--color-text)',
  danger:
    'bg-(--color-danger) text-white shadow-[0_12px_28px_-18px_var(--color-danger)] hover:bg-rose-500 hover:shadow-[0_16px_34px_-18px_var(--color-danger)]',
}

export function Button({
  className,
  type = 'button',
  variant = 'primary',
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold transition duration-200',
        'hover:-translate-y-0.5 active:translate-y-0',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-accent)/40',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'disabled:hover:translate-y-0 disabled:hover:shadow-none',
        variantClassNames[variant],
        className
      )}
      type={type}
      {...props}
    />
  )
}
