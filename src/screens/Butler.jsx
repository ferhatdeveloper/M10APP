import { useState } from 'react'
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Bike } from 'lucide-react-native'
import TopBar from '../components/TopBar'
import { useApp } from '../context/AppContext'
import { useI18n } from '../context/I18nContext'
import { colors } from '../theme'

export default function ButlerScreen({ navigation }) {
  const { user, requestButler, butlerJobs } = useApp()
  const { t, isRTL } = useI18n()
  const [need, setNeed] = useState('')
  const [pickup, setPickup] = useState('')
  const [dropoff, setDropoff] = useState(`${user.address.area}، ${user.address.details}`)
  const [when, setWhen] = useState('now')

  const active = butlerJobs.filter((j) => j.status !== 'done' && j.status !== 'cancelled')

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={[]}>
      <TopBar title={t('butler')} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
        <View
          style={{
            backgroundColor: colors.card,
            borderRadius: 16,
            padding: 16,
            borderLeftWidth: 3,
            borderLeftColor: colors.red,
          }}
        >
          <Text style={{ color: colors.ink, fontSize: 22, fontWeight: '800' }}>{t('butlerTitle')}</Text>
          <Text style={{ color: colors.muted, marginTop: 8 }}>{t('butlerHint')}</Text>
        </View>

        {active.length ? (
          <View style={{ gap: 8 }}>
            <Text style={{ fontWeight: '800' }}>{t('activeButler')}</Text>
            {active.slice(0, 3).map((j) => (
              <Pressable
                key={j.id}
                onPress={() => navigation.navigate('ButlerTrack', { id: j.id })}
                style={{
                  backgroundColor: colors.ink,
                  borderRadius: 14,
                  padding: 14,
                  flexDirection: isRTL ? 'row-reverse' : 'row',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <Bike size={18} color={colors.yellow} />
                <View style={{ flex: 1 }}>
                  <Text style={{ color: '#fff', fontWeight: '800' }}>{j.id}</Text>
                  <Text style={{ color: 'rgba(255,255,255,0.7)', marginTop: 2 }} numberOfLines={1}>
                    {j.need}
                  </Text>
                </View>
                <Text style={{ color: colors.yellow, fontWeight: '800' }}>{t('track')}</Text>
              </Pressable>
            ))}
          </View>
        ) : null}

        <Text style={{ fontWeight: '800' }}>{t('whatNeed')}</Text>
        <TextInput
          value={need}
          onChangeText={setNeed}
          multiline
          placeholder={t('whatNeed')}
          style={{
            backgroundColor: '#fff',
            borderRadius: 12,
            minHeight: 90,
            padding: 12,
            textAlign: isRTL ? 'right' : 'left',
          }}
        />
        <Text style={{ fontWeight: '800' }}>{t('pickup')}</Text>
        <TextInput
          value={pickup}
          onChangeText={setPickup}
          style={{ backgroundColor: '#fff', borderRadius: 12, minHeight: 46, padding: 12, textAlign: isRTL ? 'right' : 'left' }}
        />
        <Text style={{ fontWeight: '800' }}>{t('dropoff')}</Text>
        <TextInput
          value={dropoff}
          onChangeText={setDropoff}
          style={{ backgroundColor: '#fff', borderRadius: 12, minHeight: 46, padding: 12, textAlign: isRTL ? 'right' : 'left' }}
        />
        {[
          { id: 'now', k: 'now' },
          { id: 'hour', k: 'hour' },
          { id: 'evening', k: 'evening' },
        ].map((w) => (
          <Pressable
            key={w.id}
            onPress={() => setWhen(w.id)}
            style={{
              backgroundColor: when === w.id ? colors.redSoft : '#fff',
              borderWidth: 1,
              borderColor: when === w.id ? colors.red : colors.line,
              borderRadius: 14,
              padding: 12,
            }}
          >
            <Text style={{ fontWeight: '800' }}>{t(w.k)}</Text>
          </Pressable>
        ))}
        <Pressable
          onPress={() => {
            if (!need.trim() || !pickup.trim()) return
            const job = requestButler({ need: need.trim(), pickup: pickup.trim(), dropoff, when })
            navigation.navigate('ButlerTrack', { id: job.id })
          }}
          style={{ backgroundColor: colors.red, borderRadius: 14, padding: 14, alignItems: 'center' }}
        >
          <Text style={{ color: '#fff', fontWeight: '800' }}>{t('requestButler')}</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  )
}
