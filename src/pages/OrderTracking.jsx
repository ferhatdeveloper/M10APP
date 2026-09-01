import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router'
import { MapPin, Phone, Wallet, Bike, Home, Package } from 'lucide-react'
import TopBar from '../components/TopBar.jsx'
import { useApp } from '../context/AppContext.jsx'
import { getStore, getProduct, formatIQD } from '../data/mock.js'
import { orderStep } from './Orders.jsx'

const STEPS = [
  { key: 'confirmed', label: 'تم التأكيد', hint: 'استلمنا طلبك' },
  { key: 'preparing', label: 'يحضّر الطلب', hint: 'المتجر يجهّز المنتجات' },
  { key: 'onway', label: 'في الطريق', hint: 'الكابتن متوجه إليك' },
  { key: 'delivered', label: 'تم التوصيل', hint: 'بالعافية' },
]

const COURIERS = [
  { name: 'حسين الموسوي', plate: 'دراجة ١٢' },
  { name: 'علي الجبوري', plate: 'دراجة ٠٧' },
  { name: 'كرار العبيدي', plate: 'دراجة ٢١' },
  { name: 'مصطفى الكاظمي', plate: 'دراجة ٠٤' },
]

const paymentText = (p) => {
  if (p === 'cash' || p === 'نقد' || p === 'نقداً') return 'نقداً عند الاستلام'
  if (p === 'card' || p === 'بطاقة') return 'بطاقة إلكترونية'
  if (p === 'wallet' || p === 'محفظة') return 'محفظة M10'
  return p || 'نقداً عند الاستلام'
}

const pickCourier = (id = '') => {
  const n = [...id].reduce((s, c) => s + c.charCodeAt(0), 0)
  return COURIERS[n % COURIERS.length]
}

export default function OrderTracking() {
  const { id } = useParams()
  const { orders } = useApp()
  const order = orders.find((o) => o.id === id)
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])

  const step = order ? orderStep(order.createdAt, now) : 0
  const delivered = step >= 3
  const onWay = step >= 2
  const courier = useMemo(() => pickCourier(id), [id])
  const store = order ? getStore(order.storeId) : null
  const addr = order?.address
  const etaLeft = order
    ? Math.max(0, Math.ceil((90000 - (now - order.createdAt)) / 1000 / 60))
    : 0

  if (!order) {
    return (
      <>
        <TopBar title="تتبع الطلب" backTo="/orders" />
        <div className="page">
          <div className="empty">
            <div className="empty-icon">
              <Package size={36} />
            </div>
            <p className="h2" style={{ color: 'var(--ink)', marginTop: 12 }}>
              الطلب غير موجود
            </p>
            <p className="muted" style={{ margin: '8px 0 18px' }}>
              ربما انتهت الجلسة أو رقم التتبع غير صحيح.
            </p>
            <Link to="/" className="btn">
              <Home size={18} />
              العودة للرئيسية
            </Link>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <TopBar title="تتبع الطلب" backTo="/orders" />
      <div className="page stack">
        <div className="map-fake">
          <div className="map-river" />
          <div className="map-road" />
          <div className="pin dest" title="موقعك" />
          <div
            className={`pin ${delivered ? 'arrived' : 'moving'}`}
            title={courier.name}
          />
          <div className="map-chip">
            {delivered ? 'وصل الطلب' : onWay ? `يصل خلال ${etaLeft || 1} د` : store?.eta ? `${store.eta} د` : 'جاري التجهيز'}
          </div>
        </div>

        <div className="card card-body courier-card">
          <div className="row" style={{ gap: 12 }}>
            <div className="courier-avatar">
              <Bike size={22} />
            </div>
            <div style={{ flex: 1 }}>
              <div className="h2">{courier.name}</div>
              <div className="muted">كابتن M10 · {courier.plate}</div>
            </div>
            <button
              className="btn call-btn"
              type="button"
              onClick={() => alert(`جاري الاتصال بـ ${courier.name}…`)}
            >
              <Phone size={16} />
              اتصال
            </button>
          </div>
        </div>

        <div className="card card-body">
          <div className="between" style={{ marginBottom: 14 }}>
            <div className="h2">{store?.name || 'بتلر M10'}</div>
            <span className="muted">{order.id}</span>
          </div>
          <ol className="timeline">
            {STEPS.map((s, i) => (
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
          <div className="h2">التوصيل والدفع</div>
          <div className="row" style={{ alignItems: 'flex-start' }}>
            <MapPin size={18} color="#e01828" />
            <div>
              <div style={{ fontWeight: 800 }}>
                {addr?.label} · {addr?.area}
              </div>
              <div className="muted">
                {addr?.city} — {addr?.details}
              </div>
              {addr?.note ? <div className="muted">{addr.note}</div> : null}
            </div>
          </div>
          <div className="row">
            <Wallet size={18} color="#e01828" />
            <span>{paymentText(order.payment)}</span>
          </div>
        </div>

        <div className="card card-body stack" style={{ gap: 10 }}>
          <div className="h2">تفاصيل الطلب</div>
          {(order.items || []).map((item) => {
            const p = getProduct(item.storeId || order.storeId, item.productId)
            return (
              <div key={item.productId} className="between">
                <span>
                  {p?.name || item.productId} × {item.qty}
                </span>
                <span className="muted">{formatIQD((p?.price || 0) * item.qty)}</span>
              </div>
            )
          })}
          {order.fee ? (
            <div className="between muted">
              <span>رسوم التوصيل</span>
              <span>{formatIQD(order.fee)}</span>
            </div>
          ) : null}
          <div className="between" style={{ borderTop: '1px solid var(--line)', paddingTop: 10 }}>
            <span className="h2">الإجمالي</span>
            <span className="price">{formatIQD(order.total)}</span>
          </div>
          {order.pointsEarned ? (
            <div className="chip" style={{ alignSelf: 'flex-start' }}>
              +{order.pointsEarned} نقطة Rewards
            </div>
          ) : null}
        </div>
      </div>
    </>
  )
}
