import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Plus, PencilLine, Trash2 } from 'lucide-react'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import type { KanbanCard, KanbanColumn as KanbanColumnType } from '../../models/types/kanban'
import { Button } from '../ui/Button'
import { cn } from '../ui/cn'
import { DragHandle } from './DragHandle'
import { KanbanCard as CardItem } from './KanbanCard'

interface KanbanColumnProps {
  column: KanbanColumnType
  cards: KanbanCard[]
  onCreateCard: (columnId: string) => void
  onEditColumn: (columnId: string) => void
  onDeleteColumn: (columnId: string) => void
  onEditCard: (cardId: string) => void
  onDeleteCard: (cardId: string) => void
}

export function KanbanColumn({
  column,
  cards,
  onCreateCard,
  onEditColumn,
  onDeleteColumn,
  onEditCard,
  onDeleteCard,
}: KanbanColumnProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: column.id,
    data: {
      type: 'column',
    },
  })

  return (
    <section
      className={cn(
        'flex w-[min(18.5rem,calc(100vw-2rem))] shrink-0 snap-start flex-col rounded-3xl border border-(--color-border) bg-(--color-surface) p-3.5 shadow-(--shadow-soft) sm:w-[20rem] sm:rounded-[28px] sm:p-4',
        isDragging && 'opacity-80'
      )}
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            aria-label={`Arrastar ${column.title}`}
            className="cursor-grab touch-none"
            type="button"
            {...attributes}
            {...listeners}
          >
            <DragHandle />
          </button>
          <div>
            <h3 className="text-sm font-semibold text-(--color-text)">{column.title}</h3>
            <p className="text-xs text-(--color-text-soft)">
              {cards.length} {cards.length === 1 ? 'cartão' : 'cartões'}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 gap-2">
          <Button
            aria-label={`Editar ${column.title}`}
            className="h-9 w-9 rounded-full p-0"
            onClick={() => onEditColumn(column.id)}
            variant="secondary"
          >
            <PencilLine size={14} />
          </Button>
          <Button
            aria-label={`Excluir ${column.title}`}
            className="h-9 w-9 rounded-full p-0"
            onClick={() => onDeleteColumn(column.id)}
            variant="danger"
          >
            <Trash2 size={14} />
          </Button>
        </div>
      </div>

      <Button className="mb-4 w-full rounded-full sm:w-auto" onClick={() => onCreateCard(column.id)} variant="secondary">
        <Plus size={14} />
        Novo cartão
      </Button>

      <SortableContext items={cards.map((card) => card.id)} strategy={verticalListSortingStrategy}>
        <div className="flex min-h-24 flex-1 flex-col gap-3 rounded-[1.25rem] border border-dashed border-(--color-border) p-2 sm:rounded-3xl">
          {cards.length === 0 ? (
            <div className="flex flex-1 items-center justify-center rounded-[20px] bg-(--color-panel) px-4 py-8 text-center text-sm text-(--color-text-muted)">
              Solte cartões aqui ou crie uma nova tarefa.
            </div>
          ) : null}

          {cards.map((card) => (
            <CardItem card={card} key={card.id} onDelete={onDeleteCard} onEdit={onEditCard} />
          ))}
        </div>
      </SortableContext>
    </section>
  )
}
