import { Link } from 'react-router'
import {
  ChevronLeft,
  ChevronRight,
  Gift,
  Headphones,
  Heart,
  Languages,
  LogOut,
  MapPin,
  Receipt,
  Sparkles,
} from 'lucide-react'
import TopBar from '../components/TopBar.jsx'
import Logo from '../components/Logo.web.jsx'
import { useApp } from '../context/AppContext.web.jsx'
import { useI18n } from '../context/I18nContext.web.jsx'
import { useIsDesktop } from '../hooks/useIsDesktop.js'
import { formatIQD, tUI, userDisplayName } from '../data/mock.web.js'

const LANG_LABEL = { ar: 'العربية', tr: 'Türkçe', en: 'English' }

export default function Profile() {
  const { user } = useApp()
  const { lang, isRTL } = useI18n()
  const t = tUI(lang)
  const isDesktop = useIsDesktop()
  const Chevron = isRTL ? ChevronLeft : ChevronRight
  const displayName = userDisplayName(user, lang)

  const links = [
    { to: '/orders', icon: Receipt, label: t.orders, hint: t.profileOrdersHint },
    { to: '/favorites', icon: Heart, label: t.favorites, hint: t.profileFavHint },
    { to: '/addresses', icon: MapPin, label: t.addresses, hint: t.profileAddrHint },
    { to: '/rewards', icon: Gift, label: t.rewards, hint: t.profileRewardsHint },
    { to: '/butler', icon: Sparkles, label: t.butler, hint: t.profileButlerHint },
  ]

  const menu = (
    <>
      {links.map((item) => {
        const Icon = item.icon
        return (
          <Link key={item.to} to={item.to} className="menu-link">
            <span className="menu-ico"><Icon size={18} /></span>
            <span style={{ flex: 1 }}>
              <span style={{ fontWeight: 800, display: 'block' }}>{item.label}</span>
              <span className="muted">{item.hint}</span>
            </span>
            <Chevron size={18} color="#bbb" />
          </Link>
        )
      })}
      <a href="mailto:support@m10.iq" className="menu-link">
        <span className="menu-ico"><Headphones size={18} /></span>
        <span style={{ flex: 1 }}>
          <span style={{ fontWeight: 800, display: 'block' }}>{t.support}</span>
          <span className="muted">support@m10.iq</span>
        </span>
        <Chevron size={18} color="#bbb" />
      </a>
    </>
  )

  if (isDesktop) {
    return (
      <div className="desktop-profile metro-page">
        <div className="desktop-profile-layout">
          <div className="desktop-profile-sidebar">
            <div className="card" style={{ padding: 24 }}>
              <div style={{ textAlign: 'center' }}>
                <Logo size={80} />
                <h1 className="h1" style={{ marginTop: 16, fontSize: 22 }}>{displayName}</h1>
                <p className="muted">{user.phone}</p>
                <div className="row" style={{ justifyContent: 'center', marginTop: 12, gap: 8 }}>
                  <span className="gold-chip">{user.tier} tier</span>
                  <span className="chip">{user.points.toLocaleString(lang === 'tr' ? 'tr-TR' : lang === 'en' ? 'en-US' : 'ar-IQ')} {t.points}</span>
                </div>
              </div>
              <Link to="/rewards" className="btn btn-yellow full" style={{ marginTop: 20 }}>
                {t.redeemPoints}
              </Link>
            </div>
          </div>

          <div className="desktop-profile-main">
            <h2 className="h2" style={{ marginBottom: 16 }}>{t.settings}</h2>
            <div className="card" style={{ overflow: 'hidden' }}>{menu}</div>

            <div className="card menu-link" style={{ borderRadius: 16, marginTop: 16 }}>
              <span className="menu-ico"><Languages size={18} /></span>
              <span style={{ flex: 1 }}>
                <span style={{ fontWeight: 800, display: 'block' }}>{t.language}</span>
                <span className="muted">{LANG_LABEL[lang] || lang}</span>
              </span>
            </div>

            <button
              type="button"
              className="btn btn-ghost logout-btn"
              style={{ marginTop: 24 }}
              onClick={() => alert(t.logoutDemo)}
            >
              <LogOut size={18} />
              {t.logout}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <TopBar title={t.myAccount} />
      <div className="page stack">
        <section className="card profile-hero">
          <div className="row" style={{ gap: 14 }}>
            <Logo size={64} />
            <div style={{ flex: 1 }}>
              <div className="h1">{displayName}</div>
              <div className="muted" style={{ marginTop: 2 }}>{user.phone}</div>
              <div className="row" style={{ marginTop: 8, gap: 8 }}>
                <span className="gold-chip">{user.tier} tier</span>
                <span className="chip">{user.points.toLocaleString(lang === 'tr' ? 'tr-TR' : 'en-US')} {t.points}</span>
              </div>
            </div>
          </div>
          <Link to="/rewards" className="btn-yellow" style={{ marginTop: 14, width: '100%' }}>
            {t.redeemPoints}
          </Link>
        </section>

        <nav className="card stack" style={{ gap: 0, overflow: 'hidden' }}>{menu}</nav>

        <div className="card menu-link" style={{ borderRadius: 16 }}>
          <span className="menu-ico"><Languages size={18} /></span>
          <span style={{ flex: 1 }}>
            <span style={{ fontWeight: 800, display: 'block' }}>{t.language}</span>
            <span className="muted">{LANG_LABEL[lang] || lang}</span>
          </span>
        </div>

        <p className="muted" style={{ textAlign: 'center' }}>
          {t.minOrder}: {formatIQD(8000, lang)}
        </p>

        <button type="button" className="btn-ghost logout-btn" onClick={() => alert(t.logoutDemo)}>
          <LogOut size={18} />
          {t.logout}
        </button>
      </div>
    </>
  )
}
