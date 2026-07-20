import { useState } from 'react'
import { Columns3, Save, X } from 'lucide-react'
import type { ColumnDraft } from '../../models/types/kanban'
import { Button } from '../ui/Button'
import { FormField } from '../ui/FormField'
import { Input } from '../ui/Input'
import { Modal } from '../ui/Modal'
import { ModalActions } from '../ui/ModalActions'

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
        <FormField label="Título da coluna">
          <Input
            onChange={(event) => setDraft({ title: event.target.value })}
            placeholder="Validação de QA"
            required
            value={draft.title}
          />
        </FormField>

        <ModalActions>
          <Button onClick={onClose} variant="ghost">
            <X size={16} />
            Cancelar
          </Button>
          <Button type="submit">
            {mode === 'create' ? <Columns3 size={16} /> : <Save size={16} />}
            {mode === 'create' ? 'Criar coluna' : 'Salvar alterações'}
          </Button>
        </ModalActions>
      </form>
    </Modal>
  )
}
