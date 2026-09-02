import { useCallback, useEffect, useState } from 'react'
import { buildTheme } from '../../../theme'

const STORAGE_KEY = 'm10.admin.theme'

const readStored = () => {
  try {
    if (typeof window === 'undefined') return null
    const raw = window.localStorage?.getItem(STORAGE_KEY)
    if (!raw) return null
    if (raw === 'light' || raw === 'dark') return raw
  } catch {
    // ignore
  }
  return null
}

const persist = (mode) => {
  try {
    if (typeof window === 'undefined') return
    window.localStorage?.setItem(STORAGE_KEY, mode)
  } catch {
    // ignore
  }
}

export default function useAdminTheme() {
  const [mode, setMode] = useState(() => readStored() || 'light')

  useEffect(() => {
    persist(mode)
  }, [mode])

  const toggle = useCallback(() => {
    setMode((m) => (m === 'dark' ? 'light' : 'dark'))
  }, [])

  const theme = buildTheme(mode)
  return { theme, mode, setMode, toggle }
}
