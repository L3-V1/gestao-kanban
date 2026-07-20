import { useState } from 'react'
import { FolderPlus, Layers3, Plus } from 'lucide-react'
import { BoardEditorModal } from './components/kanban/BoardEditorModal'
import { BoardSidebar } from './components/kanban/BoardSidebar'
import { CardEditorModal } from './components/kanban/CardEditorModal'
import { ColumnEditorModal } from './components/kanban/ColumnEditorModal'
import { KanbanBoard } from './components/kanban/KanbanBoard'
import { Button } from './components/ui/Button'
import { useKanbanController } from './controllers/useKanbanController'
import type { BoardDraft, CardDraft, ColumnDraft } from './models/types/kanban'

const EMPTY_BOARD_DRAFT: BoardDraft = {
  name: '',
  description: '',
}

const EMPTY_COLUMN_DRAFT: ColumnDraft = {
  title: '',
}

const EMPTY_CARD_DRAFT: CardDraft = {
  title: '',
  description: '',
  priority: 'Média',
  area: 'Frontend',
  assignee: '',
  dueDate: '',
}

type BoardModalState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; boardId: string }

type ColumnModalState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; columnId: string }

type CardModalState =
  | { mode: 'closed' }
  | { mode: 'create'; columnId: string }
  | { mode: 'edit'; cardId: string }

export default function App() {
  const controller = useKanbanController()
  const [boardModal, setBoardModal] = useState<BoardModalState>({ mode: 'closed' })
  const [columnModal, setColumnModal] = useState<ColumnModalState>({ mode: 'closed' })
  const [cardModal, setCardModal] = useState<CardModalState>({ mode: 'closed' })

  const currentBoardDraft =
    boardModal.mode === 'edit' ? controller.state.boards[boardModal.boardId] ?? null : null
  const currentColumnDraft =
    columnModal.mode === 'edit' ? controller.getColumnById(columnModal.columnId) : null
  const currentCardDraft = cardModal.mode === 'edit' ? controller.getCardById(cardModal.cardId) : null

  const boardDraftValue: BoardDraft = currentBoardDraft
    ? {
        name: currentBoardDraft.name,
        description: currentBoardDraft.description,
      }
    : EMPTY_BOARD_DRAFT

  const columnDraftValue: ColumnDraft = currentColumnDraft
    ? {
        title: currentColumnDraft.title,
      }
    : EMPTY_COLUMN_DRAFT

  const cardDraftValue: CardDraft = currentCardDraft
    ? {
        title: currentCardDraft.title,
        description: currentCardDraft.description,
        priority: currentCardDraft.priority,
        area: currentCardDraft.area,
        assignee: currentCardDraft.assignee,
        dueDate: currentCardDraft.dueDate,
      }
    : EMPTY_CARD_DRAFT

  return (
    <main className="min-h-screen px-3 py-4 sm:px-4 sm:py-6 md:px-6 lg:px-10">
      <div className="mx-auto max-w-384">
        <section className="rounded-4xl border border-white/20 bg-(--color-panel) p-5 shadow-(--shadow-soft) backdrop-blur sm:rounded-4xl sm:p-6 md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-(--color-text-soft)">
                Gestão de Projetos de T.I.
              </p>
              <h1 className="mt-3 text-3xl font-bold tracking-tight text-(--color-text) sm:text-4xl md:text-5xl">
                Gestão Kanban
              </h1>
              <p className="mt-4 max-w-2xl text-sm text-(--color-text-muted) sm:text-base">
                Gerencie quadros, colunas e cartões com persistência local no navegador, drag and
                drop fluido e uma base pronta para evoluir com uma arquitetura frontend maior.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <Button className="w-full sm:w-auto" onClick={() => setBoardModal({ mode: 'create' })}>
                <FolderPlus size={16} />
                Novo quadro
              </Button>
              <Button
                className="w-full sm:w-auto"
                onClick={() => setColumnModal({ mode: 'create' })}
                variant="secondary"
              >
                <Plus size={16} />
                Nova coluna
              </Button>
            </div>
          </div>
        </section>

        <section className="mt-6 flex flex-col gap-4 xl:gap-6">
          <BoardSidebar
            activeBoardId={controller.state.activeBoardId}
            boards={controller.boards}
            onCreateBoard={() => setBoardModal({ mode: 'create' })}
            onDeleteBoard={controller.deleteBoard}
            onEditBoard={(boardId) => setBoardModal({ mode: 'edit', boardId })}
            onMoveBoard={controller.moveBoard}
            onSelectBoard={controller.selectBoard}
          />

          <div className="rounded-[1.75rem] border border-(--color-border) bg-(--color-panel) p-4 shadow-(--shadow-soft) sm:rounded-[28px] sm:p-5">
            {controller.activeBoard ? (
              <>
                <div className="mb-5 flex flex-col gap-4 sm:mb-6 lg:flex-row lg:items-center lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex items-start gap-3 sm:items-center">
                      <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-(--color-accent)/15 text-(--color-accent) sm:h-12 sm:w-12">
                        <Layers3 size={20} />
                      </span>
                      <div className="min-w-0">
                        <h2 className="text-xl font-bold text-(--color-text) sm:text-2xl">
                          {controller.activeBoard.name}
                        </h2>
                        <p className="mt-1 text-sm text-(--color-text-muted)">
                          {controller.activeBoard.description || 'Sem descrição para este quadro.'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button
                    className="w-full sm:w-auto"
                    onClick={() =>
                      setCardModal({ mode: 'create', columnId: controller.activeColumns[0]?.id ?? '' })
                    }
                  >
                    <Plus size={16} />
                    Cartão rápido
                  </Button>
                </div>

                <KanbanBoard
                  cardsByColumn={controller.cardsByColumn}
                  columns={controller.activeColumns}
                  onCreateCard={(columnId) => setCardModal({ mode: 'create', columnId })}
                  onDeleteCard={controller.deleteCard}
                  onDeleteColumn={controller.deleteColumn}
                  onEditCard={(cardId) => setCardModal({ mode: 'edit', cardId })}
                  onEditColumn={(columnId) => setColumnModal({ mode: 'edit', columnId })}
                  onMoveCard={controller.moveCard}
                  onMoveColumn={controller.moveColumn}
                />
              </>
            ) : (
              <div className="flex min-h-96 flex-col items-center justify-center rounded-3xl border border-dashed border-(--color-border) bg-(--color-surface) px-5 py-10 text-center sm:min-h-128 sm:rounded-[28px] sm:px-6">
                <h2 className="text-xl font-bold text-(--color-text) sm:text-2xl">Nenhum quadro ativo</h2>
                <p className="mt-3 max-w-md text-sm text-(--color-text-muted)">
                  Crie o primeiro quadro para começar a organizar sua esteira de entrega de T.I.
                </p>
                <Button className="mt-6 w-full sm:w-auto" onClick={() => setBoardModal({ mode: 'create' })}>
                  <FolderPlus size={16} />
                  Criar quadro
                </Button>
              </div>
            )}
          </div>
        </section>
      </div>

      <BoardEditorModal
        initialValue={boardDraftValue}
        key={boardModal.mode === 'edit' ? `board-${boardModal.boardId}` : `board-${boardModal.mode}`}
        mode={boardModal.mode === 'edit' ? 'edit' : 'create'}
        onClose={() => setBoardModal({ mode: 'closed' })}
        onSubmit={(draft) => {
          if (boardModal.mode === 'edit') {
            controller.updateBoard(boardModal.boardId, draft)
            return
          }

          controller.createBoard(draft)
        }}
        open={boardModal.mode !== 'closed'}
      />

      <ColumnEditorModal
        initialValue={columnDraftValue}
        key={columnModal.mode === 'edit' ? `column-${columnModal.columnId}` : `column-${columnModal.mode}`}
        mode={columnModal.mode === 'edit' ? 'edit' : 'create'}
        onClose={() => setColumnModal({ mode: 'closed' })}
        onSubmit={(draft) => {
          if (columnModal.mode === 'edit') {
            controller.updateColumn(columnModal.columnId, draft)
            return
          }

          controller.createColumn(draft)
        }}
        open={columnModal.mode !== 'closed'}
      />

      <CardEditorModal
        initialValue={cardDraftValue}
        key={cardModal.mode === 'edit' ? `card-${cardModal.cardId}` : `card-${cardModal.mode}`}
        mode={cardModal.mode === 'edit' ? 'edit' : 'create'}
        onClose={() => setCardModal({ mode: 'closed' })}
        onSubmit={(draft) => {
          if (cardModal.mode === 'edit') {
            controller.updateCard(cardModal.cardId, draft)
            return
          }

          if (cardModal.mode === 'create' && cardModal.columnId) {
            controller.createCard(cardModal.columnId, draft)
          }
        }}
        open={cardModal.mode !== 'closed'}
      />
    </main>
  )
}
