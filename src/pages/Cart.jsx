import { ShoppingBag, Store as StoreIcon, Trash2 } from 'lucide-react'
import { Link } from 'react-router'
import TopBar from '../components/TopBar.jsx'
import { useApp } from '../context/AppContext.web.jsx'
import { useI18n } from '../context/I18nContext.web.jsx'
import { useIsDesktop } from '../hooks/useIsDesktop.js'
import { formatIQD, getProduct, productName, storeName, tUI } from '../data/mock.web.js'

export default function Cart() {
  const { cart, cartStore, cartTotal, setQty, clearCart } = useApp()
  const { lang } = useI18n()
  const t = tUI(lang)
  const isDesktop = useIsDesktop()

  if (!cart.length || !cartStore) {
    return (
      <>
        {!isDesktop && <TopBar title={t.cart} backTo="/" />}
        <div className={isDesktop ? 'desktop-page-card metro-page' : 'page'}>
          <div className="empty">
            <ShoppingBag size={48} color="#e01828" strokeWidth={1.6} />
            <p className="h2" style={{ marginTop: 16, color: 'var(--ink)' }}>{t.emptyCart}</p>
            <p className="muted" style={{ marginTop: 6 }}>{t.emptyCartHint}</p>
            <Link to="/" className="btn" style={{ marginTop: 18 }}>{t.browseStores}</Link>
          </div>
        </div>
      </>
    )
  }

  const fee = cartStore.fee || 0
  const total = cartTotal + fee
  const belowMin = cartTotal < cartStore.minOrder
  const remaining = cartStore.minOrder - cartTotal
  const storeLabel = storeName(cartStore, lang)

  const summary = (
    <>
      <h2 className="h2" style={{ marginBottom: 16 }}>{t.orderSummary}</h2>
      <div className="between" style={{ marginBottom: 8 }}>
        <span className="muted">{t.subtotal}</span>
        <span>{formatIQD(cartTotal, lang)}</span>
      </div>
      <div className="between" style={{ marginBottom: 16 }}>
        <span className="muted">{t.deliveryFee}</span>
        <span>{fee === 0 ? t.free : formatIQD(fee, lang)}</span>
      </div>
      <div className="between" style={{ paddingTop: 16, borderTop: '2px solid var(--line)' }}>
        <span className="h2">{t.total}</span>
        <span className="price" style={{ fontSize: 20 }}>{formatIQD(total, lang)}</span>
      </div>
      {belowMin && (
        <div className="warn" style={{ marginTop: 16 }}>
          {t.minOrder} {formatIQD(cartStore.minOrder, lang)}. {t.addMore} {formatIQD(remaining, lang)} {t.toContinue}.
        </div>
      )}
      <Link
        to="/checkout"
        className="btn full"
        style={{ marginTop: 20, pointerEvents: belowMin ? 'none' : undefined, opacity: belowMin ? 0.5 : 1 }}
      >
        {t.checkout} · {formatIQD(total, lang)}
      </Link>
    </>
  )

  const lines = cart.map((line) => {
    const product = getProduct(line.storeId, line.productId)
    if (!product) return null
    return (
      <article key={line.productId} className={isDesktop ? 'desktop-cart-item' : 'product-row'}>
        {isDesktop && <img src={product.image} alt={productName(product, lang)} />}
        <div className={isDesktop ? 'desktop-cart-item-info' : undefined} style={isDesktop ? undefined : { flex: 1 }}>
          <h3 className="h2">{productName(product, lang)}</h3>
          {product.desc && <p className="muted">{product.desc}</p>}
          {!isDesktop && (
            <div className="between" style={{ marginTop: 10 }}>
              <span className="price">{formatIQD(product.price * line.qty, lang)}</span>
              <div className="qty">
                <button type="button" onClick={() => setQty(product.id, line.qty - 1)}>−</button>
                <span>{line.qty}</span>
                <button type="button" onClick={() => setQty(product.id, line.qty + 1)}>+</button>
              </div>
            </div>
          )}
        </div>
        {isDesktop && (
          <div className="desktop-cart-item-controls">
            <div className="qty">
              <button type="button" onClick={() => setQty(product.id, line.qty - 1)}>−</button>
              <span>{line.qty}</span>
              <button type="button" onClick={() => setQty(product.id, line.qty + 1)}>+</button>
            </div>
            <div className="price" style={{ marginTop: 8 }}>{formatIQD(product.price * line.qty, lang)}</div>
          </div>
        )}
        {!isDesktop && <img src={product.image} alt={productName(product, lang)} />}
      </article>
    )
  })

  if (isDesktop) {
    return (
      <div className="desktop-cart metro-page">
        <h1 className="h1" style={{ fontSize: 24, marginBottom: 24 }}>{t.cart}</h1>
        <div className="desktop-cart-layout">
          <div className="desktop-cart-items">
            <Link to={`/store/${cartStore.id}`} className="card" style={{ padding: 16, marginBottom: 16 }}>
              <div className="row">
                <StoreIcon size={20} color="#e01828" />
                <div>
                  <div className="h2">{storeLabel}</div>
                  <p className="muted">{t.delivery} {cartStore.eta} {t.min} · {formatIQD(fee, lang)}</p>
                </div>
              </div>
            </Link>
            <div className="stack" style={{ gap: 12 }}>{lines}</div>
            <button type="button" className="btn btn-ghost" onClick={clearCart} style={{ marginTop: 16 }}>
              <Trash2 size={16} /> {t.clearCart}
            </button>
          </div>
          <div className="desktop-cart-summary">
            <div className="card" style={{ padding: 20, position: 'sticky', top: 132 }}>{summary}</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <TopBar title={t.cart} backTo="/" />
      <div className="page stack">
        <Link to={`/store/${cartStore.id}`} className="card" style={{ padding: 14 }}>
          <div className="row">
            <StoreIcon size={18} color="#e01828" />
            <div>
              <div className="h2">{storeLabel}</div>
              <p className="muted">{t.delivery} {cartStore.eta} {t.min} · {formatIQD(fee, lang)}</p>
            </div>
          </div>
        </Link>
        <div className="stack">{lines}</div>
        <section className="card" style={{ padding: 14 }}>{summary}</section>
        <button type="button" className="btn btn-ghost full" onClick={clearCart}>
          <Trash2 size={16} /> {t.clearCart}
        </button>
      </div>
    </>
  )
}
