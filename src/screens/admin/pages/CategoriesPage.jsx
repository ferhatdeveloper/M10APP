import { useState } from 'react'
import { Modal, Pressable, ScrollView, Switch, Text, TextInput, View } from 'react-native'
import { Layers, Plus, Search, X } from 'lucide-react-native'
import { useApp } from '../../../context/AppContext'
import { useI18n } from '../../../context/I18nContext'
import SectionHeader from '../components/SectionHeader'
import EmptyState from '../components/EmptyState'

const empty = () => ({ id: '', nameAr: '', nameEn: '', nameTr: '', enabled: true })

export default function CategoriesPage({ theme, isRTL }) {
  const c = theme.colors
  const { liveAisles, adminUpsertAisle, adminToggleAisle } = useApp()
  const { lang, t } = useI18n()
  const [query, setQuery] = useState('')
  const [form, setForm] = useState(null)

  const labelOf = (a) => {
    if (lang === 'tr' && a.nameTr) return a.nameTr
    if (lang === 'en' && a.nameEn) return a.nameEn
    if (lang === 'ar' && a.nameAr) return a.nameAr
    const translated = t(`cats.${a.id}`)
    return translated !== `cats.${a.id}` ? translated : a.id
  }

  const list = liveAisles.filter((a) => {
    const q = query.trim().toLowerCase()
    if (!q) return true
    return [a.id, a.nameAr, a.nameEn, a.nameTr, labelOf(a)].filter(Boolean).some((s) =>
      String(s).toLowerCase().includes(q),
    )
  })

  const save = () => {
    if (!form) return
    const id =
      form.id?.trim() ||
      String(form.nameEn || form.nameTr || form.nameAr || 'aisle')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .slice(0, 24)
    adminUpsertAisle({ ...form, id })
    setForm(null)
  }

  return (
    <View style={{ gap: 16 }}>
      <SectionHeader
        theme={theme}
        isRTL={isRTL}
        title={isRTL ? 'الفئات' : 'Kategoriler'}
        subtitle={isRTL ? 'إدارة شجرة الفئات' : 'Hiyerarşi ve görünürlük'}
      />

      <View
        style={{
          flexDirection: isRTL ? 'row-reverse' : 'row',
          alignItems: 'center',
          gap: 8,
          paddingHorizontal: 12,
          paddingVertical: 10,
          backgroundColor: c.card,
          borderRadius: theme.radius.md,
          borderWidth: 1,
          borderColor: c.line,
        }}
      >
        <Search size={16} color={c.muted} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder={isRTL ? 'بحث...' : 'Kategori ara...'}
          placeholderTextColor={c.muted}
          style={{ flex: 1, color: c.ink, fontWeight: '600', textAlign: isRTL ? 'right' : 'left' }}
        />
      </View>

      <Pressable
        onPress={() => setForm(empty())}
        style={{
          flexDirection: isRTL ? 'row-reverse' : 'row',
          gap: 6,
          paddingVertical: 12,
          paddingHorizontal: 14,
          borderRadius: 12,
          backgroundColor: c.red,
          alignItems: 'center',
          alignSelf: isRTL ? 'flex-end' : 'flex-start',
        }}
      >
        <Plus size={16} color="#fff" />
        <Text style={{ color: '#fff', fontWeight: '800' }}>{isRTL ? 'فئة جديدة' : 'Yeni Kategori'}</Text>
      </Pressable>

      {list.length === 0 ? (
        <EmptyState theme={theme} icon={Layers} title="Kategori bulunamadı" hint="Filtreleri değiştir" />
      ) : (
        <View style={{ gap: 8 }}>
          {list.map((a) => (
            <View
              key={a.id}
              style={{
                flexDirection: isRTL ? 'row-reverse' : 'row',
                alignItems: 'center',
                gap: 12,
                padding: 14,
                borderRadius: theme.radius.lg,
                backgroundColor: c.card,
                borderWidth: 1,
                borderColor: c.line,
                ...theme.shadow.soft,
              }}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  backgroundColor: c.bg,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Layers size={18} color={c.ink} />
              </View>
              <Pressable onPress={() => setForm({ ...a })} style={{ flex: 1 }}>
                <Text style={{ color: c.ink, fontWeight: '800', fontSize: 14 }}>{labelOf(a)}</Text>
                <Text style={{ color: c.muted, fontSize: 11, marginTop: 2 }}>
                  ID: {a.id} · {Math.floor(Math.random() * 80) + 12} ürün
                </Text>
              </Pressable>
              <Switch
                value={a.enabled !== false}
                onValueChange={() => adminToggleAisle(a.id)}
                trackColor={{ true: c.red, false: c.line }}
              />
            </View>
          ))}
        </View>
      )}

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
                marginBottom: 12,
              }}
            >
              <Text style={{ color: c.ink, fontWeight: '900', fontSize: 18 }}>
                {form?.id ? (isRTL ? 'تعديل الفئة' : 'Kategoriyi düzenle') : isRTL ? 'فئة جديدة' : 'Yeni Kategori'}
              </Text>
              <Pressable onPress={() => setForm(null)} hitSlop={10}>
                <X size={20} color={c.muted} />
              </Pressable>
            </View>

            {['id', 'nameAr', 'nameEn', 'nameTr'].map((k) => (
              <View key={k} style={{ marginBottom: 10 }}>
                <Text style={{ color: c.muted, fontWeight: '800', fontSize: 11, marginBottom: 4 }}>
                  {k.toUpperCase()}
                </Text>
                <TextInput
                  value={form?.[k] || ''}
                  onChangeText={(v) => setForm((f) => ({ ...f, [k]: v }))}
                  placeholder={k === 'id' ? 'aisle-id' : '...'}
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

            <Pressable
              onPress={save}
              style={{
                backgroundColor: c.red,
                borderRadius: 12,
                paddingVertical: 14,
                alignItems: 'center',
                marginTop: 6,
              }}
            >
              <Text style={{ color: '#fff', fontWeight: '900' }}>
                {isRTL ? 'حفظ' : 'Kaydet'}
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  )
}
