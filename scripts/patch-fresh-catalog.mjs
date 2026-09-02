import fs from 'fs'

const path = 'src/data/mock.js'
let s = fs.readFileSync(path, 'utf8')

// Replace aisles block to mirror Toters Fresh Golden Square dump categories
const aislesBlock = `export const aisles = [
  { id: 'offers' },
  { id: 'ready' },
  { id: 'dairy' },
  { id: 'coldcuts' },
  { id: 'meat' },
  { id: 'bakery' },
  { id: 'drinks' },
  { id: 'pantry' },
  { id: 'produce' },
  { id: 'snacks' },
  { id: 'frozen' },
  { id: 'household' },
  { id: 'personal' },
]

export const categories = aisles

/** Aisle order for Toters Fresh–style sectioned browsing (no “offers” chip row) */
export const shopAisles = aisles.filter((a) => a.id !== 'offers')
`

s = s.replace(
  /export const aisles = \[[\s\S]*?export const shopAisles = aisles\.filter\(\(a\) => a\.id !== 'offers'\)/,
  aislesBlock.trimEnd(),
)

const goldenStore = `  {
    id: 'm10-fresh-golden',
    name: 'M10 Fresh · Golden Square',
    nameEn: 'M10 Fresh · Golden Square',
    nameTr: 'M10 Fresh · Golden Square',
    city: 'أربيل',
    cityEn: 'Erbil',
    cityTr: 'Erbil',
    area: 'Golden Square',
    areaEn: 'Golden Square',
    areaTr: 'Golden Square',
    aliases: ['golden', 'golden square', 'toters fresh', 'fresh', 'غولدن', 'سكوير'],
    cityAliases: ['erbil', 'arbil', 'hawler', 'أربيل', 'اربيل'],
    express: true,
    isNew: true,
    tags: ['Fresh', 'FAST', 'سوبرماركت'],
    rating: 4.9,
    reviews: 10200,
    eta: '10-20',
    fee: 0,
    minOrder: 5000,
    freeDeliveryFrom: 0,
    status: 'open',
    cover: img('photo-1542838132-92c53300491e', 'sig=golden'),
    logo: '/m10-logo.png',
  },
`

if (!s.includes("id: 'm10-fresh-golden'")) {
  if (!s.includes('export const stores = [')) throw new Error('stores missing')
  s = s.replace('export const stores = [\n', 'export const stores = [\n' + goldenStore)
}

const marker = "image: img('photo-1610557892470-55d9e80c0bdf', 'sig=det'),\n  },\n]"
if (!s.includes("id: 'mm-cucumber'") && s.includes(marker)) {
  const extra = fs.readFileSync('scripts/fresh-extra-products.js', 'utf8')
  s = s.replace(marker, "image: img('photo-1610557892470-55d9e80c0bdf', 'sig=det'),\n  }," + extra + '\n]')
} else if (!s.includes("id: 'mm-cucumber'")) {
  console.error('Could not find detergent catalog end marker')
}

const goldenOverrides = `  'm10-fresh-golden': {
    'mm-wt': { price: 700, oldPrice: 1000, stock: 120 },
    'mm-eggs': { price: 6200, oldPrice: 7500 },
    'mm-milk': { price: 2100, stock: 40 },
    'mm-apples': { price: 2400 },
    'mm-cheese': { price: 4300, oldPrice: 5200 },
    'mm-nutella': { price: 7200, oldPrice: 8500 },
    'mm-chips': { price: 1400, oldPrice: 1800 },
  },
`

if (!s.includes("'m10-fresh-golden': {")) {
  s = s.replace(
    'export const storeCatalogOverrides = {\n',
    'export const storeCatalogOverrides = {\n' + goldenOverrides,
  )
}

// allergen map extras
if (!s.includes('sesame:')) {
  s = s.replace(
    `nuts: { ar: 'مكسرات', en: 'Nuts', tr: 'Fındık/fıstık' },
  }`,
    `nuts: { ar: 'مكسرات', en: 'Nuts', tr: 'Fındık/fıstık' },
    sesame: { ar: 'سمسم', en: 'Sesame', tr: 'Susam' },
    fish: { ar: 'سمك', en: 'Fish', tr: 'Balık' },
  }`,
  )
}

fs.writeFileSync(path, s)
console.log({
  goldenStore: s.includes("id: 'm10-fresh-golden'"),
  cucumber: s.includes("id: 'mm-cucumber'"),
  ready: s.includes("id: 'ready'"),
  coldcuts: s.includes("id: 'coldcuts'"),
  overrides: s.includes("'m10-fresh-golden': {"),
})
