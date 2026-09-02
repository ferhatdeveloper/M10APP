import { useState } from 'react'
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Check, MapPin } from 'lucide-react-native'
import TopBar from '../components/TopBar'
import { useApp } from '../context/AppContext'
import { useI18n } from '../context/I18nContext'
import { colors } from '../theme'

export default function AddressesScreen({ navigation }) {
  const { user, setUser, addresses, setAddresses } = useApp()
  const { t, isRTL } = useI18n()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ label: '', area: '', details: '', note: '', pinLat: 36.2, pinLng: 44.0 })

  const same = (a, b) => a && b && a.label === b.label && a.area === b.area && a.details === b.details

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={[]}>
      <TopBar title={t('addresses')} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 10 }}>
        {addresses.map((addr, i) => {
          const on = same(user.address, addr)
          return (
            <Pressable
              key={`${addr.label}-${i}`}
              onPress={() => setUser((u) => ({ ...u, address: addr }))}
              style={{
                backgroundColor: on ? colors.redSoft : '#fff',
                borderWidth: 1,
                borderColor: on ? colors.red : 'transparent',
                borderRadius: 16,
                padding: 14,
              }}
            >
              <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', gap: 10 }}>
                <MapPin size={20} color={colors.red} />
                <View style={{ flex: 1, alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
                  <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 8 }}>
                    <Text style={{ fontWeight: '800' }}>{addr.label}</Text>
                    {on ? (
                      <View style={{ backgroundColor: colors.yellow, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2 }}>
                        <Text style={{ fontWeight: '800', fontSize: 10 }}>{t('defaultAddress')}</Text>
                      </View>
                    ) : null}
                  </View>
                  <Text>
                    {addr.area}، {addr.city || 'بغداد'}
                  </Text>
                  <Text style={{ color: colors.muted }}>{addr.details}</Text>
                  {addr.note ? (
                    <Text style={{ color: colors.muted, marginTop: 4, fontSize: 12 }}>
                      {t('doorNote')}: {addr.note}
                    </Text>
                  ) : null}
                  <View
                    style={{
                      marginTop: 10,
                      height: 72,
                      width: '100%',
                      borderRadius: 12,
                      backgroundColor: '#E8EEF5',
                      overflow: 'hidden',
                      borderWidth: 1,
                      borderColor: colors.line,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <View
                      style={{
                        position: 'absolute',
                        width: '70%',
                        height: 2,
                        backgroundColor: 'rgba(227,30,36,0.35)',
                        transform: [{ rotate: '-12deg' }],
                      }}
                    />
                    <MapPin size={22} color={colors.red} />
                    <Text style={{ color: colors.muted, fontSize: 11, marginTop: 4, fontWeight: '700' }}>
                      {t('mapPinHint')}
                    </Text>
                  </View>
                </View>
                {on ? <Check size={18} color={colors.red} /> : null}
              </View>
            </Pressable>
          )
        })}
        {open ? (
          <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 14, gap: 8 }}>
            <Text style={{ fontWeight: '800' }}>{t('newAddress')}</Text>
            <View
              style={{
                height: 110,
                borderRadius: 12,
                backgroundColor: '#E8EEF5',
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1,
                borderColor: colors.line,
                marginBottom: 4,
              }}
            >
              <MapPin size={28} color={colors.red} />
              <Text style={{ color: colors.muted, fontSize: 12, marginTop: 6, fontWeight: '700' }}>{t('dropPin')}</Text>
            </View>
            <TextInput
              placeholder={t('label')}
              value={form.label}
              onChangeText={(v) => setForm({ ...form, label: v })}
              style={{
                borderWidth: 1,
                borderColor: colors.line,
                borderRadius: 12,
                padding: 10,
                textAlign: isRTL ? 'right' : 'left',
              }}
            />
            <TextInput
              placeholder={t('area')}
              value={form.area}
              onChangeText={(v) => setForm({ ...form, area: v })}
              style={{
                borderWidth: 1,
                borderColor: colors.line,
                borderRadius: 12,
                padding: 10,
                textAlign: isRTL ? 'right' : 'left',
              }}
            />
            <TextInput
              placeholder={t('details')}
              value={form.details}
              onChangeText={(v) => setForm({ ...form, details: v })}
              style={{
                borderWidth: 1,
                borderColor: colors.line,
                borderRadius: 12,
                padding: 10,
                textAlign: isRTL ? 'right' : 'left',
              }}
            />
            <TextInput
              placeholder={t('doorNoteHint')}
              value={form.note}
              onChangeText={(v) => setForm({ ...form, note: v })}
              style={{
                borderWidth: 1,
                borderColor: colors.line,
                borderRadius: 12,
                padding: 10,
                textAlign: isRTL ? 'right' : 'left',
              }}
            />
            <Pressable
              onPress={() => {
                if (!form.label || !form.area || !form.details) return
                const addr = {
                  label: form.label,
                  area: form.area,
                  details: form.details,
                  note: form.note,
                  city: 'بغداد',
                  pin: { lat: form.pinLat, lng: form.pinLng },
                }
                setAddresses((prev) => [...prev, addr])
                setUser((u) => ({ ...u, address: addr }))
                setForm({ label: '', area: '', details: '', note: '', pinLat: 36.2, pinLng: 44.0 })
                setOpen(false)
              }}
              style={{ backgroundColor: colors.red, borderRadius: 12, padding: 12, alignItems: 'center' }}
            >
              <Text style={{ color: '#fff', fontWeight: '800' }}>{t('save')}</Text>
            </Pressable>
          </View>
        ) : (
          <Pressable
            onPress={() => setOpen(true)}
            style={{ backgroundColor: colors.red, borderRadius: 14, padding: 14, alignItems: 'center' }}
          >
            <Text style={{ color: '#fff', fontWeight: '800' }}>{t('addAddress')}</Text>
          </Pressable>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}
