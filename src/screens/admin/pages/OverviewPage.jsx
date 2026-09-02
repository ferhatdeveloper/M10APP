import { useMemo } from 'react'
import { Pressable, Text, View } from 'react-native'
import { Bike, DollarSign, ShoppingBag, Users, TrendingUp, ArrowRight, Plus, Megaphone, Truck } from 'lucide-react-native'
import { useApp } from '../../../context/AppContext'
import { formatIQD } from '../../../data/mock'
import StatCard from '../components/StatCard'
import ChartLine from '../components/ChartLine'
import ChartDonut from '../components/ChartDonut'
import SectionHeader from '../components/SectionHeader'

const DAY_LABELS_TR = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz']
const DAY_LABELS_EN = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const DAY_LABELS_AR = ['إث', 'ثل', 'أر', 'خم', 'جم', 'سب', 'أح']

export default function OverviewPage({ theme, isRTL, navigation }) {
  const { orders, accounts, user, liveCatalog, liveCampaigns } = useApp()
  const c = theme.colors

  const dayLabels = isRTL ? DAY_LABELS_AR : isRTL ? DAY_LABELS_AR : null
  const labels = isRTL ? DAY_LABELS_AR : (navigation?.getParam?.('lang') === 'en' ? DAY_LABELS_EN : DAY_LABELS_TR)

  const stats = useMemo(() => {
    const startOfDay = (() => {
      const d = new Date()
      d.setHours(0, 0, 0, 0)
      return d.getTime()
    })()
    const ordersToday = orders.filter((o) => (o.createdAt || 0) >= startOfDay)
    const revenueToday = ordersToday.reduce((s, o) => s + (o.total || 0), 0)
    const customers = new Set(
      orders.map((o) => o.address?.phone || user?.phone).filter(Boolean),
    ).size
    return {
      ordersToday: ordersToday.length,
      revenueToday,
      customers,
      conversion: 3.4,
      products: liveCatalog.length,
      activeCampaigns: liveCampaigns.filter((x) => x.active !== false).length,
    }
  }, [orders, liveCatalog, liveCampaigns, user])

  // Mock 7-day series
  const revenueSeries = [420, 510, 380, 690, 820, 760, 940]
  const ordersSeries = [12, 18, 14, 22, 28, 24, 31]

  const donutData = [
    { label: 'Onaylandı', value: 18, color: c.red },
    { label: 'Hazırlanıyor', value: 12, color: c.yellow },
    { label: 'Yolda', value: 8, color: '#6E36F3' },
    { label: 'Teslim edildi', value: 124, color: c.open },
    { label: 'İptal', value: 4, color: c.muted },
  ]

  const recent = useMemo(
    () => [...orders].sort((a, b) => b.createdAt - a.createdAt).slice(0, 8),
    [orders],
  )

  return (
    <View style={{ gap: 16 }}>
      {/* Welcome / hero */}
      <View
        style={{
          padding: 20,
          borderRadius: theme.radius.lg,
          backgroundColor: c.ink,
          flexDirection: isRTL ? 'row-reverse' : 'row',
          alignItems: 'center',
          gap: 16,
          ...theme.shadow.card,
        }}
      >
        <View style={{ flex: 1 }}>
          <Text style={{ color: c.yellow, fontWeight: '900', fontSize: 11, letterSpacing: 1 }}>
            ADMIN PANEL · M10
          </Text>
          <Text style={{ color: '#fff', fontWeight: '900', fontSize: 22, marginTop: 6, letterSpacing: -0.3 }}>
            Merhaba Admin 👋
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 4 }}>
            Bugün {stats.ordersToday} yeni sipariş, toplam {formatIQD(stats.revenueToday)} ciro.
          </Text>
          <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', gap: 8, marginTop: 14 }}>
            <Pressable
              onPress={() => navigation?.navigate?.('Courier')}
              style={{
                flexDirection: 'row',
                gap: 6,
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 10,
                backgroundColor: c.red,
                alignItems: 'center',
              }}
            >
              <Truck size={14} color="#fff" />
              <Text style={{ color: '#fff', fontWeight: '800', fontSize: 12 }}>Kurye paneli</Text>
            </Pressable>
            <Pressable
              style={{
                flexDirection: 'row',
                gap: 6,
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 10,
                backgroundColor: 'rgba(255,255,255,0.12)',
                alignItems: 'center',
              }}
            >
              <Megaphone size={14} color="#fff" />
              <Text style={{ color: '#fff', fontWeight: '800', fontSize: 12 }}>Kampanya oluştur</Text>
            </Pressable>
          </View>
        </View>
        <View
          style={{
            width: 96,
            height: 96,
            borderRadius: 48,
            backgroundColor: c.red,
            opacity: 0.18,
            position: 'absolute',
            right: -20,
            top: -20,
          }}
        />
      </View>

      {/* KPI grid */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
        <StatCard
          theme={theme}
          label={isRTL ? 'طلبات اليوم' : 'Bugünkü Sipariş'}
          value={stats.ordersToday}
          delta={12.4}
          deltaPositive
          icon={ShoppingBag}
          accent="red"
        />
        <StatCard
          theme={theme}
          label={isRTL ? 'إيرادات اليوم' : 'Bugünkü Ciro'}
          value={formatIQD(stats.revenueToday)}
          delta={8.7}
          deltaPositive
          icon={DollarSign}
          accent="yellow"
        />
        <StatCard
          theme={theme}
          label={isRTL ? 'العملاء' : 'Müşteriler'}
          value={stats.customers}
          delta={4.2}
          deltaPositive
          icon={Users}
          accent="open"
        />
        <StatCard
          theme={theme}
          label={isRTL ? 'معدل التحويل' : 'Dönüşüm'}
          value={`%${stats.conversion}`}
          delta={-1.1}
          deltaPositive={false}
          icon={TrendingUp}
          accent="busy"
        />
      </View>

      {/* Charts row */}
      <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', gap: 12, flexWrap: 'wrap' }}>
        <View
          style={{
            flex: 2,
            minWidth: 320,
            backgroundColor: c.card,
            borderRadius: theme.radius.lg,
            borderWidth: 1,
            borderColor: c.line,
            padding: 16,
            ...theme.shadow.soft,
          }}
        >
          <SectionHeader
            theme={theme}
            isRTL={isRTL}
            title={isRTL ? 'الإيرادات (7 أيام)' : 'Son 7 gün gelir'}
            subtitle={isRTL ? 'بالآلاف دينار عراقي' : 'IQD cinsinden'}
            action={isRTL ? 'التفاصيل' : 'Detay →'}
          />
          <ChartLine theme={theme} data={revenueSeries} labels={labels} height={170} />
        </View>

        <View
          style={{
            flex: 1,
            minWidth: 280,
            backgroundColor: c.card,
            borderRadius: theme.radius.lg,
            borderWidth: 1,
            borderColor: c.line,
            padding: 16,
            ...theme.shadow.soft,
          }}
        >
          <SectionHeader
            theme={theme}
            isRTL={isRTL}
            title={isRTL ? 'حالة الطلبات' : 'Sipariş durumu'}
            subtitle={isRTL ? 'توزيع الحالات' : 'Bugünkü dağılım'}
          />
          <ChartDonut theme={theme} data={donutData} centerLabel="Toplam" centerValue={orders.length || 166} size={150} />
        </View>
      </View>

      {/* Recent orders */}
      <View
        style={{
          backgroundColor: c.card,
          borderRadius: theme.radius.lg,
          borderWidth: 1,
          borderColor: c.line,
          padding: 16,
        }}
      >
        <SectionHeader
          theme={theme}
          isRTL={isRTL}
          title={isRTL ? 'النشاط الأخير' : 'Son Aktivite'}
          subtitle={isRTL ? 'أحدث 8 طلبات' : 'Son 8 sipariş'}
          action={isRTL ? 'عرض الكل' : 'Tümünü gör'}
        />
        {recent.length === 0 ? (
          <Text style={{ color: c.muted, fontSize: 12, textAlign: 'center', paddingVertical: 20 }}>
            Henüz sipariş yok
          </Text>
        ) : (
          recent.map((o) => {
            const colorBy = {
              delivered: c.open,
              onway: '#6E36F3',
              preparing: c.busy,
              cancelled: c.red,
              confirmed: c.yellowDark,
            }
            const color = colorBy[o.status] || c.muted
            return (
              <View
                key={o.id}
                style={{
                  flexDirection: isRTL ? 'row-reverse' : 'row',
                  alignItems: 'center',
                  paddingVertical: 12,
                  borderTopWidth: 1,
                  borderTopColor: c.line,
                  gap: 12,
                }}
              >
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    backgroundColor: c.bg,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Bike size={16} color={c.ink} />
                </View>
                <View style={{ flex: 1, alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
                  <Text style={{ fontWeight: '800', color: c.ink, fontSize: 13 }}>{o.id}</Text>
                  <Text style={{ color: c.muted, fontSize: 11, marginTop: 2 }}>
                    {new Date(o.createdAt).toLocaleString()}
                  </Text>
                </View>
                <View
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderRadius: 999,
                    backgroundColor: color + '22',
                  }}
                >
                  <Text style={{ color, fontWeight: '800', fontSize: 11 }}>{o.status || 'confirmed'}</Text>
                </View>
                <Text style={{ fontWeight: '900', color: c.ink, fontSize: 13 }}>
                  {formatIQD(o.total)}
                </Text>
              </View>
            )
          })
        )}
      </View>
    </View>
  )
}
