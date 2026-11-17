import { useState, useEffect } from 'react'

export const DESKTOP_BP = 900

export function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== 'undefined' && window.innerWidth >= DESKTOP_BP
  )

  useEffect(() => {
    if (typeof window === 'undefined') return
    const handleResize = () => setIsDesktop(window.innerWidth >= DESKTOP_BP)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return isDesktop
}
