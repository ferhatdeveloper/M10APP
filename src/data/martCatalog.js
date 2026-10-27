/** Auto-curated from Migros Sanal Market product API — demo visuals */
export const M = (url) => ({ uri: url })

export const BRANDS = [
  { id: 'nescafe', name: 'Nescafe', accent: '#C62828', image: require('../../assets/mart-clone/cutouts/nescafe.png') },
  { id: 'pinar', name: 'Pınar', accent: '#1565C0', image: require('../../assets/mart-clone/cutouts/pinar.png') },
  { id: 'ulker', name: 'Ülker', accent: '#6A1B9A', image: require('../../assets/mart-clone/cutouts/ulker.png') },
  /** `card`: sadece Nada / Puck — hazır Talabat kartı */
  {
    id: 'nada',
    name: 'Nada',
    accent: '#E65100',
    card: require('../../assets/mart-clone/brand_nada.png'),
    image: M('https://images.migrosone.com/sanalmarket/product/08059546/08059546_1-8fa892.jpg'),
  },
  {
    id: 'puck',
    name: 'Puck',
    accent: '#1565C0',
    card: require('../../assets/mart-clone/brand_puck.png'),
    image: M('https://images.migrosone.com/sanalmarket/product/10300063/10300063-a0216f.jpg'),
  },
  { id: 'eti', name: 'Eti', accent: '#E65100', image: require('../../assets/mart-clone/cutouts/eti.png') },
  { id: 'maggi', name: 'Maggi', accent: '#F9A825', image: require('../../assets/mart-clone/cutouts/maggi.png') },
  { id: 'kinder', name: 'Kinder', accent: '#E65100', image: require('../../assets/mart-clone/cutouts/kinder.png') },
  { id: 'coca', name: 'Coca-Cola', accent: '#B71C1C', image: require('../../assets/mart-clone/cutouts/coca.png') },
  { id: 'lipton', name: 'Lipton', accent: '#F57F17', image: require('../../assets/mart-clone/cutouts/lipton.png') },
]

export const BUY_AGAIN = [
  { id: 'm28160000', image: { uri: 'https://images.migrosone.com/sanalmarket/product/28160000/28160000_1-9a2b7c.jpg' }, price: 1700, pro: 1550, names: { en: 'Kabak Sakız Kg', tr: 'Kabak Sakız Kg', ar: 'Kabak Sakız Kg' } },
  { id: 'm27271000', image: { uri: 'https://images.migrosone.com/sanalmarket/product/27271000/27271000_1-25552e.jpg' }, price: 3150, pro: 2850, names: { en: 'Muz İthal Kg', tr: 'Muz İthal Kg', ar: 'Muz İthal Kg' } },
  { id: 'm27133000', image: { uri: 'https://images.migrosone.com/sanalmarket/product/27133000/27133000_1-fe30f9.jpg' }, price: 2000, pro: 1800, names: { en: 'Elma Granny Smith Kg', tr: 'Elma Granny Smith Kg', ar: 'Elma Granny Smith Kg' } },
  { id: 'm28080000', image: { uri: 'https://images.migrosone.com/sanalmarket/product/28080000/28080000_1-c12d3b.jpg' }, price: 1450, pro: 1300, names: { en: 'Domates Kg', tr: 'Domates Kg', ar: 'Domates Kg' } },
  { id: 'm28130000', image: { uri: 'https://images.migrosone.com/sanalmarket/product/28130000/28130000_1-97c4cf.jpg' }, price: 850, pro: 750, names: { en: 'Hıyar Kg', tr: 'Hıyar Kg', ar: 'Hıyar Kg' } },
  { id: 'm11010208', image: { uri: 'https://images.migrosone.com/sanalmarket/product/11010208/11010208_1-2ec412.jpg' }, price: 3800, pro: 3400, names: { en: 'Sütaş Latte 1 L', tr: 'Sütaş Latte 1 L', ar: 'Sütaş Latte 1 L' } },
  { id: 'm46054277', image: { uri: 'https://images.migrosone.com/sanalmarket/product/46054277/46054277_1-3bb01f.jpg' }, price: 3600, pro: 3250, names: { en: 'Naturaköy Gezen 15\'li Yumurta M Orta B…', tr: 'Naturaköy Gezen 15\'li Yumurta M Orta B…', ar: 'Naturaköy Gezen 15\'li Yumurta M Orta B…' } },
  { id: 'm10300063', image: { uri: 'https://images.migrosone.com/sanalmarket/product/10300063/10300063-a0216f.jpg' }, price: 1600, pro: 1450, names: { en: 'İçim Labne 180 G', tr: 'İçim Labne 180 G', ar: 'İçim Labne 180 G' } },
]

export const CATEGORIES = [
  { id: 'fruit', images: [M('https://images.migrosone.com/sanalmarket/product/27271000/27271000_1-25552e.jpg'), M('https://images.migrosone.com/sanalmarket/product/28080000/28080000_1-c12d3b.jpg'), M('https://images.migrosone.com/sanalmarket/product/28130000/28130000_1-97c4cf.jpg')], image: M('https://images.migrosone.com/sanalmarket/product/27271000/27271000_1-25552e.jpg'), names: { en: 'Fruit & Veg', tr: 'Meyve & Sebze', ar: 'فواكه وخضار' } },
  { id: 'bakery', images: [M('https://images.migrosone.com/sanalmarket/product/05120000/05120000-a957e2.jpg'), M('https://images.migrosone.com/sanalmarket/product/05052000/05052000-2d95e7.jpg'), M('https://images.migrosone.com/sanalmarket/product/05051040/05051040_1-7bf66b.jpg')], image: M('https://images.migrosone.com/sanalmarket/product/05120000/05120000-a957e2.jpg'), names: { en: 'Bakery', tr: 'Fırın', ar: 'مخبوزات' } },
  { id: 'meat', images: [M('https://images.migrosone.com/sanalmarket/product/19000495/19000495_1-09963d.jpg'), M('https://images.migrosone.com/sanalmarket/product/18990583/18990583_1-9fb346.jpg'), M('https://images.migrosone.com/sanalmarket/product/13000306/13000306_1-3c83ec.jpg')], image: M('https://images.migrosone.com/sanalmarket/product/19000495/19000495_1-09963d.jpg'), names: { en: 'Poultry, Meat & Seafood', tr: 'Et, Tavuk & Balık', ar: 'لحوم وأسماك' } },
  { id: 'frozen', images: [M('https://images.migrosone.com/sanalmarket/product/11570223/11570223_1-a0a358.jpg'), M('https://images.migrosone.com/sanalmarket/product/11570408/11570408_1-07b791.jpg'), M('https://images.migrosone.com/sanalmarket/product/11578989/11578989_1-922a55.jpg')], image: M('https://images.migrosone.com/sanalmarket/product/11570223/11570223_1-a0a358.jpg'), names: { en: 'Frozen Food', tr: 'Dondurulmuş', ar: 'مجمد' }, snow: true },
  { id: 'dairy', images: [M('https://images.migrosone.com/sanalmarket/product/11010208/11010208_1-2ec412.jpg'), M('https://images.migrosone.com/sanalmarket/product/46054277/46054277_1-3bb01f.jpg'), M('https://images.migrosone.com/sanalmarket/product/11010198/11010198_1-c52501.jpg')], image: M('https://images.migrosone.com/sanalmarket/product/11010208/11010208_1-2ec412.jpg'), names: { en: 'Dairy & Eggs', tr: 'Süt & Yumurta', ar: 'ألبان وبيض' } },
  { id: 'drinks', images: [M('https://images.migrosone.com/sanalmarket/product/08011010/08011010_1-291140.jpg'), M('https://images.migrosone.com/sanalmarket/product/08010903/8010903_yan-2e2bcb.jpg'), M('https://images.migrosone.com/sanalmarket/product/08010904/8010904_1-8edb97.jpg')], image: M('https://images.migrosone.com/sanalmarket/product/08011010/08011010_1-291140.jpg'), names: { en: 'Beverages', tr: 'İçecekler', ar: 'مشروبات' } },
  { id: 'snacks', images: [M('https://images.migrosone.com/sanalmarket/product/05080439/05080439_1-0ca95e.jpg'), M('https://images.migrosone.com/sanalmarket/product/05080443/05080443_1-1748e5.jpg'), M('https://images.migrosone.com/sanalmarket/product/05080320/05080320_1-6abe8b.jpg')], image: M('https://images.migrosone.com/sanalmarket/product/05080439/05080439_1-0ca95e.jpg'), names: { en: 'Snacks & Chocolate', tr: 'Atıştırmalık', ar: 'سناكات' } },
  { id: 'tea', images: [M('https://images.migrosone.com/sanalmarket/product/03231527/3231527_1-9e466b.jpg'), M('https://images.migrosone.com/sanalmarket/product/03211601/3211601_1-4a6685.jpg'), M('https://images.migrosone.com/sanalmarket/product/03231310/03231310_1-ab1de3.jpg')], image: M('https://images.migrosone.com/sanalmarket/product/03231527/3231527_1-9e466b.jpg'), names: { en: 'Coffee & Tea', tr: 'Çay & Kahve', ar: 'قهوة وشاي' } },
  { id: 'milk', images: [M('https://images.migrosone.com/sanalmarket/product/11011520/11011520-0da5c0.jpg'), M('https://images.migrosone.com/sanalmarket/product/11010208/11010208_1-2ec412.jpg'), M('https://images.migrosone.com/sanalmarket/product/11010198/11010198_1-c52501.jpg')], image: M('https://images.migrosone.com/sanalmarket/product/11011520/11011520-0da5c0.jpg'), names: { en: 'Milk', tr: 'Süt', ar: 'حليب' } },
  { id: 'breakfast', images: [M('https://images.migrosone.com/sanalmarket/product/07077959/7077959_1-3e9c92.jpg'), M('https://images.migrosone.com/sanalmarket/product/01151972/01151972-ec0c29.jpg'), M('https://images.migrosone.com/sanalmarket/product/07070145/07070145-ef65f0.jpg')], image: M('https://images.migrosone.com/sanalmarket/product/07077959/7077959_1-3e9c92.jpg'), names: { en: 'Breakfast Food', tr: 'Kahvaltılık', ar: 'فطور' } },
  { id: 'ready', images: [M('https://images.migrosone.com/sanalmarket/product/14209387/14209387_1-77ff0a.jpg'), M('https://images.migrosone.com/sanalmarket/product/18991066/18991066-be974c.jpg'), M('https://images.migrosone.com/sanalmarket/product/13000306/13000306_1-3c83ec.jpg')], image: M('https://images.migrosone.com/sanalmarket/product/14209387/14209387_1-77ff0a.jpg'), names: { en: 'Ready To Eat', tr: 'Hazır Yemek', ar: 'جاهز للأكل' } },
  { id: 'cook', images: [M('https://images.migrosone.com/sanalmarket/product/05010402/5010402-c0b1a4.jpg'), M('https://images.migrosone.com/sanalmarket/product/05010401/05010401_1-c4c14f.jpg'), M('https://images.migrosone.com/sanalmarket/product/05010405/05010405_1-bcae71.png')], image: M('https://images.migrosone.com/sanalmarket/product/05010402/5010402-c0b1a4.jpg'), names: { en: 'Cooking & Baking', tr: 'Yemeklik & Un', ar: 'طبخ وخبز' } },
]

export const CATEGORIES_PAGE2 = [
  { id: 'clean', images: [M('https://images.migrosone.com/sanalmarket/product/30130506/30130506_1-198a42.jpg'), M('https://images.migrosone.com/sanalmarket/product/30130506/30130506_1-198a42.jpg'), M('https://images.migrosone.com/sanalmarket/product/30130506/30130506_1-198a42.jpg')], image: M('https://images.migrosone.com/sanalmarket/product/30130506/30130506_1-198a42.jpg'), names: { en: 'Household', tr: 'Temizlik', ar: 'منزلية' } },
  { id: 'baby', images: [M('https://images.migrosone.com/sanalmarket/product/46054277/46054277_1-3bb01f.jpg'), M('https://images.migrosone.com/sanalmarket/product/11010208/11010208_1-2ec412.jpg'), M('https://images.migrosone.com/sanalmarket/product/07077959/7077959_1-3e9c92.jpg')], image: M('https://images.migrosone.com/sanalmarket/product/46054277/46054277_1-3bb01f.jpg'), names: { en: 'Baby Care', tr: 'Bebek', ar: 'أطفال' } },
  { id: 'pet', images: [M('https://images.migrosone.com/sanalmarket/product/05080439/05080439_1-0ca95e.jpg'), M('https://images.migrosone.com/sanalmarket/product/05080320/05080320_1-6abe8b.jpg'), M('https://images.migrosone.com/sanalmarket/product/05080443/05080443_1-1748e5.jpg')], image: M('https://images.migrosone.com/sanalmarket/product/05080439/05080439_1-0ca95e.jpg'), names: { en: 'Pet Food', tr: 'Pet Shop', ar: 'حيوانات' } },
  { id: 'personal', images: [M('https://images.migrosone.com/sanalmarket/product/07070145/07070145-ef65f0.jpg'), M('https://images.migrosone.com/sanalmarket/product/07070960/07070960-eeb67b.jpg'), M('https://images.migrosone.com/sanalmarket/product/07077959/7077959_1-3e9c92.jpg')], image: M('https://images.migrosone.com/sanalmarket/product/07070145/07070145-ef65f0.jpg'), names: { en: 'Personal Care', tr: 'Kişisel Bakım', ar: 'عناية شخصية' } },
  { id: 'water', images: [M('https://images.migrosone.com/sanalmarket/product/08011010/08011010_1-291140.jpg'), M('https://images.migrosone.com/sanalmarket/product/08010904/8010904_1-8edb97.jpg'), M('https://images.migrosone.com/sanalmarket/product/08010903/8010903_yan-2e2bcb.jpg')], image: M('https://images.migrosone.com/sanalmarket/product/08011010/08011010_1-291140.jpg'), names: { en: 'Water', tr: 'Su', ar: 'ماء' } },
  { id: 'ice', images: [M('https://images.migrosone.com/sanalmarket/product/11570223/11570223_1-a0a358.jpg'), M('https://images.migrosone.com/sanalmarket/product/11570408/11570408_1-07b791.jpg'), M('https://images.migrosone.com/sanalmarket/product/11578989/11578989_1-922a55.jpg')], image: M('https://images.migrosone.com/sanalmarket/product/11570223/11570223_1-a0a358.jpg'), names: { en: 'Ice Cream', tr: 'Dondurma', ar: 'آيس كريم' } },
  { id: 'cheese', images: [M('https://images.migrosone.com/sanalmarket/product/10300063/10300063-a0216f.jpg'), M('https://images.migrosone.com/sanalmarket/product/11010198/11010198_1-c52501.jpg'), M('https://images.migrosone.com/sanalmarket/product/11011520/11011520-0da5c0.jpg')], image: M('https://images.migrosone.com/sanalmarket/product/10300063/10300063-a0216f.jpg'), names: { en: 'Cheese', tr: 'Peynir', ar: 'جبن' } },
  { id: 'oil', images: [M('https://images.migrosone.com/sanalmarket/product/05010402/5010402-c0b1a4.jpg'), M('https://images.migrosone.com/sanalmarket/product/14209387/14209387_1-77ff0a.jpg'), M('https://images.migrosone.com/sanalmarket/product/05010401/05010401_1-c4c14f.jpg')], image: M('https://images.migrosone.com/sanalmarket/product/05010402/5010402-c0b1a4.jpg'), names: { en: 'Oils & Sauces', tr: 'Yağ & Sos', ar: 'زيوت وصلصات' } },
]

/** Shop by brand — Talabat squircle grid (logo + marka rengi zemin) */
export const LOGO_BRANDS = [
  {
    id: 'lb_banetti',
    name: 'Banetti',
    color: '#000000',
    image: require('../../assets/mart-clone/brand_banetti.png'),
    fill: true,
  },
  {
    id: 'lb_maggi',
    name: 'Maggi',
    color: '#FFD000',
    image: require('../../assets/mart-clone/cutouts/maggi.png'),
  },
  {
    id: 'lb_kinder',
    name: 'Kinder',
    color: '#F2F2F2',
    image: require('../../assets/mart-clone/cutouts/kinder.png'),
  },
  {
    id: 'lb_nescafe',
    name: 'Nescafe',
    color: '#FFFFFF',
    image: require('../../assets/mart-clone/cutouts/nescafe.png'),
  },
  {
    id: 'lb_coca',
    name: 'Coca-Cola',
    color: '#E02020',
    image: require('../../assets/mart-clone/cutouts/coca.png'),
  },
  {
    id: 'lb_lipton',
    name: 'Lipton',
    color: '#F57F17',
    image: require('../../assets/mart-clone/cutouts/lipton.png'),
  },
  {
    id: 'lb_pinar',
    name: 'Pınar',
    color: '#1565C0',
    image: require('../../assets/mart-clone/cutouts/pinar.png'),
  },
  {
    id: 'lb_ulker',
    name: 'Ülker',
    color: '#6A1B9A',
    image: require('../../assets/mart-clone/cutouts/ulker.png'),
  },
]

/** Banetti — demo makarna ürünleri */
export const BANETTI_PRODUCTS = [
  {
    id: 'banetti_spaghetti',
    brand: 'Banetti',
    image: M('https://images.migrosone.com/sanalmarket/product/05010402/5010402-c0b1a4.jpg'),
    price: 2200,
    pro: 1950,
    names: {
      en: 'Banetti Spaghetti 500g',
      tr: 'Banetti Spaghetti 500g',
      ar: 'بانتي سباغيتي 500غ',
    },
  },
  {
    id: 'banetti_penne',
    brand: 'Banetti',
    image: M('https://images.migrosone.com/sanalmarket/product/05010401/05010401_1-c4c14f.jpg'),
    price: 2200,
    pro: 1950,
    names: {
      en: 'Banetti Penne 500g',
      tr: 'Banetti Penne 500g',
      ar: 'بانتي بيني 500غ',
    },
  },
  {
    id: 'banetti_fusilli',
    brand: 'Banetti',
    image: { uri: 'https://images.migrosone.com/sanalmarket/product/05010405/05010405_1-bcae71.png' },
    price: 2300,
    pro: 2050,
    names: {
      en: 'Banetti Fusilli 500g',
      tr: 'Banetti Fusilli 500g',
      ar: 'بانتي فوسيلي 500غ',
    },
  },
  {
    id: 'banetti_farfalle',
    brand: 'Banetti',
    image: M('https://images.migrosone.com/sanalmarket/product/05010402/5010402-c0b1a4.jpg'),
    price: 2400,
    old: 2800,
    save: 14,
    pro: 2150,
    names: {
      en: 'Banetti Farfalle 500g',
      tr: 'Banetti Farfalle 500g',
      ar: 'بانتي فارفالي 500غ',
    },
  },
  {
    id: 'banetti_rigatoni',
    brand: 'Banetti',
    image: M('https://images.migrosone.com/sanalmarket/product/05010401/05010401_1-c4c14f.jpg'),
    price: 2500,
    pro: 2250,
    names: {
      en: 'Banetti Rigatoni 500g',
      tr: 'Banetti Rigatoni 500g',
      ar: 'بانتي ريغاتوني 500غ',
    },
  },
  {
    id: 'banetti_linguine',
    brand: 'Banetti',
    image: { uri: 'https://images.migrosone.com/sanalmarket/product/05010405/05010405_1-bcae71.png' },
    price: 2300,
    pro: 2050,
    names: {
      en: 'Banetti Linguine 500g',
      tr: 'Banetti Linguine 500g',
      ar: 'بانتي لينغويني 500غ',
    },
  },
]

/** Taze sebze & meyve — M10 her zaman taze stok vurgusu */
export const BEST_SELLERS = [
  { id: 'm27271000', image: { uri: 'https://images.migrosone.com/sanalmarket/product/27271000/27271000_1-25552e.jpg' }, price: 3150, pro: 2850, names: { en: 'Banana Kg', tr: 'Muz İthal Kg', ar: 'موز كغ' } },
  { id: 'm27133000', image: { uri: 'https://images.migrosone.com/sanalmarket/product/27133000/27133000_1-fe30f9.jpg' }, price: 2000, pro: 1800, names: { en: 'Granny Smith Apple Kg', tr: 'Elma Granny Smith Kg', ar: 'تفاح كغ' } },
  { id: 'm28080000', image: { uri: 'https://images.migrosone.com/sanalmarket/product/28080000/28080000_1-c12d3b.jpg' }, price: 1450, pro: 1300, names: { en: 'Tomato Kg', tr: 'Domates Kg', ar: 'طماطم كغ' } },
  { id: 'm28130000', image: { uri: 'https://images.migrosone.com/sanalmarket/product/28130000/28130000_1-97c4cf.jpg' }, price: 850, pro: 750, names: { en: 'Cucumber Kg', tr: 'Hıyar Kg', ar: 'خيار كغ' } },
  { id: 'm28160000', image: { uri: 'https://images.migrosone.com/sanalmarket/product/28160000/28160000_1-9a2b7c.jpg' }, price: 1700, pro: 1550, names: { en: 'Zucchini Kg', tr: 'Kabak Kg', ar: 'كوسا كغ' } },
  { id: 'fv_pepper', image: require('../../assets/mart-clone/prod_pepper.png'), price: 1900, pro: 1700, names: { en: 'Bell Pepper Kg', tr: 'Biber Kg', ar: 'فلفل كغ' } },
  { id: 'fv_beet', image: require('../../assets/mart-clone/buy_beet.png'), price: 1200, pro: 1050, names: { en: 'Beetroot Kg', tr: 'Pancar Kg', ar: 'شمندر كغ' } },
  { id: 'fv_dates', image: require('../../assets/mart-clone/prod_dates.png'), price: 4500, pro: 4000, names: { en: 'Dates Pack', tr: 'Hurma Paket', ar: 'تمر' } },
]

export const TOP_SAVERS = [
  { id: 'm05080438', image: { uri: 'https://images.migrosone.com/sanalmarket/product/05080438/05080438_1-3ea5fb.jpg' }, price: 2500, old: 2600, save: 5, pro: 2250, names: { en: 'Master Potato Cheddar Peynir Soslu Cip…', tr: 'Master Potato Cheddar Peynir Soslu Cip…', ar: 'Master Potato Cheddar Peynir Soslu Cip…' } },
  { id: 'm05080443', image: { uri: 'https://images.migrosone.com/sanalmarket/product/05080443/05080443_1-1748e5.jpg' }, price: 3000, old: 3500, save: 16, pro: 2700, names: { en: 'Pringles Sade Original 140 G', tr: 'Pringles Sade Original 140 G', ar: 'Pringles Sade Original 140 G' } },
  { id: 'm08050630', image: { uri: 'https://images.migrosone.com/sanalmarket/product/08050630/08050630_1-2353c4.jpg' }, price: 1000, old: 1100, save: 12, pro: 900, names: { en: 'Lol Vanilya Aromalı Gazlı İçecek 250 Ml', tr: 'Lol Vanilya Aromalı Gazlı İçecek 250 Ml', ar: 'Lol Vanilya Aromalı Gazlı İçecek 250 Ml' } },
  { id: 'm08010903', image: { uri: 'https://images.migrosone.com/sanalmarket/product/08010903/8010903_yan-2e2bcb.jpg' }, price: 1300, old: 1600, save: 19, pro: 1150, names: { en: 'Coca-Cola Orijinal Tat Pet 1,5 L', tr: 'Coca-Cola Orijinal Tat Pet 1,5 L', ar: 'Coca-Cola Orijinal Tat Pet 1,5 L' } },
  { id: 'm07040101', image: { uri: 'https://images.migrosone.com/sanalmarket/product/07040101/7040101-806ed5.jpg' }, price: 6300, old: 6850, save: 9, pro: 5650, names: { en: 'Ferrero Rocher Çikolata 16\'lı, 200 gr', tr: 'Ferrero Rocher Çikolata 16\'lı, 200 gr', ar: 'Ferrero Rocher Çikolata 16\'lı, 200 gr' } },
  { id: 'm07163987', image: { uri: 'https://images.migrosone.com/sanalmarket/product/07163987/07163987-235c4a.jpg' }, price: 1800, old: 2100, save: 17, pro: 1600, names: { en: 'Eti Karam Gurme Bitter Çikolata Kremal…', tr: 'Eti Karam Gurme Bitter Çikolata Kremal…', ar: 'Eti Karam Gurme Bitter Çikolata Kremal…' } },
  { id: 'm11010208', image: { uri: 'https://images.migrosone.com/sanalmarket/product/11010208/11010208_1-2ec412.jpg' }, price: 3800, old: 4100, save: 8, pro: 3400, names: { en: 'Sütaş Latte 1 L', tr: 'Sütaş Latte 1 L', ar: 'Sütaş Latte 1 L' } },
  { id: 'm11011520', image: { uri: 'https://images.migrosone.com/sanalmarket/product/11011520/11011520-0da5c0.jpg' }, price: 1050, old: 1150, save: 11, pro: 950, names: { en: 'Migros %3 Yağlı Uht Süt 1 L', tr: 'Migros %3 Yağlı Uht Süt 1 L', ar: 'Migros %3 Yağlı Uht Süt 1 L' } },
]

export const DAIRY = [
  { id: 'm11010208', image: { uri: 'https://images.migrosone.com/sanalmarket/product/11010208/11010208_1-2ec412.jpg' }, price: 3800, pro: 3400, names: { en: 'Sütaş Latte 1 L', tr: 'Sütaş Latte 1 L', ar: 'Sütaş Latte 1 L' } },
  { id: 'm11011520', image: { uri: 'https://images.migrosone.com/sanalmarket/product/11011520/11011520-0da5c0.jpg' }, price: 1050, pro: 950, names: { en: 'Migros %3 Yağlı Uht Süt 1 L', tr: 'Migros %3 Yağlı Uht Süt 1 L', ar: 'Migros %3 Yağlı Uht Süt 1 L' } },
  { id: 'm11010198', image: { uri: 'https://images.migrosone.com/sanalmarket/product/11010198/11010198_1-c52501.jpg' }, price: 1550, pro: 1400, names: { en: 'Pınar Süt %2,5 Yağlı 1 L', tr: 'Pınar Süt %2,5 Yağlı 1 L', ar: 'Pınar Süt %2,5 Yağlı 1 L' } },
  { id: 'm12500070', image: { uri: 'https://images.migrosone.com/sanalmarket/product/12500070/12500070-c7914f.jpg' }, price: 1300, pro: 1150, names: { en: 'Danone Süprix Marvel Oyuncak Hediyeli …', tr: 'Danone Süprix Marvel Oyuncak Hediyeli …', ar: 'Danone Süprix Marvel Oyuncak Hediyeli …' } },
  { id: 'm12501956', image: { uri: 'https://images.migrosone.com/sanalmarket/product/12501956/12501956-df360a.jpg' }, price: 2150, pro: 1950, names: { en: 'Migros Tam Yağlı Homojenize Yoğurt 150…', tr: 'Migros Tam Yağlı Homojenize Yoğurt 150…', ar: 'Migros Tam Yağlı Homojenize Yoğurt 150…' } },
  { id: 'm10300063', image: { uri: 'https://images.migrosone.com/sanalmarket/product/10300063/10300063-a0216f.jpg' }, price: 1600, pro: 1450, names: { en: 'İçim Labne 180 G', tr: 'İçim Labne 180 G', ar: 'İçim Labne 180 G' } },
  { id: 'm10101938', image: { uri: 'https://images.migrosone.com/sanalmarket/product/10101938/10101938_1-855445.jpg' }, price: 9600, pro: 8650, names: { en: 'Torku Tam Yağlı Taze Kaşar Peyniri 600 G', tr: 'Torku Tam Yağlı Taze Kaşar Peyniri 600 G', ar: 'Torku Tam Yağlı Taze Kaşar Peyniri 600 G' } },
  { id: 'm46054277', image: { uri: 'https://images.migrosone.com/sanalmarket/product/46054277/46054277_1-3bb01f.jpg' }, price: 3600, pro: 3250, names: { en: 'Naturaköy Gezen 15\'li Yumurta M Orta B…', tr: 'Naturaköy Gezen 15\'li Yumurta M Orta B…', ar: 'Naturaköy Gezen 15\'li Yumurta M Orta B…' } },
]

export const SNACKS = [
  { id: 'm05080438', image: { uri: 'https://images.migrosone.com/sanalmarket/product/05080438/05080438_1-3ea5fb.jpg' }, price: 2500, pro: 2250, names: { en: 'Master Potato Cheddar Peynir Soslu Cip…', tr: 'Master Potato Cheddar Peynir Soslu Cip…', ar: 'Master Potato Cheddar Peynir Soslu Cip…' } },
  { id: 'm05080443', image: { uri: 'https://images.migrosone.com/sanalmarket/product/05080443/05080443_1-1748e5.jpg' }, price: 3000, pro: 2700, names: { en: 'Pringles Sade Original 140 G', tr: 'Pringles Sade Original 140 G', ar: 'Pringles Sade Original 140 G' } },
  { id: 'm05080320', image: { uri: 'https://images.migrosone.com/sanalmarket/product/05080320/05080320_1-6abe8b.jpg' }, price: 3000, pro: 2700, names: { en: 'Pringles Sour Cream and Onion 140 G', tr: 'Pringles Sour Cream and Onion 140 G', ar: 'Pringles Sour Cream and Onion 140 G' } },
  { id: 'm07040101', image: { uri: 'https://images.migrosone.com/sanalmarket/product/07040101/7040101-806ed5.jpg' }, price: 6300, pro: 5650, names: { en: 'Ferrero Rocher Çikolata 16\'lı, 200 gr', tr: 'Ferrero Rocher Çikolata 16\'lı, 200 gr', ar: 'Ferrero Rocher Çikolata 16\'lı, 200 gr' } },
  { id: 'm07163987', image: { uri: 'https://images.migrosone.com/sanalmarket/product/07163987/07163987-235c4a.jpg' }, price: 1800, pro: 1600, names: { en: 'Eti Karam Gurme Bitter Çikolata Kremal…', tr: 'Eti Karam Gurme Bitter Çikolata Kremal…', ar: 'Eti Karam Gurme Bitter Çikolata Kremal…' } },
  { id: 'm07160817', image: { uri: 'https://images.migrosone.com/sanalmarket/product/7160817/7160817-b58034.jpg' }, price: 600, pro: 550, names: { en: 'Eti Karam Gurme Bitter Çikolatalı Gofr…', tr: 'Eti Karam Gurme Bitter Çikolatalı Gofr…', ar: 'Eti Karam Gurme Bitter Çikolatalı Gofr…' } },
  { id: 'm07010209', image: { uri: 'https://images.migrosone.com/sanalmarket/product/07010209/07010209-1747ff.jpg' }, price: 500, pro: 450, names: { en: 'Ülker Tuzlu Çubuk Kraker 40 G', tr: 'Ülker Tuzlu Çubuk Kraker 40 G', ar: 'Ülker Tuzlu Çubuk Kraker 40 G' } },
  { id: 'm07010237', image: { uri: 'https://images.migrosone.com/sanalmarket/product/07010237/7010237_1-cf8e7a.jpg' }, price: 500, old: 500, save: 20, pro: 450, names: { en: 'Ülker Altınbaşak Tahıl Cipsi 50 G', tr: 'Ülker Altınbaşak Tahıl Cipsi 50 G', ar: 'Ülker Altınbaşak Tahıl Cipsi 50 G' } },
]

export const BEVERAGES = [
  { id: 'm08010903', image: { uri: 'https://images.migrosone.com/sanalmarket/product/08010903/8010903_yan-2e2bcb.jpg' }, price: 1300, old: 1600, save: 19, pro: 1150, names: { en: 'Coca-Cola Orijinal Tat Pet 1,5 L', tr: 'Coca-Cola Orijinal Tat Pet 1,5 L', ar: 'Coca-Cola Orijinal Tat Pet 1,5 L' } },
  { id: 'm08010904', image: { uri: 'https://images.migrosone.com/sanalmarket/product/08010904/8010904_1-8edb97.jpg' }, price: 1300, old: 1600, save: 19, pro: 1150, names: { en: 'Coca-Cola Zero Sugar Pet 1,5 L', tr: 'Coca-Cola Zero Sugar Pet 1,5 L', ar: 'Coca-Cola Zero Sugar Pet 1,5 L' } },
  { id: 'm08050630', image: { uri: 'https://images.migrosone.com/sanalmarket/product/08050630/08050630_1-2353c4.jpg' }, price: 1000, pro: 900, names: { en: 'Lol Vanilya Aromalı Gazlı İçecek 250 Ml', tr: 'Lol Vanilya Aromalı Gazlı İçecek 250 Ml', ar: 'Lol Vanilya Aromalı Gazlı İçecek 250 Ml' } },
  { id: 'm08010903', image: { uri: 'https://images.migrosone.com/sanalmarket/product/08010903/8010903_yan-2e2bcb.jpg' }, price: 1300, old: 1600, save: 19, pro: 1150, names: { en: 'Coca-Cola Orijinal Tat Pet 1,5 L', tr: 'Coca-Cola Orijinal Tat Pet 1,5 L', ar: 'Coca-Cola Orijinal Tat Pet 1,5 L' } },
  { id: 'm03130027', image: { uri: 'https://images.migrosone.com/sanalmarket/product/03130027/03130027_1-ecb248.jpg' }, price: 2300, pro: 2050, names: { en: 'Teekanne Yaban Mersinli Karışık Meyve …', tr: 'Teekanne Yaban Mersinli Karışık Meyve …', ar: 'Teekanne Yaban Mersinli Karışık Meyve …' } },
  { id: 'm03113022', image: { uri: 'https://images.migrosone.com/sanalmarket/product/03113022/3113022_1-abd761.jpg' }, price: 3800, old: 5500, save: 31, pro: 3400, names: { en: 'Doğadan Gizli Bahçe Demlik Poşet Çay 1…', tr: 'Doğadan Gizli Bahçe Demlik Poşet Çay 1…', ar: 'Doğadan Gizli Bahçe Demlik Poşet Çay 1…' } },
  { id: 'm03222794', image: { uri: 'https://images.migrosone.com/sanalmarket/product/03222794/3222794_1-27707a.jpg' }, price: 500, pro: 450, names: { en: 'Nescafe 2si 1 Arada Sütlü Köpüklü 10 G', tr: 'Nescafe 2si 1 Arada Sütlü Köpüklü 10 G', ar: 'Nescafe 2si 1 Arada Sütlü Köpüklü 10 G' } },
  { id: 'm03211601', image: { uri: 'https://images.migrosone.com/sanalmarket/product/03211601/3211601_1-4a6685.jpg' }, price: 2200, pro: 2000, names: { en: 'Kurukahveci Mehmet Efendi Türk Kahvesi…', tr: 'Kurukahveci Mehmet Efendi Türk Kahvesi…', ar: 'Kurukahveci Mehmet Efendi Türk Kahvesi…' } },
]

export const CLEANING = [
  { id: 'm30130506', image: { uri: 'https://images.migrosone.com/sanalmarket/product/30130506/30130506_1-198a42.jpg' }, price: 10900, pro: 9800, names: { en: 'Rinso Toz Çamaşır Deterjanı Limon ve K…', tr: 'Rinso Toz Çamaşır Deterjanı Limon ve K…', ar: 'Rinso Toz Çamaşır Deterjanı Limon ve K…' } },
  { id: 'm30610382', image: { uri: 'https://images.migrosone.com/sanalmarket/product/30610382/30610382_1-1022f9.jpg' }, price: 4800, pro: 4300, names: { en: 'Fairy Sıvı Bulaşık Deterjanı Limon 135…', tr: 'Fairy Sıvı Bulaşık Deterjanı Limon 135…', ar: 'Fairy Sıvı Bulaşık Deterjanı Limon 135…' } },
  { id: 'm30980027', image: { uri: 'https://images.migrosone.com/sanalmarket/product/30980027/30980027_1-736941.jpg' }, price: 4800, old: 10000, save: 52, pro: 4300, names: { en: 'Bingo Akıllı Kapsül Pro Max Bulaşık Ma…', tr: 'Bingo Akıllı Kapsül Pro Max Bulaşık Ma…', ar: 'Bingo Akıllı Kapsül Pro Max Bulaşık Ma…' } },
  { id: 'm30441897', image: { uri: 'https://images.migrosone.com/sanalmarket/product/30441897/30441897_1-4da336.jpg' }, price: 2750, pro: 2500, names: { en: 'Pril Bulaşık Makinesi Tuz 2 Kg', tr: 'Pril Bulaşık Makinesi Tuz 2 Kg', ar: 'Pril Bulaşık Makinesi Tuz 2 Kg' } },
  { id: 'm30530523', image: { uri: 'https://images.migrosone.com/sanalmarket/product/30530523/30530523_1-f1c0bd.jpg' }, price: 9200, pro: 8300, names: { en: 'Yumoş Sıvı Deterjan Renkliler 2.5 L', tr: 'Yumoş Sıvı Deterjan Renkliler 2.5 L', ar: 'Yumoş Sıvı Deterjan Renkliler 2.5 L' } },
  { id: 'm30131968', image: { uri: 'https://images.migrosone.com/sanalmarket/product/30131968/30131968_1-2e4abb.jpg' }, price: 8000, pro: 7200, names: { en: 'Ariel Dağ Esintisi Renklilere Özel Toz…', tr: 'Ariel Dağ Esintisi Renklilere Özel Toz…', ar: 'Ariel Dağ Esintisi Renklilere Özel Toz…' } },
]

/** Talabat tarzı: banner altı soğuk kahve teneke satırı (HD ürün görselleri) */
export const NESCAFE_ROW = [
  { id: 'm08059620', image: { uri: 'https://images.migrosone.com/sanalmarket/product/08059620/08059620_1-a91fd3-1650x1650.jpg' }, price: 1000, pro: 900, names: { en: 'Nescafe Mocha Iced Coffee, 220ml', tr: 'Nescafe Mocha Iced Coffee, 220ml', ar: 'Nescafe Mocha Iced Coffee, 220ml' } },
  { id: 'm08079641', image: { uri: 'https://images.migrosone.com/sanalmarket/product/08079641/8079641_1-c5d520-1650x1650.jpg' }, price: 1000, pro: 900, names: { en: 'Nescafe Iced Spanish Latte, 220ml', tr: 'Nescafe Iced Spanish Latte, 220ml', ar: 'Nescafe Iced Spanish Latte, 220ml' } },
  { id: 'm08079715', image: { uri: 'https://images.migrosone.com/sanalmarket/product/08079715/8079715_1-ec4dfe-1650x1650.jpg' }, price: 1000, pro: 900, names: { en: 'Nescafe Cappuccino Iced Coffee, 220ml', tr: 'Nescafe Cappuccino Iced Coffee, 220ml', ar: 'Nescafe Cappuccino Iced Coffee, 220ml' } },
  { id: 'm08059622', image: { uri: 'https://images.migrosone.com/sanalmarket/product/08059622/08059622_1-2c323d-1650x1650.jpg' }, price: 1000, pro: 900, names: { en: 'Nescafe Latte Iced Coffee, 220ml', tr: 'Nescafe Latte Iced Coffee, 220ml', ar: 'Nescafe Latte Iced Coffee, 220ml' } },
  { id: 'm03220011', image: { uri: 'https://images.migrosone.com/sanalmarket/product/03220011/3220011_1-a1e0bd-1650x1650.jpg' }, price: 2600, pro: 2350, names: { en: 'Nescafé Ice Original 10-pack', tr: 'Nescafé Ice Original 10\'lu Paket', ar: 'Nescafé Ice Original 10-pack' } },
  { id: 'm03220009', image: { uri: 'https://images.migrosone.com/sanalmarket/product/03220009/3220009_1-7c5542-1650x1650.jpg' }, price: 1000, pro: 900, names: { en: 'Nescafe 3in1 Ice Original 10.5g', tr: 'Nescafe 3ü1 Arada Ice Orijinal 10,5 G', ar: 'Nescafe 3in1 Ice Original 10.5g' } },
]

export const EXPLORE = [
  { id: 'm05120000', image: { uri: 'https://images.migrosone.com/sanalmarket/product/05120000/05120000-a957e2.jpg' }, price: 500, pro: 450, names: { en: 'Sofra Ekmek Adet', tr: 'Sofra Ekmek Adet', ar: 'Sofra Ekmek Adet' } },
  { id: 'm10300063', image: { uri: 'https://images.migrosone.com/sanalmarket/product/10300063/10300063-a0216f.jpg' }, price: 1600, pro: 1450, names: { en: 'İçim Labne 180 G', tr: 'İçim Labne 180 G', ar: 'İçim Labne 180 G' } },
  { id: 'm07040101', image: { uri: 'https://images.migrosone.com/sanalmarket/product/07040101/7040101-806ed5.jpg' }, price: 6300, pro: 5650, names: { en: 'Ferrero Rocher Çikolata 16\'lı, 200 gr', tr: 'Ferrero Rocher Çikolata 16\'lı, 200 gr', ar: 'Ferrero Rocher Çikolata 16\'lı, 200 gr' } },
  { id: 'm30130506', image: { uri: 'https://images.migrosone.com/sanalmarket/product/30130506/30130506_1-198a42.jpg' }, price: 10900, pro: 9800, names: { en: 'Rinso Toz Çamaşır Deterjanı Limon ve K…', tr: 'Rinso Toz Çamaşır Deterjanı Limon ve K…', ar: 'Rinso Toz Çamaşır Deterjanı Limon ve K…' } },
  { id: 'm27271000', image: { uri: 'https://images.migrosone.com/sanalmarket/product/27271000/27271000_1-25552e.jpg' }, price: 3150, pro: 2850, names: { en: 'Muz İthal Kg', tr: 'Muz İthal Kg', ar: 'Muz İthal Kg' } },
  { id: 'm03222794', image: { uri: 'https://images.migrosone.com/sanalmarket/product/03222794/3222794_1-27707a.jpg' }, price: 500, pro: 450, names: { en: 'Nescafe 2si 1 Arada Sütlü Köpüklü 10 G', tr: 'Nescafe 2si 1 Arada Sütlü Köpüklü 10 G', ar: 'Nescafe 2si 1 Arada Sütlü Köpüklü 10 G' } },
]

export const PROMOS = [
  { id: 'p1', title: 'NESCAFÉ', sub: 'A cooler way to enjoy Coffee', fullBleed: true },
  { id: 'p2', title: 'Pınar', sub: 'Günün lezzeti', image: M('https://images.migrosone.com/sanalmarket/product/11010198/11010198_1-c52501.jpg') },
  { id: 'p3', title: 'Hot Deals', sub: 'UP TO 30% OFF', image: M('https://images.migrosone.com/sanalmarket/product/05080438/05080438_1-3ea5fb.jpg') },
]

export const WORLD = [
  { id: 'w1', names: { tr: 'Yerel', en: 'Local', ar: 'محلي' }, flag: '🇮🇶', bg: '#E8F5E9' },
  { id: 'w2', names: { tr: 'Avrupa', en: 'Europe', ar: 'أوروبا' }, flag: '🇪🇺', bg: '#E3F2FD' },
  { id: 'w3', names: { tr: 'ABD', en: 'USA', ar: 'أمريكا' }, flag: '🇺🇸', bg: '#FFEBEE' },
  { id: 'w4', names: { tr: 'Kore', en: 'Korea', ar: 'كوريا' }, flag: '🇰🇷', bg: '#FCE4EC' },
  { id: 'w5', names: { tr: 'Türkiye', en: 'Turkey', ar: 'تركيا' }, flag: '🇹🇷', bg: '#FFF3E0' },
]
