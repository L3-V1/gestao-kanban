import { GripVertical } from 'lucide-react'
import { cn } from '../ui/cn'

interface DragHandleProps {
  className?: string
}

export function DragHandle({ className }: DragHandleProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'inline-flex h-9 w-9 items-center justify-center rounded-full bg-(--color-surface) text-(--color-text-soft)',
        className
      )}
    >
      <GripVertical size={16} />
    </span>
  )
}
