import { Alert, Pressable, Switch, Text, View } from 'react-native'
import { Bell, Download, Globe, Lock, Moon, Trash2, Upload } from 'lucide-react-native'
import { useApp } from '../../../context/AppContext'
import { useI18n } from '../../../context/I18nContext'
import useAdminTheme from '../hooks/useAdminTheme'
import SectionHeader from '../components/SectionHeader'

export default function SettingsPage({ theme, isRTL }) {
  const c = theme.colors
  const { isAdminAccess, setAppDemoMode, demoMode } = useApp()
  const { lang, setLang } = useI18n()
  const { mode, setMode } = useAdminTheme()

  const Row = ({ icon: Icon, title, subtitle, control, danger }) => (
    <View
      style={{
        flexDirection: isRTL ? 'row-reverse' : 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: theme.radius.lg,
        backgroundColor: c.card,
        borderWidth: 1,
        borderColor: c.line,
        gap: 12,
      }}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          backgroundColor: (danger ? c.red : c.ink) + '22',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon size={18} color={danger ? c.red : c.ink} />
      </View>
      <View style={{ flex: 1, alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
        <Text style={{ color: c.ink, fontWeight: '800', fontSize: 13 }}>{title}</Text>
        {subtitle ? (
          <Text style={{ color: c.muted, fontSize: 11, marginTop: 2 }}>{subtitle}</Text>
        ) : null}
      </View>
      {control}
    </View>
  )

  return (
    <View style={{ gap: 16 }}>
      <SectionHeader theme={theme} isRTL={isRTL} title="Ayarlar" subtitle="Bildirim, tema, dil, veri" />

      <SectionHeader theme={theme} isRTL={isRTL} title="Görünüm" subtitle="Tema ve dil" />
      <View style={{ gap: 8 }}>
        <Row
          icon={Moon}
          title="Koyu tema"
          subtitle="Gözleri yormayan koyu arka plan"
          control={<Switch value={mode === 'dark'} onValueChange={(v) => setMode(v ? 'dark' : 'light')} trackColor={{ true: c.red, false: c.line }} />}
        />
        <Row
          icon={Globe}
          title="Dil"
          subtitle={`Mevcut: ${lang === 'tr' ? 'Türkçe' : lang === 'ar' ? 'العربية' : 'English'}`}
          control={
            <View style={{ flexDirection: 'row', gap: 6 }}>
              {['tr', 'en', 'ar'].map((l) => (
                <Pressable
                  key={l}
                  onPress={() => setLang(l)}
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                    borderRadius: 999,
                    backgroundColor: lang === l ? c.red : c.bg,
                    borderWidth: 1,
                    borderColor: lang === l ? c.red : c.line,
                  }}
                >
                  <Text style={{ color: lang === l ? '#fff' : c.ink, fontWeight: '800', fontSize: 11 }}>
                    {l.toUpperCase()}
                  </Text>
                </Pressable>
              ))}
            </View>
          }
        />
      </View>

      <SectionHeader theme={theme} isRTL={isRTL} title="Bildirimler" subtitle="Hangi uyarıları alacaksın" />
      <View style={{ gap: 8 }}>
        {[
          { label: 'Yeni siparişler', on: true },
          { label: 'Düşük stok uyarısı', on: true },
          { label: 'Kampanya hatırlatıcı', on: false },
          { label: 'Müşteri kaydı', on: true },
          { label: 'Sistem mesajları', on: false },
        ].map((row, i) => (
          <Row
            key={i}
            icon={Bell}
            title={row.label}
            subtitle={row.on ? 'Açık' : 'Kapalı'}
            control={
              <Switch
                value={row.on}
                onValueChange={() => {}}
                trackColor={{ true: c.red, false: c.line }}
              />
            }
          />
        ))}
      </View>

      <SectionHeader theme={theme} isRTL={isRTL} title="Veri" subtitle="Dışa aktar, içe aktar, sıfırla" />
      <View style={{ gap: 8 }}>
        <Row
          icon={Download}
          title="CSV olarak dışa aktar"
          subtitle="Ürünler, müşteriler, siparişler"
          control={
            <Pressable
              onPress={() => Alert.alert('Demo', 'CSV export yakında')}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 10,
                backgroundColor: c.bg,
              }}
            >
              <Text style={{ color: c.ink, fontWeight: '800', fontSize: 12 }}>İndir</Text>
            </Pressable>
          }
        />
        <Row
          icon={Upload}
          title="Verileri içe aktar"
          subtitle="CSV / JSON"
          control={
            <Pressable
              onPress={() => Alert.alert('Demo', 'Import yakında')}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 10,
                backgroundColor: c.bg,
              }}
            >
              <Text style={{ color: c.ink, fontWeight: '800', fontSize: 12 }}>Seç</Text>
            </Pressable>
          }
        />
        <Row
          icon={Trash2}
          title="Demo verileri sıfırla"
          subtitle="Tüm local state temizlenir"
          danger
          control={
            <Pressable
              onPress={() => Alert.alert('Onay', 'Tüm demo verileri silinecek. Devam edilsin mi?')}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 10,
                backgroundColor: c.redSoft,
              }}
            >
              <Text style={{ color: c.red, fontWeight: '800', fontSize: 12 }}>Sıfırla</Text>
            </Pressable>
          }
        />
      </View>

      <SectionHeader theme={theme} isRTL={isRTL} title="Demo Modu" subtitle="Farklı rolleri test et" />
      <View
        style={{
          flexDirection: 'row',
          gap: 8,
          padding: 12,
          borderRadius: theme.radius.lg,
          backgroundColor: c.card,
          borderWidth: 1,
          borderColor: c.line,
        }}
      >
        {['customer', 'admin', 'courier'].map((m) => {
          const on = demoMode === m
          return (
            <Pressable
              key={m}
              onPress={() => setAppDemoMode(m)}
              style={{
                flex: 1,
                paddingVertical: 12,
                borderRadius: 10,
                alignItems: 'center',
                backgroundColor: on ? c.red : c.bg,
              }}
            >
              <Text style={{ color: on ? '#fff' : c.ink, fontWeight: '900', fontSize: 12 }}>
                {m === 'customer' ? 'Müşteri' : m === 'admin' ? 'Admin' : 'Kurye'}
              </Text>
            </Pressable>
          )
        })}
      </View>

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
        <Lock size={18} color={c.yellow} />
        <View style={{ flex: 1 }}>
          <Text style={{ color: '#fff', fontWeight: '800' }}>Admin PIN koruması</Text>
          <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>
            Her oturum açılışında PIN sorulur.
          </Text>
        </View>
      </View>
    </View>
  )
}
