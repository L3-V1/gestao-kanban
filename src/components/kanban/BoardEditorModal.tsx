import { useState } from 'react'
import { FolderPlus, Save, X } from 'lucide-react'
import type { BoardDraft } from '../../models/types/kanban'
import { Button } from '../ui/Button'
import { FormField } from '../ui/FormField'
import { Input } from '../ui/Input'
import { Modal } from '../ui/Modal'
import { ModalActions } from '../ui/ModalActions'
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
        <FormField label="Nome do quadro">
          <Input
            onChange={(event) => setDraft((currentDraft) => ({ ...currentDraft, name: event.target.value }))}
            placeholder="Migração da plataforma"
            required
            value={draft.name}
          />
        </FormField>

        <FormField label="Descrição">
          <Textarea
            onChange={(event) =>
              setDraft((currentDraft) => ({ ...currentDraft, description: event.target.value }))
            }
            placeholder="O que este quadro acompanha?"
            value={draft.description}
          />
        </FormField>

        <ModalActions>
          <Button onClick={onClose} variant="ghost">
            <X size={16} />
            Cancelar
          </Button>
          <Button type="submit">
            {mode === 'create' ? <FolderPlus size={16} /> : <Save size={16} />}
            {mode === 'create' ? 'Criar quadro' : 'Salvar alterações'}
          </Button>
        </ModalActions>
      </form>
    </Modal>
  )
}
