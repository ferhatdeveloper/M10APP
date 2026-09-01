import { useEffect } from 'react'
import { Platform, Pressable, ScrollView, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Store } from 'lucide-react-native'
import Logo from './Logo'
import { colors } from '../theme'
import { useI18n } from '../context/I18nContext'
import { ADMIN_SIDEBAR_W, useWebLayout } from '../layout/web'

function NavItem({ item, on, onPress, isRTL, dense }) {
  const Icon = item.icon
  return (
    <Pressable
      onPress={onPress}
      style={{
        flexDirection: isRTL ? 'row-reverse' : 'row',
        alignItems: 'center',
        gap: 10,
        paddingHorizontal: dense ? 12 : 14,
        paddingVertical: dense ? 8 : 11,
        borderRadius: dense ? 999 : 10,
        backgroundColor: on ? (dense ? colors.red : 'rgba(227,30,36,0.92)') : dense ? colors.bg : 'transparent',
      }}
    >
      <Icon size={dense ? 14 : 18} color={on ? '#fff' : dense ? colors.muted : 'rgba(255,255,255,0.55)'} />
      <Text
        style={{
          fontWeight: '800',
          fontSize: dense ? 12 : 14,
          color: on ? '#fff' : dense ? colors.ink : 'rgba(255,255,255,0.82)',
        }}
      >
        {item.label}
      </Text>
    </Pressable>
  )
}

export function AdminGateLayout({ children, onLeave }) {
  const { t } = useI18n()
  const insets = useSafeAreaInsets()

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') return undefined
    const prev = document.body.style.backgroundColor
    document.body.style.backgroundColor = '#121212'
    return () => {
      document.body.style.backgroundColor = prev
    }
  }, [])
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#121212',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: insets.top + 24,
        paddingBottom: insets.bottom + 24,
        paddingHorizontal: 24,
      }}
    >
      <View style={{ width: '100%', maxWidth: 440 }}>{children}</View>
      {onLeave ? (
        <Pressable onPress={onLeave} style={{ marginTop: 22, padding: 8 }}>
          <Text style={{ color: 'rgba(255,255,255,0.7)', fontWeight: '700' }}>{t('adminOpenShop')}</Text>
        </Pressable>
      ) : null}
    </View>
  )
}

export default function AdminChrome({ section, onSection, sections, children, onLeave }) {
  const { t, isRTL } = useI18n()
  const { desktop } = useWebLayout()
  const insets = useSafeAreaInsets()

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') return undefined
    const prev = document.body.style.backgroundColor
    document.body.style.backgroundColor = desktop ? '#F0F1F3' : '#161616'
    return () => {
      document.body.style.backgroundColor = prev
    }
  }, [desktop])

  if (desktop) {
    return (
      <View style={{ flex: 1, flexDirection: isRTL ? 'row-reverse' : 'row', backgroundColor: '#F0F1F3' }}>
        <View
          style={{
            width: ADMIN_SIDEBAR_W,
            backgroundColor: '#161616',
            paddingTop: Math.max(insets.top, 20),
            paddingBottom: Math.max(insets.bottom, 16),
            paddingHorizontal: 14,
          }}
        >
          <View
            style={{
              flexDirection: isRTL ? 'row-reverse' : 'row',
              alignItems: 'center',
              gap: 10,
              paddingHorizontal: 8,
              marginBottom: 22,
            }}
          >
            <Logo size={36} onBrand />
            <View style={{ flex: 1, alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
              <Text style={{ color: colors.yellow, fontWeight: '900', fontSize: 11, letterSpacing: 0.6 }}>M10</Text>
              <Text style={{ color: '#fff', fontWeight: '800', fontSize: 16 }}>{t('adminTitle')}</Text>
            </View>
          </View>
          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ gap: 4, paddingBottom: 8 }} showsVerticalScrollIndicator={false}>
            {sections.map((s) => (
              <NavItem
                key={s.id}
                item={s}
                on={section === s.id}
                onPress={() => onSection(s.id)}
                isRTL={isRTL}
              />
            ))}
          </ScrollView>
          {onLeave ? (
            <Pressable
              onPress={onLeave}
              style={{
                marginTop: 12,
                flexDirection: isRTL ? 'row-reverse' : 'row',
                alignItems: 'center',
                gap: 8,
                paddingHorizontal: 14,
                paddingVertical: 12,
                borderRadius: 10,
                backgroundColor: 'rgba(255,255,255,0.08)',
              }}
            >
              <Store size={16} color={colors.yellow} />
              <Text style={{ color: colors.yellow, fontWeight: '800', fontSize: 13 }}>{t('adminOpenShop')}</Text>
            </Pressable>
          ) : null}
        </View>
        <View style={{ flex: 1, minHeight: 0 }}>
          <View
            style={{
              backgroundColor: '#fff',
              borderBottomWidth: 1,
              borderBottomColor: colors.line,
              paddingHorizontal: 28,
              paddingVertical: 16,
              paddingTop: Math.max(insets.top, 16),
            }}
          >
            <Text style={{ color: colors.muted, fontWeight: '700', fontSize: 11, letterSpacing: 0.4 }}>
              {t('adminPanelKicker')}
            </Text>
            <Text style={{ color: colors.ink, fontWeight: '900', fontSize: 22, marginTop: 2 }}>
              {t(`adminNav.${section}`)}
            </Text>
          </View>
          <View style={{ flex: 1, minHeight: 0 }}>{children}</View>
        </View>
      </View>
    )
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View
        style={{
          backgroundColor: '#161616',
          paddingTop: insets.top,
          paddingHorizontal: 14,
          paddingBottom: 12,
          flexDirection: isRTL ? 'row-reverse' : 'row',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <Logo size={32} onBrand />
        <Text style={{ flex: 1, color: '#fff', fontWeight: '800', fontSize: 16, textAlign: isRTL ? 'right' : 'left' }}>
          {t('adminTitle')}
        </Text>
        {onLeave ? (
          <Pressable onPress={onLeave} style={{ paddingVertical: 8, paddingHorizontal: 4 }}>
            <Text style={{ color: colors.yellow, fontWeight: '800', fontSize: 12 }}>{t('adminOpenShop')}</Text>
          </Pressable>
        ) : null}
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 12,
          paddingVertical: 10,
          gap: 8,
          flexDirection: isRTL ? 'row-reverse' : 'row',
        }}
        style={{ maxHeight: 58, borderBottomWidth: 1, borderBottomColor: colors.line, backgroundColor: '#fff' }}
      >
        {sections.map((s) => (
          <NavItem
            key={s.id}
            item={s}
            on={section === s.id}
            onPress={() => onSection(s.id)}
            isRTL={isRTL}
            dense
          />
        ))}
      </ScrollView>
      <View style={{ flex: 1, minHeight: 0 }}>{children}</View>
    </View>
  )
}
