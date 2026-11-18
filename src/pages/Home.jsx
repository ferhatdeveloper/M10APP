import { Link } from 'react-router'
import { Search, ShoppingBag, Star, Plus, ChevronLeft, ChevronRight } from 'lucide-react'
import TopBar from '../components/TopBar.jsx'
import StoreCard from '../components/StoreCard.jsx'
import { useApp } from '../context/AppContext.web.jsx'
import { useI18n } from '../context/I18nContext.web.jsx'
import { useIsDesktop } from '../hooks/useIsDesktop.js'
import { 
  banners, categories, brands, formatIQD, stores, 
  getProducts, getProductsByBrand, getProductsByCategory,
  productName, getCategoryName, getBrandName, ui 
} from '../data/mock.web.js'

export default function Home() {
  const { favorites, cartCount, cartTotal, addToCart } = useApp()
  const { lang, isRTL } = useI18n()
  const isDesktop = useIsDesktop()
  const t = ui[lang] || ui.ar

  const allProducts = getProducts()
  const popularProducts = allProducts.filter(p => p.popular)
  const produceProducts = getProductsByCategory('produce')
  const nescafeProducts = getProductsByBrand('nescafe')
  const cocaProducts = getProductsByBrand('coca-cola')
  const dairyProducts = getProductsByCategory('dairy')
  const snackProducts = getProductsByCategory('snacks')

  const produceBanner = banners.find(b => b.id === 'produce-banner')
  const nescafeBanner = banners.find(b => b.id === 'nescafe-banner')

  if (isDesktop) {
    return (
      <div className="metro-home">
        {/* Flash Deals Slider */}
        <section className="metro-flash">
          <div className="metro-flash-slide">
            <div className="metro-flash-content">
              <span className="metro-flash-badge">🔥 {lang === 'ar' ? 'عروض حصرية' : lang === 'tr' ? 'Özel Fırsatlar' : 'Exclusive Deals'}</span>
              <h1>{lang === 'ar' ? 'خصم يصل إلى 30%' : lang === 'tr' ? '%30\'a Varan İndirim' : 'Up to 30% OFF'}</h1>
              <p>{lang === 'ar' ? 'على أفضل المنتجات' : lang === 'tr' ? 'En iyi ürünlerde' : 'On best products'}</p>
              <Link to="/category/offers" className="metro-flash-btn">
                {lang === 'ar' ? 'تسوق الآن' : lang === 'tr' ? 'Alışverişe Başla' : 'Shop Now'}
              </Link>
            </div>
          </div>
        </section>

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

        {/* Flash Deals Products */}
        <section className="metro-section">
          <div className="metro-section-head">
            <h2>{t.flashDeals}</h2>
            <Link to="/category/offers">{t.viewAll} {isRTL ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}</Link>
          </div>
          <div className="metro-products-row">
            {popularProducts.slice(0, 8).map((p) => (
              <ProductCard key={p.id} product={p} lang={lang} t={t} onAdd={() => addToCart && addToCart(stores[0].id, p)} />
            ))}
          </div>
        </section>

        {/* Fresh Produce Banner + Products */}
        <section className="metro-banner-section">
          <div className="metro-banner green">
            <img src={produceBanner?.image} alt="" />
            <div className="metro-banner-overlay">
              <span className="metro-banner-tag">{t.farmFresh}</span>
              <h3>{produceBanner?.subtitles[lang] || produceBanner?.subtitles.en}</h3>
              <p>{t.dailyFresh}</p>
            </div>
          </div>
          <div className="metro-banner-products">
            {produceProducts.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} lang={lang} t={t} compact onAdd={() => addToCart && addToCart(stores[0].id, p)} />
            ))}
          </div>
        </section>

        {/* Shop by Brand */}
        <section className="metro-section">
          <div className="metro-section-head">
            <h2>{t.shopByBrand}</h2>
            <Link to="/brands">{t.viewAll} {isRTL ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}</Link>
          </div>
          <div className="metro-brands">
            {brands.map(brand => (
              <Link key={brand.id} to={`/brand/${brand.id}`} className="metro-brand">
                <div className="metro-brand-logo" style={{ background: brand.color + '15' }}>
                  <span style={{ color: brand.color, fontWeight: 800, fontSize: 14 }}>{brand.name}</span>
                </div>
                <span>{getBrandName(brand, lang)}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Nescafe Banner + Products */}
        <section className="metro-banner-section">
          <div className="metro-banner brown">
            <img src={nescafeBanner?.image} alt="" />
            <div className="metro-banner-overlay">
              <span className="metro-banner-logo">NESCAFÉ</span>
              <h3>{nescafeBanner?.titles[lang] || nescafeBanner?.titles.en}</h3>
            </div>
          </div>
          <div className="metro-banner-products">
            {nescafeProducts.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} lang={lang} t={t} compact onAdd={() => addToCart && addToCart(stores[0].id, p)} />
            ))}
          </div>
        </section>

        {/* Buy Again */}
        <section className="metro-section">
          <div className="metro-section-head">
            <h2>{t.buyAgain}</h2>
            <Link to="/orders">{t.viewAll} {isRTL ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}</Link>
          </div>
          <div className="metro-products-row">
            {dairyProducts.concat(snackProducts).slice(0, 6).map((p) => (
              <ProductCard key={p.id} product={p} lang={lang} t={t} onAdd={() => addToCart && addToCart(stores[0].id, p)} />
            ))}
          </div>
        </section>

        {/* Coca-Cola Products */}
        <section className="metro-section">
          <div className="metro-section-head">
            <h2>🥤 Coca-Cola</h2>
            <Link to="/brand/coca-cola">{t.viewAll} {isRTL ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}</Link>
          </div>
          <div className="metro-products-row">
            {cocaProducts.map((p) => (
              <ProductCard key={p.id} product={p} lang={lang} t={t} onAdd={() => addToCart && addToCart(stores[0].id, p)} />
            ))}
          </div>
        </section>

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
              <div className={`cat-icon${c.id === 'offers' ? ' offer' : ''}`}>
                {c.icon}
              </div>
              <span>{getCategoryName(c, lang)}</span>
            </Link>
          ))}
        </div>

        <div className="banners" style={{ marginTop: 18 }}>
          {banners.slice(0, 2).map((b) => (
            <Link key={b.id} to={b.type === 'brand' ? `/brand/${b.brand}` : `/category/${b.category}`} className="banner has-img">
              <img className="fly" src={b.image} alt="" />
              <div className="banner-copy">
                <span className="chip" style={{ marginBottom: 8, background: 'rgba(255,255,255,0.2)', color: '#fff' }}>
                  {b.subtitles[lang]}
                </span>
                <div className="h1">{b.titles[lang]}</div>
              </div>
            </Link>
          ))}
        </div>

        <div className="section-title" style={{ marginTop: 20 }}>
          <h2 className="h2">{t.popular}</h2>
          <Link to="/category/offers" className="muted">{t.viewAll}</Link>
        </div>
        <div className="stack" style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 8 }}>
          {popularProducts.slice(0, 4).map((p) => (
            <div key={p.id} style={{ minWidth: 140, background: '#fff', borderRadius: 12, padding: 10 }}>
              <img src={p.image} alt="" style={{ width: '100%', height: 100, objectFit: 'cover', borderRadius: 8 }} />
              <div style={{ marginTop: 8, fontSize: 13, fontWeight: 600 }}>{productName(p, lang)}</div>
              <div style={{ color: '#e31e24', fontWeight: 700, marginTop: 4 }}>{formatIQD(p.price, lang)}</div>
            </div>
          ))}
        </div>
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

function ProductCard({ product, lang, t, compact, onAdd }) {
  const p = product
  const discount = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0

  return (
    <div className={`metro-product ${compact ? 'compact' : ''}`}>
      {discount > 0 && <span className="metro-product-badge">-{discount}%</span>}
      <Link to={`/store/${stores[0].id}`} className="metro-product-img">
        <img src={p.image} alt={productName(p, lang)} />
      </Link>
      <div className="metro-product-info">
        <h3>{productName(p, lang)}</h3>
        <div className="metro-product-price">
          <strong>{formatIQD(p.price, lang)}</strong>
          {p.oldPrice && <del>{formatIQD(p.oldPrice, lang)}</del>}
        </div>
        <button className="metro-add-btn" onClick={onAdd}>
          <Plus size={16} />
        </button>
      </div>
    </div>
  )
}
