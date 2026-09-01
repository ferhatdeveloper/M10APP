import { useMemo, useState } from 'react'
import { Banknote, ChevronLeft, Clock3, CreditCard, MapPin } from 'lucide-react'
import { Link, useNavigate } from 'react-router'
import TopBar from '../components/TopBar.jsx'
import { useApp } from '../context/AppContext.jsx'
import { formatIQD, getProduct } from '../data/mock.js'

function buildSlots() {
  const slots = []
  const start = new Date()
  const mins = start.getMinutes()
  start.setMinutes(mins < 30 ? 30 : 60, 0, 0)
  start.setTime(start.getTime() + 30 * 60 * 1000)

  const fmt = (d) =>
    d.toLocaleTimeString('ar-IQ', { hour: '2-digit', minute: '2-digit', hour12: false })

  for (let i = 0; i < 8; i++) {
    const from = new Date(start.getTime() + i * 30 * 60 * 1000)
    const to = new Date(from.getTime() + 30 * 60 * 1000)
    slots.push(`${fmt(from)} – ${fmt(to)}`)
  }
  return slots
}

export default function Checkout() {
  const navigate = useNavigate()
  const { cart, cartStore, cartTotal, user, placeOrder } = useApp()
  const slots = useMemo(buildSlots, [])
  const [payment, setPayment] = useState('نقداً عند الاستلام')
  const [when, setWhen] = useState('now')
  const [slot, setSlot] = useState(slots[0] || '')
  const [note, setNote] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!cart.length || !cartStore) {
    return (
      <>
        <TopBar title="الدفع" backTo="/cart" />
        <div className="page">
          <div className="empty">
            <p className="h2">لا يوجد طلب لإتمامه</p>
            <p className="muted" style={{ marginTop: 8 }}>
              أضف أصنافاً إلى السلة أولاً
            </p>
            <Link to="/" className="btn" style={{ marginTop: 16 }}>
              العودة للرئيسية
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
  const addr = user.address
  const canSubmit = !belowMin && !submitting && (when === 'now' || Boolean(slot))

  const submit = () => {
    if (!canSubmit) return
    setSubmitting(true)
    const order = placeOrder({
      payment,
      schedule: when === 'now' ? 'الآن' : slot,
      note: note.trim(),
    })
    navigate(`/track/${order.id}`)
  }

  return (
    <>
      <TopBar title="الدفع" backTo="/cart" />
      <div className="page stack">
        <section className="card" style={{ padding: 14 }}>
          <div className="between">
            <h2 className="h2">عنوان التوصيل</h2>
            <Link to="/addresses" className="row" style={{ color: 'var(--red)', fontWeight: 800, fontSize: 13 }}>
              تغيير
              <ChevronLeft size={16} />
            </Link>
          </div>
          <div className="row" style={{ marginTop: 10, alignItems: 'flex-start' }}>
            <MapPin size={18} color="#e01828" />
            <div>
              <div className="h2">{addr.label}</div>
              <p className="muted">
                {addr.area}، {addr.city}
              </p>
              <p className="muted">{addr.details}</p>
              {addr.note ? <p className="muted">{addr.note}</p> : null}
            </div>
          </div>
        </section>

        <section className="stack">
          <h2 className="h2">طريقة الدفع</h2>
          <button
            type="button"
            className={`radio${payment === 'نقداً عند الاستلام' ? ' on' : ''}`}
            onClick={() => setPayment('نقداً عند الاستلام')}
          >
            <span className="row">
              <Banknote size={18} color="#e01828" />
              نقداً عند الاستلام
            </span>
            <span className="muted">ادفع للمندوب</span>
          </button>
          <button
            type="button"
            className={`radio${payment === 'بطاقة' ? ' on' : ''}`}
            onClick={() => setPayment('بطاقة')}
          >
            <span className="row">
              <CreditCard size={18} color="#e01828" />
              بطاقة
            </span>
            <span className="muted">Visa / Mastercard</span>
          </button>
        </section>

        <section className="stack">
          <h2 className="h2">وقت التوصيل</h2>
          <button
            type="button"
            className={`radio${when === 'now' ? ' on' : ''}`}
            onClick={() => setWhen('now')}
          >
            <span className="row">
              <Clock3 size={18} color="#e01828" />
              الآن
            </span>
            <span className="muted">خلال {cartStore.eta} د</span>
          </button>
          <button
            type="button"
            className={`radio${when === 'later' ? ' on' : ''}`}
            onClick={() => setWhen('later')}
          >
            <span>جدولة</span>
            <span className="muted">اختر فترة التوصيل</span>
          </button>
          {when === 'later' ? (
            <div className="slots">
              {slots.map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`slot${slot === s ? ' on' : ''}`}
                  onClick={() => setSlot(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          ) : null}
        </section>

        <section className="stack">
          <h2 className="h2">ملاحظة (اختياري)</h2>
          <textarea
            className="input note"
            rows={3}
            maxLength={240}
            placeholder="مثال: بدون بصل، اترك الطلب عند الباب"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </section>

        <section className="card" style={{ padding: 14 }}>
          <h2 className="h2">ملخص الطلب</h2>
          <p className="muted" style={{ marginTop: 4 }}>
            {cartStore.name}
          </p>
          <div className="stack" style={{ marginTop: 12, gap: 8 }}>
            {cart.map((line) => {
              const product = getProduct(line.storeId, line.productId)
              if (!product) return null
              return (
                <div key={line.productId} className="between">
                  <span className="muted">
                    {line.qty}× {product.name}
                  </span>
                  <span>{formatIQD(product.price * line.qty)}</span>
                </div>
              )
            })}
          </div>
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
            الحد الأدنى للطلب {formatIQD(cartStore.minOrder)}. أضف {formatIQD(remaining)}{' '}
            لإتمام الطلب من {cartStore.name}.
          </div>
        ) : null}

        <button type="button" className="btn full" disabled={!canSubmit} onClick={submit}>
          تأكيد الطلب · {formatIQD(total)}
        </button>
      </div>
    </>
  )
}
