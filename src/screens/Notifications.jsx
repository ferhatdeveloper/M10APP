import { useEffect, useState } from 'react'
import { Alert, Pressable, ScrollView, Switch, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Bell, Megaphone } from 'lucide-react-native'
import TopBar from '../components/TopBar'
import { useApp } from '../context/AppContext'
import { useI18n } from '../context/I18nContext'
import { notifBody, notifTitle } from '../data/mock'
import { getPushPermission, pushSupported, requestPushPermission, scheduleLocalDemo } from '../utils/push'
import { colors } from '../theme'

const timeAgo = (ts, t) => {
  const m = Math.max(1, Math.round((Date.now() - ts) / 60000))
  if (m < 60) return t('minsAgo', { n: m })
  const h = Math.round(m / 60)
  if (h < 48) return t('hoursAgo', { n: h })
  return t('daysAgo', { n: Math.round(h / 24) })
}

export default function NotificationsScreen({ navigation }) {
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    unreadCount,
    user,
    setPushEnabled,
    pushNotification,
  } = useApp()
  const { t, lang, isRTL } = useI18n()
  const [osStatus, setOsStatus] = useState('undetermined')
  const supported = pushSupported()

  useEffect(() => {
    getPushPermission().then((p) => setOsStatus(p.status))
  }, [])

  const open = (item) => {
    markNotificationRead(item.id)
    if (item.storyId === 's-aktuel') {
      navigation.navigate('Flyer', { id: 'week' })
      return
    }
    if (item.storyId) {
      navigation.navigate('Story', { id: item.storyId })
      return
    }
    if (item.cta?.screen) {
      navigation.navigate(item.cta.screen, item.cta.params)
    }
  }

  const togglePush = async (on) => {
    if (on) {
      const perm = await requestPushPermission()
      setOsStatus(perm.status)
      if (!perm.granted && supported) {
        Alert.alert(t('pushTitle'), t('pushDenied'))
        setPushEnabled(false)
        return
      }
      if (!supported) {
        Alert.alert(t('pushTitle'), t('pushWebHint'))
      }
      setPushEnabled(true)
      return
    }
    setPushEnabled(false)
  }

  const sendNow = async () => {
    const title = t('pushDemoTitle')
    const body = t('pushDemoBody')
    pushNotification({
      id: `n-demo-${Date.now()}`,
      titleAr: title,
      titleEn: title,
      titleTr: title,
      bodyAr: body,
      bodyEn: body,
      bodyTr: body,
      cta: { screen: 'HomeTab' },
    })
    const res = await scheduleLocalDemo({ title, body, seconds: 0 })
    if (!res.ok && res.reason === 'unavailable') Alert.alert(t('pushTitle'), t('pushWebHint'))
    else if (!res.ok && res.reason === 'denied') Alert.alert(t('pushTitle'), t('pushDenied'))
    else if (res.ok) Alert.alert(t('pushTitle'), t('pushSent'))
  }

  const scheduleSoon = async () => {
    const title = t('pushSchedTitle')
    const body = t('pushSchedBody')
    const res = await scheduleLocalDemo({ title, body, seconds: 5 })
    if (!res.ok && res.reason === 'unavailable') Alert.alert(t('pushTitle'), t('pushWebHint'))
    else if (!res.ok && res.reason === 'denied') Alert.alert(t('pushTitle'), t('pushDenied'))
    else if (res.ok) Alert.alert(t('pushTitle'), t('pushScheduled'))
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={[]}>
      <TopBar
        title={t('notifications')}
        onBack={() => navigation.goBack()}
        trailing={
          unreadCount ? (
            <Pressable onPress={markAllNotificationsRead}>
              <Text style={{ color: '#fff', fontWeight: '800', fontSize: 13 }}>{t('markAllRead')}</Text>
            </Pressable>
          ) : null
        }
      />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        <View
          style={{
            backgroundColor: '#fff',
            borderRadius: 14,
            padding: 14,
            marginBottom: 14,
            borderLeftWidth: 3,
            borderLeftColor: colors.red,
            gap: 12,
          }}
        >
          <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 10 }}>
            <Megaphone size={18} color={colors.red} />
            <View style={{ flex: 1, alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
              <Text style={{ fontWeight: '800' }}>{t('pushTitle')}</Text>
              <Text style={{ color: colors.muted, fontSize: 12, marginTop: 2 }}>
                {supported ? t('pushHint') : t('pushWebHint')}
                {supported ? ` · ${osStatus}` : ''}
              </Text>
            </View>
            <Switch
              value={!!user?.pushEnabled}
              onValueChange={togglePush}
              trackColor={{ false: '#DDD', true: colors.red }}
              thumbColor="#fff"
            />
          </View>
          <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', gap: 8 }}>
            <Pressable
              onPress={sendNow}
              style={{ flex: 1, backgroundColor: colors.red, borderRadius: 12, paddingVertical: 11, alignItems: 'center' }}
            >
              <Text style={{ color: '#fff', fontWeight: '800', fontSize: 13 }}>{t('pushSendNow')}</Text>
            </Pressable>
            <Pressable
              onPress={scheduleSoon}
              style={{
                flex: 1,
                backgroundColor: '#FFF8D6',
                borderRadius: 12,
                paddingVertical: 11,
                alignItems: 'center',
                borderWidth: 1,
                borderColor: colors.yellowDark,
              }}
            >
              <Text style={{ fontWeight: '800', fontSize: 13 }}>{t('pushSchedule')}</Text>
            </Pressable>
          </View>
        </View>

        {!notifications.length ? (
          <View style={{ alignItems: 'center', padding: 40 }}>
            <Bell size={36} color={colors.red} />
            <Text style={{ fontWeight: '800', marginTop: 12 }}>{t('noNotifications')}</Text>
          </View>
        ) : (
          notifications.map((n) => (
            <Pressable
              key={n.id}
              onPress={() => open(n)}
              style={{
                backgroundColor: '#fff',
                borderRadius: 14,
                padding: 14,
                marginBottom: 10,
                flexDirection: isRTL ? 'row-reverse' : 'row',
                gap: 10,
                borderLeftWidth: n.read ? 0 : 3,
                borderLeftColor: colors.red,
              }}
            >
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 12,
                  backgroundColor: n.read ? colors.bg : colors.redSoft,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Bell size={16} color={colors.red} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: '800', textAlign: isRTL ? 'right' : 'left' }}>{notifTitle(n, lang)}</Text>
                <Text style={{ color: colors.muted, marginTop: 4, textAlign: isRTL ? 'right' : 'left' }}>
                  {notifBody(n, lang)}
                </Text>
                <Text style={{ color: colors.muted, fontSize: 11, marginTop: 6 }}>{timeAgo(n.createdAt, t)}</Text>
              </View>
            </Pressable>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  )
}
