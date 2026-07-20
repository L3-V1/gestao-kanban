import { useLocalStorage } from './useLocalStorage'
import { toast } from 'react-hot-toast'
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

const hasStateChanged = (previousState: KanbanState, nextState: KanbanState): boolean =>
  previousState !== nextState

const notifySuccess = (message: string): void => {
  toast.success(message)
}

const notifyError = (message: string): void => {
  toast.error(message)
}

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
    const nextState = createBoard(state, draft)

    if (hasStateChanged(state, nextState)) {
      setState(nextState)
      notifySuccess('Quadro criado com sucesso.')
      return
    }

    notifyError('Informe um nome válido para criar o quadro.')
  }

  const updateBoardHandler = (boardId: string, draft: BoardDraft): void => {
    const nextState = updateBoard(state, boardId, draft)

    if (hasStateChanged(state, nextState)) {
      setState(nextState)
      notifySuccess('Quadro atualizado com sucesso.')
      return
    }

    notifyError('Não foi possível atualizar o quadro.')
  }

  const deleteBoardHandler = (boardId: string): void => {
    if (state.boardOrder.length === 1) {
      notifyError('É necessário manter pelo menos um quadro.')
      return
    }

    const nextState = deleteBoard(state, boardId)

    if (hasStateChanged(state, nextState)) {
      setState(nextState)
      notifySuccess('Quadro removido com sucesso.')
      return
    }

    notifyError('Não foi possível remover o quadro.')
  }

  const moveBoardHandler = (boardId: string, direction: 'up' | 'down'): void => {
    setState((currentState) => moveBoard(currentState, boardId, direction))
  }

  const selectBoardHandler = (boardId: string): void => {
    setState((currentState) => selectBoard(currentState, boardId))
  }

  const createColumnHandler = (draft: ColumnDraft): void => {
    if (!state.activeBoardId) {
      notifyError('Selecione ou crie um quadro antes de adicionar colunas.')
      return
    }

    const nextState = createColumn(state, state.activeBoardId, draft)

    if (hasStateChanged(state, nextState)) {
      setState(nextState)
      notifySuccess('Coluna criada com sucesso.')
      return
    }

    notifyError('Informe um título válido para criar a coluna.')
  }

  const updateColumnHandler = (columnId: string, draft: ColumnDraft): void => {
    const nextState = updateColumn(state, columnId, draft)

    if (hasStateChanged(state, nextState)) {
      setState(nextState)
      notifySuccess('Coluna atualizada com sucesso.')
      return
    }

    notifyError('Não foi possível atualizar a coluna.')
  }

  const deleteColumnHandler = (columnId: string): void => {
    const nextState = deleteColumn(state, columnId)

    if (hasStateChanged(state, nextState)) {
      setState(nextState)
      notifySuccess('Coluna removida com sucesso.')
      return
    }

    notifyError('Não foi possível remover a coluna.')
  }

  const createCardHandler = (columnId: string, draft: CardDraft): void => {
    const nextState = createCard(state, columnId, draft)

    if (hasStateChanged(state, nextState)) {
      setState(nextState)
      notifySuccess('Cartão criado com sucesso.')
      return
    }

    notifyError('Informe um título válido para criar o cartão.')
  }

  const updateCardHandler = (cardId: string, draft: CardDraft): void => {
    const nextState = updateCard(state, cardId, draft)

    if (hasStateChanged(state, nextState)) {
      setState(nextState)
      notifySuccess('Cartão atualizado com sucesso.')
      return
    }

    notifyError('Não foi possível atualizar o cartão.')
  }

  const deleteCardHandler = (cardId: string): void => {
    const nextState = deleteCard(state, cardId)

    if (hasStateChanged(state, nextState)) {
      setState(nextState)
      notifySuccess('Cartão removido com sucesso.')
      return
    }

    notifyError('Não foi possível remover o cartão.')
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
