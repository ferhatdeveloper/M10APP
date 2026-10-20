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
  const insets = useSafeAreaInsets()
  const Chevron = isRTL ? ChevronRight : ChevronLeft

  return (
    <View
      style={{
        backgroundColor: colors.red,
        paddingTop: insets.top,
      }}
    >
      <StatusBar barStyle="light-content" backgroundColor={colors.red} />
      <View
        style={{
          paddingHorizontal: 12,
          paddingVertical: 6,
          flexDirection: isRTL ? 'row-reverse' : 'row',
          alignItems: 'center',
          gap: 8,
          minHeight: 44,
        }}
      >
        {onBack ? (
          <Pressable
            onPress={onBack}
            hitSlop={6}
            style={{
              width: 32,
              height: 32,
              borderRadius: 10,
              backgroundColor: 'rgba(255,255,255,0.18)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Chevron size={18} color="#fff" />
          </Pressable>
        ) : (
          <Logo size={28} onBrand />
        )}
        <View style={{ flex: 1, alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
          {showLocation ? (
            <Pressable
              onPress={onLocation}
              style={{
                flexDirection: isRTL ? 'row-reverse' : 'row',
                alignItems: 'center',
                gap: 4,
                maxWidth: '100%',
              }}
            >
              <View style={{ flex: 1, alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
                <Text
                  style={{
                    fontSize: 10,
                    fontWeight: '700',
                    color: 'rgba(255,255,255,0.8)',
                    textAlign: isRTL ? 'right' : 'left',
                    lineHeight: 13,
                  }}
                  numberOfLines={1}
                >
                  {t('deliverTo')} · {activeStoreName}
                </Text>
                <Text
                  numberOfLines={1}
                  style={{
                    fontSize: 13,
                    fontWeight: '800',
                    color: '#fff',
                    textAlign: isRTL ? 'right' : 'left',
                    lineHeight: 16,
                    marginTop: 1,
                  }}
                >
                  {user.address.area}، {user.address.city}
                </Text>
              </View>
              <MapPin size={14} color={colors.yellow} />
            </Pressable>
          ) : (
            <Text
              style={{
                fontSize: 15,
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
              width: 32,
              height: 32,
              borderRadius: 10,
              backgroundColor: 'rgba(255,255,255,0.18)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Bell size={16} color="#fff" />
            {unreadCount > 0 ? (
              <View
                style={{
                  position: 'absolute',
                  top: 2,
                  right: 2,
                  minWidth: 14,
                  height: 14,
                  borderRadius: 7,
                  backgroundColor: colors.yellow,
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingHorizontal: 3,
                }}
              >
                <Text style={{ color: colors.ink, fontSize: 8, fontWeight: '800' }}>
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
              width: 32,
              height: 32,
              borderRadius: 10,
              backgroundColor: 'rgba(255,255,255,0.18)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <User size={16} color="#fff" />
          </Pressable>
        ) : null}
      </View>
    </View>
  )
}
