import { createEmptyKanbanState } from '../models/kanbanDomain'
import type { KanbanState } from '../models/types/kanban'

export const KANBAN_STORAGE_KEY = 'kanban-project-management'

export interface StorageDriver {
  getItem: (key: string) => string | null
  setItem: (key: string, value: string) => void
  removeItem: (key: string) => void
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const hasStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === 'string')

const isKanbanState = (value: unknown): value is KanbanState => {
  if (!isRecord(value)) {
    return false
  }

  return (
    isRecord(value.boards) &&
    isRecord(value.columns) &&
    isRecord(value.cards) &&
    hasStringArray(value.boardOrder) &&
    typeof value.activeBoardId === 'string'
  )
}

const getBrowserStorage = (): StorageDriver | null => {
  if (typeof window === 'undefined') {
    return null
  }

  return window.localStorage
}

/**
 * Loads the kanban state from localStorage or initializes an empty workspace on first run.
 */
export const loadKanbanState = (storage = getBrowserStorage()): KanbanState => {
  if (!storage) {
    return createEmptyKanbanState()
  }

  const rawValue = storage.getItem(KANBAN_STORAGE_KEY)

  if (!rawValue) {
    const initialState = createEmptyKanbanState()

    saveKanbanState(initialState, storage)
    return initialState
  }

  try {
    const parsedValue = JSON.parse(rawValue) as unknown

    if (isKanbanState(parsedValue)) {
      return parsedValue
    }
  } catch (error) {
    console.error('Failed to parse kanban state from localStorage.', error)
  }

  const fallbackState = createEmptyKanbanState()

  saveKanbanState(fallbackState, storage)
  return fallbackState
}

/**
 * Persists the kanban state to localStorage.
 */
export const saveKanbanState = (state: KanbanState, storage = getBrowserStorage()): void => {
  if (!storage) {
    return
  }

  storage.setItem(KANBAN_STORAGE_KEY, JSON.stringify(state))
}
