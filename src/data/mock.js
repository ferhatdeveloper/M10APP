export const formatIQD = (n, lang = 'ar') => {
  const loc = lang === 'en' ? 'en-US' : lang === 'tr' ? 'tr-TR' : 'ar-IQ'
  const num = Number(n).toLocaleString(loc)
  return lang === 'ar' ? `${num} د.ع` : `${num} IQD`
}

export const storeName = (store, lang = 'ar') => {
  if (!store) return ''
  if (lang === 'tr') return store.nameTr || store.nameEn
  if (lang === 'en') return store.nameEn
  return store.name
}

export const productName = (p, lang = 'ar') => {
  if (!p) return ''
  if (p.names?.[lang]) return p.names[lang]
  if (lang === 'tr') return p.nameTr || p.names?.en || p.nameEn || p.name || ''
  if (lang === 'en') return p.nameEn || p.names?.en || p.name || ''
  return p.nameAr || p.names?.ar || p.name || ''
}

export const productDesc = (p, lang = 'ar') => {
  if (p.descs?.[lang]) return p.descs[lang]
  if (lang === 'tr') return p.descs?.en || p.desc
  return p.desc
}

export const variantLabel = (v, lang = 'ar') => {
  if (!v) return ''
  if (lang === 'tr') return v.labelTr || v.labelEn || v.id
  if (lang === 'en') return v.labelEn || v.id
  return v.labelAr || v.labelEn || v.id
}

export const productImages = (p) => {
  if (!p) return []
  const list = Array.isArray(p.images) && p.images.length ? p.images : [p.image]
  const cleaned = list.filter((x) => typeof x === 'string' && x.trim())
  return cleaned.length ? cleaned : []
}

/** Isolated product cutout for AR camera overlay (prefer arImage over lifestyle shots). */
export const arProductImage = (p) => {
  if (!p) return null
  if (typeof p.arImage === 'string' && p.arImage.trim()) return p.arImage.trim()
  return productImages(p)[0] || p.image || null
}

/** Optional remote GLB — TryInRoom prefers 2.5D cutouts via arProductImage. */
export const arModelUrl = (p) => {
  if (!p) return null
  if (typeof p.modelUrl === 'string' && p.modelUrl.trim()) return p.modelUrl.trim()
  return null
}

/** Studio / cutout Unsplash helper — white-ish product shots, no room lifestyle scenes. */
const arCutout = (id, sig) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=85&${sig || ''}`

export const unitPriceOf = (p, price) => {
  if (!p?.unitAmount || p.unitAmount <= 0) return null
  return Math.round((price ?? p.price) / p.unitAmount)
}

export const formatUnitPrice = (p, lang = 'ar', price) => {
  const up = unitPriceOf(p, price)
  if (up == null) return ''
  const unit = p.unit || 'kg'
  return `${formatIQD(up, lang)} / ${unit}`
}

const img = (id, q) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=70&${q || ''}`

export const modes = [
  { id: 'all' },
  { id: 'express', badge: 'FAST' },
  { id: 'deals' },
  { id: 'plus' },
]

export const aisles = [
  { id: 'offers' },
  { id: 'ready' },
  { id: 'dairy' },
  { id: 'coldcuts', nameTr: 'Şarküteri', nameEn: 'Cold Cuts', nameAr: 'لحوم باردة' },
  { id: 'meat', nameTr: 'Et ve şarküteri', nameEn: 'Meats & Deli', nameAr: 'لحوم ومقبلات' },
  { id: 'bakery' },
  { id: 'drinks' },
  { id: 'pantry' },
  { id: 'produce' },
  { id: 'snacks' },
  { id: 'frozen' },
  { id: 'household' },
  { id: 'home' },
  { id: 'personal' },
]

export const categories = aisles

/** Aisle order for Toters Fresh–style sectioned browsing (no “offers” chip row) */
export const shopAisles = aisles.filter((a) => a.id !== 'offers')

export const filters = [
  { id: 'offers' },
  { id: 'freeDelivery' },
  { id: 'topRated' },
  { id: 'new' },
  { id: 'under30' },
]

export const collections = [
  { id: 'weekly', aisle: 'offers', image: img('photo-1488459716781-31db52582fe9', 'sig=weekly') },
  { id: 'dairy', aisle: 'dairy', image: img('photo-1563636619-e9143da7973b', 'sig=col-dairy') },
  { id: 'school', aisle: 'pantry', image: img('photo-1503676260728-1c00da094a0b', 'sig=school') },
  { id: 'drinks', aisle: 'drinks', image: img('photo-1629203851122-3726ecdf080e', 'sig=col-drinks') },
  { id: 'fresh', aisle: 'produce', image: img('photo-1542838132-92c53300491e', 'sig=col-fresh') },
  { id: 'snacks', aisle: 'snacks', image: img('photo-1566478989037-eec170784d0b', 'sig=col-snacks') },
]

export const banners = [
  {
    id: 'b1',
    titleAr: 'وايلد تايجر',
    titleEn: 'Wild Tiger',
    titleTr: 'Wild Tiger',
    subAr: 'من 1000 إلى 750 د.ع',
    subEn: 'From 1000 to 750 IQD',
    subTr: '1000 yerine 750 IQD',
    image: '/promo-banner.png',
  },
  {
    id: 'b2',
    titleAr: 'توصيل سريع',
    titleEn: 'Express delivery',
    titleTr: 'Hızlı teslimat',
    subAr: 'فروع M10 خلال 20 دقيقة',
    subEn: 'M10 branches in 20 minutes',
    subTr: 'M10 şubeleri 20 dakikada',
  },
  {
    id: 'b3',
    titleAr: 'M10+',
    titleEn: 'M10+',
    titleTr: 'M10+',
    subAr: 'توصيل مجاني ونقاط ذهبية',
    subEn: 'Free delivery and gold points',
    subTr: 'Ücretsiz teslimat ve altın puan',
    color: 'yellow',
  },
]

export const bannerTitle = (b, lang) =>
  lang === 'tr' ? b.titleTr : lang === 'en' ? b.titleEn : b.titleAr
export const bannerSub = (b, lang) =>
  lang === 'tr' ? b.subTr : lang === 'en' ? b.subEn : b.subAr

export const dealSkus = () => catalog.filter((p) => p.oldPrice)

export const DEFAULT_STORE_ID = 'm10-dora-mechanic'

export const LEGACY_STORE_IDS = {
  'm10-golden': 'm10-dora-mechanic',
  'm10-fresh-golden': 'm10-dora-mechanic',
  'm10-erbil': 'm10-dora-carsi',
  'm10-karrada': 'm10-seyyidiye',
  'm10-ankawa': 'm10-zeyyune',
}

const normPlace = (s) =>
  String(s || '')
    .toLowerCase()
    .replace(/[ًٌٍَُِّْـ]/g, '')
    .replace(/\s+/g, ' ')
    .trim()

export const stores = [
  {
    id: 'm10-dora-mechanic',
    name: 'M10 دورا ميكانيك',
    nameEn: 'M10 Dora Mechanic',
    nameTr: 'M10 Dora Mekanik',
    city: 'بغداد',
    cityEn: 'Baghdad',
    cityTr: 'Bağdat',
    area: 'دورا',
    areaEn: 'Dora',
    areaTr: 'Dora',
    aliases: ['dora', 'دورا', 'mechanic', 'ميكانيك'],
    cityAliases: ['baghdad', 'bağdat', 'bagdad', 'بغداد'],
    express: true,
    isNew: false,
    tags: ['سوبرماركت', 'سريع'],
    rating: 4.9,
    reviews: 10200,
    eta: '10-20',
    fee: 0,
    minOrder: 5000,
    freeDeliveryFrom: 0,
    status: 'open',
    cover: img('photo-1542838132-92c53300491e', 'sig=dora-m'),
    logo: '/m10-logo.png',
  },
  {
    id: 'm10-dora-carsi',
    name: 'M10 دورا چارشی',
    nameEn: 'M10 Dora Çarşı',
    nameTr: 'M10 Dora Çarşı',
    city: 'بغداد',
    cityEn: 'Baghdad',
    cityTr: 'Bağdat',
    area: 'دورا',
    areaEn: 'Dora',
    areaTr: 'Dora',
    aliases: ['dora', 'دورا', 'carsi', 'çarşı', 'charshi', 'سوق'],
    cityAliases: ['baghdad', 'bağdat', 'bagdad', 'بغداد'],
    express: true,
    isNew: true,
    tags: ['سوبرماركت', 'عروض'],
    rating: 4.8,
    reviews: 3200,
    eta: '15-25',
    fee: 1000,
    minOrder: 8000,
    freeDeliveryFrom: 25000,
    status: 'open',
    cover: img('photo-1578916171728-46686eac8d58', 'sig=dora-c'),
    logo: '/m10-logo.png',
  },
  {
    id: 'm10-seyyidiye',
    name: 'M10 السيدية',
    nameEn: 'M10 Seyyidiye',
    nameTr: 'M10 Seyyidiye',
    city: 'بغداد',
    cityEn: 'Baghdad',
    cityTr: 'Bağdat',
    area: 'السيدية',
    areaEn: 'Seyyidiye',
    areaTr: 'Seyyidiye',
    aliases: ['seyyidiye', 'saydiya', 'al-saydiya', 'السيدية', 'سيدية'],
    cityAliases: ['baghdad', 'bağdat', 'bagdad', 'بغداد'],
    express: false,
    isNew: false,
    tags: ['هايبر', 'بقالة'],
    rating: 4.7,
    reviews: 5400,
    eta: '25-40',
    fee: 2000,
    minOrder: 10000,
    freeDeliveryFrom: 30000,
    status: 'open',
    cover: img('photo-1534723452862-4c874018d66d', 'sig=sey'),
    logo: '/m10-logo.png',
  },
  {
    id: 'm10-zeyyune',
    name: 'M10 زيونة',
    nameEn: 'M10 Zeyyune',
    nameTr: 'M10 Zeyyune',
    city: 'بغداد',
    cityEn: 'Baghdad',
    cityTr: 'Bağdat',
    area: 'زيونة',
    areaEn: 'Zeyyune',
    areaTr: 'Zeyyune',
    aliases: ['zeyyune', 'zayouna', 'ziyuna', 'زيونة', 'زيون'],
    cityAliases: ['baghdad', 'bağdat', 'bagdad', 'بغداد'],
    express: true,
    isNew: true,
    tags: ['إكسبرس'],
    rating: 4.8,
    reviews: 890,
    eta: '10-15',
    fee: 0,
    minOrder: 4000,
    freeDeliveryFrom: 0,
    status: 'open',
    cover: img('photo-1583258292688-d296dc03e7b0', 'sig=zey'),
    logo: '/m10-logo.png',
  },
  {
    id: 'm10-filistin',
    name: 'M10 فلسطين',
    nameEn: 'M10 Filistin',
    nameTr: 'M10 Filistin',
    city: 'بغداد',
    cityEn: 'Baghdad',
    cityTr: 'Bağdat',
    area: 'فلسطين',
    areaEn: 'Filistin',
    areaTr: 'Filistin',
    aliases: ['filistin', 'palestine', 'فلسطين'],
    cityAliases: ['baghdad', 'bağdat', 'bagdad', 'بغداد'],
    express: false,
    isNew: true,
    comingSoon: true,
    tags: ['قريباً'],
    rating: 0,
    reviews: 0,
    eta: '—',
    fee: 0,
    minOrder: 0,
    status: 'comingSoon',
    cover: '/m10-logo.png',
    logo: '/m10-logo.png',
  },
]

const n = (ar, en, tr) => ({ ar, en, tr })

const v = (id, ar, en, tr, price) => ({ id, labelAr: ar, labelEn: en, labelTr: tr, price })

export const catalog = [
  {
    id: 'mm-apples',
    aisle: 'produce',
    name: 'تفاح أحمر 1 كغم',
    names: n('تفاح أحمر 1 كغم', 'Red apples 1kg', 'Kırmızı elma 1 kg'),
    desc: 'طازج يومياً',
    descs: n('طازج يومياً', 'Fresh daily', 'Her gün taze'),
    price: 2500,
    stock: 40,
    brand: 'M10 Fresh',
    unit: 'kg',
    unitAmount: 1,
    allergens: [],
    variants: [v('1kg', '1 كغم', '1 kg', '1 kg', 2500), v('2kg', '2 كغم', '2 kg', '2 kg', 4800)],
    images: [img('photo-1560806887-1e4cd0b6cbd6', 'sig=apple'), img('photo-1568702846914-96b305d2aaeb', 'sig=apple2')],
    image: img('photo-1560806887-1e4cd0b6cbd6', 'sig=apple'),
    popular: true,
  },
  {
    id: 'mm-tomato',
    aisle: 'produce',
    name: 'طماطم 1 كغم',
    names: n('طماطم 1 كغم', 'Tomatoes 1kg', 'Domates 1 kg'),
    desc: 'محلي',
    descs: n('محلي', 'Local', 'Yerel'),
    price: 1800,
    stock: 35,
    brand: 'M10 Fresh',
    unit: 'kg',
    unitAmount: 1,
    allergens: [],
    variants: [v('1kg', '1 كغم', '1 kg', '1 kg', 1800), v('pcs', 'بالقطعة', 'By piece', 'Adet', 400)],
    image: img('photo-1592924357228-91a4daadcfea', 'sig=tom'),
  },
  {
    id: 'mm-milk',
    aisle: 'dairy',
    name: 'حليب طازج 1 لتر',
    names: n('حليب طازج 1 لتر', 'Fresh milk 1L', 'Taze süt 1 L'),
    desc: 'محلي',
    descs: n('محلي', 'Local', 'Yerel'),
    price: 2250,
    stock: 20,
    brand: 'Almarai',
    unit: 'L',
    unitAmount: 1,
    allergens: ['milk'],
    variants: [v('1l', '1 لتر', '1 L', '1 L', 2250), v('2l', '2 لتر', '2 L', '2 L', 4200)],
    image: img('photo-1563636619-e9143da7973b', 'sig=milk'),
  },
  {
    id: 'mm-eggs',
    aisle: 'dairy',
    name: 'بيض 30 حبة',
    names: n('بيض 30 حبة', 'Eggs 30 pcs', 'Yumurta 30 adet'),
    desc: 'مزرعة',
    descs: n('مزرعة', 'Farm', 'Çiftlik'),
    price: 6500,
    oldPrice: 7500,
    stock: 12,
    brand: 'Farm',
    unit: 'pcs',
    unitAmount: 30,
    allergens: ['eggs'],
    image: img('photo-1587486913049-53fc88980cfc', 'sig=eggs'),
    popular: true,
  },
  {
    id: 'mm-chicken',
    aisle: 'meat',
    name: 'دجاج كامل',
    names: n('دجاج كامل', 'Whole chicken', 'Bütün tavuk'),
    desc: 'طازج مبرد',
    descs: n('طازج مبرد', 'Chilled fresh', 'Soğuk taze'),
    price: 8500,
    stock: 8,
    brand: 'M10 Meat',
    unit: 'kg',
    unitAmount: 1.2,
    allergens: [],
    image: img('photo-1604503468506-a8da13d82791', 'sig=chick'),
  },
  {
    id: 'mm-beef',
    aisle: 'meat',
    name: 'لحم عجل 1 كغم',
    names: n('لحم عجل 1 كغم', 'Beef 1kg', 'Dana eti 1 kg'),
    desc: 'مفروم أو قطع',
    descs: n('مفروم أو قطع', 'Minced or cuts', 'Kıyma veya parça'),
    price: 16000,
    stock: 0,
    substituteId: 'mm-chicken',
    brand: 'M10 Meat',
    unit: 'kg',
    unitAmount: 1,
    allergens: [],
    variants: [v('cut', 'قطع', 'Cuts', 'Parça', 16000), v('mince', 'مفروم', 'Minced', 'Kıyma', 15500)],
    image: img('photo-1603048297172-c92544798d5a', 'sig=beef'),
  },
  {
    id: 'mm-bread',
    aisle: 'bakery',
    name: 'خبز صمون',
    names: n('خبز صمون', 'Samoon bread', 'Samoon ekmek'),
    desc: '10 قطع',
    descs: n('10 قطع', '10 pieces', '10 adet'),
    price: 1500,
    stock: 50,
    brand: 'Local bakery',
    unit: 'pcs',
    unitAmount: 10,
    allergens: ['gluten'],
    image: img('photo-1509440159596-0249088772ff', 'sig=bread'),
  },
  {
    id: 'mm-wt',
    aisle: 'drinks',
    name: 'وايلد تايجر 250 مل',
    names: n('وايلد تايجر 250 مل', 'Wild Tiger 250ml', 'Wild Tiger 250 ml'),
    desc: 'عرض M10',
    descs: n('عرض M10', 'M10 offer', 'M10 fırsatı'),
    price: 750,
    oldPrice: 1000,
    stock: 100,
    brand: 'Wild Tiger',
    unit: 'ml',
    unitAmount: 250,
    allergens: [],
    image: img('photo-1554866585-cd94860890b7', 'sig=wt'),
    popular: true,
  },
  {
    id: 'mm-cola',
    aisle: 'drinks',
    name: 'كولا 1.5 لتر',
    names: n('كولا 1.5 لتر', 'Cola 1.5L', 'Kola 1.5 L'),
    desc: 'بارد',
    descs: n('بارد', 'Chilled', 'Soğuk'),
    price: 2000,
    stock: 30,
    brand: 'Coca-Cola',
    unit: 'L',
    unitAmount: 1.5,
    allergens: [],
    image: img('photo-1629203851122-3726ecdf080e', 'sig=cola'),
  },
  {
    id: 'mm-rice',
    aisle: 'pantry',
    name: 'رز عنبر 5 كغم',
    names: n('رز عنبر 5 كغم', 'Amber rice 5kg', 'Amber pirinç 5 kg'),
    desc: 'عراقي',
    descs: n('عراقي', 'Iraqi', 'Iraklı'),
    price: 12000,
    oldPrice: 14000,
    stock: 15,
    brand: 'Amber',
    unit: 'kg',
    unitAmount: 5,
    allergens: [],
    variants: [v('5kg', '5 كغم', '5 kg', '5 kg', 12000), v('10kg', '10 كغم', '10 kg', '10 kg', 23000)],
    image: img('photo-1586201375761-83865001e31c', 'sig=rice'),
  },
  {
    id: 'mm-pasta',
    aisle: 'pantry',
    name: 'معكرونة 500 غم',
    names: n('معكرونة 500 غم', 'Pasta 500g', 'Makarna 500 g'),
    desc: 'سباغيتي',
    descs: n('سباغيتي', 'Spaghetti', 'Spagetti'),
    price: 1750,
    stock: 0,
    substituteId: 'mm-rice',
    brand: 'Barilla',
    unit: 'g',
    unitAmount: 500,
    allergens: ['gluten', 'eggs'],
    image: img('photo-1621996346565-e3dbc646d9a9', 'sig=pasta'),
  },
  {
    id: 'mm-detergent',
    aisle: 'household',
    name: 'منظف ملابس 3 كغم',
    names: n('منظف ملابس 3 كغم', 'Laundry detergent 3kg', 'Çamaşır deterjanı 3 kg'),
    desc: 'للغسالة',
    descs: n('للغسالة', 'For washer', 'Makine için'),
    price: 9000,
    stock: 18,
    brand: 'Persil',
    unit: 'kg',
    unitAmount: 3,
    allergens: [],
    image: img('photo-1583947215259-38e31be8751f', 'sig=det'),
  },  {
    id: 'mm-cucumber',
    aisle: 'produce',
    name: 'خيار 1 كغم',
    names: n('خيار 1 كغم', 'Cucumber 1kg', 'Salatalık 1 kg'),
    desc: 'طازج',
    descs: n('طازج', 'Fresh', 'Taze'),
    price: 1500,
    stock: 40,
    brand: 'M10 Fresh',
    unit: 'kg',
    unitAmount: 1,
    allergens: [],
    image: img('photo-1587411768638-ec71f8e33b78', 'sig=cuc'),
    popular: true,
  },
  {
    id: 'mm-banana',
    aisle: 'produce',
    name: 'موز 1 كغم',
    names: n('موز 1 كغم', 'Bananas 1kg', 'Muz 1 kg'),
    desc: 'مستورد',
    descs: n('مستورد', 'Imported', 'İthal'),
    price: 2800,
    oldPrice: 3200,
    stock: 30,
    brand: 'M10 Fresh',
    unit: 'kg',
    unitAmount: 1,
    allergens: [],
    image: img('photo-1571771894821-ce9b6c11b08e', 'sig=ban'),
  },
  {
    id: 'mm-onion',
    aisle: 'produce',
    name: 'بصل 1 كغم',
    names: n('بصل 1 كغم', 'Onions 1kg', 'Soğan 1 kg'),
    desc: 'محلي',
    descs: n('محلي', 'Local', 'Yerel'),
    price: 1200,
    stock: 50,
    brand: 'M10 Fresh',
    unit: 'kg',
    unitAmount: 1,
    allergens: [],
    image: img('photo-1518977956812-cd3dbadaaf31', 'sig=oni'),
  },
  {
    id: 'mm-potato',
    aisle: 'produce',
    name: 'بطاطس 1 كغم',
    names: n('بطاطس 1 كغم', 'Potatoes 1kg', 'Patates 1 kg'),
    desc: 'محلي',
    descs: n('محلي', 'Local', 'Yerel'),
    price: 1400,
    stock: 45,
    brand: 'M10 Fresh',
    unit: 'kg',
    unitAmount: 1,
    allergens: [],
    image: img('photo-1518977676601-b53f82aba655', 'sig=pot'),
  },
  {
    id: 'mm-lettuce',
    aisle: 'ready',
    name: 'خس طازج',
    names: n('خس طازج', 'Fresh lettuce', 'Taze marul'),
    desc: 'Ready & Fresh',
    descs: n('جاهز وطازج', 'Ready & Fresh', 'Hazır ve taze'),
    price: 1000,
    stock: 25,
    brand: 'M10 Fresh',
    unit: 'pcs',
    unitAmount: 1,
    allergens: [],
    image: img('photo-1622206151226-18ca2c9ab4a1', 'sig=let'),
    popular: true,
  },
  {
    id: 'mm-salad-mix',
    aisle: 'ready',
    name: 'سلطة مشكلة جاهزة',
    names: n('سلطة مشكلة جاهزة', 'Mixed salad pack', 'Karışık salata'),
    desc: 'Ready & Fresh',
    descs: n('جاهز وطازج', 'Ready & Fresh', 'Hazır ve taze'),
    price: 3500,
    stock: 18,
    brand: 'M10 Fresh',
    unit: 'pcs',
    unitAmount: 1,
    allergens: [],
    image: img('photo-1512621776951-a57141f2eefd', 'sig=sal'),
  },
  {
    id: 'mm-hummus',
    aisle: 'ready',
    name: 'حمص طازج 250 غم',
    names: n('حمص طازج 250 غم', 'Fresh hummus 250g', 'Taze humus 250 g'),
    desc: 'جاهز',
    descs: n('جاهز', 'Ready', 'Hazır'),
    price: 2500,
    stock: 20,
    brand: 'M10 Fresh',
    unit: 'g',
    unitAmount: 250,
    allergens: ['sesame'],
    image: img('photo-1577805947697-89e18249d767', 'sig=hum'),
  },
  {
    id: 'mm-yogurt',
    aisle: 'dairy',
    name: 'لبن زبادي 400 غم',
    names: n('لبن زبادي 400 غم', 'Yogurt 400g', 'Yoğurt 400 g'),
    desc: 'طبيعي',
    descs: n('طبيعي', 'Natural', 'Doğal'),
    price: 1750,
    stock: 28,
    brand: 'Almarai',
    unit: 'g',
    unitAmount: 400,
    allergens: ['milk'],
    image: img('photo-1488477181946-6428a0291777', 'sig=yog'),
  },
  {
    id: 'mm-cheese',
    aisle: 'dairy',
    name: 'جبنة بيضاء 500 غم',
    names: n('جبنة بيضاء 500 غم', 'White cheese 500g', 'Beyaz peynir 500 g'),
    desc: 'طازج',
    descs: n('طازج', 'Fresh', 'Taze'),
    price: 4500,
    oldPrice: 5200,
    stock: 22,
    brand: 'Pinar',
    unit: 'g',
    unitAmount: 500,
    allergens: ['milk'],
    image: img('photo-1486297678162-eb2a19b0a32d', 'sig=che'),
    popular: true,
  },
  {
    id: 'mm-labneh',
    aisle: 'dairy',
    name: 'لبنة 400 غم',
    names: n('لبنة 400 غم', 'Labneh 400g', 'Labne 400 g'),
    desc: 'كريمي',
    descs: n('كريمي', 'Creamy', 'Kremsi'),
    price: 3200,
    stock: 16,
    brand: 'Almarai',
    unit: 'g',
    unitAmount: 400,
    allergens: ['milk'],
    image: img('photo-1628088062854-d1870b4553da', 'sig=lab'),
  },
  {
    id: 'mm-butter',
    aisle: 'dairy',
    name: 'زبدة 200 غم',
    names: n('زبدة 200 غم', 'Butter 200g', 'Tereyağı 200 g'),
    desc: 'غير مملح',
    descs: n('غير مملح', 'Unsalted', 'Tuzsuz'),
    price: 3800,
    stock: 20,
    brand: 'Lurpak',
    unit: 'g',
    unitAmount: 200,
    allergens: ['milk'],
    image: img('photo-1589985270826-4b7bb135bc9d', 'sig=but'),
  },
  {
    id: 'mm-turkey',
    aisle: 'coldcuts',
    name: 'شرائح ديك رومي 200 غم',
    names: n('شرائح ديك رومي 200 غم', 'Turkey slices 200g', 'Hindi dilim 200 g'),
    desc: 'Cold Cuts',
    descs: n('لحوم باردة', 'Cold cuts', 'Şarküteri'),
    price: 5500,
    stock: 14,
    brand: 'M10 Deli',
    unit: 'g',
    unitAmount: 200,
    allergens: [],
    image: img('photo-1607623814075-e51df1bdc82f', 'sig=tur'),
    popular: true,
  },
  {
    id: 'mm-salami',
    aisle: 'coldcuts',
    name: 'سلامي بقري 150 غم',
    names: n('سلامي بقري 150 غم', 'Beef salami 150g', 'Dana salam 150 g'),
    desc: 'Cold Cuts',
    descs: n('لحوم باردة', 'Cold cuts', 'Şarküteri'),
    price: 4800,
    stock: 12,
    brand: 'M10 Deli',
    unit: 'g',
    unitAmount: 150,
    allergens: [],
    image: img('photo-1615937691194-97dbd3f3dc29', 'sig=salami'),
  },
  {
    id: 'mm-mortadella',
    aisle: 'coldcuts',
    name: 'مرتديلا 200 غم',
    names: n('مرتديلا 200 غم', 'Mortadella 200g', 'Mortadella 200 g'),
    desc: 'Cold Cuts',
    descs: n('لحوم باردة', 'Cold cuts', 'Şarküteri'),
    price: 4200,
    oldPrice: 4900,
    stock: 15,
    brand: 'M10 Deli',
    unit: 'g',
    unitAmount: 200,
    allergens: [],
    image: img('photo-1529692236671-f1f6cf9683ba', 'sig=mor'),
  },
  {
    id: 'mm-lamb',
    aisle: 'meat',
    name: 'لحم غنم 1 كغم',
    names: n('لحم غنم 1 كغم', 'Lamb 1kg', 'Kuzu eti 1 kg'),
    desc: 'طازج',
    descs: n('طازج', 'Fresh', 'Taze'),
    price: 22000,
    stock: 6,
    brand: 'M10 Meat',
    unit: 'kg',
    unitAmount: 1,
    allergens: [],
    image: img('photo-1603048297172-c92544798d5a', 'sig=lamb'),
  },
  {
    id: 'mm-mince',
    aisle: 'meat',
    name: 'لحم مفروم 500 غم',
    names: n('لحم مفروم 500 غم', 'Minced meat 500g', 'Kıyma 500 g'),
    desc: 'عجل',
    descs: n('عجل', 'Beef', 'Dana'),
    price: 8500,
    stock: 10,
    brand: 'M10 Meat',
    unit: 'g',
    unitAmount: 500,
    allergens: [],
    image: img('photo-1607623814075-e51df1bdc82f', 'sig=mince'),
    popular: true,
  },
  {
    id: 'mm-croissants',
    aisle: 'bakery',
    name: 'كرواسون 4 قطع',
    names: n('كرواسون 4 قطع', 'Croissants 4 pcs', 'Kruvasan 4 adet'),
    desc: 'طازج يومياً',
    descs: n('طازج يومياً', 'Fresh daily', 'Her gün taze'),
    price: 3000,
    stock: 20,
    brand: 'Local bakery',
    unit: 'pcs',
    unitAmount: 4,
    allergens: ['gluten', 'milk', 'eggs'],
    image: img('photo-1555507036-ab1f4038808a', 'sig=cro'),
  },
  {
    id: 'mm-toast',
    aisle: 'bakery',
    name: 'خبز توست',
    names: n('خبز توست', 'Toast bread', 'Tost ekmeği'),
    desc: 'طري',
    descs: n('طري', 'Soft', 'Yumuşak'),
    price: 2000,
    stock: 35,
    brand: 'Local bakery',
    unit: 'pcs',
    unitAmount: 1,
    allergens: ['gluten'],
    image: img('photo-1509440159596-0249088772ff', 'sig=toast'),
    popular: true,
  },
  {
    id: 'mm-kaak',
    aisle: 'bakery',
    name: 'كعك سادة',
    names: n('كعك سادة', 'Kaak plain', 'Kaak'),
    desc: 'محلي',
    descs: n('محلي', 'Local', 'Yerel'),
    price: 1500,
    stock: 40,
    brand: 'Local bakery',
    unit: 'pcs',
    unitAmount: 6,
    allergens: ['gluten'],
    image: img('photo-1558961363-fa8fdf82db35', 'sig=kaak'),
  },
  {
    id: 'mm-coffee',
    aisle: 'drinks',
    name: 'قهوة مطحونة 200 غم',
    names: n('قهوة مطحونة 200 غم', 'Ground coffee 200g', 'Öğütülmüş kahve 200 g'),
    desc: 'Coffee & Tea',
    descs: n('قهوة وشاي', 'Coffee & tea', 'Kahve ve çay'),
    price: 6500,
    stock: 18,
    brand: 'Nescafe',
    unit: 'g',
    unitAmount: 200,
    allergens: [],
    image: img('photo-1447933601403-0c6688de566e', 'sig=cof'),
    popular: true,
  },
  {
    id: 'mm-tea',
    aisle: 'drinks',
    name: 'شاي أسود 100 كيس',
    names: n('شاي أسود 100 كيس', 'Black tea 100 bags', 'Siyah çay 100 poşet'),
    desc: 'Coffee & Tea',
    descs: n('قهوة وشاي', 'Coffee & tea', 'Kahve ve çay'),
    price: 4500,
    oldPrice: 5200,
    stock: 24,
    brand: 'Ahmad',
    unit: 'pcs',
    unitAmount: 100,
    allergens: [],
    image: img('photo-1564890369478-c89ca6d9cde9', 'sig=tea'),
  },
  {
    id: 'mm-juice',
    aisle: 'drinks',
    name: 'عصير برتقال 1 لتر',
    names: n('عصير برتقال 1 لتر', 'Orange juice 1L', 'Portakal suyu 1 L'),
    desc: 'طازج',
    descs: n('طازج', 'Fresh', 'Taze'),
    price: 2800,
    stock: 22,
    brand: 'Tropicana',
    unit: 'L',
    unitAmount: 1,
    allergens: [],
    image: img('photo-1600271886742-f049cd451bba', 'sig=jui'),
  },
  {
    id: 'mm-water',
    aisle: 'drinks',
    name: 'ماء 1.5 لتر ×6',
    names: n('ماء 1.5 لتر ×6', 'Water 1.5L ×6', 'Su 1.5 L ×6'),
    desc: 'عبوة',
    descs: n('عبوة', 'Pack', 'Paket'),
    price: 3500,
    stock: 40,
    brand: 'Life',
    unit: 'pcs',
    unitAmount: 6,
    allergens: [],
    image: img('photo-1548839140-29a749e1cf4d', 'sig=wat'),
  },
  {
    id: 'mm-cereal',
    aisle: 'pantry',
    name: 'حبوب الإفطار 375 غم',
    names: n('حبوب الإفطار 375 غم', 'Breakfast cereal 375g', 'Kahvaltılık gevreği 375 g'),
    desc: 'Cereal & Spreads',
    descs: n('حبوب ومربى', 'Cereal & spreads', 'Gevrek ve sürme'),
    price: 5200,
    stock: 16,
    brand: 'Kellogg',
    unit: 'g',
    unitAmount: 375,
    allergens: ['gluten'],
    image: img('photo-1534482421-64566f976cfa', 'sig=cer'),
  },
  {
    id: 'mm-nutella',
    aisle: 'pantry',
    name: 'نوتيلا 350 غم',
    names: n('نوتيلا 350 غم', 'Nutella 350g', 'Nutella 350 g'),
    desc: 'Cereal & Spreads',
    descs: n('حبوب ومربى', 'Cereal & spreads', 'Gevrek ve sürme'),
    price: 7500,
    oldPrice: 8500,
    stock: 20,
    brand: 'Ferrero',
    unit: 'g',
    unitAmount: 350,
    allergens: ['nuts', 'milk'],
    image: img('photo-1511381939415-e44015466834', 'sig=nut'),
    popular: true,
  },
  {
    id: 'mm-tuna',
    aisle: 'pantry',
    name: 'تونة معلبة 160 غم',
    names: n('تونة معلبة 160 غم', 'Canned tuna 160g', 'Konserve ton 160 g'),
    desc: 'Cans & Jars',
    descs: n('معلبات', 'Cans & jars', 'Konserve'),
    price: 2200,
    stock: 30,
    brand: 'John West',
    unit: 'g',
    unitAmount: 160,
    allergens: ['fish'],
    image: img('photo-1615141982883-c7ad0e69fd62', 'sig=tuna'),
  },
  {
    id: 'mm-beans',
    aisle: 'pantry',
    name: 'فاصوليا معلبة 400 غم',
    names: n('فاصوليا معلبة 400 غم', 'Canned beans 400g', 'Konserve fasulye 400 g'),
    desc: 'Cans & Jars',
    descs: n('معلبات', 'Cans & jars', 'Konserve'),
    price: 1500,
    stock: 28,
    brand: 'Heirloom',
    unit: 'g',
    unitAmount: 400,
    allergens: [],
    image: img('photo-1596797038530-2c107229654b', 'sig=bean'),
  },
  {
    id: 'mm-flour',
    aisle: 'pantry',
    name: 'طحين أبيض 1 كغم',
    names: n('طحين أبيض 1 كغم', 'White flour 1kg', 'Beyaz un 1 kg'),
    desc: 'Home Baking',
    descs: n('خبز منزلي', 'Home baking', 'Ev fırını'),
    price: 1800,
    stock: 25,
    brand: 'M10',
    unit: 'kg',
    unitAmount: 1,
    allergens: ['gluten'],
    image: img('photo-1574323347407-f5e1ad6d020b', 'sig=flo'),
  },
  {
    id: 'mm-sugar',
    aisle: 'pantry',
    name: 'سكر 1 كغم',
    names: n('سكر 1 كغم', 'Sugar 1kg', 'Şeker 1 kg'),
    desc: 'Home Baking',
    descs: n('خبز منزلي', 'Home baking', 'Ev fırını'),
    price: 1600,
    stock: 40,
    brand: 'M10',
    unit: 'kg',
    unitAmount: 1,
    allergens: [],
    image: img('photo-1587049352846-4a222e784d38', 'sig=sug'),
  },
  {
    id: 'mm-oil',
    aisle: 'pantry',
    name: 'زيت نباتي 1.8 لتر',
    names: n('زيت نباتي 1.8 لتر', 'Cooking oil 1.8L', 'Yemeklik yağ 1.8 L'),
    desc: 'Pasta & Packaged',
    descs: n('مواد غذائية', 'Packaged foods', 'Paketli gıda'),
    price: 5500,
    stock: 18,
    brand: 'Sunny',
    unit: 'L',
    unitAmount: 1.8,
    allergens: [],
    image: img('photo-1474979266404-7eaacbcd87c5', 'sig=oil'),
  },
  {
    id: 'mm-chips',
    aisle: 'snacks',
    name: 'شيبس بطاطا 150 غم',
    names: n('شيبس بطاطا 150 غم', 'Potato chips 150g', 'Patates cipsi 150 g'),
    desc: 'مالح',
    descs: n('مالح', 'Salted', 'Tuzlu'),
    price: 1500,
    oldPrice: 1800,
    stock: 50,
    brand: 'Lays',
    unit: 'g',
    unitAmount: 150,
    allergens: [],
    image: img('photo-1566478989037-eec170784d0b', 'sig=chip'),
    popular: true,
  },
  {
    id: 'mm-biscuits',
    aisle: 'snacks',
    name: 'بسكويت شوكولاتة',
    names: n('بسكويت شوكولاتة', 'Chocolate biscuits', 'Çikolatalı bisküvi'),
    desc: 'علبة',
    descs: n('علبة', 'Pack', 'Paket'),
    price: 2200,
    stock: 35,
    brand: 'Oreo',
    unit: 'pcs',
    unitAmount: 1,
    allergens: ['gluten', 'milk'],
    image: img('photo-1558961363-fa8fdf82db35', 'sig=bis'),
  },
  {
    id: 'mm-nuts',
    aisle: 'snacks',
    name: 'مكسرات مشكلة 250 غم',
    names: n('مكسرات مشكلة 250 غم', 'Mixed nuts 250g', 'Karışık kuruyemiş 250 g'),
    desc: 'محمص',
    descs: n('محمص', 'Roasted', 'Kavrulmuş'),
    price: 6500,
    stock: 12,
    brand: 'M10',
    unit: 'g',
    unitAmount: 250,
    allergens: ['nuts'],
    image: img('photo-1508747703725-719777637510', 'sig=nuts'),
  },
  {
    id: 'mm-icecream',
    aisle: 'frozen',
    name: 'آيس كريم فانيلا',
    names: n('آيس كريم فانيلا', 'Vanilla ice cream', 'Vanilyalı dondurma'),
    desc: '500 مل',
    descs: n('500 مل', '500ml', '500 ml'),
    price: 4500,
    stock: 14,
    brand: 'M10',
    unit: 'ml',
    unitAmount: 500,
    allergens: ['milk'],
    image: img('photo-1563805042-7684c019e1cb', 'sig=ice'),
  },
  {
    id: 'mm-frozen-veg',
    aisle: 'frozen',
    name: 'خضار مجمدة 400 غم',
    names: n('خضار مجمدة 400 غم', 'Frozen veg 400g', 'Donuk sebze 400 g'),
    desc: 'مشكل',
    descs: n('مشكل', 'Mixed', 'Karışık'),
    price: 2800,
    stock: 18,
    brand: 'M10',
    unit: 'g',
    unitAmount: 400,
    allergens: [],
    image: img('photo-1610348725531-843dff563e2c', 'sig=fveg'),
  },
  {
    id: 'mm-soap',
    aisle: 'household',
    name: 'صابون سائل لليدين',
    names: n('صابون سائل لليدين', 'Hand soap', 'Sıvı el sabunu'),
    desc: '500 مل',
    descs: n('500 مل', '500ml', '500 ml'),
    price: 2800,
    stock: 22,
    brand: 'Dettol',
    unit: 'ml',
    unitAmount: 500,
    allergens: [],
    image: img('photo-1600857544200-b2f666a9a2ec', 'sig=soap'),
  },
  {
    id: 'mm-tissue',
    aisle: 'household',
    name: 'مناديل ورقية ×6',
    names: n('مناديل ورقية ×6', 'Tissue packs ×6', 'Kağıt mendil ×6'),
    desc: 'ناعم',
    descs: n('ناعم', 'Soft', 'Yumuşak'),
    price: 4500,
    stock: 20,
    brand: 'Fine',
    unit: 'pcs',
    unitAmount: 6,
    allergens: [],
    image: img('photo-1584556812952-905ffd0c611a', 'sig=tis'),
  },
  {
    id: 'mm-cleaner',
    aisle: 'household',
    name: 'منظف أرضيات 1 لتر',
    names: n('منظف أرضيات 1 لتر', 'Floor cleaner 1L', 'Yer temizleyici 1 L'),
    desc: 'منعش',
    descs: n('منعش', 'Fresh scent', 'Ferah koku'),
    price: 3200,
    stock: 16,
    brand: 'Ajax',
    unit: 'L',
    unitAmount: 1,
    allergens: [],
    image: img('photo-1563453392212-326f5e854473', 'sig=cle'),
  },
  {
    id: 'mm-shampoo',
    aisle: 'personal',
    name: 'شامبو 400 مل',
    names: n('شامبو 400 مل', 'Shampoo 400ml', 'Şampuan 400 ml'),
    desc: 'للشعر',
    descs: n('للشعر', 'For hair', 'Saç için'),
    price: 5500,
    stock: 15,
    brand: 'Head & Shoulders',
    unit: 'ml',
    unitAmount: 400,
    allergens: [],
    image: img('photo-1535585209827-a15fcdbc4c2d', 'sig=sha'),
  },
  {
    id: 'mm-toothpaste',
    aisle: 'personal',
    name: 'معجون أسنان',
    names: n('معجون أسنان', 'Toothpaste', 'Diş macunu'),
    desc: '100 مل',
    descs: n('100 مل', '100ml', '100 ml'),
    price: 2500,
    stock: 30,
    brand: 'Colgate',
    unit: 'ml',
    unitAmount: 100,
    allergens: [],
    image: img('photo-1616394584738-fc6e612e71b9', 'sig=tp'),
  },
  {
    id: 'mm-lamp',
    aisle: 'home',
    tryInRoom: true,
    name: 'مصباح طاولة',
    names: n('مصباح طاولة', 'Table lamp', 'Masa lambası'),
    desc: 'إضاءة دافئة للغرفة',
    descs: n('إضاءة دافئة للغرفة', 'Warm room lighting', 'Sıcak oda aydınlatması'),
    price: 28500,
    stock: 12,
    brand: 'M10 Home',
    unit: 'pcs',
    unitAmount: 1,
    allergens: [],
    image: arCutout('photo-1614635884840-85cf80d23844', 'sig=lamp'),
    arImage: arCutout('photo-1614635884840-85cf80d23844', 'sig=lamp-ar'),
    popular: true,
  },
  {
    id: 'mm-vase',
    aisle: 'home',
    tryInRoom: true,
    name: 'مزهرية سيراميك',
    names: n('مزهرية سيراميك', 'Ceramic vase', 'Seramik vazo'),
    desc: 'ديكور حديث',
    descs: n('ديكور حديث', 'Modern decor', 'Modern dekor'),
    price: 14500,
    stock: 16,
    brand: 'M10 Home',
    unit: 'pcs',
    unitAmount: 1,
    allergens: [],
    image: arCutout('photo-1619117084637-a83c09c6ab5e', 'sig=vase'),
    arImage: arCutout('photo-1619117084637-a83c09c6ab5e', 'sig=vase-ar'),
  },
  {
    id: 'mm-cushion',
    aisle: 'home',
    tryInRoom: true,
    name: 'وسادة ديكور',
    names: n('وسادة ديكور', 'Decor cushion', 'Dekoratif yastık'),
    desc: 'قطن ناعم 45×45',
    descs: n('قطن ناعم 45×45', 'Soft cotton 45×45', 'Yumuşak pamuk 45×45'),
    price: 9800,
    stock: 24,
    brand: 'M10 Home',
    unit: 'pcs',
    unitAmount: 1,
    allergens: [],
    image: arCutout('photo-1584100936595-c0654b55a2e2', 'sig=cushion'),
    arImage: arCutout('photo-1584100936595-c0654b55a2e2', 'sig=cushion-ar'),
  },
  {
    id: 'mm-frame',
    aisle: 'home',
    tryInRoom: true,
    name: 'إطار صورة خشبي',
    names: n('إطار صورة خشبي', 'Wooden photo frame', 'Ahşap fotoğraf çerçevesi'),
    desc: 'A4 / 21×30',
    descs: n('A4 / 21×30', 'A4 / 21×30', 'A4 / 21×30'),
    price: 7500,
    stock: 20,
    brand: 'M10 Home',
    unit: 'pcs',
    unitAmount: 1,
    allergens: [],
    image: arCutout('photo-1578301978693-85fa9c0320b9', 'sig=frame'),
    arImage: arCutout('photo-1578301978693-85fa9c0320b9', 'sig=frame-ar'),
  },
  {
    id: 'mm-plant-pot',
    aisle: 'home',
    tryInRoom: true,
    name: 'أصيص نباتات',
    names: n('أصيص نباتات', 'Plant pot', 'Saksı'),
    desc: 'فخار مع صحن',
    descs: n('فخار مع صحن', 'Terracotta with saucer', 'Tepsi ile terracotta'),
    price: 6500,
    stock: 18,
    brand: 'M10 Home',
    unit: 'pcs',
    unitAmount: 1,
    allergens: [],
    image: arCutout('photo-1485955900006-10f4d324d411', 'sig=pot'),
    arImage: arCutout('photo-1485955900006-10f4d324d411', 'sig=pot-ar'),
  },
  {
    id: 'mm-wall-clock',
    aisle: 'home',
    tryInRoom: true,
    name: 'ساعة حائط',
    names: n('ساعة حائط', 'Wall clock', 'Duvar saati'),
    desc: 'قطر 30 سم',
    descs: n('قطر 30 سم', '30cm diameter', '30 cm çap'),
    price: 16900,
    stock: 10,
    brand: 'M10 Home',
    unit: 'pcs',
    unitAmount: 1,
    allergens: [],
    image: arCutout('photo-1563861826100-9cb868fdbe1c', 'sig=clock'),
    arImage: arCutout('photo-1563861826100-9cb868fdbe1c', 'sig=clock-ar'),
  },
  {
    id: 'mm-tea-cup',
    aisle: 'home',
    tryInRoom: true,
    name: 'فنجان شاي',
    names: n('فنجان شاي', 'Tea cup', 'Çay bardağı'),
    desc: 'سيراميك مع صحن',
    descs: n('سيراميك مع صحن', 'Ceramic with saucer', 'Tabaklı seramik'),
    price: 4200,
    stock: 28,
    brand: 'M10 Home',
    unit: 'pcs',
    unitAmount: 1,
    allergens: [],
    image: arCutout('photo-1571934811356-5cc061b6821f', 'sig=tea'),
    arImage: arCutout('photo-1571934811356-5cc061b6821f', 'sig=tea-ar'),
    popular: true,
  },
  {
    id: 'mm-coffee-cup',
    aisle: 'home',
    tryInRoom: true,
    name: 'فنجان قهوة',
    names: n('فنجان قهوة', 'Coffee cup', 'Kahve bardağı'),
    desc: '250 مل',
    descs: n('250 مل', '250ml tumbler', '250 ml termos bardak'),
    price: 5500,
    stock: 22,
    brand: 'M10 Home',
    unit: 'pcs',
    unitAmount: 1,
    allergens: [],
    image: arCutout('photo-1495474472287-4d71bcdd2085', 'sig=coffee'),
    arImage: arCutout('photo-1495474472287-4d71bcdd2085', 'sig=coffee-ar'),
  },
  {
    id: 'mm-artificial-tree',
    aisle: 'home',
    tryInRoom: true,
    name: 'شجرة صناعية',
    names: n('شجرة صناعية', 'Artificial indoor tree', 'Yapay ağaç'),
    desc: 'ديكور داخلي — 120 سم',
    descs: n('ديكور داخلي — 120 سم', 'Indoor decor — 120cm', 'İç mekan dekor — 120 cm'),
    price: 38500,
    stock: 8,
    brand: 'M10 Home',
    unit: 'pcs',
    unitAmount: 1,
    allergens: [],
    image: arCutout('photo-1747097950921-c470422d2a98', 'sig=artree'),
    arImage: arCutout('photo-1747097950921-c470422d2a98', 'sig=artree-ar'),
    popular: true,
  },
  {
    id: 'mm-artificial-flower',
    aisle: 'home',
    tryInRoom: true,
    name: 'زهرة صناعية',
    names: n('زهرة صناعية', 'Artificial flower bouquet', 'Yapay çiçek'),
    desc: 'باقة في مزهرية',
    descs: n('باقة في مزهرية', 'Bouquet in vase', 'Saksılı yapay çiçek buketi'),
    price: 12500,
    stock: 14,
    brand: 'M10 Home',
    unit: 'pcs',
    unitAmount: 1,
    allergens: [],
    image: arCutout('photo-1487530811176-3780de880c2d', 'sig=artflower'),
    arImage: arCutout('photo-1487530811176-3780de880c2d', 'sig=artflower-ar'),
  },
  // Recipe pantry staples (TheMealDB demos)
  {
    id: 'mm-garlic',
    aisle: 'produce',
    name: 'ثوم طازج',
    names: n('ثوم طازج', 'Fresh garlic', 'Taze sarımsak'),
    desc: 'رأس',
    descs: n('رأس', 'Bulb', 'Baş'),
    price: 1000,
    stock: 40,
    brand: 'M10 Fresh',
    unit: 'pcs',
    unitAmount: 1,
    allergens: [],
    image: img('photo-1549890762-0a3f9e7e4d0b', 'sig=garlic'),
  },
  {
    id: 'mm-carrot',
    aisle: 'produce',
    name: 'جزر 1 كغم',
    names: n('جزر 1 كغم', 'Carrots 1kg', 'Havuç 1 kg'),
    desc: 'طازج',
    descs: n('طازج', 'Fresh', 'Taze'),
    price: 1400,
    stock: 35,
    brand: 'M10 Fresh',
    unit: 'kg',
    unitAmount: 1,
    allergens: [],
    image: img('photo-1598170845058-32b9d6a5da37', 'sig=carrot'),
  },
  {
    id: 'mm-bell-pepper',
    aisle: 'produce',
    name: 'فلفل رومي',
    names: n('فلفل رومي', 'Bell peppers', 'Dolmalık biber'),
    desc: 'ملون',
    descs: n('ملون', 'Mixed colors', 'Karışık renk'),
    price: 2200,
    stock: 28,
    brand: 'M10 Fresh',
    unit: 'kg',
    unitAmount: 0.5,
    allergens: [],
    image: img('photo-1563565375-f3fdfdbefa83', 'sig=pepper'),
  },
  {
    id: 'mm-mushroom',
    aisle: 'produce',
    name: 'فطر طازج 250 غم',
    names: n('فطر طازج 250 غم', 'Mushrooms 250g', 'Mantar 250 g'),
    desc: 'أبيض',
    descs: n('أبيض', 'White', 'Beyaz'),
    price: 3200,
    stock: 22,
    brand: 'M10 Fresh',
    unit: 'g',
    unitAmount: 250,
    allergens: [],
    image: img('photo-1506976785307-45a436730033', 'sig=mush'),
  },
  {
    id: 'mm-avocado',
    aisle: 'produce',
    name: 'أفوكادو',
    names: n('أفوكادو', 'Avocado', 'Avokado'),
    desc: 'ناضج',
    descs: n('ناضج', 'Ripe', 'Olgun'),
    price: 2500,
    stock: 18,
    brand: 'M10 Fresh',
    unit: 'pcs',
    unitAmount: 1,
    allergens: [],
    image: img('photo-1523049673857-eb18f1d7b578', 'sig=avo'),
  },
  {
    id: 'mm-lemon',
    aisle: 'produce',
    name: 'ليمون 1 كغم',
    names: n('ليمون 1 كغم', 'Lemons 1kg', 'Limon 1 kg'),
    desc: 'حامض',
    descs: n('حامض', 'Tangy', 'Ekşi'),
    price: 2000,
    stock: 30,
    brand: 'M10 Fresh',
    unit: 'kg',
    unitAmount: 1,
    allergens: [],
    image: img('photo-1582979512210-99b6a8660445', 'sig=lemon'),
  },
  {
    id: 'mm-lime',
    aisle: 'produce',
    name: 'ليمون أخضر',
    names: n('ليمون أخضر', 'Limes', 'Misket limonu'),
    desc: 'طازج',
    descs: n('طازج', 'Fresh', 'Taze'),
    price: 2200,
    stock: 24,
    brand: 'M10 Fresh',
    unit: 'kg',
    unitAmount: 0.5,
    allergens: [],
    image: img('photo-1590502593747-42a996133562', 'sig=lime'),
  },
  {
    id: 'mm-spring-onion',
    aisle: 'produce',
    name: 'بصل أخضر',
    names: n('بصل أخضر', 'Spring onions', 'Taze soğan'),
    desc: 'حزمة',
    descs: n('حزمة', 'Bunch', 'Demet'),
    price: 900,
    stock: 30,
    brand: 'M10 Fresh',
    unit: 'pcs',
    unitAmount: 1,
    allergens: [],
    image: img('photo-1508747703725-719777637510', 'sig=spring'),
  },
  {
    id: 'mm-soy',
    aisle: 'pantry',
    name: 'صلصة صويا 500 مل',
    names: n('صلصة صويا 500 مل', 'Soy sauce 500ml', 'Soya sosu 500 ml'),
    desc: 'آسيوي',
    descs: n('آسيوي', 'Asian', 'Asya'),
    price: 3500,
    stock: 25,
    brand: 'Kikkoman',
    unit: 'ml',
    unitAmount: 500,
    allergens: ['gluten'],
    image: img('photo-1472476443507-c7a5948772fc', 'sig=soy'),
  },
  {
    id: 'mm-olive-oil',
    aisle: 'pantry',
    name: 'زيت زيتون 500 مل',
    names: n('زيت زيتون 500 مل', 'Olive oil 500ml', 'Zeytinyağı 500 ml'),
    desc: 'بكر',
    descs: n('بكر', 'Extra virgin', 'Sızma'),
    price: 7500,
    stock: 20,
    brand: 'M10 Pantry',
    unit: 'ml',
    unitAmount: 500,
    allergens: [],
    image: img('photo-1474979266404-7eaacbcd87c5', 'sig=oliveoil'),
  },
  {
    id: 'mm-sesame-oil',
    aisle: 'pantry',
    name: 'زيت سمسم 250 مل',
    names: n('زيت سمسم 250 مل', 'Sesame oil 250ml', 'Susam yağı 250 ml'),
    desc: 'محمّص',
    descs: n('محمّص', 'Toasted', 'Kavrulmuş'),
    price: 4500,
    stock: 16,
    brand: 'M10 Pantry',
    unit: 'ml',
    unitAmount: 250,
    allergens: ['sesame'],
    image: img('photo-1606923829579-0cb981a83e2e', 'sig=sesame'),
  },
  {
    id: 'mm-ginger',
    aisle: 'produce',
    name: 'زنجبيل طازج',
    names: n('زنجبيل طازج', 'Fresh ginger', 'Taze zencefil'),
    desc: 'جذر',
    descs: n('جذر', 'Root', 'Kök'),
    price: 1800,
    stock: 20,
    brand: 'M10 Fresh',
    unit: 'g',
    unitAmount: 200,
    allergens: [],
    image: img('photo-1599940824399-b87987ceb72a', 'sig=ginger'),
  },
  {
    id: 'mm-cornstarch',
    aisle: 'pantry',
    name: 'نشا ذرة 400 غم',
    names: n('نشا ذرة 400 غم', 'Cornstarch 400g', 'Mısır nişastası 400 g'),
    desc: 'طبخ',
    descs: n('طبخ', 'Cooking', 'Yemeklik'),
    price: 2000,
    stock: 22,
    brand: 'M10 Pantry',
    unit: 'g',
    unitAmount: 400,
    allergens: [],
    image: img('photo-1621939514649-280e2ee25f60', 'sig=starch'),
  },
  {
    id: 'mm-spaghetti',
    aisle: 'pantry',
    name: 'سباغيتي 500 غم',
    names: n('سباغيتي 500 غم', 'Spaghetti 500g', 'Spagetti 500 g'),
    desc: 'إيطالي',
    descs: n('إيطالي', 'Italian', 'İtalyan'),
    price: 2000,
    stock: 40,
    brand: 'Barilla',
    unit: 'g',
    unitAmount: 500,
    allergens: ['gluten'],
    image: img('photo-1621996346565-e3dbc646d9a9', 'sig=spag'),
  },
  {
    id: 'mm-penne',
    aisle: 'pantry',
    name: 'بيني 500 غم',
    names: n('بيني 500 غم', 'Penne 500g', 'Penne 500 g'),
    desc: 'معكرونة',
    descs: n('معكرونة', 'Pasta', 'Makarna'),
    price: 2000,
    stock: 35,
    brand: 'Barilla',
    unit: 'g',
    unitAmount: 500,
    allergens: ['gluten'],
    image: img('photo-1608897013039-887f21d8c804', 'sig=penne'),
  },
  {
    id: 'mm-lasagne',
    aisle: 'pantry',
    name: 'ورق لازانيا 500 غم',
    names: n('ورق لازانيا 500 غم', 'Lasagne sheets 500g', 'Lazanya yaprağı 500 g'),
    desc: 'فرن',
    descs: n('فرن', 'Oven', 'Fırın'),
    price: 3500,
    stock: 18,
    brand: 'Barilla',
    unit: 'g',
    unitAmount: 500,
    allergens: ['gluten', 'eggs'],
    image: img('photo-1574894709920-11b28e7367e3', 'sig=las'),
  },
  {
    id: 'mm-tomato-paste',
    aisle: 'pantry',
    name: 'معجون طماطم 400 غم',
    names: n('معجون طماطم 400 غم', 'Tomato paste 400g', 'Domates salçası 400 g'),
    desc: 'مركز',
    descs: n('مركز', 'Concentrated', 'Konsantre'),
    price: 1800,
    stock: 30,
    brand: 'M10 Pantry',
    unit: 'g',
    unitAmount: 400,
    allergens: [],
    image: img('photo-1472476443507-c7a5948772fc', 'sig=paste'),
  },
  {
    id: 'mm-canned-tomato',
    aisle: 'pantry',
    name: 'طماطم معلبة 400 غم',
    names: n('طماطم معلبة 400 غم', 'Canned tomatoes 400g', 'Konserve domates 400 g'),
    desc: 'مقطعة',
    descs: n('مقطعة', 'Chopped', 'Doğranmış'),
    price: 1500,
    stock: 40,
    brand: 'M10 Pantry',
    unit: 'g',
    unitAmount: 400,
    allergens: [],
    image: img('photo-1592924357228-91a4daadcfea', 'sig=cantom'),
  },
  {
    id: 'mm-parmesan',
    aisle: 'dairy',
    name: 'جبن بارميزان 200 غم',
    names: n('جبن بارميزان 200 غم', 'Parmesan 200g', 'Parmesan 200 g'),
    desc: 'مبشور',
    descs: n('مبشور', 'Grated', 'Rendelenmiş'),
    price: 6500,
    stock: 14,
    brand: 'M10 Dairy',
    unit: 'g',
    unitAmount: 200,
    allergens: ['milk'],
    image: img('photo-1486297678162-eb2a19b0a32d', 'sig=parm'),
  },
  {
    id: 'mm-mozzarella',
    aisle: 'dairy',
    name: 'موزاريلا 200 غم',
    names: n('موزاريلا 200 غم', 'Mozzarella 200g', 'Mozzarella 200 g'),
    desc: 'طازج',
    descs: n('طازج', 'Fresh', 'Taze'),
    price: 4500,
    stock: 16,
    brand: 'M10 Dairy',
    unit: 'g',
    unitAmount: 200,
    allergens: ['milk'],
    image: img('photo-1618164436269-4473940d1f5d', 'sig=moz'),
  },
  {
    id: 'mm-sour-cream',
    aisle: 'dairy',
    name: 'قشدة حامضة 200 غم',
    names: n('قشدة حامضة 200 غم', 'Sour cream 200g', 'Ekşi krema 200 g'),
    desc: 'طبخ',
    descs: n('طبخ', 'Cooking', 'Yemeklik'),
    price: 2800,
    stock: 18,
    brand: 'M10 Dairy',
    unit: 'g',
    unitAmount: 200,
    allergens: ['milk'],
    image: img('photo-1628088062854-d1870b4553da', 'sig=sour'),
  },
  {
    id: 'mm-coconut-milk',
    aisle: 'pantry',
    name: 'حليب جوز هند 400 مل',
    names: n('حليب جوز هند 400 مل', 'Coconut milk 400ml', 'Hindistan cevizi sütü 400 ml'),
    desc: 'معلب',
    descs: n('معلب', 'Canned', 'Konserve'),
    price: 3000,
    stock: 20,
    brand: 'M10 Pantry',
    unit: 'ml',
    unitAmount: 400,
    allergens: [],
    image: img('photo-1550583724-b2692b85b150', 'sig=coco'),
  },
  {
    id: 'mm-chili-flakes',
    aisle: 'pantry',
    name: 'رقائق فلفل حار',
    names: n('رقائق فلفل حار', 'Chili flakes', 'Pul biber'),
    desc: 'توابل',
    descs: n('توابل', 'Spice', 'Baharat'),
    price: 1500,
    stock: 40,
    brand: 'M10 Spice',
    unit: 'g',
    unitAmount: 50,
    allergens: [],
    image: img('photo-1596040033229-a0b44cfd2e1b', 'sig=chili'),
  },
  {
    id: 'mm-oregano',
    aisle: 'pantry',
    name: 'أوريغانو مجفف',
    names: n('أوريغانو مجفف', 'Dried oregano', 'Kuru kekik'),
    desc: 'توابل',
    descs: n('توابل', 'Spice', 'Baharat'),
    price: 1200,
    stock: 35,
    brand: 'M10 Spice',
    unit: 'g',
    unitAmount: 40,
    allergens: [],
    image: img('photo-1596040033229-a0b44cfd2e1b', 'sig=oreg'),
  },
  {
    id: 'mm-cajun',
    aisle: 'pantry',
    name: 'بهار كاجون',
    names: n('بهار كاجون', 'Cajun seasoning', 'Cajun baharatı'),
    desc: 'خليط',
    descs: n('خليط', 'Blend', 'Karışım'),
    price: 2500,
    stock: 20,
    brand: 'M10 Spice',
    unit: 'g',
    unitAmount: 80,
    allergens: [],
    image: img('photo-1596040033229-a0b44cfd2e1b', 'sig=cajun'),
  },
  {
    id: 'mm-basil',
    aisle: 'produce',
    name: 'ريحان طازج',
    names: n('ريحان طازج', 'Fresh basil', 'Taze fesleğen'),
    desc: 'حزمة',
    descs: n('حزمة', 'Bunch', 'Demet'),
    price: 1500,
    stock: 15,
    brand: 'M10 Fresh',
    unit: 'pcs',
    unitAmount: 1,
    allergens: [],
    image: img('photo-1618375569901-3ebe1f7b4530', 'sig=basil'),
  },
  {
    id: 'mm-olives',
    aisle: 'pantry',
    name: 'زيتون أسود 300 غم',
    names: n('زيتون أسود 300 غم', 'Black olives 300g', 'Siyah zeytin 300 g'),
    desc: 'منزوع النوى',
    descs: n('منزوع النوى', 'Pitted', 'Çekirdeksiz'),
    price: 3200,
    stock: 22,
    brand: 'M10 Pantry',
    unit: 'g',
    unitAmount: 300,
    allergens: [],
    image: img('photo-1474978449474-4e0ce9e0e28b', 'sig=olives'),
  },
  {
    id: 'mm-salmon',
    aisle: 'meat',
    name: 'سلمون طازج 350 غم',
    names: n('سلمون طازج 350 غم', 'Fresh salmon 350g', 'Taze somon 350 g'),
    desc: 'مبرد',
    descs: n('مبرد', 'Chilled', 'Soğuk'),
    price: 14000,
    stock: 10,
    brand: 'M10 Meat',
    unit: 'g',
    unitAmount: 350,
    allergens: ['fish'],
    image: img('photo-1519708227418-c8fd9a32b7a2', 'sig=salmon'),
  },
  {
    id: 'mm-white-fish',
    aisle: 'meat',
    name: 'سمك أبيض فيليه',
    names: n('سمك أبيض فيليه', 'White fish fillets', 'Beyaz balık fileto'),
    desc: '4 قطع',
    descs: n('4 قطع', '4 pieces', '4 adet'),
    price: 9000,
    stock: 12,
    brand: 'M10 Meat',
    unit: 'pcs',
    unitAmount: 4,
    allergens: ['fish'],
    image: img('photo-1519708227418-c8fd9a32b7a2', 'sig=wfish'),
  },
  {
    id: 'mm-tortilla',
    aisle: 'bakery',
    name: 'تورتيلا قمح 8 قطع',
    names: n('تورتيلا قمح 8 قطع', 'Flour tortillas 8pcs', 'Un tortilla 8 adet'),
    desc: 'ناعم',
    descs: n('ناعم', 'Soft', 'Yumuşak'),
    price: 2800,
    stock: 25,
    brand: 'M10 Bakery',
    unit: 'pcs',
    unitAmount: 8,
    allergens: ['gluten'],
    image: img('photo-1565299585323-38d6b0865b47', 'sig=tort'),
  },
  {
    id: 'mm-bacon',
    aisle: 'coldcuts',
    name: 'لحم مقدد 200 غم',
    names: n('لحم مقدد 200 غم', 'Bacon 200g', 'Bacon 200 g'),
    desc: 'مدخّن',
    descs: n('مدخّن', 'Smoked', 'Tütsülenmiş'),
    price: 5500,
    stock: 14,
    brand: 'M10 Meat',
    unit: 'g',
    unitAmount: 200,
    allergens: [],
    image: img('photo-1606851094856-0f39a1f0c0e0', 'sig=bacon'),
  },
  {
    id: 'mm-ham',
    aisle: 'coldcuts',
    name: 'لحم مدخّن 200 غم',
    names: n('لحم مدخّن 200 غم', 'Sliced ham 200g', 'Dilımlı jambon 200 g'),
    desc: 'شرائح',
    descs: n('شرائح', 'Sliced', 'Dilimli'),
    price: 4800,
    stock: 14,
    brand: 'M10 Meat',
    unit: 'g',
    unitAmount: 200,
    allergens: [],
    image: img('photo-1615937691194-97dbd3f3dc29', 'sig=ham'),
  },
  {
    id: 'mm-celery',
    aisle: 'produce',
    name: 'كرفس',
    names: n('كرفس', 'Celery', 'Kereviz'),
    desc: 'سيقان',
    descs: n('سيقان', 'Stalks', 'Sap'),
    price: 1600,
    stock: 20,
    brand: 'M10 Fresh',
    unit: 'pcs',
    unitAmount: 1,
    allergens: [],
    image: img('photo-1584270354949-c26b0d5b4a0c', 'sig=celery'),
  },
  {
    id: 'mm-honey',
    aisle: 'pantry',
    name: 'عسل طبيعي 500 غم',
    names: n('عسل طبيعي 500 غم', 'Natural honey 500g', 'Doğal bal 500 g'),
    desc: 'محلي',
    descs: n('محلي', 'Local', 'Yerel'),
    price: 8000,
    stock: 18,
    brand: 'M10 Pantry',
    unit: 'g',
    unitAmount: 500,
    allergens: [],
    image: img('photo-1587049352846-4a222e784d38', 'sig=honey'),
  },
  {
    id: 'mm-gravy',
    aisle: 'pantry',
    name: 'صلصة لحم جاهزة',
    names: n('صلصة لحم جاهزة', 'Beef gravy', 'Et sosu'),
    desc: 'معلب',
    descs: n('معلب', 'Ready', 'Hazır'),
    price: 2500,
    stock: 20,
    brand: 'M10 Pantry',
    unit: 'ml',
    unitAmount: 400,
    allergens: ['gluten'],
    image: img('photo-1604908176997-125f25cc6f3d', 'sig=gravy'),
  },
  {
    id: 'mm-salsa',
    aisle: 'pantry',
    name: 'صلصة سالسا 300 مل',
    names: n('صلصة سالسا 300 مل', 'Salsa 300ml', 'Salsa 300 ml'),
    desc: 'حارة خفيفة',
    descs: n('حارة خفيفة', 'Mild spicy', 'Hafif acı'),
    price: 2800,
    stock: 22,
    brand: 'M10 Pantry',
    unit: 'ml',
    unitAmount: 300,
    allergens: [],
    image: img('photo-1592924357228-91a4daadcfea', 'sig=salsa'),
  },

].map((p, i) => ({
  ...p,
  // Demo EAN-13 style codes (8690… Turkey GTIN prefix) + optional sku alias
  barcode: p.barcode || `8690${String(100000000 + i).slice(-9)}`,
  sku: p.sku || p.id,
}))

/** Approximate lat/lng for demo map pins (Erbil / Baghdad areas) */
export const AREA_COORDS = {
  ankawa: { lat: 36.2305, lng: 44.0092 },
  عنكاوا: { lat: 36.2305, lng: 44.0092 },
  erbil: { lat: 36.1911, lng: 44.0092 },
  أربيل: { lat: 36.1911, lng: 44.0092 },
  golden: { lat: 36.1918, lng: 44.0145 },
  'golden square': { lat: 36.1918, lng: 44.0145 },
  dora: { lat: 33.2612, lng: 44.3801 },
  دورا: { lat: 33.2612, lng: 44.3801 },
  baghdad: { lat: 33.3152, lng: 44.3661 },
  بغداد: { lat: 33.3152, lng: 44.3661 },
  seyyidiye: { lat: 33.3125, lng: 44.398 },
  السعيدية: { lat: 33.3125, lng: 44.398 },
  zeyyune: { lat: 33.34, lng: 44.41 },
  الزيونة: { lat: 33.34, lng: 44.41 },
}

export const DEFAULT_DEST = { lat: 33.3152, lng: 44.3661 }
export const DEFAULT_STORE_COORDS = { lat: 33.2612, lng: 44.3801 }

export const coordsForAddress = (address) => {
  if (address?.lat != null && address?.lng != null) {
    return { lat: Number(address.lat), lng: Number(address.lng) }
  }
  const area = normPlace(address?.area)
  const city = normPlace(address?.city)
  for (const [key, coords] of Object.entries(AREA_COORDS)) {
    if (area.includes(normPlace(key)) || city.includes(normPlace(key))) return { ...coords }
  }
  return { ...DEFAULT_DEST }
}

export const coordsForStore = (store) => {
  if (store?.lat != null && store?.lng != null) {
    return { lat: Number(store.lat), lng: Number(store.lng) }
  }
  const area = normPlace(store?.area || store?.areaEn)
  const city = normPlace(store?.city || store?.cityEn)
  for (const [key, coords] of Object.entries(AREA_COORDS)) {
    if (area.includes(normPlace(key)) || city.includes(normPlace(key))) return { ...coords }
  }
  return { ...DEFAULT_STORE_COORDS }
}

/** Interpolate courier position from store → destination (progress 0..1) */
export const lerpCoords = (from, to, t) => {
  const p = Math.max(0, Math.min(1, t))
  return {
    lat: from.lat + (to.lat - from.lat) * p,
    lng: from.lng + (to.lng - from.lng) * p,
  }
}

export const user = {
  name: 'أحمد الكاظمي',
  phone: '0770 123 4567',
  points: 1840,
  tier: 'Gold',
  role: 'customer',
  address: {
    label: 'المنزل',
    city: 'أربيل',
    area: 'عنكاوا',
    details: 'شارع 100، بناية 12، طابق 3',
    note: 'اترك الطلب عند الباب',
    lat: 36.2305,
    lng: 44.0092,
  },
}

/** Demo accounts for quick role testing (OTP still 12345) */
export const DEMO_ACCOUNTS = [
  { phone: '0770 123 4567', name: 'أحمد الكاظمي', role: 'customer' },
  { phone: '0771 555 0001', name: 'حسين الموسوي', role: 'courier', nameEn: 'Hussein Al-Mousawi', nameTr: 'Hüseyin El-Musavi' },
  { phone: '0772 999 0000', name: 'M10 Admin', role: 'admin', nameEn: 'M10 Admin', nameTr: 'M10 Admin' },
]

/** Demo PIN for Admin panel when role is not admin */
export const ADMIN_PIN = '1234'

export const rewards = [
  {
    id: 'r1',
    title: 'خصم 2000 د.ع',
    titleEn: '2000 IQD off',
    titleTr: '2000 IQD indirim',
    cost: 500,
    desc: 'على أي طلب فوق 10,000',
    descEn: 'On any order over 10,000',
    descTr: '10.000 üzeri siparişte',
    type: 'discount',
    value: 2000,
  },
  {
    id: 'r2',
    title: 'توصيل مجاني',
    titleEn: 'Free delivery',
    titleTr: 'Ücretsiz teslimat',
    cost: 800,
    desc: 'مرة واحدة خلال 7 أيام',
    descEn: 'Once within 7 days',
    descTr: '7 gün içinde bir kez',
    type: 'freeDelivery',
    value: 0,
  },
  {
    id: 'r3',
    title: 'وايلد تايجر مجاني',
    titleEn: 'Free Wild Tiger',
    titleTr: 'Bedava Wild Tiger',
    cost: 1200,
    desc: 'مع طلب البقالة',
    descEn: 'With a grocery order',
    descTr: 'Market siparişiyle',
    type: 'freeItem',
    value: 750,
    productId: 'mm-wt',
  },
]

export const FREE_DELIVERY_FROM = 25000

export const isInStock = (p) => (p?.stock ?? 99) > 0

/** Home accessories that support live camera try-in-room placement */
export const canTryInRoom = (p) =>
  !!(p && (p.tryInRoom === true || p.aisle === 'home') && arProductImage(p))

export const M10_PLUS = {
  id: 'm10-plus',
  monthlyPrice: 5000,
  durationDays: 30,
  benefits: ['freeDelivery', 'prioritySupport', 'extraPoints'],
}

/** Per-store price/stock overrides on top of shared catalog */
export const storeCatalogOverrides = {
  'm10-dora-mechanic': {
    'mm-wt': { price: 700, oldPrice: 1000, stock: 120 },
    'mm-eggs': { price: 6200, oldPrice: 7500 },
    'mm-milk': { price: 2100, stock: 40 },
    'mm-apples': { price: 2400 },
    'mm-cheese': { price: 4300, oldPrice: 5200 },
    'mm-nutella': { price: 7200, oldPrice: 8500 },
    'mm-chips': { price: 1400, oldPrice: 1800 },
  },
  'm10-dora-carsi': {
    'mm-milk': { price: 2350 },
    'mm-cola': { price: 1850 },
    'mm-rice': { price: 11800, oldPrice: 14000 },
    'mm-beef': { stock: 6 },
    'mm-pasta': { stock: 10 },
    'mm-tomato': { price: 1700 },
  },
  'm10-seyyidiye': {
    'mm-rice': { price: 11200, oldPrice: 14000 },
    'mm-pasta': { stock: 14, price: 1650 },
    'mm-detergent': { price: 8600 },
    'mm-chicken': { price: 8200 },
    'mm-bread': { price: 1400 },
    'mm-eggs': { price: 6800, oldPrice: 7500 },
    exclude: ['mm-wt'],
  },
  'm10-zeyyune': {
    'mm-cola': { price: 1900 },
    'mm-apples': { price: 2300 },
    'mm-tomato': { stock: 0, substituteId: 'mm-apples' },
    'mm-milk': { price: 2200, stock: 12 },
    'mm-wt': { price: 750, oldPrice: 1000, stock: 40 },
    'mm-detergent': { stock: 0, substituteId: 'mm-cola' },
  },
}

export const applyStoreOverrides = (storeId, list) => {
  const sid = LEGACY_STORE_IDS[storeId] || storeId
  const ov = storeCatalogOverrides[sid] || {}
  const exclude = new Set(ov.exclude || [])
  return list
    .filter((p) => !exclude.has(p.id) && !p.disabled)
    .map((p) => {
      const patch = ov[p.id]
      if (!patch) return { ...p }
      const next = { ...p, ...patch }
      if (patch.price != null && patch.price !== p.price) next.basePrice = p.price
      if (patch.variants) next.variants = patch.variants
      return next
    })
}

export const products = Object.fromEntries(
  stores.map((s) => [s.id, s.comingSoon ? [] : applyStoreOverrides(s.id, catalog)]),
)

export const deliveryFeeFor = (store, subtotal, coupon, opts = {}) => {
  if (!store) return 0
  if (opts.plusActive) return 0
  if (coupon?.type === 'freeDelivery') return 0
  if ((store.fee || 0) === 0) return 0
  const threshold = store.freeDeliveryFrom ?? FREE_DELIVERY_FROM
  if (threshold > 0 && subtotal >= threshold) return 0
  return store.fee || 0
}

export const discountFor = (subtotal, coupon) => {
  if (!coupon || coupon.type !== 'discount') return 0
  return Math.min(coupon.value || 0, subtotal)
}

export const resolveStoreId = (id) => LEGACY_STORE_IDS[id] || id

export const getStore = (id) => stores.find((s) => s.id === resolveStoreId(id))
export const getProducts = (storeId) => products[resolveStoreId(storeId)] || catalog
export const getProduct = (storeId, productId) =>
  getProducts(storeId).find((p) => p.id === productId)

export const getSubstitute = (storeId, product) => {
  if (!product?.substituteId) return null
  return getProduct(storeId, product.substituteId)
}

export const buyAgainIds = (orders = [], storeId) => {
  const sid = resolveStoreId(storeId)
  const counts = {}
  for (const o of orders) {
    if (!o || o.status === 'cancelled') continue
    if (resolveStoreId(o.storeId) !== sid) continue
    for (const item of o.items || []) {
      if (!item?.productId) continue
      counts[item.productId] = (counts[item.productId] || 0) + (item.qty || 1)
    }
  }
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([id]) => id)
}

/** Personalized feed: order history → aisle neighbors → deals → popular */
export const recommendProducts = (storeId, { orders = [], favorites = [], limit = 8, products: productsOverride } = {}) => {
  const sid = resolveStoreId(storeId)
  const list = productsOverride || getProducts(sid)
  const byId = Object.fromEntries(list.map((p) => [p.id, p]))
  const seen = new Set()
  const out = []
  const push = (id) => {
    if (!id || seen.has(id) || !byId[id] || !isInStock(byId[id])) return
    seen.add(id)
    out.push(byId[id])
  }

  for (const id of buyAgainIds(orders, sid)) {
    push(id)
    if (out.length >= limit) return out
  }

  const orderedAisles = new Set()
  for (const o of orders) {
    if (o?.status === 'cancelled') continue
    for (const item of o.items || []) {
      const p = byId[item.productId]
      if (p?.aisle) orderedAisles.add(p.aisle)
    }
  }
  for (const p of list) {
    if (orderedAisles.has(p.aisle) && p.oldPrice) push(p.id)
    if (out.length >= limit) return out
  }
  for (const p of list) {
    if (orderedAisles.has(p.aisle)) push(p.id)
    if (out.length >= limit) return out
  }
  for (const p of list.filter((x) => x.oldPrice)) {
    push(p.id)
    if (out.length >= limit) return out
  }
  const favStore = favorites?.[0] ? getProducts(favorites[0]) : []
  for (const p of favStore) {
    push(p.id)
    if (out.length >= limit) return out
  }
  for (const p of list) {
    push(p.id)
    if (out.length >= limit) return out
  }
  return out
}

export const REFERRAL_BONUS = 200
export const REFERRAL_REDEEM_BONUS = 150
export const WALLET_TOPUPS = [5000, 10000, 25000]

export const seedRecipes = [
  {
    id: 'recipe-teriyaki',
    kind: 'recipe',
    mealDbId: '52772',
    titleAr: 'طاجن دجاج تيرياكي',
    titleEn: 'Teriyaki Chicken Casserole',
    titleTr: 'Teriyaki tavuk güveç',
    emoji: '🍗',
    durationMin: 55,
    image: 'https://www.themealdb.com/images/media/meals/wvpsxx1468256321.jpg',
    youtube: 'https://www.youtube.com/watch?v=4aZr5hZXP_s',
    storeId: DEFAULT_STORE_ID,
    items: [
      { productId: 'mm-chicken', qty: 1 },
      { productId: 'mm-rice', qty: 1 },
      { productId: 'mm-soy', qty: 1 },
      { productId: 'mm-garlic', qty: 1 },
      { productId: 'mm-ginger', qty: 1 },
      { productId: 'mm-frozen-veg', qty: 1 },
      { productId: 'mm-sugar', qty: 1 },
      { productId: 'mm-cornstarch', qty: 1 },
    ],
    stepsEn: [
      'Preheat oven to 350°F and spray a baking pan.',
      'Simmer soy sauce, water, brown sugar, ginger and garlic; thicken with cornstarch.',
      'Bake chicken with sauce ~35 min, then shred.',
      'Add cooked vegetables and rice, toss with remaining sauce, bake 15 min more.',
    ],
    stepsTr: [
      'Fırını 175°C’ye ısıtın, tepsiyi yağlayın.',
      'Soya, su, şeker, zencefil ve sarımsağı kaynatıp nişasta ile koyulaştırın.',
      'Tavuğu sosla ~35 dk pişirip didikleyin.',
      'Sebze ve pirinci ekleyip 15 dk daha fırınlayın.',
    ],
    stepsAr: [
      'سخّن الفرن ورشّ الصينية.',
      'اغلي الصويا والسكر والزنجبيل والثوم وثخّن بالنشا.',
      'اخبز الدجاج مع الصلصة ثم قطّعه.',
      'أضف الخضار والأرز واخبز 15 دقيقة إضافية.',
    ],
  },
  {
    id: 'recipe-stew-chicken',
    kind: 'recipe',
    mealDbId: '52940',
    titleAr: 'دجاج ستيو بني',
    titleEn: 'Brown Stew Chicken',
    titleTr: 'Kahverengi tavuk yahnisi',
    emoji: '🥘',
    durationMin: 75,
    image: 'https://www.themealdb.com/images/media/meals/sypxpx1515365095.jpg',
    youtube: 'https://www.youtube.com/watch?v=_gFB1fkNhXs',
    storeId: DEFAULT_STORE_ID,
    items: [
      { productId: 'mm-chicken', qty: 1 },
      { productId: 'mm-tomato', qty: 1 },
      { productId: 'mm-onion', qty: 1 },
      { productId: 'mm-garlic', qty: 1 },
      { productId: 'mm-bell-pepper', qty: 1 },
      { productId: 'mm-carrot', qty: 1 },
      { productId: 'mm-lime', qty: 1 },
      { productId: 'mm-soy', qty: 1 },
      { productId: 'mm-oil', qty: 1 },
      { productId: 'mm-coconut-milk', qty: 1 },
    ],
    stepsEn: [
      'Rub chicken with lime, then marinate with tomato, onion, garlic, pepper, thyme and soy.',
      'Brown chicken pieces in hot oil; reserve marinade.',
      'Return chicken with marinade and carrots; simmer 10 min.',
      'Stir in coconut milk mixture and cook gently until tender (~20 min).',
    ],
    stepsTr: [
      'Tavuğu limonla ovun; domates, soğan, sarımsak, biber ve soya ile marine edin.',
      'Parçaları yağda mühürleyin.',
      'Marine ve havuçla 10 dk pişirin.',
      'Hindistan cevizi sütü ekleyip yumuşayana kadar kısık ateşte pişirin.',
    ],
    stepsAr: [
      'دلّك الدجاج بالليمون وتمرّنه مع الخضار والصويا.',
      'حمّر القطع بالزيت.',
      'أرجع التتبيلة والجزر واطبخ 10 دقائق.',
      'أضف حليب جوز الهند حتى ينضج.',
    ],
  },
  {
    id: 'recipe-bolognese',
    kind: 'recipe',
    mealDbId: '52770',
    titleAr: 'سباغيتي بولونيز',
    titleEn: 'Spaghetti Bolognese',
    titleTr: 'Spagetti Bolonez',
    emoji: '🍝',
    durationMin: 45,
    image: 'https://www.themealdb.com/images/media/meals/sutysw1468247559.jpg',
    youtube: 'https://www.youtube.com/watch?v=-gF8d-fitkU',
    storeId: DEFAULT_STORE_ID,
    items: [
      { productId: 'mm-spaghetti', qty: 1 },
      { productId: 'mm-mince', qty: 1 },
      { productId: 'mm-onion', qty: 1 },
      { productId: 'mm-garlic', qty: 1 },
      { productId: 'mm-mushroom', qty: 1 },
      { productId: 'mm-canned-tomato', qty: 1 },
      { productId: 'mm-tomato-paste', qty: 1 },
      { productId: 'mm-olive-oil', qty: 1 },
      { productId: 'mm-oregano', qty: 1 },
      { productId: 'mm-parmesan', qty: 1 },
    ],
    stepsEn: [
      'Fry onion in oil, add garlic and mince until browned; add mushrooms and oregano.',
      'Stir in tomatoes, stock and tomato puree; simmer 30 min.',
      'Cook spaghetti, drain, toss with sauce and serve with Parmesan.',
    ],
    stepsTr: [
      'Soğanı yağda kavurun; sarımsak ve kıymayı ekleyip mühürleyin, mantar ve kekik ekleyin.',
      'Domates ve salçayla 30 dk kaynatın.',
      'Spagettiyi haşlayıp sosla karıştırın; Parmesan ile servis edin.',
    ],
    stepsAr: [
      'اقلي البصل والثوم واللحم المفروم مع الفطر.',
      'أضف الطماطم واتركها على نار هادئة 30 دقيقة.',
      'اسلقي السباغيتي وقدّمي مع البارميزان.',
    ],
  },
  {
    id: 'recipe-arrabiata',
    kind: 'recipe',
    mealDbId: '52771',
    titleAr: 'بيني أرابياتا حار',
    titleEn: 'Spicy Arrabiata Penne',
    titleTr: 'Acılı Arrabbiata penne',
    emoji: '🌶️',
    durationMin: 25,
    image: 'https://www.themealdb.com/images/media/meals/ustsqw1468250014.jpg',
    youtube: 'https://www.youtube.com/watch?v=1IszT_guI08',
    storeId: DEFAULT_STORE_ID,
    items: [
      { productId: 'mm-penne', qty: 1 },
      { productId: 'mm-olive-oil', qty: 1 },
      { productId: 'mm-garlic', qty: 1 },
      { productId: 'mm-canned-tomato', qty: 1 },
      { productId: 'mm-chili-flakes', qty: 1 },
      { productId: 'mm-oregano', qty: 1 },
      { productId: 'mm-basil', qty: 1 },
      { productId: 'mm-parmesan', qty: 1 },
    ],
    stepsEn: [
      'Boil penne until al dente.',
      'Sauté garlic in olive oil; add tomatoes, chili flakes and seasoning; simmer 5 min.',
      'Toss pasta with sauce, finish with basil and Parmesan.',
    ],
    stepsTr: [
      'Penneyi al dente haşlayın.',
      'Zeytinyağında sarımsak kavurup domates ve pul biberle 5 dk pişirin.',
      'Makarnayı sosla karıştırıp fesleğen ve Parmesan ekleyin.',
    ],
    stepsAr: [
      'اسلقي المعكرونة.',
      'اقلي الثوم بالزيت وأضيفي الطماطم والفلفل الحار.',
      'اخلطي مع الريحان والبارميزان.',
    ],
  },
  {
    id: 'recipe-kung-pao',
    kind: 'recipe',
    mealDbId: '52945',
    titleAr: 'دجاج كونغ باو',
    titleEn: 'Kung Pao Chicken',
    titleTr: 'Kung Pao tavuk',
    emoji: '🥡',
    durationMin: 40,
    image: 'https://www.themealdb.com/images/media/meals/1525872624.jpg',
    youtube: 'https://www.youtube.com/watch?v=QqdcCHQlOe0',
    storeId: DEFAULT_STORE_ID,
    items: [
      { productId: 'mm-chicken', qty: 1 },
      { productId: 'mm-soy', qty: 1 },
      { productId: 'mm-sesame-oil', qty: 1 },
      { productId: 'mm-cornstarch', qty: 1 },
      { productId: 'mm-chili-flakes', qty: 1 },
      { productId: 'mm-sugar', qty: 1 },
      { productId: 'mm-spring-onion', qty: 1 },
      { productId: 'mm-garlic', qty: 1 },
      { productId: 'mm-nuts', qty: 1 },
    ],
    stepsEn: [
      'Marinate chicken in half the soy–sesame–cornstarch mix for 30 min.',
      'Simmer remaining sauce with chili, sugar, spring onion and garlic.',
      'Stir-fry chicken until cooked, combine with sauce and peanuts.',
    ],
    stepsTr: [
      'Tavuğu soya–susam–nişasta karışımının yarısıyla 30 dk marine edin.',
      'Kalan sosu acı, şeker, taze soğan ve sarımsakla ısıtın.',
      'Tavuğu soteleyip sos ve fıstıkla birleştirin.',
    ],
    stepsAr: [
      'تمرّن الدجاج نصف صلصة الصويا والسمسم.',
      'اطبخ باقي الصلصة مع الفلفل والثوم.',
      'اقلي الدجاج وامزجه مع الصلصة والمكسرات.',
    ],
  },
  {
    id: 'recipe-salmon',
    kind: 'recipe',
    mealDbId: '52959',
    titleAr: 'سلمون مشوي مع طماطم',
    titleEn: 'Baked salmon with tomatoes',
    titleTr: 'Fırında somon ve domates',
    emoji: '🐟',
    durationMin: 35,
    image: 'https://www.themealdb.com/images/media/meals/1548772327.jpg',
    youtube: 'https://www.youtube.com/watch?v=xvPR2Tfw5k0',
    storeId: DEFAULT_STORE_ID,
    items: [
      { productId: 'mm-salmon', qty: 1 },
      { productId: 'mm-tomato', qty: 1 },
      { productId: 'mm-lemon', qty: 1 },
      { productId: 'mm-olive-oil', qty: 1 },
      { productId: 'mm-olives', qty: 1 },
      { productId: 'mm-basil', qty: 1 },
    ],
    stepsEn: [
      'Heat oven to 180°C. Spread tomatoes in a dish, drizzle oil, bake 10 min.',
      'Nestle salmon among veg, add lemon juice, bake ~15 min until just cooked.',
      'Scatter herbs and olives to serve.',
    ],
    stepsTr: [
      'Fırını 180°C yapın; domatesleri yağlayıp 10 dk pişirin.',
      'Somoni ekleyip limonla ~15 dk daha pişirin.',
      'Yeşillik ve zeytinle servis edin.',
    ],
    stepsAr: [
      'سخّن الفرن وافرد الطماطم مع الزيت 10 دقائق.',
      'ضع السلمون وعصير الليمون واخبز حتى ينضج.',
      'زيّن بالزيتون والأعشاب.',
    ],
  },
  {
    id: 'recipe-fish-tacos',
    kind: 'recipe',
    mealDbId: '52819',
    titleAr: 'تاكو سمك كاجون',
    titleEn: 'Cajun spiced fish tacos',
    titleTr: 'Cajun balık taco',
    emoji: '🌮',
    durationMin: 30,
    image: 'https://www.themealdb.com/images/media/meals/uvuyxu1503067369.jpg',
    youtube: 'https://www.youtube.com/watch?v=N4EdUt0Ou48',
    storeId: DEFAULT_STORE_ID,
    items: [
      { productId: 'mm-white-fish', qty: 1 },
      { productId: 'mm-cajun', qty: 1 },
      { productId: 'mm-tortilla', qty: 1 },
      { productId: 'mm-avocado', qty: 1 },
      { productId: 'mm-lettuce', qty: 1 },
      { productId: 'mm-spring-onion', qty: 1 },
      { productId: 'mm-salsa', qty: 1 },
      { productId: 'mm-sour-cream', qty: 1 },
      { productId: 'mm-lemon', qty: 1 },
      { productId: 'mm-oil', qty: 1 },
    ],
    stepsEn: [
      'Coat fish with Cajun spice and pan-fry until golden and cooked through.',
      'Warm tortillas; fill with avocado, lettuce, spring onion and salsa.',
      'Top with flaked fish, sour cream and lemon.',
    ],
    stepsTr: [
      'Balığı Cajun baharatıyla kaplayıp kızartın.',
      'Tortillaları ısıtıp avokado, marul ve salsa doldurun.',
      'Balık, ekşi krema ve limonla tamamlayın.',
    ],
    stepsAr: [
      'غطِّ السمك ببهار كاجون واقله.',
      'سخّن التورتيلا واملأها بالأفوكادو والخس.',
      'أضف السمك والقشدة والليمون.',
    ],
  },
  {
    id: 'recipe-lasagne',
    kind: 'recipe',
    mealDbId: '52844',
    titleAr: 'لازانيا لحم',
    titleEn: 'Classic Lasagne',
    titleTr: 'Klasik lazanya',
    emoji: '🧀',
    durationMin: 90,
    image: 'https://www.themealdb.com/images/media/meals/wtsvxx1511296896.jpg',
    youtube: 'https://www.youtube.com/watch?v=gfhfsBPt46s',
    storeId: DEFAULT_STORE_ID,
    items: [
      { productId: 'mm-lasagne', qty: 1 },
      { productId: 'mm-mince', qty: 1 },
      { productId: 'mm-bacon', qty: 1 },
      { productId: 'mm-onion', qty: 1 },
      { productId: 'mm-carrot', qty: 1 },
      { productId: 'mm-celery', qty: 1 },
      { productId: 'mm-garlic', qty: 1 },
      { productId: 'mm-canned-tomato', qty: 2 },
      { productId: 'mm-tomato-paste', qty: 1 },
      { productId: 'mm-mozzarella', qty: 1 },
      { productId: 'mm-parmesan', qty: 1 },
      { productId: 'mm-olive-oil', qty: 1 },
      { productId: 'mm-honey', qty: 1 },
    ],
    stepsEn: [
      'Cook bacon, onion, celery and carrot; brown mince with garlic.',
      'Add tomato paste, chopped tomatoes and honey; simmer 20 min.',
      'Layer sauce and lasagne sheets; top with cream/mozzarella/Parmesan; bake 25–30 min.',
    ],
    stepsTr: [
      'Bacon, soğan, kereviz ve havucu soteleyin; kıymayı mühürleyin.',
      'Salça, domates ve bal ekleyip 20 dk pişirin.',
      'Katları dizin, mozzarella/Parmesan ile 25–30 dk fırınlayın.',
    ],
    stepsAr: [
      'اطبخ اللحم المقدد والخضار واللحم المفروم.',
      'أضف الطماطم واتركها تهدأ 20 دقيقة.',
      'رصّ الطبقات والجبن واخبز 25–30 دقيقة.',
    ],
  },
  {
    id: 'recipe-poutine',
    kind: 'recipe',
    mealDbId: '52804',
    titleAr: 'بوتين كندي',
    titleEn: 'Poutine',
    titleTr: 'Poutine (Kanada)',
    emoji: '🍟',
    durationMin: 25,
    image: 'https://www.themealdb.com/images/media/meals/uuyrrx1487327597.jpg',
    youtube: 'https://www.youtube.com/watch?v=UVAMAoA2_WU',
    storeId: DEFAULT_STORE_ID,
    items: [
      { productId: 'mm-potato', qty: 2 },
      { productId: 'mm-oil', qty: 1 },
      { productId: 'mm-cheese', qty: 1 },
      { productId: 'mm-gravy', qty: 1 },
    ],
    stepsEn: [
      'Heat oil and fry thin-cut potatoes until golden.',
      'Warm gravy; drain fries on paper towels.',
      'Top fries with cheese and ladle hot gravy over.',
    ],
    stepsTr: [
      'İnce patatesleri yağda kızartın.',
      'Et sosunu ısıtın.',
      'Patatese peynir serpip sıcak sos gezdirin.',
    ],
    stepsAr: [
      'اقلي البطاطا حتى تتحمر.',
      'سخّن صلصة اللحم.',
      'رشّ الجبن واسكب الصلصة الساخنة.',
    ],
  },
  {
    id: 'recipe-chivito',
    kind: 'recipe',
    mealDbId: '53063',
    titleAr: 'ساندويتش شيفيتو',
    titleEn: 'Chivito uruguayo',
    titleTr: 'Uruguay chivito sandviçi',
    emoji: '🥪',
    durationMin: 30,
    image: 'https://www.themealdb.com/images/media/meals/n7qnkb1630444129.jpg',
    youtube: 'https://www.youtube.com/watch?v=0PXbbL1QdaA',
    storeId: DEFAULT_STORE_ID,
    items: [
      { productId: 'mm-mince', qty: 1 },
      { productId: 'mm-bread', qty: 1 },
      { productId: 'mm-lettuce', qty: 1 },
      { productId: 'mm-tomato', qty: 1 },
      { productId: 'mm-ham', qty: 1 },
      { productId: 'mm-mozzarella', qty: 1 },
      { productId: 'mm-bacon', qty: 1 },
      { productId: 'mm-eggs', qty: 1 },
      { productId: 'mm-onion', qty: 1 },
      { productId: 'mm-bell-pepper', qty: 1 },
    ],
    stepsEn: [
      'Grill flattened beef; fry eggs, bacon and ham.',
      'Build sandwich with meat, eggs, bacon, ham, mozzarella, tomato and lettuce.',
      'Close with bread and serve.',
    ],
    stepsTr: [
      'Eti ezip ızgara yapın; yumurta, bacon ve jambonu kızartın.',
      'Ekmeğe et, yumurta, jambon, mozzarella, domates ve marul dizin.',
      'Kapatıp servis edin.',
    ],
    stepsAr: [
      'اشوِ اللحم واقلي البيض واللحم المقدد.',
      'ركّب الساندويتش مع الجبن والطماطم والخس.',
      'أغلق بالخبز وقدّم.',
    ],
  },
  {
    id: 'recipe-breakfast',
    kind: 'recipe',
    titleAr: 'فطور عائلي',
    titleEn: 'Family breakfast',
    titleTr: 'Aile kahvaltısı',
    emoji: '🍳',
    durationMin: 20,
    image: img('photo-1533089860892-a7c6f0a88666', 'sig=bfast'),
    youtube: 'https://www.youtube.com/watch?v=1IszT_guI08',
    storeId: DEFAULT_STORE_ID,
    items: [
      { productId: 'mm-eggs', qty: 1 },
      { productId: 'mm-milk', qty: 1 },
      { productId: 'mm-bread', qty: 2 },
      { productId: 'mm-cheese', qty: 1 },
      { productId: 'mm-apples', qty: 1 },
      { productId: 'mm-butter', qty: 1 },
    ],
    stepsEn: [
      'Toast bread and scramble or fry eggs in butter.',
      'Serve with cheese, milk and fresh apples.',
    ],
    stepsTr: [
      'Ekmeği kızartın; yumurtayı tereyağında pişirin.',
      'Peynir, süt ve elma ile servis edin.',
    ],
    stepsAr: [
      'حمّص الخبز واطبخ البيض بالزبدة.',
      'قدّم مع الجبن والحليب والتفاح.',
    ],
  },
  {
    id: 'recipe-dinner',
    kind: 'recipe',
    titleAr: 'عشاء سريع بالدجاج',
    titleEn: 'Quick chicken dinner',
    titleTr: 'Hızlı tavuklu akşam yemeği',
    emoji: '🍽️',
    durationMin: 35,
    image: img('photo-1604503468506-a8da13d82791', 'sig=dinner'),
    youtube: 'https://www.youtube.com/watch?v=4aZr5hZXP_s',
    storeId: DEFAULT_STORE_ID,
    items: [
      { productId: 'mm-chicken', qty: 1 },
      { productId: 'mm-rice', qty: 1 },
      { productId: 'mm-tomato', qty: 2 },
      { productId: 'mm-onion', qty: 1 },
      { productId: 'mm-garlic', qty: 1 },
      { productId: 'mm-olive-oil', qty: 1 },
    ],
    stepsEn: [
      'Sauté onion and garlic in olive oil; brown chicken.',
      'Add tomatoes and simmer; serve over steamed rice.',
    ],
    stepsTr: [
      'Soğan ve sarımsağı yağda kavurup tavuğu mühürleyin.',
      'Domates ekleyip pirinçle servis edin.',
    ],
    stepsAr: [
      'اقلي البصل والثوم والدجاج.',
      'أضف الطماطم وقدّم مع الأرز.',
    ],
  },
  {
    id: 'list-weekly',
    kind: 'list',
    titleAr: 'مشتريات الأسبوع',
    titleEn: 'Weekly staples',
    titleTr: 'Haftalık ihtiyaçlar',
    emoji: '🛒',
    storeId: DEFAULT_STORE_ID,
    items: [
      { productId: 'mm-wt', qty: 2 },
      { productId: 'mm-milk', qty: 2 },
      { productId: 'mm-bread', qty: 1 },
      { productId: 'mm-detergent', qty: 1 },
      { productId: 'mm-apples', qty: 1 },
      { productId: 'mm-eggs', qty: 1 },
      { productId: 'mm-rice', qty: 1 },
    ],
  },
  {
    id: 'list-bbq',
    kind: 'list',
    titleAr: 'حفلة شواء',
    titleEn: 'BBQ night',
    titleTr: 'Mangal gecesi',
    emoji: '🔥',
    storeId: DEFAULT_STORE_ID,
    items: [
      { productId: 'mm-chicken', qty: 2 },
      { productId: 'mm-mince', qty: 1 },
      { productId: 'mm-lettuce', qty: 1 },
      { productId: 'mm-tomato', qty: 2 },
      { productId: 'mm-onion', qty: 1 },
      { productId: 'mm-bread', qty: 2 },
      { productId: 'mm-cola', qty: 2 },
      { productId: 'mm-chips', qty: 2 },
    ],
  },
  {
    id: 'list-healthy',
    kind: 'list',
    titleAr: 'أسبوع صحي',
    titleEn: 'Healthy week',
    titleTr: 'Sağlıklı hafta',
    emoji: '🥗',
    storeId: DEFAULT_STORE_ID,
    items: [
      { productId: 'mm-salad-mix', qty: 2 },
      { productId: 'mm-cucumber', qty: 1 },
      { productId: 'mm-yogurt', qty: 2 },
      { productId: 'mm-banana', qty: 1 },
      { productId: 'mm-salmon', qty: 1 },
      { productId: 'mm-olive-oil', qty: 1 },
      { productId: 'mm-water', qty: 2 },
    ],
  },
]

export const listTitle = (list, lang = 'ar') =>
  lang === 'tr' ? list.titleTr || list.titleEn : lang === 'en' ? list.titleEn || list.titleAr : list.titleAr

export const youtubeVideoId = (url) => {
  if (!url) return null
  const m = String(url).match(/(?:youtu\.be\/|v=|\/embed\/|\/shorts\/)([\w-]{11})/)
  return m?.[1] || null
}

export const youtubeThumbUrl = (url) => {
  const id = youtubeVideoId(url)
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null
}

export const recipeSteps = (list, lang = 'ar') => {
  if (!list) return []
  if (lang === 'tr' && list.stepsTr?.length) return list.stepsTr
  if (lang === 'en' && list.stepsEn?.length) return list.stepsEn
  if (lang === 'ar' && list.stepsAr?.length) return list.stepsAr
  return list.stepsEn || list.stepsTr || list.stepsAr || list.steps || []
}

export const butlerStep = (createdAt, now = Date.now(), status) => {
  if (status === 'cancelled' || status === 'done') return status === 'done' ? 3 : -1
  const age = (now - createdAt) / 1000
  if (age < 15) return 0
  if (age < 40) return 1
  if (age < 80) return 2
  return 3
}

export const BUTLER_STEPS = ['butlerAccepted', 'butlerPickup', 'butlerEnroute', 'butlerDone']

/** Resolve recipe product ids that may not exist — map loosely from catalog */
export const resolveListItems = (list) => {
  const storeId = resolveStoreId(list.storeId || DEFAULT_STORE_ID)
  const products = getProducts(storeId)
  return (list.items || [])
    .map((item) => {
      let p = getProduct(storeId, item.productId)
      if (!p) {
        const needle = String(item.productId || '').replace(/^p-/, '')
        p = products.find((x) => x.id.includes(needle) || (x.names?.en || '').toLowerCase().includes(needle))
      }
      if (!p || !isInStock(p)) return null
      return { productId: p.id, qty: item.qty || 1, product: p }
    })
    .filter(Boolean)
}

export const linePrice = (item) => {
  if (!item) return 0
  if (item.unitPrice != null) return item.unitPrice
  const p = getProduct(item.storeId, item.productId)
  return p?.price || 0
}

export const supportFaqs = [
  { id: 'eta', qKey: 'faqEtaQ', aKey: 'faqEtaA' },
  { id: 'cancel', qKey: 'faqCancelQ', aKey: 'faqCancelA' },
  { id: 'payment', qKey: 'faqPayQ', aKey: 'faqPayA' },
  { id: 'missing', qKey: 'faqMissingQ', aKey: 'faqMissingA' },
  { id: 'points', qKey: 'faqPointsQ', aKey: 'faqPointsA' },
]

export const allergenLabel = (key, lang = 'ar') => {
  const map = {
    milk: { ar: 'حليب', en: 'Milk', tr: 'Süt' },
    eggs: { ar: 'بيض', en: 'Eggs', tr: 'Yumurta' },
    gluten: { ar: 'غلوتين', en: 'Gluten', tr: 'Gluten' },
    nuts: { ar: 'مكسرات', en: 'Nuts', tr: 'Fındık/fıstık' },
    sesame: { ar: 'سمسم', en: 'Sesame', tr: 'Susam' },
    fish: { ar: 'سمك', en: 'Fish', tr: 'Balık' },
  }
  const row = map[key]
  if (!row) return key
  return lang === 'tr' ? row.tr : lang === 'en' ? row.en : row.ar
}

const fold = (s) =>
  String(s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[ًٌٍَُِّْـ]/g, '')
    .trim()

export const matchesQuery = (hay, q) => {
  const a = fold(hay)
  const b = fold(q)
  if (!b) return false
  if (a.includes(b)) return true
  // fuzzy: consecutive chars
  let i = 0
  for (const ch of a) {
    if (ch === b[i]) i++
    if (i >= b.length) return true
  }
  return false
}

export const searchCatalog = (query, lang = 'ar') => {
  const q = fold(query)
  if (!q) return { matchedStores: [], matchedProducts: [] }
  const matchedProducts = stores
    .filter((s) => !s.comingSoon)
    .flatMap((store) =>
      getProducts(store.id)
        .filter(
          (p) =>
            matchesQuery(productName(p, lang), q) ||
            matchesQuery(p.desc, q) ||
            matchesQuery(p.brand, q) ||
            matchesQuery(p.names?.en, q) ||
            matchesQuery(p.names?.tr, q) ||
            matchesQuery(p.names?.ar, q) ||
            matchesQuery(p.barcode, q) ||
            matchesQuery(p.sku, q),
        )
        .map((p) => ({ ...p, storeId: store.id, storeName: store.name })),
    )
  const ids = new Set(matchedProducts.map((p) => p.storeId))
  const matchedStores = stores.filter(
    (s) =>
      ids.has(s.id) ||
      matchesQuery(s.name, q) ||
      matchesQuery(s.nameEn, q) ||
      matchesQuery(s.nameTr, q) ||
      (s.aliases || []).some((a) => matchesQuery(a, q)),
  )
  return { matchedStores, matchedProducts }
}

/** Resolve barcode / QR payload → catalog product. Accepts EAN, sku, plain id, or `m10:productId`. */
export const parseScanPayload = (raw) => {
  const s = String(raw || '').trim()
  if (!s) return null
  const m10 = /^m10:([a-z0-9_-]+)(?::([a-z0-9_-]+))?$/i.exec(s)
  if (m10) return { productId: m10[1], storeId: m10[2] ? resolveStoreId(m10[2]) : null }
  const byId = catalog.find((p) => p.id === s || p.sku === s)
  if (byId) return { productId: byId.id, storeId: null }
  const digits = s.replace(/\s+/g, '')
  const byBarcode = catalog.find((p) => p.barcode === digits || p.barcode === s)
  if (byBarcode) return { productId: byBarcode.id, storeId: null }
  return null
}

export const findProductByScan = (raw, preferredStoreId) => {
  const parsed = parseScanPayload(raw)
  if (!parsed) return null
  const storeId = resolveStoreId(parsed.storeId || preferredStoreId || DEFAULT_STORE_ID)
  const product = getProduct(storeId, parsed.productId) || catalog.find((p) => p.id === parsed.productId)
  if (!product) return null
  return { product, storeId, productId: product.id }
}

/**
 * Generate the next N days (excluding today) of 2-hour delivery slots.
 * Each entry: { id, dayKey (YYYY-MM-DD), dayLabel (Today/Tomorrow/Thu/Fri…), window ('10:00–12:00'),
 *                startTs, endTs, available: bool }
 */
export const generateDeliverySlots = (daysAhead = 4, now = Date.now()) => {
  const HOURS = [
    { start: 10, end: 12, window: '10:00–12:00' },
    { start: 12, end: 14, window: '12:00–14:00' },
    { start: 14, end: 16, window: '14:00–16:00' },
    { start: 16, end: 18, window: '16:00–18:00' },
    { start: 18, end: 20, window: '18:00–20:00' },
    { start: 20, end: 22, window: '20:00–22:00' },
  ]
  const out = []
  for (let i = 0; i <= daysAhead; i += 1) {
    const day = new Date(now + i * 24 * 60 * 60 * 1000)
    day.setHours(0, 0, 0, 0)
    const dayKey = day.toISOString().slice(0, 10)
    const isToday = i === 0
    const isTomorrow = i === 1
    const dayLabel = isToday
      ? 'today'
      : isTomorrow
        ? 'tomorrow'
        : day.toLocaleDateString(undefined, { weekday: 'short' })
    HOURS.forEach((h, idx) => {
      const startTs = day.getTime() + h.start * 60 * 60 * 1000
      const endTs = day.getTime() + h.end * 60 * 60 * 1000
      // Disable past slots for today, and randomly ~20% to simulate capacity
      const isPast = isToday && startTs < now
      const unavailable = Math.random() < 0.18 || isPast
      out.push({
        id: `${dayKey}-${idx}`,
        dayKey,
        dayLabel,
        window: h.window,
        startTs,
        endTs,
        available: !unavailable,
      })
    })
  }
  return out
}

export const DELIVERY_SLOTS = generateDeliverySlots().filter((s) => s.available)

export const canCancelOrder = (order, now = Date.now()) => {
  if (!order || order.status === 'cancelled') return false
  const step = (() => {
    const age = (now - order.createdAt) / 1000
    if (age < 20) return 0
    if (age < 50) return 1
    if (age < 90) return 2
    return 3
  })()
  return step <= 1
}

export const etaMax = (store) => Number(String(store.eta).split('-').pop()) || 99

export const openStores = () => stores.filter((s) => !s.comingSoon && s.status !== 'closed')

export const getNearestStore = (address, { expressOnly } = {}) => {
  let pool = openStores()
  if (expressOnly) {
    const express = pool.filter((s) => s.express)
    if (express.length) pool = express
  }
  const fallback = pool.find((s) => s.id === DEFAULT_STORE_ID) || pool[0] || stores[0]
  if (!pool.length) return fallback

  const area = normPlace(address?.area)
  const city = normPlace(address?.city)

  const scored = pool.map((s) => {
    const areas = [s.area, s.areaEn, s.areaTr, ...(s.aliases || [])].map(normPlace)
    const cities = [s.city, s.cityEn, s.cityTr, ...(s.cityAliases || [])].map(normPlace)
    let score = 0
    if (area && areas.some((a) => a && (a === area || a.includes(area) || area.includes(a)))) score += 10
    if (city && cities.some((c) => c && (c === city || c.includes(city) || city.includes(c)))) score += 3
    return { s, score, eta: etaMax(s) }
  })
  scored.sort((a, b) => b.score - a.score || a.eta - b.eta)
  if (scored[0].score === 0) return fallback
  return scored[0].s
}

export const filterStores = (list, mode, chip) => {
  let next = list
  if (mode === 'express') next = next.filter((s) => s.express || s.comingSoon)
  if (mode === 'plus') next = next.filter((s) => s.comingSoon || s.fee === 0)
  if (mode === 'deals' || chip === 'offers') {
    next = next.filter((s) => s.comingSoon || getProducts(s.id).some((p) => p.oldPrice))
  }
  if (chip === 'freeDelivery') next = next.filter((s) => s.comingSoon || s.fee === 0)
  if (chip === 'topRated') next = next.filter((s) => s.comingSoon || s.rating >= 4.8)
  if (chip === 'new') next = next.filter((s) => s.isNew)
  if (chip === 'under30') next = next.filter((s) => s.comingSoon || etaMax(s) <= 30)
  return next
}

export const flyers = [
  {
    id: 'week',
    kickerAr: 'عروض الأسبوع',
    kickerEn: 'WEEKLY DEALS',
    kickerTr: 'HAFTALIK AKTÜEL',
    titleAr: 'الجودة والسعر 10/10',
    titleEn: 'Price & quality 10/10',
    titleTr: 'Fiyat ve kalite 10/10',
    subAr: 'أسعار مخفّضة هذا الأسبوع في فروع M10',
    subEn: 'This week’s discounted prices at M10 branches',
    subTr: 'Bu hafta M10 şubelerinde indirimli fiyatlar',
    skus: ['mm-wt', 'mm-eggs', 'mm-rice', 'mm-nutella', 'mm-cheese'],
    categories: ['dairy', 'pantry', 'bakery'],
  },
  {
    id: 'fresh',
    kickerAr: 'طازج يومياً',
    kickerEn: 'FRESH THIS WEEK',
    kickerTr: 'BU HAFTA TAZE',
    titleAr: 'وايلد تايجر + البيض',
    titleEn: 'Wild Tiger + eggs',
    titleTr: 'Wild Tiger + yumurta',
    subAr: 'أفضل أسعار البقالة هذا الأسبوع',
    subEn: 'This week’s best grocery prices',
    subTr: 'Bu haftanın en iyi market fiyatları',
    skus: ['mm-wt', 'mm-eggs'],
    categories: ['dairy'],
  },
  {
    id: 'drinks-sale',
    kickerAr: 'عروض المشروبات',
    kickerEn: 'DRINKS SALE',
    kickerTr: 'İÇECEK KAMPANYASI',
    titleAr: 'مشروبات منعشة بأسعار مميزة',
    titleEn: 'Refreshing drinks at special prices',
    titleTr: 'Serinletici içecekler özel fiyatlarla',
    subAr: 'خصومات حصرية على المشروبات الغازية والعصائر',
    subEn: 'Exclusive discounts on sodas and juices',
    subTr: 'Gazlı içecekler ve meyve sularında özel indirimler',
    skus: [],
    categories: ['drinks'],
  },
  {
    id: 'snacks-fest',
    kickerAr: 'مهرجان الوجبات الخفيفة',
    kickerEn: 'SNACK FEST',
    kickerTr: 'ATIŞTIRMALIK ŞENLİĞİ',
    titleAr: 'كل ما تحب من السناكات',
    titleEn: 'All your favorite snacks',
    titleTr: 'Tüm favori atıştırmalıkların',
    subAr: 'تشكيلة واسعة من الشوكولاتة والمكسرات',
    subEn: 'Wide selection of chocolate and nuts',
    subTr: 'Çikolata ve kuruyemişler geniş seçim',
    skus: ['mm-nutella'],
    categories: ['snacks', 'pantry'],
  },
  {
    id: 'home-care',
    kickerAr: 'كل ما تحتاجه للمنزل',
    kickerEn: 'HOME ESSENTIALS',
    kickerTr: 'EV İHTİYAÇLARI',
    titleAr: 'لوازم المنزل بسعر مخفّض',
    titleEn: 'Home supplies at a discount',
    titleTr: 'Ev ihtiyaçları indirimli fiyatlarla',
    subAr: 'منظفات وأدوات منزلية بكميات كبيرة',
    subEn: 'Cleaning and household tools in bulk',
    subTr: 'Temizlik ve ev aletleri büyük paketlerde',
    skus: [],
    categories: ['household', 'home'],
  },
  {
    id: 'fresh-produce',
    kickerAr: 'خضروات وفواكه طازجة',
    kickerEn: 'FRESH PRODUCE',
    kickerTr: 'Taze Meyve ve Sebze',
    titleAr: 'موسم الحصاد الطازج',
    titleEn: 'Fresh harvest season',
    titleTr: 'Taze hasat sezonu',
    subAr: 'أفضل خضروات وفواكه طازجة من السوق',
    subEn: 'Best fresh vegetables and fruits from the market',
    subTr: 'Marketten en taze meyve ve sebzeler',
    skus: [],
    categories: ['produce'],
  },
]

export const flyerKicker = (f, lang) => (lang === 'tr' ? f.kickerTr : lang === 'en' ? f.kickerEn : f.kickerAr)
export const flyerTitle = (f, lang) => (lang === 'tr' ? f.titleTr : lang === 'en' ? f.titleEn : f.titleAr)
export const flyerSub = (f, lang) => (lang === 'tr' ? f.subTr : lang === 'en' ? f.subEn : f.subAr)
export const getFlyer = (id) => flyers.find((f) => f.id === id)

const loc3 = (item, lang, key) => {
  if (lang === 'tr') return item[`${key}Tr`]
  if (lang === 'en') return item[`${key}En`]
  return item[`${key}Ar`]
}

export const stories = [
  {
    id: 's-aktuel',
    image: img('photo-1488459716781-31db52582fe9', 'sig=story-aktuel'),
    titleAr: 'M10 أكتويل',
    titleEn: 'M10 Aktüel',
    titleTr: 'M10 Aktüel',
    bodyAr: 'عروض الأسبوع — الجودة والسعر 10/10',
    bodyEn: 'This week’s flyer — price & quality 10/10',
    bodyTr: 'Haftalık afiş — fiyat ve kalite 10/10',
    ctaAr: 'افتح الأكتويل',
    ctaEn: 'Open Aktüel',
    ctaTr: 'Aktüeli aç',
    cta: { screen: 'Flyer', params: { id: 'week' } },
    options: [
      {
        labelAr: 'افتح الأكتويل',
        labelEn: 'Open Aktüel',
        labelTr: 'Aktüeli aç',
        target: { screen: 'Flyer', params: { id: 'week' } },
      },
      {
        labelAr: 'تسوّق حسب المتجر',
        labelEn: 'Shop by store',
        labelTr: 'Mağazaya göre al',
        target: { screen: 'Store', params: { id: DEFAULT_STORE_ID } },
      },
    ],
  },
  {
    id: 's-tiger',
    image: '/promo-banner.png',
    titleAr: 'وايلد تايجر',
    titleEn: 'Wild Tiger',
    titleTr: 'Wild Tiger',
    bodyAr: 'من 1000 إلى 750 د.ع في فروع M10',
    bodyEn: 'From 1000 to 750 IQD at M10',
    bodyTr: 'M10 şubelerinde 1000 yerine 750 IQD',
    productId: 'mm-wt',
    ctaAr: 'أضف للسلة',
    ctaEn: 'Shop now',
    ctaTr: 'Alışverişe başla',
    fallbackCta: { screen: 'Store', params: { id: DEFAULT_STORE_ID, aisle: 'drinks' } },
  },
  {
    id: 's-plus',
    image: img('photo-1607082349566-187342175e2f', 'sig=story-plus'),
    titleAr: 'M10+',
    titleEn: 'M10+',
    titleTr: 'M10+',
    bodyAr: 'توصيل مجاني ونقاط ذهبية',
    bodyEn: 'Free delivery and gold points',
    bodyTr: 'Ücretsiz teslimat ve altın puan',
    ctaAr: 'المكافآت',
    ctaEn: 'Rewards',
    ctaTr: 'Ödüller',
    cta: { screen: 'Rewards' },
    options: [
      {
        labelAr: 'المكافآت',
        labelEn: 'Rewards',
        labelTr: 'Ödüller',
        target: { screen: 'Rewards' },
      },
      {
        labelAr: 'المحفظة',
        labelEn: 'Wallet',
        labelTr: 'Cüzdan',
        target: { screen: 'Wallet' },
      },
      {
        labelAr: 'ادعُ صديقًا',
        labelEn: 'Refer a friend',
        labelTr: 'Arkadaşını davet et',
        target: { screen: 'Referral' },
      },
    ],
  },
  {
    id: 's-express',
    image: img('photo-1542838132-92c53300491e', 'sig=story-express'),
    titleAr: 'إكسبرس',
    titleEn: 'Express',
    titleTr: 'Express',
    bodyAr: 'M10 دورا ميكانيك خلال 10–20 دقيقة',
    bodyEn: 'M10 Dora Mechanic in 10–20 minutes',
    bodyTr: 'M10 Dora Mekanik 10–20 dakikada',
    ctaAr: 'اطلب الآن',
    ctaEn: 'Order now',
    ctaTr: 'Sipariş ver',
    cta: { screen: 'Store', params: { id: 'm10-dora-mechanic' } },
  },
]

export const storyTitle = (s, lang) => loc3(s, lang, 'title')
export const storyBody = (s, lang) => loc3(s, lang, 'body')
export const storyCta = (s, lang) => loc3(s, lang, 'cta')

export const seedNotifications = [
  {
    id: 'n-aktuel',
    storyId: 's-aktuel',
    titleAr: 'أكتويل الأسبوع',
    titleEn: 'This week’s Aktüel',
    titleTr: 'Bu haftanın aktüeli',
    bodyAr: 'أسعار جديدة في فروع M10. اضغط للمشاهدة.',
    bodyEn: 'New prices at M10 branches. Tap to view the story.',
    bodyTr: 'M10 şubelerinde yeni fiyatlar. Hikayeyi görmek için dokun.',
    createdAt: Date.now() - 1000 * 60 * 40,
    read: false,
  },
  {
    id: 'n-tiger',
    storyId: 's-tiger',
    titleAr: 'وايلد تايجر 750 د.ع',
    titleEn: 'Wild Tiger 750 IQD',
    titleTr: 'Wild Tiger 750 IQD',
    bodyAr: 'عرض اليوم في القصة.',
    bodyEn: 'Today’s deal is in stories.',
    bodyTr: 'Günün fırsatı hikayelerde.',
    createdAt: Date.now() - 1000 * 60 * 60 * 5,
    read: false,
  },
  {
    id: 'n-plus',
    storyId: 's-plus',
    titleAr: 'M10+',
    titleEn: 'M10+',
    titleTr: 'M10+',
    bodyAr: 'توصيل مجاني ونقاط ذهبية — شاهد القصة.',
    bodyEn: 'Free delivery and gold points — open the story.',
    bodyTr: 'Ücretsiz teslimat ve altın puan — hikayeyi aç.',
    createdAt: Date.now() - 1000 * 60 * 60 * 12,
    read: false,
  },
  {
    id: 'n-express',
    storyId: 's-express',
    titleAr: 'إكسبرس 10–20 د',
    titleEn: 'Express 10–20 min',
    titleTr: 'Express 10–20 dk',
    bodyAr: 'أقرب فرع جاهز للتوصيل السريع.',
    bodyEn: 'Nearest branch is ready for fast delivery.',
    bodyTr: 'En yakın şube hızlı teslimata hazır.',
    createdAt: Date.now() - 1000 * 60 * 60 * 18,
    read: false,
  },
  {
    id: 'n-points',
    titleAr: 'اكسب نقاط',
    titleEn: 'Earn points',
    titleTr: 'Puan kazan',
    bodyAr: 'اطلب واجمع نقاط M10 Rewards.',
    bodyEn: 'Order and collect M10 Rewards points.',
    bodyTr: 'Sipariş ver, M10 Rewards puanı biriktir.',
    createdAt: Date.now() - 1000 * 60 * 60 * 26,
    read: true,
    cta: { screen: 'Rewards' },
  },
  {
    id: 'n-filistin',
    titleAr: 'فرع فلسطين قريباً',
    titleEn: 'Filistin branch coming soon',
    titleTr: 'Filistin şubesi yakında',
    bodyAr: 'سنخبرك عند الافتتاح.',
    bodyEn: 'We’ll notify you when it opens.',
    bodyTr: 'Açılınca haber vereceğiz.',
    createdAt: Date.now() - 1000 * 60 * 60 * 48,
    read: true,
  },
]

export const notifTitle = (n, lang) => loc3(n, lang, 'title')
export const notifBody = (n, lang) => loc3(n, lang, 'body')

export const CLOSE_DEMO_ID = 'n-close-demo'

export const closeDemoNotification = () => ({
  id: CLOSE_DEMO_ID,
  storyId: 's-aktuel',
  titleAr: 'عرض أثناء غيابك',
  titleEn: 'A deal while you were away',
  titleTr: 'Uygulama kapalıyken fırsat',
  bodyAr: 'أكتويل الأسبوع جاهز. اضغط لفتح القصة.',
  bodyEn: 'This week’s Aktüel is ready. Tap to open the story.',
  bodyTr: 'Bu haftanın aktüeli hazır. Hikayeyi açmak için dokun.',
})

/** Seed product reviews for the demo. Keyed by productId; multi-locale bodies. */
export const seedProductReviews = [
  { productId: 'mm-milk', user: 'Lina K.', rating: 5, days: 2, textAr: 'طعم رائع ودرجة تبريد ممتازة عند الوصول.', textEn: 'Great taste and the cold chain held up on arrival.', textTr: 'Harika lezzet, soğuk zincir teslimde sağlam kaldı.' },
  { productId: 'mm-milk', user: 'Ahmed B.', rating: 4, days: 5, textAr: 'الجودة ثابتة ولكن السعر أعلى قليلاً من المتاجر الأخرى.', textEn: 'Quality is consistent but the price is slightly higher than other stores.', textTr: 'Kalite tutarlı ama fiyat diğer marketlerden biraz yüksek.' },
  { productId: 'mm-milk', user: 'Sara D.', rating: 5, days: 12, textAr: 'أطفالي يحبون هذا الحليب. نطلب كل أسبوع.', textEn: 'My kids love this milk. We order every week.', textTr: 'Çocuklarım bu sütü çok seviyor. Her hafta sipariş veriyoruz.' },
  { productId: 'mm-eggs', user: 'Reza M.', rating: 5, days: 1, textAr: 'بيض طازج وصل بدون كسر. التغليف ممتاز.', textEn: 'Fresh eggs arrived unbroken. Packaging was solid.', textTr: 'Taze yumurtalar kırılmadan geldi. Paketleme sağlam.' },
  { productId: 'mm-cheese', user: 'Noor H.', rating: 4, days: 8, textAr: 'نكهة غنية، أحب أن أضيفه إلى الساندويتشات.', textEn: 'Rich flavor, I love adding it to sandwiches.', textTr: 'Zengin lezzet, sandviçlere eklemeyi seviyorum.' },
  { productId: 'mm-bread', user: 'Yusuf A.', rating: 5, days: 3, textAr: 'خبز يومي ممتاز. طازج دائمًا عند التوصيل.', textEn: 'Excellent daily bread. Always fresh on delivery.', textTr: 'Mükemmel günlük ekmek. Teslimatta her zaman taze.' },
  { productId: 'mm-olive-oil', user: 'Mariam J.', rating: 5, days: 14, textAr: 'أفضل زيت زيتون تذوقته منذ وقت طويل.', textEn: 'Best olive oil I have tasted in a long time.', textTr: 'Uzun zamandır tattığım en iyi zeytinyağı.' },
  { productId: 'mm-rice', user: 'Hassan O.', rating: 4, days: 7, textAr: 'حبيبات موحدة وطبخ ممتاز للأرز.', textEn: 'Even grains and cooks beautifully for rice.', textTr: 'Düzgün taneler, pirinç için harika pişer.' },
]

export const reviewText = (r, lang) =>
  lang === 'tr' ? r.textTr : lang === 'en' ? r.textEn : r.textAr

export const averageRating = (reviews) => {
  if (!reviews || !reviews.length) return 0
  const sum = reviews.reduce((s, r) => s + r.rating, 0)
  return Math.round((sum / reviews.length) * 10) / 10
}
