import { useState } from 'react'
import { Check, MapPin, Plus } from 'lucide-react'
import TopBar from '../components/TopBar.jsx'
import { useApp } from '../context/AppContext.jsx'

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
  a &&
  b &&
  a.label === b.label &&
  a.area === b.area &&
  a.details === b.details

const emptyForm = { label: '', area: '', details: '', note: '' }

export default function Addresses() {
  const { user, setUser, addresses, setAddresses } = useApp()
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
      city: 'بغداد',
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

  return (
    <>
      <TopBar title="العناوين" backTo="/profile" />
      <div className="page stack">
        {addresses.map((addr, i) => {
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
                  <div style={{ textAlign: 'right' }}>
                    <div className="h2">{addr.label}</div>
                    <div style={{ fontWeight: 700 }}>
                      {addr.area}، {addr.city || 'بغداد'}
                    </div>
                    <div className="muted">{addr.details}</div>
                    {addr.note ? <div className="muted">{addr.note}</div> : null}
                  </div>
                </div>
                {on ? (
                  <span className="chip">
                    <Check size={14} /> الحالي
                  </span>
                ) : (
                  <span className="muted">اختيار</span>
                )}
              </div>
            </button>
          )
        })}

        {open ? (
          <form className="card card-body stack" onSubmit={add}>
            <div className="h2">عنوان جديد</div>
            <input
              className="input"
              placeholder="التسمية (المنزل، العمل…)"
              value={form.label}
              onChange={(e) => setForm({ ...form, label: e.target.value })}
              required
            />
            <input
              className="input"
              placeholder="المنطقة (الكرادة، المنصور…)"
              value={form.area}
              onChange={(e) => setForm({ ...form, area: e.target.value })}
              required
            />
            <input
              className="input"
              placeholder="التفاصيل: الشارع، البناية، الطابق"
              value={form.details}
              onChange={(e) => setForm({ ...form, details: e.target.value })}
              required
            />
            <input
              className="input"
              placeholder="ملاحظة للكابتن (اختياري)"
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
            />
            <div className="row">
              <button type="submit" className="btn" style={{ flex: 1 }}>
                حفظ واختيار
              </button>
              <button type="button" className="btn-ghost" onClick={() => setOpen(false)}>
                إلغاء
              </button>
            </div>
          </form>
        ) : (
          <button type="button" className="btn" onClick={() => setOpen(true)}>
            <Plus size={18} />
            إضافة عنوان
          </button>
        )}
      </div>
    </>
  )
}
