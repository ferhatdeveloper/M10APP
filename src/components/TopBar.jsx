import { Pressable, StatusBar, Text, View } from 'react-native'
import { Bell, ChevronLeft, ChevronRight, MapPin, User } from 'lucide-react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useI18n } from '../context/I18nContext'
import { useApp } from '../context/AppContext'
import { DEFAULT_STORE_ID, storeName } from '../data/mock'
import { colors } from '../theme'
import Logo from './Logo'

export default function TopBar({ title, onBack, showLocation, onLocation, onBell, onProfile, trailing }) {
  const { t, lang, isRTL } = useI18n()
  const { user, unreadCount, getLiveStore } = useApp()
  const defaultStore = getLiveStore(DEFAULT_STORE_ID)
  const activeStoreName = defaultStore ? storeName(defaultStore, lang) : t('appName')
  const addr = user?.address
  const addrArea =
    lang === 'en' ? addr?.areaEn || addr?.area : lang === 'tr' ? addr?.areaTr || addr?.area : addr?.area
  const addrCity =
    lang === 'en' ? addr?.cityEn || addr?.city : lang === 'tr' ? addr?.cityTr || addr?.city : addr?.city
  const addrLine =
    addrArea && addrCity
      ? lang === 'ar'
        ? `${addrArea}، ${addrCity}`
        : `${addrArea}, ${addrCity}`
      : addrArea || addrCity || ''
  const insets = useSafeAreaInsets()
  const Chevron = isRTL ? ChevronRight : ChevronLeft

  return (
    <View
      style={{
        backgroundColor: colors.red,
        paddingTop: insets.top,
      }}
    >
      <StatusBar barStyle="light-content" />
      <View
        style={{
          paddingHorizontal: 14,
          paddingVertical: 10,
          flexDirection: isRTL ? 'row-reverse' : 'row',
          alignItems: 'center',
          gap: 10,
          minHeight: 52,
        }}
      >
        {onBack ? (
          <Pressable
            onPress={onBack}
            hitSlop={6}
            style={{
              width: 36,
              height: 36,
              borderRadius: 11,
              backgroundColor: 'rgba(255,255,255,0.18)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Chevron size={20} color="#fff" />
          </Pressable>
        ) : (
          <Logo size={34} onBrand />
        )}
        <View style={{ flex: 1, alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
          {showLocation ? (
            <Pressable
              onPress={onLocation}
              style={{
                flexDirection: isRTL ? 'row-reverse' : 'row',
                alignItems: 'center',
                gap: 5,
                maxWidth: '100%',
              }}
            >
              <View style={{ flex: 1, alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: '700',
                    color: 'rgba(255,255,255,0.8)',
                    textAlign: isRTL ? 'right' : 'left',
                    lineHeight: 14,
                  }}
                  numberOfLines={1}
                >
                  {t('deliverTo')} · {activeStoreName}
                </Text>
                <Text
                  numberOfLines={1}
                  style={{
                    fontSize: 14,
                    fontWeight: '800',
                    color: '#fff',
                    textAlign: isRTL ? 'right' : 'left',
                    lineHeight: 18,
                    marginTop: 1,
                  }}
                >
                  {addrLine}
                </Text>
              </View>
              <MapPin size={16} color={colors.yellow} />
            </Pressable>
          ) : (
            <Text
              style={{
                fontSize: 16,
                fontWeight: '800',
                color: '#fff',
                textAlign: isRTL ? 'right' : 'left',
              }}
              numberOfLines={1}
            >
              {title || t('appName')}
            </Text>
          )}
        </View>
        {trailing}
        {/* LTR: Bell → Profile (dış kenar). RTL row-reverse ile yan yana kalır. */}
        {onBell ? (
          <Pressable
            onPress={onBell}
            hitSlop={6}
            style={{
              width: 36,
              height: 36,
              borderRadius: 11,
              backgroundColor: 'rgba(255,255,255,0.18)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Bell size={18} color="#fff" />
            {unreadCount > 0 ? (
              <View
                style={{
                  position: 'absolute',
                  top: 2,
                  right: 2,
                  minWidth: 15,
                  height: 15,
                  borderRadius: 8,
                  backgroundColor: colors.yellow,
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingHorizontal: 3,
                }}
              >
                <Text style={{ color: colors.ink, fontSize: 9, fontWeight: '800' }}>
                  {unreadCount > 9 ? '9+' : unreadCount}
                </Text>
              </View>
            ) : null}
          </Pressable>
        ) : null}
        {onProfile ? (
          <Pressable
            onPress={onProfile}
            hitSlop={6}
            accessibilityRole="button"
            accessibilityLabel="Profile"
            style={{
              width: 36,
              height: 36,
              borderRadius: 11,
              backgroundColor: 'rgba(255,255,255,0.18)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <User size={18} color="#fff" />
          </Pressable>
        ) : null}
      </View>
    </View>
  )
}
