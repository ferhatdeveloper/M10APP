import { Outlet, useLocation } from 'react-router'
import BottomNav from './BottomNav.jsx'

const hideNav = ['/checkout', '/cart']

export default function Layout() {
  const { pathname } = useLocation()
  const showNav = !hideNav.includes(pathname) && !pathname.startsWith('/track/')
  return (
    <div className="app-shell">
      <div className="app-content" style={{ paddingBottom: showNav ? undefined : 12 }}>
        <Outlet />
      </div>
      {showNav ? <BottomNav /> : null}
    </div>
  )
}
