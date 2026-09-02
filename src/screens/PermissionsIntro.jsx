import { useEffect, useState } from 'react'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Bell, Camera, MapPin, Wifi } from 'lucide-react-native'
import Logo from '../components/Logo'
import { useI18n } from '../context/I18nContext'
import { requestPushPermission, pushSupported } from '../utils/push'
import { colors, radius } from '../theme'

function PermissionRow({ Icon, title, hint, status, onPress, isRTL, ctaLabel }) {
  return (
    <View
      style={{
        backgroundColor: '#fff',
        borderRadius: 16,
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
          width: 44,
          height: 44,
          borderRadius: 12,
          backgroundColor: status === 'granted' ? colors.openBg : colors.redSoft,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon size={20} color={status === 'granted' ? colors.open : colors.red} />
      </View>
      <View style={{ flex: 1, alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
        <Text style={{ fontWeight: '800' }}>{title}</Text>
        <Text style={{ color: colors.muted, fontSize: 12, marginTop: 2 }}>{hint}</Text>
        {status ? (
          <Text
            style={{
              marginTop: 4,
              fontSize: 11,
              fontWeight: '800',
              color: status === 'granted' ? colors.open : colors.busy || '#B86A00',
            }}
          >
            {status === 'granted' ? '✓' : status === 'denied' ? '×' : '…'}
          </Text>
        ) : null}
      </View>
      {onPress ? (
        <Pressable
          onPress={onPress}
          style={{
            backgroundColor: status === 'granted' ? colors.bg : colors.red,
            borderRadius: 12,
            paddingHorizontal: 14,
            paddingVertical: 10,
          }}
        >
          <Text style={{ color: status === 'granted' ? colors.ink : '#fff', fontWeight: '800', fontSize: 12 }}>
            {ctaLabel}
          </Text>
        </Pressable>
      ) : null}
    </View>
  )
}

export default function PermissionsIntroScreen({ navigation }) {
  const { t, isRTL } = useI18n()
  const [notifStatus, setNotifStatus] = useState(null) // null | 'granted' | 'denied'
  const [done, setDone] = useState(false)

  useEffect(() => {
    // Auto-request notifications once on mount (best-effort)
    ;(async () => {
      if (!pushSupported()) return
      const r = await requestPushPermission()
      setNotifStatus(r.granted ? 'granted' : r.status === 'denied' ? 'denied' : null)
    })()
  }, [])

  const askNotifications = async () => {
    const r = await requestPushPermission()
    setNotifStatus(r.granted ? 'granted' : r.status === 'denied' ? 'denied' : null)
  }

  const continueTo = () => {
    setDone(true)
    navigation.replace('Tabs')
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.red }} edges={[]}>
      <ScrollView
        contentContainerStyle={{ padding: 24, paddingBottom: 40, gap: 14 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ alignItems: 'center', marginVertical: 18 }}>
          <Logo size={88} onBrand />
          <Text
            style={{
              color: '#fff',
              fontSize: 32,
              fontWeight: '900',
              marginTop: 14,
              fontStyle: 'italic',
            }}
          >
            M10
          </Text>
          <Text style={{ color: colors.yellow, fontWeight: '800', marginTop: 6 }}>
            {t('tagline')}
          </Text>
        </View>

        <Text
          style={{
            color: '#fff',
            fontWeight: '800',
            fontSize: 22,
            textAlign: isRTL ? 'right' : 'left',
          }}
        >
          {t('permissionsWelcomeTitle')}
        </Text>
        <Text
          style={{
            color: 'rgba(255,255,255,0.85)',
            textAlign: isRTL ? 'right' : 'left',
            marginBottom: 6,
          }}
        >
          {t('permissionsWelcomeHint')}
        </Text>

        <PermissionRow
          Icon={Bell}
          title={t('permissionTitle')}
          hint={notifStatus === 'granted' ? t('permissionGranted') : t('permissionBody')}
          status={notifStatus}
          onPress={notifStatus !== 'granted' ? askNotifications : null}
          ctaLabel={t('permissionAsk')}
          isRTL={isRTL}
        />
        <PermissionRow
          Icon={Camera}
          title={t('permCameraTitle')}
          hint={t('permCameraHint')}
          status={null}
          isRTL={isRTL}
        />
        <PermissionRow
          Icon={MapPin}
          title={t('permLocationTitle')}
          hint={t('permLocationHint')}
          status={null}
          isRTL={isRTL}
        />
        <PermissionRow
          Icon={Wifi}
          title={t('permNetworkTitle')}
          hint={t('permNetworkHint')}
          status={null}
          isRTL={isRTL}
        />

        <Pressable
          onPress={continueTo}
          disabled={done}
          style={{
            backgroundColor: done ? '#888' : colors.yellow,
            borderRadius: radius,
            padding: 16,
            alignItems: 'center',
            marginTop: 12,
          }}
        >
          <Text style={{ color: colors.ink, fontWeight: '900', fontSize: 16 }}>
            {t('continueToApp')}
          </Text>
        </Pressable>
        <Pressable onPress={continueTo} style={{ padding: 10, alignItems: 'center' }}>
          <Text style={{ color: 'rgba(255,255,255,0.85)', fontWeight: '700' }}>
            {t('permissionLater')}
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  )
}