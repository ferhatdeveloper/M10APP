export const logoImg = require('../../assets/m10-logo.png')
export const promoImg = require('../../assets/promo-banner.png')

/** Stable grocery photo used when a product image is missing or fails to load */
const FALLBACK_GROCERY =
  'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=70&sig=fallback'

export const fallbackProductImg = { uri: FALLBACK_GROCERY }

/** Optional aisle → Unsplash fallback (safety net only) */
const aisleFallbacks = {
  produce: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=70&sig=fb-produce',
  dairy: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=800&q=70&sig=fb-dairy',
  meat: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=800&q=70&sig=fb-meat',
  bakery: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=70&sig=fb-bakery',
  drinks: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?auto=format&fit=crop&w=800&q=70&sig=fb-drinks',
  pantry: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=70&sig=fb-pantry',
  snacks: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=800&q=70&sig=fb-snacks',
  frozen: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=800&q=70&sig=fb-frozen',
  household: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&w=800&q=70&sig=fb-house',
  home: 'https://images.unsplash.com/photo-1507473885765-e6ed557fccc6?auto=format&fit=crop&w=800&q=70&sig=fb-home',
  personal: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=800&q=70&sig=fb-personal',
  coldcuts: 'https://images.unsplash.com/photo-1615937691194-97dbd3f3dc29?auto=format&fit=crop&w=800&q=70&sig=fb-cold',
  ready: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=70&sig=fb-ready',
  offers: FALLBACK_GROCERY,
}

export function aisleFallback(aisle) {
  const uri = aisleFallbacks[aisle] || FALLBACK_GROCERY
  return { uri }
}

export function src(path, aisle) {
  if (!path) return aisle ? aisleFallback(aisle) : fallbackProductImg
  if (typeof path !== 'string') return path
  if (path.includes('promo-banner') || path === '/promo-banner.png') return promoImg
  if (path.includes('m10-logo') || path === '/m10-logo.png') return logoImg
  if (path.startsWith('http')) return { uri: path }
  return { uri: path }
}
