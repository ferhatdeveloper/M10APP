import { NavLink } from 'react-router'
import { Home, Search, Receipt, Heart, User } from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'

const items = [
  { to: '/', icon: Home, label: 'الرئيسية', end: true },
  { to: '/search', icon: Search, label: 'بحث' },
  { to: '/orders', icon: Receipt, label: 'طلباتي' },
  { to: '/favorites', icon: Heart, label: 'المفضلة' },
  { to: '/profile', icon: User, label: 'حسابي' },
]

export default function BottomNav() {
  const { cartCount } = useApp()
  return (
    <nav className="bottom-nav">
      {items.map((item) => {
        const Icon = item.icon
        return (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
          >
            <span className="cart-fab">
              <Icon size={22} strokeWidth={2.2} />
              {item.to === '/orders' && cartCount > 0 ? (
                <span className="cart-count">{cartCount}</span>
              ) : null}
            </span>
            {item.label}
          </NavLink>
        )
      })}
    </nav>
  )
}
