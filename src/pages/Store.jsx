import { Clock3, Star, Truck, ShoppingBag, Plus, Minus } from 'lucide-react'
import { Link, useParams } from 'react-router'
import TopBar from '../components/TopBar.jsx'
import { useApp } from '../context/AppContext.web.jsx'
import { useIsDesktop } from '../hooks/useIsDesktop.js'
import { formatIQD, getProducts, getStore, productName } from '../data/mock.web.js'

const statusMap = {
  open: { label: 'مفتوح', cls: 'badge-open' },
  busy: { label: 'مزدحم', cls: 'badge-busy' },
  closed: { label: 'مغلق', cls: 'badge-closed' },
}

function ProductRow({ storeId, product, closed }) {
  const { cart, addToCart, setQty } = useApp()
  const item = cart.find((i) => i.storeId === storeId && i.productId === product.id)
  const qty = item?.qty || 0

  return (
    <article className="product-row">
      <div>
        {product.popular ? <span className="chip">الأكثر طلباً</span> : null}
        <h3 className="h2" style={{ marginTop: product.popular ? 6 : 0 }}>
          {product.name}
        </h3>
        <p className="muted">{product.desc}</p>
        <div className="row" style={{ marginTop: 8, flexWrap: 'wrap' }}>
          <span className="price">{formatIQD(product.price)}</span>
          {product.oldPrice ? (
            <span className="old-price">{formatIQD(product.oldPrice)}</span>
          ) : null}
        </div>
        {closed ? (
          <p className="muted" style={{ marginTop: 8 }}>
            غير متاح — المتجر مغلق
          </p>
        ) : qty === 0 ? (
          <button
            type="button"
            className="btn add-btn"
            onClick={() => addToCart(storeId, product.id)}
          >
            إضافة
          </button>
        ) : (
          <div className="qty" style={{ marginTop: 8 }}>
            <button
              type="button"
              onClick={() => setQty(product.id, qty - 1)}
              aria-label="إنقاص"
            >
              −
            </button>
            <span>{qty}</span>
            <button
              type="button"
              onClick={() => setQty(product.id, qty + 1)}
              aria-label="زيادة"
            >
              +
            </button>
          </div>
        )}
      </div>
      <img src={product.image} alt={product.name} />
    </article>
  )
}

function DesktopProductCard({ storeId, product, closed }) {
  const { cart, addToCart, setQty } = useApp()
  const item = cart.find((i) => i.storeId === storeId && i.productId === product.id)
  const qty = item?.qty || 0

  return (
    <article className="desktop-product-card">
      <div className="desktop-product-image">
        <img src={product.image} alt={product.name} />
        {product.oldPrice && <span className="desktop-product-badge">عرض</span>}
        {product.popular && !product.oldPrice && <span className="desktop-product-badge popular">الأكثر طلباً</span>}
      </div>
      <div className="desktop-product-body">
        <h3 className="desktop-product-title">{productName(product, 'ar')}</h3>
        <p className="desktop-product-desc">{product.desc}</p>
        <div className="desktop-product-footer">
          <div className="desktop-product-price">
            <span className="price">{formatIQD(product.price)}</span>
            {product.oldPrice && <span className="old-price">{formatIQD(product.oldPrice)}</span>}
          </div>
          {closed ? (
            <span className="muted" style={{ fontSize: 12 }}>مغلق</span>
          ) : qty === 0 ? (
            <button
              type="button"
              className="desktop-add-btn"
              onClick={() => addToCart(storeId, product.id)}
            >
              <Plus size={18} />
            </button>
          ) : (
            <div className="desktop-qty-ctrl">
              <button type="button" onClick={() => setQty(product.id, qty - 1)}>
                <Minus size={14} />
              </button>
              <span>{qty}</span>
              <button type="button" onClick={() => setQty(product.id, qty + 1)}>
                <Plus size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  )
}

export default function Store() {
  const { id } = useParams()
  const isDesktop = useIsDesktop()
  const { cart, cartCount, cartStore, cartTotal, favorites, toggleFavorite } = useApp()
  const store = getStore(id)
  const products = getProducts(id)
  const popular = products.filter((p) => p.popular)
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
        {!isDesktop && <TopBar title="المتجر" backTo="/" />}
        <div className={isDesktop ? "desktop-store-empty" : "page"}>
          <div className="empty">
            <p className="h2">المتجر غير موجود</p>
            <p className="muted" style={{ marginTop: 8 }}>
              جرّب البحث من الصفحة الرئيسية
            </p>
            <Link to="/" className="btn" style={{ marginTop: 16 }}>
              العودة للرئيسية
            </Link>
          </div>
        </div>
      </>
    )
  }

  if (isDesktop) {
    return (
      <div className="desktop-store">
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
              <h1 className="h1" style={{ fontSize: 26 }}>{store.name}</h1>
              <span className={`badge ${st.cls}`} style={{ fontSize: 13 }}>{st.label}</span>
            </div>
            <p className="muted" style={{ marginBottom: 12 }}>{store.tags.join(' · ')}</p>
            <div className="desktop-store-stats">
              <div className="desktop-store-stat">
                <Star size={16} fill="#f5c400" color="#f5c400" />
                <span>{store.rating}</span>
                <span className="muted">({store.reviews.toLocaleString('ar-IQ')})</span>
              </div>
              <div className="desktop-store-stat">
                <Clock3 size={16} />
                <span>{store.eta} د</span>
              </div>
              <div className="desktop-store-stat">
                <Truck size={16} />
                <span>{store.fee === 0 ? 'مجاني' : formatIQD(store.fee)}</span>
              </div>
            </div>
            <p className="muted" style={{ marginTop: 12 }}>
              الحد الأدنى للطلب {formatIQD(store.minOrder)}
            </p>
            {closed && (
              <div className="warn" style={{ marginTop: 12 }}>
                هذا المتجر مغلق حالياً. يمكنك تصفّح القائمة دون إضافة طلب.
              </div>
            )}
          </div>
        </div>

        {products.length === 0 ? (
          <p className="muted" style={{ padding: 24 }}>لا توجد أصناف حالياً</p>
        ) : (
          <div className="desktop-store-products">
            {popular.length > 0 && (
              <section style={{ marginBottom: 32 }}>
                <div className="section-title">
                  <h2 className="h2">🔥 الأكثر طلباً</h2>
                  <span className="muted">{popular.length} صنف</span>
                </div>
                <div className="desktop-products-grid">
                  {popular.map((product) => (
                    <DesktopProductCard
                      key={product.id}
                      storeId={store.id}
                      product={product}
                      closed={closed}
                    />
                  ))}
                </div>
              </section>
            )}

            <section>
              <div className="section-title">
                <h2 className="h2">جميع المنتجات</h2>
                <span className="muted">{products.length} صنف</span>
              </div>
              <div className="desktop-products-grid">
                {(popular.length ? rest : products).map((product) => (
                  <DesktopProductCard
                    key={product.id}
                    storeId={store.id}
                    product={product}
                    closed={closed}
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
                <span>{storeItemCount} {storeItemCount === 1 ? 'صنف' : 'أصناف'}</span>
              </div>
              <div className="price" style={{ color: '#fff', marginTop: 2 }}>
                {formatIQD(cartTotal)}
              </div>
            </div>
            <span className="btn">عرض السلة</span>
          </Link>
        )}
      </div>
    )
  }

  return (
    <>
      <TopBar title={store.name} backTo="/" />
      <div className="store-hero">
        <img className="cover" src={store.cover} alt={store.name} />
        <div className="store-hero-fade" />
        <button
          type="button"
          className={`star-btn${isFav ? ' on' : ''}`}
          onClick={() => toggleFavorite(store.id)}
          aria-label={isFav ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}
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
              ({store.reviews.toLocaleString('ar-IQ')})
            </span>
            <span>
              <Clock3 size={12} /> {store.eta} د
            </span>
            <span>
              <Truck size={12} /> {formatIQD(store.fee)}
            </span>
          </div>
          <p className="muted" style={{ marginTop: 8 }}>
            الحد الأدنى للطلب {formatIQD(store.minOrder)}
          </p>
          {closed ? (
            <div className="warn" style={{ marginTop: 12 }}>
              هذا المتجر مغلق حالياً. يمكنك تصفّح القائمة دون إضافة طلب.
            </div>
          ) : null}
        </section>

        {products.length === 0 ? (
          <p className="muted">لا توجد أصناف حالياً</p>
        ) : (
          <>
            {popular.length ? (
              <section>
                <div className="section-title">
                  <h2 className="h2">الأكثر طلباً</h2>
                </div>
                <div className="stack">
                  {popular.map((product) => (
                    <ProductRow
                      key={product.id}
                      storeId={store.id}
                      product={product}
                      closed={closed}
                    />
                  ))}
                </div>
              </section>
            ) : null}

            {rest.length || !popular.length ? (
              <section>
                <div className="section-title">
                  <h2 className="h2">القائمة</h2>
                  <span className="muted">{products.length} صنف</span>
                </div>
                <div className="stack">
                  {(popular.length ? rest : products).map((product) => (
                    <ProductRow
                      key={product.id}
                      storeId={store.id}
                      product={product}
                      closed={closed}
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
                {storeItemCount} {storeItemCount === 1 ? 'صنف' : 'أصناف'}
              </span>
            </div>
            <div className="price" style={{ color: '#fff', marginTop: 2 }}>
              {formatIQD(cartTotal)}
            </div>
          </div>
          <span className="btn">عرض السلة</span>
        </Link>
      ) : null}
    </>
  )
}
