/** M10 Market mock data - Metro style with brands and categories */

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
    logo: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=200',
    city: 'بغداد',
    cityEn: 'Baghdad',
    area: 'المنصور',
    phone: '+9647509703030',
  },
]

export const brands = [
  { id: 'nescafe', name: 'Nescafe', nameAr: 'نسكافيه', nameTr: 'Nescafe', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Nescafe_logo.svg/200px-Nescafe_logo.svg.png', color: '#6B3A20' },
  { id: 'coca-cola', name: 'Coca-Cola', nameAr: 'كوكا كولا', nameTr: 'Coca-Cola', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Coca-Cola_logo.svg/200px-Coca-Cola_logo.svg.png', color: '#E31E24' },
  { id: 'pinar', name: 'Pınar', nameAr: 'بينار', nameTr: 'Pınar', logo: 'https://www.pinar.com.tr/Content/img/pinar-logo.svg', color: '#00A651' },
  { id: 'ulker', name: 'Ülker', nameAr: 'أولكر', nameTr: 'Ülker', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Ulker-logo.svg/200px-Ulker-logo.svg.png', color: '#E31E24' },
  { id: 'eti', name: 'Eti', nameAr: 'إيتي', nameTr: 'Eti', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Eti_logo.svg/200px-Eti_logo.svg.png', color: '#E31E24' },
  { id: 'maggi', name: 'Maggi', nameAr: 'ماجي', nameTr: 'Maggi', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Maggi_Logo.svg/200px-Maggi_Logo.svg.png', color: '#FFD700' },
]

const allProducts = [
  // Produce - Fruits & Vegetables
  { id: 'p-banana', aisle: 'produce', brand: null, names: { ar: 'موز', en: 'Banana Kg', tr: 'Muz İthal Kg' }, price: 3150, image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400', unit: 'kg' },
  { id: 'p-apple', aisle: 'produce', brand: null, names: { ar: 'تفاح أخضر', en: 'Granny Smith Apple Kg', tr: 'Elma Granny Smith Kg' }, price: 2000, image: 'https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=400', unit: 'kg' },
  { id: 'p-tomato', aisle: 'produce', brand: null, names: { ar: 'طماطم', en: 'Tomato Kg', tr: 'Domates Kg' }, price: 1450, image: 'https://images.unsplash.com/photo-1546470427-227c7f3f5c71?w=400', unit: 'kg' },
  { id: 'p-cucumber', aisle: 'produce', brand: null, names: { ar: 'خيار', en: 'Cucumber Kg', tr: 'Hıyar Kg' }, price: 850, image: 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=400', unit: 'kg' },
  { id: 'p-orange', aisle: 'produce', brand: null, names: { ar: 'برتقال', en: 'Orange Kg', tr: 'Portakal Kg' }, price: 2500, image: 'https://images.unsplash.com/photo-1547514701-42782101795e?w=400', unit: 'kg' },
  { id: 'p-lemon', aisle: 'produce', brand: null, names: { ar: 'ليمون', en: 'Lemon Kg', tr: 'Limon Kg' }, price: 1800, image: 'https://images.unsplash.com/photo-1590502593747-42a996133562?w=400', unit: 'kg' },
  
  // Nescafe Products
  { id: 'n-mocha', aisle: 'drinks', brand: 'nescafe', names: { ar: 'نسكافيه موكا', en: 'Nescafe Mocha Iced Coffee', tr: 'Nescafe Mocha Iced Coffee' }, price: 1000, image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400', popular: true },
  { id: 'n-latte', aisle: 'drinks', brand: 'nescafe', names: { ar: 'نسكافيه لاتيه', en: 'Nescafe Iced Spanish Latte', tr: 'Nescafe Iced Spanish Latte' }, price: 1000, image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=400', popular: true },
  { id: 'n-cappuccino', aisle: 'drinks', brand: 'nescafe', names: { ar: 'نسكافيه كابتشينو', en: 'Nescafe Cappuccino Ice', tr: 'Nescafe Cappuccino Ice' }, price: 1000, image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400' },
  { id: 'n-vanilla', aisle: 'drinks', brand: 'nescafe', names: { ar: 'نسكافيه فانيلا', en: 'Nescafe Latte Vanilla', tr: 'Nescafe Latte Vanilla' }, price: 1000, image: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=400' },
  
  // Coca-Cola Products
  { id: 'c-cola', aisle: 'drinks', brand: 'coca-cola', names: { ar: 'كوكا كولا', en: 'Coca-Cola Original', tr: 'Coca-Cola Orijinal' }, price: 750, oldPrice: 1000, image: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400', popular: true },
  { id: 'c-zero', aisle: 'drinks', brand: 'coca-cola', names: { ar: 'كوكا زيرو', en: 'Coca-Cola Zero', tr: 'Coca-Cola Zero' }, price: 750, image: 'https://images.unsplash.com/photo-1624552184280-9e9631bbeee9?w=400' },
  { id: 'c-fanta', aisle: 'drinks', brand: 'coca-cola', names: { ar: 'فانتا برتقال', en: 'Fanta Orange', tr: 'Fanta Portakal' }, price: 750, image: 'https://images.unsplash.com/photo-1624517452488-04869289c4ca?w=400' },
  { id: 'c-sprite', aisle: 'drinks', brand: 'coca-cola', names: { ar: 'سبرايت', en: 'Sprite', tr: 'Sprite' }, price: 750, image: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=400' },
  
  // Dairy
  { id: 'd-milk', aisle: 'dairy', brand: 'pinar', names: { ar: 'حليب طازج', en: 'Fresh Milk 1L', tr: 'Taze Süt 1L' }, price: 1500, image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400' },
  { id: 'd-yogurt', aisle: 'dairy', brand: 'pinar', names: { ar: 'زبادي', en: 'Yogurt 500g', tr: 'Yoğurt 500g' }, price: 1200, image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400' },
  { id: 'd-cheese', aisle: 'dairy', brand: 'pinar', names: { ar: 'جبنة بيضاء', en: 'White Cheese', tr: 'Beyaz Peynir' }, price: 2500, oldPrice: 3000, image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400', popular: true },
  { id: 'd-butter', aisle: 'dairy', brand: 'pinar', names: { ar: 'زبدة', en: 'Butter 250g', tr: 'Tereyağı 250g' }, price: 3500, image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400' },
  
  // Snacks - Ulker
  { id: 's-biskrem', aisle: 'snacks', brand: 'ulker', names: { ar: 'بسكريم', en: 'Biskrem Cocoa', tr: 'Biskrem Kakao' }, price: 1500, image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400', popular: true },
  { id: 's-ikram', aisle: 'snacks', brand: 'ulker', names: { ar: 'إكرام', en: 'Ikram Chocolate', tr: 'İkram Çikolata' }, price: 2000, image: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=400' },
  { id: 's-halley', aisle: 'snacks', brand: 'ulker', names: { ar: 'هالي', en: 'Halley Chocolate', tr: 'Halley Çikolata' }, price: 1800, oldPrice: 2200, image: 'https://images.unsplash.com/photo-1548365328-8c6db3220e4c?w=400' },
  
  // Snacks - Eti
  { id: 's-browni', aisle: 'snacks', brand: 'eti', names: { ar: 'براوني', en: 'Browni Gold Cake', tr: 'Browni Gold Kek' }, price: 1200, image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400', popular: true },
  { id: 's-negro', aisle: 'snacks', brand: 'eti', names: { ar: 'نيغرو', en: 'Negro Biscuit', tr: 'Negro Bisküvi' }, price: 1500, image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400' },
  { id: 's-karam', aisle: 'snacks', brand: 'eti', names: { ar: 'كرم', en: 'Karam Gurme Bitter', tr: 'Karam Gurme Bitter' }, price: 1800, image: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?w=400' },
  
  // Pantry - Maggi
  { id: 'g-noodles', aisle: 'pantry', brand: 'maggi', names: { ar: 'نودلز ماجي', en: 'Maggi Noodles', tr: 'Maggi Noodle' }, price: 500, image: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400', popular: true },
  { id: 'g-soup', aisle: 'pantry', brand: 'maggi', names: { ar: 'شوربة ماجي', en: 'Maggi Soup', tr: 'Maggi Çorba' }, price: 750, image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400' },
  { id: 'g-cube', aisle: 'pantry', brand: 'maggi', names: { ar: 'مكعبات ماجي', en: 'Maggi Cubes', tr: 'Maggi Küp' }, price: 300, image: 'https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?w=400' },
  
  // Bakery
  { id: 'b-bread', aisle: 'bakery', brand: null, names: { ar: 'خبز عربي', en: 'Arabic Bread', tr: 'Arap Ekmeği' }, price: 500, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400' },
  { id: 'b-toast', aisle: 'bakery', brand: null, names: { ar: 'توست', en: 'Toast Bread', tr: 'Tost Ekmeği' }, price: 1000, image: 'https://images.unsplash.com/photo-1619535860434-ba1d8fa12536?w=400' },
  { id: 'b-croissant', aisle: 'bakery', brand: null, names: { ar: 'كرواسون', en: 'Croissant', tr: 'Kruvasan' }, price: 750, image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400', popular: true },
  
  // Meat
  { id: 'm-beef', aisle: 'meat', brand: null, names: { ar: 'لحم بقري', en: 'Beef Kg', tr: 'Dana Eti Kg' }, price: 25000, image: 'https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=400' },
  { id: 'm-lamb', aisle: 'meat', brand: null, names: { ar: 'لحم غنم', en: 'Lamb Kg', tr: 'Kuzu Eti Kg' }, price: 30000, oldPrice: 35000, image: 'https://images.unsplash.com/photo-1602470520998-f4a52199a3d6?w=400', popular: true },
  { id: 'm-minced', aisle: 'meat', brand: null, names: { ar: 'لحم مفروم', en: 'Minced Meat Kg', tr: 'Kıyma Kg' }, price: 20000, image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400' },
  
  // Chicken
  { id: 'ch-whole', aisle: 'ready', brand: null, names: { ar: 'دجاج كامل', en: 'Whole Chicken', tr: 'Bütün Tavuk' }, price: 8000, image: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=400' },
  { id: 'ch-breast', aisle: 'ready', brand: null, names: { ar: 'صدر دجاج', en: 'Chicken Breast Kg', tr: 'Tavuk Göğsü Kg' }, price: 12000, oldPrice: 15000, image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400', popular: true },
  { id: 'ch-wings', aisle: 'ready', brand: null, names: { ar: 'أجنحة دجاج', en: 'Chicken Wings Kg', tr: 'Tavuk Kanat Kg' }, price: 10000, image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400' },
]

export const getStore = (id) => stores.find(s => s.id === id) || stores[0]
export const getProducts = () => allProducts
export const getProductsByCategory = (categoryId) => {
  if (categoryId === 'offers') return allProducts.filter(p => p.popular || p.oldPrice)
  return allProducts.filter(p => p.aisle === categoryId)
}
export const getProductsByBrand = (brandId) => allProducts.filter(p => p.brand === brandId)
export const getProduct = (storeId, productId) => allProducts.find(p => p.id === productId)

export const categories = [
  { id: 'offers', name: 'العروض', nameAr: 'العروض', nameEn: 'Offers', nameTr: 'Kampanyalar', icon: '🔥' },
  { id: 'produce', name: 'خضار وفواكه', nameAr: 'خضار وفواكه', nameEn: 'Fresh Produce', nameTr: 'Taze Sebze & Meyve', icon: '🥬' },
  { id: 'meat', name: 'اللحوم', nameAr: 'اللحوم', nameEn: 'Meat', nameTr: 'Et', icon: '🥩' },
  { id: 'ready', name: 'الدجاج', nameAr: 'الدجاج', nameEn: 'Chicken', nameTr: 'Tavuk', icon: '🍗' },
  { id: 'dairy', name: 'الألبان', nameAr: 'ألبان وبيض', nameEn: 'Dairy & Eggs', nameTr: 'Süt Ürünleri', icon: '🥛' },
  { id: 'drinks', name: 'المشروبات', nameAr: 'المشروبات', nameEn: 'Drinks', nameTr: 'İçecekler', icon: '🥤' },
  { id: 'bakery', name: 'المخبوزات', nameAr: 'خبز ومخبز', nameEn: 'Bread & Bakery', nameTr: 'Ekmek & Fırın', icon: '🥖' },
  { id: 'pantry', name: 'المؤن', nameAr: 'مواد غذائية', nameEn: 'Grocery', nameTr: 'Temel Gıda', icon: '🫙' },
  { id: 'snacks', name: 'سناكات', nameAr: 'سناكات', nameEn: 'Snacks', nameTr: 'Atıştırmalık', icon: '🍿' },
  { id: 'frozen', name: 'المجمدات', nameAr: 'المجمدات', nameEn: 'Frozen', nameTr: 'Dondurulmuş', icon: '❄️' },
  { id: 'household', name: 'تنظيف', nameAr: 'تنظيف', nameEn: 'Cleaning', nameTr: 'Temizlik', icon: '🧹' },
  { id: 'personal', name: 'العناية', nameAr: 'عناية شخصية', nameEn: 'Personal Care', nameTr: 'Kişisel Bakım', icon: '🧴' },
]

export const getCategoryName = (cat, lang = 'ar') => {
  if (!cat) return ''
  if (lang === 'tr') return cat.nameTr || cat.nameEn || cat.name
  if (lang === 'en') return cat.nameEn || cat.name
  return cat.nameAr || cat.name
}

export const getBrandName = (brand, lang = 'ar') => {
  if (!brand) return ''
  if (lang === 'ar') return brand.nameAr || brand.name
  if (lang === 'tr') return brand.nameTr || brand.name
  return brand.name
}

export const banners = [
  { 
    id: 'produce-banner', 
    type: 'category',
    category: 'produce',
    titles: { ar: 'طازج يومياً', en: 'Farm Fresh', tr: 'Her Gün Taze' },
    subtitles: { ar: 'خضار وفواكه', en: 'Fresh Produce', tr: 'Taze Sebze & Meyve' },
    image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=800',
    color: '#4CAF50',
  },
  { 
    id: 'nescafe-banner', 
    type: 'brand',
    brand: 'nescafe',
    titles: { ar: 'طريقة أفضل للاستمتاع بالقهوة', en: 'A cooler way to enjoy Coffee', tr: 'Kahvenin tadını çıkarmanın harika yolu' },
    subtitles: { ar: 'نسكافيه', en: 'NESCAFÉ', tr: 'NESCAFÉ' },
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800',
    color: '#6B3A20',
  },
  { 
    id: 'coca-banner', 
    type: 'brand',
    brand: 'coca-cola',
    titles: { ar: 'انتعش مع كوكا كولا', en: 'Refresh with Coca-Cola', tr: 'Coca-Cola ile Serin' },
    subtitles: { ar: 'عروض حصرية', en: 'Special Offers', tr: 'Özel Fırsatlar' },
    image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=800',
    color: '#E31E24',
  },
]

export const ui = {
  ar: {
    flashDeals: '🔥 عروض سريعة',
    popular: '⭐ الأكثر مبيعاً',
    shopByCategory: 'تسوق حسب التصنيف',
    shopByBrand: 'تسوق حسب العلامة التجارية',
    freshProduce: '🥬 خضار وفواكه طازجة',
    buyAgain: '🔄 اشتر مجدداً',
    viewAll: 'عرض الكل',
    addToCart: 'أضف',
    off: 'خصم',
    viewCart: 'عرض السلة',
    search: 'ابحث في آلاف المنتجات...',
    login: 'تسجيل الدخول',
    register: 'إنشاء حساب',
    orders: 'طلباتي',
    favorites: 'المفضلة',
    cart: 'سلة التسوق',
    categories: 'التصنيفات',
    farmFresh: 'طازج يومياً',
    dailyFresh: 'من المزرعة إليك',
  },
  tr: {
    flashDeals: '🔥 Fırsat Ürünleri',
    popular: '⭐ Çok Satanlar',
    shopByCategory: 'Kategorilere Göre',
    shopByBrand: 'Markalara Göre',
    freshProduce: '🥬 Taze Sebze & Meyve',
    buyAgain: '🔄 Tekrar Al',
    viewAll: 'Tümünü Gör',
    addToCart: 'Ekle',
    off: 'İndirim',
    viewCart: 'Sepeti Gör',
    search: 'Binlerce ürün içinde ara...',
    login: 'Giriş Yap',
    register: 'Üye Ol',
    orders: 'Siparişlerim',
    favorites: 'Favorilerim',
    cart: 'Sepetim',
    categories: 'Kategoriler',
    farmFresh: 'Her Gün Taze',
    dailyFresh: 'Çiftlikten Sofranıza',
  },
  en: {
    flashDeals: '🔥 Flash Deals',
    popular: '⭐ Best Sellers',
    shopByCategory: 'Shop by Category',
    shopByBrand: 'Shop by Brand',
    freshProduce: '🥬 Fresh Produce',
    buyAgain: '🔄 Buy Again',
    viewAll: 'View All',
    addToCart: 'Add',
    off: 'OFF',
    viewCart: 'View Cart',
    search: 'Search thousands of products...',
    login: 'Sign In',
    register: 'Register',
    orders: 'My Orders',
    favorites: 'Favorites',
    cart: 'Cart',
    categories: 'Categories',
    farmFresh: 'Farm Fresh',
    dailyFresh: 'From Farm to You',
  },
}

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
    city: 'بغداد',
    area: 'المنصور',
    details: 'شارع فلسطين',
  },
}
