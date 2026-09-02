import { useState } from 'react'
import { Text, View } from 'react-native'
import Svg, { Defs, LinearGradient, Path, Stop, Circle, Line } from 'react-native-svg'

export default function ChartLine({ theme, data, labels, height = 180, color, showDots = true }) {
  const c = theme.colors
  const stroke = color || c.red
  const [active, setActive] = useState(null)
  const W = 320
  const H = height
  const pad = { l: 32, r: 12, t: 14, b: 26 }
  const innerW = W - pad.l - pad.r
  const innerH = H - pad.t - pad.b

  if (!data || data.length === 0) return null
  const max = Math.max(...data) * 1.15
  const min = 0
  const stepX = innerW / (data.length - 1)
  const points = data.map((v, i) => ({
    x: pad.l + i * stepX,
    y: pad.t + innerH - ((v - min) / (max - min)) * innerH,
    value: v,
  }))
  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(' ')
  const areaD = `${pathD} L ${points[points.length - 1].x} ${pad.t + innerH} L ${points[0].x} ${pad.t + innerH} Z`

  const gridY = [0, 0.25, 0.5, 0.75, 1]

  return (
    <View style={{ position: 'relative' }}>
      <Svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`}>
        <Defs>
          <LinearGradient id="chartLineFill" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={stroke} stopOpacity={0.32} />
            <Stop offset="100%" stopColor={stroke} stopOpacity={0} />
          </LinearGradient>
        </Defs>
        {gridY.map((g, i) => {
          const y = pad.t + innerH - g * innerH
          return (
            <Line
              key={i}
              x1={pad.l}
              y1={y}
              x2={W - pad.r}
              y2={y}
              stroke={c.line}
              strokeWidth={1}
              strokeDasharray={i === 0 ? '0' : '4 4'}
            />
          )
        })}
        <Path d={areaD} fill="url(#chartLineFill)" />
        <Path d={pathD} stroke={stroke} strokeWidth={2.5} fill="none" strokeLinejoin="round" strokeLinecap="round" />
        {showDots
          ? points.map((p, i) => (
              <Circle
                key={i}
                cx={p.x}
                cy={p.y}
                r={active === i ? 5 : 3}
                fill={c.card}
                stroke={stroke}
                strokeWidth={2}
                onPress={() => setActive(active === i ? null : i)}
              />
            ))
          : null}
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
      {active != null && points[active] ? (
        <View
          style={{
            position: 'absolute',
            left: points[active].x - 30,
            top: Math.max(0, points[active].y - 32),
            backgroundColor: c.ink,
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 6,
          }}
        >
          <Text style={{ color: '#fff', fontSize: 11, fontWeight: '800' }}>{data[active]}</Text>
        </View>
      ) : null}
    </View>
  )
}
