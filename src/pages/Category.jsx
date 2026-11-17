import { Link, Navigate, useParams } from 'react-router'
import { Store as StoreIcon } from 'lucide-react'
import { useState, useEffect } from 'react'
import TopBar from '../components/TopBar.jsx'
import StoreCard from '../components/StoreCard.jsx'
import { categories, formatIQD, getProducts, stores, productName } from '../data/mock.js'

const DESKTOP_BP = 900

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== 'undefined' && window.innerWidth >= DESKTOP_BP
  )

  useEffect(() => {
    if (typeof window === 'undefined') return
    const handleResize = () => setIsDesktop(window.innerWidth >= DESKTOP_BP)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return isDesktop
}

const hasOffer = (storeId) => getProducts(storeId).some((p) => p.oldPrice)

const categoryLabels = {
  offers: 'العروض',
  meat: 'اللحوم',
  ready: 'دجاج',
  drinks: 'مشروبات',
  dairy: 'ألبان',
  produce: 'خضار وفواكه',
  bakery: 'مخبوزات',
  pantry: 'مؤن',
  snacks: 'وجبات خفيفة',
  frozen: 'مجمدات',
  household: 'تنظيف',
  home: 'المنزل',
  personal: 'عناية شخصية',
  coldcuts: 'لحوم باردة',
}

export default function Category() {
  const { id } = useParams()
  const isDesktop = useIsDesktop()
  const cat = categories.find((c) => c.id === id)

  if (id === 'butler') return <Navigate to="/butler" replace />

  const isOffers = id === 'offers'
  const title = categoryLabels[id] || cat?.nameAr || cat?.name || 'التصنيف'

  const list = isOffers
    ? stores.filter((s) => hasOffer(s.id))
    : stores.filter((s) => s.category === id)

  const categoryProducts = !isOffers
    ? stores
        .filter(s => !s.comingSoon)
        .flatMap((s) =>
          getProducts(s.id)
            .filter((p) => p.aisle === id)
            .map((p) => ({ ...p, storeId: s.id, storeName: s.name }))
        )
        .slice(0, 24)
    : []

  const offerProducts = isOffers
    ? stores.flatMap((s) =>
        getProducts(s.id)
          .filter((p) => p.oldPrice)
          .map((p) => ({ ...p, storeId: s.id, storeName: s.name })),
      )
    : []

  const productsToShow = isOffers ? offerProducts : categoryProducts

  if (isDesktop) {
    return (
      <div className="desktop-category">
        <div className="desktop-category-header">
          <h1 className="h1" style={{ fontSize: 24, marginBottom: 8 }}>{title}</h1>
          <p className="muted">
            {isOffers
              ? `${offerProducts.length} منتج بأسعار مخفّضة`
              : categoryProducts.length > 0
                ? `${categoryProducts.length} منتج متوفر`
                : `${list.length} متجر في هذا التصنيف`}
          </p>
        </div>

        {productsToShow.length > 0 && (
          <section style={{ marginBottom: 32 }}>
            <div className="section-title">
              <h2 className="h2">{isOffers ? 'العروض' : 'المنتجات'}</h2>
              <span className="muted">{productsToShow.length} منتج</span>
            </div>
            <div 
              className="stack" 
              style={{ 
                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                gap: 16 
              }}
            >
              {productsToShow.map((p, i) => (
                <Link 
                  key={`${p.storeId}-${p.id}-${i}`} 
                  to={`/store/${p.storeId}`} 
                  className="product-row"
                  style={{ padding: 14, alignItems: 'center' }}
                >
                  <div style={{ flex: 1 }}>
                    {p.oldPrice && <span className="chip" style={{ marginBottom: 6 }}>عرض</span>}
                    <div className="h2" style={{ fontSize: 14, lineHeight: 1.3 }}>
                      {productName(p, 'ar')}
                    </div>
                    <p className="muted" style={{ fontSize: 12, marginTop: 4 }}>
                      {p.storeName}
                      {p.desc ? ` · ${p.desc}` : ''}
                    </p>
                    <div className="row" style={{ marginTop: 8 }}>
                      <span className="price" style={{ fontSize: 15 }}>{formatIQD(p.price)}</span>
                      {p.oldPrice && (
                        <span className="old-price">{formatIQD(p.oldPrice)}</span>
                      )}
                    </div>
                  </div>
                  <img 
                    src={p.image} 
                    alt={p.name} 
                    style={{ 
                      width: 80, 
                      height: 80, 
                      objectFit: 'cover', 
                      borderRadius: 12,
                      flexShrink: 0 
                    }} 
                  />
                </Link>
              ))}
            </div>
          </section>
        )}

        {list.length === 0 && productsToShow.length === 0 ? (
          <div className="empty" style={{ padding: 60 }}>
            <div className="empty-icon">
              <StoreIcon size={36} />
            </div>
            <p className="h2" style={{ color: 'var(--ink)', marginTop: 12 }}>
              ماكو منتجات بهالتصنيف حالياً
            </p>
            <p className="muted" style={{ margin: '8px 0 18px' }}>
              جرّب تصنيف آخر
            </p>
            <Link to="/" className="btn">
              الرئيسية
            </Link>
          </div>
        ) : list.length > 0 && (
          <section>
            <div className="section-title">
              <h2 className="h2">المتاجر</h2>
              <span className="muted">{list.length} متجر</span>
            </div>
            <div className="stack">
              {list.map((store) => (
                <StoreCard key={store.id} store={store} />
              ))}
            </div>
          </section>
        )}
      </div>
    )
  }

  return (
    <div>
      <TopBar title={title} backTo="/" />
      <div className="page" style={{ paddingTop: 4 }}>
        {list.length > 0 || (isOffers && offerProducts.length > 0) ? (
          <p className="muted" style={{ marginBottom: 4 }}>
            {isOffers
              ? 'أسعار مخفّضة اليوم بالدينار العراقي'
              : `${list.length} متجر في ${title} — توصيل لبغداد`}
          </p>
        ) : null}

        {isOffers && offerProducts.length > 0 ? (
          <>
            <div className="section-title">
              <h2 className="h2">العروض</h2>
              <span className="muted">{offerProducts.length} منتج</span>
            </div>
            <div className="stack">
              {offerProducts.map((p) => (
                <Link key={`${p.storeId}-${p.id}`} to={`/store/${p.storeId}`} className="product-row">
                  <div>
                    <div className="h2">{p.name}</div>
                    <p className="muted">
                      {p.storeName}
                      {p.desc ? ` · ${p.desc}` : ''}
                    </p>
                    <div className="row" style={{ marginTop: 6 }}>
                      <span className="price">{formatIQD(p.price)}</span>
                      <span className="old-price">{formatIQD(p.oldPrice)}</span>
                    </div>
                  </div>
                  <img src={p.image} alt={p.name} />
                </Link>
              ))}
            </div>
          </>
        ) : null}

        {list.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">
              <StoreIcon size={36} />
            </div>
            <p className="h2" style={{ color: 'var(--ink)', marginTop: 12 }}>
              ماكو متاجر بهالتصنيف حالياً
            </p>
            <p className="muted" style={{ margin: '8px 0 18px' }}>
              ارجع للرئيسية وجرّب تصنيف ثاني
            </p>
            <Link to="/" className="btn">
              الرئيسية
            </Link>
          </div>
        ) : (
          <>
            <div className="section-title">
              <h2 className="h2">{isOffers ? 'المتاجر' : title}</h2>
              <span className="muted">{list.length}</span>
            </div>
            <div className="stack">
              {list.map((store) => (
                <StoreCard key={store.id} store={store} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
