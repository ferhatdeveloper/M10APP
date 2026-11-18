import { Link } from 'react-router'
import { Heart } from 'lucide-react'
import TopBar from '../components/TopBar.jsx'
import StoreCard from '../components/StoreCard.jsx'
import { useApp } from '../context/AppContext.web.jsx'
import { useI18n } from '../context/I18nContext.web.jsx'
import { useIsDesktop } from '../hooks/useIsDesktop.js'
import { getStore, tUI } from '../data/mock.web.js'

export default function Favorites() {
  const { favorites } = useApp()
  const { lang } = useI18n()
  const t = tUI(lang)
  const isDesktop = useIsDesktop()
  const list = favorites.map((id) => getStore(id)).filter(Boolean)

  const empty = (
    <div className="empty" style={isDesktop ? { padding: 60 } : undefined}>
      <div className="empty-icon">
        <Heart size={36} />
      </div>
      <p className="h2" style={{ color: 'var(--ink)', marginTop: 12 }}>{t.noFavorites}</p>
      <p className="muted" style={{ margin: '8px 0 18px' }}>{t.noFavoritesHint}</p>
      <Link to="/" className="btn">{t.browseStores}</Link>
    </div>
  )

  if (isDesktop) {
    return (
      <div className="desktop-page-card metro-page">
        <h1 className="h1" style={{ fontSize: 24, marginBottom: 24 }}>{t.favorites}</h1>
        {list.length === 0 ? empty : (
          <div className="stack">
            {list.map((store) => <StoreCard key={store.id} store={store} />)}
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      <TopBar title={t.favorites} backTo="/profile" />
      <div className="page stack">
        {list.length === 0 ? empty : list.map((store) => <StoreCard key={store.id} store={store} />)}
      </div>
    </>
  )
}
