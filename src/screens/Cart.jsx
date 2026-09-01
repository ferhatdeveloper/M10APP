import { ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ShoppingBag, Store as StoreIcon, Ticket, Trash2, X } from 'lucide-react-native'
import TopBar from '../components/TopBar'
import ProductImage from '../components/ProductImage'
import SoftPress from '../components/SoftPress'
import { useApp } from '../context/AppContext'
import { useI18n } from '../context/I18nContext'
import { formatIQD, FREE_DELIVERY_FROM, linePrice, productName, storeName, variantLabel } from '../data/mock'
import { colors, radius, shadow } from '../theme'

export default function CartScreen({ navigation }) {
  const {
    cart,
    cartStore,
    cartTotal,
    cartFee,
    cartDiscount,
    cartPayable,
    coupon,
    setQty,
    clearCart,
    clearCoupon,
    plusActive,
    getLiveProduct,
  } = useApp()
  const { t, lang, isRTL } = useI18n()

  if (!cart.length || !cartStore) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={[]}>
        <TopBar title={t('cart')} onBack={() => navigation.goBack()} />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 }}>
          <View
            style={{
              width: 104,
              height: 104,
              borderRadius: 52,
              backgroundColor: colors.redSoft,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 8,
              ...shadow.soft,
            }}
          >
            <ShoppingBag size={42} color={colors.red} />
          </View>
          <Text style={{ fontWeight: '800', fontSize: 22, marginTop: 16, color: colors.ink, textAlign: 'center' }}>
            {t('emptyCart')}
          </Text>
          <Text style={{ color: colors.muted, marginTop: 8, textAlign: 'center', lineHeight: 20, paddingHorizontal: 12 }}>
            {t('emptyCartHint')}
          </Text>
          <SoftPress
            onPress={() => navigation.navigate('Tabs')}
            style={{
              marginTop: 24,
              backgroundColor: colors.red,
              borderRadius: 16,
              paddingHorizontal: 24,
              paddingVertical: 15,
              minWidth: 210,
              alignItems: 'center',
              ...shadow.soft,
            }}
          >
            <Text style={{ color: '#fff', fontWeight: '800' }}>{t('browseStores')}</Text>
          </SoftPress>
        </View>
      </SafeAreaView>
    )
  }

  const belowMin = cartTotal < cartStore.minOrder
  const threshold = cartStore.freeDeliveryFrom ?? FREE_DELIVERY_FROM
  const needForFree = !plusActive && cartFee > 0 && threshold > 0 ? Math.max(0, threshold - cartTotal) : 0
  const progress = plusActive || threshold <= 0 ? 1 : Math.min(1, cartTotal / threshold)
  const couponTitle =
    lang === 'en' ? coupon?.titleEn || coupon?.title : lang === 'tr' ? coupon?.titleTr || coupon?.title : coupon?.title

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={[]}>
      <TopBar title={t('cart')} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 28 }}>
        {plusActive ? (
          <View
            style={{
              backgroundColor: colors.ink,
              borderRadius: radius,
              padding: 12,
              flexDirection: isRTL ? 'row-reverse' : 'row',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <View style={{ backgroundColor: colors.yellow, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 }}>
              <Text style={{ fontWeight: '900', color: colors.ink, fontSize: 12 }}>M10+</Text>
            </View>
            <Text style={{ color: '#fff', fontWeight: '700', flex: 1, textAlign: isRTL ? 'right' : 'left' }}>
              {t('plusCartFree')}
            </Text>
          </View>
        ) : null}
        <SoftPress
          onPress={() => navigation.navigate('Store', { id: cartStore.id })}
          style={{
            backgroundColor: colors.card,
            borderRadius: radius,
            padding: 14,
            flexDirection: isRTL ? 'row-reverse' : 'row',
            alignItems: 'center',
            gap: 12,
            borderWidth: 1,
            borderColor: colors.line,
          }}
        >
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              backgroundColor: colors.redSoft,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <StoreIcon size={18} color={colors.red} />
          </View>
          <View style={{ flex: 1, alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
            <Text style={{ fontWeight: '800', color: colors.ink }}>{storeName(cartStore, lang)}</Text>
            <Text style={{ color: colors.muted, marginTop: 2 }}>
              {cartStore.eta} {t('min')}
            </Text>
          </View>
        </SoftPress>

        {cart.map((line) => {
          const product = getLiveProduct(line.storeId, line.productId)
          if (!product) return null
          const price = linePrice(line)
          const variant = (product.variants || []).find((v) => v.id === line.variantId)
          return (
            <View
              key={`${line.productId}-${line.variantId || 'base'}`}
              style={{
                backgroundColor: colors.card,
                borderRadius: radius,
                padding: 12,
                flexDirection: isRTL ? 'row-reverse' : 'row',
                gap: 10,
                borderWidth: 1,
                borderColor: colors.line,
                ...shadow.soft,
              }}
            >
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: '800', color: colors.ink }}>{productName(product, lang)}</Text>
                {variant ? (
                  <Text style={{ color: colors.muted, fontSize: 12, marginTop: 2 }}>{variantLabel(variant, lang)}</Text>
                ) : null}
                <Text style={{ color: colors.red, fontWeight: '800', marginTop: 6 }}>
                  {formatIQD(price * line.qty, lang)}
                </Text>
                <View
                  style={{
                    flexDirection: isRTL ? 'row-reverse' : 'row',
                    alignItems: 'center',
                    gap: 10,
                    marginTop: 10,
                    alignSelf: isRTL ? 'flex-end' : 'flex-start',
                    backgroundColor: colors.bg,
                    borderRadius: 12,
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                  }}
                >
                  <SoftPress
                    onPress={() => setQty(product.id, line.qty - 1, line.variantId)}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      backgroundColor: colors.card,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderWidth: 1,
                      borderColor: colors.line,
                    }}
                  >
                    <Text style={{ fontSize: 18, color: colors.red, fontWeight: '700', lineHeight: 22 }}>−</Text>
                  </SoftPress>
                  <Text style={{ fontWeight: '800', minWidth: 18, textAlign: 'center' }}>{line.qty}</Text>
                  <SoftPress
                    onPress={() => setQty(product.id, line.qty + 1, line.variantId)}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      backgroundColor: colors.red,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Text style={{ fontSize: 18, color: '#fff', fontWeight: '700', lineHeight: 22 }}>+</Text>
                  </SoftPress>
                </View>
              </View>
              <ProductImage uri={product.image} aisle={product.aisle} style={{ width: 86, height: 86, borderRadius: 12 }} />
            </View>
          )
        })}

        {threshold > 0 && !plusActive && (needForFree > 0 || cartFee === 0) ? (
          <View
            style={{
              backgroundColor: cartFee === 0 ? colors.openBg : '#FFFCE8',
              borderRadius: radius,
              padding: 14,
              borderWidth: 1,
              borderColor: cartFee === 0 ? '#C8EBD5' : '#F5E9A0',
            }}
          >
            <View
              style={{
                flexDirection: isRTL ? 'row-reverse' : 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 10,
              }}
            >
              <Text style={{ fontWeight: '800', color: cartFee === 0 ? colors.open : colors.ink, flex: 1 }}>
                {cartFee === 0 ? t('freeDeliveryActive') : t('freeDeliveryHint', { n: formatIQD(needForFree, lang) })}
              </Text>
              <Text style={{ fontWeight: '800', color: cartFee === 0 ? colors.open : colors.muted, fontSize: 12 }}>
                {Math.round(progress * 100)}%
              </Text>
            </View>
            <View style={{ height: 8, borderRadius: 99, backgroundColor: 'rgba(0,0,0,0.08)', overflow: 'hidden' }}>
              <View
                style={{
                  height: '100%',
                  width: `${Math.max(8, progress * 100)}%`,
                  borderRadius: 99,
                  backgroundColor: cartFee === 0 ? colors.open : colors.yellow,
                  alignSelf: isRTL ? 'flex-end' : 'flex-start',
                }}
              />
            </View>
            <Text style={{ color: colors.muted, fontSize: 12, marginTop: 8, fontWeight: '600' }}>
              {t('freeDelivery')} · {formatIQD(threshold, lang)}
            </Text>
          </View>
        ) : null}

        {coupon ? (
          <View
            style={{
              backgroundColor: colors.redSoft,
              borderRadius: 14,
              paddingVertical: 10,
              paddingHorizontal: 12,
              flexDirection: isRTL ? 'row-reverse' : 'row',
              alignItems: 'center',
              gap: 10,
              borderWidth: 1,
              borderColor: '#F5C4C7',
            }}
          >
            <View
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                backgroundColor: '#fff',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ticket size={16} color={colors.red} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 11, fontWeight: '700', color: colors.muted }}>{t('couponApplied')}</Text>
              <Text style={{ fontWeight: '800', color: colors.red }} numberOfLines={1}>
                {couponTitle}
              </Text>
            </View>
            <SoftPress
              onPress={clearCoupon}
              hitSlop={8}
              style={{
                width: 32,
                height: 32,
                borderRadius: 10,
                backgroundColor: '#fff',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <X size={16} color={colors.ink} />
            </SoftPress>
          </View>
        ) : (
          <SoftPress
            onPress={() => navigation.navigate('Rewards')}
            style={{
              backgroundColor: colors.card,
              borderRadius: 14,
              padding: 14,
              borderWidth: 1,
              borderColor: colors.line,
              borderStyle: 'dashed',
              flexDirection: isRTL ? 'row-reverse' : 'row',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <Ticket size={18} color={colors.red} />
            <Text style={{ fontWeight: '800', color: colors.red }}>{t('applyReward')}</Text>
          </SoftPress>
        )}

        <View
          style={{
            backgroundColor: colors.card,
            borderRadius: radius,
            padding: 14,
            borderWidth: 1,
            borderColor: colors.line,
            borderLeftWidth: 3,
            borderLeftColor: colors.red,
          }}
        >
          <Text style={{ fontWeight: '800', marginBottom: 4, textAlign: isRTL ? 'right' : 'left' }}>{t('orderSummary')}</Text>
          <Row label={t('subtotal')} value={formatIQD(cartTotal, lang)} isRTL={isRTL} />
          {cartDiscount > 0 ? (
            <Row label={t('discount')} value={`−${formatIQD(cartDiscount, lang)}`} isRTL={isRTL} valueColor={colors.open} />
          ) : null}
          <Row
            label={t('deliveryFee')}
            value={cartFee === 0 ? t('free') : formatIQD(cartFee, lang)}
            isRTL={isRTL}
            valueColor={cartFee === 0 ? colors.open : colors.ink}
          />
          <View style={{ height: 1, backgroundColor: colors.line, marginVertical: 10 }} />
          <Row label={t('total')} value={formatIQD(cartPayable, lang)} isRTL={isRTL} bold />
        </View>

        {belowMin ? (
          <Text
            style={{
              backgroundColor: colors.busyBg,
              color: colors.busy,
              padding: 12,
              borderRadius: 14,
              fontWeight: '700',
              textAlign: isRTL ? 'right' : 'left',
            }}
          >
            {t('minOrder')} {formatIQD(cartStore.minOrder, lang)}. {t('addMore', { n: formatIQD(cartStore.minOrder - cartTotal, lang) })}
          </Text>
        ) : null}

        <SoftPress
          disabled={belowMin}
          onPress={() => navigation.navigate('Checkout')}
          style={{
            backgroundColor: colors.red,
            opacity: belowMin ? 0.5 : 1,
            borderRadius: 16,
            padding: 16,
            alignItems: 'center',
            ...shadow.soft,
          }}
        >
          <Text style={{ color: '#fff', fontWeight: '800', fontSize: 15 }}>
            {t('checkoutCta')} · {formatIQD(cartPayable, lang)}
          </Text>
        </SoftPress>

        <SoftPress
          onPress={clearCart}
          style={{
            borderWidth: 1,
            borderColor: colors.line,
            backgroundColor: colors.card,
            borderRadius: 14,
            padding: 14,
            alignItems: 'center',
            flexDirection: isRTL ? 'row-reverse' : 'row',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          <Trash2 size={16} color={colors.ink} />
          <Text style={{ fontWeight: '800' }}>{t('clearCart')}</Text>
        </SoftPress>
      </ScrollView>
    </SafeAreaView>
  )
}

function Row({ label, value, isRTL, bold, valueColor }) {
  return (
    <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', justifyContent: 'space-between', marginTop: 8 }}>
      <Text style={{ fontWeight: bold ? '800' : '600', color: bold ? colors.ink : colors.muted }}>{label}</Text>
      <Text style={{ fontWeight: bold ? '800' : '700', color: valueColor || (bold ? colors.red : colors.ink) }}>{value}</Text>
    </View>
  )
}
