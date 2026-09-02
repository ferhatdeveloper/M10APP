import { Pressable, Text, View } from 'react-native'

export default function SectionHeader({ theme, title, subtitle, action, isRTL, onAction }) {
  const c = theme.colors
  return (
    <View
      style={{
        flexDirection: isRTL ? 'row-reverse' : 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        marginBottom: 12,
        gap: 12,
      }}
    >
      <View style={{ flex: 1, alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
        <Text style={{ color: c.ink, fontWeight: '900', fontSize: 18, letterSpacing: -0.3 }}>{title}</Text>
        {subtitle ? (
          <Text style={{ color: c.muted, fontSize: 12, fontWeight: '600', marginTop: 2 }}>{subtitle}</Text>
        ) : null}
      </View>
      {action ? (
        <Pressable
          onPress={onAction}
          style={{
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 10,
            backgroundColor: c.bg,
            borderWidth: 1,
            borderColor: c.line,
          }}
        >
          <Text style={{ color: c.ink, fontWeight: '700', fontSize: 12 }}>{action}</Text>
        </Pressable>
      ) : null}
    </View>
  )
}
