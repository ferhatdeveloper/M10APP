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
      <div className="desktop-home">
        <div className="banners">
          {banners.map((b) => {
            const imgSrc = b.id === 'b1' ? '/promo-banner.png' : b.image
            const yellow = b.color === 'yellow'
            return (
              <Link
                key={b.id}
                to={bannerHref(b)}
                className={`banner${imgSrc ? ' has-img' : ''}${yellow ? ' banner-yellow' : ''}`}
              >
                {imgSrc ? <img className="fly" src={imgSrc} alt={b.titleAr} /> : null}
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
                  <div className="h1">{b.titleAr}</div>
                  <p style={{ opacity: 0.92, fontWeight: 600, marginTop: 4 }}>{b.subAr}</p>
                </div>
              </Link>
            )
          })}
        </div>

        <div className="cats">
          {categories.slice(0, 8).map((c) => (
            <Link key={c.id} to={categoryHref(c.id)} className="cat">
              <div
                className={`cat-icon${c.id === 'offers' ? ' offer' : ''}${c.id === 'butler' ? ' butler' : ''}`}
              >
                {c.icon || '📦'}
              </div>
              <span>{c.nameAr || c.name || c.id}</span>
            </Link>
          ))}
        </div>

        {dealProducts.length > 0 && (
          <section style={{ marginBottom: 32 }}>
            <div className="section-title">
              <h2 className="h2" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                🔥 عروض اليوم
              </h2>
              <Link to="/category/offers" className="muted" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                عرض الكل
                <ChevronLeft size={16} />
              </Link>
            </div>
            <div className="stack" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
              {dealProducts.map((p, i) => (
                <Link
                  key={`${p.id}-${i}`}
                  to={`/store/${p.storeId || stores[0].id}`}
                  className="product-row"
                  style={{ padding: 12 }}
                >
                  <div>
                    <span className="chip" style={{ marginBottom: 6 }}>عرض</span>
                    <div className="h2" style={{ fontSize: 14 }}>{p.nameAr || p.names?.ar || p.name}</div>
                    <p className="muted" style={{ fontSize: 12 }}>{p.desc}</p>
                    <div className="row" style={{ marginTop: 8 }}>
                      <span className="price">{formatIQD(p.price)}</span>
                      <span className="old-price">{formatIQD(p.oldPrice)}</span>
                    </div>
                  </div>
                  <img src={p.image} alt={p.name} style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 10 }} />
                </Link>
              ))}
            </div>
          </section>
        )}

        {favStores.length > 0 && (
          <section style={{ marginBottom: 32 }}>
            <div className="section-title">
              <h2 className="h2 row" style={{ gap: 6 }}>
                <Star size={18} fill="#f5c400" color="#f5c400" />
                المفضلة
              </h2>
              <Link to="/favorites" className="muted" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                عرض الكل
                <ChevronLeft size={16} />
              </Link>
            </div>
            <div className="stack">
              {favStores.map((store) => (
                <StoreCard key={store.id} store={store} />
              ))}
            </div>
          </section>
        )}

        <section>
          <div className="section-title">
            <h2 className="h2">المتاجر القريبة</h2>
            <span className="muted">{nearbyStores.length} متجر</span>
          </div>
          <div className="stack">
            {nearbyStores.map((store) => (
              <StoreCard key={store.id} store={store} />
            ))}
          </div>
        </section>

        {cartCount > 0 && (
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
