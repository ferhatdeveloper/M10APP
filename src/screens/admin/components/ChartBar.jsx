import { Text, View } from 'react-native'
import Svg, { Defs, LinearGradient, Rect, Stop, Line } from 'react-native-svg'

export default function ChartBar({ theme, data, labels, height = 160, color }) {
  const c = theme.colors
  const stroke = color || c.red
  const W = 320
  const H = height
  const pad = { l: 32, r: 12, t: 14, b: 26 }
  const innerW = W - pad.l - pad.r
  const innerH = H - pad.t - pad.b
  if (!data || data.length === 0) return null
  const max = Math.max(...data) * 1.15
  const barW = (innerW / data.length) * 0.6
  const slot = innerW / data.length

  return (
    <View style={{ position: 'relative' }}>
      <Svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`}>
        <Defs>
          <LinearGradient id="chartBarFill" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={stroke} stopOpacity={1} />
            <Stop offset="100%" stopColor={stroke} stopOpacity={0.45} />
          </LinearGradient>
        </Defs>
        {[0, 0.5, 1].map((g, i) => {
          const y = pad.t + innerH - g * innerH
          return <Line key={i} x1={pad.l} y1={y} x2={W - pad.r} y2={y} stroke={c.line} strokeDasharray="4 4" />
        })}
        {data.map((v, i) => {
          const h = (v / max) * innerH
          const x = pad.l + i * slot + (slot - barW) / 2
          const y = pad.t + innerH - h
          return (
            <Rect
              key={i}
              x={x}
              y={y}
              width={barW}
              height={Math.max(2, h)}
              rx={4}
              fill="url(#chartBarFill)"
            />
          )
        })}
      </Svg>
      {labels && labels.length === data.length ? (
        <View
          style={{
            position: 'absolute',
            left: pad.l,
            right: pad.r,
            bottom: 4,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          {labels.map((l, i) => (
            <Text key={i} style={{ fontSize: 10, color: c.muted, fontWeight: '600' }}>
              {l}
            </Text>
          ))}
        </View>
      ) : null}
    </View>
  )
}
