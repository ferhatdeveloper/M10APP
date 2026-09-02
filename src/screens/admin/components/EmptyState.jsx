import { Text, View } from 'react-native'

export default function EmptyState({ theme, icon: Icon, title, hint }) {
  const c = theme.colors
  return (
    <View
      style={{
        paddingVertical: 40,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: c.card,
        borderRadius: theme.radius.lg,
        borderWidth: 1,
        borderColor: c.line,
        borderStyle: 'dashed',
      }}
    >
      {Icon ? (
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: 14,
            backgroundColor: c.bg,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 10,
          }}
        >
          <Icon size={22} color={c.muted} />
        </View>
      ) : null}
      <Text style={{ color: c.ink, fontWeight: '800', fontSize: 14 }}>{title}</Text>
      {hint ? (
        <Text style={{ color: c.muted, fontSize: 12, fontWeight: '600', marginTop: 4 }}>{hint}</Text>
      ) : null}
    </View>
  )
}
