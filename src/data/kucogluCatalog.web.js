/** M10 Market catalog - Web version (ESM) */

export const KUCOGLU_STORE_ID = 'm10-market'

export const m10Store = {
  id: KUCOGLU_STORE_ID,
  name: 'M10 Market',
  nameEn: 'M10 Market',
  nameTr: 'M10 Market',
  city: 'بغداد',
  cityEn: 'Baghdad',
  cityTr: 'Bağdat',
  area: 'المنصور',
  areaEn: 'Mansour',
  areaTr: 'Mansur',
  tags: ['سوبرماركت', 'Supermarket', 'Market'],
  rating: 4.8,
  reviews: 2500,
  eta: '25-35',
  fee: 2500,
  minOrder: 10000,
  status: 'open',
}

export function buildM10Catalog() {
  return []
}
