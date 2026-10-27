/**
 * Migros-sourced demo products → catalog shape for cart / checkout.
 */
import {
  BANETTI_PRODUCTS,
  BEVERAGES,
  BEST_SELLERS,
  BUY_AGAIN,
  CLEANING,
  DAIRY,
  EXPLORE,
  NESCAFE_ROW,
  SNACKS,
  TOP_SAVERS,
} from './martCatalog'

function imgUri(image) {
  if (!image) return null
  if (typeof image === 'string') return image
  return image.uri || null
}

function normalize(p) {
  if (!p?.id) return null
  const name = p.names?.tr || p.names?.en || p.name || p.id
  return {
    id: p.id,
    nameAr: p.names?.ar || name,
    nameEn: p.names?.en || name,
    nameTr: p.names?.tr || name,
    names: p.names || { tr: name, en: name, ar: name },
    price: p.price || 0,
    image: imgUri(p.image),
    aisle: 'produce',
    stock: 99,
    mart: true,
  }
}

const RAW = [
  ...BUY_AGAIN,
  ...BEST_SELLERS,
  ...TOP_SAVERS,
  ...DAIRY,
  ...SNACKS,
  ...BEVERAGES,
  ...CLEANING,
  ...NESCAFE_ROW,
  ...EXPLORE,
  ...BANETTI_PRODUCTS,
]

const MAP = {}
for (const row of RAW) {
  const n = normalize(row)
  if (n && !MAP[n.id]) MAP[n.id] = n
}

export const MART_PRODUCTS = MAP

export function getMartProduct(productId) {
  return MART_PRODUCTS[productId] || null
}
