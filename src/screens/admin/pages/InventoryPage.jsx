import { useMemo } from 'react'
import { Text, View } from 'react-native'
import { AlertTriangle, Boxes, PackageCheck, Plus, RefreshCw } from 'lucide-react-native'
import { useApp } from '../../../context/AppContext'
import { DEFAULT_STORE_ID, formatIQD, productName } from '../../../data/mock'
import { useI18n } from '../../../context/I18nContext'
import SectionHeader from '../components/SectionHeader'

const movement = (i) => ({
  id: `m-${i}`,
  product: ['Süt 1L', 'Ekmek', 'Yumurta 10lu', 'Pirinç 5kg', 'Ayçiçek yağı'][i % 5],
  type: i % 2 === 0 ? 'in' : 'out',
  qty: [12, 25, 8, 30, 6][i % 5],
  when: `${(i + 1) * 7} dk önce`,
  user: ['Depo Sorumlusu', 'Kasa 2', 'Kurye Hüseyin'][i % 3],
})

export default function InventoryPage({ theme, isRTL }) {
  const c = theme.colors
  const { liveCatalog, storeOverrides } = useApp()
  const { lang } = useI18n()
  const storeId = DEFAULT_STORE_ID

  const rows = useMemo(() => {
    return liveCatalog
      .map((p) => {
        const key = `${storeId}:${p.id}`
        const stock = storeOverrides[key]?.stock != null ? storeOverrides[key].stock : p.stock
        return { ...p, stock }
      })
      .filter((p) => p.stock <= 20)
      .sort((a, b) => a.stock - b.stock)
      .slice(0, 24)
  }, [liveCatalog, storeOverrides, storeId])

  const outOfStock = rows.filter((p) => p.stock <= 0)
  const lowStock = rows.filter((p) => p.stock > 0 && p.stock <= 10)

  const movements = Array.from({ length: 12 }, (_, i) => movement(i))

  return (
    <View style={{ gap: 16 }}>
      <SectionHeader theme={theme} isRTL={isRTL} title="Stok Yönetimi" subtitle="Düşük stok, transferler, hareketler" />

      <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', flexWrap: 'wrap', gap: 12 }}>
        <SummaryTile
          theme={theme}
          icon={AlertTriangle}
          label="Tükenen"
          value={outOfStock.length}
          color={c.red}
        />
        <SummaryTile
          theme={theme}
          icon={Boxes}
          label="Düşük Stok"
          value={lowStock.length}
          color={c.yellowDark}
        />
        <SummaryTile
          theme={theme}
          icon={PackageCheck}
          label="Bugün Giriş"
          value="142"
          color={c.open}
        />
        <SummaryTile
          theme={theme}
          icon={RefreshCw}
          label="Aktif Transfer"
          value="4"
          color="#6E36F3"
        />
      </View>

      <View style={{ gap: 8 }}>
        <Text style={{ color: c.ink, fontWeight: '900', fontSize: 14 }}>
          ⚠️ Acil müdahale gereken ürünler
        </Text>
        {rows.slice(0, 14).map((p) => {
          const ratio = Math.min(1, p.stock / 30)
          const color = p.stock <= 0 ? c.red : p.stock <= 10 ? c.yellowDark : c.open
          return (
            <View
              key={p.id}
              style={{
                flexDirection: isRTL ? 'row-reverse' : 'row',
                alignItems: 'center',
                gap: 10,
                padding: 12,
                borderRadius: theme.radius.lg,
                backgroundColor: c.card,
                borderWidth: 1,
                borderColor: c.line,
              }}
            >
              <View
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  backgroundColor: color + '22',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Boxes size={16} color={color} />
              </View>
              <View style={{ flex: 1, alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
                <Text style={{ color: c.ink, fontWeight: '800', fontSize: 13 }}>{productName(p, lang)}</Text>
                <Text style={{ color: c.muted, fontSize: 11, marginTop: 2 }}>
                  {p.aisle} · {p.id}
                </Text>
                <View
                  style={{
                    marginTop: 6,
                    height: 4,
                    borderRadius: 2,
                    backgroundColor: c.bg,
                    overflow: 'hidden',
                    width: 120,
                  }}
                >
                  <View style={{ width: `${ratio * 100}%`, height: '100%', backgroundColor: color }} />
                </View>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={{ color, fontWeight: '900', fontSize: 14 }}>{p.stock}</Text>
                <Text style={{ color: c.muted, fontSize: 10 }}>adet</Text>
              </View>
              <Text style={{ color: c.ink, fontWeight: '800', fontSize: 12 }}>
                {formatIQD(p.price, lang)}
              </Text>
            </View>
          )
        })}
      </View>

      <View
        style={{
          padding: 14,
          borderRadius: theme.radius.lg,
          backgroundColor: c.card,
          borderWidth: 1,
          borderColor: c.line,
        }}
      >
        <SectionHeader theme={theme} isRTL={isRTL} title="Stok Hareketleri" subtitle="Son 24 saat" />
        {movements.map((m) => (
          <View
            key={m.id}
            style={{
              flexDirection: isRTL ? 'row-reverse' : 'row',
              alignItems: 'center',
              paddingVertical: 10,
              borderTopWidth: 1,
              borderTopColor: c.line,
              gap: 10,
            }}
          >
            <View
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                backgroundColor: m.type === 'in' ? c.openBg : c.redSoft,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ color: m.type === 'in' ? c.open : c.red, fontWeight: '900' }}>
                {m.type === 'in' ? '+' : '-'}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: c.ink, fontWeight: '800' }}>{m.product}</Text>
              <Text style={{ color: c.muted, fontSize: 11 }}>{m.user} · {m.when}</Text>
            </View>
            <Text style={{ color: c.ink, fontWeight: '900' }}>{m.qty}</Text>
          </View>
        ))}
      </View>
    </View>
  )
}

function SummaryTile({ theme, icon: Icon, label, value, color }) {
  const c = theme.colors
  return (
    <View
      style={{
        flex: 1,
        minWidth: 160,
        padding: 14,
        borderRadius: theme.radius.lg,
        backgroundColor: c.card,
        borderWidth: 1,
        borderColor: c.line,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        ...theme.shadow.soft,
      }}
    >
      <View
        style={{
          width: 42,
          height: 42,
          borderRadius: 12,
          backgroundColor: color + '22',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon size={20} color={color} />
      </View>
      <View>
        <Text style={{ color: c.muted, fontWeight: '800', fontSize: 11, textTransform: 'uppercase' }}>
          {label}
        </Text>
        <Text style={{ color: c.ink, fontWeight: '900', fontSize: 22, marginTop: 2 }}>{value}</Text>
      </View>
    </View>
  )
}
