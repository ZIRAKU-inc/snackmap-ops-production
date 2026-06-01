import { useState, useEffect, useCallback } from 'react'

export function usePersistedForm<T extends Record<string, string>>(
  storageKey: string,
  defaultValues: T
): [T, (updates: Partial<T>) => void] {
  const [form, setForm] = useState<T>(defaultValues)

  // クライアントマウント後にlocalStorageから復元
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey)
      if (stored) {
        setForm(prev => ({ ...prev, ...JSON.parse(stored) }))
      }
    } catch {
      // localStorageが使えない環境は無視
    }
  }, [storageKey])

  const updateForm = useCallback((updates: Partial<T>) => {
    setForm(prev => {
      const next = { ...prev, ...updates }
      try {
        localStorage.setItem(storageKey, JSON.stringify(next))
      } catch {}
      return next
    })
  }, [storageKey])

  return [form, updateForm]
}
