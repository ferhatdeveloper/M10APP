import { useEffect, useState } from 'react'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Bike, MapPin, Phone } from 'lucide-react-native'
import TopBar from '../components/TopBar'
import { useApp } from '../context/AppContext'
import { useI18n } from '../context/I18nContext'
import { BUTLER_STEPS, butlerStep, formatIQD } from '../data/mock'
import { colors } from '../theme'

export default function ButlerTrackScreen({ navigation, route }) {
  const id = route.params?.id
  const { butlerJobs } = useApp()
  const { t, lang, isRTL } = useI18n()
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 2000)
    return () => clearInterval(timer)
  }, [])

  const job = butlerJobs.find((j) => j.id === id) || butlerJobs[0]
  if (!job) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={[]}>
        <TopBar title={t('butlerTrack')} onBack={() => navigation.goBack()} />
        <View style={{ padding: 32, alignItems: 'center' }}>
          <Text style={{ fontWeight: '800' }}>{t('notFound')}</Text>
          <Pressable
            onPress={() => navigation.navigate('ButlerTab')}
            style={{ marginTop: 16, backgroundColor: colors.red, borderRadius: 14, paddingHorizontal: 18, paddingVertical: 12 }}
          >
            <Text style={{ color: '#fff', fontWeight: '800' }}>{t('requestButler')}</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    )
  }

  const step = butlerStep(job.createdAt, now, job.status)
  const progress = Math.min(1, (Math.max(0, step) + 0.25) / 3)
  const eta = Math.max(0, 18 - Math.floor((now - job.createdAt) / 60000))

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={[]}>
      <TopBar title={t('butlerTrack')} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 28 }}>
        <View
          style={{
            height: 200,
            borderRadius: 18,
            backgroundColor: colors.ink,
            overflow: 'hidden',
            padding: 16,
          }}
        >
          <View
            style={{
              position: 'absolute',
              left: 24,
              right: 24,
              top: '52%',
              height: 4,
              borderRadius: 2,
              backgroundColor: 'rgba(255,255,255,0.2)',
            }}
          >
            <View style={{ height: 4, width: `${progress * 100}%`, backgroundColor: colors.yellow, borderRadius: 2 }} />
          </View>
          <View
            style={{
              position: 'absolute',
              left: `${10 + progress * 70}%`,
              top: '38%',
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: colors.red,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 2,
              borderColor: colors.yellow,
            }}
          >
            <Bike size={20} color="#fff" />
          </View>
          <Text style={{ color: colors.yellow, fontWeight: '900', fontSize: 12 }}>LIVE · DEMO</Text>
          <Text style={{ color: '#fff', fontWeight: '800', fontSize: 20, marginTop: 6 }}>
            {step >= 3 ? t('butlerDone') : t('etaRemaining', { n: eta || 8 })}
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.75)', marginTop: 4 }}>{job.id}</Text>
        </View>

        <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 14 }}>
          {BUTLER_STEPS.map((key, i) => {
            const on = step >= i
            const active = step === i
            return (
              <View
                key={key}
                style={{
                  flexDirection: isRTL ? 'row-reverse' : 'row',
                  alignItems: 'center',
                  gap: 10,
                  paddingVertical: 10,
                  opacity: on ? 1 : 0.45,
                }}
              >
                <View
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 14,
                    backgroundColor: on ? colors.red : colors.bg,
                    borderWidth: 2,
                    borderColor: active ? colors.yellow : on ? colors.red : colors.line,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text style={{ color: on ? '#fff' : colors.muted, fontWeight: '800', fontSize: 12 }}>{i + 1}</Text>
                </View>
                <Text style={{ fontWeight: active ? '800' : '700', color: colors.ink, flex: 1, textAlign: isRTL ? 'right' : 'left' }}>
                  {t(key)}
                </Text>
              </View>
            )
          })}
        </View>

        <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 14, gap: 10 }}>
          <Text style={{ fontWeight: '800', textAlign: isRTL ? 'right' : 'left' }}>{job.need}</Text>
          <Row icon={MapPin} label={t('pickup')} value={job.pickup} isRTL={isRTL} />
          <Row icon={MapPin} label={t('dropoff')} value={job.dropoff} isRTL={isRTL} />
          <Text style={{ color: colors.muted, textAlign: isRTL ? 'right' : 'left' }}>
            {job.captain} · {formatIQD(job.fee || 3500, lang)}
          </Text>
          <Pressable
            onPress={() => {}}
            style={{
              marginTop: 4,
              borderWidth: 1.5,
              borderColor: colors.line,
              borderRadius: 12,
              padding: 12,
              flexDirection: isRTL ? 'row-reverse' : 'row',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            <Phone size={16} color={colors.red} />
            <Text style={{ fontWeight: '800', color: colors.red }}>{t('call')}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

function Row({ icon: Icon, label, value, isRTL }) {
  return (
    <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', gap: 8, alignItems: 'flex-start' }}>
      <Icon size={16} color={colors.red} style={{ marginTop: 2 }} />
      <View style={{ flex: 1, alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
        <Text style={{ color: colors.muted, fontSize: 12 }}>{label}</Text>
        <Text style={{ fontWeight: '700', marginTop: 2 }}>{value}</Text>
      </View>
    </View>
  )
}
