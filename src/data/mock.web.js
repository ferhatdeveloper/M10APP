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
    id: 'ko-meat-meal-rice', 
    name: 'وجبة لحم مع رز', 
    nameAr: 'وجبة لحم مع رز',
    nameEn: 'Meat Meal & Rice',
    nameTr: 'Et Yemek & Pilav',
    price: 10000, 
    oldPrice: 12500,
    image: 'https://menu.kucoglu.restaurant/assets/branch/350070b98d6cc8dd7ade992217fac9317b0ddf16d085d80d914fb81c074ab1de.webp', 
    aisle: 'meat',
    desc: 'اللحوم',
    popular: true
  },
  { 
    id: 'ko-iskender', 
    name: 'إسكندر', 
    nameAr: 'إسكندر',
    nameEn: 'Iskender',
    nameTr: 'İskender',
    price: 12000, 
    oldPrice: 15000,
    image: 'https://menu.kucoglu.restaurant/assets/branch/3b19aac4b3afc24912433b5abf30e098e31c6e71e3172e473679e07527d48b0f.webp', 
    aisle: 'meat',
    desc: 'اللحوم',
    popular: true
  },
  { 
    id: 'ko-meat-roll', 
    name: 'رول لحم', 
    nameAr: 'رول لحم',
    nameEn: 'Meat Roll',
    nameTr: 'Et Dürüm',
    price: 4500, 
    image: 'https://menu.kucoglu.restaurant/assets/branch/393ad472653dd16e59ae93a45b7e4a2411e613f97bb53e9ec7058a8858141452.webp', 
    aisle: 'meat',
    desc: 'اللحوم'
  },
  { 
    id: 'ko-chicken-iskender', 
    name: 'إسكندر دجاج', 
    nameAr: 'إسكندر دجاج',
    nameEn: 'Chicken Iskender',
    nameTr: 'Tavuk İskender',
    price: 10000, 
    oldPrice: 12000,
    image: 'https://menu.kucoglu.restaurant/assets/branch/d4b8bd5e55fd78ba731e32e2b31e0a1b1c3c5f3ec1d1f4a4b6a8c0e2d4f6a8c0.webp', 
    aisle: 'ready',
    desc: 'دجاج',
    popular: true
  },
  { 
    id: 'ko-chicken-roll', 
    name: 'رول دجاج', 
    nameAr: 'رول دجاج',
    nameEn: 'Chicken Roll',
    nameTr: 'Tavuk Dürüm',
    price: 3500, 
    image: 'https://menu.kucoglu.restaurant/assets/branch/e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2.webp', 
    aisle: 'ready',
    desc: 'دجاج'
  },
  { 
    id: 'ko-ayran', 
    name: 'عيران', 
    nameAr: 'عيران',
    nameEn: 'Ayran',
    nameTr: 'Ayran',
    price: 1500, 
    image: 'https://images.unsplash.com/photo-1626201850129-a4a7cac0c06f?w=300', 
    aisle: 'drinks',
    desc: 'مشروبات'
  },
  { 
    id: 'ko-cola', 
    name: 'كولا', 
    nameAr: 'كولا',
    nameEn: 'Cola',
    nameTr: 'Kola',
    price: 2000, 
    oldPrice: 2500,
    image: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=300', 
    aisle: 'drinks',
    desc: 'مشروبات'
  },
  { 
    id: 'ko-water', 
    name: 'ماء', 
    nameAr: 'ماء',
    nameEn: 'Water',
    nameTr: 'Su',
    price: 500, 
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300', 
    aisle: 'drinks',
    desc: 'مشروبات'
  },
  { 
    id: 'p-milk', 
    name: 'حليب طازج', 
    nameAr: 'حليب طازج',
    nameEn: 'Fresh Milk',
    nameTr: 'Taze Süt',
    price: 2500, 
    oldPrice: 3200,
    image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=300', 
    aisle: 'dairy',
    desc: '1 لتر - طازج يومياً'
  },
  { 
    id: 'p-bread', 
    name: 'خبز عربي', 
    nameAr: 'خبز عربي',
    nameEn: 'Arabic Bread',
    nameTr: 'Arap Ekmeği',
    price: 1500, 
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300', 
    aisle: 'bakery',
    desc: 'طازج من المخبز'
  },
  { 
    id: 'p-tomato', 
    name: 'طماطم طازجة', 
    nameAr: 'طماطم طازجة',
    nameEn: 'Fresh Tomatoes',
    nameTr: 'Taze Domates',
    price: 3000, 
    oldPrice: 4000,
    image: 'https://images.unsplash.com/photo-1546470427-227c7f3f5c71?w=300', 
    aisle: 'produce',
    desc: '1 كيلو - عضوي'
  },
  { 
    id: 'p-rice', 
    name: 'أرز بسمتي', 
    nameAr: 'أرز بسمتي',
    nameEn: 'Basmati Rice',
    nameTr: 'Basmati Pirinç',
    price: 8000, 
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300', 
    aisle: 'pantry',
    desc: '2 كيلو - هندي أصلي'
  },
  { 
    id: 'p-olive-oil', 
    name: 'زيت زيتون', 
    nameAr: 'زيت زيتون بكر',
    nameEn: 'Olive Oil',
    nameTr: 'Zeytinyağı',
    price: 15000, 
    oldPrice: 18000,
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300', 
    aisle: 'pantry',
    desc: '500 مل - إسباني'
  },
  { 
    id: 'p-eggs', 
    name: 'بيض عضوي', 
    nameAr: 'بيض عضوي',
    nameEn: 'Organic Eggs',
    nameTr: 'Organik Yumurta',
    price: 6000, 
    image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=300', 
    aisle: 'dairy',
    desc: '30 بيضة - مزرعة محلية'
  },
  { 
    id: 'p-cheese', 
    name: 'جبنة بيضاء', 
    nameAr: 'جبنة بيضاء',
    nameEn: 'White Cheese',
    nameTr: 'Beyaz Peynir',
    price: 7500, 
    oldPrice: 9000,
    image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=300', 
    aisle: 'dairy',
    desc: '500 غرام - محلي'
  },
  { 
    id: 'p-orange', 
    name: 'برتقال طازج', 
    nameAr: 'برتقال طازج',
    nameEn: 'Fresh Oranges',
    nameTr: 'Taze Portakal',
    price: 5000, 
    image: 'https://images.unsplash.com/photo-1547514701-42782101795e?w=300', 
    aisle: 'produce',
    desc: '1 كيلو'
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
