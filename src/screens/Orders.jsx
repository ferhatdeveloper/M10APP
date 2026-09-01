import { Alert, Image, ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ShoppingBag } from 'lucide-react-native'
import TopBar from '../components/TopBar'
import SoftPress from '../components/SoftPress'
import { useApp } from '../context/AppContext'
import { useI18n } from '../context/I18nContext'
import { canCancelOrder, formatIQD, getStore, storeName } from '../data/mock'
import { src } from '../utils/images'
import { colors, shadow } from '../theme'

export function orderStep(createdAt, now = Date.now(), status) {
  if (status === 'cancelled') return -1
  if (status === 'delivered') return 3
  if (status === 'onway') return 2
  if (status === 'preparing') return 1
  if (status === 'confirmed') return 0
  const age = (now - createdAt) / 1000
  if (age < 20) return 0
  if (age < 50) return 1
  if (age < 90) return 2
  return 3
}

const STEP_KEYS = ['confirmed', 'preparing', 'onway', 'delivered']

function statusTone(step, cancelled) {
  if (cancelled) return { bg: '#F1F1F1', fg: '#666' }
  if (step >= 3) return { bg: colors.openBg, fg: colors.open }
  if (step === 2) return { bg: colors.redSoft, fg: colors.red }
  if (step === 1) return { bg: colors.busyBg, fg: colors.busy }
  return { bg: '#FFF8D6', fg: colors.ink }
}

export default function OrdersScreen({ navigation }) {
  const { orders, reorder, cancelOrder } = useApp()
  const { t, lang, isRTL } = useI18n()
  const list = [...orders].sort((a, b) => b.createdAt - a.createdAt)
  const now = Date.now()

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={[]}>
      <TopBar title={t('myOrders')} />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {list.length === 0 ? (
          <View style={{ alignItems: 'center', paddingVertical: 56, paddingHorizontal: 28 }}>
            <View
              style={{
                width: 88,
                height: 88,
                borderRadius: 44,
                backgroundColor: colors.redSoft,
                alignItems: 'center',
                justifyContent: 'center',
                ...shadow.soft,
              }}
            >
              <ShoppingBag size={34} color={colors.red} />
            </View>
            <Text style={{ fontWeight: '800', fontSize: 20, marginTop: 18, color: colors.ink }}>{t('noOrders')}</Text>
            <Text style={{ color: colors.muted, marginTop: 6, textAlign: 'center', lineHeight: 20 }}>{t('noOrdersHint')}</Text>
            <SoftPress
              onPress={() => navigation.navigate('HomeTab')}
              style={{
                marginTop: 20,
                backgroundColor: colors.red,
                borderRadius: 14,
                paddingHorizontal: 20,
                paddingVertical: 13,
              }}
            >
              <Text style={{ color: '#fff', fontWeight: '800' }}>{t('startOrder')}</Text>
            </SoftPress>
          </View>
        ) : (
          list.map((order) => {
            const store = getStore(order.storeId)
            const step = orderStep(order.createdAt, now, order.status)
            const cancelled = order.status === 'cancelled'
            const statusLabel = cancelled ? t('cancelled') : t(STEP_KEYS[Math.max(0, step)])
            const tone = statusTone(step, cancelled)
            const itemCount = (order.items || []).reduce((s, i) => s + (i.qty || 0), 0)
            const etaMin = Math.max(0, 12 - Math.floor((now - order.createdAt) / 60000))
            const showCancel = canCancelOrder(order)
            const showReorder = !cancelled
            const showRate = !cancelled && step >= 3
            const showReturn = !cancelled && step >= 3 && !order.returnId

            return (
              <View
                key={order.id}
                style={{
                  backgroundColor: '#fff',
                  borderRadius: 18,
                  padding: 14,
                  marginBottom: 12,
                  borderWidth: 1,
                  borderColor: cancelled ? colors.line : colors.line,
                  opacity: cancelled ? 0.92 : 1,
                  ...shadow.soft,
                }}
              >
                <SoftPress onPress={() => navigation.navigate('Track', { id: order.id })}>
                  <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', gap: 10, flex: 1, paddingRight: isRTL ? 0 : 8, paddingLeft: isRTL ? 8 : 0 }}>
                      {store?.cover ? (
                        <Image source={src(store.cover)} style={{ width: 52, height: 52, borderRadius: 14 }} />
                      ) : null}
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontWeight: '800', fontSize: 15 }}>{storeName(store, lang) || t('butlerTitle')}</Text>
                        <Text style={{ color: colors.muted, fontSize: 12, marginTop: 2 }}>
                          {new Date(order.createdAt).toLocaleString(lang === 'en' ? 'en-US' : lang === 'tr' ? 'tr-TR' : 'ar-IQ')}
                        </Text>
                        <Text style={{ color: colors.muted, fontSize: 12, marginTop: 4, fontWeight: '600' }}>
                          {t('itemsCount', { n: itemCount || (order.items || []).length || 0 })}
                          {!cancelled && step < 3
                            ? ` · ${order.slot ? `${t('schedule')} ${order.slot}` : t('etaRemaining', { n: etaMin || store?.eta || '10-20' })}`
                            : ''}
                        </Text>
                      </View>
                    </View>
                    <View style={{ backgroundColor: tone.bg, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 5 }}>
                      <Text style={{ color: tone.fg, fontWeight: '800', fontSize: 11 }}>{statusLabel}</Text>
                    </View>
                  </View>
                  <Text style={{ color: colors.red, fontWeight: '800', marginTop: 10, fontSize: 15 }}>{formatIQD(order.total, lang)}</Text>
                </SoftPress>

                {showReorder || showCancel || showRate || showReturn || order.returnId ? (
                  <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
                    {showReorder ? (
                      <SoftPress
                        onPress={() => {
                          const ok = reorder(order)
                          if (ok) navigation.navigate('Cart')
                          else Alert.alert(t('reorder'), t('reorderFail'))
                        }}
                        style={{
                          flex: 1,
                          minWidth: '30%',
                          backgroundColor: colors.red,
                          borderRadius: 12,
                          paddingVertical: 11,
                          alignItems: 'center',
                        }}
                      >
                        <Text style={{ color: '#fff', fontWeight: '800' }}>{t('reorder')}</Text>
                      </SoftPress>
                    ) : null}
                    {showRate ? (
                      <SoftPress
                        onPress={() => navigation.navigate('RateOrder', { id: order.id })}
                        style={{
                          flex: 1,
                          minWidth: '30%',
                          backgroundColor: order.rating ? colors.bg : '#FFF8D6',
                          borderWidth: 1.5,
                          borderColor: order.rating ? colors.line : colors.yellowDark,
                          borderRadius: 12,
                          paddingVertical: 11,
                          alignItems: 'center',
                        }}
                      >
                        <Text style={{ fontWeight: '800', color: colors.ink }}>
                          {order.rating ? t('viewRating') : t('rateOrder')}
                        </Text>
                      </SoftPress>
                    ) : null}
                    {showReturn ? (
                      <SoftPress
                        onPress={() => navigation.navigate('ReturnRequest', { id: order.id })}
                        style={{
                          flex: 1,
                          minWidth: '30%',
                          borderWidth: 1.5,
                          borderColor: colors.line,
                          borderRadius: 12,
                          paddingVertical: 11,
                          alignItems: 'center',
                          backgroundColor: '#fff',
                        }}
                      >
                        <Text style={{ fontWeight: '800', color: colors.ink }}>{t('reportIssue')}</Text>
                      </SoftPress>
                    ) : null}
                    {order.returnId ? (
                      <View
                        style={{
                          flex: 1,
                          minWidth: '30%',
                          backgroundColor: colors.openBg,
                          borderRadius: 12,
                          paddingVertical: 11,
                          alignItems: 'center',
                        }}
                      >
                        <Text style={{ fontWeight: '800', color: colors.open }}>{t('returnPending')}</Text>
                      </View>
                    ) : null}
                    {showCancel ? (
                      <SoftPress
                        onPress={() =>
                          Alert.alert(t('cancelOrder'), t('cancelOrderConfirm'), [
                            { text: t('cancel'), style: 'cancel' },
                            { text: t('confirmCancel'), style: 'destructive', onPress: () => cancelOrder(order.id) },
                          ])
                        }
                        style={{
                          flex: 1,
                          minWidth: '30%',
                          borderWidth: 1.5,
                          borderColor: colors.line,
                          borderRadius: 12,
                          paddingVertical: 11,
                          alignItems: 'center',
                          backgroundColor: '#fff',
                        }}
                      >
                        <Text style={{ fontWeight: '800', color: colors.ink }}>{t('cancelOrder')}</Text>
                      </SoftPress>
                    ) : null}
                  </View>
                ) : null}
              </View>
            )
          })
        )}
      </ScrollView>
    </SafeAreaView>
  )
}
