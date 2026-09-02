import { useMemo, useState } from 'react'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { ChevronLeft, ChevronRight, ClipboardList, Clock, MapPin, User } from 'lucide-react-native'
import { useApp } from '../../../context/AppContext'
import { formatIQD } from '../../../data/mock'
import { useI18n } from '../../../context/I18nContext'
import SectionHeader from '../components/SectionHeader'

const COLUMNS = [
  { id: 'confirmed', label: 'Onaylandı', color: '#E6D600' },
  { id: 'preparing', label: 'Hazırlanıyor', color: '#B86A00' },
  { id: 'onway', label: 'Yolda', color: '#6E36F3' },
  { id: 'delivered', label: 'Teslim Edildi', color: '#12803C' },
  { id: 'cancelled', label: 'İptal', color: '#E31E24' },
]

export default function OrdersKanbanPage({ theme, isRTL }) {
  const c = theme.colors
  const { orders, adminSetOrderStatus } = useApp()
  const [activeCol, setActiveCol] = useState(null)

  const grouped = useMemo(() => {
    const map = { confirmed: [], preparing: [], onway: [], delivered: [], cancelled: [] }
    for (const o of orders) {
      const s = o.status || 'confirmed'
      if (map[s]) map[s].push(o)
    }
    return map
  }, [orders])

  const move = (orderId, direction) => {
    const idx = COLUMNS.findIndex((x) => x.id === grouped[orderId]?.status || 'confirmed')
    const next = COLUMNS[Math.max(0, Math.min(COLUMNS.length - 1, idx + direction))]
    if (next) adminSetOrderStatus(orderId, next.id)
  }

  const colIndex = (id) => COLUMNS.findIndex((c) => c.id === id)

  return (
    <View style={{ gap: 16 }}>
      <SectionHeader theme={theme} isRTL={isRTL} title="Siparişler" subtitle={`${orders.length} toplam sipariş`} />

      {/* Horizontal scrollable kanban */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 12, paddingVertical: 4 }}
      >
        {COLUMNS.map((col) => {
          const items = grouped[col.id]
          const total = items.reduce((s, x) => s + (x.total || 0), 0)
          const isActive = activeCol === col.id
          return (
            <View
              key={col.id}
              style={{
                width: 260,
                backgroundColor: c.card,
                borderRadius: theme.radius.lg,
                borderWidth: 1,
                borderColor: c.line,
                overflow: 'hidden',
              }}
            >
              <Pressable
                onPress={() => setActiveCol(isActive ? null : col.id)}
                style={{
                  padding: 12,
                  borderBottomWidth: 1,
                  borderBottomColor: c.line,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: col.color }} />
                <Text style={{ color: c.ink, fontWeight: '900', flex: 1 }}>{col.label}</Text>
                <View
                  style={{
                    paddingHorizontal: 6,
                    paddingVertical: 2,
                    borderRadius: 6,
                    backgroundColor: c.bg,
                  }}
                >
                  <Text style={{ color: c.ink, fontWeight: '900', fontSize: 11 }}>{items.length}</Text>
                </View>
              </Pressable>

              <View style={{ padding: 6, gap: 6, maxHeight: 540 }}>
                {items.length === 0 ? (
                  <View style={{ paddingVertical: 24, alignItems: 'center' }}>
                    <ClipboardList size={20} color={c.muted} />
                    <Text style={{ color: c.muted, fontSize: 11, marginTop: 6 }}>Boş</Text>
                  </View>
                ) : (
                  items.slice(0, 12).map((o) => (
                    <View
                      key={o.id}
                      style={{
                        padding: 10,
                        borderRadius: 12,
                        backgroundColor: c.bg,
                        borderWidth: 1,
                        borderColor: c.line,
                        gap: 4,
                      }}
                    >
                      <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', justifyContent: 'space-between' }}>
                        <Text style={{ color: c.ink, fontWeight: '900', fontSize: 12 }}>{o.id}</Text>
                        <Text style={{ color: c.red, fontWeight: '900', fontSize: 12 }}>
                          {formatIQD(o.total)}
                        </Text>
                      </View>
                      <View style={{ flexDirection: 'row', gap: 4, alignItems: 'center' }}>
                        <User size={10} color={c.muted} />
                        <Text style={{ color: c.muted, fontSize: 10 }}>
                          {o.address?.name || 'Müşteri'}
                        </Text>
                      </View>
                      <View style={{ flexDirection: 'row', gap: 4, alignItems: 'center' }}>
                        <MapPin size={10} color={c.muted} />
                        <Text style={{ color: c.muted, fontSize: 10 }} numberOfLines={1}>
                          {o.address?.line || 'Adres'}
                        </Text>
                      </View>
                      <View style={{ flexDirection: 'row', gap: 4, alignItems: 'center' }}>
                        <Clock size={10} color={c.muted} />
                        <Text style={{ color: c.muted, fontSize: 10 }}>
                          {new Date(o.createdAt).toLocaleTimeString()}
                        </Text>
                      </View>

                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 }}>
                        <Pressable
                          onPress={() => move(o, -1)}
                          disabled={colIndex(o.status || 'confirmed') === 0}
                          style={{
                            padding: 6,
                            borderRadius: 8,
                            backgroundColor: c.card,
                            opacity: colIndex(o.status || 'confirmed') === 0 ? 0.4 : 1,
                          }}
                        >
                          <ChevronLeft size={14} color={c.ink} />
                        </Pressable>
                        <Pressable
                          onPress={() => move(o, 1)}
                          disabled={colIndex(o.status || 'confirmed') === COLUMNS.length - 1}
                          style={{
                            padding: 6,
                            borderRadius: 8,
                            backgroundColor: c.red,
                            opacity: colIndex(o.status || 'confirmed') === COLUMNS.length - 1 ? 0.4 : 1,
                          }}
                        >
                          <ChevronRight size={14} color="#fff" />
                        </Pressable>
                      </View>
                    </View>
                  ))
                )}
              </View>

              <View
                style={{
                  padding: 10,
                  borderTopWidth: 1,
                  borderTopColor: c.line,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <Text style={{ color: c.muted, fontSize: 11, fontWeight: '700' }}>Toplam</Text>
                <Text style={{ color: c.ink, fontWeight: '900', fontSize: 12 }}>
                  {formatIQD(total)}
                </Text>
              </View>
            </View>
          )
        })}
      </ScrollView>

      <View
        style={{
          padding: 14,
          borderRadius: theme.radius.lg,
          backgroundColor: c.ink,
          flexDirection: isRTL ? 'row-reverse' : 'row',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <View
          style={{
            width: 38,
            height: 38,
            borderRadius: 10,
            backgroundColor: c.yellow,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ClipboardList size={18} color={c.ink} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ color: '#fff', fontWeight: '800' }}>İpucu</Text>
          <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>
            Kart üzerindeki oklarla durumu ileri/geri al. Sürükle-bırak mobil kütüphanesi gerektirir.
          </Text>
        </View>
      </View>
    </View>
  )
}
