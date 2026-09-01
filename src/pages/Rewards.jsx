import { useState } from 'react'
import { Check, Gift, Sparkles } from 'lucide-react'
import TopBar from '../components/TopBar.jsx'
import { useApp } from '../context/AppContext.jsx'
import { rewards, formatIQD } from '../data/mock.js'

export default function Rewards() {
  const { user, redeemReward } = useApp()
  const [pending, setPending] = useState(null)
  const [done, setDone] = useState(null)

  const confirm = () => {
    if (!pending) return
    if (user.points < pending.cost) return
    redeemReward(pending)
    setDone(pending)
    setPending(null)
  }

  return (
    <>
      <TopBar title="المكافآت" backTo="/profile" />
      <div className="page stack">
        <section className="card rewards-hero">
          <div className="muted">رصيدك</div>
          <div className="h1" style={{ fontSize: 32, margin: '4px 0' }}>
            {user.points.toLocaleString('ar-IQ')}
            <span style={{ fontSize: 16, marginRight: 8 }}>نقطة</span>
          </div>
          <div className="row" style={{ marginTop: 6 }}>
            <span className="gold-chip">{user.tier}</span>
            <span className="muted">كل {formatIQD(1000)} ≈ نقطة واحدة</span>
          </div>
        </section>

        {done ? (
          <div className="card card-body row" style={{ gap: 10, background: '#e8f8ee' }}>
            <Check size={20} color="#12803c" />
            <div>
              <div style={{ fontWeight: 800, color: '#12803c' }}>تم الاستبدال</div>
              <div className="muted">{done.title} — سيظهر في طلبك القادم</div>
            </div>
          </div>
        ) : null}

        <div className="section-title" style={{ marginTop: 4 }}>
          <span className="h2">العروض المتاحة</span>
        </div>

        {rewards.map((r) => {
          const enough = user.points >= r.cost
          const selected = pending?.id === r.id
          return (
            <article key={r.id} className={`card card-body reward-card${selected ? ' on' : ''}`}>
              <div className="between" style={{ alignItems: 'flex-start' }}>
                <div className="row" style={{ gap: 10, alignItems: 'flex-start' }}>
                  <span className="menu-ico">
                    <Gift size={18} />
                  </span>
                  <div>
                    <div className="h2">{r.title}</div>
                    <p className="muted">{r.desc}</p>
                    <div className="chip" style={{ marginTop: 8 }}>
                      <Sparkles size={12} />
                      {r.cost.toLocaleString('ar-IQ')} نقطة
                    </div>
                  </div>
                </div>
              </div>
              {selected ? (
                <div className="row" style={{ marginTop: 12 }}>
                  <button type="button" className="btn" style={{ flex: 1 }} onClick={confirm}>
                    تأكيد الاستبدال
                  </button>
                  <button type="button" className="btn-ghost" onClick={() => setPending(null)}>
                    إلغاء
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className="btn"
                  style={{ width: '100%', marginTop: 12 }}
                  disabled={!enough}
                  onClick={() => setPending(r)}
                >
                  {enough ? 'استبدل' : 'نقاط غير كافية'}
                </button>
              )}
            </article>
          )
        })}
      </div>
    </>
  )
}
