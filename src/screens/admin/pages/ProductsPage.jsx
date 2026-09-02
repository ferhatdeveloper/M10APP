import { useMemo, useState } from 'react'
import {
  Image,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native'
import { Alert, ImagePlus, Package, Plus, Search, X } from 'lucide-react-native'
import { useApp } from '../../../context/AppContext'
import { useI18n } from '../../../context/I18nContext'
import { DEFAULT_STORE_ID, formatIQD, productName } from '../../../data/mock'
import SectionHeader from '../components/SectionHeader'
import FilterChipRow from '../components/FilterChipRow'

const STOCK_FILTERS = [
  { id: 'all', label: 'Tümü' },
  { id: 'in', label: 'Stokta' },
  { id: 'low', label: 'Düşük' },
  { id: 'out', label: 'Tükendi' },
]

const emptyProduct = () => ({
  id: '',
  nameAr: '',
  nameEn: '',
  nameTr: '',
  price: '',
  stock: '20',
  aisle: 'pantry',
  barcode: '',
  image: '',
  tryInRoom: false,
  disabled: false,
})

const pickImageWeb = () =>
  new Promise((resolve) => {
    if (typeof document === 'undefined') {
      resolve(null)
      return
    }
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = () => {
      const file = input.files?.[0]
      if (!file) {
        resolve(null)
        return
      }
      const reader = new FileReader()
      reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : null)
      reader.onerror = () => resolve(null)
      reader.readAsDataURL(file)
    }
    input.click()
  })

export default function ProductsPage({ theme, isRTL }) {
  const c = theme.colors
  const { liveCatalog, liveAisles, storeOverrides, adminUpsertProduct, adminToggleStock, adminToggleProductDisabled } =
    useApp()
  const { lang, t } = useI18n()
  const [query, setQuery] = useState('')
  const [stockFilter, setStockFilter] = useState('all')
  const [form, setForm] = useState(null)
  const storeId = DEFAULT_STORE_ID

  const aisleLabel = (a) => {
    if (lang === 'tr' && a.nameTr) return a.nameTr
    if (lang === 'en' && a.nameEn) return a.nameEn
    if (lang === 'ar' && a.nameAr) return a.nameAr
    const translated = t(`cats.${a.id}`)
    return translated !== `cats.${a.id}` ? translated : a.id
  }

  const filtered = useMemo(() => {
    let list = [...liveCatalog]
    if (query.trim()) {
      const q = query.trim().toLowerCase()
      list = list.filter(
        (p) =>
          productName(p, lang).toLowerCase().includes(q) ||
          p.id.toLowerCase().includes(q) ||
          String(p.barcode || '').includes(q),
      )
    }
    if (stockFilter !== 'all') {
      list = list.filter((p) => {
        const key = `${storeId}:${p.id}`
        const stock = storeOverrides[key]?.stock != null ? storeOverrides[key].stock : p.stock
        const out = (stock ?? 0) <= 0 || p.disabled
        if (stockFilter === 'in') return stock > 10 && !p.disabled
        if (stockFilter === 'low') return stock > 0 && stock <= 10
        if (stockFilter === 'out') return out
        return true
      })
    }
    return list.sort((a, b) => Number(!!a.disabled) - Number(!!b.disabled))
  }, [liveCatalog, query, stockFilter, storeOverrides, lang, storeId])

  const openEdit = (p) => {
    if (!p) {
      setForm(emptyProduct())
      return
    }
    setForm({
      id: p.id,
      nameAr: p.names?.ar || p.name || '',
      nameEn: p.names?.en || '',
      nameTr: p.names?.tr || '',
      price: String(p.price ?? ''),
      stock: String(p.stock ?? 20),
      aisle: p.aisle || 'pantry',
      barcode: p.barcode || '',
      image: p.image || '',
      tryInRoom: !!p.tryInRoom,
      disabled: !!p.disabled,
    })
  }

  const save = () => {
    if (!form) return
    const id = form.id?.trim() || `mm-${Date.now().toString(36)}`
    adminUpsertProduct({
      id,
      nameAr: form.nameAr,
      nameEn: form.nameEn,
      nameTr: form.nameTr,
      names: { ar: form.nameAr, en: form.nameEn, tr: form.nameTr },
      price: Number(form.price) || 0,
      stock: Number(form.stock) || 0,
      aisle: form.aisle,
      barcode: form.barcode,
      image: form.image,
      imageUrl: form.image,
      tryInRoom: form.tryInRoom,
      disabled: form.disabled,
    })
    setForm(null)
  }

  const pickImage = async () => {
    try {
      if (Platform.OS === 'web') {
        const uri = await pickImageWeb()
        if (uri) setForm((f) => (f ? { ...f, image: uri } : f))
        return
      }
      const ImagePicker = await import('expo-image-picker')
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (!perm.granted) {
        Alert.alert(t('adminImagePermission'))
        return
      }
      const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.7 })
      if (!res.canceled && res.assets?.[0]?.uri) {
        setForm((f) => (f ? { ...f, image: res.assets[0].uri } : f))
      }
    } catch {
      Alert.alert(t('adminImageFail'))
    }
  }

  return (
    <View style={{ gap: 16 }}>
      <SectionHeader
        theme={theme}
        isRTL={isRTL}
        title="Ürünler"
        subtitle={`${filtered.length} / ${liveCatalog.length} ürün`}
      />

      <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', gap: 8, alignItems: 'center' }}>
        <View
          style={{
            flex: 1,
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
            placeholder="Ürün adı veya kod..."
            placeholderTextColor={c.muted}
            style={{ flex: 1, color: c.ink, fontWeight: '600', textAlign: isRTL ? 'right' : 'left' }}
          />
        </View>
        <Pressable
          onPress={() => openEdit(null)}
          style={{
            flexDirection: 'row',
            gap: 6,
            paddingHorizontal: 14,
            paddingVertical: 10,
            borderRadius: 12,
            backgroundColor: c.red,
            alignItems: 'center',
          }}
        >
          <Plus size={16} color="#fff" />
          <Text style={{ color: '#fff', fontWeight: '800' }}>Ekle</Text>
        </Pressable>
      </View>

      <FilterChipRow items={STOCK_FILTERS} active={stockFilter} onChange={setStockFilter} theme={theme} />

      <View style={{ gap: 8 }}>
        {filtered.slice(0, 40).map((p) => {
          const key = `${storeId}:${p.id}`
          const stock = storeOverrides[key]?.stock != null ? storeOverrides[key].stock : p.stock
          const ratio = Math.min(1, Math.max(0, stock / 50))
          const barColor = ratio < 0.15 ? c.red : ratio < 0.4 ? c.yellowDark : c.open
          return (
            <Pressable
              key={p.id}
              onPress={() => openEdit(p)}
              style={{
                flexDirection: isRTL ? 'row-reverse' : 'row',
                alignItems: 'center',
                gap: 12,
                padding: 12,
                borderRadius: theme.radius.lg,
                backgroundColor: c.card,
                borderWidth: 1,
                borderColor: c.line,
                opacity: p.disabled ? 0.55 : 1,
                ...theme.shadow.soft,
              }}
            >
              {p.image ? (
                <Image source={{ uri: p.image }} style={{ width: 48, height: 48, borderRadius: 10 }} />
              ) : (
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 10,
                    backgroundColor: c.bg,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Package size={20} color={c.muted} />
                </View>
              )}
              <View style={{ flex: 1, alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
                <Text style={{ color: c.ink, fontWeight: '800', fontSize: 13 }}>{productName(p, lang)}</Text>
                <Text style={{ color: c.muted, fontSize: 11, marginTop: 2 }}>
                  {p.id} · {p.aisle}
                </Text>
                <View
                  style={{
                    marginTop: 6,
                    height: 4,
                    borderRadius: 2,
                    backgroundColor: c.bg,
                    overflow: 'hidden',
                    width: 100,
                    alignSelf: isRTL ? 'flex-end' : 'flex-start',
                  }}
                >
                  <View
                    style={{
                      width: `${ratio * 100}%`,
                      height: '100%',
                      backgroundColor: barColor,
                    }}
                  />
                </View>
              </View>
              <View style={{ alignItems: isRTL ? 'flex-start' : 'flex-end' }}>
                <Text style={{ color: c.ink, fontWeight: '900', fontSize: 13 }}>
                  {formatIQD(p.price, lang)}
                </Text>
                <Pressable
                  onPress={() => adminToggleStock(storeId, p.id)}
                  style={{
                    marginTop: 4,
                    paddingHorizontal: 8,
                    paddingVertical: 3,
                    borderRadius: 999,
                    backgroundColor: barColor + '22',
                  }}
                >
                  <Text style={{ color: barColor, fontWeight: '800', fontSize: 11 }}>
                    {p.disabled ? 'Pasif' : `${stock} adet`}
                  </Text>
                </Pressable>
              </View>
            </Pressable>
          )
        })}
      </View>

      <Modal visible={!!form} animationType="slide" transparent>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
          <View
            style={{
              backgroundColor: c.bg,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              maxHeight: '92%',
            }}
          >
            <View
              style={{
                padding: 16,
                borderBottomWidth: 1,
                borderBottomColor: c.line,
                backgroundColor: c.card,
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                flexDirection: isRTL ? 'row-reverse' : 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Text style={{ color: c.ink, fontWeight: '900', fontSize: 18 }}>
                {form?.id ? 'Ürünü düzenle' : 'Yeni Ürün'}
              </Text>
              <Pressable onPress={() => setForm(null)} hitSlop={10}>
                <X size={20} color={c.muted} />
              </Pressable>
            </View>
            <ScrollView contentContainerStyle={{ padding: 16 }}>
              {[
                { k: 'id', label: 'ID', placeholder: 'mm-new' },
                { k: 'nameAr', label: 'İsim (AR)' },
                { k: 'nameEn', label: 'İsim (EN)' },
                { k: 'nameTr', label: 'İsim (TR)' },
                { k: 'price', label: 'Fiyat', keyboardType: 'number-pad' },
                { k: 'stock', label: 'Stok', keyboardType: 'number-pad' },
                { k: 'barcode', label: 'Barkod' },
                { k: 'image', label: 'Görsel URL' },
              ].map(({ k, label, keyboardType, placeholder }) => (
                <View key={k} style={{ marginBottom: 10 }}>
                  <Text style={{ color: c.muted, fontWeight: '800', fontSize: 11, marginBottom: 4 }}>
                    {label.toUpperCase()}
                  </Text>
                  <TextInput
                    value={form?.[k] || ''}
                    onChangeText={(v) => setForm((f) => ({ ...f, [k]: v }))}
                    placeholder={placeholder}
                    placeholderTextColor={c.muted}
                    keyboardType={keyboardType}
                    style={{
                      borderWidth: 1,
                      borderColor: c.line,
                      borderRadius: 12,
                      padding: 12,
                      color: c.ink,
                      backgroundColor: c.card,
                      fontWeight: '600',
                      textAlign: isRTL ? 'right' : 'left',
                    }}
                  />
                </View>
              ))}
              <Pressable
                onPress={pickImage}
                style={{
                  flexDirection: 'row',
                  gap: 6,
                  backgroundColor: c.yellow,
                  borderRadius: 12,
                  padding: 12,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 10,
                }}
              >
                <ImagePlus size={16} color={c.ink} />
                <Text style={{ fontWeight: '800', color: c.ink }}>Görsel Seç</Text>
              </Pressable>
              {form?.image ? (
                <Image
                  source={{ uri: form.image }}
                  style={{ width: '100%', height: 140, borderRadius: 12, marginBottom: 10 }}
                />
              ) : null}
              <Text style={{ color: c.muted, fontWeight: '800', fontSize: 11, marginBottom: 6 }}>
                KATEGORİ
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6, marginBottom: 12 }}>
                {liveAisles.filter((a) => a.enabled !== false).map((a) => (
                  <Pressable
                    key={a.id}
                    onPress={() => setForm((f) => ({ ...f, aisle: a.id }))}
                    style={{
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                      borderRadius: 999,
                      backgroundColor: form?.aisle === a.id ? c.red : c.bg,
                      borderWidth: 1,
                      borderColor: form?.aisle === a.id ? c.red : c.line,
                    }}
                  >
                    <Text style={{ color: form?.aisle === a.id ? '#fff' : c.ink, fontWeight: '700', fontSize: 12 }}>
                      {aisleLabel(a)}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
              <View
                style={{
                  flexDirection: isRTL ? 'row-reverse' : 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 10,
                }}
              >
                <Text style={{ color: c.ink, fontWeight: '700' }}>tryInRoom</Text>
                <Switch
                  value={!!form?.tryInRoom}
                  onValueChange={(v) => setForm((f) => ({ ...f, tryInRoom: v }))}
                  trackColor={{ true: c.red, false: c.line }}
                />
              </View>
              <View
                style={{
                  flexDirection: isRTL ? 'row-reverse' : 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 16,
                }}
              >
                <Text style={{ color: c.ink, fontWeight: '700' }}>Pasif</Text>
                <Switch
                  value={!!form?.disabled}
                  onValueChange={(v) => setForm((f) => ({ ...f, disabled: v }))}
                  trackColor={{ true: c.red, false: c.line }}
                />
              </View>
              <Pressable
                onPress={save}
                style={{
                  backgroundColor: c.red,
                  borderRadius: 12,
                  padding: 14,
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: '#fff', fontWeight: '900' }}>Kaydet</Text>
              </Pressable>
              {form?.id ? (
                <Pressable
                  onPress={() => {
                    adminToggleProductDisabled(form.id)
                    setForm(null)
                  }}
                  style={{ padding: 14, alignItems: 'center' }}
                >
                  <Text style={{ color: c.red, fontWeight: '700' }}>Pasif/Aktif Yap</Text>
                </Pressable>
              ) : null}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  )
}
