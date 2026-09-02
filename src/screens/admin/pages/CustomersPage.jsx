import { useMemo, useState } from 'react'
import { Pressable, Text, TextInput, View } from 'react-native'
import { Award, Phone, Search, Star, Users } from 'lucide-react-native'
import { useApp } from '../../../context/AppContext'
import { DEMO_ACCOUNTS, formatIQD } from '../../../data/mock'
import SectionHeader from '../components/SectionHeader'

const initials = (name) =>
  String(name || '?')
    .split(' ')
    .map((s) => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()

const colors = ['#E31E24', '#12803C', '#6E36F3', '#B86A00', '#0EA5E9']

export default function CustomersPage({ theme, isRTL }) {
  const c = theme.colors
  const { orders, accounts, user, adminSetCustomerPoints } = useApp()
  const [query, setQuery] = useState('')
  const [pointsEdit, setPointsEdit] = useState({})

  const customers = useMemo(() => {
    const map = new Map()
    for (const demo of DEMO_ACCOUNTS) {
      const key = String(demo.phone).replace(/\D/g, '')
      map.set(key, {
        phone: demo.phone,
        name: demo.nameTr || demo.nameEn || demo.name,
        points: 0,
        role: demo.role || 'customer',
        ordersCount: 0,
      })
    }
    for (const [key, acc] of Object.entries(accounts || {})) {
      const prev = map.get(key) || {}
      map.set(key, {
        phone: acc.phone || prev.phone || key,
        name: acc.name || prev.name || key,
        points: acc.points ?? prev.points ?? 0,
        role: acc.role || prev.role || 'customer',
        ordersCount: prev.ordersCount || 0,
      })
    }
    if (user?.loggedIn && user.phone) {
      const key = String(user.phone).replace(/\D/g, '')
      const prev = map.get(key) || {}
      map.set(key, {
        phone: user.phone,
        name: user.name || prev.name,
        points: user.points ?? prev.points ?? 0,
        role: user.role || prev.role || 'customer',
        ordersCount: prev.ordersCount || 0,
      })
    }
    for (const o of orders) {
      const phone = o.address?.phone || user?.phone
      if (!phone) continue
      const key = String(phone).replace(/\D/g, '')
      const prev = map.get(key) || { phone, name: phone, points: 0, role: 'customer', ordersCount: 0 }
      map.set(key, { ...prev, ordersCount: (prev.ordersCount || 0) + 1 })
    }
    return [...map.values()].sort((a, b) => (b.ordersCount || 0) - (a.ordersCount || 0))
  }, [accounts, orders, user])

  const filtered = customers.filter((c) => {
    const q = query.trim().toLowerCase()
    if (!q) return true
    return [c.name, c.phone].filter(Boolean).some((s) => String(s).toLowerCase().includes(q))
  })

  return (
    <View style={{ gap: 16 }}>
      <SectionHeader theme={theme} isRTL={isRTL} title="Müşteriler" subtitle={`${filtered.length} aktif müşteri`} />

      <View
        style={{
          flexDirection: isRTL ? 'row-reverse' : 'row',
          alignItems: 'center',
          gap: 8,
          paddingHorizontal: 12,
          paddingVertical: 10,
          backgroundColor: c.card,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: c.line,
        }}
      >
        <Search size={16} color={c.muted} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Müşteri adı veya telefon..."
          placeholderTextColor={c.muted}
          style={{ flex: 1, color: c.ink, fontWeight: '600', textAlign: isRTL ? 'right' : 'left' }}
        />
      </View>

      <View style={{ gap: 8 }}>
        {filtered.map((cu, i) => (
          <View
            key={cu.phone}
            style={{
              padding: 14,
              borderRadius: theme.radius.lg,
              backgroundColor: c.card,
              borderWidth: 1,
              borderColor: c.line,
              gap: 10,
            }}
          >
            <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 12 }}>
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: colors[i % colors.length],
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ color: '#fff', fontWeight: '900' }}>{initials(cu.name)}</Text>
              </View>
              <View style={{ flex: 1, alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
                <Text style={{ color: c.ink, fontWeight: '900', fontSize: 14 }}>{cu.name}</Text>
                <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 4 }}>
                  <Phone size={11} color={c.muted} />
                  <Text style={{ color: c.muted, fontSize: 11 }}>{cu.phone}</Text>
                </View>
              </View>
              {cu.role !== 'customer' ? (
                <View
                  style={{
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 999,
                    backgroundColor: c.red + '22',
                  }}
                >
                  <Text style={{ color: c.red, fontSize: 10, fontWeight: '900' }}>{cu.role.toUpperCase()}</Text>
                </View>
              ) : null}
            </View>

            <View
              style={{
                flexDirection: isRTL ? 'row-reverse' : 'row',
                flexWrap: 'wrap',
                gap: 8,
              }}
            >
              <Tag theme={theme} icon={Users} label={`${cu.ordersCount || 0} sipariş`} color={c.ink} />
              <Tag theme={theme} icon={Award} label={`${cu.points} puan`} color={c.yellowDark} />
              <Tag theme={theme} icon={Star} label="M10+" color="#6E36F3" />
            </View>

            <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', gap: 8, alignItems: 'center' }}>
              <TextInput
                value={pointsEdit[cu.phone] ?? String(cu.points)}
                onChangeText={(v) => setPointsEdit((prev) => ({ ...prev, [cu.phone]: v }))}
                keyboardType="number-pad"
                style={{
                  flex: 1,
                  borderWidth: 1,
                  borderColor: c.line,
                  borderRadius: 10,
                  padding: 10,
                  color: c.ink,
                  backgroundColor: c.bg,
                  fontWeight: '700',
                  textAlign: isRTL ? 'right' : 'left',
                }}
              />
              <Pressable
                onPress={() => adminSetCustomerPoints(cu.phone, pointsEdit[cu.phone] ?? cu.points)}
                style={{
                  backgroundColor: c.yellow,
                  borderRadius: 10,
                  paddingHorizontal: 14,
                  paddingVertical: 10,
                }}
              >
                <Text style={{ color: c.ink, fontWeight: '900', fontSize: 12 }}>Puan Güncelle</Text>
              </Pressable>
            </View>
          </View>
        ))}
      </View>
    </View>
  )
}

function Tag({ theme, icon: Icon, label, color }) {
  const c = theme.colors
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 999,
        backgroundColor: c.bg,
      }}
    >
      <Icon size={11} color={color} />
      <Text style={{ color, fontSize: 11, fontWeight: '700' }}>{label}</Text>
    </View>
  )
}
