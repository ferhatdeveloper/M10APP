import { Alert, ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import {
  Bell,
  Bike,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  FileText,
  Gift,
  Headphones,
  Heart,
  Languages,
  ListChecks,
  LogOut,
  MapPin,
  Receipt,
  Settings2,
  Shield,
  Sparkles,
  UserPlus,
  Wallet,
} from 'lucide-react-native'
import TopBar from '../components/TopBar'
import SoftPress from '../components/SoftPress'
import Logo from '../components/Logo'
import { useApp } from '../context/AppContext'
import { useI18n } from '../context/I18nContext'
import { colors, shadow } from '../theme'

function MenuRow({ icon: Icon, label, hint, onPress, isRTL, last }) {
  const Chevron = isRTL ? ChevronLeft : ChevronRight
  return (
    <SoftPress
      onPress={onPress}
      style={{
        padding: 14,
        flexDirection: isRTL ? 'row-reverse' : 'row',
        alignItems: 'center',
        gap: 12,
        borderBottomWidth: last ? 0 : 1,
        borderBottomColor: colors.line,
      }}
    >
      <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: colors.redSoft, alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={18} color={colors.red} />
      </View>
      <View style={{ flex: 1, alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
        <Text style={{ fontWeight: '800', textAlign: isRTL ? 'right' : 'left' }}>{label}</Text>
        {hint ? <Text style={{ color: colors.muted, marginTop: 2, textAlign: isRTL ? 'right' : 'left' }}>{hint}</Text> : null}
      </View>
      <Chevron size={18} color="#BBB" />
    </SoftPress>
  )
}

function safeNavigate(navigation, name, params) {
  try {
    const root = navigation.getParent?.() || navigation
    const state = root.getState?.()
    const exists = state?.routeNames?.includes(name)
    if (!exists) {
      console.warn('[M10] navigate: route not found', name)
      return false
    }
  } catch {
    /* fall through */
  }
  try {
    navigation.navigate(name, params)
    return true
  } catch (e) {
    console.warn('[M10] navigate crashed', name, e?.message)
    return false
  }
}

function resetTo(navigation, name) {
  const root = navigation.getParent?.() || navigation
  if (typeof root.reset === 'function') {
    try {
      root.reset({ index: 0, routes: [{ name }] })
      return
    } catch {
      /* fall through */
    }
  }
  safeNavigate(navigation, name)
}

export default function ProfileScreen({ navigation }) {
  const { user, isLoggedIn, logout, hydrated, plusActive, setUserRole, setAppDemoMode, isCourier, isAdmin } = useApp()
  const { t, lang, setLang, langs, isRTL, dirMode, setDirMode } = useI18n()

  const goLogin = () => safeNavigate(navigation, 'Login')

  const goAdmin = () => {
    if (isAdmin) setAppDemoMode('admin')
    safeNavigate(navigation, 'Admin')
  }

  const applyRole = (role) => {
    setUserRole(role)
    if (role === 'courier') resetTo(navigation, 'CourierHome')
    else if (role === 'admin') goAdmin()
    else resetTo(navigation, 'Tabs')
  }

  const links = [
    { to: 'Notifications', icon: Bell, label: t('notifications') },
    { to: 'Plus', icon: Sparkles, label: t('plusTitle'), hint: plusActive ? t('plusMember') : t('plusHint') },
    { to: 'Wallet', icon: Wallet, label: t('walletTitle'), hint: t('walletMenuHint') },
    { to: 'Referral', icon: UserPlus, label: t('referralTitle'), hint: t('referralMenuHint') },
    { to: 'Lists', icon: ListChecks, label: t('listsTitle'), hint: t('listsMenuHint') },
    { to: 'Orders', icon: Receipt, label: t('orders') },
    { to: 'Favorites', icon: Heart, label: t('favorites') },
    { to: 'Addresses', icon: MapPin, label: t('addresses') },
    { to: 'Rewards', icon: Gift, label: t('rewards') },
    { to: 'Butler', icon: Sparkles, label: t('butler') },
    { to: 'Admin', icon: Settings2, label: t('adminTitle'), hint: t('adminMenuHint') },
    { to: 'Presentation', icon: BookOpen, label: t('documentation'), hint: t('documentationHint') },
  ]

  if (!hydrated) {
    return <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={[]} />
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={[]}>
      <TopBar title={t('profile')} onBell={() => safeNavigate(navigation, 'Notifications')} />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
        {isLoggedIn ? (
          <View
            style={{
              backgroundColor: colors.card,
              borderRadius: 18,
              padding: 16,
              borderLeftWidth: 3,
              borderLeftColor: colors.red,
              ...shadow.card,
            }}
          >
            <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', gap: 12, alignItems: 'center' }}>
              <Logo size={64} />
              <View style={{ flex: 1, alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
                <Text style={{ color: colors.ink, fontSize: 22, fontWeight: '800', textAlign: isRTL ? 'right' : 'left' }}>
                  {user.name}
                </Text>
                <Text style={{ color: colors.muted }}>{user.phone}</Text>
                <Text style={{ color: colors.red, fontWeight: '800', marginTop: 6 }}>
                  {user.tier} · <Text style={{ color: colors.ink }}>{user.points} {t('points')}</Text>
                </Text>
                <Text style={{ color: colors.muted, marginTop: 4, fontWeight: '700' }}>
                  {t('roleLabel')}: {t(`demoMode.${isAdmin ? 'admin' : isCourier ? 'courier' : 'customer'}`)}
                </Text>
              </View>
            </View>
          </View>
        ) : (
          <View style={{ backgroundColor: colors.card, borderRadius: 18, padding: 16, ...shadow.card }}>
            <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', gap: 12, alignItems: 'center' }}>
              <Logo size={56} />
              <View style={{ flex: 1, alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
                <Text style={{ color: colors.ink, fontSize: 20, fontWeight: '800', textAlign: isRTL ? 'right' : 'left' }}>
                  {t('welcomeGuest')}
                </Text>
                <Text style={{ color: colors.muted, marginTop: 4, textAlign: isRTL ? 'right' : 'left' }}>{t('loginHint')}</Text>
              </View>
            </View>
            <SoftPress
              onPress={goLogin}
              style={{ backgroundColor: colors.red, borderRadius: 14, padding: 14, alignItems: 'center', marginTop: 16 }}
            >
              <Text style={{ color: '#fff', fontWeight: '800', fontSize: 16 }}>{t('loginSignup')}</Text>
            </SoftPress>
          </View>
        )}

        <View style={{ backgroundColor: '#fff', borderRadius: 18, padding: 14, ...shadow.soft }}>
          <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <Bike size={18} color={colors.red} />
            <Text style={{ fontWeight: '800' }}>{t('demoRoleTitle')}</Text>
          </View>
          <Text style={{ color: colors.muted, marginBottom: 10, textAlign: isRTL ? 'right' : 'left', fontSize: 12 }}>
            {t('demoRoleHint')}
          </Text>
          <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', gap: 8 }}>
            {['customer', 'admin', 'courier'].map((role) => {
              const current = isAdmin ? 'admin' : isCourier ? 'courier' : 'customer'
              const on = current === role
              return (
                <SoftPress
                  key={role}
                  onPress={() => applyRole(role)}
                  style={{
                    flex: 1,
                    paddingVertical: 12,
                    borderRadius: 12,
                    alignItems: 'center',
                    backgroundColor: on ? colors.yellow : colors.bg,
                    borderWidth: 1,
                    borderColor: on ? colors.yellowDark : colors.line,
                  }}
                >
                  <Text style={{ fontWeight: '800', color: colors.ink, fontSize: 12 }}>{t(`demoMode.${role}`)}</Text>
                </SoftPress>
              )
            })}
          </View>
        </View>

        <View style={{ backgroundColor: '#fff', borderRadius: 18, padding: 14, ...shadow.soft }}>
          <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <Languages size={18} color={colors.red} />
            <Text style={{ fontWeight: '800' }}>{t('language')}</Text>
          </View>
          {langs.map((l) => {
            const on = lang === l.id
            return (
              <SoftPress
                key={l.id}
                onPress={() => setLang(l.id)}
                style={{
                  padding: 12,
                  borderRadius: 12,
                  marginBottom: 6,
                  backgroundColor: on ? colors.redSoft : colors.bg,
                  flexDirection: isRTL ? 'row-reverse' : 'row',
                  justifyContent: 'space-between',
                }}
              >
                <Text style={{ fontWeight: '800', color: on ? colors.red : colors.ink }}>{l.native}</Text>
                <Text style={{ color: colors.muted }}>{l.id.toUpperCase()}</Text>
              </SoftPress>
            )
          })}
        </View>

        <View style={{ backgroundColor: '#fff', borderRadius: 18, padding: 14, ...shadow.soft }}>
          <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <Settings2 size={18} color={colors.red} />
            <Text style={{ fontWeight: '800' }}>{t('layoutDirection')}</Text>
          </View>
          <Text style={{ color: colors.muted, fontSize: 12, marginBottom: 10, textAlign: isRTL ? 'right' : 'left' }}>
            {t('layoutDirectionHint')}
          </Text>
          {[
            { id: 'auto', label: t('dirAuto'), hint: t('dirAutoHint') },
            { id: 'rtl', label: t('dirRtl'), hint: t('dirRtlHint') },
            { id: 'ltr', label: t('dirLtr'), hint: t('dirLtrHint') },
          ].map((opt) => {
            const on = dirMode === opt.id
            return (
              <SoftPress
                key={opt.id}
                onPress={() => setDirMode(opt.id)}
                style={{
                  padding: 12,
                  borderRadius: 12,
                  marginBottom: 6,
                  backgroundColor: on ? colors.redSoft : colors.bg,
                  borderWidth: 1,
                  borderColor: on ? colors.red : colors.line,
                }}
              >
                <Text style={{ fontWeight: '800', color: on ? colors.red : colors.ink }}>{opt.label}</Text>
                <Text style={{ color: colors.muted, fontSize: 12, marginTop: 2 }}>{opt.hint}</Text>
              </SoftPress>
            )
          })}
        </View>

        {isLoggedIn ? (
          <View style={{ backgroundColor: '#fff', borderRadius: 18, overflow: 'hidden', ...shadow.soft }}>
            {links.map((item) => (
              <MenuRow
                key={item.to}
                icon={item.icon}
                label={item.label}
                hint={item.hint}
                onPress={() => (item.to === 'Admin' ? goAdmin() : safeNavigate(navigation, item.to))}
                isRTL={isRTL}
                last={false}
              />
            ))}
            <MenuRow
              icon={Headphones}
              label={t('support')}
              hint={t('helpHint')}
              onPress={() => safeNavigate(navigation, 'Support')}
              isRTL={isRTL}
              last
            />
          </View>
        ) : (
          <View style={{ backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden' }}>
            <MenuRow
              icon={BookOpen}
              label={t('documentation')}
              hint={t('documentationHint')}
              onPress={() => safeNavigate(navigation, 'Presentation')}
              isRTL={isRTL}
            />
            <MenuRow
              icon={Settings2}
              label={t('adminTitle')}
              hint={t('adminMenuHint')}
              onPress={goAdmin}
              isRTL={isRTL}
            />
            <MenuRow
              icon={Bell}
              label={t('notifications')}
              onPress={() => safeNavigate(navigation, 'Notifications')}
              isRTL={isRTL}
            />
            <MenuRow
              icon={Headphones}
              label={t('helpCenter')}
              hint={t('helpHint')}
              onPress={() => safeNavigate(navigation, 'Support')}
              isRTL={isRTL}
            />
            <MenuRow
              icon={FileText}
              label={t('terms')}
              onPress={() => safeNavigate(navigation, 'Support')}
              isRTL={isRTL}
            />
            <MenuRow
              icon={Shield}
              label={t('privacy')}
              onPress={() => safeNavigate(navigation, 'Support')}
              isRTL={isRTL}
              last
            />
          </View>
        )}

        {isLoggedIn ? (
          <SoftPress
            onPress={() =>
              Alert.alert(t('logout'), t('logoutConfirm'), [
                { text: t('cancel'), style: 'cancel' },
                { text: t('logout'), style: 'destructive', onPress: logout },
              ])
            }
            style={{
              borderWidth: 1,
              borderColor: '#FFD4D8',
              borderRadius: 14,
              padding: 14,
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            <LogOut size={18} color={colors.red} />
            <Text style={{ color: colors.red, fontWeight: '800' }}>{t('logout')}</Text>
          </SoftPress>
        ) : (
          <SoftPress onPress={goLogin} style={{ padding: 14, alignItems: 'center' }}>
            <Text style={{ color: colors.red, fontWeight: '800', fontSize: 16 }}>{t('loginSignup')}</Text>
          </SoftPress>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}
