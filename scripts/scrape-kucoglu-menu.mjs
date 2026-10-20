#!/usr/bin/env node
/**
 * Kuç Oglu menü sitesinden ürünleri (görseller + varyantlar) çıkarır.
 * Kaynak: JSON-LD Menu schema (en + ar).
 *
 * Kullanım:
 *   node scripts/scrape-kucoglu-menu.mjs
 *   node scripts/scrape-kucoglu-menu.mjs --out src/data/kucoglu-menu.json
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

const BASE = 'https://menu.kucoglu.com'
const LANGS = ['en', 'ar']

function parseArgs(argv) {
  let out = path.join(ROOT, 'src/data/kucoglu-menu.json')
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === '--out') out = path.resolve(ROOT, argv[++i] || out)
  }
  return { out }
}

async function fetchHtml(lang) {
  const url = `${BASE}/${lang}/`
  const res = await fetch(url, {
    headers: { 'User-Agent': 'KucogluMenuScraper/1.0', Accept: 'text/html' },
  })
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`)
  return res.text()
}

function extractLdJson(html) {
  const m = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)
  if (!m) throw new Error('JSON-LD bulunamadı')
  return JSON.parse(m[1])
}

function absUrl(src) {
  if (!src) return null
  if (/^https?:\/\//i.test(src)) return src.split('?')[0]
  return `https://menu.kucoglu.restaurant${src.startsWith('/') ? src : `/${src}`}`
}

function slugify(name) {
  return String(name || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48)
}

function aisleFor(category) {
  const c = String(category || '').toLowerCase()
  if (c.includes('drink') || c.includes('içecek') || c.includes('icecek')) return 'drinks'
  if (c.includes('chicken') || c.includes('tavuk')) return 'ready'
  if (c.includes('meat') || c.includes('et')) return 'meat'
  if (c.includes('other') || c.includes('diğer') || c.includes('diger')) return 'ready'
  return 'ready'
}

function parseMenu(ld, lang) {
  const graph = Array.isArray(ld['@graph']) ? ld['@graph'] : [ld]
  const restaurant = graph.find((x) => x['@type'] === 'Restaurant')
  if (!restaurant?.menu?.hasMenuSection) throw new Error(`MenuSection yok (${lang})`)
  const items = []
  for (const section of restaurant.menu.hasMenuSection) {
    const cat = section.name || 'Other'
    for (const item of section.hasMenuItem || []) {
      const offers = Array.isArray(item.offers) ? item.offers : []
      const variants = offers.map((o) => ({
        label: o.name || 'Default',
        price: Number(o.price || 0),
        currency: o.priceCurrency || 'IQD',
      }))
      const base = variants[0] || { label: 'Default', price: 0, currency: 'IQD' }
      items.push({
        key: `${cat}::${item.name}`,
        category: cat,
        name: item.name,
        image: absUrl(item.image),
        price: base.price,
        currency: base.currency,
        variants,
        aisle: aisleFor(cat),
      })
    }
  }
  return {
    brand: restaurant.name,
    phone: restaurant.telephone,
    address: restaurant.address,
    geo: restaurant.geo,
    logo: absUrl(restaurant.image),
    items,
  }
}

function mergeLangs(byLang) {
  const en = byLang.en
  const ar = byLang.ar
  const arByKey = new Map(ar.items.map((i) => [i.key.replace(/^[^:]+::/, ''), i]))
  // AR keys use Arabic category names — match by English name order within shared image URL
  const arByImage = new Map()
  for (const i of ar.items) {
    if (i.image) arByImage.set(i.image, i)
  }

  const products = en.items.map((item, idx) => {
    const arItem = arByImage.get(item.image) || ar.items[idx] || null
    const id = `ko-${slugify(item.name) || `item-${idx + 1}`}`
    const names = {
      en: item.name,
      ar: arItem?.name || item.name,
      tr: item.name,
    }
    const catEn = item.category
    const catAr = arItem?.category || catEn
    return {
      id,
      code: id.toUpperCase().replace(/-/g, '_').slice(0, 50),
      aisle: item.aisle,
      category: catEn,
      categoryAr: catAr,
      name: names.ar,
      names,
      desc: catEn,
      descs: { ar: catAr, en: catEn, tr: catEn },
      price: item.price,
      currency: item.currency || 'IQD',
      stock: 99,
      brand: 'Kuç Oglu',
      unit: 'pcs',
      unitAmount: 1,
      allergens: [],
      image: item.image,
      images: item.image ? [item.image] : [],
      variants: (item.variants || []).map((v, vi) => ({
        id: slugify(v.label) || `v${vi + 1}`,
        labelAr: v.label,
        labelEn: v.label,
        labelTr: v.label,
        price: v.price,
      })),
      popular: idx < 6,
    }
  })

  return {
    scrapedAt: new Date().toISOString(),
    source: {
      en: `${BASE}/en/`,
      ar: `${BASE}/ar/`,
    },
    tenant: {
      code: 'kucoglu',
      displayName: 'Kuç Oglu',
      module: 'restaurant',
    },
    store: {
      id: 'kucoglu-duhok',
      name: 'كوج أوغلو دهوك',
      nameEn: 'Kuç Oglu Duhok',
      nameTr: 'Kuç Oglu Duhok',
      city: 'دهوك',
      cityEn: 'Duhok',
      cityTr: 'Duhok',
      area: en.address?.streetAddress || 'Ashty Road',
      areaEn: en.address?.streetAddress || 'Ashty Road',
      areaTr: en.address?.streetAddress || 'Ashty Road',
      phone: en.phone,
      latitude: en.geo?.latitude,
      longitude: en.geo?.longitude,
      logo: en.logo,
      cover: products[0]?.image || en.logo,
    },
    categories: [...new Set(products.map((p) => p.category))],
    productCount: products.length,
    products,
  }
}

async function main() {
  const { out } = parseArgs(process.argv)
  const byLang = {}
  for (const lang of LANGS) {
    const html = await fetchHtml(lang)
    byLang[lang] = parseMenu(extractLdJson(html), lang)
    console.log(`[${lang}] ${byLang[lang].items.length} ürün`)
  }
  const catalog = mergeLangs(byLang)
  fs.mkdirSync(path.dirname(out), { recursive: true })
  fs.writeFileSync(out, `${JSON.stringify(catalog, null, 2)}\n`, 'utf8')
  console.log(`Yazıldı: ${out} (${catalog.productCount} ürün)`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
