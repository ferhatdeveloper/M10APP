import { Link } from 'react-router'
import {
  ChevronLeft,
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
import Logo from '../components/Logo.jsx'
import { useApp } from '../context/AppContext.jsx'
import { formatIQD } from '../data/mock.js'

const LINKS = [
  { to: '/orders', icon: Receipt, label: 'الطلبات', hint: 'تتبع وإعادة الطلب' },
  { to: '/favorites', icon: Heart, label: 'المفضلة', hint: 'متاجرك المحفوظة' },
  { to: '/addresses', icon: MapPin, label: 'العناوين', hint: 'منازل بغداد' },
  { to: '/rewards', icon: Gift, label: 'المكافآت', hint: 'M10 Rewards' },
  { to: '/butler', icon: Sparkles, label: 'بتلر', hint: 'نشتري أي شيء يناسب الدراجة' },
]

export default function Profile() {
  const { user } = useApp()

  return (
    <>
      <TopBar title="حسابي" />
      <div className="page stack">
        <section className="card profile-hero">
          <div className="row" style={{ gap: 14 }}>
            <Logo size={64} />
            <div style={{ flex: 1 }}>
              <div className="h1">{user.name}</div>
              <div className="muted" style={{ marginTop: 2 }}>
                {user.phone}
              </div>
              <div className="row" style={{ marginTop: 8, gap: 8 }}>
                <span className="gold-chip">{user.tier} tier</span>
                <span className="chip">{user.points.toLocaleString('ar-IQ')} نقطة</span>
              </div>
            </div>
          </div>
          <Link to="/rewards" className="btn-yellow" style={{ marginTop: 14, width: '100%' }}>
            استبدل نقاطك · الجودة والسعر 10/10
          </Link>
        </section>

        <nav className="card stack" style={{ gap: 0, overflow: 'hidden' }}>
          {LINKS.map((item) => {
            const Icon = item.icon
            return (
              <Link key={item.to} to={item.to} className="menu-link">
                <span className="menu-ico">
                  <Icon size={18} />
                </span>
                <span style={{ flex: 1 }}>
                  <span style={{ fontWeight: 800, display: 'block' }}>{item.label}</span>
                  <span className="muted">{item.hint}</span>
                </span>
                <ChevronLeft size={18} color="#bbb" />
              </Link>
            )
          })}
          <a href="mailto:support@m10.iq" className="menu-link">
            <span className="menu-ico">
              <Headphones size={18} />
            </span>
            <span style={{ flex: 1 }}>
              <span style={{ fontWeight: 800, display: 'block' }}>الدعم</span>
              <span className="muted">راسلنا على support@m10.iq</span>
            </span>
            <ChevronLeft size={18} color="#bbb" />
          </a>
        </nav>

        <div className="card menu-link" style={{ borderRadius: 16 }}>
          <span className="menu-ico">
            <Languages size={18} />
          </span>
          <span style={{ flex: 1 }}>
            <span style={{ fontWeight: 800, display: 'block' }}>اللغة</span>
            <span className="muted">العربية</span>
          </span>
        </div>

        <p className="muted" style={{ textAlign: 'center' }}>
          التوصيل في بغداد · الحد الأدنى يظهر لكل متجر
          <br />
          متوسط السلة من {formatIQD(8000)}
        </p>

        <button
          type="button"
          className="btn-ghost logout-btn"
          onClick={() => alert('تسجيل الخروج غير متاح في النسخة التجريبية.')}
        >
          <LogOut size={18} />
          تسجيل الخروج
        </button>
      </div>
    </>
  )
}
