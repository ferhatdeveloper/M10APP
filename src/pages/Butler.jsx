import { useState } from 'react'
import { Link } from 'react-router'
import { Bike, CheckCircle2, Clock3, MapPin, Package } from 'lucide-react'
import TopBar from '../components/TopBar.jsx'
import { useApp } from '../context/AppContext.jsx'

const WHEN = [
  { id: 'now', label: 'الآن' },
  { id: 'hour', label: 'خلال ساعة' },
  { id: 'evening', label: 'اليوم مساءً' },
]

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
  const dropDefault = `${user.address.area}، ${user.address.details}`
  const [need, setNeed] = useState('')
  const [pickup, setPickup] = useState('')
  const [dropoff, setDropoff] = useState(dropDefault)
  const [when, setWhen] = useState('now')
  const [job, setJob] = useState(null)

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
        <TopBar title="بتلر" backTo="/" />
        <div className="page">
          <div className="card card-body stack" style={{ textAlign: 'center', padding: 28 }}>
            <div className="success-check">
              <CheckCircle2 size={40} />
            </div>
            <h1 className="h1">تم استلام طلب البتلر</h1>
            <p className="muted">
              كابتن دراجة سيشتري أو يلتقط ما طلبت إن كان يناسب المقعد والصندوق.
            </p>
            <div className="chip" style={{ justifyContent: 'center', margin: '0 auto' }}>
              {job.id}
            </div>
            <p style={{ fontWeight: 700 }}>{job.need}</p>
            <p className="muted">من {job.pickup}</p>
            <p className="muted">إلى {job.dropoff}</p>
            <p className="muted">الوصول المتوقع 25–40 دقيقة داخل بغداد</p>
            <Link to="/" className="btn" style={{ marginTop: 8 }}>
              العودة للرئيسية
            </Link>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <TopBar title="بتلر" backTo="/" />
      <div className="page stack">
        <section className="card butler-hero">
          <div className="row" style={{ gap: 10, alignItems: 'flex-start' }}>
            <span className="butler-ico">
              <Bike size={26} />
            </span>
            <div>
              <h1 className="h1">بتلر M10</h1>
              <p style={{ marginTop: 6, opacity: 0.95 }}>
                نلتقط أو نشتري أي شيء يناسب دراجة نارية: أغراض صغيرة، وثائق، ورد،
                أدوية من الصيدلية، أو طلب من محل غير مدرج في التطبيق.
              </p>
            </div>
          </div>
        </section>

        <form className="stack" onSubmit={submit}>
          <label className="stack" style={{ gap: 6 }}>
            <span className="h2">ماذا تريد؟</span>
            <textarea
              className="input"
              rows={4}
              required
              placeholder="مثال: علبة مناديل وورد من الكرادة، أو استلام ظرف من المنصور"
              value={need}
              onChange={(e) => setNeed(e.target.value)}
            />
          </label>

          <label className="stack" style={{ gap: 6 }}>
            <span className="h2">
              <MapPin size={16} style={{ verticalAlign: 'middle' }} /> موقع الاستلام / الشراء
            </span>
            <input
              className="input"
              required
              placeholder="اسم المحل أو المنطقة"
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
            />
          </label>

          <label className="stack" style={{ gap: 6 }}>
            <span className="h2">التوصيل إلى</span>
            <input
              className="input"
              required
              value={dropoff}
              onChange={(e) => setDropoff(e.target.value)}
            />
            <span className="muted">الافتراضي: عنوانك الحالي</span>
          </label>

          <div className="stack" style={{ gap: 8 }}>
            <span className="h2">
              <Clock3 size={16} style={{ verticalAlign: 'middle' }} /> متى؟
            </span>
            {WHEN.map((w) => (
              <button
                key={w.id}
                type="button"
                className={`radio${when === w.id ? ' on' : ''}`}
                onClick={() => setWhen(w.id)}
              >
                {w.label}
                <span className="muted">{when === w.id ? 'محدد' : ''}</span>
              </button>
            ))}
          </div>

          <p className="muted">
            <Package size={14} style={{ verticalAlign: 'middle' }} /> الحجم والوزن يجب أن يحملا
            بأمان على الدراجة. الدفع نقداً أو عبر الكابتن حسب الفاتورة.
          </p>

          <button type="submit" className="btn" style={{ width: '100%' }}>
            اطلب بتلر
          </button>
        </form>
      </div>
    </>
  )
}
