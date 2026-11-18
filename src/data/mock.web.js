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
  { 
    id: 'p1', 
    name: 'حليب طازج', 
    nameAr: 'حليب طازج',
    nameEn: 'Fresh Milk', 
    price: 2500, 
    oldPrice: 3200,
    image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=300', 
    aisle: 'dairy',
    desc: '1 لتر - طازج يومياً'
  },
  { 
    id: 'p2', 
    name: 'خبز عربي', 
    nameAr: 'خبز عربي',
    nameEn: 'Arabic Bread', 
    price: 1500, 
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300', 
    aisle: 'bakery',
    desc: 'طازج من المخبز'
  },
  { 
    id: 'p3', 
    name: 'طماطم طازجة', 
    nameAr: 'طماطم طازجة',
    nameEn: 'Fresh Tomatoes', 
    price: 3000, 
    oldPrice: 4000,
    image: 'https://images.unsplash.com/photo-1546470427-227c7f3f5c71?w=300', 
    aisle: 'produce',
    desc: '1 كيلو - عضوي'
  },
  { 
    id: 'p4', 
    name: 'دجاج طازج', 
    nameAr: 'دجاج طازج',
    nameEn: 'Fresh Chicken', 
    price: 12000, 
    oldPrice: 15000,
    image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=300', 
    aisle: 'meat',
    desc: '1 كيلو - بدون هرمونات'
  },
  { 
    id: 'p5', 
    name: 'أرز بسمتي', 
    nameAr: 'أرز بسمتي',
    nameEn: 'Basmati Rice', 
    price: 8000, 
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300', 
    aisle: 'pantry',
    desc: '2 كيلو - هندي أصلي'
  },
  { 
    id: 'p6', 
    name: 'زيت زيتون', 
    nameAr: 'زيت زيتون بكر',
    nameEn: 'Olive Oil', 
    price: 15000, 
    oldPrice: 18000,
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300', 
    aisle: 'pantry',
    desc: '500 مل - إسباني'
  },
  { 
    id: 'p7', 
    name: 'عصير برتقال', 
    nameAr: 'عصير برتقال طبيعي',
    nameEn: 'Orange Juice', 
    price: 4500, 
    oldPrice: 5500,
    image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=300', 
    aisle: 'drinks',
    desc: '1 لتر - 100% طبيعي'
  },
  { 
    id: 'p8', 
    name: 'بيض عضوي', 
    nameAr: 'بيض عضوي',
    nameEn: 'Organic Eggs', 
    price: 6000, 
    image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=300', 
    aisle: 'dairy',
    desc: '30 بيضة - مزرعة محلية'
  },
]

export const getStore = (id) => stores.find(s => s.id === id) || stores[0]

export const getProducts = (storeId) => sampleProducts

export const getProduct = (storeId, productId) => sampleProducts.find(p => p.id === productId)

export const categories = [
  { id: 'offers', name: 'العروض', nameAr: 'العروض', nameEn: 'Offers' },
  { id: 'meat', name: 'اللحوم', nameAr: 'اللحوم', nameEn: 'Meat' },
  { id: 'dairy', name: 'الألبان', nameAr: 'الألبان', nameEn: 'Dairy' },
  { id: 'produce', name: 'خضار وفواكه', nameAr: 'خضار وفواكه', nameEn: 'Produce' },
  { id: 'bakery', name: 'المخبوزات', nameAr: 'المخبوزات', nameEn: 'Bakery' },
  { id: 'pantry', name: 'المؤن', nameAr: 'المؤن', nameEn: 'Pantry' },
  { id: 'drinks', name: 'المشروبات', nameAr: 'المشروبات', nameEn: 'Drinks' },
  { id: 'snacks', name: 'وجبات خفيفة', nameAr: 'وجبات خفيفة', nameEn: 'Snacks' },
  { id: 'frozen', name: 'المجمدات', nameAr: 'المجمدات', nameEn: 'Frozen' },
  { id: 'household', name: 'تنظيف', nameAr: 'تنظيف', nameEn: 'Household' },
  { id: 'personal', name: 'العناية الشخصية', nameAr: 'العناية', nameEn: 'Personal Care' },
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
