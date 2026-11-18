/** M10 Market mock data - Web version (no require) */

export const KUCOGLU_STORE_ID = 'm10-market'
export const DEFAULT_STORE_ID = 'm10-market'

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
    name: 'M10 Market',
    nameEn: 'M10 Market',
    nameTr: 'M10 Market',
    category: 'offers',
    tags: ['سوبرماركت', 'Supermarket'],
    rating: 4.8,
    reviews: 2500,
    eta: '25-35',
    fee: 2500,
    minOrder: 10000,
    status: 'open',
    cover: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800',
  },
  {
    id: 'fresh-market',
    name: 'سوق الطازج',
    nameEn: 'Fresh Market',
    nameTr: 'Taze Market',
    category: 'produce',
    tags: ['خضار', 'فواكه'],
    rating: 4.6,
    reviews: 1800,
    eta: '20-30',
    fee: 2000,
    minOrder: 8000,
    status: 'open',
    cover: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800',
  },
]

const sampleProducts = [
  { id: 'p1', name: 'حليب طازج', nameEn: 'Fresh Milk', price: 2500, image: 'https://via.placeholder.com/200', aisle: 'dairy' },
  { id: 'p2', name: 'خبز عربي', nameEn: 'Arabic Bread', price: 1500, image: 'https://via.placeholder.com/200', aisle: 'bakery' },
  { id: 'p3', name: 'طماطم', nameEn: 'Tomatoes', price: 3000, image: 'https://via.placeholder.com/200', aisle: 'produce' },
  { id: 'p4', name: 'دجاج طازج', nameEn: 'Fresh Chicken', price: 12000, image: 'https://via.placeholder.com/200', aisle: 'meat' },
  { id: 'p5', name: 'أرز بسمتي', nameEn: 'Basmati Rice', price: 8000, image: 'https://via.placeholder.com/200', aisle: 'pantry' },
  { id: 'p6', name: 'زيت زيتون', nameEn: 'Olive Oil', price: 15000, image: 'https://via.placeholder.com/200', aisle: 'pantry' },
]

export const getStore = (id) => stores.find(s => s.id === id) || stores[0]

export const getProducts = (storeId) => sampleProducts

export const getProduct = (storeId, productId) => sampleProducts.find(p => p.id === productId)

export const categories = [
  { id: 'offers', name: 'العروض', nameEn: 'Offers', icon: '🔥' },
  { id: 'meat', name: 'اللحوم', nameEn: 'Meat', icon: '🥩' },
  { id: 'dairy', name: 'الألبان', nameEn: 'Dairy', icon: '🥛' },
  { id: 'produce', name: 'خضار وفواكه', nameEn: 'Produce', icon: '🥬' },
  { id: 'bakery', name: 'المخبوزات', nameEn: 'Bakery', icon: '🥖' },
  { id: 'pantry', name: 'المؤن', nameEn: 'Pantry', icon: '🫙' },
  { id: 'drinks', name: 'المشروبات', nameEn: 'Drinks', icon: '🥤' },
  { id: 'snacks', name: 'وجبات خفيفة', nameEn: 'Snacks', icon: '🍿' },
  { id: 'frozen', name: 'المجمدات', nameEn: 'Frozen', icon: '🧊' },
  { id: 'household', name: 'تنظيف المنزل', nameEn: 'Household', icon: '🧹' },
  { id: 'personal', name: 'العناية الشخصية', nameEn: 'Personal Care', icon: '🧴' },
]

export const banners = [
  { id: 'b1', title: 'عروض الأسبوع', image: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=600', color: '#e01828' },
  { id: 'b2', title: 'منتجات طازجة', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600', color: '#2e7d32' },
  { id: 'b3', title: 'توصيل سريع', image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=600', color: '#1565c0' },
]

export const rewards = [
  { id: 'r1', title: 'خصم 10%', desc: 'على طلبك القادم', cost: 500 },
  { id: 'r2', title: 'توصيل مجاني', desc: 'لطلب واحد', cost: 1000 },
  { id: 'r3', title: 'خصم 25%', desc: 'على المشروبات', cost: 2000 },
]

export const user = {
  name: 'مستخدم M10',
  phone: '0770 123 4567',
  points: 2500,
  tier: 'Gold',
  address: {
    label: 'المنزل',
    city: 'بغداد',
    area: 'المنصور',
    details: 'شارع 14 رمضان',
  },
}
