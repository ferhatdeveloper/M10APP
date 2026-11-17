import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router'
import { Search as SearchIcon } from 'lucide-react'
import TopBar from '../components/TopBar.jsx'
import StoreCard from '../components/StoreCard.jsx'
import { useIsDesktop } from '../hooks/useIsDesktop.js'
import { categories, formatIQD, getProducts, stores, productName } from '../data/mock.js'

const catalog = stores.flatMap((store) =>
  getProducts(store.id).map((p) => ({
    ...p,
    storeId: store.id,
    storeName: store.name,
  })),
)

const includesQ = (text, q) => (text || '').toLowerCase().includes(q)

export default function Search() {
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)
  const isDesktop = useIsDesktop()

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const q = query.trim().toLowerCase()

  const { matchedStores, matchedProducts } = useMemo(() => {
    if (!q) return { matchedStores: [], matchedProducts: [] }

    const products = catalog.filter(
      (p) => includesQ(p.name, q) || includesQ(p.desc, q),
    )
    const productStoreIds = new Set(products.map((p) => p.storeId))

    const nextStores = stores.filter((s) => {
      if (productStoreIds.has(s.id)) return true
      if (includesQ(s.name, q) || includesQ(s.nameEn, q)) return true
      if (s.tags.some((t) => includesQ(t, q))) return true
      const cat = categories.find((c) => c.id === s.category)
      return cat ? includesQ(cat.name, q) || includesQ(cat.nameEn, q) : false
    })

    return { matchedStores: nextStores, matchedProducts: products }
  }, [q])

  const emptyQuery = !q
  const noHits = !emptyQuery && matchedStores.length === 0 && matchedProducts.length === 0

  const categoryLabels = {
    offers: 'العروض', meat: 'اللحوم', ready: 'دجاج', drinks: 'مشروبات',
    dairy: 'ألبان', produce: 'خضار وفواكه', bakery: 'مخبوزات', pantry: 'مؤن',
    snacks: 'وجبات خفيفة', frozen: 'مجمدات', household: 'تنظيف', home: 'المنزل',
    personal: 'عناية شخصية', coldcuts: 'لحوم باردة',
  }

  if (isDesktop) {
    return (
      <div className="desktop-search">
        <div className="desktop-search-header">
          <label className="desktop-search-box">
            <SearchIcon size={20} color="#7a7a7a" />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ابحث عن منتجات، متاجر..."
              autoComplete="off"
              enterKeyHint="search"
            />
          </label>
        </div>

        {emptyQuery ? (
          <>
            <div className="section-title">
              <h2 className="h2">تصنيفات</h2>
            </div>
            <div className="desktop-search-chips">
              {categories.filter((c) => c.id !== 'butler').map((c) => (
                <Link key={c.id} to={`/category/${c.id}`} className="chip">
                  {categoryLabels[c.id] || c.id}
                </Link>
              ))}
            </div>

            <div className="section-title" style={{ marginTop: 32 }}>
              <h2 className="h2">المتاجر الرائجة</h2>
              <span className="muted">{stores.filter(s => s.status !== 'closed').length} متجر</span>
            </div>
            <div className="stack">
              {stores.filter((s) => s.status !== 'closed').map((store) => (
                <StoreCard key={store.id} store={store} />
              ))}
            </div>
          </>
        ) : (
          <>
            {matchedProducts.length > 0 && (
              <section style={{ marginBottom: 32 }}>
                <div className="section-title">
                  <h2 className="h2">المنتجات</h2>
                  <span className="muted">{matchedProducts.length} نتيجة</span>
                </div>
                <div className="stack" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }}>
                  {matchedProducts.map((p) => (
                    <Link key={`${p.storeId}-${p.id}`} to={`/store/${p.storeId}`} className="product-row">
                      <div>
                        <div className="h2" style={{ fontSize: 14 }}>{productName(p, 'ar')}</div>
                        <p className="muted" style={{ fontSize: 12 }}>{p.storeName}</p>
                        <div className="row" style={{ marginTop: 6 }}>
                          <span className="price">{formatIQD(p.price)}</span>
                          {p.oldPrice && <span className="old-price">{formatIQD(p.oldPrice)}</span>}
                        </div>
                      </div>
                      <img src={p.image} alt={p.name} style={{ width: 70, height: 70, objectFit: 'cover', borderRadius: 10 }} />
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {matchedStores.length > 0 && (
              <section>
                <div className="section-title">
                  <h2 className="h2">المتاجر</h2>
                  <span className="muted">{matchedStores.length}</span>
                </div>
                <div className="stack">
                  {matchedStores.map((store) => (
                    <StoreCard key={store.id} store={store} />
                  ))}
                </div>
              </section>
            )}

            {noHits && (
              <div className="empty" style={{ padding: 60 }}>
                <div className="empty-icon">
                  <SearchIcon size={36} />
                </div>
                <p className="h2" style={{ marginTop: 12, color: 'var(--ink)' }}>
                  ماكو نتائج لهالبحث
                </p>
                <p className="muted" style={{ marginTop: 6 }}>
                  جرّب كلمة ثانية مثل وايلد تايجر، كنافة أو شاورما
                </p>
              </div>
            )}
          </>
        )}
      </div>
    )
  }

  return (
    <div>
      <TopBar title="بحث" backTo="/" />
      <div className="page" style={{ paddingTop: 4 }}>
        <label className="search-box">
          <SearchIcon size={18} color="#7a7a7a" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="مطعم، متجر، شاورما، وايلد تايجر…"
            aria-label="بحث"
            autoComplete="off"
            enterKeyHint="search"
          />
        </label>

        {emptyQuery ? (
          <>
            <div className="section-title">
              <h2 className="h2">تصنيفات</h2>
            </div>
            <div className="row" style={{ flexWrap: 'wrap', gap: 8 }}>
              {categories
                .filter((c) => c.id !== 'butler')
                .map((c) => (
                  <Link key={c.id} to={`/category/${c.id}`} className="chip">
                    {c.icon} {c.name}
                  </Link>
                ))}
              <Link to="/butler" className="chip">
                🛵 بتلر
              </Link>
            </div>

            <div className="section-title">
              <h2 className="h2">المتاجر الرائجة</h2>
              <span className="muted">بغداد</span>
            </div>
            <div className="stack">
              {stores
                .filter((s) => s.status !== 'closed')
                .map((store) => (
                  <StoreCard key={store.id} store={store} />
                ))}
            </div>
          </>
        ) : null}

        {!emptyQuery && matchedStores.length > 0 ? (
          <>
            <div className="section-title">
              <h2 className="h2">المتاجر</h2>
              <span className="muted">{matchedStores.length}</span>
            </div>
            <div className="stack">
              {matchedStores.map((store) => (
                <StoreCard key={store.id} store={store} />
              ))}
            </div>
          </>
        ) : null}

        {!emptyQuery && matchedProducts.length > 0 ? (
          <>
            <div className="section-title">
              <h2 className="h2">المنتجات</h2>
              <span className="muted">{matchedProducts.length}</span>
            </div>
            <div className="stack">
              {matchedProducts.map((p) => (
                <Link key={`${p.storeId}-${p.id}`} to={`/store/${p.storeId}`} className="product-row">
                  <div>
                    <div className="h2">{p.name}</div>
                    <p className="muted">
                      {p.storeName}
                      {p.desc ? ` · ${p.desc}` : ''}
                    </p>
                    <div className="row" style={{ marginTop: 6 }}>
                      <span className="price">{formatIQD(p.price)}</span>
                      {p.oldPrice ? <span className="old-price">{formatIQD(p.oldPrice)}</span> : null}
                    </div>
                  </div>
                  <img src={p.image} alt={p.name} />
                </Link>
              ))}
            </div>
          </>
        ) : null}

        {noHits ? (
          <div className="empty">
            <div className="empty-icon">
              <SearchIcon size={36} />
            </div>
            <p className="h2" style={{ marginTop: 12, color: 'var(--ink)' }}>
              ماكو نتائج لهالبحث
            </p>
            <p className="muted" style={{ marginTop: 6 }}>
              جرّب كلمة ثانية مثل وايلد تايجر، كنافة أو شاورما
            </p>
          </div>
        ) : null}
      </div>
    </div>
  )
}
