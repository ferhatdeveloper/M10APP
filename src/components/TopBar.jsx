import { Pressable, StatusBar, Text, View } from 'react-native'
import { Bell, ChevronLeft, ChevronRight, MapPin, Store as StoreIcon } from 'lucide-react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useI18n } from '../context/I18nContext'
import { useApp } from '../context/AppContext'
import { DEFAULT_STORE_ID, storeName } from '../data/mock'
import { colors } from '../theme'
import Logo from './Logo'

export default function TopBar({ title, onBack, showLocation, onLocation, onBell, trailing }) {
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
          paddingHorizontal: 16,
          paddingVertical: 10,
          flexDirection: isRTL ? 'row-reverse' : 'row',
          alignItems: 'center',
          gap: 10,
        }}
      >
        {onBack ? (
          <Pressable
            onPress={onBack}
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              backgroundColor: 'rgba(255,255,255,0.18)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Chevron size={22} color="#fff" />
          </Pressable>
        ) : (
          <Logo size={36} onBrand />
        )}
        <View style={{ flex: 1, alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
          {showLocation ? (
            <Pressable
              onPress={onLocation}
              style={{
                flexDirection: isRTL ? 'row-reverse' : 'row',
                alignItems: 'center',
                gap: 6,
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
                  }}
                  numberOfLines={1}
                >
                  {t('deliverTo')} · {activeStoreName}
                </Text>
                <Text
                  numberOfLines={1}
                  style={{
                    fontSize: 15,
                    fontWeight: '800',
                    color: '#fff',
                    textAlign: isRTL ? 'right' : 'left',
                  }}
                >
                  {user.address.area}، {user.address.city}
                </Text>
              </View>
              <MapPin size={16} color={colors.yellow} />
            </Pressable>
          ) : (
            <Text
              style={{
                fontSize: 17,
                fontWeight: '800',
                color: '#fff',
                textAlign: isRTL ? 'right' : 'left',
              }}
            >
              {title || t('appName')}
            </Text>
          )}
        </View>
        {trailing}
        {onBell ? (
          <Pressable
            onPress={onBell}
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              backgroundColor: 'rgba(255,255,255,0.18)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Bell size={20} color="#fff" />
            {unreadCount > 0 ? (
              <View
                style={{
                  position: 'absolute',
                  top: 6,
                  right: 6,
                  minWidth: 16,
                  height: 16,
                  borderRadius: 8,
                  backgroundColor: colors.yellow,
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingHorizontal: 4,
                }}
              >
                <Text style={{ color: colors.ink, fontSize: 9, fontWeight: '800' }}>
                  {unreadCount > 9 ? '9+' : unreadCount}
                </Text>
              </View>
            ) : null}
          </Pressable>
        ) : null}
      </View>
    </View>
  )
}
