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

async function postJson(url, body, { headers } = {}) {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(headers || {}),
    },
    body: JSON.stringify(body),
  })
  const data = await res.json().catch(() => null)
  if (!res.ok) {
    const err = new Error(data?.message || data?.error || `RetailEX HTTP ${res.status} (${url})`)
    err.status = res.status
    err.url = url
    err.data = data
    throw err
  }
  return data
}

async function patchJson(url, body) {
  const res = await fetch(url, {
    method: 'PATCH',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify(body),
  })
  const data = await res.json().catch(() => null)
  if (!res.ok) {
    const err = new Error(data?.message || data?.error || `RetailEX HTTP ${res.status} (${url})`)
    err.status = res.status
    err.url = url
    err.data = data
    throw err
  }
  return data
}

/** App status ↔ eticaret_web_orders.status */
export function mapApiOrderStatus(status) {
  const s = String(status || '').toLowerCase()
  if (s === 'cancelled' || s === 'canceled') return 'cancelled'
  if (s === 'delivered' || s === 'completed' || s === 'done') return 'delivered'
  if (s === 'onway' || s === 'out_for_delivery' || s === 'shipping' || s === 'enroute') return 'onway'
  if (s === 'preparing' || s === 'kitchen' || s === 'processing') return 'preparing'
  // pending / converted / demo / confirmed / approved
  return 'confirmed'
}

export function encodeShippingAddress(addr = {}) {
  try {
    return JSON.stringify({
      label: addr.label || '',
      area: addr.area || '',
      city: addr.city || '',
      details: addr.details || '',
      lat: addr.lat ?? null,
      lng: addr.lng ?? null,
      text: [addr.area, addr.city, addr.details].filter(Boolean).join(', '),
    })
  } catch {
    return [addr.area, addr.city, addr.details].filter(Boolean).join(', ')
  }
}

export function decodeShippingAddress(raw) {
  if (!raw) return {}
  try {
    const j = JSON.parse(raw)
    if (j && typeof j === 'object') {
      return {
        label: j.label || '',
        area: j.area || j.text || '',
        city: j.city || '',
        details: j.details || '',
        lat: j.lat ?? undefined,
        lng: j.lng ?? undefined,
      }
    }
  } catch {
    /* plain text */
  }
  return { area: String(raw), city: '', details: '', label: '' }
}

export function mapWebOrderToApp(row, { defaultStoreId = 'kucoglu-duhok' } = {}) {
  const status = mapApiOrderStatus(row.status)
  const itemsRaw = Array.isArray(row.items) ? row.items : []
  const items = itemsRaw.map((it) => {
    const code = String(it.code || it.product_code || '').trim()
    let productId
    if (code) {
      const slug = code.toLowerCase().replace(/_/g, '-')
      productId = slug.startsWith('ko-') ? slug : `ko-${slug}`
    } else {
      productId = `ko-${String(it.name || 'item')
        .toLowerCase()
        .replace(/\s+/g, '-')}`
    }
    return {
      storeId: defaultStoreId,
      productId,
      qty: Number(it.quantity) || 1,
      name: it.name || it.product_name || productId,
      price: Number(it.price) || 0,
      code: code || undefined,
    }
  })
  const createdAt = row.created_at ? Date.parse(row.created_at) : Date.now()
  return {
    id: row.order_no || row.id,
    retailexId: row.id,
    orderNo: row.order_no,
    createdAt: Number.isFinite(createdAt) ? createdAt : Date.now(),
    items,
    storeId: defaultStoreId,
    total: Number(row.total) || 0,
    subtotal: Number(row.subtotal) || 0,
    fee: Math.max(0, (Number(row.total) || 0) - (Number(row.subtotal) || 0)),
    discount: 0,
    payment: row.payment_provider || 'cash',
    paymentMethod: row.payment_provider || 'cash',
    paymentStatus: row.payment_status || 'pending',
    schedule: 'now',
    slot: null,
    note: row.notes || '',
    address: decodeShippingAddress(row.shipping_address),
    status,
    customerName: row.customer_name || '',
    customerPhone: row.customer_phone || '',
    currency: row.currency || 'IQD',
    salesFicheId: row.sales_fiche_id || null,
    salesFicheNo: row.sales_fiche_no || null,
    source: 'retailex-api',
    demoMode: !!row.demo_mode,
  }
}

/**
 * Online sipariş oluştur — RPC eticaret_submit_web_order
 * Başarıda satış fişi (trcode 20) + eticaret_web_orders kaydı.
 */
export async function submitWebOrder(payload, { tenantCode = DEFAULT_TENANT, baseUrl } = {}) {
  const base = (baseUrl || tenantRestBase(tenantCode)).replace(/\/+$/, '')
  const body = {
    tenant_code: payload.tenant_code || tenantCode,
    demo_mode: payload.demo_mode === true,
    customer_name: payload.customer_name || null,
    customer_email: payload.customer_email || null,
    customer_phone: payload.customer_phone || null,
    shipping_address: payload.shipping_address || null,
    payment_provider: payload.payment_provider || 'cash',
    payment_status: payload.payment_status || 'pending',
    payment_ref: payload.payment_ref || null,
    currency: payload.currency || 'IQD',
    subtotal: Number(payload.subtotal) || 0,
    total: Number(payload.total) || 0,
    notes: payload.notes || 'Kuçoglu mobil sipariş',
    items: Array.isArray(payload.items) ? payload.items : [],
    firm_nr: payload.firm_nr || undefined,
  }
  const result = await postJson(`${base}/rpc/eticaret_submit_web_order`, { payload: body })
  if (!result?.ok) {
    const err = new Error(result?.error || result?.message || 'Sipariş gönderilemedi')
    err.data = result
    throw err
  }
  return result
}

export async function fetchWebOrders({
  tenantCode = DEFAULT_TENANT,
  baseUrl,
  limit = 100,
  phone,
  signal,
} = {}) {
  const base = (baseUrl || tenantRestBase(tenantCode)).replace(/\/+$/, '')
  const params = new URLSearchParams()
  params.set('select', '*')
  params.set('order', 'created_at.desc')
  params.set('limit', String(limit))
  if (tenantCode) params.set('tenant_code', `eq.${tenantCode}`)
  if (phone) params.set('customer_phone', `eq.${phone}`)
  const rows = await getJson(`${base}/eticaret_web_orders?${params.toString()}`, { signal })
  if (!Array.isArray(rows)) throw new Error('RetailEX orders response is not an array')
  return rows
}

export async function updateWebOrderStatus(orderId, status, { tenantCode = DEFAULT_TENANT, baseUrl } = {}) {
  if (!orderId) throw new Error('orderId required')
  const base = (baseUrl || tenantRestBase(tenantCode)).replace(/\/+$/, '')
  const rows = await patchJson(`${base}/eticaret_web_orders?id=eq.${encodeURIComponent(orderId)}`, {
    status,
    updated_at: new Date().toISOString(),
  })
  return Array.isArray(rows) ? rows[0] || null : rows
}

export async function fetchWebOrderByNo(orderNo, { tenantCode = DEFAULT_TENANT, baseUrl, signal } = {}) {
  const base = (baseUrl || tenantRestBase(tenantCode)).replace(/\/+$/, '')
  const rows = await getJson(
    `${base}/eticaret_web_orders?order_no=eq.${encodeURIComponent(orderNo)}&select=*&limit=1`,
    { signal },
  )
  return Array.isArray(rows) ? rows[0] || null : null
}
