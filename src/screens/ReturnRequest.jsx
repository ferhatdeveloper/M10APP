import { useMemo, useState } from 'react'
import { Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Check, PackageX } from 'lucide-react-native'
import TopBar from '../components/TopBar'
import { useApp } from '../context/AppContext'
import { useI18n } from '../context/I18nContext'
import { formatIQD, getProduct, productName } from '../data/mock'
import { colors } from '../theme'

export default function ReturnRequestScreen({ navigation, route }) {
  const orderId = route.params?.id
  const { orders, submitReturn } = useApp()
  const { t, lang, isRTL } = useI18n()
  const order = orders.find((o) => o.id === orderId)
  const [type, setType] = useState('missing')
  const [selected, setSelected] = useState({})
  const [reason, setReason] = useState('')
  const [done, setDone] = useState(null)

  const items = useMemo(() => order?.items || [], [order])

  if (!order) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={[]}>
        <TopBar title={t('returnTitle')} onBack={() => navigation.goBack()} />
        <View style={{ padding: 32, alignItems: 'center' }}>
          <Text style={{ fontWeight: '800' }}>{t('notFound')}</Text>
        </View>
      </SafeAreaView>
    )
  }

  if (done) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={[]}>
        <TopBar title={t('returnTitle')} onBack={() => navigation.goBack()} />
        <View style={{ padding: 24, alignItems: 'center' }}>
          <PackageX size={40} color={colors.red} />
          <Text style={{ fontWeight: '800', fontSize: 20, marginTop: 12 }}>{t('returnSubmitted')}</Text>
          <Text style={{ color: colors.muted, marginTop: 8, textAlign: 'center' }}>
            {t('returnId', { id: done.id })}
          </Text>
          <Text style={{ color: colors.open, fontWeight: '700', marginTop: 8 }}>
            {t('returnRefundHint', { n: formatIQD(done.refundHint || 0, lang) })}
          </Text>
          <Pressable
            onPress={() => navigation.navigate('OrdersTab')}
            style={{ marginTop: 20, backgroundColor: colors.red, borderRadius: 14, paddingHorizontal: 18, paddingVertical: 12 }}
          >
            <Text style={{ color: '#fff', fontWeight: '800' }}>{t('myOrders')}</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    )
  }

  const toggle = (productId) => setSelected((s) => ({ ...s, [productId]: !s[productId] }))
  const picked = Object.keys(selected).filter((k) => selected[k])

  const submit = () => {
    if (!picked.length) {
      Alert.alert(t('returnTitle'), t('returnPickItems'))
      return
    }
    const req = submitReturn({ orderId, itemIds: picked, reason, type })
    if (req) setDone(req)
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={[]}>
      <TopBar title={t('returnTitle')} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 32 }}>
        <Text style={{ color: colors.muted, textAlign: isRTL ? 'right' : 'left' }}>
          {t('returnHint')} · {orderId}
        </Text>

        <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', gap: 8 }}>
          {[
            { id: 'missing', label: t('reportMissing') },
            { id: 'return', label: t('reportReturn') },
          ].map((opt) => {
            const on = type === opt.id
            return (
              <Pressable
                key={opt.id}
                onPress={() => setType(opt.id)}
                style={{
                  flex: 1,
                  backgroundColor: on ? colors.redSoft : '#fff',
                  borderWidth: 1.5,
                  borderColor: on ? colors.red : colors.line,
                  borderRadius: 12,
                  padding: 12,
                  alignItems: 'center',
                }}
              >
                <Text style={{ fontWeight: '800', color: on ? colors.red : colors.ink }}>{opt.label}</Text>
              </Pressable>
            )
          })}
        </View>

        {items.map((line) => {
          const p = getProduct(line.storeId, line.productId)
          if (!p) return null
          const on = !!selected[line.productId]
          return (
            <Pressable
              key={`${line.productId}-${line.variantId || ''}`}
              onPress={() => toggle(line.productId)}
              style={{
                backgroundColor: on ? colors.redSoft : '#fff',
                borderRadius: 14,
                padding: 14,
                borderWidth: 1.5,
                borderColor: on ? colors.red : colors.line,
                flexDirection: isRTL ? 'row-reverse' : 'row',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <View
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 6,
                  borderWidth: 2,
                  borderColor: on ? colors.red : colors.line,
                  backgroundColor: on ? colors.red : 'transparent',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {on ? <Check size={12} color="#fff" strokeWidth={3} /> : null}
              </View>
              <View style={{ flex: 1, alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
                <Text style={{ fontWeight: '800' }}>
                  {line.qty}× {productName(p, lang)}
                </Text>
              </View>
            </Pressable>
          )
        })}

        <TextInput
          value={reason}
          onChangeText={setReason}
          placeholder={t('returnReasonHint')}
          multiline
          style={{
            backgroundColor: '#fff',
            borderRadius: 14,
            minHeight: 90,
            padding: 14,
            textAlign: isRTL ? 'right' : 'left',
            textAlignVertical: 'top',
            borderWidth: 1,
            borderColor: colors.line,
          }}
        />

        <Pressable
          onPress={submit}
          style={{ backgroundColor: colors.red, borderRadius: 14, padding: 15, alignItems: 'center' }}
        >
          <Text style={{ color: '#fff', fontWeight: '800' }}>{t('submitReturn')}</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  )
}
