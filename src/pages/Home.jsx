import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { Search, ShoppingBag, Plus, ChevronLeft, ChevronRight, Zap } from 'lucide-react'
import TopBar from '../components/TopBar.jsx'
import { useApp } from '../context/AppContext.web.jsx'
import { useI18n } from '../context/I18nContext.web.jsx'
import { useIsDesktop } from '../hooks/useIsDesktop.js'
import { 
  banners, categories, brands, brandBanners, shopByBrandCards, formatIQD, stores, 
  getProducts, getProductsByCategory,
  productName, getCategoryName, getBrandName, ui 
} from '../data/mock.web.js'

export default function Home() {
  const { cartCount, cartTotal, addToCart } = useApp()
  const { lang, isRTL } = useI18n()
  const isDesktop = useIsDesktop()
  const t = ui[lang] || ui.ar

  const allProducts = getProducts()
  const saleProducts = allProducts.filter(p => p.oldPrice).slice(0, 10)

  if (isDesktop) {
    return (
      <div className="metro-home">
        {/* Brand Banners Slider */}
        <section className="brand-banners">
          <div className="brand-banners-scroll">
            {brandBanners.map(bb => (
              <Link key={bb.id} to={`/brand/${bb.brand}`} className="brand-banner-card" style={{ background: bb.color }}>
                <img src={bb.image} alt="" className="brand-banner-img" />
                <div className="brand-banner-content">
                  <h3>{bb.titles[lang]}</h3>
                  <p>{bb.subtitles[lang]}</p>
                  <span className="brand-banner-tag">{bb.tagline[lang]}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Shop by Brand - Metro Card Style */}
        <section className="metro-section">
          <div className="metro-section-head">
            <h2>{t.shopByBrand}</h2>
            <Link to="/brands">{t.viewAll} {isRTL ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}</Link>
          </div>
          <div className="shop-brand-cards">
            {shopByBrandCards.map(card => (
              <Link key={card.id} to={`/brand/${card.brand}`} className="shop-brand-card" style={{ background: card.color }}>
                <div className="shop-brand-card-content">
                  <h3>{card.titles[lang]}</h3>
                  <p>{card.subtitles[lang]}</p>
                </div>
                <img src={card.image} alt={card.name} className="shop-brand-card-img" />
              </Link>
            ))}
          </div>
        </section>

        {/* Flash Sale - Yellow */}
        <FlashSale products={saleProducts} lang={lang} t={t} onAdd={(p) => addToCart && addToCart(stores[0].id, p)} />

        {/* Categories Row */}
        <section className="metro-cats">
          <div className="metro-cats-scroll">
            {categories.slice(0, 10).map(cat => (
              <Link key={cat.id} to={`/category/${cat.id}`} className={`metro-cat ${cat.id === 'offers' ? 'hot' : ''}`}>
                <span className="metro-cat-icon">{cat.icon}</span>
                <span>{getCategoryName(cat, lang)}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Category Sections with Banner + Products */}
        {['produce', 'meat', 'ready', 'dairy', 'drinks', 'snacks', 'bakery', 'frozen'].map(catId => {
          const cat = categories.find(c => c.id === catId)
          const banner = banners.find(b => b.category === catId)
          const products = getProductsByCategory(catId)
          if (products.length === 0) return null
          
          return (
            <CategorySection 
              key={catId}
              category={cat}
              banner={banner}
              products={products}
              lang={lang}
              t={t}
              isRTL={isRTL}
              onAdd={(p) => addToCart && addToCart(stores[0].id, p)}
            />
          )
        })}

        {/* Floating Cart */}
        {cartCount > 0 && (
          <Link to="/cart" className="metro-float-cart">
            <ShoppingBag size={20} />
            <span className="metro-float-count">{cartCount}</span>
            <span>{t.viewCart}</span>
            <strong>{formatIQD(cartTotal, lang)}</strong>
          </Link>
        )}
      </div>
    )
  }

  // Mobile view
  return (
    <div>
      <TopBar showLocation />
      <div className={`page${cartCount > 0 ? ' page-pad-bar' : ''}`} style={{ paddingTop: 4 }}>
        <Link to="/search" className="search-box search-link">
          <Search size={18} color="#7a7a7a" />
          <span>{t.search}</span>
        </Link>

        <div className="cats" style={{ marginTop: 16 }}>
          {categories.slice(0, 8).map((c) => (
            <Link key={c.id} to={`/category/${c.id}`} className="cat">
              <div className={`cat-icon${c.id === 'offers' ? ' offer' : ''}`}>{c.icon}</div>
              <span>{getCategoryName(c, lang)}</span>
            </Link>
          ))}
        </div>

        {/* Mobile Product Sections */}
        {['produce', 'meat', 'drinks', 'snacks'].map(catId => {
          const cat = categories.find(c => c.id === catId)
          const products = getProductsByCategory(catId).slice(0, 4)
          if (products.length === 0) return null
          
          return (
            <div key={catId} style={{ marginTop: 20 }}>
              <div className="section-title">
                <h2 className="h2">{cat.icon} {getCategoryName(cat, lang)}</h2>
                <Link to={`/category/${catId}`} className="muted">{t.viewAll}</Link>
              </div>
              <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 8 }}>
                {products.map((p) => (
                  <div key={p.id} style={{ minWidth: 140, background: '#fff', borderRadius: 12, padding: 10 }}>
                    <img src={p.image} alt="" style={{ width: '100%', height: 100, objectFit: 'cover', borderRadius: 8 }} />
                    <div style={{ marginTop: 8, fontSize: 13, fontWeight: 600 }}>{productName(p, lang)}</div>
                    <div style={{ color: '#e31e24', fontWeight: 700, marginTop: 4 }}>{formatIQD(p.price, lang)}</div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {cartCount > 0 && (
        <Link to="/cart" className="store-cart-bar">
          <div>
            <div className="row" style={{ gap: 6 }}>
              <ShoppingBag size={16} />
              <span>{t.viewCart} · {cartCount}</span>
            </div>
          </div>
          <span className="btn">{formatIQD(cartTotal, lang)}</span>
        </Link>
      )}
    </div>
  )
}

function CategorySection({ category, banner, products, lang, t, isRTL, onAdd }) {
  const [page, setPage] = useState(0)
  const pageSize = 8
  const totalPages = Math.ceil(products.length / pageSize)
  const currentProducts = products.slice(page * pageSize, (page + 1) * pageSize)

  const filters = [
    { id: 'new', label: t.newProducts },
    { id: 'best', label: t.bestSellers },
    { id: 'featured', label: t.featured },
  ]
  const [activeFilter, setActiveFilter] = useState('new')

  return (
    <section className="cat-section">
      {/* Header */}
      <div className="cat-section-head">
        <h2 className="cat-section-title">
          <span className="cat-section-line" style={{ background: category?.color || '#e31e24' }}></span>
          {category?.icon} {getCategoryName(category, lang)}
        </h2>
        <div className="cat-section-filters">
          {filters.map(f => (
            <button 
              key={f.id} 
              className={activeFilter === f.id ? 'active' : ''}
              onClick={() => setActiveFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
          <span className="cat-section-sep">|</span>
          <Link to={`/category/${category?.id}`}>{t.viewAll}</Link>
        </div>
      </div>

      {/* Content: Banner + Products Grid */}
      <div className="cat-section-content">
        {/* Banner */}
        {banner && (
          <Link to={`/category/${category?.id}`} className="cat-section-banner" style={{ background: banner.color }}>
            <img src={banner.image} alt="" />
            <div className="cat-section-banner-overlay">
              <span className="cat-section-banner-tag">{banner.subtitles[lang]}</span>
              <h3>{banner.titles[lang]}</h3>
              <div className="cat-section-banner-discount">30%<br/><span>{t.off}</span></div>
            </div>
            <button className="cat-section-banner-btn">
              {lang === 'ar' ? 'تسوق الآن' : lang === 'tr' ? 'Alışverişe Başla' : 'Shop Now'}
            </button>
          </Link>
        )}

        {/* Products Grid 2x4 with Slider */}
        <div className="cat-section-products">
          {/* Nav Arrows */}
          {totalPages > 1 && (
            <>
              <button 
                className="cat-slider-arrow prev" 
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
              >
                {isRTL ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
              </button>
              <button 
                className="cat-slider-arrow next" 
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={page === totalPages - 1}
              >
                {isRTL ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
              </button>
            </>
          )}

          {/* Grid */}
          <div className="cat-section-grid">
            {currentProducts.map((p) => (
              <ProductCard key={p.id} product={p} lang={lang} t={t} onAdd={() => onAdd(p)} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function ProductCard({ product, lang, t, onAdd }) {
  const p = product
  const discount = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0

  return (
    <div className="cat-product">
      {discount > 0 && <span className="cat-product-sale">{t.sale}</span>}
      <Link to={`/product/${p.id}`} className="cat-product-img">
        <img src={p.image} alt={productName(p, lang)} />
      </Link>
      <div className="cat-product-info">
        <h3>{productName(p, lang)}</h3>
        <div className="cat-product-price">
          {p.oldPrice && <del>{formatIQD(p.oldPrice, lang)}</del>}
          {p.oldPrice && <span className="cat-product-from">{t.from}</span>}
          <strong>{formatIQD(p.price, lang)}</strong>
        </div>
        <button className="cat-product-btn" onClick={onAdd}>
          {t.addToCart}
        </button>
      </div>
    </div>
  )
}

function FlashSale({ products, lang, t, onAdd }) {
  const [time, setTime] = useState({ hours: 2, minutes: 0, seconds: 47 })

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(prev => {
        let { hours, minutes, seconds } = prev
        seconds--
        if (seconds < 0) { seconds = 59; minutes-- }
        if (minutes < 0) { minutes = 59; hours-- }
        if (hours < 0) { hours = 23; minutes = 59; seconds = 59 }
        return { hours, minutes, seconds }
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const pad = n => String(n).padStart(2, '0')

  return (
    <section className="flash-sale">
      <div className="flash-sale-header">
        <div className="flash-sale-title">
          <Zap size={20} />
          <span>{t.flashSale}</span>
        </div>
        <span className="flash-sale-subtitle">{t.endsIn}</span>
        <div className="flash-sale-timer">
          <span>{pad(time.hours)}</span>:<span>{pad(time.minutes)}</span>:<span>{pad(time.seconds)}</span>
        </div>
      </div>
      <div className="flash-sale-products">
        {products.map(p => {
          const discount = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0
          return (
            <div key={p.id} className="flash-sale-card">
              <span className="flash-sale-badge">{t.save} {discount}%</span>
              <Link to={`/product/${p.id}`} className="flash-sale-img">
                <img src={p.image} alt={productName(p, lang)} />
              </Link>
              <button className="flash-sale-add" onClick={() => onAdd(p)}>
                <Plus size={16} />
              </button>
              <div className="flash-sale-info">
                <h4>{productName(p, lang)}</h4>
                <div className="flash-sale-prices">
                  <strong>{formatIQD(p.price, lang)}</strong>
                  <del>{formatIQD(p.oldPrice, lang)}</del>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
