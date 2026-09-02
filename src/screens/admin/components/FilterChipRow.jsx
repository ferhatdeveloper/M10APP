import { Pressable, ScrollView, Text } from 'react-native'

export default function FilterChipRow({ items, active, onChange, theme }) {
  const c = theme.colors
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 8, paddingVertical: 4 }}
    >
      {items.map((it) => {
        const on = it.id === active
        return (
          <Pressable
            key={it.id}
            onPress={() => onChange(it.id)}
            style={{
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: 999,
              backgroundColor: on ? c.red : c.bg,
              borderWidth: 1,
              borderColor: on ? c.red : c.line,
            }}
          >
            <Text style={{ color: on ? '#fff' : c.ink, fontWeight: '700', fontSize: 12 }}>{it.label}</Text>
          </Pressable>
        )
      })}
    </ScrollView>
  )
}
