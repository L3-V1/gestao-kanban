import { ChevronDown, ChevronUp, FolderKanban, PencilLine, Plus, Trash2 } from 'lucide-react'
import type { KanbanBoard } from '../../models/types/kanban'
import { Button } from '../ui/Button'
import { cn } from '../ui/cn'

interface BoardSidebarProps {
  boards: KanbanBoard[]
  activeBoardId: string
  onCreateBoard: () => void
  onEditBoard: (boardId: string) => void
  onDeleteBoard: (boardId: string) => void
  onMoveBoard: (boardId: string, direction: 'up' | 'down') => void
  onSelectBoard: (boardId: string) => void
}

export function BoardSidebar({
  boards,
  activeBoardId,
  onCreateBoard,
  onEditBoard,
  onDeleteBoard,
  onMoveBoard,
  onSelectBoard,
}: BoardSidebarProps) {
  return (
    <aside className="flex min-h-0 flex-col rounded-[1.75rem] border border-(--color-border) bg-(--color-panel) p-4 shadow-(--shadow-soft) sm:rounded-[28px] sm:p-5">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-(--color-text-soft)">
            Quadros
          </p>
          <h2 className="mt-1 text-lg font-bold text-(--color-text)">Área de trabalho</h2>
        </div>
        <Button className="h-10 w-10 shrink-0 rounded-full p-0" onClick={onCreateBoard}>
          <Plus size={18} />
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {boards.map((board, index) => {
          const isActive = board.id === activeBoardId
          const handleBoardSelect = (): void => {
            onSelectBoard(board.id)
          }

          return (
            <article
              className={cn(
                'group w-full rounded-3xl border p-4 text-left transition duration-200',
                isActive
                  ? 'border-transparent bg-(--color-accent) text-white shadow-[0_20px_35px_-24px_var(--color-accent)]'
                  : 'border-(--color-border) bg-(--color-surface) text-(--color-text) hover:border-(--color-accent)/25 hover:bg-(--color-surface-strong)'
              )}
              key={board.id}
              onClick={handleBoardSelect}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  handleBoardSelect()
                }
              }}
              role="button"
              tabIndex={0}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 gap-3">
                  <span
                    className={cn(
                      'mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl',
                      isActive ? 'bg-white/15 text-white' : 'bg-(--color-panel) text-(--color-accent)'
                    )}
                  >
                    <FolderKanban size={18} />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{board.name}</p>
                    <p
                      className={cn(
                        'mt-1 line-clamp-2 text-xs',
                        isActive ? 'text-white/75' : 'text-(--color-text-muted)'
                      )}
                    >
                      {board.description || 'Sem descrição'}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 flex-col gap-1 opacity-0 transition group-hover:opacity-100">
                  <Button
                    aria-label={`Mover ${board.name} para cima`}
                    className={cn(
                      'h-8 w-8 rounded-full p-0',
                      isActive ? 'bg-white/10 text-white hover:bg-white/15' : ''
                    )}
                    disabled={index === 0}
                    onClick={(event) => {
                      event.stopPropagation()
                      onMoveBoard(board.id, 'up')
                    }}
                    variant={isActive ? 'ghost' : 'secondary'}
                  >
                    <ChevronUp size={14} />
                  </Button>
                  <Button
                    aria-label={`Mover ${board.name} para baixo`}
                    className={cn(
                      'h-8 w-8 rounded-full p-0',
                      isActive ? 'bg-white/10 text-white hover:bg-white/15' : ''
                    )}
                    disabled={index === boards.length - 1}
                    onClick={(event) => {
                      event.stopPropagation()
                      onMoveBoard(board.id, 'down')
                    }}
                    variant={isActive ? 'ghost' : 'secondary'}
                  >
                    <ChevronDown size={14} />
                  </Button>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <Button
                  className={cn(
                    'h-9 flex-1 rounded-full px-3 text-xs sm:flex-none',
                    isActive ? 'bg-white/10 text-white hover:bg-white/15' : ''
                  )}
                  onClick={(event) => {
                    event.stopPropagation()
                    onEditBoard(board.id)
                  }}
                  variant={isActive ? 'ghost' : 'secondary'}
                >
                  <PencilLine size={14} />
                  Editar
                </Button>
                <Button
                  className={cn(
                    'h-9 flex-1 rounded-full px-3 text-xs sm:flex-none',
                    isActive ? 'bg-rose-500/20 text-white hover:bg-rose-500/25' : ''
                  )}
                  disabled={boards.length === 1}
                  onClick={(event) => {
                    event.stopPropagation()
                    onDeleteBoard(board.id)
                  }}
                  variant={isActive ? 'ghost' : 'danger'}
                >
                  <Trash2 size={14} />
                  Remover
                </Button>
              </div>
            </article>
          )
        })}
      </div>
    </aside>
  )
}
