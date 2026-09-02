import { useMemo, useState } from 'react'
import { Image, ScrollView, Text, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import {
  Gift,
  LayoutGrid,
  Percent,
  RotateCcw,
  Search,
  ShoppingBag,
  Star,
  Store as StoreIcon,
  Truck,
} from 'lucide-react-native'
import TopBar from '../components/TopBar'
import ProductCard from '../components/ProductCard'
import Logo from '../components/Logo'
import SoftPress from '../components/SoftPress'
import { useApp } from '../context/AppContext'
import { useI18n } from '../context/I18nContext'
import {
  buyAgainIds,
  formatIQD,
  productDesc,
  productName,
  storeName,
} from '../data/mock'
import { aisleFallback, src } from '../utils/images'
import { colors, shadow } from '../theme'

export default function StoreScreen({ navigation, route }) {
  const { id, aisle: aisleParam } = route.params
  const { cartCount, cartStore, cartTotal, favorites, toggleFavorite, orders, getLiveStore, getLiveProducts, liveAisles, liveCatalog } =
    useApp()
  const store = getLiveStore(id)
  const { t, lang, isRTL } = useI18n()
  const [tab, setTab] = useState('shop')
  const [aisle, setAisle] = useState(aisleParam || null)
  const [q, setQ] = useState('')

  const againIds = useMemo(() => buyAgainIds(orders, id), [orders, id])
  const allProducts = useMemo(() => (store ? getLiveProducts(id) : []), [store, id, getLiveProducts, liveCatalog])
  const aisles = useMemo(() => liveAisles.filter((a) => a.enabled !== false), [liveAisles])
  const shopAisles = useMemo(() => aisles.filter((a) => a.id !== 'offers'), [aisles])
  const aisleTitle = (a) =>
    (lang === 'tr' && a.nameTr) || (lang === 'en' && a.nameEn) || a.nameAr || t(`cats.${a.id}`)

  const shown = useMemo(() => {
    if (!store) return []
    let list = allProducts
    if (tab === 'offers' || aisle === 'offers') list = list.filter((p) => p.oldPrice)
    else if (tab === 'again') {
      if (againIds.length) {
        const map = Object.fromEntries(list.map((p) => [p.id, p]))
        list = againIds.map((pid) => map[pid]).filter(Boolean)
      } else {
        list = list.filter((p) => p.popular)
      }
    } else if (aisle) list = list.filter((p) => p.aisle === aisle)
    const query = q.trim().toLowerCase()
    if (query) {
      list = list.filter(
        (p) =>
          productName(p, lang).toLowerCase().includes(query) ||
          (productDesc(p, lang) || '').toLowerCase().includes(query),
      )
    }
    return list
  }, [store, allProducts, tab, aisle, q, lang, againIds])

  const sectionRows = useMemo(() => {
    if (!store || tab !== 'shop' || aisle || q.trim()) return []
    const deals = allProducts.filter((p) => p.oldPrice).slice(0, 10)
    const featured = allProducts.filter((p) => p.popular).slice(0, 10)
    const rows = []
    if (featured.length) rows.push({ id: 'featured', title: t('popular'), products: featured })
    if (deals.length) rows.push({ id: 'offers-row', title: t('cats.offers'), products: deals })
    for (const a of shopAisles) {
      const products = allProducts.filter((p) => p.aisle === a.id).slice(0, 8)
      if (products.length) {
        const title =
          (lang === 'tr' && a.nameTr) || (lang === 'en' && a.nameEn) || a.nameAr || t(`cats.${a.id}`)
        rows.push({ id: a.id, title, products, aisleId: a.id })
      }
    }
    return rows
  }, [store, tab, aisle, q, allProducts, t])

  if (!store) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
        <TopBar title={t('storeMissing')} onBack={() => navigation.goBack()} />
      </SafeAreaView>
    )
  }

  const closed = store.status === 'closed' || store.comingSoon
  const thisStore = cartStore?.id === store.id && cartCount > 0
  const isFav = favorites.includes(store.id)
  const name = storeName(store, lang)
  const showSectioned = tab === 'shop' && !aisle && !q.trim() && !store.comingSoon

  const tabs = [
    { id: 'shop', label: t('shop'), Icon: StoreIcon },
    { id: 'sections', label: t('sections'), Icon: LayoutGrid },
    { id: 'offers', label: t('cats.offers'), Icon: Percent },
    { id: 'again', label: t('buyAgain'), Icon: RotateCcw },
  ]

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={[]}>
      <TopBar title={name} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ paddingBottom: thisStore ? 150 : 80 }}>
        {store.comingSoon ? (
          <View style={{ width: '100%', height: 168, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>
            <Logo size={88} />
            <View
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(22,22,22,0.72)',
                paddingVertical: 10,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: colors.yellow, fontWeight: '900', fontSize: 16 }}>{t('comingSoon')}</Text>
            </View>
          </View>
        ) : (
          <Image source={src(store.cover)} style={{ width: '100%', height: 168 }} />
        )}
        {store.comingSoon ? null : (
          <SoftPress
            onPress={() => toggleFavorite(store.id)}
            style={{
              position: 'absolute',
              top: 12,
              left: 16,
              width: 38,
              height: 38,
              borderRadius: 19,
              backgroundColor: '#fff',
              alignItems: 'center',
              justifyContent: 'center',
              ...shadow.soft,
            }}
          >
            <Star size={18} color={isFav ? colors.yellow : '#C9C9C9'} fill={isFav ? colors.yellow : 'none'} />
          </SoftPress>
        )}

        {/* Store header card (below TopBar) — Toters: ETA + rating + fee */}
        <View
          style={{
            marginTop: -40,
            marginHorizontal: 16,
            backgroundColor: '#fff',
            borderRadius: 18,
            padding: 16,
            borderWidth: 1,
            borderColor: colors.line,
            ...shadow.card,
          }}
        >
          <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 12 }}>
            <Image
              source={src(store.logo)}
              style={{ width: 48, height: 48, borderRadius: 14, borderWidth: 1, borderColor: colors.line }}
            />
            <Text style={{ flex: 1, fontSize: 20, fontWeight: '800', textAlign: isRTL ? 'right' : 'left' }}>{name}</Text>
          </View>
          {store.comingSoon ? (
            <Text style={{ color: colors.muted, marginTop: 8 }}>{t('comingSoonHint')}</Text>
          ) : (
            <>
              <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', gap: 10, marginTop: 14 }}>
                <View style={{ flex: 1, backgroundColor: colors.bg, borderRadius: 12, padding: 10 }}>
                  <Text style={{ color: colors.muted, fontSize: 11 }}>{t('deliveryTime')}</Text>
                  <Text style={{ fontWeight: '800', marginTop: 2 }}>
                    {store.eta} {t('min')}
                  </Text>
                </View>
                <View style={{ flex: 1, backgroundColor: colors.bg, borderRadius: 12, padding: 10 }}>
                  <Text style={{ color: colors.muted, fontSize: 11 }}>{t('reviews')}</Text>
                  <Text style={{ fontWeight: '800', color: colors.red, marginTop: 2 }}>
                    {store.rating} ({store.reviews > 999 ? '10K+' : store.reviews})
                  </Text>
                </View>
                <View style={{ flex: 1, backgroundColor: colors.bg, borderRadius: 12, padding: 10 }}>
                  <Text style={{ color: colors.muted, fontSize: 11 }}>{t('deliveryFee')}</Text>
                  <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 4, marginTop: 2 }}>
                    <Truck size={12} color={colors.ink} />
                    <Text style={{ fontWeight: '800', fontSize: 12 }}>
                      {store.fee === 0 ? t('freeDelivery') : formatIQD(store.fee, lang)}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', gap: 8, marginTop: 12 }}>
                <SoftPress
                  onPress={() => navigation.navigate('Rewards')}
                  style={{
                    flex: 1,
                    backgroundColor: colors.bg,
                    borderRadius: 14,
                    padding: 12,
                    borderLeftWidth: 3,
                    borderLeftColor: colors.red,
                  }}
                >
                  <Gift size={16} color={colors.red} />
                  <Text style={{ fontWeight: '800', marginTop: 4 }}>{t('rewards')}</Text>
                  <Text style={{ color: colors.muted, fontSize: 11 }}>{t('onSelected')}</Text>
                </SoftPress>
                <SoftPress
                  onPress={() => navigation.navigate('Rewards')}
                  style={{
                    flex: 1,
                    backgroundColor: colors.bg,
                    borderRadius: 14,
                    padding: 12,
                    borderLeftWidth: 3,
                    borderLeftColor: colors.yellowDark,
                  }}
                >
                  <Star size={16} color={colors.yellow} fill={colors.yellow} />
                  <Text style={{ fontWeight: '800', marginTop: 4 }}>{t('earnPoints')}</Text>
                  <Text style={{ color: colors.muted, fontSize: 11 }}>{t('onAllOrders')}</Text>
                </SoftPress>
              </View>
            </>
          )}
        </View>

        {store.comingSoon ? null : (
          <View
            style={{
              margin: 16,
              flexDirection: isRTL ? 'row-reverse' : 'row',
              alignItems: 'center',
              gap: 8,
              backgroundColor: '#fff',
              borderRadius: 14,
              paddingHorizontal: 12,
              borderWidth: 1,
              borderColor: colors.line,
            }}
          >
            <Search size={16} color={colors.muted} />
            <TextInput
              value={q}
              onChangeText={setQ}
              placeholder={t('storeSearch', { name })}
              style={{ flex: 1, minHeight: 42, textAlign: isRTL ? 'right' : 'left' }}
            />
          </View>
        )}

        {store.comingSoon ? null : tab === 'sections' ? (
          <View style={{ paddingHorizontal: 16 }}>
            <Text style={{ fontWeight: '800', fontSize: 17, marginBottom: 12, textAlign: isRTL ? 'right' : 'left' }}>
              {t('sections')}
            </Text>
            <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', flexWrap: 'wrap', gap: 10 }}>
              {aisles.map((a) => (
                <SoftPress
                  key={a.id}
                  onPress={() => {
                    setAisle(a.id)
                    setTab('shop')
                  }}
                  style={{
                    width: '30%',
                    minWidth: 96,
                    flexGrow: 1,
                    backgroundColor: '#fff',
                    borderRadius: 16,
                    paddingVertical: 14,
                    paddingHorizontal: 8,
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: colors.line,
                    ...shadow.soft,
                  }}
                >
                  <Image
                    source={aisleFallback(a.id)}
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 28,
                      backgroundColor: colors.line,
                      marginBottom: 8,
                    }}
                  />
                  <Text style={{ fontWeight: '700', fontSize: 12, textAlign: 'center' }}>{aisleTitle(a)}</Text>
                </SoftPress>
              ))}
            </View>
          </View>
        ) : showSectioned ? (
          <>
            {/* Category strip — Toters sections preview */}
            <View
              style={{
                paddingHorizontal: 16,
                flexDirection: isRTL ? 'row-reverse' : 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 8,
              }}
            >
              <Text style={{ fontWeight: '800', fontSize: 16 }}>{t('sections')}</Text>
              <SoftPress onPress={() => setTab('sections')}>
                <Text style={{ color: colors.red, fontWeight: '800', fontSize: 13 }}>{t('viewAll')}</Text>
              </SoftPress>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: 16,
                gap: 12,
                paddingBottom: 8,
                flexDirection: isRTL ? 'row-reverse' : 'row',
              }}
            >
              {aisles.map((a) => (
                <SoftPress
                  key={a.id}
                  onPress={() => setAisle(a.id)}
                  style={{ width: 78, alignItems: 'center' }}
                >
                  <View
                    style={{
                      width: 66,
                      height: 66,
                      borderRadius: 33,
                      overflow: 'hidden',
                      borderWidth: 2,
                      borderColor: '#fff',
                      backgroundColor: colors.line,
                      ...shadow.soft,
                    }}
                  >
                    <Image source={aisleFallback(a.id)} style={{ width: '100%', height: '100%' }} />
                  </View>
                  <Text numberOfLines={2} style={{ fontSize: 11, fontWeight: '700', marginTop: 7, textAlign: 'center' }}>
                    {aisleTitle(a)}
                  </Text>
                </SoftPress>
              ))}
            </ScrollView>

            {/* Sectioned horizontal product carousels */}
            {sectionRows.map((row) => (
              <View key={row.id} style={{ marginTop: 16 }}>
                <View
                  style={{
                    paddingHorizontal: 16,
                    flexDirection: isRTL ? 'row-reverse' : 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 10,
                  }}
                >
                  <Text style={{ fontWeight: '800', fontSize: 16 }}>{row.title}</Text>
                  {row.aisleId ? (
                    <SoftPress onPress={() => setAisle(row.aisleId)}>
                      <Text style={{ color: colors.red, fontWeight: '800', fontSize: 13 }}>{t('viewAll')}</Text>
                    </SoftPress>
                  ) : null}
                </View>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  decelerationRate="fast"
                  contentContainerStyle={{
                    paddingHorizontal: 16,
                    gap: 12,
                    flexDirection: isRTL ? 'row-reverse' : 'row',
                  }}
                >
                  {row.products.map((product) => (
                    <ProductCard
                      key={`${row.id}-${product.id}`}
                      product={product}
                      storeId={store.id}
                      disabled={closed}
                      compact
                    />
                  ))}
                </ScrollView>
              </View>
            ))}
          </>
        ) : (
          <>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16, gap: 8, paddingBottom: 8 }}
            >
              <SoftPress
                onPress={() => setAisle(null)}
                style={{
                  backgroundColor: !aisle ? colors.redSoft : '#fff',
                  borderRadius: 999,
                  paddingHorizontal: 14,
                  paddingVertical: 9,
                  borderWidth: 1,
                  borderColor: !aisle ? colors.red : colors.line,
                }}
              >
                <Text style={{ fontWeight: '700', color: !aisle ? colors.red : colors.ink }}>{t('shop')}</Text>
              </SoftPress>
              {aisles.map((a) => {
                const on = aisle === a.id
                return (
                  <SoftPress
                    key={a.id}
                    onPress={() => setAisle(on ? null : a.id)}
                    style={{
                      backgroundColor: on ? colors.redSoft : '#fff',
                      borderRadius: 999,
                      paddingHorizontal: 14,
                      paddingVertical: 9,
                      borderWidth: 1,
                      borderColor: on ? colors.red : colors.line,
                    }}
                  >
                    <Text style={{ fontWeight: '700', color: on ? colors.red : colors.ink }}>{aisleTitle(a)}</Text>
                  </SoftPress>
                )
              })}
            </ScrollView>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 16 }}>
              {shown.length === 0 && tab === 'again' ? (
                <View style={{ width: '100%', paddingVertical: 36, alignItems: 'center' }}>
                  <View
                    style={{
                      width: 72,
                      height: 72,
                      borderRadius: 36,
                      backgroundColor: colors.redSoft,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 12,
                    }}
                  >
                    <RotateCcw size={28} color={colors.red} />
                  </View>
                  <Text style={{ color: colors.muted, fontWeight: '700', textAlign: 'center' }}>{t('buyAgainEmpty')}</Text>
                </View>
              ) : (
                shown.map((product) => (
                  <ProductCard key={product.id} product={product} storeId={store.id} disabled={closed} />
                ))
              )}
            </View>
          </>
        )}
      </ScrollView>

      {store.comingSoon ? null : (
        <View
          style={{
            flexDirection: isRTL ? 'row-reverse' : 'row',
            borderTopWidth: 1,
            borderTopColor: colors.line,
            backgroundColor: '#fff',
            paddingVertical: 8,
            paddingBottom: thisStore ? 8 : 10,
          }}
        >
          {tabs.map((item) => {
            const on = tab === item.id
            const Icon = item.Icon
            return (
              <SoftPress
                key={item.id}
                onPress={() => {
                  setTab(item.id)
                  if (item.id === 'offers') setAisle('offers')
                  else if (item.id === 'shop' || item.id === 'sections' || item.id === 'again') setAisle(null)
                }}
                style={{ flex: 1, alignItems: 'center', gap: 2, paddingVertical: 4 }}
              >
                <Icon size={18} color={on ? colors.red : colors.muted} />
                <Text style={{ fontSize: 10, fontWeight: '700', color: on ? colors.red : colors.muted }}>{item.label}</Text>
              </SoftPress>
            )
          })}
        </View>
      )}

      {thisStore ? (
        <SoftPress
          onPress={() => navigation.navigate('Cart')}
          style={{
            position: 'absolute',
            left: 16,
            right: 16,
            bottom: 62,
            backgroundColor: colors.ink,
            borderRadius: 18,
            padding: 13,
            flexDirection: isRTL ? 'row-reverse' : 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            ...shadow.float,
          }}
        >
          <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 6 }}>
            <ShoppingBag size={16} color="#fff" />
            <Text style={{ color: '#fff', fontWeight: '800' }}>{formatIQD(cartTotal, lang)}</Text>
          </View>
          <View style={{ backgroundColor: colors.red, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10 }}>
            <Text style={{ color: '#fff', fontWeight: '800' }}>{t('viewCart')}</Text>
          </View>
        </SoftPress>
      ) : null}
    </SafeAreaView>
  )
}
