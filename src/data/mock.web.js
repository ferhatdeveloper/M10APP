/** M10 Market mock data - Full product catalog */

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
]

export const brands = [
  { id: 'nescafe', name: 'Nescafe', nameAr: 'نسكافيه', nameTr: 'Nescafe', color: '#6B3A20' },
  { id: 'coca-cola', name: 'Coca-Cola', nameAr: 'كوكا كولا', nameTr: 'Coca-Cola', color: '#E31E24' },
  { id: 'pinar', name: 'Pınar', nameAr: 'بينار', nameTr: 'Pınar', color: '#00A651' },
  { id: 'ulker', name: 'Ülker', nameAr: 'أولكر', nameTr: 'Ülker', color: '#E31E24' },
  { id: 'eti', name: 'Eti', nameAr: 'إيتي', nameTr: 'Eti', color: '#E31E24' },
  { id: 'maggi', name: 'Maggi', nameAr: 'ماجي', nameTr: 'Maggi', color: '#FFD700' },
  { id: 'lipton', name: 'Lipton', nameAr: 'ليبتون', nameTr: 'Lipton', color: '#FFD700' },
  { id: 'knorr', name: 'Knorr', nameAr: 'كنور', nameTr: 'Knorr', color: '#00A651' },
]

const allProducts = [
  // ═══════════════════════════════════════════════════════════════
  // PRODUCE - Fresh Fruits & Vegetables (12 items)
  // ═══════════════════════════════════════════════════════════════
  { id: 'p-banana', aisle: 'produce', brand: null, names: { ar: 'موز', en: 'Banana Kg', tr: 'Muz İthal Kg' }, price: 3150, image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400', unit: 'kg' },
  { id: 'p-apple-green', aisle: 'produce', brand: null, names: { ar: 'تفاح أخضر', en: 'Green Apple Kg', tr: 'Yeşil Elma Kg' }, price: 2000, image: 'https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=400', unit: 'kg' },
  { id: 'p-apple-red', aisle: 'produce', brand: null, names: { ar: 'تفاح أحمر', en: 'Red Apple Kg', tr: 'Kırmızı Elma Kg' }, price: 2200, image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400', unit: 'kg', popular: true },
  { id: 'p-tomato', aisle: 'produce', brand: null, names: { ar: 'طماطم', en: 'Tomato Kg', tr: 'Domates Kg' }, price: 1450, image: 'https://images.unsplash.com/photo-1546470427-227c7f3f5c71?w=400', unit: 'kg' },
  { id: 'p-cucumber', aisle: 'produce', brand: null, names: { ar: 'خيار', en: 'Cucumber Kg', tr: 'Hıyar Kg' }, price: 850, image: 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=400', unit: 'kg' },
  { id: 'p-orange', aisle: 'produce', brand: null, names: { ar: 'برتقال', en: 'Orange Kg', tr: 'Portakal Kg' }, price: 2500, image: 'https://images.unsplash.com/photo-1547514701-42782101795e?w=400', unit: 'kg', popular: true },
  { id: 'p-lemon', aisle: 'produce', brand: null, names: { ar: 'ليمون', en: 'Lemon Kg', tr: 'Limon Kg' }, price: 1800, image: 'https://images.unsplash.com/photo-1590502593747-42a996133562?w=400', unit: 'kg' },
  { id: 'p-potato', aisle: 'produce', brand: null, names: { ar: 'بطاطس', en: 'Potato Kg', tr: 'Patates Kg' }, price: 1200, image: 'https://images.unsplash.com/photo-1518977676601-b53f82ber73?w=400', unit: 'kg' },
  { id: 'p-onion', aisle: 'produce', brand: null, names: { ar: 'بصل', en: 'Onion Kg', tr: 'Soğan Kg' }, price: 900, image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400', unit: 'kg' },
  { id: 'p-carrot', aisle: 'produce', brand: null, names: { ar: 'جزر', en: 'Carrot Kg', tr: 'Havuç Kg' }, price: 1100, image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400', unit: 'kg' },
  { id: 'p-pepper', aisle: 'produce', brand: null, names: { ar: 'فلفل رومي', en: 'Bell Pepper Kg', tr: 'Dolmalık Biber Kg' }, price: 2800, image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400', unit: 'kg' },
  { id: 'p-lettuce', aisle: 'produce', brand: null, names: { ar: 'خس', en: 'Lettuce', tr: 'Marul' }, price: 750, image: 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=400', unit: 'pcs' },

  // ═══════════════════════════════════════════════════════════════
  // MEAT - Fresh Meat (8 items)
  // ═══════════════════════════════════════════════════════════════
  { id: 'm-beef', aisle: 'meat', brand: null, names: { ar: 'لحم بقري', en: 'Beef Kg', tr: 'Dana Eti Kg' }, price: 25000, image: 'https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=400', unit: 'kg' },
  { id: 'm-lamb', aisle: 'meat', brand: null, names: { ar: 'لحم غنم', en: 'Lamb Kg', tr: 'Kuzu Eti Kg' }, price: 30000, oldPrice: 35000, image: 'https://images.unsplash.com/photo-1602470520998-f4a52199a3d6?w=400', unit: 'kg', popular: true },
  { id: 'm-minced', aisle: 'meat', brand: null, names: { ar: 'لحم مفروم', en: 'Minced Meat Kg', tr: 'Kıyma Kg' }, price: 20000, image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400', unit: 'kg' },
  { id: 'm-steak', aisle: 'meat', brand: null, names: { ar: 'ستيك', en: 'Steak', tr: 'Biftek' }, price: 35000, oldPrice: 40000, image: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=400', unit: 'kg', popular: true },
  { id: 'm-kebab', aisle: 'meat', brand: null, names: { ar: 'كباب جاهز', en: 'Ready Kebab', tr: 'Hazır Kebap' }, price: 18000, image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400', unit: 'kg' },
  { id: 'm-liver', aisle: 'meat', brand: null, names: { ar: 'كبدة', en: 'Liver Kg', tr: 'Ciğer Kg' }, price: 15000, image: 'https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=400', unit: 'kg' },
  { id: 'm-sausage', aisle: 'meat', brand: null, names: { ar: 'سجق', en: 'Sausage', tr: 'Sucuk' }, price: 12000, oldPrice: 14000, image: 'https://images.unsplash.com/photo-1558030006-450675393462?w=400', unit: 'kg' },
  { id: 'm-burger', aisle: 'meat', brand: null, names: { ar: 'برجر لحم', en: 'Beef Burger', tr: 'Dana Burger' }, price: 16000, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', unit: 'pack' },

  // ═══════════════════════════════════════════════════════════════
  // CHICKEN - Poultry (8 items)
  // ═══════════════════════════════════════════════════════════════
  { id: 'ch-whole', aisle: 'ready', brand: null, names: { ar: 'دجاج كامل', en: 'Whole Chicken', tr: 'Bütün Tavuk' }, price: 8000, image: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=400', unit: 'pcs' },
  { id: 'ch-breast', aisle: 'ready', brand: null, names: { ar: 'صدر دجاج', en: 'Chicken Breast Kg', tr: 'Tavuk Göğsü Kg' }, price: 12000, oldPrice: 15000, image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400', unit: 'kg', popular: true },
  { id: 'ch-wings', aisle: 'ready', brand: null, names: { ar: 'أجنحة دجاج', en: 'Chicken Wings Kg', tr: 'Tavuk Kanat Kg' }, price: 10000, image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400', unit: 'kg' },
  { id: 'ch-thigh', aisle: 'ready', brand: null, names: { ar: 'فخذ دجاج', en: 'Chicken Thigh Kg', tr: 'Tavuk But Kg' }, price: 9000, image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=400', unit: 'kg' },
  { id: 'ch-nuggets', aisle: 'ready', brand: null, names: { ar: 'ناجتس دجاج', en: 'Chicken Nuggets', tr: 'Tavuk Nugget' }, price: 8500, oldPrice: 10000, image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=400', unit: 'pack', popular: true },
  { id: 'ch-strips', aisle: 'ready', brand: null, names: { ar: 'شرائح دجاج', en: 'Chicken Strips', tr: 'Tavuk Şinitzel' }, price: 11000, image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400', unit: 'pack' },
  { id: 'ch-burger', aisle: 'ready', brand: null, names: { ar: 'برجر دجاج', en: 'Chicken Burger', tr: 'Tavuk Burger' }, price: 9500, image: 'https://images.unsplash.com/photo-1606728035253-49e8a23146de?w=400', unit: 'pack' },
  { id: 'ch-shawarma', aisle: 'ready', brand: null, names: { ar: 'شاورما دجاج', en: 'Chicken Shawarma', tr: 'Tavuk Döner' }, price: 14000, image: 'https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400', unit: 'kg' },

  // ═══════════════════════════════════════════════════════════════
  // DAIRY - Milk, Cheese, Eggs (10 items)
  // ═══════════════════════════════════════════════════════════════
  { id: 'd-milk', aisle: 'dairy', brand: 'pinar', names: { ar: 'حليب طازج', en: 'Fresh Milk 1L', tr: 'Taze Süt 1L' }, price: 1500, image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400', unit: 'L' },
  { id: 'd-yogurt', aisle: 'dairy', brand: 'pinar', names: { ar: 'زبادي', en: 'Yogurt 500g', tr: 'Yoğurt 500g' }, price: 1200, image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400', unit: 'g' },
  { id: 'd-cheese', aisle: 'dairy', brand: 'pinar', names: { ar: 'جبنة بيضاء', en: 'White Cheese', tr: 'Beyaz Peynir' }, price: 2500, oldPrice: 3000, image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400', unit: 'kg', popular: true },
  { id: 'd-butter', aisle: 'dairy', brand: 'pinar', names: { ar: 'زبدة', en: 'Butter 250g', tr: 'Tereyağı 250g' }, price: 3500, image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400', unit: 'g' },
  { id: 'd-eggs', aisle: 'dairy', brand: null, names: { ar: 'بيض', en: 'Eggs 15pcs', tr: 'Yumurta 15li' }, price: 4500, image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400', unit: 'pack', popular: true },
  { id: 'd-cream', aisle: 'dairy', brand: 'pinar', names: { ar: 'قشطة', en: 'Cream 200ml', tr: 'Krema 200ml' }, price: 1800, image: 'https://images.unsplash.com/photo-1587116861219-230ac19df971?w=400', unit: 'ml' },
  { id: 'd-labneh', aisle: 'dairy', brand: 'pinar', names: { ar: 'لبنة', en: 'Labneh 400g', tr: 'Labne 400g' }, price: 2200, oldPrice: 2800, image: 'https://images.unsplash.com/photo-1559561853-08451507cbe7?w=400', unit: 'g' },
  { id: 'd-cheddar', aisle: 'dairy', brand: null, names: { ar: 'جبنة شيدر', en: 'Cheddar Cheese', tr: 'Kaşar Peyniri' }, price: 4000, image: 'https://images.unsplash.com/photo-1618164436241-4473940d1f5c?w=400', unit: 'kg' },
  { id: 'd-mozzarella', aisle: 'dairy', brand: null, names: { ar: 'موزاريلا', en: 'Mozzarella', tr: 'Mozzarella' }, price: 5500, image: 'https://images.unsplash.com/photo-1626957341926-98752fc2ba90?w=400', unit: 'kg', popular: true },
  { id: 'd-ayran', aisle: 'dairy', brand: 'pinar', names: { ar: 'عيران', en: 'Ayran 1L', tr: 'Ayran 1L' }, price: 1000, image: 'https://images.unsplash.com/photo-1626201850129-a4a7cac0c06f?w=400', unit: 'L' },

  // ═══════════════════════════════════════════════════════════════
  // DRINKS - Beverages (12 items)
  // ═══════════════════════════════════════════════════════════════
  { id: 'dr-cola', aisle: 'drinks', brand: 'coca-cola', names: { ar: 'كوكا كولا', en: 'Coca-Cola 1L', tr: 'Coca-Cola 1L' }, price: 1500, oldPrice: 2000, image: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400', unit: 'L', popular: true },
  { id: 'dr-cola-zero', aisle: 'drinks', brand: 'coca-cola', names: { ar: 'كوكا زيرو', en: 'Coca-Cola Zero', tr: 'Coca-Cola Zero' }, price: 1500, image: 'https://images.unsplash.com/photo-1624552184280-9e9631bbeee9?w=400', unit: 'L' },
  { id: 'dr-fanta', aisle: 'drinks', brand: 'coca-cola', names: { ar: 'فانتا برتقال', en: 'Fanta Orange', tr: 'Fanta Portakal' }, price: 1400, image: 'https://images.unsplash.com/photo-1624517452488-04869289c4ca?w=400', unit: 'L' },
  { id: 'dr-sprite', aisle: 'drinks', brand: 'coca-cola', names: { ar: 'سبرايت', en: 'Sprite 1L', tr: 'Sprite 1L' }, price: 1400, image: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=400', unit: 'L' },
  { id: 'dr-nescafe-mocha', aisle: 'drinks', brand: 'nescafe', names: { ar: 'نسكافيه موكا', en: 'Nescafe Mocha', tr: 'Nescafe Mocha' }, price: 1000, image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400', unit: 'can', popular: true },
  { id: 'dr-nescafe-latte', aisle: 'drinks', brand: 'nescafe', names: { ar: 'نسكافيه لاتيه', en: 'Nescafe Latte', tr: 'Nescafe Latte' }, price: 1000, image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=400', unit: 'can', popular: true },
  { id: 'dr-nescafe-cappuccino', aisle: 'drinks', brand: 'nescafe', names: { ar: 'نسكافيه كابتشينو', en: 'Nescafe Cappuccino', tr: 'Nescafe Cappuccino' }, price: 1000, image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400', unit: 'can' },
  { id: 'dr-water', aisle: 'drinks', brand: null, names: { ar: 'ماء معدني', en: 'Mineral Water 1.5L', tr: 'Maden Suyu 1.5L' }, price: 500, image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400', unit: 'L' },
  { id: 'dr-juice-orange', aisle: 'drinks', brand: null, names: { ar: 'عصير برتقال', en: 'Orange Juice 1L', tr: 'Portakal Suyu 1L' }, price: 2500, oldPrice: 3000, image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400', unit: 'L' },
  { id: 'dr-juice-apple', aisle: 'drinks', brand: null, names: { ar: 'عصير تفاح', en: 'Apple Juice 1L', tr: 'Elma Suyu 1L' }, price: 2500, image: 'https://images.unsplash.com/photo-1576673442511-7e39b6545c87?w=400', unit: 'L' },
  { id: 'dr-tea', aisle: 'drinks', brand: 'lipton', names: { ar: 'شاي ليبتون', en: 'Lipton Tea', tr: 'Lipton Çay' }, price: 3500, image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400', unit: 'box', popular: true },
  { id: 'dr-energy', aisle: 'drinks', brand: null, names: { ar: 'مشروب طاقة', en: 'Energy Drink', tr: 'Enerji İçeceği' }, price: 2000, image: 'https://images.unsplash.com/photo-1622543925917-763c34d1a86e?w=400', unit: 'can' },

  // ═══════════════════════════════════════════════════════════════
  // SNACKS - Chips, Chocolate, Biscuits (12 items)
  // ═══════════════════════════════════════════════════════════════
  { id: 's-biskrem', aisle: 'snacks', brand: 'ulker', names: { ar: 'بسكريم', en: 'Biskrem', tr: 'Biskrem' }, price: 1500, image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400', unit: 'pack', popular: true },
  { id: 's-ikram', aisle: 'snacks', brand: 'ulker', names: { ar: 'إكرام', en: 'Ikram', tr: 'İkram' }, price: 2000, image: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=400', unit: 'pack' },
  { id: 's-halley', aisle: 'snacks', brand: 'ulker', names: { ar: 'هالي', en: 'Halley', tr: 'Halley' }, price: 1800, oldPrice: 2200, image: 'https://images.unsplash.com/photo-1548365328-8c6db3220e4c?w=400', unit: 'pack' },
  { id: 's-browni', aisle: 'snacks', brand: 'eti', names: { ar: 'براوني', en: 'Browni Gold', tr: 'Browni Gold' }, price: 1200, image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400', unit: 'pack', popular: true },
  { id: 's-negro', aisle: 'snacks', brand: 'eti', names: { ar: 'نيغرو', en: 'Negro', tr: 'Negro' }, price: 1500, image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400', unit: 'pack' },
  { id: 's-karam', aisle: 'snacks', brand: 'eti', names: { ar: 'كرم', en: 'Karam Gurme', tr: 'Karam Gurme' }, price: 1800, image: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?w=400', unit: 'pack' },
  { id: 's-chips', aisle: 'snacks', brand: null, names: { ar: 'شيبس', en: 'Potato Chips', tr: 'Patates Cipsi' }, price: 1200, oldPrice: 1500, image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400', unit: 'pack', popular: true },
  { id: 's-doritos', aisle: 'snacks', brand: null, names: { ar: 'دوريتوس', en: 'Doritos', tr: 'Doritos' }, price: 1800, image: 'https://images.unsplash.com/photo-1600952841320-db92ec4047ca?w=400', unit: 'pack' },
  { id: 's-pringles', aisle: 'snacks', brand: null, names: { ar: 'برينجلز', en: 'Pringles', tr: 'Pringles' }, price: 2500, image: 'https://images.unsplash.com/photo-1621447504864-d8686e12698c?w=400', unit: 'can' },
  { id: 's-nuts', aisle: 'snacks', brand: null, names: { ar: 'مكسرات مشكلة', en: 'Mixed Nuts', tr: 'Karışık Kuruyemiş' }, price: 8000, image: 'https://images.unsplash.com/photo-1536591375323-9c7a3e09cfeb?w=400', unit: 'kg', popular: true },
  { id: 's-popcorn', aisle: 'snacks', brand: null, names: { ar: 'فشار', en: 'Popcorn', tr: 'Patlamış Mısır' }, price: 1000, image: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?w=400', unit: 'pack' },
  { id: 's-chocolate', aisle: 'snacks', brand: 'ulker', names: { ar: 'شوكولاتة', en: 'Milk Chocolate', tr: 'Sütlü Çikolata' }, price: 2200, image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400', unit: 'bar' },

  // ═══════════════════════════════════════════════════════════════
  // BAKERY - Bread & Pastry (8 items)
  // ═══════════════════════════════════════════════════════════════
  { id: 'b-bread', aisle: 'bakery', brand: null, names: { ar: 'خبز عربي', en: 'Arabic Bread', tr: 'Arap Ekmeği' }, price: 500, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400', unit: 'pack' },
  { id: 'b-toast', aisle: 'bakery', brand: null, names: { ar: 'توست', en: 'Toast Bread', tr: 'Tost Ekmeği' }, price: 1000, image: 'https://images.unsplash.com/photo-1619535860434-ba1d8fa12536?w=400', unit: 'pack' },
  { id: 'b-croissant', aisle: 'bakery', brand: null, names: { ar: 'كرواسون', en: 'Croissant', tr: 'Kruvasan' }, price: 750, image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400', unit: 'pcs', popular: true },
  { id: 'b-baguette', aisle: 'bakery', brand: null, names: { ar: 'باغيت', en: 'Baguette', tr: 'Baget Ekmek' }, price: 800, image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=400', unit: 'pcs' },
  { id: 'b-cake', aisle: 'bakery', brand: null, names: { ar: 'كيك', en: 'Cake Slice', tr: 'Pasta Dilimi' }, price: 2500, oldPrice: 3000, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400', unit: 'slice', popular: true },
  { id: 'b-donut', aisle: 'bakery', brand: null, names: { ar: 'دونات', en: 'Donut', tr: 'Donut' }, price: 1200, image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400', unit: 'pcs' },
  { id: 'b-muffin', aisle: 'bakery', brand: null, names: { ar: 'مافن', en: 'Muffin', tr: 'Muffin' }, price: 1500, image: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=400', unit: 'pcs' },
  { id: 'b-simit', aisle: 'bakery', brand: null, names: { ar: 'سميط', en: 'Simit', tr: 'Simit' }, price: 500, image: 'https://images.unsplash.com/photo-1620921568790-7dd64b5a08b3?w=400', unit: 'pcs' },

  // ═══════════════════════════════════════════════════════════════
  // PANTRY - Grocery Items (10 items)
  // ═══════════════════════════════════════════════════════════════
  { id: 'g-noodles', aisle: 'pantry', brand: 'maggi', names: { ar: 'نودلز ماجي', en: 'Maggi Noodles', tr: 'Maggi Noodle' }, price: 500, image: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400', unit: 'pack', popular: true },
  { id: 'g-soup', aisle: 'pantry', brand: 'knorr', names: { ar: 'شوربة', en: 'Soup Mix', tr: 'Çorba' }, price: 750, image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400', unit: 'pack' },
  { id: 'g-rice', aisle: 'pantry', brand: null, names: { ar: 'أرز بسمتي', en: 'Basmati Rice 1kg', tr: 'Basmati Pirinç 1kg' }, price: 4500, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400', unit: 'kg', popular: true },
  { id: 'g-pasta', aisle: 'pantry', brand: null, names: { ar: 'مكرونة', en: 'Pasta 500g', tr: 'Makarna 500g' }, price: 1200, image: 'https://images.unsplash.com/photo-1551462147-37885acc36f1?w=400', unit: 'pack' },
  { id: 'g-oil', aisle: 'pantry', brand: null, names: { ar: 'زيت زيتون', en: 'Olive Oil 1L', tr: 'Zeytinyağı 1L' }, price: 12000, oldPrice: 15000, image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400', unit: 'L', popular: true },
  { id: 'g-sunflower', aisle: 'pantry', brand: null, names: { ar: 'زيت عباد الشمس', en: 'Sunflower Oil 2L', tr: 'Ayçiçek Yağı 2L' }, price: 6000, image: 'https://images.unsplash.com/photo-1620574387735-3624d75b2dbc?w=400', unit: 'L' },
  { id: 'g-sugar', aisle: 'pantry', brand: null, names: { ar: 'سكر', en: 'Sugar 1kg', tr: 'Şeker 1kg' }, price: 1500, image: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=400', unit: 'kg' },
  { id: 'g-flour', aisle: 'pantry', brand: null, names: { ar: 'طحين', en: 'Flour 2kg', tr: 'Un 2kg' }, price: 2000, image: 'https://images.unsplash.com/photo-1627485937980-221c8bc3faac?w=400', unit: 'kg' },
  { id: 'g-tomato-paste', aisle: 'pantry', brand: null, names: { ar: 'معجون طماطم', en: 'Tomato Paste', tr: 'Domates Salçası' }, price: 1800, image: 'https://images.unsplash.com/photo-1608877907149-a206d75ba011?w=400', unit: 'jar' },
  { id: 'g-honey', aisle: 'pantry', brand: null, names: { ar: 'عسل', en: 'Honey 500g', tr: 'Bal 500g' }, price: 8000, oldPrice: 10000, image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400', unit: 'jar', popular: true },

  // ═══════════════════════════════════════════════════════════════
  // FROZEN - Frozen Foods (8 items)
  // ═══════════════════════════════════════════════════════════════
  { id: 'f-pizza', aisle: 'frozen', brand: null, names: { ar: 'بيتزا مجمدة', en: 'Frozen Pizza', tr: 'Donmuş Pizza' }, price: 6000, oldPrice: 7500, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400', unit: 'pcs', popular: true },
  { id: 'f-fries', aisle: 'frozen', brand: null, names: { ar: 'بطاطس مقلية', en: 'French Fries 1kg', tr: 'Patates Kızartması 1kg' }, price: 3500, image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400', unit: 'kg' },
  { id: 'f-icecream', aisle: 'frozen', brand: null, names: { ar: 'آيس كريم', en: 'Ice Cream 1L', tr: 'Dondurma 1L' }, price: 5000, image: 'https://images.unsplash.com/photo-1488900128323-21503983a07e?w=400', unit: 'L', popular: true },
  { id: 'f-peas', aisle: 'frozen', brand: null, names: { ar: 'بازلاء مجمدة', en: 'Frozen Peas 1kg', tr: 'Donmuş Bezelye 1kg' }, price: 2500, image: 'https://images.unsplash.com/photo-1587735243474-96566ec3b66d?w=400', unit: 'kg' },
  { id: 'f-corn', aisle: 'frozen', brand: null, names: { ar: 'ذرة مجمدة', en: 'Frozen Corn 1kg', tr: 'Donmuş Mısır 1kg' }, price: 2500, image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400', unit: 'kg' },
  { id: 'f-spinach', aisle: 'frozen', brand: null, names: { ar: 'سبانخ مجمدة', en: 'Frozen Spinach', tr: 'Donmuş Ispanak' }, price: 2000, image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400', unit: 'kg' },
  { id: 'f-samosa', aisle: 'frozen', brand: null, names: { ar: 'سمبوسة', en: 'Samosa Pack', tr: 'Samosa' }, price: 3500, oldPrice: 4500, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400', unit: 'pack' },
  { id: 'f-spring-roll', aisle: 'frozen', brand: null, names: { ar: 'سبرينج رول', en: 'Spring Roll', tr: 'Sigara Böreği' }, price: 4000, image: 'https://images.unsplash.com/photo-1548507200-de77525d3c64?w=400', unit: 'pack' },
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
  { id: 'offers', name: 'العروض', nameAr: 'العروض', nameEn: 'Offers', nameTr: 'Kampanyalar', icon: '🔥', color: '#E31E24' },
  { id: 'produce', name: 'خضار وفواكه', nameAr: 'خضار وفواكه', nameEn: 'Fresh Produce', nameTr: 'Taze Sebze & Meyve', icon: '🥬', color: '#4CAF50' },
  { id: 'meat', name: 'اللحوم', nameAr: 'اللحوم', nameEn: 'Meat', nameTr: 'Et', icon: '🥩', color: '#B71C1C' },
  { id: 'ready', name: 'الدجاج', nameAr: 'الدجاج', nameEn: 'Chicken', nameTr: 'Tavuk', icon: '🍗', color: '#FF9800' },
  { id: 'dairy', name: 'الألبان', nameAr: 'ألبان وبيض', nameEn: 'Dairy & Eggs', nameTr: 'Süt Ürünleri', icon: '🥛', color: '#2196F3' },
  { id: 'drinks', name: 'المشروبات', nameAr: 'المشروبات', nameEn: 'Drinks', nameTr: 'İçecekler', icon: '🥤', color: '#E31E24' },
  { id: 'bakery', name: 'المخبوزات', nameAr: 'خبز ومخبز', nameEn: 'Bread & Bakery', nameTr: 'Ekmek & Fırın', icon: '🥖', color: '#8D6E63' },
  { id: 'pantry', name: 'المؤن', nameAr: 'مواد غذائية', nameEn: 'Grocery', nameTr: 'Temel Gıda', icon: '🫙', color: '#795548' },
  { id: 'snacks', name: 'سناكات', nameAr: 'سناكات', nameEn: 'Snacks', nameTr: 'Atıştırmalık', icon: '🍿', color: '#FF5722' },
  { id: 'frozen', name: 'المجمدات', nameAr: 'المجمدات', nameEn: 'Frozen', nameTr: 'Dondurulmuş', icon: '❄️', color: '#00BCD4' },
  { id: 'household', name: 'تنظيف', nameAr: 'تنظيف', nameEn: 'Cleaning', nameTr: 'Temizlik', icon: '🧹', color: '#9C27B0' },
  { id: 'personal', name: 'العناية', nameAr: 'عناية شخصية', nameEn: 'Personal Care', nameTr: 'Kişisel Bakım', icon: '🧴', color: '#E91E63' },
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

export const ui = {
  ar: {
    flashDeals: '🔥 عروض سريعة',
    popular: '⭐ الأكثر مبيعاً',
    shopByCategory: 'تسوق حسب التصنيف',
    shopByBrand: 'تسوق حسب العلامة التجارية',
    viewAll: 'عرض الكل',
    addToCart: 'أضف للسلة',
    quickAdd: 'إضافة سريعة',
    viewCart: 'عرض السلة',
    search: 'ابحث في آلاف المنتجات...',
    login: 'تسجيل الدخول',
    register: 'إنشاء حساب',
    orders: 'طلباتي',
    favorites: 'المفضلة',
    cart: 'سلة التسوق',
    categories: 'التصنيفات',
    newProducts: 'جديد',
    bestSellers: 'الأكثر مبيعاً',
    featured: 'مميز',
    sale: 'تخفيض',
    off: 'خصم',
    from: 'من',
    hugeDeals: 'عروض ضخمة',
  },
  tr: {
    flashDeals: '🔥 Fırsat Ürünleri',
    popular: '⭐ Çok Satanlar',
    shopByCategory: 'Kategorilere Göre',
    shopByBrand: 'Markalara Göre',
    viewAll: 'Tümünü Gör',
    addToCart: 'Sepete Ekle',
    quickAdd: 'Hızlı Ekle',
    viewCart: 'Sepeti Gör',
    search: 'Binlerce ürün içinde ara...',
    login: 'Giriş Yap',
    register: 'Üye Ol',
    orders: 'Siparişlerim',
    favorites: 'Favorilerim',
    cart: 'Sepetim',
    categories: 'Kategoriler',
    newProducts: 'Yeni Ürünler',
    bestSellers: 'Çok Satanlar',
    featured: 'Öne Çıkan',
    sale: 'İndirim',
    off: 'İndirim',
    from: 'den',
    hugeDeals: 'Büyük Fırsatlar',
  },
  en: {
    flashDeals: '🔥 Flash Deals',
    popular: '⭐ Best Sellers',
    shopByCategory: 'Shop by Category',
    shopByBrand: 'Shop by Brand',
    viewAll: 'View All',
    addToCart: 'Add to Cart',
    quickAdd: 'Quick Add',
    viewCart: 'View Cart',
    search: 'Search thousands of products...',
    login: 'Sign In',
    register: 'Register',
    orders: 'My Orders',
    favorites: 'Favorites',
    cart: 'Cart',
    categories: 'Categories',
    newProducts: 'New Products',
    bestSellers: 'Best Sellers',
    featured: 'Featured Products',
    sale: 'Sale',
    off: 'OFF',
    from: 'From',
    hugeDeals: 'Huge Savings',
  },
}

export const banners = [
  { id: 'produce', category: 'produce', titles: { ar: 'خضار وفواكه طازجة', en: 'Fresh Produce', tr: 'Taze Sebze & Meyve' }, subtitles: { ar: 'طازج يومياً', en: 'Farm Fresh Daily', tr: 'Her Gün Taze' }, color: '#4CAF50', image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=800' },
  { id: 'meat', category: 'meat', titles: { ar: 'اللحوم الطازجة', en: 'Fresh Meat', tr: 'Taze Et' }, subtitles: { ar: 'جودة عالية', en: 'Premium Quality', tr: 'Premium Kalite' }, color: '#B71C1C', image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=800' },
  { id: 'ready', category: 'ready', titles: { ar: 'الدجاج الطازج', en: 'Fresh Chicken', tr: 'Taze Tavuk' }, subtitles: { ar: 'لذيذ وصحي', en: 'Delicious & Healthy', tr: 'Lezzetli & Sağlıklı' }, color: '#FF9800', image: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=800' },
  { id: 'dairy', category: 'dairy', titles: { ar: 'الألبان والبيض', en: 'Dairy & Eggs', tr: 'Süt Ürünleri' }, subtitles: { ar: 'طازج دائماً', en: 'Always Fresh', tr: 'Her Zaman Taze' }, color: '#2196F3', image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=800' },
  { id: 'drinks', category: 'drinks', titles: { ar: 'المشروبات', en: 'Beverages', tr: 'İçecekler' }, subtitles: { ar: 'انتعش معنا', en: 'Stay Refreshed', tr: 'Serinle' }, color: '#E31E24', image: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=800' },
  { id: 'snacks', category: 'snacks', titles: { ar: 'الوجبات الخفيفة', en: 'Snacks & Sweets', tr: 'Atıştırmalıklar' }, subtitles: { ar: 'تشكيلة واسعة', en: 'Wide Selection', tr: 'Geniş Seçim' }, color: '#FF5722', image: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=800' },
  { id: 'bakery', category: 'bakery', titles: { ar: 'المخبوزات', en: 'Bakery', tr: 'Fırın Ürünleri' }, subtitles: { ar: 'طازج من الفرن', en: 'Fresh from Oven', tr: 'Fırından Taze' }, color: '#8D6E63', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800' },
  { id: 'frozen', category: 'frozen', titles: { ar: 'المجمدات', en: 'Frozen Foods', tr: 'Dondurulmuş Ürünler' }, subtitles: { ar: 'جاهز للطبخ', en: 'Ready to Cook', tr: 'Pişirmeye Hazır' }, color: '#00BCD4', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800' },
  { id: 'pantry', category: 'pantry', titles: { ar: 'مواد غذائية', en: 'Grocery', tr: 'Temel Gıda' }, subtitles: { ar: 'أساسيات المطبخ', en: 'Kitchen Essentials', tr: 'Mutfak Temelleri' }, color: '#795548', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800' },
]

export const rewards = []
export const user = { name: 'مستخدم M10', phone: '+9647509703030', points: 2500 }
