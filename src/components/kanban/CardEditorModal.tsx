import { useState } from 'react'
import { Save, SquareKanban, X } from 'lucide-react'
import { AREA_OPTIONS, PRIORITY_OPTIONS, type CardDraft } from '../../models/types/kanban'
import { Button } from '../ui/Button'
import { FormField } from '../ui/FormField'
import { Input } from '../ui/Input'
import { Modal } from '../ui/Modal'
import { ModalActions } from '../ui/ModalActions'
import { Select } from '../ui/Select'
import { Textarea } from '../ui/Textarea'

interface CardEditorModalProps {
  open: boolean
  initialValue: CardDraft
  mode: 'create' | 'edit'
  onClose: () => void
  onSubmit: (draft: CardDraft) => void
}

export function CardEditorModal({
  open,
  initialValue,
  mode,
  onClose,
  onSubmit,
}: CardEditorModalProps) {
  const [draft, setDraft] = useState<CardDraft>(initialValue)

  return (
    <Modal
      description="Capture o contexto essencial de entrega para o cartão da tarefa."
      onClose={onClose}
      open={open}
      title={mode === 'create' ? 'Criar cartão' : 'Editar cartão'}
    >
      <form
        className="grid gap-8"
        onSubmit={(event) => {
          event.preventDefault()
          onSubmit(draft)
          onClose()
        }}
      >
        <FormField label="Título">
          <Input
            onChange={(event) => setDraft((currentDraft) => ({ ...currentDraft, title: event.target.value }))}
            placeholder="Adicionar testes de integração"
            required
            value={draft.title}
          />
        </FormField>

        <FormField label="Descrição">
          <Textarea
            onChange={(event) =>
              setDraft((currentDraft) => ({ ...currentDraft, description: event.target.value }))
            }
            placeholder="Notas técnicas relevantes, impedimentos ou contexto."
            value={draft.description}
          />
        </FormField>

        <div className="grid gap-8 md:grid-cols-2">
          <FormField label="Prioridade">
            <Select
              onChange={(event) =>
                setDraft((currentDraft) => ({
                  ...currentDraft,
                  priority: event.target.value as CardDraft['priority'],
                }))
              }
              value={draft.priority}
            >
              {PRIORITY_OPTIONS.map((priority) => (
                <option key={priority} value={priority}>
                  {priority}
                </option>
              ))}
            </Select>
          </FormField>

          <FormField label="Área">
            <Select
              onChange={(event) =>
                setDraft((currentDraft) => ({
                  ...currentDraft,
                  area: event.target.value as CardDraft['area'],
                }))
              }
              value={draft.area}
            >
              {AREA_OPTIONS.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </Select>
          </FormField>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <FormField label="Responsável">
            <Input
              onChange={(event) =>
                setDraft((currentDraft) => ({ ...currentDraft, assignee: event.target.value }))
              }
              placeholder="Pessoa responsável"
              value={draft.assignee}
            />
          </FormField>

          <FormField label="Data limite">
            <Input
              onChange={(event) =>
                setDraft((currentDraft) => ({ ...currentDraft, dueDate: event.target.value }))
              }
              type="date"
              value={draft.dueDate}
            />
          </FormField>
        </div>

        <ModalActions>
          <Button onClick={onClose} variant="ghost">
            <X size={16} />
            Cancelar
          </Button>
          <Button type="submit">
            {mode === 'create' ? <SquareKanban size={16} /> : <Save size={16} />}
            {mode === 'create' ? 'Criar cartão' : 'Salvar alterações'}
          </Button>
        </ModalActions>
      </form>
    </Modal>
  )
}
