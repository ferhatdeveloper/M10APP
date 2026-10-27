/**
 * Talabat Mart sepet klonu — beyaz header, usuals, satırlar, sticky Checkout
 * Accent: kurumsal kırmızı (Pantone 2347 C)
 */
import { ScrollView, Text, View } from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { ChevronLeft, Plus, ShoppingBag } from 'lucide-react-native'
import ProductImage from '../components/ProductImage'
import SoftPress from '../components/SoftPress'
import { useApp } from '../context/AppContext'
import { useI18n } from '../context/I18nContext'
import { formatIQD, linePrice, productName } from '../data/mock'
import { BUY_AGAIN } from '../data/martCatalog'
import { colors, shadow } from '../theme'

const RED = colors.red // app bar rengi

export default function CartScreen({ navigation }) {
  const insets = useSafeAreaInsets()
  const {
    cart,
    cartStore,
    cartTotal,
    setQty,
    getLiveProduct,
    addToCart,
  } = useApp()
  const { t, lang, isRTL } = useI18n()

  const L = {
    cart: lang === 'tr' ? 'Sepet' : lang === 'ar' ? 'السلة' : 'Cart',
    mart: 'M10 mart',
    addItems: lang === 'tr' ? '+ Ürün ekle' : lang === 'ar' ? '+ أضف منتجات' : '+ Add items',
    usuals: lang === 'tr' ? 'Sık aldıkların' : lang === 'ar' ? 'مشترياتك المعتادة' : 'Grab your usuals',
    checkout: lang === 'tr' ? 'Ödemeye geç' : lang === 'ar' ? 'إتمام الطلب' : 'Checkout',
    empty: t('emptyCart'),
    emptyHint: t('emptyCartHint'),
    browse: t('browseStores'),
  }

  if (!cart.length || !cartStore) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }} edges={['top']}>
        <CartHeader navigation={navigation} title={L.cart} sub={L.mart} addLabel={L.addItems} isRTL={isRTL} />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 }}>
          <View
            style={{
              width: 88,
              height: 88,
              borderRadius: 44,
              backgroundColor: colors.redSoft,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ShoppingBag size={36} color={RED} />
          </View>
          <Text style={{ fontWeight: '800', fontSize: 20, marginTop: 16, color: colors.ink }}>{L.empty}</Text>
          <Text style={{ color: colors.muted, marginTop: 8, textAlign: 'center' }}>{L.emptyHint}</Text>
          <SoftPress
            onPress={() => navigation.navigate('Tabs')}
            style={{ marginTop: 22, backgroundColor: RED, borderRadius: 14, paddingHorizontal: 24, paddingVertical: 14 }}
          >
            <Text style={{ color: '#fff', fontWeight: '800' }}>{L.browse}</Text>
          </SoftPress>
        </View>
      </SafeAreaView>
    )
  }

  const belowMin = cartTotal < cartStore.minOrder
  const remainMin = Math.max(0, cartStore.minOrder - cartTotal)
  const storeId = cartStore.id

  const lines = cart
    .map((line) => {
      const product = getLiveProduct(line.storeId, line.productId)
      if (!product) return null
      return { line, product, price: linePrice(line) }
    })
    .filter(Boolean)

  const onAddUsual = (p) => {
    const img = typeof p.image === 'string' ? p.image : p.image?.uri
    const name = p.names?.tr || p.names?.en || p.id
    addToCart(storeId, p.id, 1, {
      unitPrice: p.price,
      product: {
        id: p.id,
        nameTr: name,
        nameEn: p.names?.en || name,
        nameAr: p.names?.ar || name,
        names: p.names,
        price: p.price,
        image: img,
        aisle: 'produce',
        stock: 99,
      },
    })
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }} edges={['top']}>
      <CartHeader
        navigation={navigation}
        title={L.cart}
        sub={L.mart}
        addLabel={L.addItems}
        isRTL={isRTL}
        onAdd={() => navigation.navigate('Store', { id: storeId })}
      />

      <ScrollView contentContainerStyle={{ paddingBottom: 130 + insets.bottom }} showsVerticalScrollIndicator={false}>
        {/* Grab your usuals */}
        <View style={{ paddingTop: 8, paddingBottom: 4 }}>
          <Text
            style={{
              fontSize: 17,
              fontWeight: '800',
              color: colors.ink,
              paddingHorizontal: 16,
              marginBottom: 12,
              textAlign: isRTL ? 'right' : 'left',
            }}
          >
            {L.usuals}
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}>
            {BUY_AGAIN.map((p) => {
              const inCart = cart.find((c) => c.productId === p.id)
              const img = typeof p.image === 'string' ? p.image : p.image
              return (
                <SoftPress key={p.id} onPress={() => onAddUsual(p)} style={{ width: 96 }}>
                  <View
                    style={{
                      width: 96,
                      height: 96,
                      borderRadius: 14,
                      backgroundColor: '#F5F5F5',
                      overflow: 'hidden',
                    }}
                  >
                    <ProductImage uri={typeof img === 'object' ? img.uri : img} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
                    <View
                      style={{
                        position: 'absolute',
                        right: 6,
                        bottom: 6,
                        minWidth: 26,
                        height: 26,
                        borderRadius: 13,
                        backgroundColor: RED,
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingHorizontal: 6,
                      }}
                    >
                      <Text style={{ color: '#fff', fontWeight: '800', fontSize: 12 }}>{inCart ? inCart.qty : '+'}</Text>
                    </View>
                  </View>
                  <Text style={{ marginTop: 6, fontWeight: '800', fontSize: 13, color: colors.ink }}>
                    {formatIQD(p.price, lang)}
                  </Text>
                </SoftPress>
              )
            })}
          </ScrollView>
        </View>

        {/* Cart lines */}
        <View style={{ marginTop: 8 }}>
          {lines.map(({ line, product, price }, idx) => (
            <View
              key={`${line.productId}-${line.variantId || 'b'}`}
              style={{
                flexDirection: isRTL ? 'row-reverse' : 'row',
                alignItems: 'center',
                paddingHorizontal: 16,
                paddingVertical: 14,
                borderTopWidth: idx ? 1 : 0,
                borderTopColor: '#F0F0F0',
                gap: 12,
              }}
            >
              <ProductImage
                uri={product.image}
                aisle={product.aisle}
                style={{ width: 64, height: 64, borderRadius: 10, backgroundColor: '#F7F7F7' }}
                resizeMode="contain"
              />
              <View style={{ flex: 1, alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
                <Text style={{ fontWeight: '700', fontSize: 14, color: colors.ink }} numberOfLines={2}>
                  {productName(product, lang)}
                </Text>
                <Text style={{ fontWeight: '800', fontSize: 14, color: colors.ink, marginTop: 4 }}>
                  {formatIQD(price, lang)}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: isRTL ? 'row-reverse' : 'row',
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: '#E5E5E5',
                  borderRadius: 999,
                  paddingHorizontal: 4,
                  paddingVertical: 4,
                  gap: 2,
                  backgroundColor: '#fff',
                }}
              >
                <SoftPress
                  onPress={() => setQty(product.id, line.qty - 1, line.variantId)}
                  style={{ width: 30, height: 30, alignItems: 'center', justifyContent: 'center' }}
                >
                  <Text style={{ color: RED, fontWeight: '800', fontSize: 18, lineHeight: 20 }}>−</Text>
                </SoftPress>
                <Text style={{ fontWeight: '800', minWidth: 20, textAlign: 'center', color: colors.ink }}>{line.qty}</Text>
                <SoftPress
                  onPress={() => setQty(product.id, line.qty + 1, line.variantId)}
                  style={{ width: 30, height: 30, alignItems: 'center', justifyContent: 'center' }}
                >
                  <Text style={{ color: RED, fontWeight: '800', fontSize: 18, lineHeight: 20 }}>+</Text>
                </SoftPress>
              </View>
            </View>
          ))}
        </View>

      </ScrollView>

      {/* Sticky footer — Talabat style: tutar + kısa "X daha" */}
      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: '#fff',
          paddingHorizontal: 16,
          paddingTop: 10,
          paddingBottom: Math.max(insets.bottom, 12),
          borderTopWidth: 1,
          borderTopColor: '#F0F0F0',
          ...shadow.soft,
        }}
      >
        <SoftPress
          disabled={belowMin || !lines.length}
          onPress={() => navigation.navigate('Checkout')}
          style={{
            backgroundColor: RED,
            opacity: belowMin || !lines.length ? 0.45 : 1,
            borderRadius: 14,
            paddingVertical: 14,
            paddingHorizontal: 16,
            flexDirection: isRTL ? 'row-reverse' : 'row',
            alignItems: 'center',
          }}
        >
          <Text style={{ flex: 1, color: '#fff', fontWeight: '800', fontSize: 16 }}>{L.checkout}</Text>
          <View style={{ alignItems: isRTL ? 'flex-start' : 'flex-end', maxWidth: '42%' }}>
            <Text numberOfLines={1} style={{ color: '#fff', fontWeight: '800', fontSize: 15 }}>
              {formatIQD(cartTotal, lang)}
            </Text>
            {belowMin ? (
              <Text numberOfLines={1} style={{ color: 'rgba(255,255,255,0.88)', fontWeight: '600', fontSize: 10, marginTop: 1 }}>
                {t('addMore', { n: formatIQD(remainMin, lang) })}
              </Text>
            ) : null}
          </View>
        </SoftPress>
      </View>
    </SafeAreaView>
  )
}

function CartHeader({ navigation, title, sub, addLabel, isRTL, onAdd }) {
  return (
    <View
      style={{
        flexDirection: isRTL ? 'row-reverse' : 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        backgroundColor: '#fff',
        gap: 10,
      }}
    >
      <SoftPress
        onPress={() => navigation.goBack()}
        style={{
          width: 36,
          height: 36,
          borderRadius: 18,
          borderWidth: 1,
          borderColor: '#E8E8E8',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ChevronLeft size={20} color={colors.ink} />
      </SoftPress>
      <View style={{ flex: 1, alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
        <Text style={{ fontSize: 20, fontWeight: '800', color: colors.ink }}>{title}</Text>
        <Text style={{ fontSize: 12, fontWeight: '600', color: colors.muted, marginTop: 1 }}>{sub}</Text>
      </View>
      <SoftPress
        onPress={onAdd || (() => navigation.navigate('Tabs'))}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 4,
          borderWidth: 1,
          borderColor: '#E0E0E0',
          borderRadius: 999,
          paddingHorizontal: 12,
          paddingVertical: 8,
        }}
      >
        <Plus size={14} color={colors.ink} strokeWidth={2.5} />
        <Text style={{ fontWeight: '700', fontSize: 13, color: colors.ink }}>{addLabel.replace(/^\+\s*/, '')}</Text>
      </SoftPress>
    </View>
  )
}
