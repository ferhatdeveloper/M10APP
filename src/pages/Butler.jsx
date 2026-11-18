import { useState } from 'react'
import { Link } from 'react-router'
import { Bike, CheckCircle2, Clock3, MapPin, Package } from 'lucide-react'
import TopBar from '../components/TopBar.jsx'
import { useApp } from '../context/AppContext.web.jsx'
import { useI18n } from '../context/I18nContext.web.jsx'
import { tUI } from '../data/mock.web.js'

const persistButler = (job) => {
  try {
    const prev = JSON.parse(localStorage.getItem('m10-butler') || '[]')
    localStorage.setItem('m10-butler', JSON.stringify([job, ...prev]))
  } catch {
    /* ignore */
  }
}

export default function Butler() {
  const { user } = useApp()
  const { lang } = useI18n()
  const t = tUI(lang)
  const addr = user.address || {}
  const dropDefault = [addr.area, addr.details].filter(Boolean).join(', ')
  const [need, setNeed] = useState('')
  const [pickup, setPickup] = useState('')
  const [dropoff, setDropoff] = useState(dropDefault)
  const [when, setWhen] = useState('now')
  const [job, setJob] = useState(null)

  const whenOptions = [
    { id: 'now', label: t.now },
    { id: 'hour', label: t.withinHour },
    { id: 'evening', label: t.thisEvening },
  ]

  const submit = (e) => {
    e.preventDefault()
    if (!need.trim() || !pickup.trim() || !dropoff.trim()) return
    const created = {
      id: `M10-B-${Date.now().toString().slice(-7)}`,
      createdAt: Date.now(),
      need: need.trim(),
      pickup: pickup.trim(),
      dropoff: dropoff.trim(),
      when,
      status: 'confirmed',
    }
    persistButler(created)
    setJob(created)
  }

  if (job) {
    return (
      <>
        <TopBar title={t.butlerTitle} backTo="/" />
        <div className="page">
          <div className="card card-body stack" style={{ textAlign: 'center', padding: 28 }}>
            <div className="success-check"><CheckCircle2 size={40} /></div>
            <h1 className="h1">{t.butlerReceived}</h1>
            <p className="muted">{t.butlerReceivedHint}</p>
            <div className="chip" style={{ justifyContent: 'center', margin: '0 auto' }}>{job.id}</div>
            <p style={{ fontWeight: 700 }}>{job.need}</p>
            <p className="muted">{t.fromLabel} {job.pickup}</p>
            <p className="muted">{t.toLabel} {job.dropoff}</p>
            <p className="muted">{t.etaBaghdad}</p>
            <Link to="/" className="btn" style={{ marginTop: 8 }}>{t.backHome}</Link>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <TopBar title={t.butlerTitle} backTo="/" />
      <div className="page stack">
        <section className="card butler-hero">
          <div className="row" style={{ gap: 10, alignItems: 'flex-start' }}>
            <span className="butler-ico"><Bike size={26} /></span>
            <div>
              <h1 className="h1">{t.butlerHeroTitle}</h1>
              <p style={{ marginTop: 6, opacity: 0.95 }}>{t.butlerHeroBody}</p>
            </div>
          </div>
        </section>

        <form className="stack" onSubmit={submit}>
          <label className="stack" style={{ gap: 6 }}>
            <span className="h2">{t.butlerWhat}</span>
            <textarea
              className="input"
              rows={4}
              required
              placeholder={t.butlerWhatPh}
              value={need}
              onChange={(e) => setNeed(e.target.value)}
            />
          </label>

          <label className="stack" style={{ gap: 6 }}>
            <span className="h2">
              <MapPin size={16} style={{ verticalAlign: 'middle' }} /> {t.butlerPickup}
            </span>
            <input
              className="input"
              required
              placeholder={t.butlerPickupPh}
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
            />
          </label>

          <label className="stack" style={{ gap: 6 }}>
            <span className="h2">{t.butlerDeliverTo}</span>
            <input
              className="input"
              required
              value={dropoff}
              onChange={(e) => setDropoff(e.target.value)}
            />
            <span className="muted">{t.butlerDefaultAddr}</span>
          </label>

          <div className="stack" style={{ gap: 8 }}>
            <span className="h2">
              <Clock3 size={16} style={{ verticalAlign: 'middle' }} /> {t.butlerWhen}
            </span>
            {whenOptions.map((w) => (
              <button
                key={w.id}
                type="button"
                className={`radio${when === w.id ? ' on' : ''}`}
                onClick={() => setWhen(w.id)}
              >
                {w.label}
                <span className="muted">{when === w.id ? t.butlerSelected : ''}</span>
              </button>
            ))}
          </div>

          <p className="muted">
            <Package size={14} style={{ verticalAlign: 'middle' }} /> {t.butlerNote}
          </p>

          <button type="submit" className="btn" style={{ width: '100%' }}>
            {t.requestButler}
          </button>
        </form>
      </div>
    </>
  )
}
