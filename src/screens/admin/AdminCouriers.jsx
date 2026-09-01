import { useState } from 'react'
import { Pressable, Switch, Text, TextInput, View } from 'react-native'
import { Plus, Trash2 } from 'lucide-react-native'
import { colors } from '../../theme'

const VEHICLES = ['motorcycle', 'car', 'bike', 'van']

function Field({ label, value, onChangeText, isRTL, placeholder, keyboardType }) {
  return (
    <View style={{ marginBottom: 10 }}>
      <Text style={{ fontWeight: '700', fontSize: 12, color: colors.muted, marginBottom: 4, textAlign: isRTL ? 'right' : 'left' }}>
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#AAA"
        keyboardType={keyboardType}
        style={{
          borderWidth: 1,
          borderColor: colors.line,
          borderRadius: 8,
          padding: 12,
          backgroundColor: '#fff',
          textAlign: isRTL ? 'right' : 'left',
        }}
      />
    </View>
  )
}

const empty = () => ({
  id: '',
  name: '',
  phone: '',
  vehicle: 'motorcycle',
  active: true,
})

export default function AdminCouriers({
  t,
  isRTL,
  couriers,
  adminUpsertCourier,
  adminToggleCourier,
  adminDeleteCourier,
}) {
  const [form, setForm] = useState(null)

  const save = () => {
    if (!form?.name?.trim() && !form?.phone?.trim()) return
    adminUpsertCourier({
      ...form,
      nameAr: form.name,
      nameEn: form.name,
      nameTr: form.name,
    })
    setForm(null)
  }

  return (
    <>
      <Pressable
        onPress={() => setForm(empty())}
        style={{
          backgroundColor: colors.red,
          borderRadius: 10,
          padding: 12,
          flexDirection: isRTL ? 'row-reverse' : 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          marginBottom: 8,
        }}
      >
        <Plus size={16} color="#fff" />
        <Text style={{ color: '#fff', fontWeight: '800' }}>{t('adminAddCourier')}</Text>
      </Pressable>

      {form ? (
        <View
          style={{
            backgroundColor: '#fff',
            borderRadius: 10,
            borderWidth: 1,
            borderColor: colors.line,
            padding: 14,
            marginBottom: 10,
          }}
        >
          <Text style={{ fontWeight: '900', marginBottom: 10, textAlign: isRTL ? 'right' : 'left' }}>
            {form.id ? t('adminEditCourier') : t('adminAddCourier')}
          </Text>
          <Field
            label={t('adminCourierName')}
            value={form.name}
            onChangeText={(v) => setForm((f) => ({ ...f, name: v }))}
            isRTL={isRTL}
          />
          <Field
            label={t('adminCourierPhone')}
            value={form.phone}
            onChangeText={(v) => setForm((f) => ({ ...f, phone: v }))}
            isRTL={isRTL}
            keyboardType="phone-pad"
            placeholder="0770 …"
          />
          <Text style={{ fontWeight: '700', fontSize: 12, color: colors.muted, marginBottom: 6, textAlign: isRTL ? 'right' : 'left' }}>
            {t('adminCourierVehicle')}
          </Text>
          <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
            {VEHICLES.map((v) => {
              const on = form.vehicle === v
              return (
                <Pressable
                  key={v}
                  onPress={() => setForm((f) => ({ ...f, vehicle: v }))}
                  style={{
                    backgroundColor: on ? colors.red : colors.bg,
                    borderRadius: 8,
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderWidth: on ? 0 : 1,
                    borderColor: colors.line,
                  }}
                >
                  <Text style={{ fontWeight: '800', fontSize: 12, color: on ? '#fff' : colors.ink }}>
                    {t(`adminVehicle.${v}`)}
                  </Text>
                </Pressable>
              )
            })}
          </View>
          <View
            style={{
              flexDirection: isRTL ? 'row-reverse' : 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 12,
            }}
          >
            <Text style={{ fontWeight: '700' }}>{t('adminCourierActive')}</Text>
            <Switch
              value={form.active !== false}
              onValueChange={(v) => setForm((f) => ({ ...f, active: v }))}
              trackColor={{ true: colors.red, false: '#ddd' }}
            />
          </View>
          <Pressable
            onPress={save}
            style={{ backgroundColor: colors.red, borderRadius: 10, padding: 12, alignItems: 'center' }}
          >
            <Text style={{ color: '#fff', fontWeight: '900' }}>{t('save')}</Text>
          </Pressable>
          <Pressable onPress={() => setForm(null)} style={{ padding: 12, alignItems: 'center' }}>
            <Text style={{ color: colors.muted, fontWeight: '700' }}>{t('cancel')}</Text>
          </Pressable>
        </View>
      ) : null}

      {(couriers || []).map((c) => (
        <View
          key={c.id}
          style={{
            backgroundColor: '#fff',
            borderRadius: 10,
            borderWidth: 1,
            borderColor: colors.line,
            padding: 14,
            marginBottom: 8,
            opacity: c.active === false ? 0.55 : 1,
          }}
        >
          <View
            style={{
              flexDirection: isRTL ? 'row-reverse' : 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <Pressable
              onPress={() =>
                setForm({
                  id: c.id,
                  name: c.name || c.nameTr || c.nameEn || c.nameAr || '',
                  phone: c.phone || '',
                  vehicle: c.vehicle || 'motorcycle',
                  active: c.active !== false,
                })
              }
              style={{ flex: 1, alignItems: isRTL ? 'flex-end' : 'flex-start' }}
            >
              <Text style={{ fontWeight: '800' }}>{c.name || c.nameTr || c.nameEn || c.nameAr}</Text>
              <Text style={{ color: colors.muted, fontSize: 12, marginTop: 2 }}>{c.phone}</Text>
              <Text style={{ color: colors.muted, fontSize: 11, marginTop: 4 }}>
                {t(`adminVehicle.${c.vehicle || 'motorcycle'}`)}
              </Text>
            </Pressable>
            <Switch
              value={c.active !== false}
              onValueChange={() => adminToggleCourier(c.id)}
              trackColor={{ true: colors.red, false: '#ddd' }}
            />
          </View>
          <Pressable
            onPress={() => adminDeleteCourier(c.id)}
            style={{
              marginTop: 10,
              flexDirection: isRTL ? 'row-reverse' : 'row',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Trash2 size={14} color={colors.red} />
            <Text style={{ color: colors.red, fontWeight: '700', fontSize: 12 }}>{t('adminDelete')}</Text>
          </Pressable>
        </View>
      ))}
    </>
  )
}
