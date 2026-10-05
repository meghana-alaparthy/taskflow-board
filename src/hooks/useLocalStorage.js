import { useState, useEffect } from 'react'

// State that survives reloads. Reads once on mount; every later update is
// written back. If storage is unavailable or corrupted we just fall back to
// the initial value and keep the app working in memory.
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key)
      if (raw != null) return JSON.parse(raw)
    } catch {
      // ignore and fall through to the initial value
    }
    return typeof initialValue === 'function' ? initialValue() : initialValue
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // storage full or blocked (e.g. private mode) — not fatal
    }
  }, [key, value])

  return [value, setValue]
}
