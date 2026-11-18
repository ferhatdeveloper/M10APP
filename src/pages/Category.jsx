import { Link, Navigate, useParams } from 'react-router'
import { Store as StoreIcon } from 'lucide-react'
import TopBar from '../components/TopBar.jsx'
import StoreCard from '../components/StoreCard.jsx'
import WebProductCard from '../components/WebProductCard.jsx'
import { useIsDesktop } from '../hooks/useIsDesktop.js'
import { useI18n } from '../context/I18nContext.web.jsx'
import {
  categories,
  formatIQD,
  getProductsByCategory,
  getCategoryName,
  stores,
  productName,
  ui,
} from '../data/mock.web.js'

export default function Category() {
  const { id } = useParams()
  const isDesktop = useIsDesktop()
  const { lang } = useI18n()
  const t = ui[lang] || ui.ar
  const cat = categories.find((c) => c.id === id)

  if (id === 'butler') return <Navigate to="/butler" replace />

  const isOffers = id === 'offers'
  const title = getCategoryName(cat, lang) || id
  const products = getProductsByCategory(id)
  const list = stores.filter((s) => !s.comingSoon)

  if (isDesktop) {
    return (
      <div className="desktop-category metro-page">
        <div className="desktop-category-header">
          <h1 className="h1" style={{ fontSize: 24, marginBottom: 8 }}>
            {cat?.icon ? `${cat.icon} ` : ''}{title}
          </h1>
          <p className="muted">
            {products.length} {lang === 'tr' ? 'ürün' : lang === 'en' ? 'products' : 'منتج'}
          </p>
        </div>

        {products.length > 0 ? (
          <section style={{ marginBottom: 32 }}>
            <div className="web-product-grid">
              {products.map((p) => (
                <WebProductCard key={p.id} product={p} storeId={stores[0]?.id} />
              ))}
            </div>
          </section>
        ) : (
          <div className="empty" style={{ padding: 60 }}>
            <div className="empty-icon">
              <StoreIcon size={36} />
            </div>
            <p className="h2" style={{ color: 'var(--ink)', marginTop: 12 }}>
              {lang === 'tr' ? 'Bu kategoride ürün yok' : lang === 'en' ? 'No products in this category' : 'ماكو منتجات بهالتصنيف حالياً'}
            </p>
            <Link to="/" className="btn" style={{ marginTop: 16 }}>
              {lang === 'tr' ? 'Ana Sayfa' : lang === 'en' ? 'Home' : 'الرئيسية'}
            </Link>
          </div>
        )}

        {list.length > 0 && (
          <section>
            <div className="section-title">
              <h2 className="h2">{lang === 'tr' ? 'Mağazalar' : lang === 'en' ? 'Stores' : 'المتاجر'}</h2>
              <span className="muted">{list.length}</span>
            </div>
            <div className="stack">
              {list.map((store) => (
                <StoreCard key={store.id} store={store} />
              ))}
            </div>
          </section>
        )}
      </div>
    )
  }

  return (
    <div>
      <TopBar title={title} backTo="/" />
      <div className="page" style={{ paddingTop: 4 }}>
        {products.length > 0 ? (
          <>
            <div className="section-title">
              <h2 className="h2">{isOffers ? (lang === 'tr' ? 'Kampanyalar' : t.flashSale) : title}</h2>
              <span className="muted">{products.length}</span>
            </div>
            <div className="stack">
              {products.map((p) => (
                <Link key={p.id} to={`/store/${stores[0]?.id}`} className="product-row">
                  <div>
                    <div className="h2">{productName(p, lang)}</div>
                    <div className="row" style={{ marginTop: 6 }}>
                      <span className="price">{formatIQD(p.price, lang)}</span>
                      {p.oldPrice && <span className="old-price">{formatIQD(p.oldPrice, lang)}</span>}
                    </div>
                  </div>
                  <img src={p.image} alt={productName(p, lang)} />
                </Link>
              ))}
            </div>
          </>
        ) : (
          <div className="empty">
            <div className="empty-icon">
              <StoreIcon size={36} />
            </div>
            <p className="h2" style={{ color: 'var(--ink)', marginTop: 12 }}>
              {lang === 'tr' ? 'Bu kategoride ürün yok' : lang === 'en' ? 'No stores in this category' : 'ماكو متاجر بهالتصنيف حالياً'}
            </p>
            <Link to="/" className="btn">
              {lang === 'tr' ? 'Ana Sayfa' : lang === 'en' ? 'Home' : 'الرئيسية'}
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
