import { useState } from 'react'
import type { BoardDraft } from '../../models/types/kanban'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Modal } from '../ui/Modal'
import { Textarea } from '../ui/Textarea'

interface BoardEditorModalProps {
  open: boolean
  initialValue: BoardDraft
  mode: 'create' | 'edit'
  onClose: () => void
  onSubmit: (draft: BoardDraft) => void
}

export function BoardEditorModal({
  open,
  initialValue,
  mode,
  onClose,
  onSubmit,
}: BoardEditorModalProps) {
  const [draft, setDraft] = useState<BoardDraft>(initialValue)

  return (
    <Modal
      description="Defina o espaço do projeto e um contexto breve para a equipe."
      onClose={onClose}
      open={open}
      title={mode === 'create' ? 'Criar quadro' : 'Editar quadro'}
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
          <span className="block text-sm font-semibold text-(--color-text)">Nome do quadro</span>
          <Input
            onChange={(event) => setDraft((currentDraft) => ({ ...currentDraft, name: event.target.value }))}
            placeholder="Migração da plataforma"
            required
            value={draft.name}
          />
        </label>

        <label className="block space-y-4">
          <span className="block text-sm font-semibold text-(--color-text)">Descrição</span>
          <Textarea
            onChange={(event) =>
              setDraft((currentDraft) => ({ ...currentDraft, description: event.target.value }))
            }
            placeholder="O que este quadro acompanha?"
            value={draft.description}
          />
        </label>

        <div className="flex justify-end gap-3">
          <Button onClick={onClose} variant="ghost">
            Cancelar
          </Button>
          <Button type="submit">{mode === 'create' ? 'Criar quadro' : 'Salvar alterações'}</Button>
        </div>
      </form>
    </Modal>
  )
}
