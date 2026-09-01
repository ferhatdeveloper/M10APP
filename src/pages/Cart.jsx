import { ShoppingBag, Store as StoreIcon, Trash2 } from 'lucide-react'
import { Link } from 'react-router'
import TopBar from '../components/TopBar.jsx'
import { useApp } from '../context/AppContext.jsx'
import { formatIQD, getProduct } from '../data/mock.js'

export default function Cart() {
  const { cart, cartStore, cartTotal, setQty, clearCart } = useApp()

  if (!cart.length || !cartStore) {
    return (
      <>
        <TopBar title="السلة" backTo="/" />
        <div className="page">
          <div className="empty">
            <ShoppingBag size={48} color="#e01828" strokeWidth={1.6} />
            <p className="h2" style={{ marginTop: 16, color: 'var(--ink)' }}>
              سلتك فارغة
            </p>
            <p className="muted" style={{ marginTop: 6 }}>
              اطلب من متاجرك المفضلة في بغداد
            </p>
            <Link to="/" className="btn" style={{ marginTop: 18 }}>
              تصفح المتاجر
            </Link>
          </div>
        </div>
      </>
    )
  }

  const fee = cartStore.fee || 0
  const total = cartTotal + fee
  const belowMin = cartTotal < cartStore.minOrder
  const remaining = cartStore.minOrder - cartTotal

  return (
    <>
      <TopBar title="السلة" backTo="/" />
      <div className="page stack">
        <Link to={`/store/${cartStore.id}`} className="card" style={{ padding: 14 }}>
          <div className="row">
            <StoreIcon size={18} color="#e01828" />
            <div>
              <div className="h2">{cartStore.name}</div>
              <p className="muted">
                توصيل {cartStore.eta} د · {formatIQD(fee)}
              </p>
            </div>
          </div>
        </Link>

        <div className="stack">
          {cart.map((line) => {
            const product = getProduct(line.storeId, line.productId)
            if (!product) return null
            return (
              <article key={line.productId} className="product-row">
                <div>
                  <h3 className="h2">{product.name}</h3>
                  <p className="muted">{product.desc}</p>
                  <div className="between" style={{ marginTop: 10 }}>
                    <div className="row">
                      <span className="price">{formatIQD(product.price * line.qty)}</span>
                      {product.oldPrice ? (
                        <span className="old-price">{formatIQD(product.oldPrice * line.qty)}</span>
                      ) : null}
                    </div>
                    <div className="qty">
                      <button
                        type="button"
                        onClick={() => setQty(product.id, line.qty - 1)}
                        aria-label="إنقاص"
                      >
                        −
                      </button>
                      <span>{line.qty}</span>
                      <button
                        type="button"
                        onClick={() => setQty(product.id, line.qty + 1)}
                        aria-label="زيادة"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
                <img src={product.image} alt={product.name} />
              </article>
            )
          })}
        </div>

        <section className="card" style={{ padding: 14 }}>
          <h2 className="h2">ملخص الطلب</h2>
          <div className="between" style={{ marginTop: 12 }}>
            <span className="muted">المجموع الفرعي</span>
            <span>{formatIQD(cartTotal)}</span>
          </div>
          <div className="between" style={{ marginTop: 8 }}>
            <span className="muted">رسوم التوصيل</span>
            <span>{formatIQD(fee)}</span>
          </div>
          <div className="between" style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--line)' }}>
            <span className="h2">الإجمالي</span>
            <span className="price">{formatIQD(total)}</span>
          </div>
        </section>

        {belowMin ? (
          <div className="warn">
            الحد الأدنى للطلب من {cartStore.name} هو {formatIQD(cartStore.minOrder)}.
            أضف {formatIQD(remaining)} للمتابعة إلى الدفع.
          </div>
        ) : null}

        <Link
          to="/checkout"
          className="btn full"
          style={{ pointerEvents: belowMin ? 'none' : undefined, opacity: belowMin ? 0.5 : 1 }}
          aria-disabled={belowMin}
        >
          إتمام الطلب · {formatIQD(total)}
        </Link>

        <button type="button" className="btn btn-ghost full" onClick={clearCart}>
          <Trash2 size={16} />
          إفراغ السلة
        </button>
      </div>
    </>
  )
}
