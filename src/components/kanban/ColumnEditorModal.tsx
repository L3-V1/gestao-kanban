import { useState } from 'react'
import type { ColumnDraft } from '../../models/types/kanban'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Modal } from '../ui/Modal'

interface ColumnEditorModalProps {
  open: boolean
  initialValue: ColumnDraft
  mode: 'create' | 'edit'
  onClose: () => void
  onSubmit: (draft: ColumnDraft) => void
}

export function ColumnEditorModal({
  open,
  initialValue,
  mode,
  onClose,
  onSubmit,
}: ColumnEditorModalProps) {
  const [draft, setDraft] = useState<ColumnDraft>(initialValue)

  return (
    <Modal
      description="Use etapas curtas de fluxo que toda a equipe entenda."
      onClose={onClose}
      open={open}
      title={mode === 'create' ? 'Criar coluna' : 'Editar coluna'}
    >
      <form
        className="space-y-8"
        onSubmit={(event) => {
          event.preventDefault()
          onSubmit(draft)
          onClose()
        }}
      >
        <label className="block space-y-4">
          <span className="block text-sm font-semibold text-(--color-text)">Título da coluna</span>
          <Input
            onChange={(event) => setDraft({ title: event.target.value })}
            placeholder="Validação de QA"
            required
            value={draft.title}
          />
        </label>

        <div className="flex justify-end gap-3">
          <Button onClick={onClose} variant="ghost">
            Cancelar
          </Button>
          <Button type="submit">{mode === 'create' ? 'Criar coluna' : 'Salvar alterações'}</Button>
        </div>
      </form>
    </Modal>
  )
}
