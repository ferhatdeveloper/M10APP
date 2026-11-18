import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { Search, ShoppingCart, User, MapPin, Heart, Package, ChevronDown, Menu, X } from 'lucide-react'
import { useApp } from '../context/AppContext.web.jsx'
import { categories, formatIQD, DEFAULT_STORE_ID, storeName } from '../data/mock.web.js'
import Logo from './Logo.jsx'

export default function DesktopHeader() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { cartCount, cartTotal, favorites, user, getLiveStore } = useApp()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)
  const defaultStore = getLiveStore(DEFAULT_STORE_ID)

  const mainCategories = categories.filter(c => 
    ['offers', 'meat', 'dairy', 'produce', 'bakery', 'drinks', 'snacks', 'frozen', 'household'].includes(c.id)
  ).slice(0, 9)

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <header className="desktop-header-2027">
      {/* Top Bar - Utility */}
      <div className="dh-utility-bar">
        <div className="dh-container">
          <div className="dh-utility-left">
            <span>🚚 توصيل مجاني للطلبات فوق 50,000 د.ع</span>
          </div>
          <div className="dh-utility-right">
            <Link to="/profile">حسابي</Link>
            <span className="dh-utility-divider">|</span>
            <Link to="/orders">تتبع الطلب</Link>
            <span className="dh-utility-divider">|</span>
            <span>العربية</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="dh-main">
        <div className="dh-container">
          {/* Logo */}
          <Link to="/" className="dh-logo">
            <div className="dh-logo-mark">
              <Logo size={32} onBrand />
            </div>
            <div className="dh-logo-text">
              <span className="dh-logo-name">M10</span>
              <span className="dh-logo-tagline">سوبرماركت</span>
            </div>
          </Link>

          {/* Location Selector */}
          <button className="dh-location">
            <MapPin size={18} className="dh-location-icon" />
            <div className="dh-location-info">
              <span className="dh-location-label">التوصيل إلى</span>
              <span className="dh-location-address">
                {user?.address?.area || 'المنصور'}، {user?.address?.city || 'بغداد'}
                <ChevronDown size={14} />
              </span>
            </div>
          </button>

          {/* Search Bar - Main Focus */}
          <form className={`dh-search ${searchFocused ? 'focused' : ''}`} onSubmit={handleSearch}>
            <Search size={20} className="dh-search-icon" />
            <input
              type="text"
              placeholder="ابحث عن المنتجات، الماركات، الفئات..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
            <button type="submit" className="dh-search-btn">بحث</button>
          </form>

          {/* Actions */}
          <nav className="dh-actions">
            <Link to="/favorites" className="dh-action">
              <div className="dh-action-icon">
                <Heart size={22} />
                {favorites.length > 0 && (
                  <span className="dh-action-badge">{favorites.length}</span>
                )}
              </div>
              <span className="dh-action-label">المفضلة</span>
            </Link>

            <Link to="/orders" className="dh-action">
              <div className="dh-action-icon">
                <Package size={22} />
              </div>
              <span className="dh-action-label">طلباتي</span>
            </Link>

            <Link to="/profile" className="dh-action">
              <div className="dh-action-icon">
                <User size={22} />
              </div>
              <span className="dh-action-label">حسابي</span>
            </Link>

            <Link to="/cart" className="dh-cart">
              <div className="dh-cart-icon">
                <ShoppingCart size={22} />
                {cartCount > 0 && (
                  <span className="dh-cart-badge">{cartCount}</span>
                )}
              </div>
              <div className="dh-cart-info">
                <span className="dh-cart-label">السلة</span>
                {cartCount > 0 && (
                  <span className="dh-cart-total">{formatIQD(cartTotal)}</span>
                )}
              </div>
            </Link>
          </nav>
        </div>
      </div>

      {/* Categories Navigation */}
      <div className="dh-nav">
        <div className="dh-container">
          <nav className="dh-nav-links">
            <Link
              to="/"
              className={`dh-nav-link ${pathname === '/' ? 'active' : ''}`}
            >
              الرئيسية
            </Link>
            {mainCategories.map(cat => (
              <Link
                key={cat.id}
                to={`/category/${cat.id}`}
                className={`dh-nav-link ${cat.id === 'offers' ? 'offers' : ''} ${pathname === `/category/${cat.id}` ? 'active' : ''}`}
              >
                {cat.id === 'offers' && <span className="dh-nav-fire">🔥</span>}
                {cat.nameAr || cat.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}
