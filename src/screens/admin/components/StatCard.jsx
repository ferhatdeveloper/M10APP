import { ArrowDownRight, ArrowUpRight } from 'lucide-react-native'
import { Text, View } from 'react-native'

export default function StatCard({ theme, label, value, delta, deltaPositive = true, accent = 'red', icon: Icon, suffix }) {
  const c = theme.colors
  const accentColor = accent === 'red' ? c.red : accent === 'yellow' ? c.yellow : accent === 'open' ? c.open : c.busy

  return (
    <View
      style={{
        flex: 1,
        minWidth: 160,
        padding: 16,
        borderRadius: theme.radius.lg,
        backgroundColor: c.card,
        borderWidth: 1,
        borderColor: c.line,
        ...theme.shadow.soft,
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ color: c.muted, fontSize: 11, fontWeight: '800', letterSpacing: 0.5, textTransform: 'uppercase' }}>
          {label}
        </Text>
        {Icon ? (
          <View
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              backgroundColor: accentColor + '22',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon size={14} color={accentColor} />
          </View>
        ) : null}
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 6, marginTop: 10 }}>
        <Text style={{ color: c.ink, fontWeight: '900', fontSize: 26, letterSpacing: -0.5 }}>{value}</Text>
        {suffix ? (
          <Text style={{ color: c.muted, fontWeight: '700', fontSize: 13, marginBottom: 4 }}>{suffix}</Text>
        ) : null}
      </View>
      {typeof delta === 'number' ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 }}>
          {deltaPositive ? <ArrowUpRight size={12} color={c.open} /> : <ArrowDownRight size={12} color={c.busy} />}
          <Text style={{ color: deltaPositive ? c.open : c.busy, fontSize: 11, fontWeight: '800' }}>
            {deltaPositive ? '+' : ''}
            {delta.toFixed(1)}%
          </Text>
          <Text style={{ color: c.muted, fontSize: 11, fontWeight: '600' }}>vs last 7d</Text>
        </View>
      ) : null}
    </View>
  )
}
