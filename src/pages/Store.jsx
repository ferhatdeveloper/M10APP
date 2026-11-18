import { Clock3, Star, Truck, ShoppingBag, Plus, Minus } from 'lucide-react'
import { Link, useParams } from 'react-router'
import TopBar from '../components/TopBar.jsx'
import WebProductCard from '../components/WebProductCard.jsx'
import { useApp } from '../context/AppContext.web.jsx'
import { useI18n } from '../context/I18nContext.web.jsx'
import { useIsDesktop } from '../hooks/useIsDesktop.js'
import { formatIQD, getProducts, getStore, productName, storeName, tUI } from '../data/mock.web.js'

function ProductRow({ storeId, product, closed, lang, t }) {
  const { cart, addToCart, setQty } = useApp()
  const item = cart.find((i) => i.storeId === storeId && i.productId === product.id)
  const qty = item?.qty || 0

  return (
    <article className="product-row">
      <div>
        {product.popular ? <span className="chip">{t.popularItems}</span> : null}
        <h3 className="h2" style={{ marginTop: product.popular ? 6 : 0 }}>
          {productName(product, lang)}
        </h3>
        <p className="muted">{product.desc}</p>
        <div className="row" style={{ marginTop: 8, flexWrap: 'wrap' }}>
          <span className="price">{formatIQD(product.price, lang)}</span>
          {product.oldPrice ? (
            <span className="old-price">{formatIQD(product.oldPrice, lang)}</span>
          ) : null}
        </div>
        {closed ? (
          <p className="muted" style={{ marginTop: 8 }}>{t.storeClosed}</p>
        ) : qty === 0 ? (
          <button
            type="button"
            className="btn add-btn"
            onClick={() => addToCart(storeId, product.id)}
          >
            {t.addToCart}
          </button>
        ) : (
          <div className="qty" style={{ marginTop: 8 }}>
            <button type="button" onClick={() => setQty(product.id, qty - 1)}>−</button>
            <span>{qty}</span>
            <button type="button" onClick={() => setQty(product.id, qty + 1)}>+</button>
          </div>
        )}
      </div>
      <img src={product.image} alt={productName(product, lang)} />
    </article>
  )
}

function DesktopProductCard({ storeId, product, closed, lang, t }) {
  if (closed) {
    return (
      <div className="cat-product" style={{ opacity: 0.65 }}>
        <div className="cat-product-img">
          <img src={product.image} alt={productName(product, lang)} />
        </div>
        <div className="cat-product-info">
          <h3>{productName(product, lang)}</h3>
          <div className="cat-product-price">
            <strong>{formatIQD(product.price, lang)}</strong>
          </div>
          <button type="button" className="cat-product-btn" disabled>
            {t.closed}
          </button>
        </div>
      </div>
    )
  }

  return <WebProductCard product={product} storeId={storeId} />
}

export default function Store() {
  const { id } = useParams()
  const isDesktop = useIsDesktop()
  const { lang } = useI18n()
  const t = tUI(lang)
  const { cart, cartCount, cartStore, cartTotal, favorites, toggleFavorite } = useApp()
  const store = getStore(id)
  const products = getProducts(id)
  const popular = products.filter((p) => p.popular)
  const statusMap = {
    open: { label: t.open, cls: 'badge-open' },
    busy: { label: t.busy, cls: 'badge-busy' },
    closed: { label: t.closed, cls: 'badge-closed' },
  }
  const rest = products.filter((p) => !p.popular)
  const closed = store?.status === 'closed'
  const st = store ? statusMap[store.status] : null
  const isFav = store ? favorites.includes(store.id) : false
  const thisStoreInCart = cartStore?.id === store?.id && cartCount > 0
  const storeItemCount = thisStoreInCart
    ? cart.filter((i) => i.storeId === store.id).reduce((n, i) => n + i.qty, 0)
    : 0

  if (!store) {
    return (
      <>
        {!isDesktop && <TopBar title={t.stores} backTo="/" />}
        <div className={isDesktop ? "desktop-store-empty" : "page"}>
          <div className="empty">
            <p className="h2">{t.storeNotFound}</p>
            <Link to="/" className="btn" style={{ marginTop: 16 }}>
              {t.backHome}
            </Link>
          </div>
        </div>
      </>
    )
  }

  if (isDesktop) {
    return (
      <div className="desktop-store metro-page">
        <div className="desktop-store-header">
          <div className="desktop-store-cover">
            <img src={store.cover} alt={store.name} />
            <button
              type="button"
              className={`star-btn${isFav ? ' on' : ''}`}
              onClick={() => toggleFavorite(store.id)}
            >
              <Star size={20} fill={isFav ? 'currentColor' : 'none'} />
            </button>
          </div>
          <div className="desktop-store-info-panel">
            <div className="between" style={{ marginBottom: 8 }}>
              <h1 className="h1" style={{ fontSize: 26 }}>{storeName(store, lang)}</h1>
              <span className={`badge ${st.cls}`} style={{ fontSize: 13 }}>{st.label}</span>
            </div>
            <p className="muted" style={{ marginBottom: 12 }}>{store.tags.join(' · ')}</p>
            <div className="desktop-store-stats">
              <div className="desktop-store-stat">
                <Star size={16} fill="#f5c400" color="#f5c400" />
                <span>{store.rating}</span>
                <span className="muted">({store.reviews.toLocaleString(lang === 'tr' ? 'tr-TR' : lang === 'en' ? 'en-US' : 'ar-IQ')})</span>
              </div>
              <div className="desktop-store-stat">
                <Clock3 size={16} />
                <span>{store.eta} {t.min}</span>
              </div>
              <div className="desktop-store-stat">
                <Truck size={16} />
                <span>{store.fee === 0 ? t.free : formatIQD(store.fee, lang)}</span>
              </div>
            </div>
            <p className="muted" style={{ marginTop: 12 }}>
              {t.minOrder} {formatIQD(store.minOrder, lang)}
            </p>
            {closed && (
              <div className="warn" style={{ marginTop: 12 }}>
                {t.storeClosed}
              </div>
            )}
          </div>
        </div>

        {products.length === 0 ? (
          <p className="muted" style={{ padding: 24 }}>{t.noProducts}</p>
        ) : (
          <div className="desktop-store-products">
            {popular.length > 0 && (
              <section style={{ marginBottom: 32 }}>
                <div className="section-title">
                  <h2 className="h2">🔥 {t.popularItems}</h2>
                  <span className="muted">{popular.length} {t.items}</span>
                </div>
                <div className="web-product-grid">
                  {popular.map((product) => (
                    <DesktopProductCard
                      key={product.id}
                      storeId={store.id}
                      product={product}
                      closed={closed}
                      lang={lang}
                      t={t}
                    />
                  ))}
                </div>
              </section>
            )}

            <section>
              <div className="section-title">
                <h2 className="h2">{t.allProducts}</h2>
                <span className="muted">{products.length} {t.items}</span>
              </div>
              <div className="web-product-grid">
                {(popular.length ? rest : products).map((product) => (
                  <DesktopProductCard
                    key={product.id}
                    storeId={store.id}
                    product={product}
                    closed={closed}
                    lang={lang}
                    t={t}
                  />
                ))}
              </div>
            </section>
          </div>
        )}

        {thisStoreInCart && (
          <Link to="/cart" className="store-cart-bar">
            <div>
              <div className="row" style={{ gap: 6 }}>
                <ShoppingBag size={16} />
                <span>{storeItemCount} {storeItemCount === 1 ? t.item : t.items}</span>
              </div>
              <div className="price" style={{ color: '#fff', marginTop: 2 }}>
                {formatIQD(cartTotal, lang)}
              </div>
            </div>
            <span className="btn">{t.viewCart}</span>
          </Link>
        )}
      </div>
    )
  }

  return (
    <>
      <TopBar title={storeName(store, lang)} backTo="/" />
      <div className="store-hero">
        <img className="cover" src={store.cover} alt={storeName(store, lang)} />
        <div className="store-hero-fade" />
        <button
          type="button"
          className={`star-btn${isFav ? ' on' : ''}`}
          onClick={() => toggleFavorite(store.id)}
          aria-label={t.favorites}
        >
          <Star size={18} fill={isFav ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className={`page${thisStoreInCart ? ' page-pad-bar' : ''}`}>
        <section className="card store-info">
          <div className="between">
            <h1 className="h1">{store.name}</h1>
            <span className={`badge ${st.cls}`}>{st.label}</span>
          </div>
          <p className="muted">{store.tags.join(' · ')}</p>
          <div className="store-meta">
            <span>
              <Star size={12} fill="#f5c400" color="#f5c400" /> {store.rating}{' '}
              ({store.reviews.toLocaleString(lang === 'tr' ? 'tr-TR' : 'en-US')})
            </span>
            <span>
              <Clock3 size={12} /> {store.eta} {t.min}
            </span>
            <span>
              <Truck size={12} /> {store.fee === 0 ? t.free : formatIQD(store.fee, lang)}
            </span>
          </div>
          <p className="muted" style={{ marginTop: 8 }}>
            {t.minOrder} {formatIQD(store.minOrder, lang)}
          </p>
          {closed ? (
            <div className="warn" style={{ marginTop: 12 }}>
              {t.storeClosed}
            </div>
          ) : null}
        </section>

        {products.length === 0 ? (
          <p className="muted">{t.noResults}</p>
        ) : (
          <>
            {popular.length ? (
              <section>
                <div className="section-title">
                  <h2 className="h2">{t.popularItems}</h2>
                </div>
                <div className="stack">
                  {popular.map((product) => (
                    <ProductRow
                      key={product.id}
                      storeId={store.id}
                      product={product}
                      closed={closed}
                      lang={lang}
                      t={t}
                    />
                  ))}
                </div>
              </section>
            ) : null}

            {rest.length || !popular.length ? (
              <section>
                <div className="section-title">
                  <h2 className="h2">{t.allProducts}</h2>
                  <span className="muted">{products.length} {t.items}</span>
                </div>
                <div className="stack">
                  {(popular.length ? rest : products).map((product) => (
                    <ProductRow
                      key={product.id}
                      storeId={store.id}
                      product={product}
                      closed={closed}
                      lang={lang}
                      t={t}
                    />
                  ))}
                </div>
              </section>
            ) : null}
          </>
        )}
      </div>

      {thisStoreInCart ? (
        <Link to="/cart" className="store-cart-bar">
          <div>
            <div className="row" style={{ gap: 6 }}>
              <ShoppingBag size={16} />
              <span>
                {storeItemCount} {storeItemCount === 1 ? t.item : t.items}
              </span>
            </div>
            <div className="price" style={{ color: '#fff', marginTop: 2 }}>
              {formatIQD(cartTotal, lang)}
            </div>
          </div>
          <span className="btn">{t.viewCart}</span>
        </Link>
      ) : null}
    </>
  )
}
