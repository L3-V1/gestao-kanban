interface FormFieldProps {
  label: string
  children: React.ReactNode
}

export function FormField({ label, children }: FormFieldProps) {
  return (
    <label className="block space-y-4">
      <span className="block text-sm font-semibold text-(--color-text)">{label}</span>
      {children}
    </label>
  )
}
