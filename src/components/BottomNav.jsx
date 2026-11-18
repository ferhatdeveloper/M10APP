import { NavLink } from 'react-router'
import { Home, Search, Receipt, Heart, User } from 'lucide-react'
import { useApp } from '../context/AppContext.web.jsx'
import { useI18n } from '../context/I18nContext.web.jsx'
import { tUI } from '../data/mock.web.js'

export default function BottomNav() {
  const { cartCount } = useApp()
  const { lang } = useI18n()
  const t = tUI(lang)

  const items = [
    { to: '/', icon: Home, label: t.home, end: true },
    { to: '/search', icon: Search, label: lang === 'tr' ? 'Ara' : lang === 'en' ? 'Search' : 'بحث', end: false },
    { to: '/orders', icon: Receipt, label: t.orders, end: false },
    { to: '/favorites', icon: Heart, label: t.favorites, end: false },
    { to: '/profile', icon: User, label: t.myAccount, end: false },
  ]

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
