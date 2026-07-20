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
    setState((currentState) => {
      const nextState = createBoard(currentState, draft)

      if (hasStateChanged(currentState, nextState)) {
        notifySuccess('Quadro criado com sucesso.')
        return nextState
      }

      notifyError('Informe um nome válido para criar o quadro.')
      return currentState
    })
  }

  const updateBoardHandler = (boardId: string, draft: BoardDraft): void => {
    setState((currentState) => {
      const nextState = updateBoard(currentState, boardId, draft)

      if (hasStateChanged(currentState, nextState)) {
        notifySuccess('Quadro atualizado com sucesso.')
        return nextState
      }

      notifyError('Não foi possível atualizar o quadro.')
      return currentState
    })
  }

  const deleteBoardHandler = (boardId: string): void => {
    setState((currentState) => {
      if (currentState.boardOrder.length === 1) {
        notifyError('É necessário manter pelo menos um quadro.')
        return currentState
      }

      const nextState = deleteBoard(currentState, boardId)

      if (hasStateChanged(currentState, nextState)) {
        notifySuccess('Quadro removido com sucesso.')
      }

      return nextState
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
      notifyError('Selecione ou crie um quadro antes de adicionar colunas.')
      return
    }

    setState((currentState) => {
      const nextState = createColumn(currentState, currentState.activeBoardId, draft)

      if (hasStateChanged(currentState, nextState)) {
        notifySuccess('Coluna criada com sucesso.')
        return nextState
      }

      notifyError('Informe um título válido para criar a coluna.')
      return currentState
    })
  }

  const updateColumnHandler = (columnId: string, draft: ColumnDraft): void => {
    setState((currentState) => {
      const nextState = updateColumn(currentState, columnId, draft)

      if (hasStateChanged(currentState, nextState)) {
        notifySuccess('Coluna atualizada com sucesso.')
        return nextState
      }

      notifyError('Não foi possível atualizar a coluna.')
      return currentState
    })
  }

  const deleteColumnHandler = (columnId: string): void => {
    setState((currentState) => {
      const nextState = deleteColumn(currentState, columnId)

      if (hasStateChanged(currentState, nextState)) {
        notifySuccess('Coluna removida com sucesso.')
      }

      return nextState
    })
  }

  const createCardHandler = (columnId: string, draft: CardDraft): void => {
    setState((currentState) => {
      const nextState = createCard(currentState, columnId, draft)

      if (hasStateChanged(currentState, nextState)) {
        notifySuccess('Cartão criado com sucesso.')
        return nextState
      }

      notifyError('Informe um título válido para criar o cartão.')
      return currentState
    })
  }

  const updateCardHandler = (cardId: string, draft: CardDraft): void => {
    setState((currentState) => {
      const nextState = updateCard(currentState, cardId, draft)

      if (hasStateChanged(currentState, nextState)) {
        notifySuccess('Cartão atualizado com sucesso.')
        return nextState
      }

      notifyError('Não foi possível atualizar o cartão.')
      return currentState
    })
  }

  const deleteCardHandler = (cardId: string): void => {
    setState((currentState) => {
      const nextState = deleteCard(currentState, cardId)

      if (hasStateChanged(currentState, nextState)) {
        notifySuccess('Cartão removido com sucesso.')
      }

      return nextState
    })
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
