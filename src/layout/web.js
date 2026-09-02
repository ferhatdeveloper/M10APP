import { Platform, useWindowDimensions } from 'react-native'

export const isWeb = Platform.OS === 'web'
export const STOREFRONT_MAX = 1180
export const DESKTOP_BP = 900
export const ADMIN_SIDEBAR_W = 248

function webLocation() {
  if (!isWeb || typeof window === 'undefined') return null
  try {
    return window.location
  } catch {
    return null
  }
}

export function isAdminPath() {
  const loc = webLocation()
  if (!loc) return false
  const path = String(loc.pathname || '/').replace(/\/+$/, '') || '/'
  if (path === '/admin' || path.endsWith('/admin')) return true
  const hash = String(loc.hash || '').replace(/^#\/?/, '')
  if (hash === 'admin' || hash.startsWith('admin/')) return true
  try {
    if (new URLSearchParams(loc.search || '').get('app') === 'admin') return true
  } catch {
    /* ignore */
  }
  return false
}

export function setAdminUrl() {
  const loc = webLocation()
  if (!loc) return
  try {
    window.history.pushState({ m10: 'admin' }, '', `/admin${loc.search || ''}`)
  } catch {
    loc.hash = '/admin'
  }
}

export function setStorefrontUrl() {
  const loc = webLocation()
  if (!loc) return
  try {
    const hash = /admin/i.test(String(loc.hash || '')) ? '' : loc.hash || ''
    window.history.pushState({ m10: 'customer' }, '', `/${loc.search || ''}${hash}`)
  } catch {
    loc.hash = ''
  }
}

export function useWebLayout() {
  const { width, height } = useWindowDimensions()
  const desktop = width >= DESKTOP_BP
  const storefrontW = isWeb ? Math.min(width, STOREFRONT_MAX) : width
  const productCols = !isWeb ? 2 : storefrontW >= 1100 ? 5 : storefrontW >= 820 ? 4 : storefrontW >= 560 ? 3 : 2
  return { width, height, isWeb, desktop, storefrontW, productCols }
}

export function productCardWidth({ compact, cols, storefrontW, gap = 12, pad = 32 }) {
  if (compact) return 150
  if (!isWeb) return '48%'
  const inner = Math.max(280, storefrontW - pad)
  const n = Math.max(2, cols || 2)
  const w = Math.floor((inner - gap * (n - 1)) / n)
  return Math.min(220, Math.max(152, w))
}
