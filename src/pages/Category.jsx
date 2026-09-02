import { Link, Navigate, useParams } from 'react-router'
import { Store } from 'lucide-react'
import TopBar from '../components/TopBar.jsx'
import StoreCard from '../components/StoreCard.jsx'
import { categories, formatIQD, getProducts, stores } from '../data/mock.js'

const hasOffer = (storeId) => getProducts(storeId).some((p) => p.oldPrice)

export default function Category() {
  const { id } = useParams()
  const cat = categories.find((c) => c.id === id)

  if (id === 'butler') return <Navigate to="/butler" replace />

  const isOffers = id === 'offers'
  const title = cat?.name || 'التصنيف'

  const list = isOffers
    ? stores.filter((s) => hasOffer(s.id))
    : stores.filter((s) => s.category === id)

  const offerProducts = isOffers
    ? stores.flatMap((s) =>
        getProducts(s.id)
          .filter((p) => p.oldPrice)
          .map((p) => ({ ...p, storeId: s.id, storeName: s.name })),
      )
    : []

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
              <Store size={36} />
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
