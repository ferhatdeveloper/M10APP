import { Outlet, useLocation } from 'react-router'
import { useState, useEffect } from 'react'
import BottomNav from './BottomNav.jsx'
import DesktopHeader from './DesktopHeader.jsx'

const hideNav = ['/checkout', '/cart']
const DESKTOP_BP = 900

function useIsDesktop() {
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

export default function Layout() {
  const { pathname } = useLocation()
  const isDesktop = useIsDesktop()
  const showNav = !hideNav.includes(pathname) && !pathname.startsWith('/track/')

  if (isDesktop) {
    return (
      <div className="desktop-shell">
        <DesktopHeader />
        <main className="desktop-main full-width">
          <Outlet />
        </main>
      </div>
    )
  }

  return (
    <div className="app-shell">
      <div className="app-content" style={{ paddingBottom: showNav ? undefined : 12 }}>
        <Outlet />
      </div>
      {showNav ? <BottomNav /> : null}
    </div>
  )
}
