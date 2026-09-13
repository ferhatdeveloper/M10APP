/**
 * RetailEX SaaS API istemcisi (PostgREST) — varsayılan gerçek bağlantı.
 *
 * Base URL önceliği:
 * 1) EXPO_PUBLIC_RETAILEX_REST_URL
 * 2) https://api.retailex.app/{tenant}
 *
 * Mock/lokal JSON bu katmanda yok; AppContext API fail olursa isteğe bağlı fallback yapar.
 */
const DEFAULT_ORIGIN = (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_RETAILEX_API_ORIGIN) || 'https://api.retailex.app'
const DEFAULT_TENANT = (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_RETAILEX_TENANT) || 'kucoglu'

export function tenantRestBase(tenantCode = DEFAULT_TENANT, origin = DEFAULT_ORIGIN) {
  const override =
    typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_RETAILEX_REST_URL
      ? String(process.env.EXPO_PUBLIC_RETAILEX_REST_URL).trim().replace(/\/+$/, '')
      : ''
  if (override) return override
  const code = String(tenantCode || DEFAULT_TENANT).trim().replace(/^\/+|\/+$/g, '')
  return `${String(origin || DEFAULT_ORIGIN).replace(/\/+$/, '')}/${code}`
}

export function getDefaultTenantCode() {
  return DEFAULT_TENANT
}

async function getJson(url, { signal, headers } = {}) {
  const res = await fetch(url, {
    signal,
    headers: {
      Accept: 'application/json',
      ...(headers || {}),
    },
  })
  if (!res.ok) {
    const err = new Error(`RetailEX HTTP ${res.status} (${url})`)
    err.status = res.status
    err.url = url
    throw err
  }
  return res.json()
}

/** Merkez kayıt — kiracı var mı? */
export async function fetchTenantRegistry(code = DEFAULT_TENANT, { signal } = {}) {
  const url = `${DEFAULT_ORIGIN}/merkez/tenant_registry?code=eq.${encodeURIComponent(code)}&select=code,display_name,module,rest_base_url,is_active,database_name`
  const rows = await getJson(url, { signal })
  return Array.isArray(rows) ? rows[0] || null : null
}

/**
 * Kiracı ürünleri (görsellerle).
 * @throws HTTP hatalarında (404 dahil) — sessiz null yok; çağıran fallback karar verir.
 */
export async function fetchTenantProducts(tenantCode = DEFAULT_TENANT, { signal, limit = 200, baseUrl } = {}) {
  const base = (baseUrl || tenantRestBase(tenantCode)).replace(/\/+$/, '')
  const rows = await getJson(
    `${base}/rex_001_products?select=id,code,name,name2,price,image_url,image_url_cdn,description,description_tr,description_en,description_ar,category_code,brand,unit,currency,is_active,has_variants&is_active=eq.true&order=name&limit=${limit}`,
    { signal },
  )
  if (!Array.isArray(rows)) {
    throw new Error('RetailEX products response is not an array')
  }
  return rows.map(mapRexProduct)
}

export function mapRexProduct(row) {
  const image = row.image_url_cdn || row.image_url || null
  const code = String(row.code || '').toLowerCase().replace(/_/g, '-')
  const id = code.startsWith('ko-') ? code : `ko-${code}`
  const aisle =
    String(row.category_code || '').includes('ICECEK') || /drink|içecek|ayran|cola|su/i.test(row.name || '')
      ? 'drinks'
      : String(row.category_code || '').includes('TAVUK') || /chicken|tavuk/i.test(row.name || '')
        ? 'ready'
        : String(row.category_code || '').includes('DIGER') || /sütlaç|fries|patates/i.test(row.name || '')
          ? 'ready'
          : 'meat'
  return {
    id,
    code: row.code,
    aisle,
    name: row.description_ar || row.name,
    names: {
      ar: row.description_ar || row.name,
      en: row.description_en || row.name2 || row.name,
      tr: row.description_tr || row.name,
    },
    desc: row.description || row.category_code || '',
    descs: {
      ar: row.description_ar || row.description || '',
      en: row.description_en || row.description || '',
      tr: row.description_tr || row.description || '',
    },
    price: Number(row.price) || 0,
    stock: 99,
    brand: row.brand || 'Kuç Oglu',
    unit: row.unit || 'pcs',
    unitAmount: 1,
    allergens: [],
    image,
    images: image ? [image] : [],
    currency: row.currency || 'IQD',
    retailexId: row.id,
    source: 'retailex-api',
  }
}

export async function pingTenantApi(tenantCode = DEFAULT_TENANT, { signal } = {}) {
  const base = tenantRestBase(tenantCode)
  try {
    const products = await fetchTenantProducts(tenantCode, { signal, limit: 1, baseUrl: base })
    return { ok: true, baseUrl: base, countHint: products.length, productSample: products[0] || null }
  } catch (e) {
    return { ok: false, baseUrl: base, error: e?.message || String(e), status: e?.status }
  }
}
