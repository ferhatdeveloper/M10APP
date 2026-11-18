import { useState } from 'react'
import { Check, Gift, Sparkles } from 'lucide-react'
import TopBar from '../components/TopBar.jsx'
import { useApp } from '../context/AppContext.web.jsx'
import { useI18n } from '../context/I18nContext.web.jsx'
import { useIsDesktop } from '../hooks/useIsDesktop.js'
import { rewards, formatIQD, tUI } from '../data/mock.web.js'

export default function Rewards() {
  const { user, redeemReward } = useApp()
  const { lang } = useI18n()
  const t = tUI(lang)
  const isDesktop = useIsDesktop()
  const [pending, setPending] = useState(null)
  const [done, setDone] = useState(null)
  const loc = lang === 'tr' ? 'tr-TR' : lang === 'en' ? 'en-US' : 'ar-IQ'

  const confirm = () => {
    if (!pending) return
    if (user.points < pending.cost) return
    redeemReward(pending)
    setDone(pending)
    setPending(null)
  }

  const rewardTitle = (r) => r.titles?.[lang] || r.title
  const rewardDesc = (r) => r.descs?.[lang] || r.desc

  const renderRewardCard = (r) => {
    const enough = user.points >= r.cost
    const selected = pending?.id === r.id
    return (
      <article key={r.id} className={`card card-body reward-card${selected ? ' on' : ''}`}>
        <div className="between" style={{ alignItems: 'flex-start' }}>
          <div className="row" style={{ gap: 10, alignItems: 'flex-start' }}>
            <span className="menu-ico"><Gift size={18} /></span>
            <div>
              <div className="h2">{rewardTitle(r)}</div>
              <p className="muted">{rewardDesc(r)}</p>
              <div className="chip" style={{ marginTop: 8 }}>
                <Sparkles size={12} />
                {r.cost.toLocaleString(loc)} {t.points}
              </div>
            </div>
          </div>
        </div>
        {selected ? (
          <div className="row" style={{ marginTop: 12 }}>
            <button type="button" className="btn" style={{ flex: 1 }} onClick={confirm}>{t.confirmRedeem}</button>
            <button type="button" className="btn-ghost" onClick={() => setPending(null)}>{t.cancel}</button>
          </div>
        ) : (
          <button type="button" className="btn" style={{ width: '100%', marginTop: 12 }} disabled={!enough} onClick={() => setPending(r)}>
            {enough ? t.redeem : t.notEnoughPoints}
          </button>
        )}
      </article>
    )
  }

  const doneBanner = done && (
    <div className="card card-body row" style={{ gap: 10, background: '#e8f8ee', marginBottom: isDesktop ? 16 : undefined }}>
      <Check size={20} color="#12803c" />
      <div>
        <div style={{ fontWeight: 800, color: '#12803c' }}>{t.redeemed}</div>
        <div className="muted">{rewardTitle(done)} — {t.redeemAppearNext}</div>
      </div>
    </div>
  )

  const pointHint = t.pointEach.replace('{amount}', formatIQD(1000, lang))

  if (isDesktop) {
    return (
      <div className="desktop-rewards metro-page">
        <div className="desktop-rewards-layout">
          <div className="desktop-rewards-sidebar">
            <div className="card rewards-hero" style={{ padding: 24 }}>
              <div className="muted">{t.yourBalance}</div>
              <div className="h1" style={{ fontSize: 36, margin: '8px 0' }}>
                {user.points.toLocaleString(loc)}
                <span style={{ fontSize: 18, marginInlineStart: 8 }}>{t.points}</span>
              </div>
              <div className="row" style={{ marginTop: 8 }}>
                <span className="gold-chip">{user.tier}</span>
              </div>
              <p className="muted" style={{ marginTop: 12 }}>{pointHint}</p>
            </div>
          </div>
          <div className="desktop-rewards-main">
            {doneBanner}
            <h2 className="h2" style={{ marginBottom: 16 }}>{t.availableOffers}</h2>
            <div className="stack" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
              {rewards.map(renderRewardCard)}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <TopBar title={t.rewards} backTo="/profile" />
      <div className="page stack">
        <section className="card rewards-hero">
          <div className="muted">{t.yourBalance}</div>
          <div className="h1" style={{ fontSize: 32, margin: '4px 0' }}>
            {user.points.toLocaleString(loc)}
            <span style={{ fontSize: 16, marginInlineStart: 8 }}>{t.points}</span>
          </div>
          <div className="row" style={{ marginTop: 6 }}>
            <span className="gold-chip">{user.tier}</span>
            <span className="muted">{pointHint}</span>
          </div>
        </section>
        {doneBanner}
        <div className="section-title" style={{ marginTop: 4 }}>
          <span className="h2">{t.availableOffers}</span>
        </div>
        {rewards.map(renderRewardCard)}
      </div>
    </>
  )
}
