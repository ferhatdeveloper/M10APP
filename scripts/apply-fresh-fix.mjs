import fs from 'fs'

const path = 'src/data/mock.js'
let s = fs.readFileSync(path, 'utf8')
const nl = s.includes('\r\n') ? '\r\n' : '\n'

const extra = fs
  .readFileSync('scripts/fresh-extra-products.js', 'utf8')
  .replace(/\r?\n/g, nl)

const detMarker = `image: img('photo-1610557892470-55d9e80c0bdf', 'sig=det'),${nl}  },${nl}]`
if (!s.includes("id: 'mm-cucumber'")) {
  if (!s.includes(detMarker)) {
    console.error('detergent marker not found')
    process.exit(1)
  }
  s = s.replace(detMarker, `image: img('photo-1610557892470-55d9e80c0bdf', 'sig=det'),${nl}  },${extra}${nl}]`)
}

const golden = [
  '  {',
  "    id: 'm10-fresh-golden',",
  "    name: 'M10 Fresh · Golden Square',",
  "    nameEn: 'M10 Fresh · Golden Square',",
  "    nameTr: 'M10 Fresh · Golden Square',",
  "    city: 'أربيل',",
  "    cityEn: 'Erbil',",
  "    cityTr: 'Erbil',",
  "    area: 'Golden Square',",
  "    areaEn: 'Golden Square',",
  "    areaTr: 'Golden Square',",
  "    aliases: ['golden', 'golden square', 'toters fresh', 'fresh', 'غولدن'],",
  "    cityAliases: ['erbil', 'arbil', 'hawler', 'أربيل', 'اربيل'],",
  '    express: true,',
  '    isNew: true,',
  "    tags: ['Fresh', 'FAST', 'سوبرماركت'],",
  '    rating: 4.9,',
  '    reviews: 10200,',
  "    eta: '10-20',",
  '    fee: 0,',
  '    minOrder: 5000,',
  '    freeDeliveryFrom: 0,',
  "    status: 'open',",
  "    cover: img('photo-1542838132-92c53300491e', 'sig=golden'),",
  "    logo: '/m10-logo.png',",
  '  },',
  '',
].join(nl)

if (!s.includes("id: 'm10-fresh-golden',")) {
  const storesMarker = `export const stores = [${nl}`
  if (!s.includes(storesMarker)) {
    console.error('stores marker not found')
    process.exit(1)
  }
  s = s.replace(storesMarker, storesMarker + golden)
}

const ov = [
  "  'm10-fresh-golden': {",
  "    'mm-wt': { price: 700, oldPrice: 1000, stock: 120 },",
  "    'mm-eggs': { price: 6200, oldPrice: 7500 },",
  "    'mm-milk': { price: 2100, stock: 40 },",
  "    'mm-apples': { price: 2400 },",
  "    'mm-cheese': { price: 4300, oldPrice: 5200 },",
  "    'mm-nutella': { price: 7200, oldPrice: 8500 },",
  "    'mm-chips': { price: 1400, oldPrice: 1800 },",
  '  },',
  '',
].join(nl)

if (!s.includes("'m10-fresh-golden': {")) {
  const ovMarker = `export const storeCatalogOverrides = {${nl}`
  s = s.replace(ovMarker, ovMarker + ov)
}

if (!s.includes('sesame:')) {
  s = s.replace(
    `nuts: { ar: 'مكسرات', en: 'Nuts', tr: 'Fındık/fıstık' },${nl}  }`,
    `nuts: { ar: 'مكسرات', en: 'Nuts', tr: 'Fındık/fıstık' },${nl}    sesame: { ar: 'سمسم', en: 'Sesame', tr: 'Susam' },${nl}    fish: { ar: 'سمك', en: 'Fish', tr: 'Balık' },${nl}  }`,
  )
}

fs.writeFileSync(path, s)
console.log({
  store: s.includes("id: 'm10-fresh-golden',"),
  cucumber: s.includes('mm-cucumber'),
  ov: s.includes("'m10-fresh-golden': {"),
  sesame: s.includes('sesame:'),
})
