import { useEffect, useState } from 'react'
import type { StorageDriver } from '../services/storageService'

interface LocalStorageOptions<T> {
  storage?: StorageDriver | null
  read?: (storage: StorageDriver | null) => T
  write?: (value: T, storage: StorageDriver | null) => void
}

const getBrowserStorage = (): StorageDriver | null => {
  if (typeof window === 'undefined') {
    return null
  }

  return window.localStorage
}

/**
 * Synchronizes a React state value with localStorage.
 */
export const useLocalStorage = <T>(
  initialValue: T | (() => T),
  options: LocalStorageOptions<T> = {}
): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const storage = options.storage ?? getBrowserStorage()
  const { read, write } = options
  const resolveInitialValue = (): T =>
    typeof initialValue === 'function' ? (initialValue as () => T)() : initialValue

  const [value, setValue] = useState<T>(() => read?.(storage) ?? resolveInitialValue())

  useEffect(() => {
    write?.(value, storage)
  }, [storage, value, write])

  return [value, setValue]
}
