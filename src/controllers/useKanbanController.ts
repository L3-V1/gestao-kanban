import { useLocalStorage } from './useLocalStorage'
import {
  buildBoardView,
  createBoard,
  createCard,
  createColumn,
  deleteBoard,
  deleteCard,
  deleteColumn,
  moveBoard,
  moveCard,
  moveColumn,
  selectBoard,
  updateBoard,
  updateCard,
  updateColumn,
} from '../models/kanbanDomain'
import { getBoardList, getCardById, getColumnById } from '../models/kanbanSelectors'
import type {
  BoardDraft,
  CardDraft,
  ColumnDraft,
  KanbanState,
} from '../models/types/kanban'
import { loadKanbanState, saveKanbanState } from '../services/storageService'

const createFallbackState = (): KanbanState => loadKanbanState()

/**
 * Connects the kanban domain with the React UI.
 */
export const useKanbanController = () => {
  const [state, setState] = useLocalStorage(createFallbackState, {
    read: loadKanbanState,
    write: saveKanbanState,
  })

  const boardView = buildBoardView(state, state.activeBoardId)
  const boards = getBoardList(state)

  const createBoardHandler = (draft: BoardDraft): void => {
    setState((currentState) => createBoard(currentState, draft))
  }

  const updateBoardHandler = (boardId: string, draft: BoardDraft): void => {
    setState((currentState) => updateBoard(currentState, boardId, draft))
  }

  const deleteBoardHandler = (boardId: string): void => {
    setState((currentState) => {
      if (currentState.boardOrder.length === 1) {
        return currentState
      }

      return deleteBoard(currentState, boardId)
    })
  }

  const moveBoardHandler = (boardId: string, direction: 'up' | 'down'): void => {
    setState((currentState) => moveBoard(currentState, boardId, direction))
  }

  const selectBoardHandler = (boardId: string): void => {
    setState((currentState) => selectBoard(currentState, boardId))
  }

  const createColumnHandler = (draft: ColumnDraft): void => {
    if (!state.activeBoardId) {
      return
    }

    setState((currentState) => createColumn(currentState, currentState.activeBoardId, draft))
  }

  const updateColumnHandler = (columnId: string, draft: ColumnDraft): void => {
    setState((currentState) => updateColumn(currentState, columnId, draft))
  }

  const deleteColumnHandler = (columnId: string): void => {
    setState((currentState) => deleteColumn(currentState, columnId))
  }

  const createCardHandler = (columnId: string, draft: CardDraft): void => {
    setState((currentState) => createCard(currentState, columnId, draft))
  }

  const updateCardHandler = (cardId: string, draft: CardDraft): void => {
    setState((currentState) => updateCard(currentState, cardId, draft))
  }

  const deleteCardHandler = (cardId: string): void => {
    setState((currentState) => deleteCard(currentState, cardId))
  }

  const moveColumnHandler = (activeColumnId: string, overColumnId: string): void => {
    if (!state.activeBoardId) {
      return
    }

    setState((currentState) =>
      moveColumn(currentState, currentState.activeBoardId, activeColumnId, overColumnId)
    )
  }

  const moveCardHandler = (
    activeCardId: string,
    sourceColumnId: string,
    destinationColumnId: string,
    destinationIndex: number
  ): void => {
    setState((currentState) =>
      moveCard(currentState, activeCardId, sourceColumnId, destinationColumnId, destinationIndex)
    )
  }

  return {
    state,
    boards,
    activeBoard: boardView.board,
    activeColumns: boardView.columns,
    cardsByColumn: boardView.cardsByColumn,
    getColumnById: (columnId: string) => getColumnById(state, columnId),
    getCardById: (cardId: string) => getCardById(state, cardId),
    createBoard: createBoardHandler,
    updateBoard: updateBoardHandler,
    deleteBoard: deleteBoardHandler,
    moveBoard: moveBoardHandler,
    selectBoard: selectBoardHandler,
    createColumn: createColumnHandler,
    updateColumn: updateColumnHandler,
    deleteColumn: deleteColumnHandler,
    moveColumn: moveColumnHandler,
    createCard: createCardHandler,
    updateCard: updateCardHandler,
    deleteCard: deleteCardHandler,
    moveCard: moveCardHandler,
  }
}
