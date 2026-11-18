import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router'
import { Search, ShoppingBag, Plus, Minus, ChevronLeft, ChevronRight, Zap } from 'lucide-react'
import TopBar from '../components/TopBar.jsx'
import { useApp } from '../context/AppContext.web.jsx'
import { useI18n } from '../context/I18nContext.web.jsx'
import { useIsDesktop } from '../hooks/useIsDesktop.js'
import { 
  banners, categories, brandBanners, shopByBrandCards, formatIQD, stores, 
  getProducts, getProductsByCategory, getProductsByBrand,
  productName, getCategoryName, ui 
} from '../data/mock.web.js'

function flyToCart(fromEl) {
  const cart = document.querySelector('.mgrs-cart, .metro-float-cart, .store-cart-bar')
  if (!fromEl || !cart) return
  const from = fromEl.getBoundingClientRect()
  const to = cart.getBoundingClientRect()
  const ghost = document.createElement('div')
  ghost.className = 'cart-fly-ghost'
  ghost.style.left = `${from.left + from.width / 2 - 14}px`
  ghost.style.top = `${from.top + from.height / 2 - 14}px`
  document.body.appendChild(ghost)
  requestAnimationFrame(() => {
    ghost.style.transform = `translate(${to.left + to.width / 2 - (from.left + from.width / 2)}px, ${to.top + to.height / 2 - (from.top + from.height / 2)}px) scale(0.35)`
    ghost.style.opacity = '0'
  })
  setTimeout(() => ghost.remove(), 650)
}

export default function Home() {
  const { cart, cartCount, cartTotal, addToCart, setQty } = useApp()
  const { lang, isRTL } = useI18n()
  const isDesktop = useIsDesktop()
  const t = ui[lang] || ui.ar
  const storeId = stores[0]?.id

  const allProducts = getProducts()
  const saleProducts = allProducts.filter(p => p.oldPrice).slice(0, 10)

  const handleAdd = (p, el) => {
    if (addToCart && storeId) addToCart(storeId, p.id, 1)
    if (el) flyToCart(el)
  }

  const qtyOf = (productId) => cart.find((i) => i.productId === productId)?.qty || 0

  if (isDesktop) {
    return (
      <div className="metro-home">
        <HeroPromoSlider slides={brandBanners} lang={lang} isRTL={isRTL} />

        <section className="metro-cats" aria-label="categories">
          <div className="metro-cats-scroll">
            {[
              ...categories.filter(c => c.id !== 'offers' && !['household', 'personal'].includes(c.id)),
              categories.find(c => c.id === 'offers'),
            ].filter(Boolean).map(cat => (
              <Link
                key={cat.id}
                to={`/category/${cat.id}`}
                className={`metro-cat${cat.id === 'offers' ? ' hot' : ''}`}
              >
                <span className="metro-cat-icon" aria-hidden="true">{cat.icon}</span>
                <span className="metro-cat-label">{getCategoryName(cat, lang)}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="metro-section">
          <div className="metro-section-head">
            <h2>{t.shopByBrand}</h2>
            <Link to="/brands">{t.viewAll} {isRTL ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}</Link>
          </div>
          <BrandBannerSlider
            banners={shopByBrandCards.map(c => ({
              ...c,
              tagline: c.subtitles,
            }))}
            lang={lang}
            isRTL={isRTL}
          />
        </section>

        <FlashSale
          products={saleProducts}
          lang={lang}
          t={t}
          onAdd={handleAdd}
          qtyOf={qtyOf}
          onSetQty={setQty}
        />

        {['produce', 'meat', 'ready', 'dairy', 'drinks', 'snacks', 'bakery', 'frozen'].flatMap(catId => {
          const cat = categories.find(c => c.id === catId)
          const banner = banners.find(b => b.category === catId)
          const products = getProductsByCategory(catId)
          if (products.length === 0) return []

          const sections = [
            <CategorySection 
              key={catId}
              category={cat}
              banner={banner}
              products={products}
              lang={lang}
              t={t}
              isRTL={isRTL}
              onAdd={handleAdd}
              qtyOf={qtyOf}
              onSetQty={setQty}
            />,
          ]

          // Banetti brand row — same layout as category sections (after snacks)
          if (catId === 'snacks') {
            const banettiCard = shopByBrandCards.find(b => b.brand === 'banetti')
            const banettiProducts = getProductsByBrand('banetti')
            if (banettiProducts.length > 0) {
              sections.push(
                <CategorySection
                  key="banetti"
                  category={{
                    id: 'banetti',
                    icon: '🍝',
                    color: '#1565C0',
                    nameTr: 'Banetti',
                    nameEn: 'Banetti',
                    nameAr: 'بانيتي',
                    name: 'Banetti',
                  }}
                  banner={{
                    color: '#1565C0',
                    image: banettiCard?.banner || '/brands/banetti/banner.jpg',
                    titles: { ar: 'بانيتي', en: 'Banetti', tr: 'Banetti' },
                    subtitles: banettiCard?.subtitles || {
                      ar: 'باستا إيطالية أصلية',
                      en: 'Authentic Italian Pasta',
                      tr: 'Orijinal İtalyan Makarna',
                    },
                  }}
                  products={banettiProducts}
                  lang={lang}
                  t={t}
                  isRTL={isRTL}
                  onAdd={handleAdd}
                  qtyOf={qtyOf}
                  onSetQty={setQty}
                  viewAllTo="/brand/banetti"
                />
              )
            }
          }

          return sections
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

function HeroPromoSlider({ slides, lang, isRTL }) {
  const [index, setIndex] = useState(0)
  const total = slides.length

  useEffect(() => {
    if (total <= 1) return
    const id = setInterval(() => setIndex(i => (i + 1) % total), 5000)
    return () => clearInterval(id)
  }, [total])

  const prev = () => setIndex(i => (i - 1 + total) % total)
  const next = () => setIndex(i => (i + 1) % total)
  const slide = slides[index]
  if (!slide) return null

  return (
    <section className="hero-promo">
      <Link
        to={`/brand/${slide.brand}`}
        className="hero-promo-slide"
        dir={isRTL ? 'rtl' : 'ltr'}
        style={{
          background: `linear-gradient(${isRTL ? '255deg' : '105deg'}, ${slide.color} 0%, ${slide.color2 || slide.color} 100%)`,
          '--hero-accent': slide.accent || '#FFF59D',
          '--hero-circle-text': slide.textOnCircle || '#0B4F8A',
        }}
      >
        <div className="hero-promo-wave" aria-hidden="true" />
        <div className="hero-promo-inner">
          <div className="hero-promo-logo">
            <div className="hero-promo-circle">
              <strong>{slide.titles[lang]}</strong>
              <span>{slide.category?.[lang] || ''}</span>
            </div>
          </div>
          <div className="hero-promo-copy">
            <h2>{slide.titles[lang]}</h2>
            <p>
              {slide.subtitles[lang]}
              <br />
              <em>{slide.highlights?.[lang] || slide.tagline?.[lang] || ''}</em>
            </p>
            <span className="hero-promo-rule" />
          </div>
        </div>
      </Link>
      {total > 1 && (
        <>
          <button type="button" className="hero-promo-arrow prev" onClick={isRTL ? next : prev} aria-label="Prev">
            {isRTL ? <ChevronRight size={22} /> : <ChevronLeft size={22} />}
          </button>
          <button type="button" className="hero-promo-arrow next" onClick={isRTL ? prev : next} aria-label="Next">
            {isRTL ? <ChevronLeft size={22} /> : <ChevronRight size={22} />}
          </button>
          <div className="hero-promo-dots">
            {slides.map((s, i) => (
              <button key={s.id} type="button" className={i === index ? 'active' : ''} onClick={() => setIndex(i)} />
            ))}
          </div>
        </>
      )}
    </section>
  )
}

function BrandBannerSlider({ banners, lang, isRTL }) {
  const [index, setIndex] = useState(0)
  const trackRef = useRef(null)
  const visible = 4
  const maxIndex = Math.max(0, banners.length - visible)

  useEffect(() => {
    if (banners.length <= visible) return
    const id = setInterval(() => {
      setIndex(i => (i >= maxIndex ? 0 : i + 1))
    }, 4200)
    return () => clearInterval(id)
  }, [banners.length, maxIndex])

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    const viewport = el.parentElement
    if (!viewport) return
    const gap = 16
    const cardW = Math.floor((viewport.clientWidth - gap * (visible - 1)) / visible)
    el.querySelectorAll('.brand-banner-card').forEach((c) => {
      c.style.flex = `0 0 ${cardW}px`
      c.style.width = `${cardW}px`
      c.style.minWidth = `${cardW}px`
    })
    el.style.transform = `translateX(${(isRTL ? 1 : -1) * index * (cardW + gap)}px)`
  }, [index, isRTL, banners.length, visible])

  const prev = () => setIndex(i => Math.max(0, i - 1))
  const next = () => setIndex(i => Math.min(maxIndex, i + 1))

  return (
    <div className="brand-slider">
      <div className="brand-slider-viewport">
        <div className="brand-slider-track" ref={trackRef}>
          {banners.map(bb => (
            <Link key={bb.id} to={`/brand/${bb.brand}`} className="brand-banner-card" style={{ background: bb.color }}>
              <img src={bb.image} alt="" className="brand-banner-img" />
              <div className="brand-banner-content">
                <h3>{bb.titles[lang]}</h3>
                <p>{bb.subtitles[lang]}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
      {maxIndex > 0 && (
        <>
          <button type="button" className="brand-slider-arrow prev" onClick={isRTL ? next : prev} aria-label="Prev">
            {isRTL ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
          <button type="button" className="brand-slider-arrow next" onClick={isRTL ? prev : next} aria-label="Next">
            {isRTL ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
          <div className="brand-slider-dots">
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
              <button
                key={i}
                type="button"
                className={i === index ? 'active' : ''}
                onClick={() => setIndex(i)}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function CategorySection({ category, banner, products, lang, t, isRTL, onAdd, qtyOf, onSetQty, viewAllTo }) {
  const [page, setPage] = useState(0)
  const pageSize = 8
  const totalPages = Math.ceil(products.length / pageSize)
  const currentProducts = products.slice(page * pageSize, (page + 1) * pageSize)
  const moreHref = viewAllTo || `/category/${category?.id}`

  const filters = [
    { id: 'new', label: t.newProducts },
    { id: 'best', label: t.bestSellers },
    { id: 'featured', label: t.featured },
  ]
  const [activeFilter, setActiveFilter] = useState('new')

  return (
    <section className="cat-section">
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
          <Link to={moreHref}>{t.viewAll}</Link>
        </div>
      </div>

      <div className="cat-section-content">
        {banner && (
          <Link to={moreHref} className="cat-section-banner" style={{ background: banner.color }}>
            <img src={banner.image} alt="" />
            <div className="cat-section-banner-overlay">
              <span className="cat-section-banner-tag">{banner.subtitles?.[lang]}</span>
              <h3>{banner.titles?.[lang]}</h3>
              <div className="cat-section-banner-discount">30%<br/><span>{t.off}</span></div>
            </div>
            <button className="cat-section-banner-btn">
              {t.shopNow}
            </button>
          </Link>
        )}

        <div className="cat-section-products">
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

          <div className="cat-section-grid" key={page}>
            {currentProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                lang={lang}
                t={t}
                qty={qtyOf(p.id)}
                onAdd={(el) => onAdd(p, el)}
                onSetQty={onSetQty}
              />
            ))}
          </div>
          {totalPages > 1 && (
            <div className="cat-slider-dots">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button key={i} type="button" className={i === page ? 'active' : ''} onClick={() => setPage(i)} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

function ProductCard({ product, lang, t, qty = 0, onAdd, onSetQty }) {
  const p = product
  const [justAdded, setJustAdded] = useState(false)
  const btnRef = useRef(null)
  const discount = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0

  const handleClick = () => {
    onAdd(btnRef.current)
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 450)
  }

  return (
    <div className={`cat-product${justAdded ? ' is-added' : ''}`}>
      {discount > 0 && <span className="cat-product-sale">{t.sale}</span>}
      <Link to={`/product/${p.id}`} className="cat-product-img">
        <img src={p.image} alt={productName(p, lang)} />
      </Link>
      <div className="cat-product-info">
        <h3>{productName(p, lang)}</h3>
        <div className="cat-product-price">
          <strong>{formatIQD(p.price, lang)}</strong>
          {p.oldPrice && <span className="cat-product-from">{t.from}</span>}
          {p.oldPrice && <del>{formatIQD(p.oldPrice, lang)}</del>}
        </div>
        {qty > 0 ? (
          <div className="cat-product-qty" role="group" aria-label="quantity">
            <button type="button" onClick={() => onSetQty(p.id, qty - 1)} aria-label="decrease">
              <Minus size={14} />
            </button>
            <span>{qty}</span>
            <button
              type="button"
              onClick={(e) => {
                onSetQty(p.id, qty + 1)
                flyToCart(e.currentTarget)
              }}
              aria-label="increase"
            >
              <Plus size={14} />
            </button>
          </div>
        ) : (
          <button
            ref={btnRef}
            type="button"
            className="cat-product-btn"
            onClick={handleClick}
          >
            {t.addToCart}
          </button>
        )}
      </div>
    </div>
  )
}

function FlashSale({ products, lang, t, onAdd, qtyOf, onSetQty }) {
  const [time, setTime] = useState({ hours: 2, minutes: 0, seconds: 47 })
  const scrollerRef = useRef(null)

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

  const scrollBy = (dir) => {
    const el = scrollerRef.current
    if (!el) return
    el.scrollBy({ left: dir * 202, behavior: 'smooth' })
  }

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
        <div className="flash-sale-nav">
          <button type="button" onClick={() => scrollBy(-1)} aria-label="Prev"><ChevronLeft size={18} /></button>
          <button type="button" onClick={() => scrollBy(1)} aria-label="Next"><ChevronRight size={18} /></button>
        </div>
      </div>
      <div className="flash-sale-products" ref={scrollerRef}>
        {products.map(p => {
          const discount = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0
          const qty = qtyOf(p.id)
          return (
            <div key={p.id} className={`flash-sale-card${qty > 0 ? ' in-cart' : ''}`}>
              <span className="flash-sale-badge">{t.save} {discount}%</span>
              <Link to={`/product/${p.id}`} className="flash-sale-img">
                <img src={p.image} alt={productName(p, lang)} />
              </Link>
              {qty > 0 ? (
                <div className="flash-sale-qty" role="group" aria-label="quantity">
                  <button type="button" onClick={() => onSetQty(p.id, qty - 1)} aria-label="decrease">
                    <Minus size={14} />
                  </button>
                  <span>{qty}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      onSetQty(p.id, qty + 1)
                      flyToCart(e.currentTarget)
                    }}
                    aria-label="increase"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className="flash-sale-add"
                  onClick={(e) => onAdd(p, e.currentTarget)}
                >
                  <Plus size={16} />
                </button>
              )}
              <div className="flash-sale-info">
                <h4>{productName(p, lang)}</h4>
                <div className="flash-sale-prices">
                  <strong>{formatIQD(p.price, lang)}</strong>
                  {p.oldPrice && <span className="cat-product-from">{t.from}</span>}
                  {p.oldPrice && <del>{formatIQD(p.oldPrice, lang)}</del>}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
