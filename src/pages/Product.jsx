import { Link, useParams } from 'react-router'
import { Minus, Plus } from 'lucide-react'
import TopBar from '../components/TopBar.jsx'
import { useApp } from '../context/AppContext.web.jsx'
import { useIsDesktop } from '../hooks/useIsDesktop.js'
import { useI18n } from '../context/I18nContext.web.jsx'
import { formatIQD, getProduct, productName, stores, ui } from '../data/mock.web.js'

export default function Product() {
  const { id } = useParams()
  const isDesktop = useIsDesktop()
  const { lang } = useI18n()
  const t = ui[lang] || ui.ar
  const { cart, addToCart, setQty } = useApp()
  const storeId = stores[0]?.id
  const product = getProduct(storeId, id)
  const qty = cart.find((i) => i.productId === id)?.qty || 0

  if (!product) {
    const empty = (
      <div className={isDesktop ? 'metro-page' : 'page'}>
        <div className="empty" style={{ padding: 48 }}>
          <p className="h2">{lang === 'tr' ? 'Ürün bulunamadı' : 'Product not found'}</p>
          <Link to="/" className="btn" style={{ marginTop: 16 }}>
            {lang === 'tr' ? 'Ana Sayfa' : 'Home'}
          </Link>
        </div>
      </div>
    )
    if (isDesktop) return empty
    return (
      <>
        <TopBar title="M10" backTo="/" />
        {empty}
      </>
    )
  }

  const body = (
    <div className={isDesktop ? 'metro-page' : 'page'}>
      <div className="product-detail" style={{
        display: 'grid',
        gridTemplateColumns: isDesktop ? '360px 1fr' : '1fr',
        gap: 28,
        background: '#fff',
        borderRadius: 16,
        padding: 24,
      }}>
        <div style={{ background: '#fafafa', borderRadius: 12, padding: 20, display: 'grid', placeItems: 'center' }}>
          <img src={product.image} alt={productName(product, lang)} style={{ maxWidth: '100%', maxHeight: 280, objectFit: 'contain' }} />
        </div>
        <div>
          <h1 className="h1" style={{ fontSize: 26 }}>{productName(product, lang)}</h1>
          {product.desc && <p className="muted" style={{ marginTop: 8 }}>{product.desc}</p>}
          <div className="cat-product-price" style={{ marginTop: 16, marginBottom: 20 }}>
            <strong style={{ fontSize: 22 }}>{formatIQD(product.price, lang)}</strong>
            {product.oldPrice && <span className="cat-product-from">{t.from}</span>}
            {product.oldPrice && <del>{formatIQD(product.oldPrice, lang)}</del>}
          </div>
          {qty > 0 ? (
            <div className="cat-product-qty" style={{ maxWidth: 200 }} role="group">
              <button type="button" onClick={() => setQty(product.id, qty - 1)}><Minus size={16} /></button>
              <span>{qty}</span>
              <button type="button" onClick={() => setQty(product.id, qty + 1)}><Plus size={16} /></button>
            </div>
          ) : (
            <button
              type="button"
              className="cat-product-btn"
              style={{ maxWidth: 220 }}
              onClick={() => addToCart(storeId, product.id, 1)}
            >
              {t.addToCart}
            </button>
          )}
        </div>
      </div>
    </div>
  )

  if (isDesktop) return body
  return (
    <>
      <TopBar title={productName(product, lang)} backTo="/" />
      {body}
    </>
  )
}
