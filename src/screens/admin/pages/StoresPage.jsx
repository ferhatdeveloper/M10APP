import { useState } from 'react'
import { Pressable, Text, TextInput, View } from 'react-native'
import { Clock, DollarSign, MapPin, Phone, Save, Store as StoreIcon } from 'lucide-react-native'
import { useApp } from '../../../context/AppContext'
import { storeName } from '../../../data/mock'
import { useI18n } from '../../../context/I18nContext'
import SectionHeader from '../components/SectionHeader'

export default function StoresPage({ theme, isRTL }) {
  const c = theme.colors
  const { liveStores, adminUpdateStore } = useApp()
  const { lang } = useI18n()

  return (
    <View style={{ gap: 16 }}>
      <SectionHeader theme={theme} isRTL={isRTL} title="Mağazalar" subtitle="ETA, ücret, minimum tutar" />

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
        {liveStores
          .filter((s) => !s.comingSoon)
          .map((s) => (
            <StoreCard key={s.id} theme={theme} store={s} lang={lang} isRTL={isRTL} onSave={(patch) => adminUpdateStore(s.id, patch)} />
          ))}
      </View>
    </View>
  )
}

function StoreCard({ theme, store, lang, isRTL, onSave }) {
  const c = theme.colors
  const [eta, setEta] = useState(String(store.eta || ''))
  const [fee, setFee] = useState(String(store.fee ?? ''))
  const [minOrder, setMinOrder] = useState(String(store.minOrder ?? ''))

  return (
    <View
      style={{
        flex: 1,
        minWidth: 280,
        padding: 16,
        borderRadius: theme.radius.lg,
        backgroundColor: c.card,
        borderWidth: 1,
        borderColor: c.line,
        gap: 10,
        ...theme.shadow.soft,
      }}
    >
      <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 12 }}>
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: 14,
            backgroundColor: c.red,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <StoreIcon size={22} color="#fff" />
        </View>
        <View style={{ flex: 1, alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
          <Text style={{ color: c.ink, fontWeight: '900', fontSize: 14 }}>{storeName(store, lang)}</Text>
          <View style={{ flexDirection: 'row', gap: 4, alignItems: 'center' }}>
            <MapPin size={11} color={c.muted} />
            <Text style={{ color: c.muted, fontSize: 11 }}>{store.city || 'Iraq'}</Text>
          </View>
        </View>
      </View>

      {[
        { k: 'eta', label: 'Teslimat Süresi', placeholder: '20-30 dk', icon: Clock, suffix: 'dk' },
        { k: 'fee', label: 'Teslimat Ücreti', placeholder: '5000', icon: DollarSign, suffix: 'IQD', keyboardType: 'number-pad' },
        { k: 'minOrder', label: 'Minimum Sepet', placeholder: '20000', icon: DollarSign, suffix: 'IQD', keyboardType: 'number-pad' },
      ].map(({ k, label, placeholder, icon: Icon, suffix, keyboardType }) => {
        const setters = { eta: setEta, fee: setFee, minOrder: setMinOrder }
        const values = { eta, fee, minOrder }
        return (
          <View key={k}>
            <Text style={{ color: c.muted, fontWeight: '800', fontSize: 11, marginBottom: 4 }}>
              {label.toUpperCase()}
            </Text>
            <View
              style={{
                flexDirection: isRTL ? 'row-reverse' : 'row',
                alignItems: 'center',
                gap: 8,
                paddingHorizontal: 12,
                paddingVertical: 10,
                borderRadius: 12,
                backgroundColor: c.bg,
                borderWidth: 1,
                borderColor: c.line,
              }}
            >
              <Icon size={14} color={c.muted} />
              <TextInput
                value={values[k]}
                onChangeText={setters[k]}
                placeholder={placeholder}
                placeholderTextColor={c.muted}
                keyboardType={keyboardType}
                style={{ flex: 1, color: c.ink, fontWeight: '700', textAlign: isRTL ? 'right' : 'left' }}
              />
              <Text style={{ color: c.muted, fontWeight: '700', fontSize: 12 }}>{suffix}</Text>
            </View>
          </View>
        )
      })}

      <Pressable
        onPress={() => onSave({ eta, fee: Number(fee) || 0, minOrder: Number(minOrder) || 0 })}
        style={{
          flexDirection: 'row',
          gap: 6,
          backgroundColor: c.yellow,
          padding: 12,
          borderRadius: 12,
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 4,
        }}
      >
        <Save size={14} color={c.ink} />
        <Text style={{ color: c.ink, fontWeight: '900' }}>Kaydet</Text>
      </Pressable>
    </View>
  )
}
