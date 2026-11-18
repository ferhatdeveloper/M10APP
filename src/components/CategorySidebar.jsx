import { Link, useParams } from 'react-router'
import { categories, getCategoryName, tUI } from '../data/mock.web.js'
import { useI18n } from '../context/I18nContext.web.jsx'
import {
  Beef, Drumstick, GlassWater, Milk, Apple, Croissant,
  Package, Cookie, Snowflake, Sparkles, Home, User, Gift,
} from 'lucide-react'

const categoryIcons = {
  offers: Gift,
  meat: Beef,
  ready: Drumstick,
  drinks: GlassWater,
  dairy: Milk,
  produce: Apple,
  bakery: Croissant,
  pantry: Package,
  snacks: Cookie,
  frozen: Snowflake,
  household: Sparkles,
  home: Home,
  personal: User,
  coldcuts: Beef,
}

export default function CategorySidebar() {
  const { id: activeCategory } = useParams()
  const { lang } = useI18n()
  const t = tUI(lang)
  const offersCat = categories.find((c) => c.id === 'offers')

  return (
    <aside className="category-sidebar">
      <div className="sidebar-title">{t.categories}</div>
      <nav className="sidebar-nav">
        <Link
          to="/category/offers"
          className={`sidebar-link offers ${activeCategory === 'offers' ? 'active' : ''}`}
        >
          <span className="sidebar-icon offers">
            <Gift size={18} />
          </span>
          <span>{getCategoryName(offersCat, lang)}</span>
        </Link>

        {categories
          .filter((c) => c.id !== 'offers')
          .map((cat) => {
            const Icon = categoryIcons[cat.id] || Package
            const isActive = activeCategory === cat.id
            return (
              <Link
                key={cat.id}
                to={`/category/${cat.id}`}
                className={`sidebar-link ${isActive ? 'active' : ''}`}
              >
                <span className="sidebar-icon">
                  <Icon size={18} />
                </span>
                <span>{getCategoryName(cat, lang)}</span>
              </Link>
            )
          })}
      </nav>
    </aside>
  )
}
