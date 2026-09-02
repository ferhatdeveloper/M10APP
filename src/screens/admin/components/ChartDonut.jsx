import { Text, View } from 'react-native'
import Svg, { Circle, G, Path } from 'react-native-svg'

const polar = (cx, cy, r, angleDeg) => {
  const rad = ((angleDeg - 90) * Math.PI) / 180
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

const arcPath = (cx, cy, rOuter, rInner, startAngle, endAngle) => {
  const largeArc = endAngle - startAngle > 180 ? 1 : 0
  const s = polar(cx, cy, rOuter, startAngle)
  const e = polar(cx, cy, rOuter, endAngle)
  const s2 = polar(cx, cy, rInner, endAngle)
  const e2 = polar(cx, cy, rInner, startAngle)
  return [
    `M ${s.x} ${s.y}`,
    `A ${rOuter} ${rOuter} 0 ${largeArc} 1 ${e.x} ${e.y}`,
    `L ${s2.x} ${s2.y}`,
    `A ${rInner} ${rInner} 0 ${largeArc} 0 ${e2.x} ${e2.y}`,
    'Z',
  ].join(' ')
}

export default function ChartDonut({ theme, data, size = 160, thickness = 22, centerLabel, centerValue }) {
  const c = theme.colors
  const cx = size / 2
  const cy = size / 2
  const rOuter = size / 2 - 4
  const rInner = rOuter - thickness
  const total = data.reduce((s, d) => s + d.value, 0)
  let acc = 0
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
      <View style={{ width: size, height: size, position: 'relative' }}>
        <Svg width={size} height={size}>
          <G>
            <Path d={arcPath(cx, cy, rOuter, rInner, 0, 359.999)} fill={c.bg} />
            {data.map((d, i) => {
              const start = (acc / total) * 360
              acc += d.value
              const end = (acc / total) * 360 - 0.6
              return (
                <Path
                  key={i}
                  d={arcPath(cx, cy, rOuter, rInner, start, end)}
                  fill={d.color}
                />
              )
            })}
          </G>
        </Svg>
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ fontSize: 22, fontWeight: '900', color: c.ink }}>{centerValue}</Text>
          <Text style={{ fontSize: 10, fontWeight: '700', color: c.muted, textTransform: 'uppercase' }}>
            {centerLabel}
          </Text>
        </View>
      </View>
      <View style={{ flex: 1, gap: 8 }}>
        {data.map((d, i) => (
          <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: d.color }} />
            <Text style={{ flex: 1, fontSize: 12, fontWeight: '700', color: c.ink }}>{d.label}</Text>
            <Text style={{ fontSize: 12, fontWeight: '800', color: c.muted }}>
              {Math.round((d.value / total) * 100)}%
            </Text>
          </View>
        ))}
      </View>
    </View>
  )
}
