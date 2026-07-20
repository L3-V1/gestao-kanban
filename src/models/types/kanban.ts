export const PRIORITY_OPTIONS = ['Baixa', 'Média', 'Alta', 'Crítica'] as const
export const AREA_OPTIONS = ['Frontend', 'Backend', 'DevOps', 'Bug', 'Produto'] as const
export const DEFAULT_COLUMN_TITLES = [
  'Pendências',
  'A Fazer',
  'Em Progresso',
  'Revisão de Código',
  'Concluído',
] as const

export type Priority = (typeof PRIORITY_OPTIONS)[number]
export type Area = (typeof AREA_OPTIONS)[number]
export interface KanbanCard {
  id: string
  columnId: string
  title: string
  description: string
  priority: Priority
  area: Area
  assignee: string
  dueDate: string
  createdAt: string
  updatedAt: string
}

export interface KanbanColumn {
  id: string
  boardId: string
  title: string
  cardIds: string[]
  createdAt: string
  updatedAt: string
}

export interface KanbanBoard {
  id: string
  name: string
  description: string
  columnIds: string[]
  createdAt: string
  updatedAt: string
}

export interface KanbanState {
  boards: Record<string, KanbanBoard>
  columns: Record<string, KanbanColumn>
  cards: Record<string, KanbanCard>
  boardOrder: string[]
  activeBoardId: string
}

export interface BoardDraft {
  name: string
  description: string
}

export interface ColumnDraft {
  title: string
}

export interface CardDraft {
  title: string
  description: string
  priority: Priority
  area: Area
  assignee: string
  dueDate: string
}

export interface BoardView {
  board: KanbanBoard | null
  columns: KanbanColumn[]
  cardsByColumn: Record<string, KanbanCard[]>
}
