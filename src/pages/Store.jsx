import { Clock3, Star, Truck, ShoppingBag } from 'lucide-react'
import { Link, useParams } from 'react-router'
import TopBar from '../components/TopBar.jsx'
import { useApp } from '../context/AppContext.jsx'
import { formatIQD, getProducts, getStore } from '../data/mock.js'

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

export default function Store() {
  const { id } = useParams()
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
        <TopBar title="المتجر" backTo="/" />
        <div className="page">
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
