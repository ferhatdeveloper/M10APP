import { useMemo, useState } from 'react'
import { Banknote, ChevronLeft, ChevronRight, Clock3, CreditCard, MapPin } from 'lucide-react'
import { Link, useNavigate } from 'react-router'
import TopBar from '../components/TopBar.jsx'
import { useApp } from '../context/AppContext.web.jsx'
import { useI18n } from '../context/I18nContext.web.jsx'
import { useIsDesktop } from '../hooks/useIsDesktop.js'
import { formatIQD, getProduct, productName, tUI } from '../data/mock.web.js'

function buildSlots(lang) {
  const slots = []
  const start = new Date()
  const mins = start.getMinutes()
  start.setMinutes(mins < 30 ? 30 : 60, 0, 0)
  start.setTime(start.getTime() + 30 * 60 * 1000)
  const loc = lang === 'tr' ? 'tr-TR' : lang === 'en' ? 'en-US' : 'ar-IQ'
  const fmt = (d) => d.toLocaleTimeString(loc, { hour: '2-digit', minute: '2-digit', hour12: false })
  for (let i = 0; i < 8; i++) {
    const from = new Date(start.getTime() + i * 30 * 60 * 1000)
    const to = new Date(from.getTime() + 30 * 60 * 1000)
    slots.push(`${fmt(from)} – ${fmt(to)}`)
  }
  return slots
}

export default function Checkout() {
  const navigate = useNavigate()
  const isDesktop = useIsDesktop()
  const { lang, isRTL } = useI18n()
  const t = tUI(lang)
  const { cart, cartStore, cartTotal, user, placeOrder } = useApp()
  const slots = useMemo(() => buildSlots(lang), [lang])
  const [payment, setPayment] = useState('cash')
  const [when, setWhen] = useState('now')
  const [slot, setSlot] = useState(slots[0] || '')
  const [note, setNote] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const Chevron = isRTL ? ChevronLeft : ChevronRight

  if (!cart.length || !cartStore) {
    return (
      <>
        {!isDesktop && <TopBar title={t.payment} backTo="/cart" />}
        <div className={isDesktop ? 'desktop-page-card metro-page' : 'page'}>
          <div className="empty">
            <p className="h2">{t.noCheckout}</p>
            <p className="muted" style={{ marginTop: 8 }}>{t.addItemsFirst}</p>
            <Link to="/" className="btn" style={{ marginTop: 16 }}>{t.backHome}</Link>
          </div>
        </div>
      </>
    )
  }

  const fee = cartStore.fee || 0
  const total = cartTotal + fee
  const belowMin = cartTotal < cartStore.minOrder
  const remaining = cartStore.minOrder - cartTotal
  const addr = user.address || { label: '—', area: '—', city: '—', details: '' }
  const canSubmit = !belowMin && !submitting && (when === 'now' || Boolean(slot))

  const submit = async () => {
    if (!canSubmit) return
    setSubmitting(true)
    try {
      const order = await placeOrder({
        payment: payment === 'cash' ? t.cashOnDelivery : t.card,
        schedule: when === 'now' ? t.now : slot,
        note: note.trim(),
      })
      if (order?.id) navigate(`/track/${order.id}`)
    } finally {
      setSubmitting(false)
    }
  }

  const form = (
    <>
      <section className="card" style={{ padding: 20, marginBottom: 16 }}>
        <div className="between" style={{ marginBottom: 12 }}>
          <h2 className="h2">{t.deliveryAddress}</h2>
          <Link to="/addresses" className="row" style={{ color: 'var(--red)', fontWeight: 800, fontSize: 13 }}>
            {t.addresses} <Chevron size={16} />
          </Link>
        </div>
        <div className="row" style={{ alignItems: 'flex-start', gap: 12 }}>
          <MapPin size={20} color="#e01828" />
          <div>
            <div className="h2">{addr.label}</div>
            <p className="muted">{addr.area}, {addr.city}</p>
            <p className="muted">{addr.details}</p>
          </div>
        </div>
      </section>

      <section className="card" style={{ padding: 20, marginBottom: 16 }}>
        <h2 className="h2" style={{ marginBottom: 12 }}>{t.payment}</h2>
        <div className="stack" style={{ gap: 10 }}>
          <button type="button" className={`radio${payment === 'cash' ? ' on' : ''}`} onClick={() => setPayment('cash')}>
            <span className="row"><Banknote size={18} color="#e01828" /> {t.cashOnDelivery}</span>
          </button>
          <button type="button" className={`radio${payment === 'card' ? ' on' : ''}`} onClick={() => setPayment('card')}>
            <span className="row"><CreditCard size={18} color="#e01828" /> {t.card}</span>
          </button>
        </div>
      </section>

      <section className="card" style={{ padding: 20, marginBottom: 16 }}>
        <h2 className="h2" style={{ marginBottom: 12 }}>{t.deliveryTime}</h2>
        <div className="stack" style={{ gap: 10 }}>
          <button type="button" className={`radio${when === 'now' ? ' on' : ''}`} onClick={() => setWhen('now')}>
            <span className="row"><Clock3 size={18} color="#e01828" /> {t.now}</span>
            <span className="muted">{cartStore.eta} {t.min}</span>
          </button>
          <button type="button" className={`radio${when === 'later' ? ' on' : ''}`} onClick={() => setWhen('later')}>
            <span>{t.schedule}</span>
          </button>
          {when === 'later' && (
            <select className="input" value={slot} onChange={(e) => setSlot(e.target.value)}>
              {slots.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          )}
        </div>
      </section>

      <textarea
        className="input note"
        rows={3}
        maxLength={240}
        placeholder={t.notePlaceholder}
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
    </>
  )

  const summary = (
    <div className="card" style={{ padding: 20, position: isDesktop ? 'sticky' : undefined, top: isDesktop ? 132 : undefined }}>
      <h2 className="h2" style={{ marginBottom: 12 }}>{t.orderSummary}</h2>
      <div className="stack" style={{ gap: 8, marginBottom: 12 }}>
        {cart.map((line) => {
          const product = getProduct(line.storeId, line.productId)
          if (!product) return null
          return (
            <div key={line.productId} className="between">
              <span className="muted">{productName(product, lang)} × {line.qty}</span>
              <span>{formatIQD(product.price * line.qty, lang)}</span>
            </div>
          )
        })}
      </div>
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
      <button type="button" className="btn full" style={{ marginTop: 20 }} disabled={!canSubmit} onClick={submit}>
        {t.confirmOrder} · {formatIQD(total, lang)}
      </button>
    </div>
  )

  if (isDesktop) {
    return (
      <div className="desktop-checkout metro-page">
        <h1 className="h1" style={{ fontSize: 24, marginBottom: 24 }}>{t.checkoutTitle}</h1>
        <div className="desktop-checkout-layout">
          <div className="desktop-checkout-form">{form}</div>
          <div className="desktop-checkout-summary">{summary}</div>
        </div>
      </div>
    )
  }

  return (
    <>
      <TopBar title={t.checkoutTitle} backTo="/cart" />
      <div className="page stack">
        {form}
        {summary}
      </div>
    </>
  )
}
