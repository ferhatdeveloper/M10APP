import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { Search, ShoppingCart, User, MapPin, Heart, Package, ChevronDown, Globe, Menu } from 'lucide-react'
import { useApp } from '../context/AppContext.web.jsx'
import { categories, formatIQD, DEFAULT_STORE_ID } from '../data/mock.web.js'
import Logo from './Logo.jsx'

const languages = [
  { code: 'ar', name: 'العربية', flag: '🇮🇶' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
]

export default function DesktopHeader() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { cartCount, cartTotal, favorites, user, getLiveStore } = useApp()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [currentLang, setCurrentLang] = useState('ar')

  const mainCategories = categories.filter(c => 
    ['offers', 'meat', 'dairy', 'produce', 'bakery', 'drinks', 'snacks', 'frozen', 'household'].includes(c.id)
  ).slice(0, 9)

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleLangChange = (code) => {
    setCurrentLang(code)
    setLangOpen(false)
  }

  const currentLangData = languages.find(l => l.code === currentLang)

  return (
    <header className="migros-header">
      {/* Top Utility Bar */}
      <div className="mh-top">
        <div className="mh-container">
          <div className="mh-top-left">
            <span className="mh-promo">🚚 توصيل سريع خلال 30 دقيقة</span>
            <span className="mh-divider">•</span>
            <span className="mh-promo">💰 خصم 50% على أول طلب</span>
          </div>
          <div className="mh-top-right">
            {/* Language Selector */}
            <div className="mh-lang-wrap">
              <button 
                className="mh-lang-btn"
                onClick={() => setLangOpen(!langOpen)}
              >
                <Globe size={16} />
                <span>{currentLangData?.flag} {currentLangData?.name}</span>
                <ChevronDown size={14} className={langOpen ? 'rotate' : ''} />
              </button>
              {langOpen && (
                <div className="mh-lang-dropdown">
                  {languages.map(lang => (
                    <button
                      key={lang.code}
                      className={`mh-lang-option ${currentLang === lang.code ? 'active' : ''}`}
                      onClick={() => handleLangChange(lang.code)}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <span className="mh-divider">|</span>
            <Link to="/profile" className="mh-top-link">تسجيل الدخول</Link>
            <span className="mh-divider">|</span>
            <Link to="/orders" className="mh-top-link">تتبع طلبك</Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="mh-main">
        <div className="mh-container">
          {/* Logo */}
          <Link to="/" className="mh-logo">
            <div className="mh-logo-icon">
              <Logo size={36} onBrand />
            </div>
            <div className="mh-logo-text">
              <span className="mh-logo-name">M10</span>
              <span className="mh-logo-sub">ماركت</span>
            </div>
          </Link>

          {/* Location */}
          <button className="mh-location">
            <MapPin size={20} className="mh-loc-icon" />
            <div className="mh-loc-info">
              <span className="mh-loc-label">توصيل إلى</span>
              <span className="mh-loc-address">
                {user?.address?.area || 'المنصور'}، {user?.address?.city || 'بغداد'}
                <ChevronDown size={14} />
              </span>
            </div>
          </button>

          {/* Search Bar - Migros Style */}
          <form className={`mh-search ${searchFocused ? 'focused' : ''}`} onSubmit={handleSearch}>
            <div className="mh-search-inner">
              <Search size={22} className="mh-search-icon" />
              <input
                type="text"
                placeholder="ماذا تبحث؟ ابحث في أكثر من 10,000 منتج..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
              />
            </div>
            <button type="submit" className="mh-search-btn">
              <Search size={20} />
              <span>بحث</span>
            </button>
          </form>

          {/* Actions */}
          <nav className="mh-actions">
            <Link to="/favorites" className="mh-action">
              <Heart size={24} />
              {favorites.length > 0 && <span className="mh-badge">{favorites.length}</span>}
              <span>المفضلة</span>
            </Link>

            <Link to="/profile" className="mh-action">
              <User size={24} />
              <span>حسابي</span>
            </Link>

            <Link to="/cart" className="mh-cart-btn">
              <div className="mh-cart-icon-wrap">
                <ShoppingCart size={24} />
                {cartCount > 0 && <span className="mh-cart-badge">{cartCount}</span>}
              </div>
              <div className="mh-cart-text">
                <span className="mh-cart-label">سلتي</span>
                <span className="mh-cart-total">
                  {cartCount > 0 ? formatIQD(cartTotal) : '0 د.ع'}
                </span>
              </div>
            </Link>
          </nav>
        </div>
      </div>

      {/* Categories Navigation - Migros Style */}
      <div className="mh-nav">
        <div className="mh-container">
          <button className="mh-all-cats">
            <Menu size={20} />
            <span>جميع التصنيفات</span>
            <ChevronDown size={16} />
          </button>
          <nav className="mh-nav-links">
            <Link to="/" className={`mh-nav-link ${pathname === '/' ? 'active' : ''}`}>
              الرئيسية
            </Link>
            {mainCategories.map(cat => (
              <Link
                key={cat.id}
                to={`/category/${cat.id}`}
                className={`mh-nav-link ${cat.id === 'offers' ? 'offers' : ''} ${pathname === `/category/${cat.id}` ? 'active' : ''}`}
              >
                {cat.id === 'offers' && '🔥 '}
                {cat.nameAr || cat.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}
