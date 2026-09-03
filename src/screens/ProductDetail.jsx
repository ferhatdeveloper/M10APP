import { useMemo, useState } from 'react'
import { Alert, ScrollView, Text, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Bell, Plus, ShoppingBag, Camera, Check, Star as StarIcon } from 'lucide-react-native'
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
  const {
    addToCart,
    cartCount,
    cartStore,
    cartTotal,
    getLiveProduct,
    getLiveStore,
    getLiveProducts,
    storeOverrides,
    isOnStockAlert,
    toggleStockAlert,
    addReview,
  } = useApp()
  const product = getLiveProduct(storeId, productId)
  const store = getLiveStore(storeId)
  const oKey = `${storeId}:${productId}`
  const liveStock = storeOverrides?.[oKey]?.stock != null ? storeOverrides[oKey].stock : product?.stock
  const outOfStock = !product || (liveStock ?? 0) <= 0 || product?.disabled === true
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
  const productOverrideKey = product ? `${storeId}:${product.id}` : null
  const productStock = product
    ? storeOverrides?.[productOverrideKey]?.stock != null
      ? storeOverrides[productOverrideKey].stock
      : product.stock
    : 0
  const inStock = productStock > 0
  const sub = !inStock && product ? getSubstitute(storeId, product) : null
  const subOverrideKey = sub ? `${storeId}:${sub.id}` : null
  const subStock = sub
    ? storeOverrides?.[subOverrideKey]?.stock != null
      ? storeOverrides[subOverrideKey].stock
      : sub.stock
    : 0
  const subInStock = !!sub && subStock > 0
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
      if (sub && subInStock) {
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
      <ScrollView contentContainerStyle={{ paddingBottom: thisStore ? 180 : 130 }}>
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

        <ProductReviews
          productId={productId}
          lang={lang}
          isRTL={isRTL}
          t={t}
          addReview={addReview}
        />

        <SimilarProducts
          storeId={storeId}
          productId={productId}
          aisle={product?.aisle}
          getLiveProducts={getLiveProducts}
          navigation={navigation}
        />

        {outOfStock ? (
          <SoftPress
            onPress={() => {
              const willOn = !isOnStockAlert(storeId, productId)
              toggleStockAlert(storeId, productId)
              Alert.alert(
                willOn ? t('notifyMe') : t('notifyMeOn'),
                t('notifyMeThanks'),
              )
            }}
            style={{
              flexDirection: isRTL ? 'row-reverse' : 'row',
              alignItems: 'center',
              gap: 10,
              backgroundColor: isOnStockAlert(storeId, productId) ? colors.ink : colors.card,
              borderRadius: 14,
              padding: 14,
              marginTop: 14,
              borderWidth: 1,
              borderColor: isOnStockAlert(storeId, productId) ? colors.ink : colors.line,
            }}
          >
            <Bell size={18} color={isOnStockAlert(storeId, productId) ? colors.yellow : colors.ink} />
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontWeight: '900',
                  color: isOnStockAlert(storeId, productId) ? '#fff' : colors.ink,
                }}
              >
                {isOnStockAlert(storeId, productId) ? t('notifyMeOn') : t('notifyMe')}
              </Text>
              <Text
                style={{
                  fontSize: 11,
                  color: isOnStockAlert(storeId, productId) ? 'rgba(255,255,255,0.7)' : colors.muted,
                  marginTop: 2,
                }}
              >
                {t('notifyMeThanks')}
              </Text>
            </View>
            {isOnStockAlert(storeId, productId) ? <Check size={18} color={colors.yellow} /> : null}
          </SoftPress>
        ) : null}
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

function SimilarProducts({ storeId, productId, aisle, getLiveProducts, navigation }) {
  const { t, lang, isRTL } = useI18n()
  const list = useMemo(() => {
    if (!storeId || !aisle) return []
    const all = getLiveProducts(storeId)
    // Priority: same aisle, different product. Exclude current, disabled, out of stock.
    const sameAisle = all.filter(
      (p) =>
        p.id !== productId &&
        p.aisle === aisle &&
        !p.disabled &&
        (p.stock ?? 0) > 0,
    )
    if (sameAisle.length >= 6) return sameAisle.slice(0, 8)
    // Fallback: same brand
    const me = all.find((p) => p.id === productId)
    const sameBrand = me?.brand
      ? all.filter(
          (p) =>
            p.id !== productId &&
            p.brand === me.brand &&
            !p.disabled &&
            (p.stock ?? 0) > 0 &&
            !sameAisle.find((x) => x.id === p.id),
        )
      : []
    return [...sameAisle, ...sameBrand].slice(0, 8)
  }, [storeId, productId, aisle, getLiveProducts])

  if (!list.length) return null

  return (
    <View style={{ marginTop: 22 }}>
      <Text
        style={{
          fontWeight: '800',
          fontSize: 16,
          marginBottom: 10,
          paddingHorizontal: 0,
          textAlign: isRTL ? 'right' : 'left',
        }}
      >
        {t('similarProducts')}
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          gap: 10,
          paddingVertical: 2,
          flexDirection: isRTL ? 'row-reverse' : 'row',
        }}
      >
        {list.map((p) => (
          <SoftPress
            key={p.id}
            onPress={() => navigation.push('Product', { storeId, productId: p.id })}
            style={{
              width: 140,
              backgroundColor: '#fff',
              borderRadius: 14,
              padding: 10,
              ...shadow.soft,
            }}
          >
            <ProductImage
              uri={p.image}
              aisle={p.aisle}
              style={{ width: 120, height: 100, borderRadius: 10 }}
            />
            <Text
              numberOfLines={2}
              style={{ fontWeight: '800', fontSize: 12, marginTop: 6, minHeight: 32 }}
            >
              {productName(p, lang)}
            </Text>
            <Text
              style={{
                color: colors.red,
                fontWeight: '900',
                fontSize: 13,
                marginTop: 4,
              }}
            >
              {formatIQD(p.price, lang)}
            </Text>
          </SoftPress>
        ))}
      </ScrollView>
    </View>
  )
}

function ProductReviews({ productId, lang, isRTL, t, addReview }) {
  const { getProductReviews, user } = useApp()
  const reviews = getProductReviews(productId)
  const [showForm, setShowForm] = useState(false)
  const [rating, setRating] = useState(5)
  const [text, setText] = useState('')
  const total = reviews.length
  const avg = total
    ? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / total) * 10) / 10
    : 0
  const submit = () => {
    if (!text.trim()) return
    const ok = addReview(productId, { rating, text, userName: user?.name })
    if (ok) {
      setText('')
      setRating(5)
      setShowForm(false)
    }
  }
  return (
    <View style={{ marginTop: 16 }}>
      <View
        style={{
          flexDirection: isRTL ? 'row-reverse' : 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 10,
        }}
      >
        <Text style={{ fontWeight: '900', fontSize: 16, color: colors.ink }}>
          {t('reviews')} {total > 0 ? `(${total})` : ''}
        </Text>
        <SoftPress
          onPress={() => setShowForm((v) => !v)}
          style={{
            flexDirection: isRTL ? 'row-reverse' : 'row',
            alignItems: 'center',
            gap: 6,
            paddingHorizontal: 10,
            paddingVertical: 6,
            borderRadius: 999,
            backgroundColor: colors.redSoft,
          }}
        >
          <StarIcon size={14} color={colors.red} fill={colors.red} />
          <Text style={{ fontWeight: '800', color: colors.red, fontSize: 12 }}>
            {t('writeReview')}
          </Text>
        </SoftPress>
      </View>
      {total > 0 ? (
        <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 6, marginBottom: 10 }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <StarIcon
              key={i}
              size={18}
              color={i <= Math.round(avg) ? colors.yellow : colors.line}
              fill={i <= Math.round(avg) ? colors.yellow : 'none'}
            />
          ))}
          <Text style={{ fontWeight: '800', color: colors.ink }}>{avg.toFixed(1)}</Text>
        </View>
      ) : null}

      {showForm ? (
        <View
          style={{
            backgroundColor: '#fff',
            borderRadius: 14,
            padding: 12,
            marginBottom: 10,
            borderWidth: 1,
            borderColor: colors.line,
          }}
        >
          <Text
            style={{
              fontWeight: '800',
              marginBottom: 6,
              textAlign: isRTL ? 'right' : 'left',
            }}
          >
            {t('rateProduct')}
          </Text>
          <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', gap: 6, marginBottom: 8 }}>
            {[1, 2, 3, 4, 5].map((i) => (
              <SoftPress key={i} onPress={() => setRating(i)}>
                <StarIcon
                  size={28}
                  color={i <= rating ? colors.yellow : colors.line}
                  fill={i <= rating ? colors.yellow : 'none'}
                />
              </SoftPress>
            ))}
          </View>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder={t('addReview')}
            placeholderTextColor={colors.muted}
            multiline
            style={{
              borderWidth: 1,
              borderColor: colors.line,
              borderRadius: 10,
              padding: 10,
              minHeight: 70,
              textAlign: isRTL ? 'right' : 'left',
              textAlignVertical: 'top',
              color: colors.ink,
            }}
          />
          <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', gap: 8, marginTop: 8 }}>
            <SoftPress
              onPress={submit}
              style={{
                flex: 1,
                paddingVertical: 10,
                backgroundColor: colors.red,
                borderRadius: 10,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: '#fff', fontWeight: '900' }}>{t('addReview')}</Text>
            </SoftPress>
            <SoftPress
              onPress={() => setShowForm(false)}
              style={{
                paddingVertical: 10,
                paddingHorizontal: 16,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: colors.line,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: colors.ink, fontWeight: '800' }}>{t('cancel')}</Text>
            </SoftPress>
          </View>
        </View>
      ) : null}

      {reviews.length === 0 ? (
        <Text style={{ color: colors.muted, textAlign: 'center', paddingVertical: 8 }}>
          —
        </Text>
      ) : (
        reviews.slice(0, 4).map((r, i) => (
          <View
            key={i}
            style={{
              backgroundColor: '#fff',
              borderRadius: 14,
              padding: 12,
              marginBottom: 8,
              borderWidth: 1,
              borderColor: colors.line,
            }}
          >
            <View
              style={{
                flexDirection: isRTL ? 'row-reverse' : 'row',
                alignItems: 'center',
                gap: 8,
                marginBottom: 4,
              }}
            >
              <Text style={{ fontWeight: '900' }}>{r.user}</Text>
              <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', gap: 2 }}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <StarIcon
                    key={s}
                    size={12}
                    color={s <= r.rating ? colors.yellow : colors.line}
                    fill={s <= r.rating ? colors.yellow : 'none'}
                  />
                ))}
              </View>
            </View>
            <Text style={{ color: colors.muted, fontSize: 12, lineHeight: 18 }}>
              {r.textAr || r.textEn || r.textTr}
            </Text>
          </View>
        ))
      )}
    </View>
  )
}
