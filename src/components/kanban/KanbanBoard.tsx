import {
  closestCenter,
  DndContext,
  DragOverlay,
  type DragStartEvent,
  pointerWithin,
  type DragEndEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { useState } from 'react'
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import type { KanbanCard, KanbanColumn } from '../../models/types/kanban'
import { KanbanCard as CardOverlay } from './KanbanCard'
import { KanbanColumn as ColumnCard } from './KanbanColumn'

interface KanbanBoardProps {
  columns: KanbanColumn[]
  cardsByColumn: Record<string, KanbanCard[]>
  onMoveColumn: (activeColumnId: string, overColumnId: string) => void
  onMoveCard: (
    activeCardId: string,
    sourceColumnId: string,
    destinationColumnId: string,
    destinationIndex: number
  ) => void
  onCreateCard: (columnId: string) => void
  onEditColumn: (columnId: string) => void
  onDeleteColumn: (columnId: string) => void
  onEditCard: (cardId: string) => void
  onDeleteCard: (cardId: string) => void
}

const findCardLocation = (
  cardsByColumn: Record<string, KanbanCard[]>,
  cardId: string
): { columnId: string; index: number } | null => {
  for (const [columnId, cards] of Object.entries(cardsByColumn)) {
    const index = cards.findIndex((card) => card.id === cardId)

    if (index >= 0) {
      return { columnId, index }
    }
  }

  return null
}

export function KanbanBoard({
  columns,
  cardsByColumn,
  onMoveColumn,
  onMoveCard,
  onCreateCard,
  onEditColumn,
  onDeleteColumn,
  onEditCard,
  onDeleteCard,
}: KanbanBoardProps) {
  const [activeCardId, setActiveCardId] = useState<string | null>(null)
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: { distance: 4 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 120, tolerance: 6 },
    })
  )

  const moveCardFromEvent = (
    activeCardId: string,
    destinationId: string,
    destinationType: string | undefined
  ): void => {
    const currentLocation = findCardLocation(cardsByColumn, activeCardId)

    if (!currentLocation) {
      return
    }

    if (destinationType === 'card') {
      const targetLocation = findCardLocation(cardsByColumn, destinationId)

      if (!targetLocation) {
        return
      }

      onMoveCard(activeCardId, currentLocation.columnId, targetLocation.columnId, targetLocation.index)
      return
    }

    if (destinationType === 'column') {
      const destinationCards = cardsByColumn[destinationId] ?? []

      onMoveCard(activeCardId, currentLocation.columnId, destinationId, destinationCards.length)
    }
  }

  const handleDragStart = ({ active }: DragStartEvent): void => {
    if (active.data.current?.type === 'card') {
      setActiveCardId(String(active.id))
    }
  }

  const handleDragEnd = ({ active, over }: DragEndEvent): void => {
    setActiveCardId(null)

    if (!over || active.id === over.id) {
      return
    }

    const activeType = active.data.current?.type
    const overType = over.data.current?.type

    if (activeType === 'column' && overType === 'column') {
      onMoveColumn(String(active.id), String(over.id))
      return
    }

    if (activeType !== 'card') {
      return
    }

    moveCardFromEvent(String(active.id), String(over.id), overType)
  }

  const handleDragCancel = (): void => {
    setActiveCardId(null)
  }

  const collisionDetection = (args: Parameters<typeof closestCenter>[0]) =>
    pointerWithin(args).length > 0 ? pointerWithin(args) : closestCenter(args)
  const activeCard = activeCardId ? findCardLocation(cardsByColumn, activeCardId) : null
  const activeCardData = activeCard
    ? (cardsByColumn[activeCard.columnId] ?? []).find((card) => card.id === activeCardId) ?? null
    : null

  return (
    <DndContext
      collisionDetection={collisionDetection}
      onDragCancel={handleDragCancel}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      sensors={sensors}
    >
      <SortableContext items={columns.map((column) => column.id)} strategy={horizontalListSortingStrategy}>
        <div className="-mx-4 flex min-h-96 gap-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:min-h-136 sm:gap-5 sm:px-0">
          {columns.map((column) => (
            <ColumnCard
              cards={cardsByColumn[column.id] ?? []}
              column={column}
              key={column.id}
              onCreateCard={onCreateCard}
              onDeleteCard={onDeleteCard}
              onDeleteColumn={onDeleteColumn}
              onEditCard={onEditCard}
              onEditColumn={onEditColumn}
            />
          ))}
        </div>
      </SortableContext>
      <DragOverlay dropAnimation={null}>
        {activeCardData ? (
          <div className="w-[min(20rem,calc(100vw-2rem))]">
            <CardOverlay
              card={activeCardData}
              isOverlay
              onDelete={onDeleteCard}
              onEdit={onEditCard}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
