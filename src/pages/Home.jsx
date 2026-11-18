import { Link } from 'react-router'
import { Search, ShoppingBag, Star, ChevronLeft } from 'lucide-react'
import TopBar from '../components/TopBar.jsx'
import StoreCard from '../components/StoreCard.jsx'
import { useApp } from '../context/AppContext.web.jsx'
import { useIsDesktop } from '../hooks/useIsDesktop.js'
import { banners, categories, formatIQD, stores, getProducts } from '../data/mock.web.js'

const categoryHref = (id) => (id === 'butler' ? '/butler' : `/category/${id}`)

const bannerHref = (banner) => {
  if (banner.id === 'b1') return '/store/wild-tiger'
  if (banner.id === 'b2') return '/category/restaurants'
  if (banner.id === 'b3') return '/rewards'
  return '/'
}

const bannerChip = (banner) => {
  if (banner.id === 'b1') return 'عرض اليوم'
  if (banner.id === 'b2') return 'خلال 30 د'
  if (banner.id === 'b3') return 'نقاط'
  return 'M10'
}

const itemWord = (n) => {
  if (n === 1) return 'منتج'
  if (n === 2) return 'منتجين'
  if (n >= 3 && n <= 10) return 'منتجات'
  return 'منتج'
}

export default function Home() {
  const { favorites, cartCount, cartTotal, cartStore } = useApp()
  const isDesktop = useIsDesktop()

  const favStores = favorites
    .map((id) => stores.find((s) => s.id === id))
    .filter(Boolean)
  const nearbyStores = stores.filter((s) => !favorites.includes(s.id))

  const dealProducts = stores
    .filter(s => !s.comingSoon)
    .flatMap(s => getProducts(s.id).filter(p => p.oldPrice).slice(0, 2))
    .slice(0, 8)

  if (isDesktop) {
    return (
      <div className="desktop-home-2027">
        {/* Hero Banner Section */}
        <section className="dh2-hero">
          <div className="dh2-hero-main">
            <div className="dh2-hero-content">
              <span className="dh2-hero-badge">عروض حصرية</span>
              <h1 className="dh2-hero-title">تسوق بذكاء، وفر أكثر</h1>
              <p className="dh2-hero-desc">احصل على خصم يصل إلى 50% على منتجات مختارة. التوصيل خلال 30 دقيقة.</p>
              <Link to="/category/offers" className="dh2-hero-btn">تصفح العروض</Link>
            </div>
            <div className="dh2-hero-image">
              <img src="https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=600" alt="عروض" />
            </div>
          </div>
          <div className="dh2-hero-cards">
            <Link to="/category/produce" className="dh2-promo-card green">
              <span className="dh2-promo-label">طازج يومياً</span>
              <span className="dh2-promo-title">خضار وفواكه</span>
              <span className="dh2-promo-link">تسوق الآن ←</span>
            </Link>
            <Link to="/category/meat" className="dh2-promo-card red">
              <span className="dh2-promo-label">جودة عالية</span>
              <span className="dh2-promo-title">لحوم طازجة</span>
              <span className="dh2-promo-link">تسوق الآن ←</span>
            </Link>
          </div>
        </section>

        {/* Quick Categories */}
        <section className="dh2-categories">
          <h2 className="dh2-section-title">تسوق حسب التصنيف</h2>
          <div className="dh2-cat-grid">
            {categories.slice(0, 10).map((c) => (
              <Link key={c.id} to={categoryHref(c.id)} className="dh2-cat-card">
                <div className={`dh2-cat-icon ${c.id === 'offers' ? 'offers' : ''}`}>
                  {c.id === 'offers' && '🔥'}
                  {c.id === 'meat' && '🥩'}
                  {c.id === 'dairy' && '🥛'}
                  {c.id === 'produce' && '🥬'}
                  {c.id === 'bakery' && '🥖'}
                  {c.id === 'pantry' && '🫙'}
                  {c.id === 'drinks' && '🥤'}
                  {c.id === 'snacks' && '🍿'}
                  {c.id === 'frozen' && '❄️'}
                  {c.id === 'household' && '🧹'}
                  {c.id === 'personal' && '🧴'}
                </div>
                <span className="dh2-cat-name">{c.nameAr || c.name}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Deal Products */}
        {dealProducts.length > 0 && (
          <section className="dh2-section">
            <div className="dh2-section-header">
              <h2 className="dh2-section-title">
                <span className="dh2-fire">🔥</span> عروض اليوم
              </h2>
              <Link to="/category/offers" className="dh2-section-link">عرض الكل ←</Link>
            </div>
            <div className="dh2-products-grid">
              {dealProducts.map((p, i) => (
                <Link key={`${p.id}-${i}`} to={`/store/${p.storeId || stores[0].id}`} className="dh2-product-card">
                  <div className="dh2-product-badge">خصم</div>
                  <img src={p.image} alt={p.name} className="dh2-product-img" />
                  <div className="dh2-product-info">
                    <h3 className="dh2-product-name">{p.nameAr || p.names?.ar || p.name}</h3>
                    <p className="dh2-product-desc">{p.desc}</p>
                    <div className="dh2-product-prices">
                      <span className="dh2-price-current">{formatIQD(p.price)}</span>
                      <span className="dh2-price-old">{formatIQD(p.oldPrice)}</span>
                    </div>
                    <button className="dh2-add-btn">أضف للسلة</button>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Stores Section */}
        <section className="dh2-section">
          <div className="dh2-section-header">
            <h2 className="dh2-section-title">المتاجر القريبة</h2>
            <span className="dh2-section-count">{stores.length} متجر متاح</span>
          </div>
          <div className="dh2-stores-grid">
            {stores.map((store) => (
              <Link key={store.id} to={`/store/${store.id}`} className="dh2-store-card">
                <div className="dh2-store-img-wrap">
                  <img src={store.cover} alt={store.name} className="dh2-store-img" />
                  <span className="dh2-store-status open">متاح الآن</span>
                </div>
                <div className="dh2-store-info">
                  <h3 className="dh2-store-name">{store.name}</h3>
                  <div className="dh2-store-meta">
                    <span className="dh2-store-rating">
                      <Star size={14} fill="#f5c400" color="#f5c400" />
                      {store.rating}
                    </span>
                    <span className="dh2-store-time">⏱ {store.eta} دقيقة</span>
                    <span className="dh2-store-fee">توصيل {formatIQD(store.fee)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Floating Cart */}
        {cartCount > 0 && (
          <Link to="/cart" className="dh2-floating-cart">
            <div className="dh2-cart-left">
              <ShoppingBag size={20} />
              <span className="dh2-cart-count">{cartCount}</span>
              <span>عرض السلة</span>
            </div>
            <span className="dh2-cart-total">{formatIQD(cartTotal)}</span>
          </Link>
        )}
      </div>
    )
  }

  return (
    <div>
      <TopBar showLocation />
      <div className={`page${cartCount > 0 ? ' page-pad-bar' : ''}`} style={{ paddingTop: 4 }}>
        <Link to="/search" className="search-box search-link">
          <Search size={18} color="#7a7a7a" />
          <span>ابحث عن مطعم، بقالة أو عرض</span>
        </Link>

        <div className="cats" style={{ marginTop: 16 }}>
          {categories.map((c) => (
            <Link key={c.id} to={categoryHref(c.id)} className="cat">
              <div
                className={`cat-icon${c.id === 'offers' ? ' offer' : ''}${c.id === 'butler' ? ' butler' : ''}`}
              >
                {c.icon}
              </div>
              <span>{c.name}</span>
            </Link>
          ))}
        </div>

        <div className="banners" style={{ marginTop: 18 }}>
          {banners.map((b) => {
            const imgSrc = b.id === 'b1' ? '/promo-banner.png' : b.image
            const yellow = b.color === 'yellow'
            return (
              <Link
                key={b.id}
                to={bannerHref(b)}
                className={`banner${imgSrc ? ' has-img' : ''}${yellow ? ' banner-yellow' : ''}`}
              >
                {imgSrc ? <img className="fly" src={imgSrc} alt={b.title} /> : null}
                <div className="banner-copy">
                  <span
                    className="chip"
                    style={{
                      marginBottom: 8,
                      background: yellow ? '#fff' : 'rgba(255,255,255,0.2)',
                      color: yellow ? '#e01828' : '#fff',
                    }}
                  >
                    {bannerChip(b)}
                  </span>
                  <div className="h1">{b.title}</div>
                  <p style={{ opacity: 0.92, fontWeight: 600, marginTop: 4 }}>{b.subtitle}</p>
                </div>
              </Link>
            )
          })}
        </div>

        {favStores.length > 0 ? (
          <>
            <div className="section-title">
              <h2 className="h2 row" style={{ gap: 6 }}>
                <Star size={16} fill="#f5c400" color="#f5c400" />
                المفضلة
              </h2>
              <Link to="/favorites" className="muted">
                عرض الكل
              </Link>
            </div>
            <div className="stack">
              {favStores.map((store) => (
                <StoreCard key={store.id} store={store} />
              ))}
            </div>
          </>
        ) : null}

        {nearbyStores.length > 0 ? (
          <>
            <div className="section-title">
              <h2 className="h2">قريب منك</h2>
              <span className="muted">{nearbyStores.length} متجر</span>
            </div>
            <div className="stack">
              {nearbyStores.map((store) => (
                <StoreCard key={store.id} store={store} />
              ))}
            </div>
          </>
        ) : null}
      </div>

      {cartCount > 0 ? (
        <Link to="/cart" className="store-cart-bar">
          <div>
            <div className="row" style={{ gap: 6 }}>
              <ShoppingBag size={16} />
              <span>
                سلتك · {cartCount} {itemWord(cartCount)}
              </span>
            </div>
            {cartStore ? (
              <div style={{ color: '#bbb', fontSize: 12, fontWeight: 700, marginTop: 2 }}>
                {cartStore.name} · {formatIQD(cartTotal)}
              </div>
            ) : (
              <div className="price" style={{ color: '#fff', marginTop: 2 }}>
                {formatIQD(cartTotal)}
              </div>
            )}
          </div>
          <span className="btn">عرض السلة</span>
        </Link>
      ) : null}
    </div>
  )
}
