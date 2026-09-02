import { useState } from 'react'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { TrendingUp, ShoppingBag, DollarSign, Users } from 'lucide-react-native'
import { useApp } from '../../../context/AppContext'
import { formatIQD, productName } from '../../../data/mock'
import { useI18n } from '../../../context/I18nContext'
import StatCard from '../components/StatCard'
import ChartLine from '../components/ChartLine'
import ChartBar from '../components/ChartBar'
import FilterChipRow from '../components/FilterChipRow'
import SectionHeader from '../components/SectionHeader'

const RANGES = [
  { id: '7', label: '7 gün' },
  { id: '30', label: '30 gün' },
  { id: '90', label: '90 gün' },
]

export default function AnalyticsPage({ theme, isRTL }) {
  const c = theme.colors
  const { orders, liveCatalog } = useApp()
  const { lang } = useI18n()
  const [range, setRange] = useState('7')

  const revenueData = [420, 510, 380, 690, 820, 760, 940]
  const ordersData = [12, 18, 14, 22, 28, 24, 31]
  const customerData = [4, 6, 5, 9, 12, 11, 14]

  const topProducts = liveCatalog.slice(0, 8)
  const topStores = [
    { id: 's1', name: 'Baghdad Mall', revenue: 14800, orders: 92, rating: 4.8 },
    { id: 's2', name: 'Erbil Center', revenue: 12300, orders: 78, rating: 4.6 },
    { id: 's3', name: 'Basra Express', revenue: 9100, orders: 64, rating: 4.4 },
  ]

  // Heatmap: hours vs days, simple grid
  const heat = Array.from({ length: 24 }, (_, h) =>
    Array.from({ length: 7 }, (_, d) => Math.round(((h * 31 + d * 17) % 100))),
  )

  return (
    <View style={{ gap: 16 }}>
      <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <Text style={{ color: c.ink, fontSize: 22, fontWeight: '900', letterSpacing: -0.3 }}>
          {isRTL ? 'التحليلات' : 'Analitik'}
        </Text>
        <View style={{ flex: 1 }} />
        <FilterChipRow items={RANGES} active={range} onChange={setRange} theme={theme} />
      </View>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
        <StatCard theme={theme} label="Toplam gelir" value={formatIQD(146200)} delta={12.4} icon={DollarSign} accent="red" />
        <StatCard theme={theme} label="Toplam sipariş" value={orders.length || 248} delta={6.8} icon={ShoppingBag} accent="yellow" />
        <StatCard theme={theme} label="Aktif müşteri" value="1,284" delta={3.2} icon={Users} accent="open" />
        <StatCard theme={theme} label="Ortalama sepet" value={formatIQD(5890)} delta={-1.2} deltaPositive={false} icon={TrendingUp} accent="busy" />
      </View>

      <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', gap: 12, flexWrap: 'wrap' }}>
        <View style={card(theme, { flex: 2, minWidth: 320 })}>
          <SectionHeader theme={theme} isRTL={isRTL} title="Gelir trendi" subtitle="Günlük IQD" />
          <ChartLine theme={theme} data={revenueData} labels={['P', 'S', 'Ç', 'P', 'C', 'C', 'P']} height={170} />
        </View>
        <View style={card(theme, { flex: 1, minWidth: 280 })}>
          <SectionHeader theme={theme} isRTL={isRTL} title="Sipariş hacmi" subtitle="Günlük adet" />
          <ChartBar theme={theme} data={ordersData} labels={['P', 'S', 'Ç', 'P', 'C', 'C', 'P']} height={170} color={c.yellowDark} />
        </View>
      </View>

      <View style={card(theme, {})}>
        <SectionHeader theme={theme} isRTL={isRTL} title="En çok satan ürünler" subtitle="Son 7 gün" />
        {topProducts.map((p, i) => (
          <View
            key={p.id}
            style={{
              flexDirection: isRTL ? 'row-reverse' : 'row',
              alignItems: 'center',
              paddingVertical: 10,
              borderTopWidth: i ? 1 : 0,
              borderTopColor: c.line,
              gap: 12,
            }}
          >
            <Text style={{ width: 28, color: c.muted, fontWeight: '900', fontSize: 14 }}>
              #{i + 1}
            </Text>
            <View style={{ flex: 1, alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
              <Text style={{ color: c.ink, fontWeight: '800', fontSize: 13 }}>{productName(p, lang)}</Text>
              <Text style={{ color: c.muted, fontSize: 11 }}>{p.aisle}</Text>
            </View>
            <Text style={{ color: c.ink, fontWeight: '800', fontSize: 13 }}>
              {Math.round(120 - i * 11)} adet
            </Text>
            <Text style={{ color: c.open, fontWeight: '800', fontSize: 12 }}>
              +{20 - i * 1.8}%
            </Text>
          </View>
        ))}
      </View>

      <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', gap: 12, flexWrap: 'wrap' }}>
        <View style={card(theme, { flex: 1, minWidth: 300 })}>
          <SectionHeader theme={theme} isRTL={isRTL} title="Mağaza performansı" />
          {topStores.map((s) => (
            <View
              key={s.id}
              style={{
                flexDirection: isRTL ? 'row-reverse' : 'row',
                alignItems: 'center',
                paddingVertical: 10,
                borderTopWidth: 1,
                borderTopColor: c.line,
                gap: 10,
              }}
            >
              <View style={{ flex: 1 }}>
                <Text style={{ color: c.ink, fontWeight: '800' }}>{s.name}</Text>
                <Text style={{ color: c.muted, fontSize: 11 }}>{s.orders} sipariş · ⭐ {s.rating}</Text>
              </View>
              <Text style={{ color: c.red, fontWeight: '900' }}>{formatIQD(s.revenue)}</Text>
            </View>
          ))}
        </View>

        <View style={card(theme, { flex: 1, minWidth: 300 })}>
          <SectionHeader theme={theme} isRTL={isRTL} title="Yoğunluk haritası" subtitle="Saat × gün" />
          <View style={{ marginTop: 4 }}>
            <View style={{ flexDirection: 'row', gap: 2, alignItems: 'center' }}>
              <View style={{ width: 16 }} />
              {[0, 6, 12, 18].map((h) => (
                <Text key={h} style={{ width: 12, color: c.muted, fontSize: 9, fontWeight: '700' }}>
                  {h}
                </Text>
              ))}
            </View>
            {heat.slice(8, 22).map((row, ri) => (
              <View key={ri} style={{ flexDirection: 'row', alignItems: 'center', gap: 2, marginTop: 2 }}>
                <Text style={{ width: 16, color: c.muted, fontSize: 9, fontWeight: '700' }}>
                  {ri + 8}
                </Text>
                {row.map((v, ci) => (
                  <View
                    key={ci}
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: 2,
                      backgroundColor: c.red,
                      opacity: 0.08 + v / 120,
                    }}
                  />
                ))}
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  )
}

const card = (theme, extra) => ({
  backgroundColor: theme.colors.card,
  borderRadius: theme.radius.lg,
  borderWidth: 1,
  borderColor: theme.colors.line,
  padding: 16,
  ...theme.shadow.soft,
  ...extra,
})
