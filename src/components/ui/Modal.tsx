import { useEffect } from 'react'
import { X } from 'lucide-react'
import { Button } from './Button'

interface ModalProps {
  title: string
  description?: string
  open: boolean
  onClose: () => void
  children: React.ReactNode
}

export function Modal({ title, description, open, onClose, children }: ModalProps) {
  useEffect(() => {
    if (!open) {
      return undefined
    }

    const handleEscape = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleEscape)

    return () => window.removeEventListener('keydown', handleEscape)
  }, [onClose, open])

  if (!open) {
    return null
  }

  return (
    <div
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/45 p-4 backdrop-blur-sm"
      role="dialog"
    >
      <div className="flex min-h-full items-center justify-center">
        <div className="max-h-[calc(100vh-2rem)] w-full max-w-xl overflow-y-auto rounded-[28px] border border-white/10 bg-(--color-panel) p-7 shadow-2xl md:p-8">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-(--color-text)">{title}</h2>
            {description ? (
              <p className="mt-1 text-sm text-(--color-text-muted)">{description}</p>
            ) : null}
          </div>
          <Button
            aria-label="Fechar modal"
            className="h-10 w-10 rounded-full p-0"
            onClick={onClose}
            variant="ghost"
          >
            <X size={18} />
          </Button>
        </div>
        {children}
        </div>
      </div>
    </div>
  )
}
