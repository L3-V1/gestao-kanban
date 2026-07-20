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
import { DEFAULT_COLUMN_TITLES } from './types/kanban'

const createEntityId = (prefix: string): string => `${prefix}-${crypto.randomUUID()}`

const createTimestamp = (): string => new Date().toISOString()

const sanitizeText = (value: string): string => value.trim().replace(/\s+/g, ' ')

const sanitizeMultilineText = (value: string): string => value.trim()

const ensureBoardExists = (state: KanbanState, boardId: string): KanbanBoard | null =>
  state.boards[boardId] ?? null

const ensureColumnExists = (state: KanbanState, columnId: string): KanbanColumn | null =>
  state.columns[columnId] ?? null

const ensureCardExists = (state: KanbanState, cardId: string): KanbanCard | null =>
  state.cards[cardId] ?? null

const removeCardsFromColumn = (
  cards: Record<string, KanbanCard>,
  cardIds: string[]
): Record<string, KanbanCard> => {
  const nextCards = { ...cards }

  for (const cardId of cardIds) {
    delete nextCards[cardId]
  }

  return nextCards
}

const removeColumnsFromBoard = (
  columns: Record<string, KanbanColumn>,
  columnIds: string[]
): Record<string, KanbanColumn> => {
  const nextColumns = { ...columns }

  for (const columnId of columnIds) {
    delete nextColumns[columnId]
  }

  return nextColumns
}

/**
 * Creates an empty normalized kanban state.
 */
export const createEmptyKanbanState = (): KanbanState => ({
  boards: {},
  columns: {},
  cards: {},
  boardOrder: [],
  activeBoardId: '',
})

/**
 * Builds a board-centric view optimized for rendering.
 */
export const buildBoardView = (state: KanbanState, boardId: string): BoardView => {
  const board = ensureBoardExists(state, boardId)

  if (!board) {
    return {
      board: null,
      columns: [],
      cardsByColumn: {},
    }
  }

  const columns = board.columnIds
    .map((columnId) => state.columns[columnId])
    .filter((column): column is KanbanColumn => Boolean(column))

  const cardsByColumn = Object.fromEntries(
    columns.map((column) => [
      column.id,
      column.cardIds
        .map((cardId) => state.cards[cardId])
        .filter((card): card is KanbanCard => Boolean(card)),
    ])
  )

  return { board, columns, cardsByColumn }
}

/**
 * Creates a board with starter columns.
 */
export const createBoard = (state: KanbanState, draft: BoardDraft): KanbanState => {
  const name = sanitizeText(draft.name)
  const description = sanitizeMultilineText(draft.description)

  if (!name) {
    return state
  }

  const boardId = createEntityId('board')
  const now = createTimestamp()
  const nextColumns = { ...state.columns }
  const columnIds = DEFAULT_COLUMN_TITLES.map((title) => {
    const columnId = createEntityId('column')

    nextColumns[columnId] = {
      id: columnId,
      boardId,
      title,
      cardIds: [],
      createdAt: now,
      updatedAt: now,
    }

    return columnId
  })

  return {
    ...state,
    boards: {
      ...state.boards,
      [boardId]: {
        id: boardId,
        name,
        description,
        columnIds,
        createdAt: now,
        updatedAt: now,
      },
    },
    columns: nextColumns,
    boardOrder: [...state.boardOrder, boardId],
    activeBoardId: boardId,
  }
}

/**
 * Updates board metadata.
 */
export const updateBoard = (
  state: KanbanState,
  boardId: string,
  draft: BoardDraft
): KanbanState => {
  const board = ensureBoardExists(state, boardId)
  const name = sanitizeText(draft.name)

  if (!board || !name) {
    return state
  }

  return {
    ...state,
    boards: {
      ...state.boards,
      [boardId]: {
        ...board,
        name,
        description: sanitizeMultilineText(draft.description),
        updatedAt: createTimestamp(),
      },
    },
  }
}

/**
 * Removes a board and its nested columns and cards.
 */
export const deleteBoard = (state: KanbanState, boardId: string): KanbanState => {
  const board = ensureBoardExists(state, boardId)

  if (!board) {
    return state
  }

  const cardIds = board.columnIds.flatMap((columnId) => state.columns[columnId]?.cardIds ?? [])
  const nextBoards = { ...state.boards }

  delete nextBoards[boardId]

  const nextBoardOrder = state.boardOrder.filter((id) => id !== boardId)
  const nextActiveBoardId =
    state.activeBoardId === boardId ? (nextBoardOrder[0] ?? '') : state.activeBoardId

  return {
    ...state,
    boards: nextBoards,
    columns: removeColumnsFromBoard(state.columns, board.columnIds),
    cards: removeCardsFromColumn(state.cards, cardIds),
    boardOrder: nextBoardOrder,
    activeBoardId: nextActiveBoardId,
  }
}

/**
 * Moves a board up or down within the sidebar order.
 */
export const moveBoard = (
  state: KanbanState,
  boardId: string,
  direction: 'up' | 'down'
): KanbanState => {
  const currentIndex = state.boardOrder.indexOf(boardId)
  const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1

  if (currentIndex < 0 || targetIndex < 0 || targetIndex >= state.boardOrder.length) {
    return state
  }

  const boardOrder = [...state.boardOrder]
  ;[boardOrder[currentIndex], boardOrder[targetIndex]] = [
    boardOrder[targetIndex],
    boardOrder[currentIndex],
  ]

  return {
    ...state,
    boardOrder,
  }
}

/**
 * Selects the active board shown in the workspace.
 */
export const selectBoard = (state: KanbanState, boardId: string): KanbanState => {
  if (!state.boards[boardId]) {
    return state
  }

  return {
    ...state,
    activeBoardId: boardId,
  }
}

/**
 * Adds a column to an existing board.
 */
export const createColumn = (
  state: KanbanState,
  boardId: string,
  draft: ColumnDraft
): KanbanState => {
  const board = ensureBoardExists(state, boardId)
  const title = sanitizeText(draft.title)

  if (!board || !title) {
    return state
  }

  const columnId = createEntityId('column')
  const now = createTimestamp()

  return {
    ...state,
    boards: {
      ...state.boards,
      [boardId]: {
        ...board,
        columnIds: [...board.columnIds, columnId],
        updatedAt: now,
      },
    },
    columns: {
      ...state.columns,
      [columnId]: {
        id: columnId,
        boardId,
        title,
        cardIds: [],
        createdAt: now,
        updatedAt: now,
      },
    },
  }
}

/**
 * Updates a column title.
 */
export const updateColumn = (
  state: KanbanState,
  columnId: string,
  draft: ColumnDraft
): KanbanState => {
  const column = ensureColumnExists(state, columnId)
  const title = sanitizeText(draft.title)

  if (!column || !title) {
    return state
  }

  return {
    ...state,
    columns: {
      ...state.columns,
      [columnId]: {
        ...column,
        title,
        updatedAt: createTimestamp(),
      },
    },
  }
}

/**
 * Removes a column and all of its cards.
 */
export const deleteColumn = (state: KanbanState, columnId: string): KanbanState => {
  const column = ensureColumnExists(state, columnId)

  if (!column) {
    return state
  }

  const board = ensureBoardExists(state, column.boardId)

  if (!board) {
    return state
  }

  const nextColumns = { ...state.columns }

  delete nextColumns[columnId]

  return {
    ...state,
    boards: {
      ...state.boards,
      [board.id]: {
        ...board,
        columnIds: board.columnIds.filter((id) => id !== columnId),
        updatedAt: createTimestamp(),
      },
    },
    columns: nextColumns,
    cards: removeCardsFromColumn(state.cards, column.cardIds),
  }
}

/**
 * Reorders a column within a board.
 */
export const moveColumn = (
  state: KanbanState,
  boardId: string,
  activeColumnId: string,
  overColumnId: string
): KanbanState => {
  const board = ensureBoardExists(state, boardId)

  if (!board || activeColumnId === overColumnId) {
    return state
  }

  const fromIndex = board.columnIds.indexOf(activeColumnId)
  const toIndex = board.columnIds.indexOf(overColumnId)

  if (fromIndex < 0 || toIndex < 0) {
    return state
  }

  const columnIds = [...board.columnIds]
  const [movedColumnId] = columnIds.splice(fromIndex, 1)

  columnIds.splice(toIndex, 0, movedColumnId)

  return {
    ...state,
    boards: {
      ...state.boards,
      [boardId]: {
        ...board,
        columnIds,
        updatedAt: createTimestamp(),
      },
    },
  }
}

/**
 * Adds a new card to a column.
 */
export const createCard = (
  state: KanbanState,
  columnId: string,
  draft: CardDraft
): KanbanState => {
  const column = ensureColumnExists(state, columnId)
  const title = sanitizeText(draft.title)

  if (!column || !title) {
    return state
  }

  const cardId = createEntityId('card')
  const now = createTimestamp()

  return {
    ...state,
    columns: {
      ...state.columns,
      [columnId]: {
        ...column,
        cardIds: [...column.cardIds, cardId],
        updatedAt: now,
      },
    },
    cards: {
      ...state.cards,
      [cardId]: {
        id: cardId,
        columnId,
        title,
        description: sanitizeMultilineText(draft.description),
        priority: draft.priority,
        area: draft.area,
        assignee: sanitizeText(draft.assignee),
        dueDate: draft.dueDate,
        createdAt: now,
        updatedAt: now,
      },
    },
  }
}

/**
 * Updates an existing card.
 */
export const updateCard = (
  state: KanbanState,
  cardId: string,
  draft: CardDraft
): KanbanState => {
  const card = ensureCardExists(state, cardId)
  const title = sanitizeText(draft.title)

  if (!card || !title) {
    return state
  }

  return {
    ...state,
    cards: {
      ...state.cards,
      [cardId]: {
        ...card,
        title,
        description: sanitizeMultilineText(draft.description),
        priority: draft.priority,
        area: draft.area,
        assignee: sanitizeText(draft.assignee),
        dueDate: draft.dueDate,
        updatedAt: createTimestamp(),
      },
    },
  }
}

/**
 * Deletes a card and removes its reference from the source column.
 */
export const deleteCard = (state: KanbanState, cardId: string): KanbanState => {
  const card = ensureCardExists(state, cardId)

  if (!card) {
    return state
  }

  const column = ensureColumnExists(state, card.columnId)

  if (!column) {
    return state
  }

  const nextCards = { ...state.cards }

  delete nextCards[cardId]

  return {
    ...state,
    columns: {
      ...state.columns,
      [column.id]: {
        ...column,
        cardIds: column.cardIds.filter((id) => id !== cardId),
        updatedAt: createTimestamp(),
      },
    },
    cards: nextCards,
  }
}

/**
 * Moves a card across columns or inside the same column.
 */
export const moveCard = (
  state: KanbanState,
  activeCardId: string,
  sourceColumnId: string,
  destinationColumnId: string,
  destinationIndex: number
): KanbanState => {
  const card = ensureCardExists(state, activeCardId)
  const sourceColumn = ensureColumnExists(state, sourceColumnId)
  const destinationColumn = ensureColumnExists(state, destinationColumnId)

  if (!card || !sourceColumn || !destinationColumn) {
    return state
  }

  const sourceIndex = sourceColumn.cardIds.indexOf(activeCardId)

  if (sourceIndex < 0) {
    return state
  }

  if (sourceColumnId === destinationColumnId) {
    const safeDestinationIndex = Math.max(0, Math.min(destinationIndex, sourceColumn.cardIds.length - 1))

    if (sourceIndex === safeDestinationIndex) {
      return state
    }

    const nextCardIds = [...sourceColumn.cardIds]
    const [movedCardId] = nextCardIds.splice(sourceIndex, 1)

    nextCardIds.splice(safeDestinationIndex, 0, movedCardId)

    return {
      ...state,
      columns: {
        ...state.columns,
        [sourceColumnId]: {
          ...sourceColumn,
          cardIds: nextCardIds,
          updatedAt: createTimestamp(),
        },
      },
      cards: {
        ...state.cards,
        [activeCardId]: {
          ...card,
          updatedAt: createTimestamp(),
        },
      },
    }
  }

  const safeDestinationIndex = Math.max(0, Math.min(destinationIndex, destinationColumn.cardIds.length))
  const nextSourceCardIds = sourceColumn.cardIds.filter((id) => id !== activeCardId)
  const nextDestinationCardIds = [...destinationColumn.cardIds]

  if (card.columnId === destinationColumnId && safeDestinationIndex === destinationColumn.cardIds.indexOf(activeCardId)) {
    return state
  }

  nextDestinationCardIds.splice(safeDestinationIndex, 0, activeCardId)

  return {
    ...state,
    columns: {
      ...state.columns,
      [sourceColumnId]: {
        ...sourceColumn,
        cardIds: nextSourceCardIds,
        updatedAt: createTimestamp(),
      },
      [destinationColumnId]: {
        ...destinationColumn,
        cardIds: nextDestinationCardIds,
        updatedAt: createTimestamp(),
      },
    },
    cards: {
      ...state.cards,
      [activeCardId]: {
        ...card,
        columnId: destinationColumnId,
        updatedAt: createTimestamp(),
      },
    },
  }
}
