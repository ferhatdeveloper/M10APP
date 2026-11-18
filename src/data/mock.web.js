/** M10 Market mock data - Web version using kucoglu-menu.json */
import menuData from './kucoglu-menu.json'

export const KUCOGLU_STORE_ID = 'm10-market'
export const DEFAULT_STORE_ID = 'm10-market'

const fallbackImages = {
  meat: [
    'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400',
    'https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=400',
    'https://images.unsplash.com/photo-1558030006-450675393462?w=400',
    'https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=400',
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400',
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400',
  ],
  ready: [
    'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=400',
    'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400',
    'https://images.unsplash.com/photo-1562967914-608f82629710?w=400',
    'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400',
    'https://images.unsplash.com/photo-1606728035253-49e8a23146de?w=400',
    'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=400',
  ],
  drinks: [
    'https://images.unsplash.com/photo-1546171753-97d7676e4602?w=400',
    'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=400',
    'https://images.unsplash.com/photo-1570831739435-6601aa3fa4fb?w=400',
    'https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?w=400',
    'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400',
    'https://images.unsplash.com/photo-1603394630850-69b3def7a05d?w=400',
    'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=400',
    'https://images.unsplash.com/photo-1606168094336-48f205276929?w=400',
    'https://images.unsplash.com/photo-1598614187854-26a60e982dc4?w=400',
  ],
  default: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
}

const getFallbackImage = (aisle, index) => {
  const images = fallbackImages[aisle] || [fallbackImages.default]
  return images[index % images.length]
}

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

export const stores = [
  {
    id: 'm10-market',
    name: menuData.store.name,
    nameEn: menuData.store.nameEn,
    nameTr: menuData.store.nameTr,
    category: 'offers',
    tags: ['سوبرماركت', 'Supermarket'],
    rating: 4.8,
    reviews: 2500,
    eta: '25-35',
    fee: 2500,
    minOrder: 10000,
    status: 'open',
    cover: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800',
    logo: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=200',
    city: menuData.store.city,
    cityEn: menuData.store.cityEn,
    area: menuData.store.area,
    phone: menuData.store.phone,
  },
]

const rawProducts = menuData.products.map((p, index) => ({
  id: p.id,
  name: p.name,
  nameAr: p.names?.ar || p.name,
  nameEn: p.names?.en || p.name,
  nameTr: p.names?.tr || p.name,
  names: p.names,
  price: p.price,
  oldPrice: p.popular ? Math.round(p.price * 1.25) : null,
  image: getFallbackImage(p.aisle, index),
  images: [getFallbackImage(p.aisle, index)],
  aisle: p.aisle,
  category: p.category,
  categoryAr: p.categoryAr,
  desc: p.descs?.ar || p.desc,
  descs: p.descs,
  popular: p.popular,
  variants: p.variants,
  unit: p.unit,
  stock: p.stock,
  brand: p.brand,
}))

export const getStore = (id) => stores.find(s => s.id === id) || stores[0]

export const getProducts = (storeId) => rawProducts

export const getProductsByCategory = (categoryId) => {
  if (categoryId === 'offers') return rawProducts.filter(p => p.popular || p.oldPrice)
  return rawProducts.filter(p => p.aisle === categoryId || p.category?.toLowerCase() === categoryId)
}

export const getProduct = (storeId, productId) => rawProducts.find(p => p.id === productId)

export const categories = [
  { id: 'offers', name: 'العروض', nameAr: 'العروض', nameEn: 'Offers', nameTr: 'Kampanyalar', icon: '🔥' },
  { id: 'meat', name: 'اللحوم', nameAr: 'اللحوم', nameEn: 'Meat', nameTr: 'Et', icon: '🥩' },
  { id: 'ready', name: 'الدجاج', nameAr: 'الدجاج', nameEn: 'Chicken', nameTr: 'Tavuk', icon: '🍗' },
  { id: 'drinks', name: 'المشروبات', nameAr: 'المشروبات', nameEn: 'Drinks', nameTr: 'İçecekler', icon: '🥤' },
  { id: 'dairy', name: 'الألبان', nameAr: 'ألبان وبيض', nameEn: 'Dairy & Eggs', nameTr: 'Süt Ürünleri', icon: '🥛' },
  { id: 'produce', name: 'خضار وفواكه', nameAr: 'خضار وفواكه', nameEn: 'Vegetables & Fruits', nameTr: 'Sebze & Meyve', icon: '🥬' },
  { id: 'bakery', name: 'المخبوزات', nameAr: 'خبز ومخبز', nameEn: 'Bread & Bakery', nameTr: 'Ekmek & Fırın', icon: '🥖' },
  { id: 'pantry', name: 'المؤن', nameAr: 'مواد غذائية', nameEn: 'Grocery', nameTr: 'Temel Gıda', icon: '🫙' },
  { id: 'frozen', name: 'المجمدات', nameAr: 'المجمدات', nameEn: 'Frozen', nameTr: 'Dondurulmuş', icon: '❄️' },
  { id: 'snacks', name: 'سناكات', nameAr: 'سناكات', nameEn: 'Snacks', nameTr: 'Atıştırmalık', icon: '🍿' },
  { id: 'household', name: 'تنظيف', nameAr: 'تنظيف', nameEn: 'Cleaning', nameTr: 'Temizlik', icon: '🧹' },
  { id: 'personal', name: 'العناية', nameAr: 'عناية شخصية', nameEn: 'Personal Care', nameTr: 'Kişisel Bakım', icon: '🧴' },
  { id: 'home', name: 'المنزل', nameAr: 'إكسسوارات المنزل', nameEn: 'Home', nameTr: 'Ev Aksesuarları', icon: '🏠' },
]

export const getCategoryName = (cat, lang = 'ar') => {
  if (!cat) return ''
  if (lang === 'tr') return cat.nameTr || cat.nameEn || cat.name
  if (lang === 'en') return cat.nameEn || cat.name
  return cat.nameAr || cat.name
}

export const banners = [
  { id: 'b1', title: 'عروض الأسبوع', titleEn: 'Weekly Offers', titleTr: 'Haftalık Kampanyalar', image: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=600', color: '#e01828' },
  { id: 'b2', title: 'منتجات طازجة', titleEn: 'Fresh Products', titleTr: 'Taze Ürünler', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600', color: '#2e7d32' },
  { id: 'b3', title: 'توصيل سريع', titleEn: 'Fast Delivery', titleTr: 'Hızlı Teslimat', image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=600', color: '#1565c0' },
]

export const rewards = [
  { id: 'r1', title: 'خصم 10%', desc: 'على طلبك القادم', cost: 500 },
  { id: 'r2', title: 'توصيل مجاني', desc: 'لطلب واحد', cost: 1000 },
  { id: 'r3', title: 'خصم 25%', desc: 'على المشروبات', cost: 2000 },
]

export const user = {
  name: 'مستخدم M10',
  phone: '+9647509703030',
  points: 2500,
  tier: 'Gold',
  address: {
    label: 'المنزل',
    city: menuData.store.city,
    area: menuData.store.area,
    details: 'Ashty Road',
  },
}
