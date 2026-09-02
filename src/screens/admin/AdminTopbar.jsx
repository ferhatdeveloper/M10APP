import { Bell, Menu, Moon, Search, Sun } from 'lucide-react-native'
import { Pressable, Text, TextInput, View } from 'react-native'
import { useI18n } from '../../context/I18nContext'

export default function AdminTopbar({ theme, onOpenSidebar, onOpenNotifications, unreadCount, onToggleTheme }) {
  const c = theme.colors
  const { isRTL } = useI18n()

  return (
    <View
      style={{
        flexDirection: isRTL ? 'row-reverse' : 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: c.card,
        borderBottomWidth: 1,
        borderBottomColor: c.line,
        gap: 12,
      }}
    >
      <Pressable onPress={onOpenSidebar} hitSlop={10} style={{ padding: 6 }}>
        <Menu size={22} color={c.ink} />
      </Pressable>

      <View
        style={{
          flex: 1,
          maxWidth: 520,
          flexDirection: isRTL ? 'row-reverse' : 'row',
          alignItems: 'center',
          gap: 8,
          paddingHorizontal: 12,
          paddingVertical: 8,
          backgroundColor: c.bg,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: c.line,
        }}
      >
        <Search size={16} color={c.muted} />
        <TextInput
          placeholder={isRTL ? 'Ara...' : 'Search...'}
          placeholderTextColor={c.muted}
          style={{
            flex: 1,
            color: c.ink,
            fontWeight: '600',
            fontSize: 13,
            paddingVertical: 0,
            textAlign: isRTL ? 'right' : 'left',
          }}
        />
        <Text
          style={{
            color: c.muted,
            fontSize: 11,
            fontWeight: '700',
            paddingHorizontal: 6,
            paddingVertical: 2,
            borderRadius: 6,
            backgroundColor: c.line,
          }}
        >
          ⌘K
        </Text>
      </View>

      <Pressable onPress={onToggleTheme} hitSlop={10} style={iconBtn(c)}>
        {theme.mode === 'dark' ? <Sun size={18} color={c.ink} /> : <Moon size={18} color={c.ink} />}
      </Pressable>

      <Pressable onPress={onOpenNotifications} hitSlop={10} style={[iconBtn(c), { position: 'relative' }]}>
        <Bell size={18} color={c.ink} />
        {unreadCount > 0 ? (
          <View
            style={{
              position: 'absolute',
              top: 4,
              right: 4,
              minWidth: 16,
              height: 16,
              borderRadius: 8,
              paddingHorizontal: 4,
              backgroundColor: c.red,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 2,
              borderColor: c.card,
            }}
          >
            <Text style={{ color: '#fff', fontSize: 9, fontWeight: '900' }}>{unreadCount}</Text>
          </View>
        ) : null}
      </Pressable>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <View
          style={{
            width: 34,
            height: 34,
            borderRadius: 17,
            backgroundColor: c.red,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ color: '#fff', fontWeight: '900', fontSize: 13 }}>A</Text>
        </View>
        <View>
          <Text style={{ fontWeight: '800', fontSize: 12, color: c.ink }}>Admin</Text>
          <Text style={{ color: c.muted, fontSize: 10, fontWeight: '600' }}>admin</Text>
        </View>
      </View>
    </View>
  )
}

const iconBtn = (c) => ({
  width: 38,
  height: 38,
  borderRadius: 12,
  borderWidth: 1,
  borderColor: c.line,
  backgroundColor: c.card,
  alignItems: 'center',
  justifyContent: 'center',
})
