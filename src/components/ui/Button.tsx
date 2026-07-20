import type { ButtonHTMLAttributes } from 'react'
import { cn } from './cn'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
}

const variantClassNames: Record<ButtonVariant, string> = {
  primary:
    'bg-(--color-accent) text-white shadow-[0_12px_30px_-16px_var(--color-accent)] hover:bg-(--color-accent-strong)',
  secondary:
    'bg-(--color-surface-strong) text-(--color-text) hover:bg-(--color-accent)/18',
  ghost:
    'bg-transparent text-(--color-text-muted) hover:bg-(--color-surface-strong) hover:text-(--color-text)',
  danger: 'bg-(--color-danger) text-white hover:opacity-90',
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
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-accent)/40',
        'disabled:cursor-not-allowed disabled:opacity-50',
        variantClassNames[variant],
        className
      )}
      type={type}
      {...props}
    />
  )
}
