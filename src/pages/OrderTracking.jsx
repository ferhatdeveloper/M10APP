import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router'
import { MapPin, Phone, Wallet, Bike, Home, Package } from 'lucide-react'
import TopBar from '../components/TopBar.jsx'
import { useApp } from '../context/AppContext.web.jsx'
import { useI18n } from '../context/I18nContext.web.jsx'
import { getStore, getProduct, formatIQD, productName, storeName, tUI } from '../data/mock.web.js'
import { orderStep } from './Orders.jsx'

const COURIERS = {
  ar: [
    { name: 'حسين الموسوي', plate: '١٢' },
    { name: 'علي الجبوري', plate: '٠٧' },
    { name: 'كرار العبيدي', plate: '٢١' },
    { name: 'مصطفى الكاظمي', plate: '٠٤' },
  ],
  tr: [
    { name: 'Hüseyin Musa', plate: '12' },
    { name: 'Ali Cuburi', plate: '07' },
    { name: 'Kerrar Ubeydi', plate: '21' },
    { name: 'Mustafa Kazimi', plate: '04' },
  ],
  en: [
    { name: 'Hussein Al-Musawi', plate: '12' },
    { name: 'Ali Al-Jubouri', plate: '07' },
    { name: 'Karrar Al-Obaidi', plate: '21' },
    { name: 'Mustafa Al-Kadhim', plate: '04' },
  ],
}

const pickCourier = (id = '', lang = 'ar') => {
  const list = COURIERS[lang] || COURIERS.ar
  const n = [...id].reduce((s, c) => s + c.charCodeAt(0), 0)
  return list[n % list.length]
}

export default function OrderTracking() {
  const { id } = useParams()
  const { orders } = useApp()
  const { lang } = useI18n()
  const t = tUI(lang)
  const order = orders.find((o) => o.id === id)
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [])

  const step = order ? orderStep(order.createdAt, now) : 0
  const delivered = step >= 3
  const onWay = step >= 2
  const courier = useMemo(() => pickCourier(id, lang), [id, lang])
  const store = order ? getStore(order.storeId) : null
  const addr = order?.address
  const etaLeft = order
    ? Math.max(0, Math.ceil((90000 - (now - order.createdAt)) / 1000 / 60))
    : 0

  const steps = [
    { key: 'confirmed', label: t.stepConfirmed, hint: t.hintConfirmed },
    { key: 'preparing', label: t.stepPreparing, hint: t.hintPreparing },
    { key: 'onway', label: t.stepOnWay, hint: t.hintOnWay },
    { key: 'delivered', label: t.stepDelivered, hint: t.hintDelivered },
  ]

  const paymentText = (p) => {
    const raw = String(p || '')
    if (p === 'cash' || raw.includes('نقد') || /cash|nakit|kapıda/i.test(raw)) return t.cashOnDelivery
    if (p === 'card' || raw.includes('بطاقة') || /card|kart/i.test(raw)) return t.card
    if (p === 'wallet' || raw.includes('محفظة') || /wallet|cüzdan/i.test(raw)) return t.wallet
    return raw || t.cashOnDelivery
  }

  if (!order) {
    return (
      <>
        <TopBar title={t.trackOrder} backTo="/orders" />
        <div className="page">
          <div className="empty">
            <div className="empty-icon"><Package size={36} /></div>
            <p className="h2" style={{ color: 'var(--ink)', marginTop: 12 }}>{t.orderNotFound}</p>
            <p className="muted" style={{ margin: '8px 0 18px' }}>{t.orderNotFoundHint}</p>
            <Link to="/" className="btn">
              <Home size={18} />
              {t.backHome}
            </Link>
          </div>
        </div>
      </>
    )
  }

  const mapChip = delivered
    ? t.orderArrived
    : onWay
      ? `${t.arrivesIn} ${etaLeft || 1} ${t.min}`
      : store?.eta
        ? `${store.eta} ${t.min}`
        : t.preparingStatus

  return (
    <>
      <TopBar title={t.trackOrder} backTo="/orders" />
      <div className="page stack">
        <div className="map-fake">
          <div className="map-river" />
          <div className="map-road" />
          <div className="pin dest" title={t.yourLocation} />
          <div className={`pin ${delivered ? 'arrived' : 'moving'}`} title={courier.name} />
          <div className="map-chip">{mapChip}</div>
        </div>

        <div className="card card-body courier-card">
          <div className="row" style={{ gap: 12 }}>
            <div className="courier-avatar"><Bike size={22} /></div>
            <div style={{ flex: 1 }}>
              <div className="h2">{courier.name}</div>
              <div className="muted">{t.courierLabel} · {t.bike} {courier.plate}</div>
            </div>
            <button
              className="btn call-btn"
              type="button"
              onClick={() => alert(`${t.calling} ${courier.name}…`)}
            >
              <Phone size={16} />
              {t.call}
            </button>
          </div>
        </div>

        <div className="card card-body">
          <div className="between" style={{ marginBottom: 14 }}>
            <div className="h2">{storeName(store, lang) || 'M10'}</div>
            <span className="muted">{order.id}</span>
          </div>
          <ol className="timeline">
            {steps.map((s, i) => (
              <li key={s.key} className="t-step">
                <span className={`t-dot${i <= step ? ' on' : ''}`} />
                <div className={i <= step ? '' : 'muted'} style={{ paddingBottom: 18 }}>
                  <div style={{ fontWeight: 800 }}>{s.label}</div>
                  <div className="muted">{s.hint}</div>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="card card-body stack" style={{ gap: 10 }}>
          <div className="h2">{t.deliveryAndPayment}</div>
          <div className="row" style={{ alignItems: 'flex-start' }}>
            <MapPin size={18} color="#e01828" />
            <div>
              <div style={{ fontWeight: 800 }}>{addr?.label} · {addr?.area}</div>
              <div className="muted">{addr?.city} — {addr?.details}</div>
              {addr?.note ? <div className="muted">{addr.note}</div> : null}
            </div>
          </div>
          <div className="row">
            <Wallet size={18} color="#e01828" />
            <span>{paymentText(order.payment)}</span>
          </div>
        </div>

        <div className="card card-body stack" style={{ gap: 10 }}>
          <div className="h2">{t.orderDetails}</div>
          {(order.items || []).map((item) => {
            const p = getProduct(item.storeId || order.storeId, item.productId)
            return (
              <div key={item.productId} className="between">
                <span>{productName(p, lang) || item.productId} × {item.qty}</span>
                <span className="muted">{formatIQD((p?.price || 0) * item.qty, lang)}</span>
              </div>
            )
          })}
          {order.fee ? (
            <div className="between muted">
              <span>{t.deliveryFee}</span>
              <span>{formatIQD(order.fee, lang)}</span>
            </div>
          ) : null}
          <div className="between" style={{ borderTop: '1px solid var(--line)', paddingTop: 10 }}>
            <span className="h2">{t.total}</span>
            <span className="price">{formatIQD(order.total, lang)}</span>
          </div>
          {order.pointsEarned ? (
            <div className="chip" style={{ alignSelf: 'flex-start' }}>
              +{order.pointsEarned} {t.pointsRewards}
            </div>
          ) : null}
        </div>
      </div>
    </>
  )
}
