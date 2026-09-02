import { LayoutDashboard, BarChart3, Layers, Package, Boxes, Users, Megaphone, ClipboardList, Store, UserCog, Sparkles, Settings as SettingsIcon, X } from 'lucide-react-native'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { useI18n } from '../../context/I18nContext'

export const NAV_ITEMS = [
  { id: 'overview', icon: LayoutDashboard, group: 'core' },
  { id: 'analytics', icon: BarChart3, group: 'core' },
  { id: 'categories', icon: Layers, group: 'catalog' },
  { id: 'products', icon: Package, group: 'catalog' },
  { id: 'inventory', icon: Boxes, group: 'catalog' },
  { id: 'customers', icon: Users, group: 'commerce' },
  { id: 'campaigns', icon: Megaphone, group: 'commerce' },
  { id: 'orders', icon: ClipboardList, group: 'commerce' },
  { id: 'stores', icon: Store, group: 'operations' },
  { id: 'staff', icon: UserCog, group: 'operations' },
  { id: 'ai', icon: Sparkles, group: 'system' },
  { id: 'settings', icon: SettingsIcon, group: 'system' },
]

const GROUP_LABELS = {
  core: { tr: 'Genel', en: 'Core', ar: 'الأساسية' },
  catalog: { tr: 'Katalog', en: 'Catalog', ar: 'الكتالوج' },
  commerce: { tr: 'Ticaret', en: 'Commerce', ar: 'التجارة' },
  operations: { tr: 'Operasyon', en: 'Operations', ar: 'العمليات' },
  system: { tr: 'Sistem', en: 'System', ar: 'النظام' },
}

export default function AdminSidebar({ theme, activeId, onSelect, onClose, isRTL, embedded = false }) {
  const { lang } = useI18n()
  const c = theme.colors
  const radius = theme.radius

  const groups = ['core', 'catalog', 'commerce', 'operations', 'system']

  return (
    <View
      style={{
        width: 256,
        height: '100%',
        backgroundColor: c.card,
        borderRightWidth: isRTL ? 0 : 1,
        borderLeftWidth: isRTL ? 1 : 0,
        borderColor: c.line,
        flexDirection: 'column',
      }}
    >
      {/* Brand */}
      <View
        style={{
          flexDirection: isRTL ? 'row-reverse' : 'row',
          alignItems: 'center',
          gap: 10,
          paddingHorizontal: 18,
          paddingVertical: 18,
          borderBottomWidth: 1,
          borderBottomColor: c.line,
        }}
      >
        <View
          style={{
            width: 38,
            height: 38,
            borderRadius: 12,
            backgroundColor: c.red,
            alignItems: 'center',
            justifyContent: 'center',
            ...theme.shadow.soft,
          }}
        >
          <Text style={{ color: '#fff', fontWeight: '900', fontSize: 16 }}>M</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontWeight: '900', fontSize: 16, color: c.ink }}>M10 Admin</Text>
          <Text style={{ color: c.muted, fontSize: 11, fontWeight: '600' }}>YAA Supermarket</Text>
        </View>
        {!embedded && onClose ? (
          <Pressable onPress={onClose} hitSlop={10}>
            <X size={20} color={c.muted} />
          </Pressable>
        ) : null}
      </View>

      <ScrollView contentContainerStyle={{ paddingVertical: 10, paddingHorizontal: 10 }}>
        {groups.map((g) => {
          const items = NAV_ITEMS.filter((it) => it.group === g)
          return (
            <View key={g} style={{ marginBottom: 14 }}>
              <Text
                style={{
                  fontSize: 10,
                  fontWeight: '800',
                  letterSpacing: 1,
                  textTransform: 'uppercase',
                  color: c.muted,
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  textAlign: isRTL ? 'right' : 'left',
                }}
              >
                {GROUP_LABELS[g][lang] || GROUP_LABELS[g].en}
              </Text>
              {items.map((it) => {
                const Icon = it.icon
                const active = it.id === activeId
                return (
                  <Pressable
                    key={it.id}
                    onPress={() => onSelect(it.id)}
                    style={({ pressed }) => ({
                      flexDirection: isRTL ? 'row-reverse' : 'row',
                      alignItems: 'center',
                      gap: 12,
                      paddingHorizontal: 12,
                      paddingVertical: 10,
                      marginVertical: 1,
                      borderRadius: radius.md,
                      backgroundColor: active ? c.red : pressed ? c.bg : 'transparent',
                      position: 'relative',
                    })}
                  >
                    {active ? (
                      <View
                        style={{
                          position: 'absolute',
                          [isRTL ? 'right' : 'left']: -10,
                          top: 8,
                          bottom: 8,
                          width: 3,
                          borderRadius: 2,
                          backgroundColor: c.red,
                        }}
                      />
                    ) : null}
                    <Icon size={18} color={active ? '#fff' : c.ink} />
                    <Text
                      style={{
                        color: active ? '#fff' : c.ink,
                        fontWeight: active ? '800' : '600',
                        fontSize: 13,
                        flex: 1,
                        textAlign: isRTL ? 'right' : 'left',
                      }}
                    >
                      {labelFor(it.id, lang)}
                    </Text>
                  </Pressable>
                )
              })}
            </View>
          )
        })}
      </ScrollView>

      {/* Footer status */}
      <View
        style={{
          paddingHorizontal: 14,
          paddingVertical: 12,
          borderTopWidth: 1,
          borderTopColor: c.line,
          flexDirection: isRTL ? 'row-reverse' : 'row',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: c.open }} />
        <Text style={{ color: c.muted, fontSize: 11, fontWeight: '700' }}>
          {lang === 'tr' ? 'Tüm sistemler normal' : lang === 'ar' ? 'كل الأنظمة تعمل' : 'All systems normal'}
        </Text>
      </View>
    </View>
  )
}

function labelFor(id, lang) {
  const dict = {
    overview: { tr: 'Genel Bakış', en: 'Overview', ar: 'نظرة عامة' },
    analytics: { tr: 'Analitik', en: 'Analytics', ar: 'التحليلات' },
    categories: { tr: 'Kategoriler', en: 'Categories', ar: 'الفئات' },
    products: { tr: 'Ürünler', en: 'Products', ar: 'المنتجات' },
    inventory: { tr: 'Stok Yönetimi', en: 'Inventory', ar: 'المخزون' },
    customers: { tr: 'Müşteriler', en: 'Customers', ar: 'العملاء' },
    campaigns: { tr: 'Kampanyalar', en: 'Campaigns', ar: 'الحملات' },
    orders: { tr: 'Siparişler', en: 'Orders', ar: 'الطلبات' },
    stores: { tr: 'Mağazalar', en: 'Stores', ar: 'المتاجر' },
    staff: { tr: 'Personel', en: 'Staff', ar: 'الموظفون' },
    ai: { tr: 'Yapay Zeka', en: 'AI', ar: 'الذكاء الاصطناعي' },
    settings: { tr: 'Ayarlar', en: 'Settings', ar: 'الإعدادات' },
  }
  return dict[id]?.[lang] || dict[id]?.en || id
}
