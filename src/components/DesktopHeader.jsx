import { Link, useLocation } from 'react-router'
import { Search, ShoppingCart, User, MapPin, Heart, Package, ChevronDown } from 'lucide-react'
import { useApp } from '../context/AppContext.web.jsx'
import { categories, formatIQD, DEFAULT_STORE_ID, storeName } from '../data/mock.web.js'
import Logo from './Logo.jsx'

export default function DesktopHeader() {
  const { pathname } = useLocation()
  const { cartCount, cartTotal, favorites, user, getLiveStore } = useApp()
  const defaultStore = getLiveStore(DEFAULT_STORE_ID)
  const activeStoreName = defaultStore ? storeName(defaultStore, 'ar') : 'M10'

  const mainCategories = categories.filter(c => 
    ['meat', 'ready', 'drinks', 'dairy', 'produce', 'bakery', 'pantry', 'snacks', 'frozen', 'household'].includes(c.id)
  ).slice(0, 8)

  return (
    <header className="desktop-header">
      <div className="desktop-header-top">
        <div className="desktop-header-inner">
          <Link to="/" className="desktop-logo">
            <Logo size={36} onBrand />
            <span className="desktop-logo-text">M10</span>
          </Link>

          <div className="desktop-location">
            <MapPin size={16} />
            <div className="desktop-location-text">
              <span className="desktop-location-label">التوصيل إلى</span>
              <span className="desktop-location-address">
                {user?.address?.area}، {user?.address?.city}
              </span>
            </div>
            <ChevronDown size={14} />
          </div>

          <Link to="/search" className="desktop-search">
            <Search size={18} />
            <span>ابحث عن منتجات...</span>
          </Link>

          <nav className="desktop-nav-icons">
            <Link to="/favorites" className="desktop-nav-icon" title="المفضلة">
              <Heart size={22} />
              {favorites.length > 0 && (
                <span className="desktop-nav-badge">{favorites.length}</span>
              )}
              <span className="desktop-nav-label">المفضلة</span>
            </Link>

            <Link to="/orders" className="desktop-nav-icon" title="طلباتي">
              <Package size={22} />
              <span className="desktop-nav-label">طلباتي</span>
            </Link>

            <Link to="/profile" className="desktop-nav-icon" title="حسابي">
              <User size={22} />
              <span className="desktop-nav-label">حسابي</span>
            </Link>

            <Link to="/cart" className="desktop-cart-btn">
              <ShoppingCart size={20} />
              {cartCount > 0 ? (
                <>
                  <span className="desktop-cart-count">{cartCount}</span>
                  <span className="desktop-cart-total">{formatIQD(cartTotal)}</span>
                </>
              ) : (
                <span className="desktop-cart-text">السلة</span>
              )}
            </Link>
          </nav>
        </div>
      </div>

      <div className="desktop-header-bottom">
        <div className="desktop-header-inner">
          <nav className="desktop-categories-nav">
            <Link
              to="/"
              className={`desktop-cat-link ${pathname === '/' ? 'active' : ''}`}
            >
              الرئيسية
            </Link>
            <Link
              to="/category/offers"
              className={`desktop-cat-link offers ${pathname === '/category/offers' ? 'active' : ''}`}
            >
              🔥 العروض
            </Link>
            {mainCategories.map(cat => (
              <Link
                key={cat.id}
                to={`/category/${cat.id}`}
                className={`desktop-cat-link ${pathname === `/category/${cat.id}` ? 'active' : ''}`}
              >
                {cat.nameAr || cat.name || cat.id}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}
