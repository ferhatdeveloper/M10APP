import { useMemo } from 'react'
import { Alert, Pressable, ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Plus, ShoppingBag } from 'lucide-react-native'
import TopBar from '../components/TopBar'
import Logo from '../components/Logo'
import ProductImage from '../components/ProductImage'
import { useApp } from '../context/AppContext'
import { useI18n } from '../context/I18nContext'
import {
  DEFAULT_STORE_ID,
  formatIQD,
  flyerKicker,
  flyerSub,
  flyerTitle,
  getNearestStore,
  isInStock,
  productName,
} from '../data/mock'
import { colors, radius } from '../theme'

export default function FlyerScreen({ navigation, route }) {
  const flyerId = route.params?.id || 'week'
  const storeId = route.params?.storeId
  const { addToCart, user, cartCount, cartStore, cartTotal, getLiveFlyer, getLiveProduct } = useApp()
  const flyer = getLiveFlyer(flyerId)
  const { t, lang, isRTL } = useI18n()

  const targetStoreId = useMemo(() => {
    if (storeId) return storeId
    const nearest = getNearestStore(user?.address)
    return nearest?.id || DEFAULT_STORE_ID
  }, [storeId, user?.address])

  const skus = useMemo(() => {
    if (!flyer) return []
    return (flyer.skus || flyer.productIds || []).map((id) => getLiveProduct(targetStoreId, id)).filter(Boolean)
  }, [flyer, targetStoreId, getLiveProduct])

  const thisStore = cartStore?.id === targetStoreId && cartCount > 0

  if (!flyer) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={[]}>
        <TopBar title={t('weeklyFlyer')} onBack={() => navigation.goBack()} />
      </SafeAreaView>
    )
  }

  const addOne = (p) => {
    if (!isInStock(p)) {
      Alert.alert(t('outOfStock'), t('noSubstitute'))
      return
    }
    addToCart(targetStoreId, p.id)
  }

  const addAll = () => {
    let n = 0
    for (const p of skus) {
      if (isInStock(p) && addToCart(targetStoreId, p.id)) n += 1
    }
    if (n) Alert.alert(t('weeklyFlyer'), t('flyerAdded', { n }))
    else Alert.alert(t('weeklyFlyer'), t('flyerNoneInStock'))
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={[]}>
      <TopBar title={t('weeklyFlyer')} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ paddingBottom: thisStore ? 150 : 100 }}>
        <View style={{ backgroundColor: colors.ink, padding: 16, flexDirection: isRTL ? 'row-reverse' : 'row', gap: 12 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ color: colors.yellow, fontWeight: '900', fontSize: 12 }}>{flyerKicker(flyer, lang)}</Text>
            <Text style={{ color: '#fff', fontWeight: '900', fontSize: 22, marginTop: 4 }}>{flyerTitle(flyer, lang)}</Text>
            <Text style={{ color: 'rgba(255,255,255,0.75)', marginTop: 6 }}>{flyerSub(flyer, lang)}</Text>
          </View>
          <Logo size={48} onBrand />
        </View>
        <View style={{ height: 4, backgroundColor: colors.red }} />

        <View style={{ padding: 16, gap: 10 }}>
          {skus.map((p) => {
            const ok = isInStock(p)
            return (
              <View
                key={p.id}
                style={{
                  backgroundColor: '#fff',
                  borderRadius: radius,
                  padding: 12,
                  flexDirection: isRTL ? 'row-reverse' : 'row',
                  gap: 12,
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: colors.line,
                  opacity: ok ? 1 : 0.7,
                }}
              >
                <Pressable onPress={() => navigation.navigate('Product', { storeId: targetStoreId, productId: p.id })}>
                  <ProductImage uri={p.image} aisle={p.aisle} style={{ width: 64, height: 64, borderRadius: 12 }} />
                </Pressable>
                <Pressable
                  onPress={() => navigation.navigate('Product', { storeId: targetStoreId, productId: p.id })}
                  style={{ flex: 1, alignItems: isRTL ? 'flex-end' : 'flex-start' }}
                >
                  <Text style={{ fontWeight: '800' }} numberOfLines={2}>
                    {productName(p, lang)}
                  </Text>
                  <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
                    <Text style={{ color: colors.red, fontWeight: '900' }}>{formatIQD(p.price, lang)}</Text>
                    {p.oldPrice ? (
                      <Text style={{ color: colors.muted, textDecorationLine: 'line-through', fontSize: 12 }}>
                        {formatIQD(p.oldPrice, lang)}
                      </Text>
                    ) : null}
                  </View>
                  {!ok ? <Text style={{ color: colors.muted, fontSize: 11, marginTop: 2 }}>{t('outOfStock')}</Text> : null}
                </Pressable>
                <Pressable
                  onPress={() => addOne(p)}
                  disabled={!ok}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: ok ? colors.red : '#CCC',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Plus size={18} color="#fff" strokeWidth={3} />
                </Pressable>
              </View>
            )
          })}
        </View>
      </ScrollView>

      <Pressable
        onPress={addAll}
        style={{
          position: 'absolute',
          left: 16,
          right: 16,
          bottom: thisStore ? 72 : 16,
          backgroundColor: colors.red,
          borderRadius: 14,
          paddingVertical: 14,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: '#fff', fontWeight: '800' }}>{t('addAllFlyer')}</Text>
      </Pressable>

      {thisStore ? (
        <Pressable
          onPress={() => navigation.navigate('Cart')}
          style={{
            position: 'absolute',
            left: 16,
            right: 16,
            bottom: 16,
            backgroundColor: colors.ink,
            borderRadius: 16,
            padding: 12,
            flexDirection: isRTL ? 'row-reverse' : 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 6 }}>
            <ShoppingBag size={16} color="#fff" />
            <Text style={{ color: '#fff', fontWeight: '800' }}>{formatIQD(cartTotal, lang)}</Text>
          </View>
          <View style={{ backgroundColor: colors.red, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10 }}>
            <Text style={{ color: '#fff', fontWeight: '800' }}>{t('viewCart')}</Text>
          </View>
        </Pressable>
      ) : null}
    </SafeAreaView>
  )
}
