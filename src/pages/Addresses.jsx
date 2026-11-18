import { useState } from 'react'
import { Check, MapPin, Plus } from 'lucide-react'
import TopBar from '../components/TopBar.jsx'
import { useApp } from '../context/AppContext.web.jsx'
import { useI18n } from '../context/I18nContext.web.jsx'
import { useIsDesktop } from '../hooks/useIsDesktop.js'
import { tUI } from '../data/mock.web.js'

const persistAddresses = (next) => {
  try {
    localStorage.setItem('m10-addresses', JSON.stringify(next))
  } catch {
    /* ignore */
  }
}

const persistUser = (next) => {
  try {
    localStorage.setItem('m10-user', JSON.stringify(next))
  } catch {
    /* ignore */
  }
}

const sameAddr = (a, b) =>
  a && b && a.label === b.label && a.area === b.area && a.details === b.details

const emptyForm = { label: '', area: '', details: '', note: '' }

export default function Addresses() {
  const { user, setUser, addresses, setAddresses } = useApp()
  const { lang, isRTL } = useI18n()
  const t = tUI(lang)
  const isDesktop = useIsDesktop()
  const [form, setForm] = useState(emptyForm)
  const [open, setOpen] = useState(false)

  const select = (addr) => {
    setUser((u) => {
      const next = { ...u, address: addr }
      persistUser(next)
      return next
    })
  }

  const add = (e) => {
    e.preventDefault()
    if (!form.label.trim() || !form.area.trim() || !form.details.trim()) return
    const addr = {
      label: form.label.trim(),
      city: t.defaultCity,
      area: form.area.trim(),
      details: form.details.trim(),
      note: form.note.trim(),
    }
    setAddresses((prev) => {
      const next = [...prev, addr]
      persistAddresses(next)
      return next
    })
    select(addr)
    setForm(emptyForm)
    setOpen(false)
  }

  const renderAddressCard = (addr, i) => {
    const on = sameAddr(user.address, addr)
    return (
      <button
        key={`${addr.label}-${i}`}
        type="button"
        className={`card card-body addr-card${on ? ' on' : ''}`}
        onClick={() => select(addr)}
      >
        <div className="between" style={{ alignItems: 'flex-start' }}>
          <div className="row" style={{ alignItems: 'flex-start', gap: 10 }}>
            <MapPin size={20} color="#e01828" />
            <div style={{ textAlign: isRTL ? 'right' : 'left' }}>
              <div className="h2">{addr.label}</div>
              <div style={{ fontWeight: 700 }}>{addr.area}, {addr.city || t.defaultCity}</div>
              <div className="muted">{addr.details}</div>
              {addr.note && <div className="muted">{addr.note}</div>}
            </div>
          </div>
          {on ? (
            <span className="chip"><Check size={14} /> {t.current}</span>
          ) : (
            <span className="muted">{t.select}</span>
          )}
        </div>
      </button>
    )
  }

  const renderForm = () => (
    <form className="card card-body stack" onSubmit={add}>
      <div className="h2">{t.newAddress}</div>
      <input className="input" placeholder={t.labelPlaceholder} value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} required />
      <input className="input" placeholder={t.areaPlaceholder} value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} required />
      <input className="input" placeholder={t.detailsPlaceholder} value={form.details} onChange={(e) => setForm({ ...form, details: e.target.value })} required />
      <input className="input" placeholder={t.noteCaptainPlaceholder} value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
      <div className="row">
        <button type="submit" className="btn" style={{ flex: 1 }}>{t.saveAndSelect}</button>
        <button type="button" className="btn-ghost" onClick={() => setOpen(false)}>{t.cancel}</button>
      </div>
    </form>
  )

  if (isDesktop) {
    return (
      <div className="desktop-page-card metro-page">
        <h1 className="h1" style={{ fontSize: 24, marginBottom: 24 }}>{t.addresses}</h1>
        <div className="stack" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
          {addresses.map(renderAddressCard)}
        </div>
        {open ? (
          <div style={{ marginTop: 16, maxWidth: 500 }}>{renderForm()}</div>
        ) : (
          <button type="button" className="btn" style={{ marginTop: 16 }} onClick={() => setOpen(true)}>
            <Plus size={18} /> {t.addAddress}
          </button>
        )}
      </div>
    )
  }

  return (
    <>
      <TopBar title={t.addresses} backTo="/profile" />
      <div className="page stack">
        {addresses.map(renderAddressCard)}
        {open ? renderForm() : (
          <button type="button" className="btn" onClick={() => setOpen(true)}>
            <Plus size={18} /> {t.addAddress}
          </button>
        )}
      </div>
    </>
  )
}
