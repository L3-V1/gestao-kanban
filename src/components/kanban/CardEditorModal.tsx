import { useState } from 'react'
import { AREA_OPTIONS, PRIORITY_OPTIONS, type CardDraft } from '../../models/types/kanban'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Modal } from '../ui/Modal'
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
        <label className="block space-y-4">
          <span className="block text-sm font-semibold text-(--color-text)">Título</span>
          <Input
            onChange={(event) => setDraft((currentDraft) => ({ ...currentDraft, title: event.target.value }))}
            placeholder="Adicionar testes de integração"
            required
            value={draft.title}
          />
        </label>

        <label className="block space-y-4">
          <span className="block text-sm font-semibold text-(--color-text)">Descrição</span>
          <Textarea
            onChange={(event) =>
              setDraft((currentDraft) => ({ ...currentDraft, description: event.target.value }))
            }
            placeholder="Notas técnicas relevantes, impedimentos ou contexto."
            value={draft.description}
          />
        </label>

        <div className="grid gap-8 md:grid-cols-2">
          <label className="block space-y-4">
            <span className="block text-sm font-semibold text-(--color-text)">Prioridade</span>
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
          </label>

          <label className="block space-y-4">
            <span className="block text-sm font-semibold text-(--color-text)">Área</span>
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
          </label>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <label className="block space-y-4">
            <span className="block text-sm font-semibold text-(--color-text)">Responsável</span>
            <Input
              onChange={(event) =>
                setDraft((currentDraft) => ({ ...currentDraft, assignee: event.target.value }))
              }
              placeholder="Pessoa responsável"
              value={draft.assignee}
            />
          </label>

          <label className="block space-y-4">
            <span className="block text-sm font-semibold text-(--color-text)">Data limite</span>
            <Input
              onChange={(event) =>
                setDraft((currentDraft) => ({ ...currentDraft, dueDate: event.target.value }))
              }
              type="date"
              value={draft.dueDate}
            />
          </label>
        </div>

        <div className="flex justify-end gap-3">
          <Button onClick={onClose} variant="ghost">
            Cancelar
          </Button>
          <Button type="submit">{mode === 'create' ? 'Criar cartão' : 'Salvar alterações'}</Button>
        </div>
      </form>
    </Modal>
  )
}
