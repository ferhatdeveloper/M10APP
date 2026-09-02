import { useState } from 'react'
import { Modal, Pressable, ScrollView, Text, View, useWindowDimensions } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useI18n } from '../../context/I18nContext'
import useAdminTheme from './hooks/useAdminTheme'
import useAdminNotifications from './hooks/useAdminNotifications'
import AdminSidebar from './AdminSidebar'
import AdminTopbar from './AdminTopbar'
import NotificationDrawer from './NotificationDrawer'
import OverviewPage from './pages/OverviewPage'
import AnalyticsPage from './pages/AnalyticsPage'
import CategoriesPage from './pages/CategoriesPage'
import ProductsPage from './pages/ProductsPage'
import InventoryPage from './pages/InventoryPage'
import CustomersPage from './pages/CustomersPage'
import CampaignsPage from './pages/CampaignsPage'
import OrdersKanbanPage from './pages/OrdersKanbanPage'
import StoresPage from './pages/StoresPage'
import StaffPage from './pages/StaffPage'
import AIPage from './pages/AIPage'
import SettingsPage from './pages/SettingsPage'

const PAGES = {
  overview: OverviewPage,
  analytics: AnalyticsPage,
  categories: CategoriesPage,
  products: ProductsPage,
  inventory: InventoryPage,
  customers: CustomersPage,
  campaigns: CampaignsPage,
  orders: OrdersKanbanPage,
  stores: StoresPage,
  staff: StaffPage,
  ai: AIPage,
  settings: SettingsPage,
}

export default function AdminShell({ navigation }) {
  const { isRTL } = useI18n()
  const { theme, toggle } = useAdminTheme()
  const notif = useAdminNotifications()
  const { width } = useWindowDimensions()
  const isCompact = width < 900
  const [section, setSection] = useState('overview')
  const [sideOpen, setSideOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)

  const PageComponent = PAGES[section] || OverviewPage

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg }} edges={[]}>
      <View style={{ flex: 1, flexDirection: isRTL ? 'row-reverse' : 'row' }}>
        {/* Desktop sidebar */}
        {!isCompact ? (
          <AdminSidebar
            theme={theme}
            activeId={section}
            onSelect={setSection}
            isRTL={isRTL}
            embedded
          />
        ) : null}

        {/* Mobile sidebar drawer */}
        {isCompact ? (
          <Modal visible={sideOpen} animationType="fade" transparent onRequestClose={() => setSideOpen(false)}>
            <View style={{ flex: 1, flexDirection: isRTL ? 'row-reverse' : 'row' }}>
              <Pressable onPress={() => setSideOpen(false)} style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.45)' }} />
              <AdminSidebar
                theme={theme}
                activeId={section}
                onSelect={(id) => {
                  setSection(id)
                  setSideOpen(false)
                }}
                onClose={() => setSideOpen(false)}
                isRTL={isRTL}
              />
            </View>
          </Modal>
        ) : null}

        <View style={{ flex: 1, minWidth: 0 }}>
          <AdminTopbar
            theme={theme}
            onOpenSidebar={() => setSideOpen(true)}
            onOpenNotifications={() => setNotifOpen(true)}
            onToggleTheme={toggle}
            unreadCount={notif.unreadCount}
          />

          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ padding: 20, paddingBottom: 60 }}
          >
            <PageComponent theme={theme} isRTL={isRTL} navigation={navigation} />
          </ScrollView>
        </View>
      </View>

      <NotificationDrawer
        visible={notifOpen}
        onClose={() => setNotifOpen(false)}
        items={notif.items}
        kindColors={notif.KIND_COLOR}
        onMarkAllRead={notif.markAllRead}
        isRTL={isRTL}
        theme={theme}
      />
    </SafeAreaView>
  )
}
