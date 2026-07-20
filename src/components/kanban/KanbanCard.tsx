import { CSS } from '@dnd-kit/utilities'
import { CalendarClock, PencilLine, Tag, Trash2, UserCircle2 } from 'lucide-react'
import { useSortable } from '@dnd-kit/sortable'
import type { KanbanCard as KanbanCardType } from '../../models/types/kanban'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { cn } from '../ui/cn'
import { DragHandle } from './DragHandle'

interface KanbanCardProps {
  card: KanbanCardType
  onEdit: (cardId: string) => void
  onDelete: (cardId: string) => void
  isOverlay?: boolean
}

const priorityClassNames: Record<KanbanCardType['priority'], string> = {
  Baixa: 'bg-emerald-500/18 text-emerald-100',
  Média: 'bg-sky-500/18 text-sky-100',
  Alta: 'bg-amber-500/18 text-amber-100',
  Crítica: 'bg-rose-500/18 text-rose-100',
}

export function KanbanCard({ card, onEdit, onDelete, isOverlay = false }: KanbanCardProps) {
  const sortable = useSortable({
    id: card.id,
    data: {
      type: 'card',
      columnId: card.columnId,
    },
    disabled: isOverlay,
  })
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = sortable

  return (
    <article
      className={cn(
        'rounded-3xl border border-(--color-border) bg-(--color-panel) p-4 shadow-(--shadow-soft) transition duration-200',
        isDragging && !isOverlay && 'rotate-1 opacity-80 shadow-2xl',
        isOverlay && 'rotate-2 shadow-2xl ring-1 ring-(--color-accent)/30'
      )}
      ref={isOverlay ? undefined : setNodeRef}
      style={{
        transform: isOverlay ? undefined : CSS.Transform.toString(transform),
        transition: isOverlay ? undefined : transition,
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <Badge className={priorityClassNames[card.priority]}>{card.priority}</Badge>
            <Badge className="bg-(--color-surface-strong) text-(--color-text-muted)">{card.area}</Badge>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-(--color-text)">{card.title}</h4>
            <p className="mt-2 line-clamp-3 text-sm text-(--color-text-muted)">
              {card.description || 'Nenhum detalhe informado.'}
            </p>
          </div>
        </div>

        <button
          aria-label={`Arrastar ${card.title}`}
          className={cn('touch-none', isOverlay ? 'cursor-grabbing' : 'cursor-grab')}
          type="button"
          {...(isOverlay ? {} : attributes)}
          {...(isOverlay ? {} : listeners)}
        >
          <DragHandle />
        </button>
      </div>

      <div className="mt-4 space-y-2 text-xs text-(--color-text-muted)">
        <p className="flex items-center gap-2">
          <UserCircle2 size={14} />
          {card.assignee || 'Não atribuído'}
        </p>
        <p className="flex items-center gap-2">
          <CalendarClock size={14} />
          {card.dueDate || 'Sem data limite'}
        </p>
        <p className="flex items-center gap-2">
          <Tag size={14} />
          {card.area}
        </p>
      </div>

      <div className="mt-4 flex gap-2">
        <Button className="flex-1 rounded-full" onClick={() => onEdit(card.id)} variant="secondary">
          <PencilLine size={14} />
          Editar
        </Button>
        <Button className="rounded-full" onClick={() => onDelete(card.id)} variant="danger">
          <Trash2 size={14} />
        </Button>
      </div>
    </article>
  )
}
