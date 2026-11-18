import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { Search as SearchIcon } from 'lucide-react'
import TopBar from '../components/TopBar.jsx'
import StoreCard from '../components/StoreCard.jsx'
import WebProductCard from '../components/WebProductCard.jsx'
import { useIsDesktop } from '../hooks/useIsDesktop.js'
import { useI18n } from '../context/I18nContext.web.jsx'
import {
  categories,
  formatIQD,
  getProducts,
  getCategoryName,
  stores,
  productName,
  ui,
} from '../data/mock.web.js'

const catalog = getProducts().map((p) => ({
  ...p,
  storeId: stores[0]?.id,
  storeName: stores[0]?.name,
}))

const includesQ = (text, q) => (text || '').toLowerCase().includes(q)

export default function Search() {
  const [searchParams] = useSearchParams()
  const initial = searchParams.get('q') || ''
  const [query, setQuery] = useState(initial)
  const inputRef = useRef(null)
  const isDesktop = useIsDesktop()
  const { lang } = useI18n()
  const t = ui[lang] || ui.ar

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    if (initial) setQuery(initial)
  }, [initial])

  const q = query.trim().toLowerCase()

  const { matchedStores, matchedProducts } = useMemo(() => {
    if (!q) return { matchedStores: [], matchedProducts: [] }

    const products = catalog.filter(
      (p) =>
        includesQ(productName(p, lang), q) ||
        includesQ(p.name, q) ||
        includesQ(p.names?.en, q) ||
        includesQ(p.names?.tr, q) ||
        includesQ(p.desc, q),
    )

    const nextStores = stores.filter((s) => {
      if (includesQ(s.name, q) || includesQ(s.nameEn, q) || includesQ(s.nameTr, q)) return true
      if (s.tags?.some((tag) => includesQ(tag, q))) return true
      return false
    })

    return { matchedStores: nextStores, matchedProducts: products }
  }, [q, lang])

  const emptyQuery = !q
  const noHits = !emptyQuery && matchedStores.length === 0 && matchedProducts.length === 0

  if (isDesktop) {
    return (
      <div className="desktop-search metro-page">
        <div className="desktop-search-header">
          <label className="desktop-search-box">
            <SearchIcon size={20} color="#7a7a7a" />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.search}
              autoComplete="off"
              enterKeyHint="search"
            />
          </label>
        </div>

        {emptyQuery ? (
          <>
            <div className="section-title">
              <h2 className="h2">{lang === 'tr' ? 'Kategoriler' : lang === 'en' ? 'Categories' : 'تصنيفات'}</h2>
            </div>
            <div className="desktop-search-chips">
              {categories.map((c) => (
                <Link key={c.id} to={`/category/${c.id}`} className="chip">
                  {c.icon} {getCategoryName(c, lang)}
                </Link>
              ))}
            </div>

            <div className="section-title" style={{ marginTop: 32 }}>
              <h2 className="h2">{lang === 'tr' ? 'Mağazalar' : lang === 'en' ? 'Stores' : 'المتاجر'}</h2>
              <span className="muted">{stores.filter((s) => s.status !== 'closed').length}</span>
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
                  <h2 className="h2">{lang === 'tr' ? 'Ürünler' : lang === 'en' ? 'Products' : 'المنتجات'}</h2>
                  <span className="muted">{matchedProducts.length}</span>
                </div>
                <div className="web-product-grid">
                  {matchedProducts.map((p) => (
                    <WebProductCard key={p.id} product={p} storeId={p.storeId || stores[0]?.id} />
                  ))}
                </div>
              </section>
            )}

            {matchedStores.length > 0 && (
              <section>
                <div className="section-title">
                  <h2 className="h2">{lang === 'tr' ? 'Mağazalar' : lang === 'en' ? 'Stores' : 'المتاجر'}</h2>
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
                  {lang === 'tr' ? 'Sonuç bulunamadı' : lang === 'en' ? 'No results' : 'ماكو نتائج لهالبحث'}
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
      <TopBar title={lang === 'tr' ? 'Ara' : lang === 'en' ? 'Search' : 'بحث'} backTo="/" />
      <div className="page">
        <label className="search-box" style={{ marginBottom: 16 }}>
          <SearchIcon size={18} color="#7a7a7a" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.search}
          />
        </label>

        {emptyQuery ? (
          <div className="cats">
            {categories.slice(0, 8).map((c) => (
              <Link key={c.id} to={`/category/${c.id}`} className="cat">
                <div className="cat-icon">{c.icon}</div>
                <span>{getCategoryName(c, lang)}</span>
              </Link>
            ))}
          </div>
        ) : matchedProducts.length > 0 ? (
          <div className="stack">
            {matchedProducts.map((p) => (
              <Link key={p.id} to={`/store/${p.storeId || stores[0]?.id}`} className="product-row">
                <div>
                  <div className="h2">{productName(p, lang)}</div>
                  <div className="row" style={{ marginTop: 6 }}>
                    <span className="price">{formatIQD(p.price, lang)}</span>
                    {p.oldPrice && <span className="old-price">{formatIQD(p.oldPrice, lang)}</span>}
                  </div>
                </div>
                <img src={p.image} alt={productName(p, lang)} />
              </Link>
            ))}
          </div>
        ) : (
          <div className="empty">
            <p className="h2">{lang === 'tr' ? 'Sonuç yok' : lang === 'en' ? 'No results' : 'ماكو نتائج'}</p>
          </div>
        )}
      </div>
    </div>
  )
}
