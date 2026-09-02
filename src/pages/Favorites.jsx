import { Link } from 'react-router'
import { Heart } from 'lucide-react'
import TopBar from '../components/TopBar.jsx'
import StoreCard from '../components/StoreCard.jsx'
import { useApp } from '../context/AppContext.jsx'
import { getStore } from '../data/mock.js'

export default function Favorites() {
  const { favorites } = useApp()
  const list = favorites.map((id) => getStore(id)).filter(Boolean)

  return (
    <>
      <TopBar title="المفضلة" backTo="/profile" />
      <div className="page stack">
        {list.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">
              <Heart size={36} />
            </div>
            <p className="h2" style={{ color: 'var(--ink)', marginTop: 12 }}>
              لا توجد متاجر مفضلة
            </p>
            <p className="muted" style={{ margin: '8px 0 18px' }}>
              اضغط النجمة على بطاقة المتجر لحفظه هنا والطلب أسرع في المرة القادمة.
            </p>
            <Link to="/" className="btn">
              تصفح المتاجر
            </Link>
          </div>
        ) : (
          list.map((store) => <StoreCard key={store.id} store={store} />)
        )}
      </div>
    </>
  )
}
