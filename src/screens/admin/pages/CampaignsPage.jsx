import { useState } from 'react'
import { Modal, Pressable, ScrollView, Switch, Text, TextInput, View } from 'react-native'
import { Image as ImageIcon, Megaphone, Plus, Sparkles, Ticket, Trash2, X } from 'lucide-react-native'
import { useApp } from '../../../context/AppContext'
import { useI18n } from '../../../context/I18nContext'
import SectionHeader from '../components/SectionHeader'

const emptyCampaign = () => ({
  id: '',
  titleAr: '',
  titleEn: '',
  titleTr: '',
  discount: '10',
  productIdsText: '',
  active: true,
})

const banners = [
  { id: 'b1', title: 'Hafta sonu süper indirim', status: 'active', ctr: 4.8 },
  { id: 'b2', title: 'Yeni M10+ avantajları', status: 'active', ctr: 6.2 },
  { id: 'b3', title: 'Kış kampanyası başlıyor', status: 'scheduled', ctr: 0 },
]

const stories = [
  { id: 'st1', title: 'Çifte bayram', views: 1240, expires: '2 gün' },
  { id: 'st2', title: 'Taze geldi', views: 980, expires: '5 saat' },
  { id: 'st3', title: 'M10+ özel', views: 2340, expires: '12 saat' },
]

export default function CampaignsPage({ theme, isRTL }) {
  const c = theme.colors
  const { liveCampaigns, adminUpsertCampaign, adminDeleteCampaign } = useApp()
  const { lang } = useI18n()
  const [form, setForm] = useState(null)
  const [tab, setTab] = useState('campaigns')

  const titleOf = (cc) => {
    if (lang === 'tr') return cc.titleTr || cc.titleEn
    if (lang === 'en') return cc.titleEn
    return cc.titleAr || cc.titleEn
  }

  const save = () => {
    if (!form) return
    const productIds = String(form.productIdsText || '')
      .split(/[,\s]+/)
      .map((s) => s.trim())
      .filter(Boolean)
    adminUpsertCampaign({
      id: form.id || undefined,
      titleAr: form.titleAr,
      titleEn: form.titleEn,
      titleTr: form.titleTr,
      discount: Number(form.discount) || 0,
      productIds,
      active: form.active,
    })
    setForm(null)
  }

  const tabs = [
    { id: 'campaigns', label: 'Kampanyalar' },
    { id: 'banners', label: 'Bannerlar' },
    { id: 'stories', label: 'Story' },
    { id: 'coupons', label: 'Kuponlar' },
  ]

  return (
    <View style={{ gap: 16 }}>
      <SectionHeader theme={theme} isRTL={isRTL} title="Pazarlama" subtitle="Kampanya, banner, story, kupon" />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
        {tabs.map((t) => {
          const on = t.id === tab
          return (
            <Pressable
              key={t.id}
              onPress={() => setTab(t.id)}
              style={{
                paddingHorizontal: 14,
                paddingVertical: 8,
                borderRadius: 999,
                backgroundColor: on ? c.ink : c.card,
                borderWidth: 1,
                borderColor: on ? c.ink : c.line,
              }}
            >
              <Text style={{ color: on ? '#fff' : c.ink, fontWeight: '800', fontSize: 12 }}>{t.label}</Text>
            </Pressable>
          )
        })}
      </ScrollView>

      {tab === 'campaigns' ? (
        <>
          <Pressable
            onPress={() => setForm(emptyCampaign())}
            style={{
              flexDirection: 'row',
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
            <Text style={{ color: '#fff', fontWeight: '800' }}>Yeni Kampanya</Text>
          </Pressable>

          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
            {liveCampaigns.map((cc) => (
              <View
                key={cc.id}
                style={{
                  flex: 1,
                  minWidth: 240,
                  padding: 16,
                  borderRadius: theme.radius.lg,
                  backgroundColor: c.card,
                  borderWidth: 1,
                  borderColor: c.line,
                  gap: 8,
                  ...theme.shadow.soft,
                }}
              >
                <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', justifyContent: 'space-between' }}>
                  <View
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      backgroundColor: c.red,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Megaphone size={20} color="#fff" />
                  </View>
                  <Switch
                    value={cc.active !== false}
                    onValueChange={() => adminUpsertCampaign({ ...cc, active: !cc.active })}
                    trackColor={{ true: c.red, false: c.line }}
                  />
                </View>
                <Text style={{ color: c.ink, fontWeight: '900', fontSize: 14 }}>{titleOf(cc)}</Text>
                <Text style={{ color: c.muted, fontSize: 11 }}>{cc.id}</Text>
                <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap' }}>
                  <Chip theme={theme} label={`%${cc.discount || 0}`} color={c.red} />
                  <Chip theme={theme} label={`${(cc.productIds || cc.skus || []).length} ürün`} color={c.open} />
                </View>
                <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
                  <Pressable
                    onPress={() =>
                      setForm({
                        id: cc.id,
                        titleAr: cc.titleAr || '',
                        titleEn: cc.titleEn || '',
                        titleTr: cc.titleTr || '',
                        discount: String(cc.discount ?? 0),
                        productIdsText: (cc.productIds || cc.skus || []).join(', '),
                        active: cc.active !== false,
                      })
                    }
                    style={{
                      flex: 1,
                      paddingVertical: 8,
                      borderRadius: 10,
                      backgroundColor: c.bg,
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ color: c.ink, fontWeight: '700', fontSize: 12 }}>Düzenle</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => adminDeleteCampaign(cc.id)}
                    style={{
                      paddingVertical: 8,
                      paddingHorizontal: 12,
                      borderRadius: 10,
                      backgroundColor: c.redSoft,
                      alignItems: 'center',
                    }}
                  >
                    <Trash2 size={14} color={c.red} />
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        </>
      ) : null}

      {tab === 'banners' ? (
        <View style={{ gap: 8 }}>
          {banners.map((b) => (
            <View
              key={b.id}
              style={{
                flexDirection: isRTL ? 'row-reverse' : 'row',
                alignItems: 'center',
                gap: 12,
                padding: 12,
                borderRadius: theme.radius.lg,
                backgroundColor: c.card,
                borderWidth: 1,
                borderColor: c.line,
              }}
            >
              <View
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 14,
                  backgroundColor: c.bg,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ImageIcon size={22} color={c.muted} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: c.ink, fontWeight: '800' }}>{b.title}</Text>
                <Text style={{ color: c.muted, fontSize: 11, marginTop: 2 }}>CTR: %{b.ctr}</Text>
              </View>
              <View
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  borderRadius: 999,
                  backgroundColor: b.status === 'active' ? c.openBg : c.busyBg,
                }}
              >
                <Text style={{ color: b.status === 'active' ? c.open : c.busy, fontWeight: '800', fontSize: 11 }}>
                  {b.status === 'active' ? 'Yayında' : 'Planlandı'}
                </Text>
              </View>
            </View>
          ))}
        </View>
      ) : null}

      {tab === 'stories' ? (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
          {stories.map((s) => (
            <View
              key={s.id}
              style={{
                flex: 1,
                minWidth: 200,
                padding: 14,
                borderRadius: theme.radius.lg,
                backgroundColor: c.card,
                borderWidth: 1,
                borderColor: c.line,
                gap: 6,
              }}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  backgroundColor: '#6E36F322',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Sparkles size={18} color="#6E36F3" />
              </View>
              <Text style={{ color: c.ink, fontWeight: '800' }}>{s.title}</Text>
              <Text style={{ color: c.muted, fontSize: 11 }}>{s.views} görüntülenme</Text>
              <Text style={{ color: c.red, fontSize: 11, fontWeight: '800' }}>{s.expires} sonra</Text>
            </View>
          ))}
        </View>
      ) : null}

      {tab === 'coupons' ? (
        <View
          style={{
            padding: 20,
            borderRadius: theme.radius.lg,
            backgroundColor: c.card,
            borderWidth: 1,
            borderColor: c.line,
            alignItems: 'center',
            gap: 10,
          }}
        >
          <View
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              backgroundColor: c.yellow,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ticket size={24} color={c.ink} />
          </View>
          <Text style={{ color: c.ink, fontWeight: '900', fontSize: 16 }}>Kupon sistemi</Text>
          <Text style={{ color: c.muted, textAlign: 'center', fontSize: 12 }}>
            Yakında: yüzde ve sabit tutar kuponları, müşteri segmentasyonu, otomatik kampanyalar.
          </Text>
        </View>
      ) : null}

      <Modal visible={!!form} animationType="slide" transparent>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
          <View
            style={{
              backgroundColor: c.card,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              padding: 18,
              maxHeight: '92%',
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
                {form?.id ? 'Kampanya düzenle' : 'Yeni Kampanya'}
              </Text>
              <Pressable onPress={() => setForm(null)} hitSlop={10}>
                <X size={20} color={c.muted} />
              </Pressable>
            </View>
            <ScrollView>
              {['titleAr', 'titleEn', 'titleTr'].map((k) => (
                <View key={k} style={{ marginBottom: 10 }}>
                  <Text style={{ color: c.muted, fontWeight: '800', fontSize: 11, marginBottom: 4 }}>
                    İSİM ({k.replace('title', '').toUpperCase()})
                  </Text>
                  <TextInput
                    value={form?.[k] || ''}
                    onChangeText={(v) => setForm((f) => ({ ...f, [k]: v }))}
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
              {['discount', 'productIdsText'].map((k) => (
                <View key={k} style={{ marginBottom: 10 }}>
                  <Text style={{ color: c.muted, fontWeight: '800', fontSize: 11, marginBottom: 4 }}>
                    {k === 'discount' ? 'İNDİRİM (%)' : 'ÜRÜN IDLERİ (virgülle)'}
                  </Text>
                  <TextInput
                    value={form?.[k] || ''}
                    onChangeText={(v) => setForm((f) => ({ ...f, [k]: v }))}
                    keyboardType={k === 'discount' ? 'number-pad' : 'default'}
                    multiline={k === 'productIdsText'}
                    placeholder={k === 'productIdsText' ? 'mm-eggs, mm-milk' : '10'}
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
                      minHeight: k === 'productIdsText' ? 80 : undefined,
                    }}
                  />
                </View>
              ))}
              <View
                style={{
                  flexDirection: isRTL ? 'row-reverse' : 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 12,
                }}
              >
                <Text style={{ color: c.ink, fontWeight: '700' }}>Aktif</Text>
                <Switch
                  value={form?.active !== false}
                  onValueChange={(v) => setForm((f) => ({ ...f, active: v }))}
                  trackColor={{ true: c.red, false: c.line }}
                />
              </View>
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

function Chip({ theme, label, color }) {
  const c = theme.colors
  return (
    <View
      style={{
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 999,
        backgroundColor: color + '22',
      }}
    >
      <Text style={{ color, fontWeight: '800', fontSize: 11 }}>{label}</Text>
    </View>
  )
}
