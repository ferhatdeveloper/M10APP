import { Link } from 'react-router'
import { Search, ShoppingBag, Star, Plus, ChevronLeft } from 'lucide-react'
import TopBar from '../components/TopBar.jsx'
import StoreCard from '../components/StoreCard.jsx'
import { useApp } from '../context/AppContext.web.jsx'
import { useI18n } from '../context/I18nContext.web.jsx'
import { useIsDesktop } from '../hooks/useIsDesktop.js'
import { banners, categories, formatIQD, stores, getProducts, productName, getCategoryName } from '../data/mock.web.js'

const categoryHref = (id) => (id === 'butler' ? '/butler' : `/category/${id}`)

const bannerHref = (banner) => {
  if (banner.id === 'b1') return '/category/offers'
  if (banner.id === 'b2') return '/category/produce'
  if (banner.id === 'b3') return '/rewards'
  return '/'
}

const itemWord = (n) => {
  if (n === 1) return 'منتج'
  if (n === 2) return 'منتجين'
  if (n >= 3 && n <= 10) return 'منتجات'
  return 'منتج'
}

const ui = {
  ar: {
    flashDeals: '🔥 عروض سريعة',
    popular: '⭐ الأكثر مبيعاً',
    shopByCategory: 'تسوق حسب التصنيف',
    viewAll: 'عرض الكل',
    addToCart: 'أضف',
    off: 'خصم',
    viewCart: 'عرض السلة',
    meat: 'اللحوم',
    chicken: 'الدجاج',
    drinks: 'المشروبات',
    other: 'أخرى',
  },
  tr: {
    flashDeals: '🔥 Fırsat Ürünleri',
    popular: '⭐ Çok Satanlar',
    shopByCategory: 'Kategorilere Göre',
    viewAll: 'Tümünü Gör',
    addToCart: 'Ekle',
    off: 'İndirim',
    viewCart: 'Sepeti Gör',
    meat: 'Et',
    chicken: 'Tavuk',
    drinks: 'İçecekler',
    other: 'Diğer',
  },
  en: {
    flashDeals: '🔥 Flash Deals',
    popular: '⭐ Best Sellers',
    shopByCategory: 'Shop by Category',
    viewAll: 'View All',
    addToCart: 'Add',
    off: 'OFF',
    viewCart: 'View Cart',
    meat: 'Meat',
    chicken: 'Chicken',
    drinks: 'Drinks',
    other: 'Other',
  },
}

export default function Home() {
  const { favorites, cartCount, cartTotal, cartStore, addToCart } = useApp()
  const { lang } = useI18n()
  const isDesktop = useIsDesktop()
  const t = ui[lang] || ui.ar

  const allProducts = getProducts()
  const popularProducts = allProducts.filter(p => p.popular)
  const meatProducts = allProducts.filter(p => p.aisle === 'meat')
  const chickenProducts = allProducts.filter(p => p.aisle === 'ready')
  const drinkProducts = allProducts.filter(p => p.aisle === 'drinks')

  const favStores = favorites
    .map((id) => stores.find((s) => s.id === id))
    .filter(Boolean)
  const nearbyStores = stores.filter((s) => !favorites.includes(s.id))

  if (isDesktop) {
    return (
      <div className="m10-home">
        {/* Flash Deals Banner */}
        <section className="m10-flash">
          <div className="m10-flash-bg">
            <div className="m10-flash-content">
              <span className="m10-flash-badge">🔥 {lang === 'ar' ? 'عروض حصرية' : lang === 'tr' ? 'Özel Fırsatlar' : 'Exclusive Deals'}</span>
              <h1>{lang === 'ar' ? 'خصم يصل إلى 25%' : lang === 'tr' ? '%25\'e Varan İndirim' : 'Up to 25% OFF'}</h1>
              <p>{lang === 'ar' ? 'على أشهى الوجبات التركية' : lang === 'tr' ? 'En lezzetli Türk yemeklerinde' : 'On delicious Turkish meals'}</p>
              <Link to="/category/offers" className="m10-flash-btn">
                {lang === 'ar' ? 'تسوق الآن' : lang === 'tr' ? 'Alışverişe Başla' : 'Shop Now'}
              </Link>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="m10-cats">
          <div className="m10-cats-scroll">
            {categories.slice(0, 10).map(cat => (
              <Link key={cat.id} to={`/category/${cat.id}`} className={`m10-cat ${cat.id === 'offers' ? 'hot' : ''}`}>
                <span className="m10-cat-icon">{cat.icon}</span>
                <span>{getCategoryName(cat, lang)}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Popular Products */}
        {popularProducts.length > 0 && (
          <section className="m10-section">
            <div className="m10-section-head">
              <h2>{t.popular}</h2>
              <Link to="/category/offers">{t.viewAll} <ChevronLeft size={16} /></Link>
            </div>
            <div className="m10-products-row">
              {popularProducts.map((p) => (
                <div key={p.id} className="m10-product">
                  {p.oldPrice && (
                    <span className="m10-product-badge">
                      -{Math.round((1 - p.price/p.oldPrice) * 100)}%
                    </span>
                  )}
                  <Link to={`/store/${stores[0].id}`} className="m10-product-img">
                    <img src={p.image} alt={productName(p, lang)} />
                  </Link>
                  <div className="m10-product-info">
                    <h3>{productName(p, lang)}</h3>
                    <p className="m10-product-cat">{p.categoryAr || p.category}</p>
                    <div className="m10-product-price">
                      <strong>{formatIQD(p.price, lang)}</strong>
                      {p.oldPrice && <del>{formatIQD(p.oldPrice, lang)}</del>}
                    </div>
                    <button 
                      className="m10-add-btn" 
                      onClick={() => addToCart && addToCart(stores[0].id, p)}
                    >
                      <Plus size={16} /> {t.addToCart}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Meat Products */}
        {meatProducts.length > 0 && (
          <section className="m10-section">
            <div className="m10-section-head">
              <h2>🥩 {t.meat}</h2>
              <Link to="/category/meat">{t.viewAll} <ChevronLeft size={16} /></Link>
            </div>
            <div className="m10-products-row">
              {meatProducts.map((p) => (
                <div key={p.id} className="m10-product">
                  {p.oldPrice && (
                    <span className="m10-product-badge">
                      -{Math.round((1 - p.price/p.oldPrice) * 100)}%
                    </span>
                  )}
                  <Link to={`/store/${stores[0].id}`} className="m10-product-img">
                    <img src={p.image} alt={productName(p, lang)} />
                  </Link>
                  <div className="m10-product-info">
                    <h3>{productName(p, lang)}</h3>
                    <p className="m10-product-cat">{p.categoryAr || p.category}</p>
                    <div className="m10-product-price">
                      <strong>{formatIQD(p.price, lang)}</strong>
                      {p.oldPrice && <del>{formatIQD(p.oldPrice, lang)}</del>}
                    </div>
                    <button 
                      className="m10-add-btn" 
                      onClick={() => addToCart && addToCart(stores[0].id, p)}
                    >
                      <Plus size={16} /> {t.addToCart}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Chicken Products */}
        {chickenProducts.length > 0 && (
          <section className="m10-section">
            <div className="m10-section-head">
              <h2>🍗 {t.chicken}</h2>
              <Link to="/category/ready">{t.viewAll} <ChevronLeft size={16} /></Link>
            </div>
            <div className="m10-products-row">
              {chickenProducts.map((p) => (
                <div key={p.id} className="m10-product">
                  <Link to={`/store/${stores[0].id}`} className="m10-product-img">
                    <img src={p.image} alt={productName(p, lang)} />
                  </Link>
                  <div className="m10-product-info">
                    <h3>{productName(p, lang)}</h3>
                    <p className="m10-product-cat">{p.categoryAr || p.category}</p>
                    <div className="m10-product-price">
                      <strong>{formatIQD(p.price, lang)}</strong>
                    </div>
                    <button 
                      className="m10-add-btn" 
                      onClick={() => addToCart && addToCart(stores[0].id, p)}
                    >
                      <Plus size={16} /> {t.addToCart}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Drinks Products */}
        {drinkProducts.length > 0 && (
          <section className="m10-section">
            <div className="m10-section-head">
              <h2>🥤 {t.drinks}</h2>
              <Link to="/category/drinks">{t.viewAll} <ChevronLeft size={16} /></Link>
            </div>
            <div className="m10-products-row">
              {drinkProducts.map((p) => (
                <div key={p.id} className="m10-product">
                  <Link to={`/store/${stores[0].id}`} className="m10-product-img">
                    <img src={p.image} alt={productName(p, lang)} />
                  </Link>
                  <div className="m10-product-info">
                    <h3>{productName(p, lang)}</h3>
                    <p className="m10-product-cat">{p.categoryAr || p.category}</p>
                    <div className="m10-product-price">
                      <strong>{formatIQD(p.price, lang)}</strong>
                    </div>
                    <button 
                      className="m10-add-btn" 
                      onClick={() => addToCart && addToCart(stores[0].id, p)}
                    >
                      <Plus size={16} /> {t.addToCart}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Floating Cart */}
        {cartCount > 0 && (
          <Link to="/cart" className="m10-float-cart">
            <ShoppingBag size={20} />
            <span className="m10-float-count">{cartCount}</span>
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
          <span>ابحث عن منتج أو عرض</span>
        </Link>

        <div className="cats" style={{ marginTop: 16 }}>
          {categories.slice(0, 8).map((c) => (
            <Link key={c.id} to={categoryHref(c.id)} className="cat">
              <div className={`cat-icon${c.id === 'offers' ? ' offer' : ''}`}>
                {c.icon}
              </div>
              <span>{getCategoryName(c, lang)}</span>
            </Link>
          ))}
        </div>

        <div className="banners" style={{ marginTop: 18 }}>
          {banners.map((b) => (
            <Link
              key={b.id}
              to={bannerHref(b)}
              className="banner has-img"
            >
              <img className="fly" src={b.image} alt={b.title} />
              <div className="banner-copy">
                <span className="chip" style={{ marginBottom: 8, background: 'rgba(255,255,255,0.2)', color: '#fff' }}>
                  {b.id === 'b1' ? 'عرض اليوم' : b.id === 'b2' ? 'طازج' : 'نقاط'}
                </span>
                <div className="h1">{b.title}</div>
              </div>
            </Link>
          ))}
        </div>

        {favStores.length > 0 && (
          <>
            <div className="section-title">
              <h2 className="h2 row" style={{ gap: 6 }}>
                <Star size={16} fill="#f5c400" color="#f5c400" />
                المفضلة
              </h2>
              <Link to="/favorites" className="muted">عرض الكل</Link>
            </div>
            <div className="stack">
              {favStores.map((store) => (
                <StoreCard key={store.id} store={store} />
              ))}
            </div>
          </>
        )}

        {nearbyStores.length > 0 && (
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
        )}
      </div>

      {cartCount > 0 && (
        <Link to="/cart" className="store-cart-bar">
          <div>
            <div className="row" style={{ gap: 6 }}>
              <ShoppingBag size={16} />
              <span>سلتك · {cartCount} {itemWord(cartCount)}</span>
            </div>
            {cartStore && (
              <div style={{ color: '#bbb', fontSize: 12, fontWeight: 700, marginTop: 2 }}>
                {cartStore.name} · {formatIQD(cartTotal)}
              </div>
            )}
          </div>
          <span className="btn">عرض السلة</span>
        </Link>
      )}
    </div>
  )
}
