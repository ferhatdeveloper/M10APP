import { Link } from 'react-router'
import { Search, ShoppingBag, Star } from 'lucide-react'
import TopBar from '../components/TopBar.jsx'
import StoreCard from '../components/StoreCard.jsx'
import { useApp } from '../context/AppContext.jsx'
import { banners, categories, formatIQD, stores } from '../data/mock.js'

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

  const favStores = favorites
    .map((id) => stores.find((s) => s.id === id))
    .filter(Boolean)
  const nearbyStores = stores.filter((s) => !favorites.includes(s.id))

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
