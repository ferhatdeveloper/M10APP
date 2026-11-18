import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { Search, ShoppingCart, User, MapPin, Heart, ChevronDown, Globe, Grid3X3, ChevronLeft } from 'lucide-react'
import { useApp } from '../context/AppContext.web.jsx'
import { useI18n } from '../context/I18nContext.web.jsx'
import { categories, formatIQD } from '../data/mock.web.js'

const languages = [
  { code: 'ar', name: 'العربية', flag: '🇮🇶' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
]

const ui = {
  ar: {
    search: 'ابحث في آلاف المنتجات...',
    login: 'تسجيل الدخول',
    register: 'إنشاء حساب',
    orders: 'طلباتي',
    favorites: 'المفضلة',
    cart: 'سلة التسوق',
    categories: 'التصنيفات',
    offers: 'العروض',
    meat: 'اللحوم',
    ready: 'الدجاج',
    drinks: 'المشروبات',
    dairy: 'الألبان',
    produce: 'الخضار والفواكه',
    bakery: 'المخبوزات',
    pantry: 'المؤن',
    frozen: 'المجمدات',
    household: 'التنظيف',
  },
  tr: {
    search: 'Binlerce ürün içinde ara...',
    login: 'Giriş Yap',
    register: 'Üye Ol',
    orders: 'Siparişlerim',
    favorites: 'Favorilerim',
    cart: 'Sepetim',
    categories: 'Kategoriler',
    offers: 'Kampanyalar',
    meat: 'Et',
    ready: 'Tavuk',
    drinks: 'İçecekler',
    dairy: 'Süt Ürünleri',
    produce: 'Meyve & Sebze',
    bakery: 'Fırın',
    pantry: 'Temel Gıda',
    frozen: 'Dondurulmuş',
    household: 'Temizlik',
  },
  en: {
    search: 'Search thousands of products...',
    login: 'Sign In',
    register: 'Register',
    orders: 'My Orders',
    favorites: 'Favorites',
    cart: 'Cart',
    categories: 'Categories',
    offers: 'Offers',
    meat: 'Meat',
    ready: 'Chicken',
    drinks: 'Drinks',
    dairy: 'Dairy',
    produce: 'Produce',
    bakery: 'Bakery',
    pantry: 'Pantry',
    frozen: 'Frozen',
    household: 'Household',
  },
}

export default function DesktopHeader() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { cartCount, cartTotal, favorites } = useApp()
  const { lang, setLang, isRTL } = useI18n()
  const [searchQuery, setSearchQuery] = useState('')
  const [langOpen, setLangOpen] = useState(false)
  const [catsOpen, setCatsOpen] = useState(false)

  const t = ui[lang] || ui.ar
  const currentLangData = languages.find(l => l.code === lang)

  const navCategories = ['offers', 'meat', 'ready', 'drinks', 'dairy', 'produce', 'frozen']

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <header className="mgrs" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Top Bar */}
      <div className="mgrs-top">
        <div className="mgrs-wrap">
          <div className="mgrs-top-r">
            {/* Language */}
            <div className="mgrs-lang">
              <button onClick={() => setLangOpen(!langOpen)}>
                <Globe size={14} />
                <span>{currentLangData?.name}</span>
                <ChevronDown size={12} />
              </button>
              {langOpen && (
                <div className="mgrs-lang-dd">
                  {languages.map(l => (
                    <button
                      key={l.code}
                      className={lang === l.code ? 'active' : ''}
                      onClick={() => { setLang(l.code); setLangOpen(false) }}
                    >
                      {l.flag} {l.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <Link to="/profile">{t.login}</Link>
            <span>|</span>
            <Link to="/profile">{t.register}</Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="mgrs-main">
        <div className="mgrs-wrap">
          {/* Logo */}
          <Link to="/" className="mgrs-logo">
            <div className="mgrs-logo-box">M10</div>
          </Link>

          {/* Search */}
          <form className="mgrs-search" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder={t.search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit">
              <Search size={20} />
            </button>
          </form>

          {/* Actions */}
          <div className="mgrs-actions">
            <Link to="/profile" className="mgrs-act">
              <User size={22} />
              <span>{t.orders}</span>
            </Link>
            <Link to="/favorites" className="mgrs-act">
              <Heart size={22} />
              {favorites.length > 0 && <span className="mgrs-badge">{favorites.length}</span>}
              <span>{t.favorites}</span>
            </Link>
            <Link to="/cart" className="mgrs-cart">
              <ShoppingCart size={22} />
              {cartCount > 0 && <span className="mgrs-cart-badge">{cartCount}</span>}
              <div className="mgrs-cart-info">
                <span>{t.cart}</span>
                <strong>{formatIQD(cartTotal, lang)}</strong>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Nav Bar */}
      <div className="mgrs-nav">
        <div className="mgrs-wrap">
          {/* Categories Dropdown */}
          <div className="mgrs-cats-wrap">
            <button 
              className="mgrs-cats-btn"
              onClick={() => setCatsOpen(!catsOpen)}
            >
              <Grid3X3 size={18} />
              <span>{t.categories}</span>
              <ChevronDown size={14} />
            </button>
            {catsOpen && (
              <div className="mgrs-cats-dd">
                {categories.map(cat => (
                  <Link 
                    key={cat.id} 
                    to={`/category/${cat.id}`}
                    onClick={() => setCatsOpen(false)}
                  >
                    {t[cat.id] || cat.nameAr || cat.name}
                    <ChevronLeft size={14} />
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Nav Links */}
          <nav className="mgrs-nav-links">
            {navCategories.map(id => (
              <Link
                key={id}
                to={`/category/${id}`}
                className={`${id === 'offers' ? 'hot' : ''} ${pathname === `/category/${id}` ? 'active' : ''}`}
              >
                {id === 'offers' && '🔥 '}
                {t[id]}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}
