import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { Platform } from 'react-native'
import { isAdminPath, setAdminUrl, setStorefrontUrl } from '../layout/web'

const ShellContext = createContext(null)

export function ShellProvider({ children }) {
  const [shell, setShell] = useState(() => (isAdminPath() ? 'admin' : 'customer'))
  const [customerEntry, setCustomerEntry] = useState(null)

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return undefined
    const sync = () => setShell(isAdminPath() ? 'admin' : 'customer')
    window.addEventListener('popstate', sync)
    window.addEventListener('hashchange', sync)
    return () => {
      window.removeEventListener('popstate', sync)
      window.removeEventListener('hashchange', sync)
    }
  }, [])

  const openAdmin = useCallback(() => {
    setAdminUrl()
    setShell('admin')
  }, [])

  const openStorefront = useCallback((entry) => {
    setCustomerEntry(entry || null)
    setStorefrontUrl()
    setShell('customer')
  }, [])

  const consumeCustomerEntry = useCallback(() => {
    setCustomerEntry(null)
  }, [])

  const value = useMemo(
    () => ({ shell, openAdmin, openStorefront, customerEntry, consumeCustomerEntry }),
    [shell, openAdmin, openStorefront, customerEntry, consumeCustomerEntry],
  )

  return <ShellContext.Provider value={value}>{children}</ShellContext.Provider>
}

export const useShell = () => useContext(ShellContext)
