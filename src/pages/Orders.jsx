import { Link } from 'react-router'
import { Package, RotateCcw, ShoppingBag } from 'lucide-react'
import TopBar from '../components/TopBar.jsx'
import { useApp } from '../context/AppContext.web.jsx'
import { useI18n } from '../context/I18nContext.web.jsx'
import { useIsDesktop } from '../hooks/useIsDesktop.js'
import { getStore, formatIQD, getProduct, productName, storeName, tUI } from '../data/mock.web.js'

export function orderStep(createdAt, now = Date.now()) {
  const age = (now - createdAt) / 1000
  if (age < 20) return 0
  if (age < 50) return 1
  if (age < 90) return 2
  return 3
}

export default function Orders() {
  const { orders } = useApp()
  const { lang } = useI18n()
  const t = tUI(lang)
  const isDesktop = useIsDesktop()
  const list = [...orders].sort((a, b) => b.createdAt - a.createdAt)

  const steps = lang === 'tr'
    ? ['Onaylandı', 'Hazırlanıyor', 'Yolda', 'Teslim edildi']
    : lang === 'en'
      ? ['Confirmed', 'Preparing', 'On the way', 'Delivered']
      : ['تم التأكيد', 'يحضّر الطلب', 'في الطريق', 'تم التوصيل']

  const loc = lang === 'tr' ? 'tr-TR' : lang === 'en' ? 'en-US' : 'ar-IQ'
  const formatDate = (ts) =>
    new Date(ts).toLocaleString(loc, {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    })

  const empty = (
    <div className="empty" style={isDesktop ? { padding: 60 } : undefined}>
      <div className="empty-icon"><ShoppingBag size={36} /></div>
      <p className="h2" style={{ color: 'var(--ink)', marginTop: 12 }}>
        {lang === 'tr' ? 'Henüz sipariş yok' : lang === 'en' ? 'No orders yet' : 'لا توجد طلبات بعد'}
      </p>
      <p className="muted" style={{ margin: '8px 0 18px' }}>{t.profileOrdersHint}</p>
      <Link to="/" className="btn">{t.browseStores}</Link>
    </div>
  )

  const renderOrderCard = (order) => {
    const store = getStore(order.storeId)
    const step = orderStep(order.createdAt)
    const count = (order.items || []).reduce((n, i) => n + (i.qty || 1), 0)
    const names = (order.items || [])
      .slice(0, 2)
      .map((i) => productName(getProduct(i.storeId || order.storeId, i.productId), lang))
      .filter(Boolean)

    return (
      <article key={order.id} className="card order-card">
        <Link to={`/track/${order.id}`} className="stack" style={{ gap: 10 }}>
          <div className="between">
            <div className="row" style={{ gap: 10 }}>
              <div className="order-thumb">
                {store?.cover ? <img src={store.cover} alt="" /> : <Package size={20} />}
              </div>
              <div>
                <div className="h2">{storeName(store, lang) || 'M10'}</div>
                <div className="muted">{formatDate(order.createdAt)}</div>
              </div>
            </div>
            <span className={`status-pill step-${step}`}>{steps[step]}</span>
          </div>
          <div className="muted">
            {count} {count === 1 ? t.item : t.items}
            {names.length ? ` · ${names.join(', ')}` : ''}
            {count > 2 ? '…' : ''}
          </div>
          <div className="between">
            <span className="price">{formatIQD(order.total, lang)}</span>
            <span className="muted">{order.id}</span>
          </div>
        </Link>
        {store && (
          <Link to={`/store/${store.id}`} className="btn-ghost reorder-btn">
            <RotateCcw size={16} />
            {t.reorder}
          </Link>
        )}
      </article>
    )
  }

  if (isDesktop) {
    return (
      <div className="desktop-page-card metro-page">
        <h1 className="h1" style={{ fontSize: 24, marginBottom: 24 }}>{t.orders}</h1>
        {list.length === 0 ? empty : (
          <div className="stack" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))' }}>
            {list.map(renderOrderCard)}
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      <TopBar title={t.orders} backTo="/" />
      <div className="page stack">
        {list.length === 0 ? empty : list.map(renderOrderCard)}
      </div>
    </>
  )
}
