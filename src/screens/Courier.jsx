import { useMemo } from 'react'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Bike, CheckCircle2, Package, LogOut } from 'lucide-react-native'
import TopBar from '../components/TopBar'
import DeliveryMap from '../components/DeliveryMap'
import { useApp } from '../context/AppContext'
import { useI18n } from '../context/I18nContext'
import {
  coordsForAddress,
  coordsForStore,
  formatIQD,
  getProduct,
  getStore,
  productName,
  storeName,
} from '../data/mock'
import { orderStep } from './Orders'
import { colors } from '../theme'

export default function CourierScreen({ navigation }) {
  const { orders, courierUpdateOrder, butlerJobs, setUserRole, isLoggedIn, logout } = useApp()
  const { t, lang, isRTL } = useI18n()
  const now = Date.now()

  const assigned = [...orders]
    .filter((o) => o.status !== 'cancelled')
    .sort((a, b) => b.createdAt - a.createdAt)
    .filter((o) => {
      const step = orderStep(o.createdAt, now, o.status)
      return step < 3 || o.status === 'onway' || o.status === 'preparing' || o.status === 'confirmed'
    })
    .slice(0, 10)

  const activeButler = butlerJobs.filter((j) => j.status !== 'done' && j.status !== 'cancelled').slice(0, 5)
  const focus = assigned[0]
  const dest = useMemo(() => (focus ? coordsForAddress(focus.address) : null), [focus])
  const storePos = useMemo(() => (focus ? coordsForStore(getStore(focus.storeId)) : null), [focus])

  const switchToCustomer = () => {
    setUserRole('customer')
    navigation.reset({ index: 0, routes: [{ name: 'Tabs' }] })
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={[]}>
      <TopBar title={t('courierTitle')} />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 32 }}>
        <View
          style={{
            backgroundColor: colors.red,
            borderRadius: 16,
            padding: 16,
            flexDirection: isRTL ? 'row-reverse' : 'row',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <Bike size={28} color={colors.yellow} />
          <View style={{ flex: 1, alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
            <Text style={{ color: '#fff', fontWeight: '800', fontSize: 18 }}>{t('courierHero')}</Text>
            <Text style={{ color: 'rgba(255,255,255,0.8)', marginTop: 4 }}>{t('courierHint')}</Text>
          </View>
        </View>

        {focus && dest ? (
          <DeliveryMap
            destination={dest}
            courier={storePos}
            showCourier={false}
            height={220}
            isRTL={isRTL}
            title={t('courierDest')}
            subtitle={`${focus.address?.area || ''} — ${focus.address?.details || ''}`}
          />
        ) : null}

        <Text style={{ fontWeight: '800', textAlign: isRTL ? 'right' : 'left' }}>{t('assignedOrders')}</Text>
        {assigned.length === 0 ? (
          <View style={{ backgroundColor: '#fff', borderRadius: 14, padding: 20, alignItems: 'center' }}>
            <Package size={28} color={colors.muted} />
            <Text style={{ color: colors.muted, marginTop: 8, fontWeight: '700' }}>{t('noAssigned')}</Text>
          </View>
        ) : (
          assigned.map((o) => {
            const store = getStore(o.storeId)
            const step = orderStep(o.createdAt, now, o.status)
            const pin = coordsForAddress(o.address)
            return (
              <View key={o.id} style={{ backgroundColor: '#fff', borderRadius: 16, padding: 14, gap: 8 }}>
                <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', justifyContent: 'space-between' }}>
                  <Text style={{ fontWeight: '800' }}>{o.id}</Text>
                  <Text style={{ color: colors.red, fontWeight: '800' }}>{formatIQD(o.total, lang)}</Text>
                </View>
                <Text style={{ color: colors.muted, textAlign: isRTL ? 'right' : 'left' }}>
                  {storeName(store, lang)} · {o.address?.area}
                </Text>
                <Text style={{ color: colors.muted, fontSize: 12, textAlign: isRTL ? 'right' : 'left' }}>
                  {t('courierDestCoords', { lat: pin.lat.toFixed(4), lng: pin.lng.toFixed(4) })}
                </Text>
                {(o.items || []).slice(0, 4).map((item) => {
                  const p = getProduct(item.storeId || o.storeId, item.productId)
                  return (
                    <Text
                      key={`${o.id}-${item.productId}`}
                      style={{ fontWeight: '600', textAlign: isRTL ? 'right' : 'left', fontSize: 13 }}
                    >
                      {item.qty}× {productName(p, lang) || item.productId}
                    </Text>
                  )
                })}
                <Text style={{ fontWeight: '700', textAlign: isRTL ? 'right' : 'left' }}>
                  {t(step >= 3 ? 'delivered' : ['confirmed', 'preparing', 'onway', 'delivered'][Math.max(0, step)])}
                </Text>
                <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', gap: 8, marginTop: 4 }}>
                  {step < 2 ? (
                    <Action label={t('markPicked')} onPress={() => courierUpdateOrder(o.id, 'onway')} primary />
                  ) : null}
                  {step < 3 ? (
                    <Action
                      label={t('markDelivered')}
                      onPress={() => courierUpdateOrder(o.id, 'delivered')}
                      primary={step >= 2}
                    />
                  ) : (
                    <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 6 }}>
                      <CheckCircle2 size={18} color={colors.open} />
                      <Text style={{ color: colors.open, fontWeight: '800' }}>{t('delivered')}</Text>
                    </View>
                  )}
                </View>
              </View>
            )
          })
        )}

        {activeButler.length ? (
          <>
            <Text style={{ fontWeight: '800', marginTop: 8, textAlign: isRTL ? 'right' : 'left' }}>
              {t('butlerJobs')}
            </Text>
            {activeButler.map((j) => (
              <Pressable
                key={j.id}
                onPress={() => navigation.navigate('ButlerTrack', { id: j.id })}
                style={{ backgroundColor: '#fff', borderRadius: 14, padding: 14 }}
              >
                <Text style={{ fontWeight: '800' }}>{j.id}</Text>
                <Text style={{ color: colors.muted, marginTop: 4 }}>{j.need}</Text>
              </Pressable>
            ))}
          </>
        ) : null}

        <Pressable
          onPress={switchToCustomer}
          style={{
            borderWidth: 1,
            borderColor: colors.line,
            borderRadius: 14,
            padding: 14,
            alignItems: 'center',
            backgroundColor: '#fff',
          }}
        >
          <Text style={{ fontWeight: '800', color: colors.ink }}>{t('switchToCustomer')}</Text>
        </Pressable>

        {isLoggedIn ? (
          <Pressable
            onPress={logout}
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 8,
              padding: 12,
            }}
          >
            <LogOut size={16} color={colors.red} />
            <Text style={{ color: colors.red, fontWeight: '800' }}>{t('logout')}</Text>
          </Pressable>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  )
}

function Action({ label, onPress, primary }) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        flex: 1,
        backgroundColor: primary ? colors.red : colors.bg,
        borderRadius: 12,
        paddingVertical: 11,
        alignItems: 'center',
        borderWidth: primary ? 0 : 1,
        borderColor: colors.line,
      }}
    >
      <Text style={{ fontWeight: '800', color: primary ? '#fff' : colors.ink }}>{label}</Text>
    </Pressable>
  )
}
