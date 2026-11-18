import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { Search, ShoppingCart, User, MapPin, Heart, ChevronDown, ChevronRight, Globe, Grid3X3, ChevronLeft } from 'lucide-react'
import { useApp } from '../context/AppContext.web.jsx'
import { useI18n } from '../context/I18nContext.web.jsx'
import { categories, formatIQD, ui, getCategoryName } from '../data/mock.web.js'

const languages = [
  { code: 'ar', name: 'العربية', flag: '🇮🇶' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
]

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
          <Link to="/" className="mgrs-logo" aria-label="M10">
            <img
              src="/m10-logo.png"
              alt="M10"
              className="mgrs-logo-img"
              width={48}
              height={48}
              draggable={false}
            />
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

      <div className="mgrs-nav">
        <div className="mgrs-wrap">
          <div className="mgrs-cats-wrap">
            <button
              type="button"
              className={`mgrs-cats-btn${catsOpen ? ' open' : ''}`}
              onClick={() => setCatsOpen(!catsOpen)}
              aria-expanded={catsOpen}
            >
              <Grid3X3 size={16} />
              <span>{t.categories}</span>
              <ChevronDown size={14} className="mgrs-cats-chevron" />
            </button>
            {catsOpen && (
              <div className="mgrs-cats-dd">
                {categories.map(cat => (
                  <Link
                    key={cat.id}
                    to={`/category/${cat.id}`}
                    className={cat.id === 'offers' ? 'hot' : ''}
                    onClick={() => setCatsOpen(false)}
                  >
                    <span className="mgrs-cats-dd-icon">{cat.icon}</span>
                    <span className="mgrs-cats-dd-name">{getCategoryName(cat, lang)}</span>
                    {isRTL ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <nav className="mgrs-nav-links">
            {navCategories.map(id => {
              const cat = categories.find(c => c.id === id)
              const active = pathname === `/category/${id}`
              return (
                <Link
                  key={id}
                  to={`/category/${id}`}
                  className={[id === 'offers' ? 'hot' : '', active ? 'active' : ''].filter(Boolean).join(' ')}
                >
                  {id === 'offers' && <span className="mgrs-nav-emoji" aria-hidden="true">🔥</span>}
                  <span>{getCategoryName(cat, lang)}</span>
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
    </header>
  )
}
