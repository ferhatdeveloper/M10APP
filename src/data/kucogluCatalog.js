/** M10 Market menü kataloğu — Metro `require` JSON (RN/web uyumlu). */
// eslint-disable-next-line import/no-commonjs, global-require
const menu = require('./kucoglu-menu.json')

const TR_NAMES = {
  'Meat Meal & Rice': 'Et Yemek & Pilav',
  Iskender: 'İskender',
  'Meat Roll': 'Et Dürüm',
  'Meat Doner': 'Et Döner',
  'Meat Meal': 'Et Yemek',
  'Super Beyti': 'Süper Beyti',
  'Chicken Meal & Rice': 'Tavuk Yemek & Pilav',
  'Chicken Iskender': 'Tavuk İskender',
  'Chicken Roll': 'Tavuk Dürüm',
  'Chicken Doner': 'Tavuk Döner',
  'Chicken Meal': 'Tavuk Yemek',
  'Chicken Platter': 'Tavuk Porsiyon',
  Ayran: 'Ayran',
  Cola: 'Kola',
  Fanta: 'Fanta',
  Sprite: 'Sprite',
  'Cola Fresh': 'Cola Fresh',
  'Cola zero': 'Cola Zero',
  'Soda Lemon': 'Limonlu Soda',
  Soda: 'Soda',
  Water: 'Su',
  Sütlaç: 'Sütlaç',
  Fries: 'Patates Kızartması',
}

export const KUCOGLU_STORE_ID = 'kucoglu-duhok'

export const kucogluStore = {
  id: KUCOGLU_STORE_ID,
  name: menu.store?.name || 'M10 Market',
  nameEn: menu.store?.nameEn || 'M10 Market',
  nameTr: menu.store?.nameTr || 'M10 Market',
  city: menu.store?.city || 'دهوك',
  cityEn: menu.store?.cityEn || 'Duhok',
  cityTr: menu.store?.cityTr || 'Duhok',
  area: menu.store?.area || 'Ashty Road',
  areaEn: menu.store?.areaEn || 'Ashty Road',
  areaTr: menu.store?.areaTr || 'Ashty Road',
  aliases: ['m10', 'm10 market', 'market', 'دهوك', 'duhok'],
  cityAliases: ['duhok', 'dohuk', 'دهوك', 'دهۆک'],
  express: true,
  isNew: true,
  tags: ['مطعم', 'Restaurant', 'Restoran', 'FAST'],
  rating: 4.9,
  reviews: 1280,
  eta: '20-35',
  fee: 1000,
  minOrder: 5000,
  freeDeliveryFrom: 25000,
  status: 'open',
  cover: menu.store?.cover,
  logo: menu.store?.logo,
  phone: menu.store?.phone,
  restaurant: true,
  tenantCode: 'kucoglu',
}

export function buildKucogluCatalog() {
  return (menu.products || []).map((p, i) => {
    const en = p.names?.en || p.name
    const tr = TR_NAMES[en] || p.names?.tr || en
    const ar = p.names?.ar || p.name
    return {
      ...p,
      name: ar,
      names: { ar, en, tr },
      nameTr: tr,
      nameEn: en,
      nameAr: ar,
      descs: p.descs || { ar: p.categoryAr || p.category, en: p.category, tr: p.category },
      barcode: p.barcode || `8699${String(100000000 + i).slice(-9)}`,
      sku: p.sku || p.id,
      brand: p.brand || 'M10 Market',
      popular: i < 8,
    }
  })
}

export const kucogluMenuMeta = {
  scrapedAt: menu.scrapedAt,
  source: menu.source,
  tenant: menu.tenant,
  productCount: menu.productCount,
  categories: menu.categories,
}
