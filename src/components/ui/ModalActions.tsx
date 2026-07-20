interface ModalActionsProps {
  children: React.ReactNode
}

export function ModalActions({ children }: ModalActionsProps) {
  return <div className="flex justify-end gap-3">{children}</div>
}
