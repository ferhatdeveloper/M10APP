import { Link } from 'react-router'
import TopBar from '../components/TopBar.jsx'
import { useIsDesktop } from '../hooks/useIsDesktop.js'
import { useI18n } from '../context/I18nContext.web.jsx'
import { shopByBrandCards, ui } from '../data/mock.web.js'

export default function Brands() {
  const isDesktop = useIsDesktop()
  const { lang } = useI18n()
  const t = ui[lang] || ui.ar

  const content = (
    <div className={isDesktop ? 'metro-page' : 'page'}>
      <h1 className="h1" style={{ fontSize: isDesktop ? 24 : 20, marginBottom: 20 }}>
        {t.shopByBrand}
      </h1>
      <div className="web-product-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }}>
        {shopByBrandCards.map((b) => (
          <Link
            key={b.id}
            to={`/brand/${b.brand || b.id}`}
            className="brand-banner-card"
            style={{ background: b.color, minHeight: 140, textDecoration: 'none' }}
          >
            {b.image && (
              <div className="brand-banner-img">
                <img src={b.image} alt={b.titles?.[lang] || b.id} />
              </div>
            )}
            <div className="brand-banner-content">
              <h3>{b.titles?.[lang] || b.titles?.en || b.id}</h3>
              <p>{b.subtitles?.[lang] || b.subtitles?.en || ''}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )

  if (isDesktop) return content
  return (
    <>
      <TopBar title={t.shopByBrand} backTo="/" />
      {content}
    </>
  )
}
