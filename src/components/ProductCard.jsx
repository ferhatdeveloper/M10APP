import { Alert, Text, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Camera, Plus, RefreshCw } from 'lucide-react-native'
import { useApp } from '../context/AppContext'
import { useI18n } from '../context/I18nContext'
import { canTryInRoom, formatIQD, formatUnitPrice, getSubstitute, isInStock, productDesc, productName } from '../data/mock'
import ProductImage from './ProductImage'
import SoftPress from './SoftPress'
import { colors, shadow } from '../theme'

export default function ProductCard({ product, storeId, disabled, compact }) {
  const navigation = useNavigation()
  const { cart, addToCart, setQty, storeOverrides } = useApp()
  const { t, lang, isRTL } = useI18n()
  const item =
    cart.find((i) => i.storeId === storeId && i.productId === product.id && !i.variantId) ||
    cart.find((i) => i.storeId === storeId && i.productId === product.id)
  const qty = item?.qty || 0
  const overrideKey = `${storeId}:${product.id}`
  const effective = {
    ...product,
    stock: storeOverrides?.[overrideKey]?.stock != null ? storeOverrides[overrideKey].stock : product.stock,
  }
  const inStock = isInStock(effective)
  const sub = !inStock ? getSubstitute(storeId, product) : null
  const subOverrideKey = sub ? `${storeId}:${sub.id}` : null
  const subStock = sub
    ? storeOverrides?.[subOverrideKey]?.stock != null
      ? storeOverrides[subOverrideKey].stock
      : sub.stock
    : 0
  const canSub = !!(sub && subStock > 0)
  const unitLine = formatUnitPrice(product, lang)

  const openDetail = () => navigation.navigate('Product', { storeId, productId: product.id })

  const onAdd = () => {
    if (!inStock) {
      if (canSub) {
        Alert.alert(t('outOfStock'), t('suggestSubstitute', { name: productName(sub, lang) }), [
          { text: t('cancel'), style: 'cancel' },
          { text: t('addSubstitute'), onPress: () => addToCart(storeId, sub.id) },
        ])
      } else {
        Alert.alert(t('outOfStock'), t('noSubstitute'))
      }
      return
    }
    addToCart(storeId, product.id)
  }

  const cardW = compact ? 150 : '48%'
  const imgH = compact ? 110 : 152
  const bodyMinH = compact ? 108 : 118
  const addBtn = compact ? 28 : 32
  const qtyBtn = compact ? 24 : 26

  return (
    <View
      style={{
        width: cardW,
        backgroundColor: '#fff',
        borderRadius: 18,
        overflow: 'hidden',
        marginBottom: compact ? 0 : 12,
        borderWidth: 1,
        borderColor: colors.line,
        opacity: inStock ? 1 : 0.92,
        ...shadow.soft,
      }}
    >
      <View>
        <SoftPress onPress={openDetail}>
          <ProductImage
            uri={product.image}
            aisle={product.aisle}
            style={{ width: '100%', height: imgH, backgroundColor: '#F3F3F3', opacity: inStock ? 1 : 0.55 }}
          />
          {!inStock ? (
            <View
              style={{
                position: 'absolute',
                top: 8,
                left: isRTL ? undefined : 8,
                right: isRTL ? 8 : undefined,
                backgroundColor: colors.ink,
                borderRadius: 999,
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderWidth: 1.5,
                borderColor: colors.yellow,
              }}
            >
              <Text style={{ color: '#fff', fontSize: 10, fontWeight: '800' }}>{t('outOfStock')}</Text>
            </View>
          ) : product.oldPrice ? (
            <View
              style={{
                position: 'absolute',
                top: 8,
                left: isRTL ? undefined : 8,
                right: isRTL ? 8 : undefined,
                backgroundColor: colors.yellow,
                borderRadius: 999,
                paddingHorizontal: 9,
                paddingVertical: 4,
              }}
            >
              <Text style={{ color: colors.ink, fontSize: 10, fontWeight: '900' }}>{t('cats.offers')}</Text>
            </View>
          ) : null}
        </SoftPress>
        {canTryInRoom(product) ? (
          <SoftPress
            onPress={() => navigation.navigate('TryInRoom', { storeId, productId: product.id })}
            accessibilityLabel={t('tryInRoomCta')}
            style={{
              position: 'absolute',
              bottom: 8,
              right: isRTL ? undefined : 8,
              left: isRTL ? 8 : undefined,
              backgroundColor: 'rgba(22,22,22,0.82)',
              borderRadius: 999,
              paddingHorizontal: compact ? 8 : 10,
              paddingVertical: compact ? 5 : 6,
              flexDirection: isRTL ? 'row-reverse' : 'row',
              alignItems: 'center',
              gap: 4,
              zIndex: 2,
            }}
          >
            <Camera size={compact ? 11 : 12} color={colors.yellow} strokeWidth={2.5} />
            <Text style={{ color: '#fff', fontSize: compact ? 9 : 10, fontWeight: '800' }}>{t('tryInRoomPlace')}</Text>
          </SoftPress>
        ) : null}
      </View>
      <View style={{ padding: compact ? 8 : 10, paddingTop: 8, minHeight: bodyMinH, justifyContent: 'space-between' }}>
        <SoftPress onPress={openDetail}>
          {product.oldPrice ? (
            <Text style={{ color: colors.red, fontWeight: '800', fontSize: 10, marginBottom: 2 }}>{t('cats.offers')}</Text>
          ) : product.popular ? (
            <Text style={{ color: colors.muted, fontWeight: '700', fontSize: 10, marginBottom: 2 }}>{t('popular')}</Text>
          ) : null}
          <Text style={{ fontWeight: '800', fontSize: compact ? 12 : 13, lineHeight: 17, color: colors.ink }} numberOfLines={2}>
            {productName(product, lang)}
          </Text>
          {!compact ? (
            <Text style={{ color: colors.muted, fontSize: 11, marginTop: 2 }} numberOfLines={1}>
              {product.brand ? `${product.brand} · ` : ''}
              {productDesc(product, lang)}
            </Text>
          ) : null}
          {product.basePrice != null && product.basePrice !== product.price ? (
            <Text style={{ color: colors.red, fontSize: 10, fontWeight: '800', marginTop: 3 }}>{t('storePrice')}</Text>
          ) : null}
        </SoftPress>
        <View
          style={{
            marginTop: 8,
            flexDirection: isRTL ? 'row-reverse' : 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 4,
          }}
        >
          <View style={{ flex: 1 }}>
            <Text style={{ color: colors.red, fontWeight: '800', fontSize: compact ? 12 : 13 }}>{formatIQD(product.price, lang)}</Text>
            {unitLine ? (
              <Text style={{ color: colors.muted, fontSize: 10 }} numberOfLines={1}>
                {unitLine}
              </Text>
            ) : product.oldPrice ? (
              <Text style={{ color: colors.muted, fontSize: 11, textDecorationLine: 'line-through' }}>
                {formatIQD(product.oldPrice, lang)}
              </Text>
            ) : null}
          </View>
          {disabled ? null : qty === 0 ? (
            <SoftPress
              onPress={onAdd}
              accessibilityLabel={t('add')}
              style={{
                width: addBtn,
                height: addBtn,
                borderRadius: addBtn / 2,
                backgroundColor: inStock ? colors.red : colors.ink,
                alignItems: 'center',
                justifyContent: 'center',
                ...shadow.soft,
              }}
            >
              <Plus size={compact ? 14 : 16} color="#fff" strokeWidth={3} />
            </SoftPress>
          ) : (
            <View
              style={{
                flexDirection: isRTL ? 'row-reverse' : 'row',
                alignItems: 'center',
                backgroundColor: colors.redSoft,
                borderRadius: 999,
                padding: 2,
                gap: 2,
              }}
            >
              <SoftPress
                onPress={() => setQty(product.id, qty - 1, item?.variantId)}
                style={{
                  width: qtyBtn,
                  height: qtyBtn,
                  borderRadius: qtyBtn / 2,
                  backgroundColor: '#fff',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ color: colors.red, fontWeight: '900' }}>−</Text>
              </SoftPress>
              <Text style={{ fontWeight: '800', color: colors.red, minWidth: 14, textAlign: 'center', fontSize: compact ? 12 : 14 }}>
                {qty}
              </Text>
              <SoftPress
                onPress={() => setQty(product.id, qty + 1, item?.variantId)}
                style={{
                  width: qtyBtn,
                  height: qtyBtn,
                  borderRadius: qtyBtn / 2,
                  backgroundColor: '#fff',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ color: colors.red, fontWeight: '900' }}>+</Text>
              </SoftPress>
            </View>
          )}
        </View>
        {!inStock && canSub && !disabled ? (
          <SoftPress
            onPress={() => addToCart(storeId, sub.id)}
            style={{
              marginTop: 8,
              flexDirection: isRTL ? 'row-reverse' : 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              backgroundColor: '#FFF8D6',
              borderRadius: 10,
              paddingVertical: compact ? 6 : 7,
              paddingHorizontal: 8,
              borderWidth: 1,
              borderColor: colors.yellowDark,
            }}
          >
            <RefreshCw size={12} color={colors.ink} strokeWidth={2.5} />
            <Text style={{ fontWeight: '800', fontSize: 11, color: colors.ink }} numberOfLines={1}>
              {t('addSubstitute')}
            </Text>
          </SoftPress>
        ) : null}
      </View>
    </View>
  )
}
