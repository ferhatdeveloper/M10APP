import { lazy, Suspense, useMemo, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
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
import {
  LayoutDashboard,
  Layers,
  Package,
  Users,
  Megaphone,
  ClipboardList,
  Store,
  Plus,
  Search,
  ImagePlus,
  Lock,
  Sparkles,
  MessageCircle,
  Bike,
  BookOpen,
  Wand2,
} from 'lucide-react-native'
import AdminChrome, { AdminGateLayout } from '../components/AdminChrome'
import { useApp } from '../context/AppContext'
import { useI18n } from '../context/I18nContext'
import { useShell } from '../context/ShellContext'
import { useWebLayout } from '../layout/web'
import {
  ADMIN_PIN,
  DEFAULT_STORE_ID,
  DEMO_ACCOUNTS,
  formatIQD,
  productName,
  storeName,
} from '../data/mock'
import { colors } from '../theme'
import AdminOverview from './admin/AdminOverview'
import AdminFeedback from './admin/AdminFeedback'
import AdminCouriers from './admin/AdminCouriers'
import { ProductAiImageButton, ProductBatchTranslateBar, SelectDot } from './admin/ProductAiTools'

const STATUSES = ['confirmed', 'preparing', 'onway', 'delivered', 'cancelled']
const SECTIONS = [
  { id: 'overview', icon: LayoutDashboard },
  { id: 'categories', icon: Layers },
  { id: 'products', icon: Package },
  { id: 'customers', icon: Users },
  { id: 'campaigns', icon: Megaphone },
  { id: 'orders', icon: ClipboardList },
  { id: 'feedback', icon: MessageCircle },
  { id: 'couriers', icon: Bike },
  { id: 'stores', icon: Store },
  { id: 'ai', icon: Sparkles },
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

const AdminAI = lazy(() => import('./AdminAI'))

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

const emptyCampaign = () => ({
  id: '',
  titleAr: '',
  titleEn: '',
  titleTr: '',
  discount: '10',
  productIdsText: '',
  active: true,
})

function Chip({ label, on, onPress, isRTL }) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        backgroundColor: on ? colors.red : colors.bg,
        borderRadius: 999,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderWidth: on ? 0 : 1,
        borderColor: colors.line,
      }}
    >
      <Text style={{ fontWeight: '800', fontSize: 12, color: on ? '#fff' : colors.ink, textAlign: isRTL ? 'right' : 'left' }}>
        {label}
      </Text>
    </Pressable>
  )
}

function Field({ label, value, onChangeText, isRTL, keyboardType, multiline, placeholder }) {
  return (
    <View style={{ marginBottom: 10 }}>
      <Text style={{ fontWeight: '700', fontSize: 12, color: colors.muted, marginBottom: 4, textAlign: isRTL ? 'right' : 'left' }}>
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        multiline={multiline}
        placeholder={placeholder}
        placeholderTextColor="#AAA"
        style={{
          borderWidth: 1,
          borderColor: colors.line,
          borderRadius: 10,
          padding: 12,
          backgroundColor: '#fff',
          textAlign: isRTL ? 'right' : 'left',
          minHeight: multiline ? 72 : undefined,
        }}
      />
    </View>
  )
}

export default function AdminScreen() {
  const {
    orders,
    accounts,
    user,
    liveCatalog,
    liveAisles,
    liveCampaigns,
    liveStores,
    storeOverrides,
    adminSetOrderStatus,
    adminToggleStock,
    adminUpsertProduct,
    adminToggleProductDisabled,
    adminUpsertAisle,
    adminToggleAisle,
    adminUpsertCampaign,
    adminDeleteCampaign,
    adminUpdateStore,
    adminSetCustomerPoints,
    adminAddProductsToCampaign,
    adminUpsertCourier,
    adminToggleCourier,
    adminDeleteCourier,
    couriers,
    surveys,
    unlockAdmin,
    isAdminAccess,
    setOfflineSim,
    simulateOffline,
    setAppDemoMode,
    demoMode,
  } = useApp()
  const { t, lang, isRTL } = useI18n()
  const { openStorefront } = useShell()
  const { desktop } = useWebLayout()
  const [section, setSection] = useState('overview')
  const [pin, setPin] = useState('')
  const [pinError, setPinError] = useState(false)
  const [productQuery, setProductQuery] = useState('')
  const [productForm, setProductForm] = useState(null)
  const [aisleForm, setAisleForm] = useState(null)
  const [campaignForm, setCampaignForm] = useState(null)
  const [pointsEdit, setPointsEdit] = useState({})
  const [selectedProductIds, setSelectedProductIds] = useState([])

  const storeId = DEFAULT_STORE_ID
  const aisleLabel = (a) => {
    if (!a) return ''
    if (lang === 'tr' && a.nameTr) return a.nameTr
    if (lang === 'en' && a.nameEn) return a.nameEn
    if (lang === 'ar' && a.nameAr) return a.nameAr
    return t(`cats.${a.id}`) !== `cats.${a.id}` ? t(`cats.${a.id}`) : a.id
  }

  const enabledProducts = liveCatalog.filter((p) => !p.disabled).length

  const customers = useMemo(() => {
    const map = new Map()
    for (const demo of DEMO_ACCOUNTS) {
      const key = String(demo.phone).replace(/\D/g, '')
      map.set(key, {
        phone: demo.phone,
        name: demo.nameTr || demo.nameEn || demo.name,
        points: 0,
        role: demo.role || 'customer',
        ordersCount: 0,
      })
    }
    for (const [key, acc] of Object.entries(accounts || {})) {
      const prev = map.get(key) || {}
      map.set(key, {
        phone: acc.phone || prev.phone || key,
        name: acc.name || prev.name || key,
        points: acc.points ?? prev.points ?? 0,
        role: acc.role || prev.role || 'customer',
        ordersCount: prev.ordersCount || 0,
      })
    }
    if (user?.loggedIn && user.phone) {
      const key = String(user.phone).replace(/\D/g, '')
      const prev = map.get(key) || {}
      map.set(key, {
        phone: user.phone,
        name: user.name || prev.name,
        points: user.points ?? prev.points ?? 0,
        role: user.role || prev.role || 'customer',
        ordersCount: prev.ordersCount || 0,
      })
    }
    for (const o of orders) {
      const phone = o.address?.phone || user?.phone
      if (!phone) continue
      const key = String(phone).replace(/\D/g, '')
      const prev = map.get(key) || { phone, name: phone, points: 0, role: 'customer', ordersCount: 0 }
      map.set(key, { ...prev, ordersCount: (prev.ordersCount || 0) + 1 })
    }
    return [...map.values()].sort((a, b) => (b.ordersCount || 0) - (a.ordersCount || 0))
  }, [accounts, orders, user])

  const filteredProducts = useMemo(() => {
    const q = productQuery.trim().toLowerCase()
    let list = [...liveCatalog]
    if (q) {
      list = list.filter((p) => {
        const n = productName(p, lang).toLowerCase()
        return n.includes(q) || p.id.toLowerCase().includes(q) || String(p.barcode || '').includes(q)
      })
    }
    return list.sort((a, b) => Number(!!a.disabled) - Number(!!b.disabled))
  }, [liveCatalog, productQuery, lang])

  const recentOrders = [...orders].sort((a, b) => b.createdAt - a.createdAt).slice(0, 20)

  const toggleProductSelect = (id) => {
    setSelectedProductIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const tryUnlock = () => {
    if (unlockAdmin(pin)) {
      setPinError(false)
      setPin('')
    } else {
      setPinError(true)
    }
  }

  const openProductEdit = (p) => {
    if (!p) {
      setProductForm(emptyProduct())
      return
    }
    setProductForm({
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

  const saveProduct = () => {
    if (!productForm) return
    const id =
      productForm.id?.trim() ||
      `mm-${Date.now().toString(36)}`
    adminUpsertProduct({
      id,
      nameAr: productForm.nameAr,
      nameEn: productForm.nameEn,
      nameTr: productForm.nameTr,
      names: { ar: productForm.nameAr, en: productForm.nameEn, tr: productForm.nameTr },
      price: Number(productForm.price) || 0,
      stock: Number(productForm.stock) || 0,
      aisle: productForm.aisle,
      barcode: productForm.barcode,
      image: productForm.image,
      imageUrl: productForm.image,
      tryInRoom: productForm.tryInRoom,
      disabled: productForm.disabled,
    })
    setProductForm(null)
  }

  const pickImage = async () => {
    try {
      if (Platform.OS === 'web') {
        const uri = await pickImageWeb()
        if (uri) setProductForm((f) => (f ? { ...f, image: uri } : f))
        return
      }
      const ImagePicker = await import('expo-image-picker')
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (!perm.granted) {
        Alert.alert(t('adminImagePermission'))
        return
      }
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0.7,
      })
      if (!res.canceled && res.assets?.[0]?.uri) {
        setProductForm((f) => (f ? { ...f, image: res.assets[0].uri } : f))
      }
    } catch {
      Alert.alert(t('adminImageFail'))
    }
  }

  const onAiCreateStory = () => {
    Alert.alert(t('adminAiCreateStory'), t('adminAiComingSoon'))
  }

  const onAiEditImage = () => {
    Alert.alert(t('adminAiEditImage'), t('adminAiComingSoon'))
  }

  const saveAisle = () => {
    if (!aisleForm?.id && !aisleForm?.nameTr && !aisleForm?.nameEn && !aisleForm?.nameAr) return
    const id =
      aisleForm.id?.trim() ||
      String(aisleForm.nameEn || aisleForm.nameTr || aisleForm.nameAr || 'aisle')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .slice(0, 24)
    adminUpsertAisle({ ...aisleForm, id })
    setAisleForm(null)
  }

  const saveCampaign = () => {
    if (!campaignForm) return
    const productIds = String(campaignForm.productIdsText || '')
      .split(/[,\s]+/)
      .map((s) => s.trim())
      .filter(Boolean)
    adminUpsertCampaign({
      id: campaignForm.id || undefined,
      titleAr: campaignForm.titleAr,
      titleEn: campaignForm.titleEn,
      titleTr: campaignForm.titleTr,
      discount: Number(campaignForm.discount) || 0,
      productIds,
      active: campaignForm.active,
    })
    setCampaignForm(null)
  }

  const navSections = SECTIONS.map((s) => ({ ...s, label: t(`adminNav.${s.id}`) }))
  const leaveToShop = () => openStorefront('Tabs')

  if (!isAdminAccess) {
    return (
      <AdminGateLayout onLeave={leaveToShop}>
        <View style={{ backgroundColor: '#1C1C1C', borderRadius: 18, padding: 22, borderWidth: 1, borderColor: '#2A2A2A' }}>
          <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 10 }}>
            <Lock size={22} color={colors.yellow} />
            <Text style={{ color: colors.yellow, fontWeight: '900', fontSize: 16 }}>{t('adminPinTitle')}</Text>
          </View>
          <Text style={{ color: 'rgba(255,255,255,0.75)', marginTop: 10, textAlign: isRTL ? 'right' : 'left' }}>
            {t('adminPinHint', { pin: ADMIN_PIN })}
          </Text>
          <TextInput
            value={pin}
            onChangeText={(v) => {
              setPin(v)
              setPinError(false)
            }}
            keyboardType="number-pad"
            secureTextEntry
            placeholder="••••"
            placeholderTextColor="#888"
            style={{
              marginTop: 16,
              backgroundColor: '#fff',
              borderRadius: 12,
              padding: 14,
              fontSize: 20,
              fontWeight: '800',
              letterSpacing: 8,
              textAlign: 'center',
            }}
          />
          {pinError ? (
            <Text style={{ color: colors.red, marginTop: 8, fontWeight: '700', textAlign: 'center' }}>
              {t('adminPinWrong')}
            </Text>
          ) : null}
          <Pressable
            onPress={tryUnlock}
            style={{ backgroundColor: colors.red, borderRadius: 12, padding: 14, alignItems: 'center', marginTop: 14 }}
          >
            <Text style={{ color: '#fff', fontWeight: '900' }}>{t('adminUnlock')}</Text>
          </Pressable>
          <Pressable
            onPress={() => setAppDemoMode('admin')}
            style={{ marginTop: 12, alignItems: 'center' }}
          >
            <Text style={{ color: colors.yellow, fontWeight: '700', fontSize: 12 }}>{t('adminSetRole')}</Text>
          </Pressable>
        </View>
      </AdminGateLayout>
    )
  }

  return (
    <AdminChrome section={section} onSection={setSection} sections={navSections} onLeave={leaveToShop}>
      <ScrollView
        contentContainerStyle={{
          padding: desktop ? 24 : 16,
          gap: 12,
          paddingBottom: 40,
          maxWidth: desktop ? 1080 : undefined,
          width: '100%',
          alignSelf: desktop ? 'center' : undefined,
        }}
        style={{ flex: 1 }}
      >
        {section === 'overview' ? (
          <AdminOverview
            t={t}
            lang={lang}
            isRTL={isRTL}
            desktop={desktop}
            orders={orders}
            liveCatalog={liveCatalog}
            liveCampaigns={liveCampaigns}
            customersCount={customers.length}
            enabledProducts={enabledProducts}
            simulateOffline={simulateOffline}
            setOfflineSim={setOfflineSim}
            setAppDemoMode={setAppDemoMode}
            openStorefront={openStorefront}
            leaveToShop={leaveToShop}
            demoMode={demoMode}
            adminAddProductsToCampaign={adminAddProductsToCampaign}
            onOpenProduct={(p) => {
              setSection('products')
              openProductEdit(p)
            }}
            onGoCampaigns={() => setSection('campaigns')}
          />
        ) : null}

        {section === 'categories' ? (
          <>
            <Pressable
              onPress={() => setAisleForm({ id: '', nameAr: '', nameEn: '', nameTr: '', enabled: true })}
              style={{
                backgroundColor: colors.red,
                borderRadius: 12,
                padding: 12,
                flexDirection: isRTL ? 'row-reverse' : 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              <Plus size={16} color="#fff" />
              <Text style={{ color: '#fff', fontWeight: '800' }}>{t('adminAddAisle')}</Text>
            </Pressable>
            {liveAisles.map((a) => (
              <View
                key={a.id}
                style={{
                  backgroundColor: '#fff',
                  borderRadius: 14,
                  padding: 14,
                  flexDirection: isRTL ? 'row-reverse' : 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 10,
                }}
              >
                <Pressable onPress={() => setAisleForm({ ...a })} style={{ flex: 1 }}>
                  <Text style={{ fontWeight: '800', textAlign: isRTL ? 'right' : 'left' }}>{aisleLabel(a)}</Text>
                  <Text style={{ color: colors.muted, fontSize: 12, textAlign: isRTL ? 'right' : 'left' }}>{a.id}</Text>
                </Pressable>
                <Switch
                  value={a.enabled !== false}
                  onValueChange={() => adminToggleAisle(a.id)}
                  trackColor={{ true: colors.red, false: '#ddd' }}
                />
              </View>
            ))}
          </>
        ) : null}

        {section === 'products' ? (
          <>
            <View
              style={{
                backgroundColor: '#fff',
                borderRadius: 10,
                borderWidth: 1,
                borderColor: colors.line,
                paddingHorizontal: 12,
                flexDirection: isRTL ? 'row-reverse' : 'row',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <Search size={16} color={colors.muted} />
              <TextInput
                value={productQuery}
                onChangeText={setProductQuery}
                placeholder={t('adminSearchProducts')}
                placeholderTextColor="#AAA"
                style={{ flex: 1, paddingVertical: 12, textAlign: isRTL ? 'right' : 'left' }}
              />
            </View>
            <ProductBatchTranslateBar
              t={t}
              isRTL={isRTL}
              selectedIds={selectedProductIds}
              liveCatalog={liveCatalog}
              adminUpsertProduct={adminUpsertProduct}
              onClearSelection={() => setSelectedProductIds([])}
            />
            <Pressable
              onPress={() => openProductEdit(null)}
              style={{
                backgroundColor: colors.red,
                borderRadius: 10,
                padding: 12,
                flexDirection: isRTL ? 'row-reverse' : 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              <Plus size={16} color="#fff" />
              <Text style={{ color: '#fff', fontWeight: '800' }}>{t('adminAddProduct')}</Text>
            </Pressable>
            {desktop ? (
              <View
                style={{
                  backgroundColor: '#fff',
                  borderRadius: 10,
                  overflow: 'hidden',
                  borderWidth: 1,
                  borderColor: colors.line,
                }}
              >
                <View
                  style={{
                    flexDirection: isRTL ? 'row-reverse' : 'row',
                    paddingHorizontal: 14,
                    paddingVertical: 10,
                    backgroundColor: '#FAFAFA',
                    borderBottomWidth: 1,
                    borderBottomColor: colors.line,
                    gap: 10,
                    alignItems: 'center',
                  }}
                >
                  <View style={{ width: 28 }} />
                  <View style={{ width: 48 }} />
                  <Text style={{ flex: 2, fontWeight: '800', fontSize: 11, color: colors.muted }}>{t('adminName')}</Text>
                  <Text style={{ flex: 1, fontWeight: '800', fontSize: 11, color: colors.muted }}>{t('adminPrice')}</Text>
                  <Text style={{ width: 88, fontWeight: '800', fontSize: 11, color: colors.muted }}>{t('adminAisle')}</Text>
                  <Text style={{ width: 100, fontWeight: '800', fontSize: 11, color: colors.muted }}>{t('adminStock')}</Text>
                </View>
                {filteredProducts.map((p) => {
                  const key = `${storeId}:${p.id}`
                  const stock = storeOverrides[key]?.stock != null ? storeOverrides[key].stock : p.stock
                  const out = (stock ?? 0) <= 0 || p.disabled
                  const selected = selectedProductIds.includes(p.id)
                  return (
                    <View
                      key={p.id}
                      style={{
                        flexDirection: isRTL ? 'row-reverse' : 'row',
                        paddingHorizontal: 14,
                        paddingVertical: 10,
                        gap: 10,
                        alignItems: 'center',
                        borderBottomWidth: 1,
                        borderBottomColor: colors.line,
                        opacity: p.disabled ? 0.55 : 1,
                        backgroundColor: selected ? colors.redSoft : '#fff',
                      }}
                    >
                      <SelectDot on={selected} onPress={() => toggleProductSelect(p.id)} />
                      <Pressable
                        onPress={() => openProductEdit(p)}
                        style={{ flex: 1, flexDirection: isRTL ? 'row-reverse' : 'row', gap: 10, alignItems: 'center' }}
                      >
                        {p.image ? (
                          <Image source={{ uri: p.image }} style={{ width: 40, height: 40, borderRadius: 6 }} />
                        ) : (
                          <View style={{ width: 40, height: 40, borderRadius: 6, backgroundColor: colors.bg }} />
                        )}
                        <View style={{ flex: 2 }}>
                          <Text style={{ fontWeight: '800' }} numberOfLines={1}>
                            {productName(p, lang)}
                          </Text>
                          <Text style={{ color: colors.muted, fontSize: 11 }}>{p.id}</Text>
                        </View>
                        <Text style={{ flex: 1, fontWeight: '700' }}>{formatIQD(p.price, lang)}</Text>
                        <Text style={{ width: 88, color: colors.muted, fontSize: 12 }}>{p.aisle}</Text>
                      </Pressable>
                      <Pressable
                        onPress={() => adminToggleStock(storeId, p.id)}
                        style={{
                          width: 100,
                          backgroundColor: out ? colors.redSoft : colors.openBg,
                          borderRadius: 8,
                          paddingHorizontal: 10,
                          paddingVertical: 6,
                          alignItems: 'center',
                        }}
                      >
                        <Text style={{ fontWeight: '800', fontSize: 11, color: out ? colors.red : colors.open }}>
                          {p.disabled ? t('adminDisabled') : out ? t('outOfStock') : t('inStockAdmin')}
                        </Text>
                      </Pressable>
                    </View>
                  )
                })}
              </View>
            ) : (
              filteredProducts.map((p) => {
                const key = `${storeId}:${p.id}`
                const stock = storeOverrides[key]?.stock != null ? storeOverrides[key].stock : p.stock
                const out = (stock ?? 0) <= 0 || p.disabled
                const selected = selectedProductIds.includes(p.id)
                return (
                  <View
                    key={p.id}
                    style={{
                      backgroundColor: selected ? colors.redSoft : '#fff',
                      borderRadius: 10,
                      borderWidth: 1,
                      borderColor: colors.line,
                      padding: 12,
                      flexDirection: isRTL ? 'row-reverse' : 'row',
                      gap: 10,
                      alignItems: 'center',
                      opacity: p.disabled ? 0.55 : 1,
                    }}
                  >
                    <SelectDot on={selected} onPress={() => toggleProductSelect(p.id)} />
                    <Pressable
                      onPress={() => openProductEdit(p)}
                      style={{ flex: 1, flexDirection: isRTL ? 'row-reverse' : 'row', gap: 10, alignItems: 'center' }}
                    >
                      {p.image ? (
                        <Image source={{ uri: p.image }} style={{ width: 48, height: 48, borderRadius: 8 }} />
                      ) : (
                        <View style={{ width: 48, height: 48, borderRadius: 8, backgroundColor: colors.bg }} />
                      )}
                      <View style={{ flex: 1, alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
                        <Text style={{ fontWeight: '800' }}>{productName(p, lang)}</Text>
                        <Text style={{ color: colors.muted, fontSize: 12 }}>
                          {formatIQD(p.price, lang)} · {p.aisle} · {p.id}
                        </Text>
                      </View>
                    </Pressable>
                    <Pressable
                      onPress={() => adminToggleStock(storeId, p.id)}
                      style={{
                        backgroundColor: out ? colors.redSoft : colors.openBg,
                        borderRadius: 8,
                        paddingHorizontal: 10,
                        paddingVertical: 6,
                      }}
                    >
                      <Text style={{ fontWeight: '800', fontSize: 11, color: out ? colors.red : colors.open }}>
                        {p.disabled ? t('adminDisabled') : out ? t('outOfStock') : t('inStockAdmin')}
                      </Text>
                    </Pressable>
                  </View>
                )
              })
            )}
          </>
        ) : null}

        {section === 'customers' ? (
          customers.length === 0 ? (
            <Text style={{ color: colors.muted }}>{t('adminNoCustomers')}</Text>
          ) : (
            customers.map((c) => (
              <View
                key={c.phone}
                style={{
                  backgroundColor: '#fff',
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: colors.line,
                  padding: 14,
                }}
              >
                <Text style={{ fontWeight: '800', textAlign: isRTL ? 'right' : 'left' }}>{c.name}</Text>
                <Text style={{ color: colors.muted, marginTop: 2, textAlign: isRTL ? 'right' : 'left' }}>{c.phone}</Text>
                <Text style={{ marginTop: 6, textAlign: isRTL ? 'right' : 'left' }}>
                  {t('points')}: {c.points} · {t('orders')}: {c.ordersCount} · {c.role}
                </Text>
                <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', gap: 8, marginTop: 10, alignItems: 'center' }}>
                  <TextInput
                    value={pointsEdit[c.phone] ?? String(c.points)}
                    onChangeText={(v) => setPointsEdit((prev) => ({ ...prev, [c.phone]: v }))}
                    keyboardType="number-pad"
                    style={{
                      flex: 1,
                      borderWidth: 1,
                      borderColor: colors.line,
                      borderRadius: 8,
                      padding: 10,
                      textAlign: isRTL ? 'right' : 'left',
                    }}
                  />
                  <Pressable
                    onPress={() => adminSetCustomerPoints(c.phone, pointsEdit[c.phone] ?? c.points)}
                    style={{ backgroundColor: colors.yellow, borderRadius: 8, paddingHorizontal: 14, paddingVertical: 10 }}
                  >
                    <Text style={{ fontWeight: '900', color: colors.ink }}>{t('adminSavePoints')}</Text>
                  </Pressable>
                </View>
              </View>
            ))
          )
        ) : null}

        {section === 'campaigns' ? (
          <>
            <Pressable
              onPress={() => setCampaignForm(emptyCampaign())}
              style={{
                backgroundColor: colors.red,
                borderRadius: 12,
                padding: 12,
                alignItems: 'center',
                flexDirection: isRTL ? 'row-reverse' : 'row',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              <Plus size={16} color="#fff" />
              <Text style={{ color: '#fff', fontWeight: '800' }}>{t('adminAddCampaign')}</Text>
            </Pressable>
            {liveCampaigns.map((c) => {
              const title = lang === 'tr' ? c.titleTr : lang === 'en' ? c.titleEn : c.titleAr
              return (
                <View key={c.id} style={{ backgroundColor: '#fff', borderRadius: 14, padding: 14 }}>
                  <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Pressable
                      onPress={() =>
                        setCampaignForm({
                          id: c.id,
                          titleAr: c.titleAr || '',
                          titleEn: c.titleEn || '',
                          titleTr: c.titleTr || '',
                          discount: String(c.discount ?? 0),
                          productIdsText: (c.productIds || c.skus || []).join(', '),
                          active: c.active !== false,
                        })
                      }
                      style={{ flex: 1 }}
                    >
                      <Text style={{ fontWeight: '800', textAlign: isRTL ? 'right' : 'left' }}>{title || c.id}</Text>
                      <Text style={{ color: colors.muted, fontSize: 12, textAlign: isRTL ? 'right' : 'left' }}>
                        {t('adminDiscount')}: %{c.discount || 0} · {(c.productIds || c.skus || []).length} SKU
                      </Text>
                    </Pressable>
                    <Switch
                      value={c.active !== false}
                      onValueChange={() => adminUpsertCampaign({ ...c, active: !c.active })}
                      trackColor={{ true: colors.red, false: '#ddd' }}
                    />
                  </View>
                  <Pressable onPress={() => adminDeleteCampaign(c.id)} style={{ marginTop: 10 }}>
                    <Text style={{ color: colors.red, fontWeight: '700', textAlign: isRTL ? 'right' : 'left' }}>
                      {t('adminDelete')}
                    </Text>
                  </Pressable>
                </View>
              )
            })}
          </>
        ) : null}

        {section === 'orders' ? (
          <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 14 }}>
            <Text style={{ fontWeight: '800', marginBottom: 10 }}>{t('adminOrders')}</Text>
            {recentOrders.length === 0 ? (
              <Text style={{ color: colors.muted }}>{t('noOrders')}</Text>
            ) : (
              recentOrders.map((o) => (
                <View key={o.id} style={{ paddingVertical: 10, borderTopWidth: 1, borderTopColor: colors.line }}>
                  <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontWeight: '800' }}>{o.id}</Text>
                    <Text style={{ color: colors.red, fontWeight: '800' }}>{formatIQD(o.total, lang)}</Text>
                  </View>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6, marginTop: 8 }}>
                    {STATUSES.map((s) => {
                      const on = o.status === s || (!o.status && s === 'confirmed')
                      return (
                        <Chip
                          key={s}
                          label={t(s === 'cancelled' ? 'cancelled' : s)}
                          on={on}
                          onPress={() => adminSetOrderStatus(o.id, s)}
                          isRTL={isRTL}
                        />
                      )
                    })}
                  </ScrollView>
                </View>
              ))
            )}
          </View>
        ) : null}

        {section === 'stores' ? (
          liveStores
            .filter((s) => !s.comingSoon)
            .map((s) => (
              <StoreEditor
                key={s.id}
                store={s}
                lang={lang}
                t={t}
                isRTL={isRTL}
                onSave={(patch) => adminUpdateStore(s.id, patch)}
              />
            ))
        ) : null}

        {section === 'feedback' ? (
          <AdminFeedback t={t} lang={lang} isRTL={isRTL} surveys={surveys} orders={orders} />
        ) : null}

        {section === 'couriers' ? (
          <AdminCouriers
            t={t}
            isRTL={isRTL}
            couriers={couriers}
            adminUpsertCourier={adminUpsertCourier}
            adminToggleCourier={adminToggleCourier}
            adminDeleteCourier={adminDeleteCourier}
          />
        ) : null}

        {section === 'ai' ? (
          <Suspense
            fallback={
              <View style={{ paddingVertical: 32, alignItems: 'center' }}>
                <ActivityIndicator color={colors.red} size="large" />
              </View>
            }
          >
            <AdminAI
              t={t}
              isRTL={isRTL}
              lang={lang}
              liveCatalog={liveCatalog}
              adminUpsertProduct={adminUpsertProduct}
            />
          </Suspense>
        ) : null}
      </ScrollView>

      <Modal visible={!!productForm} animationType="fade" transparent>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.45)',
            justifyContent: desktop ? 'center' : 'flex-end',
            alignItems: desktop ? 'center' : undefined,
            padding: desktop ? 24 : 0,
          }}
        >
          <View
            style={{
              backgroundColor: colors.bg,
              width: desktop ? '100%' : undefined,
              maxWidth: desktop ? 720 : undefined,
              maxHeight: desktop ? '88%' : '92%',
              borderTopLeftRadius: desktop ? 18 : 20,
              borderTopRightRadius: desktop ? 18 : 20,
              borderRadius: desktop ? 18 : undefined,
              overflow: 'hidden',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.18,
              shadowRadius: 24,
              elevation: 12,
            }}
          >
            <View style={{ padding: 18, borderBottomWidth: 1, borderBottomColor: colors.line, backgroundColor: '#fff' }}>
              <Text style={{ fontWeight: '900', fontSize: 18, textAlign: isRTL ? 'right' : 'left' }}>
                {productForm?.id ? t('adminEditProduct') : t('adminAddProduct')}
              </Text>
            </View>
            <ScrollView contentContainerStyle={{ padding: desktop ? 20 : 16 }}>
              {desktop ? (
                <View
                  style={{
                    flexDirection: isRTL ? 'row-reverse' : 'row',
                    gap: 20,
                    alignItems: 'flex-start',
                  }}
                >
                  <View style={{ flex: 1, minWidth: 260 }}>
                    <Text style={{ fontWeight: '700', fontSize: 12, color: colors.muted, marginBottom: 6, textAlign: isRTL ? 'right' : 'left' }}>
                      {t('adminImageUrl')}
                    </Text>
                    <Field label="" value={productForm?.image || ''} onChangeText={(v) => setProductForm((f) => ({ ...f, image: v }))} isRTL={isRTL} />
                    <Pressable
                      onPress={pickImage}
                      style={{
                        backgroundColor: colors.yellow,
                        borderRadius: 10,
                        padding: 12,
                        flexDirection: isRTL ? 'row-reverse' : 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                        marginBottom: 10,
                      }}
                    >
                      <ImagePlus size={16} color={colors.ink} />
                      <Text style={{ fontWeight: '800' }}>{t('adminPickImage')}</Text>
                    </Pressable>
                    <ProductAiImageButton t={t} isRTL={isRTL} productForm={productForm} setProductForm={setProductForm} />
                    {productForm?.image ? (
                      <Image
                        source={{ uri: productForm.image }}
                        style={{ width: '100%', height: 200, borderRadius: 12, marginBottom: 10 }}
                        resizeMode="cover"
                      />
                    ) : (
                      <View
                        style={{
                          width: '100%',
                          height: 200,
                          borderRadius: 12,
                          marginBottom: 10,
                          backgroundColor: colors.bg,
                          borderWidth: 1,
                          borderColor: colors.line,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <ImagePlus size={28} color={colors.muted} />
                      </View>
                    )}
                    <View
                      style={{
                        flexDirection: isRTL ? 'row-reverse' : 'row',
                        gap: 8,
                        marginBottom: 10,
                      }}
                    >
                      <Pressable
                        onPress={onAiCreateStory}
                        style={{
                          flex: 1,
                          backgroundColor: '#7C3AED',
                          borderRadius: 10,
                          paddingVertical: 12,
                          paddingHorizontal: 10,
                          flexDirection: isRTL ? 'row-reverse' : 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 6,
                        }}
                      >
                        <BookOpen size={16} color="#fff" />
                        <Text style={{ color: '#fff', fontWeight: '800', fontSize: 12 }}>{t('adminAiCreateStory')}</Text>
                      </Pressable>
                      <Pressable
                        onPress={onAiEditImage}
                        style={{
                          flex: 1,
                          backgroundColor: '#10B981',
                          borderRadius: 10,
                          paddingVertical: 12,
                          paddingHorizontal: 10,
                          flexDirection: isRTL ? 'row-reverse' : 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 6,
                        }}
                      >
                        <Wand2 size={16} color="#fff" />
                        <Text style={{ color: '#fff', fontWeight: '800', fontSize: 12 }}>{t('adminAiEditImage')}</Text>
                      </Pressable>
                    </View>
                  </View>
                  <View style={{ flex: 1.2, minWidth: 280 }}>
                    <Field label="ID" value={productForm?.id || ''} onChangeText={(v) => setProductForm((f) => ({ ...f, id: v }))} isRTL={isRTL} placeholder="mm-new" />
                    <Field label={`${t('adminName')} (AR)`} value={productForm?.nameAr || ''} onChangeText={(v) => setProductForm((f) => ({ ...f, nameAr: v }))} isRTL={isRTL} />
                    <Field label={`${t('adminName')} (EN)`} value={productForm?.nameEn || ''} onChangeText={(v) => setProductForm((f) => ({ ...f, nameEn: v }))} isRTL={isRTL} />
                    <Field label={`${t('adminName')} (TR)`} value={productForm?.nameTr || ''} onChangeText={(v) => setProductForm((f) => ({ ...f, nameTr: v }))} isRTL={isRTL} />
                    <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', gap: 10 }}>
                      <View style={{ flex: 1 }}>
                        <Field label={t('adminPrice')} value={productForm?.price || ''} onChangeText={(v) => setProductForm((f) => ({ ...f, price: v }))} isRTL={isRTL} keyboardType="number-pad" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Field label={t('adminStock')} value={productForm?.stock || ''} onChangeText={(v) => setProductForm((f) => ({ ...f, stock: v }))} isRTL={isRTL} keyboardType="number-pad" />
                      </View>
                    </View>
                    <Field label={t('adminBarcode')} value={productForm?.barcode || ''} onChangeText={(v) => setProductForm((f) => ({ ...f, barcode: v }))} isRTL={isRTL} />
                    <Text style={{ fontWeight: '700', marginBottom: 8, textAlign: isRTL ? 'right' : 'left' }}>{t('adminAisle')}</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6, marginBottom: 12 }}>
                      {liveAisles.filter((a) => a.enabled !== false).map((a) => (
                        <Chip
                          key={a.id}
                          label={aisleLabel(a)}
                          on={productForm?.aisle === a.id}
                          onPress={() => setProductForm((f) => ({ ...f, aisle: a.id }))}
                          isRTL={isRTL}
                        />
                      ))}
                    </ScrollView>
                    <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                      <Text style={{ fontWeight: '700' }}>tryInRoom</Text>
                      <Switch
                        value={!!productForm?.tryInRoom}
                        onValueChange={(v) => setProductForm((f) => ({ ...f, tryInRoom: v }))}
                        trackColor={{ true: colors.red, false: '#ddd' }}
                      />
                    </View>
                    <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                      <Text style={{ fontWeight: '700' }}>{t('adminDisabled')}</Text>
                      <Switch
                        value={!!productForm?.disabled}
                        onValueChange={(v) => setProductForm((f) => ({ ...f, disabled: v }))}
                        trackColor={{ true: colors.red, false: '#ddd' }}
                      />
                    </View>
                    <Pressable onPress={saveProduct} style={{ backgroundColor: colors.red, borderRadius: 12, padding: 14, alignItems: 'center' }}>
                      <Text style={{ color: '#fff', fontWeight: '900' }}>{t('save')}</Text>
                    </Pressable>
                    {productForm?.id ? (
                      <Pressable
                        onPress={() => {
                          adminToggleProductDisabled(productForm.id)
                          setProductForm(null)
                        }}
                        style={{ padding: 14, alignItems: 'center' }}
                      >
                        <Text style={{ color: colors.red, fontWeight: '700' }}>{t('adminToggleDisable')}</Text>
                      </Pressable>
                    ) : null}
                    <Pressable onPress={() => setProductForm(null)} style={{ padding: 14, alignItems: 'center' }}>
                      <Text style={{ color: colors.muted, fontWeight: '700' }}>{t('cancel')}</Text>
                    </Pressable>
                  </View>
                </View>
              ) : (
                <>
                  <Field label="ID" value={productForm?.id || ''} onChangeText={(v) => setProductForm((f) => ({ ...f, id: v }))} isRTL={isRTL} placeholder="mm-new" />
                  <Field label={`${t('adminName')} (AR)`} value={productForm?.nameAr || ''} onChangeText={(v) => setProductForm((f) => ({ ...f, nameAr: v }))} isRTL={isRTL} />
                  <Field label={`${t('adminName')} (EN)`} value={productForm?.nameEn || ''} onChangeText={(v) => setProductForm((f) => ({ ...f, nameEn: v }))} isRTL={isRTL} />
                  <Field label={`${t('adminName')} (TR)`} value={productForm?.nameTr || ''} onChangeText={(v) => setProductForm((f) => ({ ...f, nameTr: v }))} isRTL={isRTL} />
                  <Field label={t('adminPrice')} value={productForm?.price || ''} onChangeText={(v) => setProductForm((f) => ({ ...f, price: v }))} isRTL={isRTL} keyboardType="number-pad" />
                  <Field label={t('adminStock')} value={productForm?.stock || ''} onChangeText={(v) => setProductForm((f) => ({ ...f, stock: v }))} isRTL={isRTL} keyboardType="number-pad" />
                  <Field label={t('adminBarcode')} value={productForm?.barcode || ''} onChangeText={(v) => setProductForm((f) => ({ ...f, barcode: v }))} isRTL={isRTL} />
                  <Field label={t('adminImageUrl')} value={productForm?.image || ''} onChangeText={(v) => setProductForm((f) => ({ ...f, image: v }))} isRTL={isRTL} />
                  <Pressable
                    onPress={pickImage}
                    style={{
                      backgroundColor: colors.yellow,
                      borderRadius: 10,
                      padding: 12,
                      flexDirection: isRTL ? 'row-reverse' : 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      marginBottom: 10,
                    }}
                  >
                    <ImagePlus size={16} color={colors.ink} />
                    <Text style={{ fontWeight: '800' }}>{t('adminPickImage')}</Text>
                  </Pressable>
                  <ProductAiImageButton t={t} isRTL={isRTL} productForm={productForm} setProductForm={setProductForm} />
                  {productForm?.image ? (
                    <Image source={{ uri: productForm.image }} style={{ width: '100%', height: 140, borderRadius: 10, marginBottom: 10 }} />
                  ) : null}
                  <View
                    style={{
                      flexDirection: isRTL ? 'row-reverse' : 'row',
                      gap: 8,
                      marginBottom: 10,
                    }}
                  >
                    <Pressable
                      onPress={onAiCreateStory}
                      style={{
                        flex: 1,
                        backgroundColor: '#7C3AED',
                        borderRadius: 10,
                        paddingVertical: 12,
                        paddingHorizontal: 10,
                        flexDirection: isRTL ? 'row-reverse' : 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6,
                      }}
                    >
                      <BookOpen size={16} color="#fff" />
                      <Text style={{ color: '#fff', fontWeight: '800', fontSize: 12 }}>{t('adminAiCreateStory')}</Text>
                    </Pressable>
                    <Pressable
                      onPress={onAiEditImage}
                      style={{
                        flex: 1,
                        backgroundColor: '#10B981',
                        borderRadius: 10,
                        paddingVertical: 12,
                        paddingHorizontal: 10,
                        flexDirection: isRTL ? 'row-reverse' : 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6,
                      }}
                    >
                      <Wand2 size={16} color="#fff" />
                      <Text style={{ color: '#fff', fontWeight: '800', fontSize: 12 }}>{t('adminAiEditImage')}</Text>
                    </Pressable>
                  </View>
                  <Text style={{ fontWeight: '700', marginBottom: 8, textAlign: isRTL ? 'right' : 'left' }}>{t('adminAisle')}</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6, marginBottom: 12 }}>
                    {liveAisles.filter((a) => a.enabled !== false).map((a) => (
                      <Chip
                        key={a.id}
                        label={aisleLabel(a)}
                        on={productForm?.aisle === a.id}
                        onPress={() => setProductForm((f) => ({ ...f, aisle: a.id }))}
                        isRTL={isRTL}
                      />
                    ))}
                  </ScrollView>
                  <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <Text style={{ fontWeight: '700' }}>tryInRoom</Text>
                    <Switch
                      value={!!productForm?.tryInRoom}
                      onValueChange={(v) => setProductForm((f) => ({ ...f, tryInRoom: v }))}
                      trackColor={{ true: colors.red, false: '#ddd' }}
                    />
                  </View>
                  <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <Text style={{ fontWeight: '700' }}>{t('adminDisabled')}</Text>
                    <Switch
                      value={!!productForm?.disabled}
                      onValueChange={(v) => setProductForm((f) => ({ ...f, disabled: v }))}
                      trackColor={{ true: colors.red, false: '#ddd' }}
                    />
                  </View>
                  <Pressable onPress={saveProduct} style={{ backgroundColor: colors.red, borderRadius: 12, padding: 14, alignItems: 'center' }}>
                    <Text style={{ color: '#fff', fontWeight: '900' }}>{t('save')}</Text>
                  </Pressable>
                  {productForm?.id ? (
                    <Pressable
                      onPress={() => {
                        adminToggleProductDisabled(productForm.id)
                        setProductForm(null)
                      }}
                      style={{ padding: 14, alignItems: 'center' }}
                    >
                      <Text style={{ color: colors.red, fontWeight: '700' }}>{t('adminToggleDisable')}</Text>
                    </Pressable>
                  ) : null}
                  <Pressable onPress={() => setProductForm(null)} style={{ padding: 14, alignItems: 'center' }}>
                    <Text style={{ color: colors.muted, fontWeight: '700' }}>{t('cancel')}</Text>
                  </Pressable>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal visible={!!aisleForm} animationType="fade" transparent>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.45)',
            justifyContent: desktop ? 'center' : 'flex-end',
            alignItems: desktop ? 'center' : undefined,
            padding: desktop ? 24 : 0,
          }}
        >
          <View
            style={{
              backgroundColor: '#fff',
              padding: desktop ? 22 : 16,
              width: desktop ? '100%' : undefined,
              maxWidth: desktop ? 560 : undefined,
              borderTopLeftRadius: desktop ? 18 : 20,
              borderTopRightRadius: desktop ? 18 : 20,
              borderRadius: desktop ? 18 : undefined,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.18,
              shadowRadius: 24,
              elevation: 12,
            }}
          >
            <Text style={{ fontWeight: '900', fontSize: 18, marginBottom: 12, textAlign: isRTL ? 'right' : 'left' }}>
              {t('adminEditAisle')}
            </Text>
            <Field label="ID" value={aisleForm?.id || ''} onChangeText={(v) => setAisleForm((f) => ({ ...f, id: v }))} isRTL={isRTL} />
            <Field label="AR" value={aisleForm?.nameAr || ''} onChangeText={(v) => setAisleForm((f) => ({ ...f, nameAr: v }))} isRTL={isRTL} />
            <Field label="EN" value={aisleForm?.nameEn || ''} onChangeText={(v) => setAisleForm((f) => ({ ...f, nameEn: v }))} isRTL={isRTL} />
            <Field label="TR" value={aisleForm?.nameTr || ''} onChangeText={(v) => setAisleForm((f) => ({ ...f, nameTr: v }))} isRTL={isRTL} />
            <Pressable onPress={saveAisle} style={{ backgroundColor: colors.red, borderRadius: 12, padding: 14, alignItems: 'center' }}>
              <Text style={{ color: '#fff', fontWeight: '900' }}>{t('save')}</Text>
            </Pressable>
            <Pressable onPress={() => setAisleForm(null)} style={{ padding: 14, alignItems: 'center' }}>
              <Text style={{ color: colors.muted, fontWeight: '700' }}>{t('cancel')}</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal visible={!!campaignForm} animationType="fade" transparent>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.45)',
            justifyContent: desktop ? 'center' : 'flex-end',
            alignItems: desktop ? 'center' : undefined,
            padding: desktop ? 24 : 0,
          }}
        >
          <View
            style={{
              backgroundColor: '#fff',
              padding: desktop ? 22 : 16,
              maxHeight: desktop ? '88%' : '90%',
              width: desktop ? '100%' : undefined,
              maxWidth: desktop ? 640 : undefined,
              borderTopLeftRadius: desktop ? 18 : 20,
              borderTopRightRadius: desktop ? 18 : 20,
              borderRadius: desktop ? 18 : undefined,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.18,
              shadowRadius: 24,
              elevation: 12,
            }}
          >
            <ScrollView>
              <Text style={{ fontWeight: '900', fontSize: 18, marginBottom: 12, textAlign: isRTL ? 'right' : 'left' }}>
                {t('adminEditCampaign')}
              </Text>
              <Field label={`${t('adminName')} AR`} value={campaignForm?.titleAr || ''} onChangeText={(v) => setCampaignForm((f) => ({ ...f, titleAr: v }))} isRTL={isRTL} />
              <Field label={`${t('adminName')} EN`} value={campaignForm?.titleEn || ''} onChangeText={(v) => setCampaignForm((f) => ({ ...f, titleEn: v }))} isRTL={isRTL} />
              <Field label={`${t('adminName')} TR`} value={campaignForm?.titleTr || ''} onChangeText={(v) => setCampaignForm((f) => ({ ...f, titleTr: v }))} isRTL={isRTL} />
              <Field label={t('adminDiscount')} value={campaignForm?.discount || ''} onChangeText={(v) => setCampaignForm((f) => ({ ...f, discount: v }))} isRTL={isRTL} keyboardType="number-pad" />
              <Field
                label={t('adminProductIds')}
                value={campaignForm?.productIdsText || ''}
                onChangeText={(v) => setCampaignForm((f) => ({ ...f, productIdsText: v }))}
                isRTL={isRTL}
                multiline
                placeholder="mm-eggs, mm-milk"
              />
              <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <Text style={{ fontWeight: '700' }}>{t('adminActive')}</Text>
                <Switch
                  value={campaignForm?.active !== false}
                  onValueChange={(v) => setCampaignForm((f) => ({ ...f, active: v }))}
                  trackColor={{ true: colors.red, false: '#ddd' }}
                />
              </View>
              <Pressable onPress={saveCampaign} style={{ backgroundColor: colors.red, borderRadius: 12, padding: 14, alignItems: 'center' }}>
                <Text style={{ color: '#fff', fontWeight: '900' }}>{t('save')}</Text>
              </Pressable>
              <Pressable onPress={() => setCampaignForm(null)} style={{ padding: 14, alignItems: 'center' }}>
                <Text style={{ color: colors.muted, fontWeight: '700' }}>{t('cancel')}</Text>
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </AdminChrome>
  )
}

function StoreEditor({ store, lang, t, isRTL, onSave }) {
  const [eta, setEta] = useState(String(store.eta || ''))
  const [fee, setFee] = useState(String(store.fee ?? ''))
  const [minOrder, setMinOrder] = useState(String(store.minOrder ?? ''))

  return (
    <View style={{ backgroundColor: '#fff', borderRadius: 14, padding: 14 }}>
      <Text style={{ fontWeight: '800', textAlign: isRTL ? 'right' : 'left' }}>{storeName(store, lang)}</Text>
      <Field label={t('adminEta')} value={eta} onChangeText={setEta} isRTL={isRTL} placeholder="20-30" />
      <Field label={t('adminFee')} value={fee} onChangeText={setFee} isRTL={isRTL} keyboardType="number-pad" />
      <Field label={t('adminMinOrder')} value={minOrder} onChangeText={setMinOrder} isRTL={isRTL} keyboardType="number-pad" />
      <Pressable
        onPress={() => onSave({ eta, fee: Number(fee) || 0, minOrder: Number(minOrder) || 0 })}
        style={{ backgroundColor: colors.yellow, borderRadius: 12, padding: 12, alignItems: 'center' }}
      >
        <Text style={{ fontWeight: '900', color: colors.ink }}>{t('save')}</Text>
      </Pressable>
    </View>
  )
}
