import { Link } from 'react-router'
import { Search, ShoppingBag, Star, ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import TopBar from '../components/TopBar.jsx'
import StoreCard from '../components/StoreCard.jsx'
import { useApp } from '../context/AppContext.web.jsx'
import { useI18n } from '../context/I18nContext.web.jsx'
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

const catIcons = {
  offers: '🔥', meat: '🥩', ready: '🍗', drinks: '🥤', dairy: '🥛',
  produce: '🥬', bakery: '🥖', pantry: '🫙', snacks: '🍿', frozen: '❄️',
  household: '🧹', personal: '🧴', coldcuts: '🥓', home: '🏠'
}

export default function Home() {
  const { favorites, cartCount, cartTotal, cartStore, addToCart } = useApp()
  const { lang } = useI18n()
  const isDesktop = useIsDesktop()

  const allProducts = getProducts()
  const dealProducts = allProducts.filter(p => p.oldPrice).slice(0, 8)
  const popularProducts = allProducts.filter(p => p.popular).slice(0, 8)
  const allProductsShow = allProducts.slice(0, 12)

  if (isDesktop) {
    return (
      <div className="mgs-home">
        {/* Hero Slider */}
        <section className="mgs-slider">
          <div className="mgs-slider-main">
            <img src="https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=1200" alt="عروض" />
            <div className="mgs-slider-content">
              <span className="mgs-slider-badge">عرض خاص</span>
              <h1>خصم يصل إلى 50%</h1>
              <p>على جميع منتجات اللحوم والدواجن</p>
              <Link to="/category/offers" className="mgs-slider-btn">تسوق الآن</Link>
            </div>
          </div>
          <div className="mgs-slider-side">
            <Link to="/category/meat" className="mgs-side-card">
              <img src="https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400" alt="لحوم" />
              <div className="mgs-side-overlay">
                <span>لحوم طازجة</span>
                <small>جودة عالية</small>
              </div>
            </Link>
            <Link to="/category/produce" className="mgs-side-card">
              <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=400" alt="خضار" />
              <div className="mgs-side-overlay">
                <span>خضار وفواكه</span>
                <small>طازج يومياً</small>
              </div>
            </Link>
          </div>
        </section>

        {/* Categories Row */}
        <section className="mgs-cats">
          <div className="mgs-cats-scroll">
            {categories.map(cat => (
              <Link key={cat.id} to={`/category/${cat.id}`} className="mgs-cat">
                <div className={`mgs-cat-icon ${cat.id === 'offers' ? 'hot' : ''}`}>
                  {catIcons[cat.id] || '📦'}
                </div>
                <span>{cat.nameAr || cat.name}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Campaign Banners */}
        <section className="mgs-campaigns">
          <Link to="/category/offers" className="mgs-camp red">
            <div className="mgs-camp-text">
              <span>🔥 عروض الأسبوع</span>
              <small>وفر حتى 40%</small>
            </div>
          </Link>
          <Link to="/category/drinks" className="mgs-camp blue">
            <div className="mgs-camp-text">
              <span>🥤 اشتر 2 واحصل على 1</span>
              <small>على المشروبات</small>
            </div>
          </Link>
          <Link to="/rewards" className="mgs-camp gold">
            <div className="mgs-camp-text">
              <span>⭐ نقاط M10</span>
              <small>اجمع واستبدل</small>
            </div>
          </Link>
        </section>

        {/* Deals Section */}
        {dealProducts.length > 0 && (
          <section className="mgs-section">
            <div className="mgs-section-head">
              <h2>🔥 عروض اليوم</h2>
              <Link to="/category/offers">عرض الكل <ChevronLeft size={16} /></Link>
            </div>
            <div className="mgs-products">
              {dealProducts.map((p, i) => (
                <div key={p.id} className="mgs-product">
                  {p.oldPrice && <span className="mgs-product-badge">-{Math.round((1 - p.price/p.oldPrice) * 100)}%</span>}
                  <Link to={`/store/${stores[0].id}`}>
                    <img src={p.image} alt={p.nameAr || p.name} />
                  </Link>
                  <div className="mgs-product-info">
                    <h3>{p.nameAr || p.name}</h3>
                    <p>{p.desc}</p>
                    <div className="mgs-product-price">
                      <strong>{formatIQD(p.price, lang)}</strong>
                      {p.oldPrice && <del>{formatIQD(p.oldPrice, lang)}</del>}
                    </div>
                    <button className="mgs-add-btn" onClick={() => addToCart && addToCart(stores[0].id, p)}>
                      <Plus size={18} /> أضف
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Popular Products */}
        {popularProducts.length > 0 && (
          <section className="mgs-section">
            <div className="mgs-section-head">
              <h2>⭐ الأكثر مبيعاً</h2>
              <Link to="/category/meat">عرض الكل <ChevronLeft size={16} /></Link>
            </div>
            <div className="mgs-products">
              {popularProducts.map((p) => (
                <div key={p.id} className="mgs-product">
                  {p.popular && <span className="mgs-product-badge pop">مميز</span>}
                  <Link to={`/store/${stores[0].id}`}>
                    <img src={p.image} alt={p.nameAr || p.name} />
                  </Link>
                  <div className="mgs-product-info">
                    <h3>{p.nameAr || p.name}</h3>
                    <p>{p.desc}</p>
                    <div className="mgs-product-price">
                      <strong>{formatIQD(p.price, lang)}</strong>
                    </div>
                    <button className="mgs-add-btn" onClick={() => addToCart && addToCart(stores[0].id, p)}>
                      <Plus size={18} /> أضف
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* All Products */}
        <section className="mgs-section">
          <div className="mgs-section-head">
            <h2>🛒 تسوق المنتجات</h2>
            <Link to="/store/m10-market">عرض الكل <ChevronLeft size={16} /></Link>
          </div>
          <div className="mgs-products-grid">
            {allProductsShow.map((p) => (
              <div key={p.id} className="mgs-product">
                {p.oldPrice && <span className="mgs-product-badge">-{Math.round((1 - p.price/p.oldPrice) * 100)}%</span>}
                <Link to={`/store/${stores[0].id}`}>
                  <img src={p.image} alt={p.nameAr || p.name} />
                </Link>
                <div className="mgs-product-info">
                  <h3>{p.nameAr || p.name}</h3>
                  <p>{p.desc}</p>
                  <div className="mgs-product-price">
                    <strong>{formatIQD(p.price, lang)}</strong>
                    {p.oldPrice && <del>{formatIQD(p.oldPrice, lang)}</del>}
                  </div>
                  <button className="mgs-add-btn" onClick={() => addToCart && addToCart(stores[0].id, p)}>
                    <Plus size={18} /> أضف
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Floating Cart */}
        {cartCount > 0 && (
          <Link to="/cart" className="mgs-float-cart">
            <ShoppingBag size={20} />
            <span className="mgs-float-count">{cartCount}</span>
            <span>عرض السلة</span>
            <strong>{formatIQD(cartTotal, lang)}</strong>
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
