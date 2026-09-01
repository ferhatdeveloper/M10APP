import { Link } from 'react-router'
import { Package, RotateCcw, ShoppingBag } from 'lucide-react'
import TopBar from '../components/TopBar.jsx'
import { useApp } from '../context/AppContext.jsx'
import { getStore, formatIQD, getProduct } from '../data/mock.js'

const STEPS = ['تم التأكيد', 'يحضّر الطلب', 'في الطريق', 'تم التوصيل']

export function orderStep(createdAt, now = Date.now()) {
  const age = (now - createdAt) / 1000
  if (age < 20) return 0
  if (age < 50) return 1
  if (age < 90) return 2
  return 3
}

const formatDate = (ts) =>
  new Date(ts).toLocaleString('ar-IQ', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })

const itemCount = (order) =>
  (order.items || []).reduce((n, i) => n + (i.qty || 1), 0)

export default function Orders() {
  const { orders } = useApp()
  const list = [...orders].sort((a, b) => b.createdAt - a.createdAt)

  return (
    <>
      <TopBar title="طلباتي" backTo="/" />
      <div className="page stack">
        {list.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">
              <ShoppingBag size={36} />
            </div>
            <p className="h2" style={{ color: 'var(--ink)', marginTop: 12 }}>
              لا توجد طلبات بعد
            </p>
            <p className="muted" style={{ margin: '8px 0 18px' }}>
              اطلب من مطاعم بغداد والمتاجر المختارة، وتتبع طلبك لحظة بلحظة.
            </p>
            <Link to="/" className="btn">
              ابدأ الطلب
            </Link>
          </div>
        ) : (
          list.map((order) => {
            const store = getStore(order.storeId)
            const step = orderStep(order.createdAt)
            const count = itemCount(order)
            const names = (order.items || [])
              .slice(0, 2)
              .map((i) => getProduct(i.storeId || order.storeId, i.productId)?.name)
              .filter(Boolean)

            return (
              <article key={order.id} className="card order-card">
                <Link to={`/track/${order.id}`} className="stack" style={{ gap: 10 }}>
                  <div className="between">
                    <div className="row" style={{ gap: 10 }}>
                      <div className="order-thumb">
                        {store?.cover ? (
                          <img src={store.cover} alt="" />
                        ) : (
                          <Package size={20} />
                        )}
                      </div>
                      <div>
                        <div className="h2">{store?.name || 'بتلر M10'}</div>
                        <div className="muted">{formatDate(order.createdAt)}</div>
                      </div>
                    </div>
                    <span className={`status-pill step-${step}`}>{STEPS[step]}</span>
                  </div>
                  <div className="muted">
                    {count} منتج{count > 1 ? 'ات' : ''}
                    {names.length ? ` · ${names.join('، ')}` : ''}
                    {count > 2 ? '…' : ''}
                  </div>
                  <div className="between">
                    <span className="price">{formatIQD(order.total)}</span>
                    <span className="muted">{order.id}</span>
                  </div>
                </Link>
                {store ? (
                  <Link to={`/store/${store.id}`} className="btn-ghost reorder-btn">
                    <RotateCcw size={16} />
                    أعد الطلب
                  </Link>
                ) : null}
              </article>
            )
          })
        )}
      </div>
    </>
  )
}
