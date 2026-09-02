import { useState } from 'react'
import { Modal, Pressable, ScrollView, Switch, Text, TextInput, View } from 'react-native'
import { Bike, Phone, Plus, Star, UserCog, X } from 'lucide-react-native'
import SectionHeader from '../components/SectionHeader'

const STAFF_SEED = [
  { id: 'st1', name: 'Hüseyin Demir', role: 'Kurye', shift: '08:00-16:00', rating: 4.9, orders: 1240, active: true },
  { id: 'st2', name: 'Ali Yıldız', role: 'Kasiyer', shift: '12:00-20:00', rating: 4.7, orders: 0, active: true },
  { id: 'st3', name: 'Zeynep Kara', role: 'Depo', shift: '06:00-14:00', rating: 4.8, orders: 0, active: true },
  { id: 'st4', name: 'Mehmet Şahin', role: 'Kurye', shift: '14:00-22:00', rating: 4.6, orders: 980, active: false },
  { id: 'st5', name: 'Sara Akın', role: 'Müdür', shift: '09:00-18:00', rating: 5.0, orders: 0, active: true },
]

const empty = () => ({ id: '', name: '', role: 'Kurye', shift: '08:00-16:00', phone: '' })

const roleColor = (r) => {
  if (r === 'Kurye') return '#E31E24'
  if (r === 'Müdür') return '#6E36F3'
  if (r === 'Kasiyer') return '#0EA5E9'
  return '#B86A00'
}

export default function StaffPage({ theme, isRTL }) {
  const c = theme.colors
  const [staff, setStaff] = useState(STAFF_SEED)
  const [form, setForm] = useState(null)

  const save = () => {
    if (!form) return
    if (form.id) {
      setStaff((s) => s.map((x) => (x.id === form.id ? { ...x, ...form } : x)))
    } else {
      setStaff((s) => [...s, { ...form, id: `st-${Date.now()}`, rating: 4.5, orders: 0, active: true }])
    }
    setForm(null)
  }

  const stats = {
    total: staff.length,
    active: staff.filter((x) => x.active).length,
    couriers: staff.filter((x) => x.role === 'Kurye').length,
    avgRating: (staff.reduce((s, x) => s + (x.rating || 0), 0) / staff.length).toFixed(1),
  }

  return (
    <View style={{ gap: 16 }}>
      <SectionHeader theme={theme} isRTL={isRTL} title="Personel" subtitle="Vardiya, performans, atamalar" />

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
        <Stat theme={theme} label="Toplam" value={stats.total} color={c.ink} />
        <Stat theme={theme} label="Aktif" value={stats.active} color={c.open} />
        <Stat theme={theme} label="Kurye" value={stats.couriers} color={c.red} />
        <Stat theme={theme} label="Ort. Puan" value={`⭐ ${stats.avgRating}`} color={c.yellowDark} />
      </View>

      <Pressable
        onPress={() => setForm(empty())}
        style={{
          flexDirection: 'row',
          gap: 6,
          alignSelf: isRTL ? 'flex-end' : 'flex-start',
          paddingHorizontal: 14,
          paddingVertical: 10,
          borderRadius: 12,
          backgroundColor: c.red,
          alignItems: 'center',
        }}
      >
        <Plus size={16} color="#fff" />
        <Text style={{ color: '#fff', fontWeight: '800' }}>Yeni Personel</Text>
      </Pressable>

      <View style={{ gap: 8 }}>
        {staff.map((s) => (
          <View
            key={s.id}
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
                  backgroundColor: roleColor(s.role) + '22',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {s.role === 'Kurye' ? <Bike size={20} color={roleColor(s.role)} /> : <UserCog size={20} color={roleColor(s.role)} />}
              </View>
              <View style={{ flex: 1, alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
                <Text style={{ color: c.ink, fontWeight: '900' }}>{s.name}</Text>
                <View style={{ flexDirection: 'row', gap: 4, alignItems: 'center' }}>
                  <Phone size={11} color={c.muted} />
                  <Text style={{ color: c.muted, fontSize: 11 }}>{s.phone || '+964 770 xxx xx xx'}</Text>
                </View>
              </View>
              <View
                style={{
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 999,
                  backgroundColor: roleColor(s.role) + '22',
                }}
              >
                <Text style={{ color: roleColor(s.role), fontWeight: '900', fontSize: 11 }}>{s.role}</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              <Tag theme={theme} label={`Vardiya: ${s.shift}`} color={c.ink} />
              <Tag theme={theme} label={`⭐ ${s.rating}`} color={c.yellowDark} icon={Star} />
              {s.role === 'Kurye' ? (
                <Tag theme={theme} label={`${s.orders} teslimat`} color={c.open} />
              ) : null}
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Text style={{ color: c.muted, fontSize: 12 }}>{s.active ? 'Aktif çalışıyor' : 'İzinli / Pasif'}</Text>
              <Switch
                value={s.active}
                onValueChange={() => setStaff((arr) => arr.map((x) => (x.id === s.id ? { ...x, active: !x.active } : x)))}
                trackColor={{ true: c.red, false: c.line }}
              />
            </View>
            <Pressable
              onPress={() => setForm({ ...s })}
              style={{
                paddingVertical: 8,
                borderRadius: 10,
                backgroundColor: c.bg,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: c.ink, fontWeight: '700', fontSize: 12 }}>Düzenle</Text>
            </Pressable>
          </View>
        ))}
      </View>

      <Modal visible={!!form} animationType="slide" transparent>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
          <View
            style={{
              backgroundColor: c.card,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              padding: 18,
            }}
          >
            <View
              style={{
                flexDirection: isRTL ? 'row-reverse' : 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 10,
              }}
            >
              <Text style={{ color: c.ink, fontWeight: '900', fontSize: 18 }}>
                {form?.id ? 'Personel düzenle' : 'Yeni Personel'}
              </Text>
              <Pressable onPress={() => setForm(null)} hitSlop={10}>
                <X size={20} color={c.muted} />
              </Pressable>
            </View>
            <ScrollView>
              {[
                { k: 'name', label: 'İsim', placeholder: 'Ad Soyad' },
                { k: 'phone', label: 'Telefon', placeholder: '+964 ...' },
                { k: 'shift', label: 'Vardiya', placeholder: '08:00-16:00' },
              ].map(({ k, label, placeholder }) => (
                <View key={k} style={{ marginBottom: 10 }}>
                  <Text style={{ color: c.muted, fontWeight: '800', fontSize: 11, marginBottom: 4 }}>
                    {label.toUpperCase()}
                  </Text>
                  <TextInput
                    value={form?.[k] || ''}
                    onChangeText={(v) => setForm((f) => ({ ...f, [k]: v }))}
                    placeholder={placeholder}
                    placeholderTextColor={c.muted}
                    style={{
                      borderWidth: 1,
                      borderColor: c.line,
                      borderRadius: 12,
                      padding: 12,
                      color: c.ink,
                      backgroundColor: c.bg,
                      fontWeight: '600',
                      textAlign: isRTL ? 'right' : 'left',
                    }}
                  />
                </View>
              ))}
              <Text style={{ color: c.muted, fontWeight: '800', fontSize: 11, marginBottom: 4 }}>ROL</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6, marginBottom: 12 }}>
                {['Kurye', 'Kasiyer', 'Depo', 'Müdür'].map((r) => {
                  const on = form?.role === r
                  return (
                    <Pressable
                      key={r}
                      onPress={() => setForm((f) => ({ ...f, role: r }))}
                      style={{
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        borderRadius: 999,
                        backgroundColor: on ? c.red : c.bg,
                        borderWidth: 1,
                        borderColor: on ? c.red : c.line,
                      }}
                    >
                      <Text style={{ color: on ? '#fff' : c.ink, fontWeight: '700', fontSize: 12 }}>{r}</Text>
                    </Pressable>
                  )
                })}
              </ScrollView>
              <Pressable
                onPress={save}
                style={{ backgroundColor: c.red, borderRadius: 12, padding: 14, alignItems: 'center' }}
              >
                <Text style={{ color: '#fff', fontWeight: '900' }}>Kaydet</Text>
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  )
}

function Stat({ theme, label, value, color }) {
  const c = theme.colors
  return (
    <View
      style={{
        flex: 1,
        minWidth: 130,
        padding: 14,
        borderRadius: theme.radius.lg,
        backgroundColor: c.card,
        borderWidth: 1,
        borderColor: c.line,
      }}
    >
      <Text style={{ color: c.muted, fontWeight: '800', fontSize: 11, textTransform: 'uppercase' }}>
        {label}
      </Text>
      <Text style={{ color, fontWeight: '900', fontSize: 22, marginTop: 2 }}>{value}</Text>
    </View>
  )
}

function Tag({ theme, label, color, icon: Icon }) {
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
      {Icon ? <Icon size={11} color={color} /> : null}
      <Text style={{ color, fontSize: 11, fontWeight: '700' }}>{label}</Text>
    </View>
  )
}
