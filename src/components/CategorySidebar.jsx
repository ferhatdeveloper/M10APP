import { Link, useLocation, useParams } from 'react-router'
import { categories } from '../data/mock.web.js'
import { 
  Beef, Drumstick, GlassWater, Milk, Apple, Croissant, 
  Package, Cookie, Snowflake, Sparkles, Home, User, Gift
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

const categoryLabels = {
  offers: 'العروض',
  meat: 'اللحوم',
  ready: 'دجاج',
  drinks: 'مشروبات',
  dairy: 'ألبان',
  produce: 'خضار وفواكه',
  bakery: 'مخبوزات',
  pantry: 'مؤن',
  snacks: 'وجبات خفيفة',
  frozen: 'مجمدات',
  household: 'تنظيف',
  home: 'المنزل',
  personal: 'عناية شخصية',
  coldcuts: 'لحوم باردة',
}

export default function CategorySidebar() {
  const { pathname } = useLocation()
  const { id: activeCategory } = useParams()

  return (
    <aside className="category-sidebar">
      <div className="sidebar-title">التصنيفات</div>
      <nav className="sidebar-nav">
        <Link
          to="/category/offers"
          className={`sidebar-link offers ${activeCategory === 'offers' ? 'active' : ''}`}
        >
          <span className="sidebar-icon offers">
            <Gift size={18} />
          </span>
          <span>العروض</span>
        </Link>

        {categories
          .filter(c => c.id !== 'offers')
          .map(cat => {
            const Icon = categoryIcons[cat.id] || Package
            const label = categoryLabels[cat.id] || cat.nameAr || cat.id
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
                <span>{label}</span>
              </Link>
            )
          })}
      </nav>
    </aside>
  )
}
