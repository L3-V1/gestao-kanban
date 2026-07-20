import type {
  BoardDraft,
  BoardView,
  CardDraft,
  ColumnDraft,
  KanbanBoard,
  KanbanCard,
  KanbanColumn,
  KanbanState,
} from './types/kanban'

export interface CardLocation {
  columnId: string
  index: number
}

export const EMPTY_BOARD_DRAFT: BoardDraft = {
  name: '',
  description: '',
}

export const EMPTY_COLUMN_DRAFT: ColumnDraft = {
  title: '',
}

export const EMPTY_CARD_DRAFT: CardDraft = {
  title: '',
  description: '',
  priority: 'Média',
  area: 'Frontend',
  assignee: '',
  dueDate: '',
}

export const getBoardById = (state: KanbanState, boardId: string): KanbanBoard | null =>
  state.boards[boardId] ?? null

export const getColumnById = (state: KanbanState, columnId: string): KanbanColumn | null =>
  state.columns[columnId] ?? null

export const getCardById = (state: KanbanState, cardId: string): KanbanCard | null =>
  state.cards[cardId] ?? null

export const getBoardList = (state: KanbanState): KanbanBoard[] =>
  state.boardOrder
    .map((boardId) => state.boards[boardId])
    .filter((board): board is KanbanBoard => Boolean(board))

export const toBoardDraft = (board: KanbanBoard | null): BoardDraft =>
  board
    ? {
        name: board.name,
        description: board.description,
      }
    : EMPTY_BOARD_DRAFT

export const toColumnDraft = (column: KanbanColumn | null): ColumnDraft =>
  column
    ? {
        title: column.title,
      }
    : EMPTY_COLUMN_DRAFT

export const toCardDraft = (card: KanbanCard | null): CardDraft =>
  card
    ? {
        title: card.title,
        description: card.description,
        priority: card.priority,
        area: card.area,
        assignee: card.assignee,
        dueDate: card.dueDate,
      }
    : EMPTY_CARD_DRAFT

export const findCardLocation = (
  cardsByColumn: BoardView['cardsByColumn'],
  cardId: string
): CardLocation | null => {
  for (const [columnId, cards] of Object.entries(cardsByColumn)) {
    const index = cards.findIndex((card) => card.id === cardId)

    if (index >= 0) {
      return { columnId, index }
    }
  }

  return null
}
