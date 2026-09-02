import { useMemo, useState } from 'react'
import { Image, ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import {
  Gift,
  ListChecks,
  Percent,
  ShoppingBag,
  Sparkles,
  Star,
  Timer,
  Truck,
} from 'lucide-react-native'
import TopBar from '../components/TopBar'
import SearchField from '../components/SearchField'
import StoreCard from '../components/StoreCard'
import ProductCard from '../components/ProductCard'
import Logo from '../components/Logo'
import ProductImage from '../components/ProductImage'
import SoftPress from '../components/SoftPress'
import { useApp } from '../context/AppContext'
import { useI18n } from '../context/I18nContext'
import {
  DEFAULT_STORE_ID,
  flyerKicker,
  flyerSub,
  flyerTitle,
  filters,
  filterStores,
  formatIQD,
  getNearestStore,
  notifTitle,
  productName,
  recommendProducts,
  stories,
  storyTitle,
  storeName,
} from '../data/mock'
import { aisleFallback, src } from '../utils/images'
import { colors, shadow } from '../theme'

const filterIcon = {
  offers: Percent,
  freeDelivery: Truck,
  topRated: Star,
  new: Sparkles,
  under30: Timer,
}

/** Pair products into columns [top, bottom] for synced 2-row horizontal scroll */
function pairColumns(products) {
  const cols = []
  for (let i = 0; i < products.length; i += 2) {
    cols.push([products[i], products[i + 1] || null])
  }
  return cols
}

function aisleTitle(a, lang, t) {
  return (lang === 'tr' && a.nameTr) || (lang === 'en' && a.nameEn) || a.nameAr || t(`cats.${a.id}`)
}

function AktuelFlyer({ flyer, lang, t, isRTL, onPress, catalog }) {
  const skuMap = Object.fromEntries((catalog || []).map((p) => [p.id, p]))
  const skus = (flyer.skus || flyer.productIds || []).map((id) => skuMap[id]).filter(Boolean)
  return (
    <SoftPress
      accessibilityRole="button"
      accessibilityLabel={t('weeklyFlyer')}
      onPress={onPress}
      style={{
        marginHorizontal: 16,
        marginBottom: 12,
        backgroundColor: '#fff',
        borderRadius: 18,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.line,
        ...shadow.card,
      }}
    >
      <View pointerEvents="none">
        <View
          style={{
            backgroundColor: colors.ink,
            paddingHorizontal: 14,
            paddingVertical: 12,
            flexDirection: isRTL ? 'row-reverse' : 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <View style={{ flex: 1 }}>
            <Text style={{ color: colors.yellow, fontWeight: '900', fontSize: 11, letterSpacing: 0.8 }}>
              {flyerKicker(flyer, lang)}
            </Text>
            <Text style={{ color: '#fff', fontWeight: '800', fontSize: 18, marginTop: 2 }}>{t('weeklyFlyer')}</Text>
          </View>
          <Logo size={40} onBrand />
        </View>
        <View style={{ padding: 14, backgroundColor: '#FFFEF6' }}>
          <Text style={{ fontWeight: '900', fontSize: 20, color: colors.ink }}>{flyerTitle(flyer, lang)}</Text>
          <Text style={{ color: colors.muted, marginTop: 4, fontSize: 13 }}>{flyerSub(flyer, lang)}</Text>
          <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
            {skus.map((p) => (
              <View
                key={p.id}
                style={{
                  flexDirection: isRTL ? 'row-reverse' : 'row',
                  alignItems: 'center',
                  gap: 8,
                  backgroundColor: '#fff',
                  borderRadius: 12,
                  padding: 8,
                  borderWidth: 1,
                  borderColor: colors.line,
                  minWidth: '46%',
                  flexGrow: 1,
                }}
              >
                <ProductImage uri={p.image} aisle={p.aisle} style={{ width: 44, height: 44, borderRadius: 8 }} />
                <View style={{ flex: 1 }}>
                  <Text numberOfLines={1} style={{ fontWeight: '700', fontSize: 12 }}>
                    {productName(p, lang)}
                  </Text>
                  <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 6, marginTop: 2 }}>
                    <View style={{ backgroundColor: colors.yellow, borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 }}>
                      <Text style={{ fontWeight: '900', fontSize: 11, color: colors.ink }}>{formatIQD(p.price, lang)}</Text>
                    </View>
                    {p.oldPrice ? (
                      <Text style={{ color: colors.muted, fontSize: 10, textDecorationLine: 'line-through' }}>
                        {formatIQD(p.oldPrice, lang)}
                      </Text>
                    ) : null}
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
        <View
          style={{
            backgroundColor: colors.red,
            paddingVertical: 12,
            paddingHorizontal: 14,
            flexDirection: isRTL ? 'row-reverse' : 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Text style={{ color: '#fff', fontWeight: '800', fontSize: 14 }}>{t('cats.deals')}</Text>
          <Text style={{ color: '#fff', fontWeight: '800', fontSize: 14 }}>{t('viewAll')} →</Text>
        </View>
      </View>
    </SoftPress>
  )
}

export default function HomeScreen({ navigation }) {
  const {
    cartCount,
    cartTotal,
    cartStore,
    user,
    seenStories,
    notifications,
    markNotificationRead,
    plusActive,
    orders,
    favorites,
    getLiveProducts,
    getLiveStore,
    liveAisles,
    liveCampaigns,
    liveStores,
    liveCatalog,
  } = useApp()
  const { t, lang, isRTL } = useI18n()
  const [chip, setChip] = useState(null)
  const go = (name, params) => navigation.navigate(name, params)

  const nearest = useMemo(() => {
    const n = getNearestStore(user?.address)
    return n ? getLiveStore(n.id) || n : null
  }, [user?.address, getLiveStore])
  const catalogStore = nearest
  const storeId = catalogStore?.id || DEFAULT_STORE_ID
  const openFlyer = (flyerId = 'week') => go('Flyer', { id: flyerId, storeId })
  const activeFlyers = useMemo(
    () => liveCampaigns.filter((c) => c.active !== false).map((c) => ({ ...c, skus: c.productIds || c.skus || [] })),
    [liveCampaigns],
  )
  const visibleAisles = useMemo(() => liveAisles.filter((a) => a.enabled !== false), [liveAisles])

  const storeProducts = useMemo(() => {
    let list = getLiveProducts(storeId)
    if (chip === 'offers') list = list.filter((p) => p.oldPrice)
    return list
  }, [storeId, chip, getLiveProducts, liveCatalog])

  const aisleGroups = useMemo(() => {
    const shop = visibleAisles.filter((a) => a.id !== 'offers')
    return shop
      .map((a) => ({
        id: a.id,
        title: aisleTitle(a, lang, t),
        products: storeProducts.filter((p) => p.aisle === a.id).slice(0, 12),
      }))
      .filter((g) => g.products.length > 0)
  }, [visibleAisles, storeProducts, lang, t])

  const forYou = useMemo(
    () => recommendProducts(storeId, { orders, favorites, limit: 6, products: getLiveProducts(storeId) }),
    [storeId, orders, favorites, getLiveProducts, liveCatalog],
  )

  const promoProducts = useMemo(() => {
    const list = getLiveProducts(storeId)
    return list.filter(
      (p) =>
        p.oldPrice ||
        p.promo ||
        p.discount ||
        p.offer ||
        p.campaign ||
        p.deals,
    )
  }, [storeId, getLiveProducts, liveCatalog])

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={[]}>
      <TopBar showLocation onLocation={() => go('Addresses')} onBell={() => go('Notifications')} />
      <ScrollView contentContainerStyle={{ paddingBottom: cartCount ? 100 : 24 }}>
        <View style={{ marginHorizontal: 16, marginTop: 4 }}>
          <SearchField
            mode="pressable"
            isRTL={isRTL}
            placeholder={t('searchPlaceholder')}
            onPress={() => navigation.navigate('SearchTab')}
            onScan={() => navigation.navigate('Scan')}
          />
        </View>

        {(() => {
          const latest = notifications.find((n) => !n.read)
          if (!latest) return null
          return (
            <SoftPress
              onPress={() => {
                markNotificationRead(latest.id)
                if (latest.storyId === 's-aktuel') openFlyer('week')
                else if (latest.storyId) go('Story', { id: latest.storyId })
                else if (latest.cta?.screen) go(latest.cta.screen, latest.cta.params)
                else go('Notifications')
              }}
              style={{
                marginHorizontal: 16,
                marginTop: 14,
                backgroundColor: colors.ink,
                borderRadius: 14,
                paddingHorizontal: 14,
                paddingVertical: 12,
                flexDirection: isRTL ? 'row-reverse' : 'row',
                alignItems: 'center',
                gap: 10,
                ...shadow.soft,
              }}
            >
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.red }} />
              <Text style={{ flex: 1, color: '#fff', fontWeight: '700', fontSize: 13 }} numberOfLines={1}>
                {notifTitle(latest, lang)}
              </Text>
              <Text style={{ color: colors.yellow, fontWeight: '800', fontSize: 12 }}>{t('notifications')}</Text>
            </SoftPress>
          )
        })()}

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 16 }} contentContainerStyle={{ paddingHorizontal: 16 }}>
          {stories.map((s) => {
            const seen = seenStories?.includes(s.id)
            return (
              <SoftPress
                key={s.id}
                onPress={() => (s.id === 's-aktuel' ? openFlyer('week') : go('Story', { id: s.id }))}
                style={{
                  width: 132,
                  height: 220,
                  borderRadius: 18,
                  overflow: 'hidden',
                  marginRight: 10,
                  borderWidth: 2.5,
                  borderColor: seen ? colors.line : colors.red,
                  backgroundColor: colors.ink,
                  ...shadow.soft,
                }}
              >
                {s.image ? (
                  <Image
                    source={src(s.image)}
                    resizeMode="cover"
                    style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%' }}
                  />
                ) : null}
                <View
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: 0,
                    padding: 10,
                    backgroundColor: 'rgba(0,0,0,0.45)',
                  }}
                >
                  <Text style={{ color: colors.yellow, fontWeight: '800', fontSize: 10 }}>M10</Text>
                  <Text style={{ color: '#fff', fontWeight: '800', fontSize: 13 }} numberOfLines={2}>
                    {storyTitle(s, lang)}
                  </Text>
                </View>
              </SoftPress>
            )
          })}
        </ScrollView>

        <View style={{ marginTop: 16 }}>
          {activeFlyers.slice(0, 1).map((f) => (
            <AktuelFlyer
              key={f.id}
              flyer={f}
              catalog={storeProducts}
              lang={lang}
              t={t}
              isRTL={isRTL}
              onPress={() => openFlyer(f.id)}
            />
          ))}
        </View>

        <SoftPress
          onPress={() => go('Plus')}
          style={{
            marginHorizontal: 16,
            marginTop: 4,
            backgroundColor: colors.ink,
            borderRadius: 16,
            padding: 14,
            flexDirection: isRTL ? 'row-reverse' : 'row',
            alignItems: 'center',
            gap: 10,
            ...shadow.soft,
          }}
        >
          <View style={{ backgroundColor: colors.yellow, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 }}>
            <Text style={{ fontWeight: '900', color: colors.ink, fontSize: 12 }}>M10+</Text>
          </View>
          <Text style={{ flex: 1, fontWeight: '700', fontSize: 13, color: '#fff' }}>
            {plusActive ? t('plusMember') : t('plusHomeCta')}
          </Text>
          <Text style={{ color: colors.yellow, fontWeight: '800', fontSize: 13 }}>
            {plusActive ? t('plusMember') : t('plusSubscribe')}
          </Text>
        </SoftPress>

        <SoftPress
          onPress={() => go('Rewards')}
          style={{
            marginHorizontal: 16,
            marginTop: 10,
            backgroundColor: '#fff',
            borderRadius: 14,
            padding: 13,
            flexDirection: isRTL ? 'row-reverse' : 'row',
            alignItems: 'center',
            gap: 10,
            borderLeftWidth: 3,
            borderLeftColor: colors.red,
            ...shadow.soft,
          }}
        >
          <Gift size={18} color={colors.red} />
          <Text style={{ flex: 1, fontWeight: '700', fontSize: 13 }}>{t('loyaltyBanner')}</Text>
          <Text style={{ color: colors.red, fontWeight: '800', fontSize: 13 }}>{t('loginCta')}</Text>
        </SoftPress>

        <SoftPress
          onPress={() => go('Lists')}
          style={{
            marginHorizontal: 16,
            marginTop: 10,
            backgroundColor: '#fff',
            borderRadius: 14,
            padding: 13,
            flexDirection: isRTL ? 'row-reverse' : 'row',
            alignItems: 'center',
            gap: 10,
            borderWidth: 1,
            borderColor: colors.line,
            ...shadow.soft,
          }}
        >
          <ListChecks size={18} color={colors.red} />
          <Text style={{ flex: 1, fontWeight: '700', fontSize: 13 }}>{t('listsHomeCta')}</Text>
          <Text style={{ color: colors.red, fontWeight: '800', fontSize: 13 }}>{t('viewAll')}</Text>
        </SoftPress>

        {forYou.length ? (
          <View style={{ marginTop: 18 }}>
            <View
              style={{
                flexDirection: isRTL ? 'row-reverse' : 'row',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                marginBottom: 10,
                paddingHorizontal: 16,
              }}
            >
              <Text style={{ fontSize: 17, fontWeight: '800' }}>{t('forYou')}</Text>
              <Text style={{ color: colors.muted, fontSize: 12 }}>{t('forYouHint')}</Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              decelerationRate="fast"
              snapToInterval={162}
              snapToAlignment="start"
              contentContainerStyle={{
                paddingHorizontal: 16,
                gap: 12,
                flexDirection: isRTL ? 'row-reverse' : 'row',
              }}
            >
              {forYou.map((product) => (
                <ProductCard key={`fy-${product.id}`} product={product} storeId={storeId} compact />
              ))}
            </ScrollView>
          </View>
        ) : null}

        {promoProducts.length ? (
          <View style={{ marginTop: 18 }}>
            <View
              style={{
                flexDirection: isRTL ? 'row-reverse' : 'row',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                marginBottom: 10,
                paddingHorizontal: 16,
              }}
            >
              <Text style={{ fontSize: 17, fontWeight: '800', color: colors.ink }}>{t('promoDeals')}</Text>
              <SoftPress onPress={() => go('Store', { id: storeId, aisle: 'offers' })}>
                <Text style={{ color: colors.red, fontWeight: '800', fontSize: 12 }}>{t('viewAll')}</Text>
              </SoftPress>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              decelerationRate="fast"
              snapToInterval={162}
              snapToAlignment="start"
              contentContainerStyle={{
                paddingHorizontal: 16,
                gap: 12,
                flexDirection: isRTL ? 'row-reverse' : 'row',
              }}
            >
              {promoProducts.map((product) => (
                <ProductCard key={`promo-${product.id}`} product={product} storeId={storeId} compact />
              ))}
            </ScrollView>
          </View>
        ) : null}

        <Text style={{ fontWeight: '800', fontSize: 17, marginTop: 20, marginHorizontal: 16 }}>{t('sections')}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12, gap: 14 }}>
          {visibleAisles.map((a) => (
            <SoftPress
              key={a.id}
              onPress={() => go('Store', { id: storeId, aisle: a.id })}
              style={{ width: 78, alignItems: 'center' }}
            >
              <View
                style={{
                  width: 68,
                  height: 68,
                  borderRadius: 34,
                  overflow: 'hidden',
                  borderWidth: 2,
                  borderColor: '#fff',
                  backgroundColor: colors.line,
                  ...shadow.soft,
                }}
              >
                <Image source={aisleFallback(a.id)} style={{ width: '100%', height: '100%' }} />
              </View>
              <Text style={{ fontSize: 11, fontWeight: '700', marginTop: 7, textAlign: 'center' }}>
                {aisleTitle(a, lang, t)}
              </Text>
            </SoftPress>
          ))}
        </ScrollView>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, gap: 8 }}>
          {filters.map((f) => {
            const on = chip === f.id
            const Icon = filterIcon[f.id]
            return (
              <SoftPress
                key={f.id}
                onPress={() => setChip(on ? null : f.id)}
                style={{
                  backgroundColor: on ? colors.red : '#fff',
                  borderWidth: on ? 0 : 1,
                  borderColor: colors.line,
                  borderRadius: 999,
                  paddingHorizontal: 14,
                  paddingVertical: 9,
                  flexDirection: isRTL ? 'row-reverse' : 'row',
                  alignItems: 'center',
                  gap: 6,
                  ...(on ? shadow.soft : null),
                }}
              >
                {Icon ? <Icon size={14} color={on ? '#fff' : colors.red} /> : null}
                <Text style={{ fontWeight: '800', fontSize: 12, color: on ? '#fff' : colors.ink }}>
                  {t(`filters.${f.id}`)}
                </Text>
              </SoftPress>
            )
          })}
        </ScrollView>

        <View style={{ marginTop: 18 }}>
          <View
            style={{
              paddingHorizontal: 16,
              flexDirection: isRTL ? 'row-reverse' : 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 10,
            }}
          >
            <Text style={{ fontSize: 17, fontWeight: '800' }}>{t('ourBranches')}</Text>
            <Text style={{ color: colors.muted }}>{t('storesCount', { n: filterStores(liveStores, 'all', chip).length })}</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
            {filterStores(liveStores, 'all', chip).map((s) => (
              <StoreCard
                key={s.id}
                store={s}
                compact
                onPress={() => go('Store', { id: s.id })}
              />
            ))}
          </ScrollView>
        </View>

        {aisleGroups.map((group) => (
          <View key={group.id} style={{ marginTop: 18 }}>
            <View
              style={{
                paddingHorizontal: 16,
                flexDirection: isRTL ? 'row-reverse' : 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 10,
              }}
            >
              <Text style={{ fontSize: 17, fontWeight: '800', color: colors.ink, flex: 1, textAlign: isRTL ? 'right' : 'left' }}>
                {group.title}
              </Text>
              <SoftPress onPress={() => go('Store', { id: storeId, aisle: group.id })}>
                <Text style={{ color: colors.red, fontWeight: '800', fontSize: 12 }}>{t('viewAll')}</Text>
              </SoftPress>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              decelerationRate="fast"
              snapToInterval={162}
              snapToAlignment="start"
              contentContainerStyle={{
                paddingHorizontal: 16,
                gap: 12,
                flexDirection: isRTL ? 'row-reverse' : 'row',
              }}
            >
              {pairColumns(group.products).map((col) => (
                <View key={`${group.id}-${col[0].id}`} style={{ width: 150, gap: 10 }}>
                  <ProductCard product={col[0]} storeId={storeId} compact />
                  {col[1] ? <ProductCard product={col[1]} storeId={storeId} compact /> : null}
                </View>
              ))}
            </ScrollView>
          </View>
        ))}
      </ScrollView>

      {cartCount > 0 ? (
        <SoftPress
          onPress={() => go('Cart')}
          style={{
            position: 'absolute',
            left: 16,
            right: 16,
            bottom: 12,
            backgroundColor: colors.ink,
            borderRadius: 18,
            padding: 13,
            flexDirection: isRTL ? 'row-reverse' : 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            ...shadow.float,
          }}
        >
          <View>
            <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 6 }}>
              <ShoppingBag size={16} color="#fff" />
              <Text style={{ color: '#fff', fontWeight: '800' }}>
                {t('yourCart')} · {cartCount}
              </Text>
            </View>
            <Text style={{ color: '#bbb', marginTop: 2 }}>
              {storeName(cartStore, lang)} · {formatIQD(cartTotal, lang)}
            </Text>
          </View>
          <View style={{ backgroundColor: colors.red, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10 }}>
            <Text style={{ color: '#fff', fontWeight: '800' }}>{t('viewCart')}</Text>
          </View>
        </SoftPress>
      ) : null}
    </SafeAreaView>
  )
}
