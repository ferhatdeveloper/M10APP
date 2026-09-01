import { useState } from 'react'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Gift, ShoppingBag, Truck, Percent, Package } from 'lucide-react-native'
import TopBar from '../components/TopBar'
import { useApp } from '../context/AppContext'
import { useI18n } from '../context/I18nContext'
import { rewards } from '../data/mock'
import { colors, radius } from '../theme'

const TYPE_META = {
  discount: { key: 'rewardTypeDiscount', Icon: Percent, bg: colors.redSoft, fg: colors.red },
  freeDelivery: { key: 'rewardTypeFreeDelivery', Icon: Truck, bg: colors.openBg, fg: colors.open },
  freeItem: { key: 'rewardTypeFreeItem', Icon: Package, bg: '#FFF8D6', fg: '#9A7B00' },
}

export default function RewardsScreen({ navigation }) {
  const { user, redeemReward } = useApp()
  const { t, isRTL, lang } = useI18n()
  const [done, setDone] = useState(null)

  const titleOf = (r) => (lang === 'en' ? r.titleEn || r.title : lang === 'tr' ? r.titleTr || r.title : r.title)
  const descOf = (r) => (lang === 'en' ? r.descEn || r.desc : lang === 'tr' ? r.descTr || r.desc : r.desc)

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={[]}>
      <TopBar title={t('rewards')} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 28 }}>
        <View
          style={{
            backgroundColor: colors.card,
            borderRadius: radius,
            padding: 18,
            borderLeftWidth: 3,
            borderLeftColor: colors.yellow,
            borderWidth: 1,
            borderColor: colors.line,
            overflow: 'hidden',
          }}
        >
          <View
            style={{
              position: 'absolute',
              right: isRTL ? undefined : -20,
              left: isRTL ? -20 : undefined,
              top: -20,
              width: 90,
              height: 90,
              borderRadius: 45,
              backgroundColor: colors.yellow,
              opacity: 0.35,
            }}
          />
          <Text style={{ color: colors.muted, fontWeight: '700', textAlign: isRTL ? 'right' : 'left' }}>{t('balance')}</Text>
          <Text style={{ color: colors.ink, fontSize: 34, fontWeight: '800', marginTop: 4, textAlign: isRTL ? 'right' : 'left' }}>
            {user.points} <Text style={{ fontSize: 16, color: colors.red }}>{t('points')}</Text>
          </Text>
        </View>

        {done ? (
          <View
            style={{
              backgroundColor: colors.openBg,
              borderRadius: radius,
              padding: 14,
              borderWidth: 1,
              borderColor: '#C8EBD5',
              gap: 12,
            }}
          >
            <Text style={{ color: colors.open, fontWeight: '800', textAlign: isRTL ? 'right' : 'left' }}>
              {t('redeemed')}: {titleOf(done)}
            </Text>
            <Text style={{ color: colors.open, fontWeight: '600', textAlign: isRTL ? 'right' : 'left' }}>{t('nextOrder')}</Text>
            <Pressable
              onPress={() => navigation.navigate('Cart')}
              style={{
                backgroundColor: colors.red,
                borderRadius: 12,
                padding: 12,
                flexDirection: isRTL ? 'row-reverse' : 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              <ShoppingBag size={16} color="#fff" />
              <Text style={{ color: '#fff', fontWeight: '800' }}>{t('goToCart')}</Text>
            </Pressable>
          </View>
        ) : null}

        <Text style={{ fontWeight: '800', marginTop: 4, textAlign: isRTL ? 'right' : 'left' }}>{t('available')}</Text>

        {rewards.map((r) => {
          const enough = user.points >= r.cost
          const meta = TYPE_META[r.type] || TYPE_META.discount
          const TypeIcon = meta.Icon
          return (
            <View
              key={r.id}
              style={{
                backgroundColor: colors.card,
                borderRadius: radius,
                padding: 14,
                borderWidth: 1,
                borderColor: colors.line,
              }}
            >
              <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', gap: 12 }}>
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 14,
                    backgroundColor: colors.redSoft,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Gift size={20} color={colors.red} />
                </View>
                <View style={{ flex: 1, alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
                  <View
                    style={{
                      flexDirection: isRTL ? 'row-reverse' : 'row',
                      alignItems: 'center',
                      gap: 6,
                      marginBottom: 6,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: isRTL ? 'row-reverse' : 'row',
                        alignItems: 'center',
                        gap: 4,
                        backgroundColor: meta.bg,
                        borderRadius: 8,
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                      }}
                    >
                      <TypeIcon size={12} color={meta.fg} />
                      <Text style={{ fontSize: 11, fontWeight: '800', color: meta.fg }}>{t(meta.key)}</Text>
                    </View>
                  </View>
                  <Text style={{ fontWeight: '800', color: colors.ink, textAlign: isRTL ? 'right' : 'left' }}>{titleOf(r)}</Text>
                  <Text style={{ color: colors.muted, marginTop: 4, textAlign: isRTL ? 'right' : 'left' }}>{descOf(r)}</Text>
                  <Text style={{ color: colors.red, fontWeight: '800', marginTop: 8 }}>
                    {r.cost} {t('points')}
                  </Text>
                </View>
              </View>
              <Pressable
                disabled={!enough}
                onPress={() => {
                  redeemReward(r)
                  setDone(r)
                }}
                style={{
                  marginTop: 14,
                  backgroundColor: colors.red,
                  opacity: enough ? 1 : 0.45,
                  borderRadius: 12,
                  padding: 12,
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: '#fff', fontWeight: '800' }}>{enough ? t('redeem') : t('notEnough')}</Text>
              </Pressable>
            </View>
          )
        })}
      </ScrollView>
    </SafeAreaView>
  )
}
