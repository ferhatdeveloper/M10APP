import { Bell, CheckCheck, Clock, Package, Sparkles, UserPlus, Boxes, X } from 'lucide-react-native'
import { Modal, Pressable, ScrollView, Text, View } from 'react-native'
import { useI18n } from '../../context/I18nContext'

const KIND_ICON = {
  order: Package,
  stock: Boxes,
  campaign: Sparkles,
  customer: UserPlus,
  system: Bell,
}

export default function NotificationDrawer({ visible, onClose, items, kindColors, onMarkAllRead, isRTL, theme }) {
  const c = theme.colors

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={{ flex: 1, flexDirection: isRTL ? 'row-reverse' : 'row' }}>
        <Pressable onPress={onClose} style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.45)' }} />
        <View
          style={{
            width: '85%',
            maxWidth: 380,
            height: '100%',
            backgroundColor: c.card,
            borderLeftWidth: isRTL ? 1 : 0,
            borderRightWidth: isRTL ? 0 : 1,
            borderColor: c.line,
          }}
        >
          <View
            style={{
              flexDirection: isRTL ? 'row-reverse' : 'row',
              alignItems: 'center',
              paddingHorizontal: 18,
              paddingVertical: 16,
              borderBottomWidth: 1,
              borderBottomColor: c.line,
              gap: 10,
            }}
          >
            <Bell size={18} color={c.red} />
            <Text style={{ flex: 1, fontWeight: '900', fontSize: 16, color: c.ink }}>
              {isRTL ? 'الإشعارات' : 'Bildirimler'}
            </Text>
            <Pressable onPress={onMarkAllRead} hitSlop={10} style={{ flexDirection: 'row', gap: 4, alignItems: 'center' }}>
              <CheckCheck size={14} color={c.muted} />
              <Text style={{ color: c.muted, fontSize: 11, fontWeight: '700' }}>
                {isRTL ? 'قراءة الكل' : 'Tümünü okundu işaretle'}
              </Text>
            </Pressable>
            <Pressable onPress={onClose} hitSlop={10}>
              <X size={20} color={c.muted} />
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={{ padding: 12, gap: 8 }}>
            {items.length === 0 ? (
              <Text style={{ color: c.muted, textAlign: 'center', paddingVertical: 32 }}>
                {isRTL ? 'لا توجد إشعارات' : 'Bildirim yok'}
              </Text>
            ) : (
              items.map((n) => {
                const Icon = KIND_ICON[n.kind] || Bell
                const color = kindColors[n.kind] || c.ink
                return (
                  <View
                    key={n.id}
                    style={{
                      flexDirection: isRTL ? 'row-reverse' : 'row',
                      gap: 10,
                      padding: 12,
                      borderRadius: 12,
                      backgroundColor: n.read ? 'transparent' : c.bg,
                      borderWidth: 1,
                      borderColor: c.line,
                    }}
                  >
                    <View
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        backgroundColor: color + '22',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Icon size={16} color={color} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontWeight: '800', color: c.ink, fontSize: 13 }}>{n.title}</Text>
                      <Text style={{ color: c.muted, fontSize: 12, marginTop: 2 }}>{n.body}</Text>
                      <View
                        style={{
                          flexDirection: isRTL ? 'row-reverse' : 'row',
                          alignItems: 'center',
                          gap: 4,
                          marginTop: 6,
                        }}
                      >
                        <Clock size={11} color={c.muted} />
                        <Text style={{ color: c.muted, fontSize: 11, fontWeight: '600' }}>
                          {formatAgo(n.minutesAgo, isRTL)}
                        </Text>
                      </View>
                    </View>
                  </View>
                )
              })
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  )
}

function formatAgo(min, isRTL) {
  if (min < 1) return isRTL ? 'الآن' : 'şimdi'
  if (min < 60) return isRTL ? `قبل ${min} دقيقة` : `${min} dk önce`
  const h = Math.floor(min / 60)
  return isRTL ? `قبل ${h} ساعة` : `${h} sa önce`
}
