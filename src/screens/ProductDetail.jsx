import { useMemo, useState } from 'react'
import { Alert, ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Plus, ShoppingBag, Camera } from 'lucide-react-native'
import TopBar from '../components/TopBar'
import SoftPress from '../components/SoftPress'
import { useApp } from '../context/AppContext'
import { useI18n } from '../context/I18nContext'
import {
  allergenLabel,
  canTryInRoom,
  formatIQD,
  formatUnitPrice,
  getSubstitute,
  isInStock,
  productDesc,
  productImages,
  productName,
  variantLabel,
} from '../data/mock'
import ProductImage from '../components/ProductImage'
import { colors, radius, shadow } from '../theme'

export default function ProductDetailScreen({ navigation, route }) {
  const { storeId, productId } = route.params || {}
  const { addToCart, cartCount, cartStore, cartTotal, getLiveProduct, getLiveStore } = useApp()
  const product = getLiveProduct(storeId, productId)
  const store = getLiveStore(storeId)
  const { t, lang, isRTL } = useI18n()
  const images = productImages(product)
  const [imgIdx, setImgIdx] = useState(0)
  const variants = product?.variants || []
  const [variantId, setVariantId] = useState(variants[0]?.id || null)

  const activeVariant = useMemo(
    () => variants.find((v) => v.id === variantId) || variants[0] || null,
    [variants, variantId],
  )
  const price = activeVariant?.price ?? product?.price ?? 0
  const inStock = isInStock(product)
  const sub = !inStock && product ? getSubstitute(storeId, product) : null
  const unitLine = formatUnitPrice(product, lang, price)
  const closed = store?.status === 'closed' || store?.comingSoon
  const thisStore = cartStore?.id === storeId && cartCount > 0

  if (!product || !store) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={[]}>
        <TopBar title={t('product')} onBack={() => navigation.goBack()} />
        <View style={{ padding: 24, alignItems: 'center' }}>
          <Text style={{ color: colors.muted, fontWeight: '700' }}>{t('storeMissing')}</Text>
        </View>
      </SafeAreaView>
    )
  }

  const onAdd = () => {
    if (!inStock) {
      if (sub && isInStock(sub)) {
        Alert.alert(t('outOfStock'), t('suggestSubstitute', { name: productName(sub, lang) }), [
          { text: t('cancel'), style: 'cancel' },
          { text: t('addSubstitute'), onPress: () => addToCart(storeId, sub.id) },
        ])
      } else {
        Alert.alert(t('outOfStock'), t('noSubstitute'))
      }
      return
    }
    addToCart(storeId, product.id, 1, {
      variantId: activeVariant?.id || null,
      unitPrice: price,
    })
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={[]}>
      <TopBar title={productName(product, lang)} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ paddingBottom: thisStore ? 150 : 100 }}>
        <View style={{ backgroundColor: '#fff' }}>
          <ProductImage
            uri={images[imgIdx] || product.image}
            aisle={product.aisle}
            style={{ width: '100%', height: 280, backgroundColor: '#F3F3F3', opacity: inStock ? 1 : 0.55 }}
          />
          {!inStock ? (
            <View
              style={{
                position: 'absolute',
                top: 14,
                left: isRTL ? undefined : 14,
                right: isRTL ? 14 : undefined,
                backgroundColor: colors.ink,
                borderRadius: 999,
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderWidth: 1.5,
                borderColor: colors.yellow,
              }}
            >
              <Text style={{ color: '#fff', fontWeight: '800', fontSize: 12 }}>{t('outOfStock')}</Text>
            </View>
          ) : null}
          {images.length > 1 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                padding: 12,
                gap: 8,
                flexDirection: isRTL ? 'row-reverse' : 'row',
              }}
            >
              {images.map((uri, i) => (
                <SoftPress key={`${uri}-${i}`} onPress={() => setImgIdx(i)}>
                  <ProductImage
                    uri={uri}
                    aisle={product.aisle}
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 10,
                      borderWidth: 2,
                      borderColor: i === imgIdx ? colors.red : colors.line,
                    }}
                  />
                </SoftPress>
              ))}
            </ScrollView>
          ) : null}
        </View>

        {canTryInRoom(product) ? (
          <SoftPress
            onPress={() => navigation.navigate('TryInRoom', { storeId, productId: product.id })}
            style={{
              marginHorizontal: 16,
              marginTop: 12,
              backgroundColor: colors.ink,
              borderRadius: 14,
              paddingVertical: 13,
              paddingHorizontal: 16,
              flexDirection: isRTL ? 'row-reverse' : 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              ...shadow.soft,
            }}
          >
            <Camera size={18} color={colors.yellow} strokeWidth={2.5} />
            <Text style={{ color: '#fff', fontWeight: '800' }}>{t('tryInRoomCta')}</Text>
          </SoftPress>
        ) : null}

        <View style={{ margin: 16, backgroundColor: '#fff', borderRadius: radius, padding: 16, ...shadow.card }}>
          {product.brand ? (
            <Text style={{ color: colors.muted, fontWeight: '700', fontSize: 12 }}>{product.brand}</Text>
          ) : null}
          <Text style={{ fontWeight: '900', fontSize: 22, color: colors.ink, marginTop: 4, textAlign: isRTL ? 'right' : 'left' }}>
            {productName(product, lang)}
          </Text>
          <Text style={{ color: colors.muted, marginTop: 6, textAlign: isRTL ? 'right' : 'left' }}>
            {productDesc(product, lang)}
          </Text>

          <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'baseline', gap: 10, marginTop: 14 }}>
            <Text style={{ color: colors.red, fontWeight: '900', fontSize: 22 }}>{formatIQD(price, lang)}</Text>
            {product.oldPrice && !activeVariant ? (
              <Text style={{ color: colors.muted, textDecorationLine: 'line-through' }}>
                {formatIQD(product.oldPrice, lang)}
              </Text>
            ) : null}
          </View>
          {unitLine ? (
            <Text style={{ color: colors.muted, marginTop: 4, fontWeight: '600', textAlign: isRTL ? 'right' : 'left' }}>
              {t('unitPrice')}: {unitLine}
            </Text>
          ) : null}

          {variants.length ? (
            <View style={{ marginTop: 16 }}>
              <Text style={{ fontWeight: '800', marginBottom: 8, textAlign: isRTL ? 'right' : 'left' }}>{t('variant')}</Text>
              <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', flexWrap: 'wrap', gap: 8 }}>
                {variants.map((v) => {
                  const on = (activeVariant?.id || variantId) === v.id
                  return (
                    <SoftPress
                      key={v.id}
                      onPress={() => setVariantId(v.id)}
                      style={{
                        paddingHorizontal: 14,
                        paddingVertical: 10,
                        borderRadius: 999,
                        backgroundColor: on ? colors.redSoft : colors.bg,
                        borderWidth: 1.5,
                        borderColor: on ? colors.red : colors.line,
                      }}
                    >
                      <Text style={{ fontWeight: '800', color: on ? colors.red : colors.ink }}>
                        {variantLabel(v, lang)}
                      </Text>
                      <Text style={{ fontSize: 11, color: colors.muted, marginTop: 2 }}>{formatIQD(v.price, lang)}</Text>
                    </SoftPress>
                  )
                })}
              </View>
            </View>
          ) : null}

          {(product.allergens || []).length ? (
            <View style={{ marginTop: 16 }}>
              <Text style={{ fontWeight: '800', marginBottom: 8, textAlign: isRTL ? 'right' : 'left' }}>{t('allergens')}</Text>
              <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', flexWrap: 'wrap', gap: 6 }}>
                {product.allergens.map((a) => (
                  <View
                    key={a}
                    style={{
                      backgroundColor: '#FFF8D6',
                      borderRadius: 999,
                      paddingHorizontal: 10,
                      paddingVertical: 6,
                      borderWidth: 1,
                      borderColor: colors.yellowDark,
                    }}
                  >
                    <Text style={{ fontWeight: '700', fontSize: 12 }}>{allergenLabel(a, lang)}</Text>
                  </View>
                ))}
              </View>
            </View>
          ) : (
            <Text style={{ marginTop: 14, color: colors.muted, fontSize: 12, textAlign: isRTL ? 'right' : 'left' }}>
              {t('noAllergens')}
            </Text>
          )}
        </View>
      </ScrollView>

      {!closed ? (
        <View
          style={{
            position: 'absolute',
            left: 16,
            right: 16,
            bottom: thisStore ? 72 : 16,
            flexDirection: isRTL ? 'row-reverse' : 'row',
            gap: 10,
          }}
        >
          <SoftPress
            onPress={onAdd}
            style={{
              flex: 1,
              backgroundColor: inStock ? colors.red : colors.ink,
              borderRadius: 16,
              paddingVertical: 15,
              alignItems: 'center',
              flexDirection: isRTL ? 'row-reverse' : 'row',
              justifyContent: 'center',
              gap: 8,
              ...shadow.soft,
            }}
          >
            <Plus size={18} color="#fff" strokeWidth={3} />
            <Text style={{ color: '#fff', fontWeight: '800' }}>{inStock ? t('addToCart') : t('addSubstitute')}</Text>
          </SoftPress>
        </View>
      ) : null}

      {thisStore ? (
        <SoftPress
          onPress={() => navigation.navigate('Cart')}
          style={{
            position: 'absolute',
            left: 16,
            right: 16,
            bottom: 16,
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
