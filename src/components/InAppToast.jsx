import { useEffect, useRef } from 'react'
import { Animated, Pressable, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Bell } from 'lucide-react-native'
import { useApp } from '../context/AppContext'
import { useI18n } from '../context/I18nContext'
import { notifBody, notifTitle } from '../data/mock'
import { colors } from '../theme'

export default function InAppToast({ navigationRef }) {
  const { toast, dismissToast, markNotificationRead } = useApp()
  const { lang, isRTL, t } = useI18n()
  const insets = useSafeAreaInsets()
  const slide = useRef(new Animated.Value(-120)).current

  useEffect(() => {
    if (!toast) {
      slide.setValue(-120)
      return undefined
    }
    Animated.spring(slide, { toValue: 0, useNativeDriver: true, speed: 16, bounciness: 6 }).start()
    const hide = setTimeout(dismissToast, 6500)
    return () => clearTimeout(hide)
  }, [toast?.id])

  if (!toast) return null

  const open = () => {
    markNotificationRead(toast.id)
    dismissToast()
    if (!navigationRef?.isReady?.()) return
    if (toast.storyId === 's-aktuel') navigationRef.navigate('Flyer', { id: 'week' })
    else if (toast.storyId) navigationRef.navigate('Story', { id: toast.storyId })
    else if (toast.cta?.screen) navigationRef.navigate(toast.cta.screen, toast.cta.params)
    else navigationRef.navigate('Notifications')
  }

  return (
    <Animated.View
      pointerEvents="box-none"
      style={{
        position: 'absolute',
        top: insets.top + 8,
        left: 12,
        right: 12,
        zIndex: 50,
        transform: [{ translateY: slide }],
      }}
    >
      <Pressable
        onPress={open}
        style={{
          backgroundColor: colors.ink,
          borderRadius: 16,
          padding: 12,
          flexDirection: isRTL ? 'row-reverse' : 'row',
          alignItems: 'center',
          gap: 10,
          borderLeftWidth: 3,
          borderLeftColor: colors.red,
        }}
      >
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: 12,
            backgroundColor: colors.red,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Bell size={16} color="#fff" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ color: colors.yellow, fontWeight: '800', fontSize: 11 }}>{t('appName')}</Text>
          <Text
            numberOfLines={1}
            style={{ color: '#fff', fontWeight: '800', marginTop: 2, textAlign: isRTL ? 'right' : 'left' }}
          >
            {notifTitle(toast, lang)}
          </Text>
          <Text
            numberOfLines={2}
            style={{ color: 'rgba(255,255,255,0.82)', marginTop: 2, fontSize: 12, textAlign: isRTL ? 'right' : 'left' }}
          >
            {notifBody(toast, lang)}
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  )
}
