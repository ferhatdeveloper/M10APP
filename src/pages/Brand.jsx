import { Link, useParams } from 'react-router'
import TopBar from '../components/TopBar.jsx'
import WebProductCard from '../components/WebProductCard.jsx'
import { useIsDesktop } from '../hooks/useIsDesktop.js'
import { useI18n } from '../context/I18nContext.web.jsx'
import {
  getProductsByBrand,
  normalizeBrandId,
  shopByBrandCards,
  brandBanners,
  stores,
  ui,
} from '../data/mock.web.js'

export default function Brand() {
  const { id } = useParams()
  const brandKey = normalizeBrandId(id)
  const isDesktop = useIsDesktop()
  const { lang } = useI18n()
  const t = ui[lang] || ui.ar

  const meta =
    shopByBrandCards.find((b) => normalizeBrandId(b.brand) === brandKey || normalizeBrandId(b.id) === brandKey) ||
    brandBanners.find((b) => normalizeBrandId(b.brand) === brandKey || normalizeBrandId(b.id) === brandKey)

  const products = getProductsByBrand(brandKey)
  const title = meta?.titles?.[lang] || meta?.titles?.en || meta?.name || id

  const body = (
    <div className={isDesktop ? 'metro-page' : 'page'}>
      <div
        className="brand-page-hero"
        style={{
          background: meta?.color || '#1565C0',
          borderRadius: 16,
          padding: 0,
          marginBottom: 24,
          color: '#fff',
          overflow: 'hidden',
          display: 'grid',
          gridTemplateColumns: meta?.banner || meta?.image ? (isDesktop ? '1.2fr 1fr' : '1fr') : '1fr',
          minHeight: isDesktop ? 200 : 160,
        }}
      >
        <div style={{ padding: isDesktop ? 32 : 24, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <p style={{ opacity: 0.85, fontSize: 13, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>
            {t.shopByBrand}
          </p>
          <h1 className="h1" style={{ fontSize: isDesktop ? 32 : 26, color: '#fff', margin: 0 }}>{title}</h1>
          <p style={{ opacity: 0.92, marginTop: 8, maxWidth: 420 }}>
            {meta?.subtitles?.[lang] || meta?.tagline?.[lang] || ''}
          </p>
          <p style={{ marginTop: 14, fontWeight: 800 }}>
            {products.length} {lang === 'tr' ? 'ürün' : lang === 'en' ? 'products' : 'منتج'}
          </p>
        </div>
        {(meta?.banner || meta?.image) && (
          <div style={{
            backgroundImage: `url(${meta.banner || meta.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: 160,
          }} />
        )}
      </div>

      {products.length > 0 ? (
        <div className="web-product-grid">
          {products.map((p) => (
            <WebProductCard key={p.id} product={p} storeId={stores[0]?.id} />
          ))}
        </div>
      ) : (
        <div className="empty" style={{ padding: 40 }}>
          <p className="h2">{lang === 'tr' ? 'Ürün bulunamadı' : 'No products'}</p>
          <Link to="/brands" className="btn" style={{ marginTop: 16 }}>{t.shopByBrand}</Link>
        </div>
      )}
    </div>
  )

  if (isDesktop) return body
  return (
    <>
      <TopBar title={title} backTo="/brands" />
      {body}
    </>
  )
}
