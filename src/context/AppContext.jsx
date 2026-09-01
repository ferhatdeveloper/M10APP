import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { AppState, Platform } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Network from 'expo-network'
import {
  ADMIN_PIN,
  aisles as seedAisles,
  applyStoreOverrides,
  catalog as seedCatalog,
  CLOSE_DEMO_ID,
  closeDemoNotification,
  coordsForAddress,
  DEFAULT_STORE_ID,
  deliveryFeeFor,
  discountFor,
  flyers as seedFlyers,
  isInStock,
  linePrice,
  M10_PLUS,
  REFERRAL_BONUS,
  REFERRAL_REDEEM_BONUS,
  resolveListItems,
  resolveStoreId,
  seedNotifications,
  seedRecipes,
  stores as seedStores,
  user as seedUser,
  DEMO_ACCOUNTS,
} from '../data/mock.js'
import {
  attachDemoPushListeners,
  markDemoQueueDelivered,
  scheduleDemoPushSeries,
  syncDemoQueueToInbox,
} from '../utils/demoNotifications'
import { scheduleLocalDemo } from '../utils/push'

const AppContext = createContext(null)

export const DEMO_OTP = '12345'

export const normalizePhone = (raw = '') => {
  let d = String(raw).replace(/\D/g, '')
  if (d.startsWith('964')) d = d.slice(3)
  if (d.length === 10 && d.startsWith('7')) d = `0${d}`
  return d
}

export const formatIqPhone = (raw = '') => {
  const d = normalizePhone(raw)
  if (d.length < 4) return d
  if (d.length < 8) return `${d.slice(0, 4)} ${d.slice(4)}`
  return `${d.slice(0, 4)} ${d.slice(4, 7)} ${d.slice(7, 11)}`
}

export const isValidIqPhone = (raw = '') => /^07[3-9]\d{8}$/.test(normalizePhone(raw))

export const demoNameFromPhone = (raw = '') => {
  const d = normalizePhone(raw)
  return `M10 ${d.slice(-4) || '0000'}`
}

const makeReferralCode = (phone = '') => {
  const d = normalizePhone(phone).slice(-4) || '1000'
  return `M10-${d}`
}

const guestUser = () => ({
  name: '',
  phone: '',
  points: 0,
  tier: 'Gold',
  role: 'customer',
  loggedIn: false,
  address: seedUser.address,
  m10Plus: null,
  pushEnabled: false,
  walletBalance: 0,
  referralCode: 'M10-GUEST',
  referredBy: null,
  referralCount: 0,
})

const normalizeRole = (role) => {
  if (role === 'courier' || role === 'admin') return role
  return 'customer'
}

const roleFromDemo = (phone) => {
  const hit = DEMO_ACCOUNTS.find((a) => normalizePhone(a.phone) === normalizePhone(phone))
  return normalizeRole(hit?.role)
}

const seedLiveAisles = () =>
  seedAisles.map((a) => ({
    id: a.id,
    enabled: true,
    nameAr: a.nameAr || '',
    nameEn: a.nameEn || '',
    nameTr: a.nameTr || '',
  }))

const seedLiveCampaigns = () =>
  seedFlyers.map((f) => ({
    ...f,
    productIds: [...(f.skus || [])],
    discount: 10,
    active: true,
  }))

const seedLiveStores = () => seedStores.map((s) => ({ ...s }))

const cloneCatalog = () => seedCatalog.map((p) => ({ ...p, disabled: false }))

const seedCouriers = () => [
  {
    id: 'c-hussein',
    name: 'Hüseyin El-Musavi',
    nameAr: 'حسين الموسوي',
    nameEn: 'Hussein Al-Mousawi',
    nameTr: 'Hüseyin El-Musavi',
    phone: '0771 555 0001',
    vehicle: 'motorcycle',
    active: true,
  },
  {
    id: 'c-demo-2',
    name: 'Ali Demir',
    nameAr: 'علي ديمير',
    nameEn: 'Ali Demir',
    nameTr: 'Ali Demir',
    phone: '0770 444 2211',
    vehicle: 'car',
    active: true,
  },
]

export const isPlusActive = (user, now = Date.now()) => {
  const plus = user?.m10Plus
  if (!plus?.active) return false
  if (plus.expiresAt && plus.expiresAt < now) return false
  return true
}

const load = async (key, fallback) => {
  try {
    const raw = await AsyncStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

const persist = (key, value) =>
  AsyncStorage.setItem(key, JSON.stringify(value)).catch(() => {})

export function AppProvider({ children }) {
  const [hydrated, setHydrated] = useState(false)
  const [cart, setCart] = useState([])
  const [favorites, setFavorites] = useState([DEFAULT_STORE_ID])
  const [orders, setOrders] = useState([])
  const [user, setUser] = useState(guestUser)
  const [accounts, setAccounts] = useState({})
  const [addresses, setAddresses] = useState([seedUser.address])
  const [notifications, setNotifications] = useState(seedNotifications)
  const [seenStories, setSeenStories] = useState([])
  const [toast, setToast] = useState(null)
  const [coupon, setCoupon] = useState(null)
  const [walletBalance, setWalletBalance] = useState(15000)
  const [lists, setLists] = useState(seedRecipes)
  const [butlerJobs, setButlerJobs] = useState([])
  const [returns, setReturns] = useState([])
  const [storeOverrides, setStoreOverrides] = useState({})
  const [liveCatalog, setLiveCatalog] = useState(cloneCatalog)
  const [liveAisles, setLiveAisles] = useState(seedLiveAisles)
  const [liveCampaigns, setLiveCampaigns] = useState(seedLiveCampaigns)
  const [liveStores, setLiveStores] = useState(seedLiveStores)
  const [couriers, setCouriers] = useState(seedCouriers)
  const [surveys, setSurveys] = useState([])
  const [adminUnlocked, setAdminUnlocked] = useState(false)
  const [isOffline, setIsOffline] = useState(false)
  const [simulateOffline, setSimulateOffline] = useState(false)
  const [demoMode, setDemoMode] = useState('customer') // customer | admin | courier
  const [demoPushEnabled, setDemoPushEnabledState] = useState(true)
  const closeDemoDone = useRef(false)
  const closeDemoPending = useRef(false)
  const closeDemoTimer = useRef(null)

  const getLiveStore = (id) => {
    const sid = resolveStoreId(id)
    return liveStores.find((s) => s.id === sid) || seedStores.find((s) => s.id === sid)
  }

  const getLiveProducts = (storeId) => {
    const store = getLiveStore(storeId)
    if (!store || store.comingSoon) return []
    return applyStoreOverrides(storeId, liveCatalog.filter((p) => !p.disabled))
  }

  const getLiveProduct = (storeId, productId) => getLiveProducts(storeId).find((p) => p.id === productId)

  const getLiveFlyer = (id) => {
    const c = liveCampaigns.find((x) => x.id === id)
    if (!c) return null
    return { ...c, skus: c.productIds || c.skus || [] }
  }

  const dismissToast = () => setToast(null)

  const runCloseDemo = () => {
    if (closeDemoDone.current) return
    closeDemoDone.current = true
    closeDemoPending.current = false
    persist('m10-close-demo', { done: true, pending: false })
    const item = closeDemoNotification()
    setNotifications((prev) => {
      if (prev.some((n) => n.id === CLOSE_DEMO_ID)) return prev
      const next = [{ read: false, createdAt: Date.now(), ...item }, ...prev]
      persist('m10-notifs', next)
      return next
    })
    setToast(item)
  }

  useEffect(() => {
    ;(async () => {
      const rawCart = await load('m10-cart', [])
      const rawFavs = await load('m10-favs', [DEFAULT_STORE_ID])
      setCart(
        rawCart
          .map((item) => ({ ...item, storeId: resolveStoreId(item.storeId) }))
          .filter((item) => seedStores.some((s) => s.id === resolveStoreId(item.storeId))),
      )
      const mappedFavs = rawFavs
        .map((id) => resolveStoreId(id))
        .filter((id) => seedStores.some((s) => s.id === id))
      const nextFavs = mappedFavs.length ? mappedFavs : [DEFAULT_STORE_ID]
      setFavorites(nextFavs)
      persist('m10-favs', nextFavs)
      setOrders(await load('m10-orders', []))
      setCoupon(await load('m10-coupon', null))
      const storedUser = await load('m10-user', null)
      const storedAccounts = await load('m10-accounts', {})
      setAccounts(storedAccounts && typeof storedAccounts === 'object' ? storedAccounts : {})
      if (storedUser?.loggedIn && storedUser.phone) {
        const role = normalizeRole(storedUser.role)
        setUser({
          ...guestUser(),
          ...storedUser,
          loggedIn: true,
          role,
          address: storedUser.address || seedUser.address,
          referralCode: storedUser.referralCode || makeReferralCode(storedUser.phone),
        })
        if (role === 'admin') setAdminUnlocked(true)
      } else {
        setUser({
          ...guestUser(),
          address: storedUser?.address || seedUser.address,
          role: normalizeRole(storedUser?.role),
        })
      }
      setAddresses(await load('m10-addresses', [seedUser.address]))
      const storedNotifs = await load('m10-notifs', null)
      if (Array.isArray(storedNotifs) && storedNotifs.length) {
        const ids = new Set(storedNotifs.map((n) => n.id))
        const missing = seedNotifications.filter((n) => !ids.has(n.id))
        setNotifications([...missing, ...storedNotifs])
      } else {
        setNotifications(seedNotifications)
      }
      setSeenStories(await load('m10-seen-stories', []))
      setWalletBalance(await load('m10-wallet', 15000))
      const storedLists = await load('m10-lists', null)
      if (Array.isArray(storedLists) && storedLists.length) {
        const seedIds = new Set(seedRecipes.map((s) => s.id))
        const custom = storedLists.filter((l) => !seedIds.has(l.id))
        setLists([...seedRecipes, ...custom])
      } else {
        setLists(seedRecipes)
      }
      setButlerJobs(await load('m10-butler', []))
      setReturns(await load('m10-returns', []))
      setStoreOverrides(await load('m10-store-overrides', {}))
      const storedCatalog = await load('m10-admin-catalog', null)
      if (Array.isArray(storedCatalog) && storedCatalog.length) {
        const ids = new Set(storedCatalog.map((p) => p.id))
        const missing = seedCatalog.filter((p) => !ids.has(p.id)).map((p) => ({ ...p, disabled: false }))
        setLiveCatalog([...storedCatalog, ...missing])
      } else {
        setLiveCatalog(cloneCatalog())
      }
      const storedAisles = await load('m10-admin-aisles', null)
      setLiveAisles(Array.isArray(storedAisles) && storedAisles.length ? storedAisles : seedLiveAisles())
      const storedCampaigns = await load('m10-admin-campaigns', null)
      setLiveCampaigns(
        Array.isArray(storedCampaigns) && storedCampaigns.length ? storedCampaigns : seedLiveCampaigns(),
      )
      const storedStores = await load('m10-admin-stores', null)
      if (Array.isArray(storedStores) && storedStores.length) {
        const cleaned = storedStores
          .filter((s) => s?.id !== 'm10-fresh-golden' && !/golden\s*square/i.test(String(s?.name || '')))
          .map((s) => {
            const id = resolveStoreId(s.id)
            const seed = seedStores.find((x) => x.id === id)
            return seed ? { ...seed, ...s, id, name: seed.name, nameEn: seed.nameEn, nameTr: seed.nameTr } : { ...s, id }
          })
        const byId = new Map(cleaned.map((s) => [s.id, s]))
        for (const s of seedStores) if (!byId.has(s.id)) byId.set(s.id, { ...s })
        const next = [...byId.values()]
        setLiveStores(next)
        persist('m10-admin-stores', next)
      } else {
        setLiveStores(seedLiveStores())
      }
      setSimulateOffline(!!(await load('m10-sim-offline', false)))
      const storedCouriers = await load('m10-admin-couriers', null)
      setCouriers(Array.isArray(storedCouriers) && storedCouriers.length ? storedCouriers : seedCouriers())
      setSurveys(await load('m10-surveys', []))
      const storedDemo = (await load('m10-demo-mode', 'customer')) || 'customer'
      setDemoMode(storedDemo)
      if (storedDemo === 'admin') setAdminUnlocked(true)
      const closeDemo = await load('m10-close-demo', { done: false, pending: false })
      closeDemoDone.current = !!closeDemo?.done
      closeDemoPending.current = !!closeDemo?.pending && !closeDemo?.done
      setDemoPushEnabledState(!!(await load('m10-demo-push-enabled', true)))
      // Light catalog cache for offline UX (compact product snapshot)
      const cacheSource = Array.isArray(storedCatalog) && storedCatalog.length ? storedCatalog : seedCatalog
      persist('m10-catalog-cache', {
        at: Date.now(),
        storeIds: seedStores.map((s) => s.id),
        defaultStoreId: DEFAULT_STORE_ID,
        productCount: cacheSource.length,
        products: cacheSource.slice(0, 120).map((p) => ({
          id: p.id,
          aisle: p.aisle,
          price: p.price,
          oldPrice: p.oldPrice,
          stock: p.stock,
          image: p.image,
          names: p.names || { ar: p.name, en: p.nameEn, tr: p.nameTr },
          barcode: p.barcode,
        })),
      })
      setHydrated(true)
    })()
  }, [])

  useEffect(() => {
    let cancelled = false
    let sub

    const applyNetwork = (state) => {
      const offline =
        simulateOffline ||
        state?.isConnected === false ||
        state?.isInternetReachable === false
      if (!cancelled) setIsOffline(!!offline)
    }

    const boot = async () => {
      try {
        const state = await Network.getNetworkStateAsync()
        applyNetwork(state)
      } catch {
        applyNetwork({
          isConnected: typeof navigator !== 'undefined' ? navigator.onLine !== false : true,
          isInternetReachable: true,
        })
      }
    }
    boot()

    if (typeof Network.addNetworkStateListener === 'function') {
      sub = Network.addNetworkStateListener((state) => applyNetwork(state))
    } else if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const apply = () =>
        setIsOffline(simulateOffline || (typeof navigator !== 'undefined' && navigator.onLine === false))
      window.addEventListener('online', apply)
      window.addEventListener('offline', apply)
      return () => {
        cancelled = true
        window.removeEventListener('online', apply)
        window.removeEventListener('offline', apply)
      }
    }

    return () => {
      cancelled = true
      sub?.remove?.()
    }
  }, [simulateOffline])

  useEffect(() => {
    if (!hydrated || closeDemoDone.current || Platform.OS === 'web') return undefined

    const scheduleDemo = () => {
      if (closeDemoTimer.current) clearTimeout(closeDemoTimer.current)
      closeDemoTimer.current = setTimeout(runCloseDemo, 700)
    }

    if (closeDemoPending.current) scheduleDemo()

    const sub = AppState.addEventListener('change', (next) => {
      if (closeDemoDone.current) return
      if (next === 'background') {
        closeDemoPending.current = true
        persist('m10-close-demo', { done: false, pending: true })
        return
      }
      if (next === 'active' && closeDemoPending.current) scheduleDemo()
    })

    return () => {
      sub.remove()
      if (closeDemoTimer.current) clearTimeout(closeDemoTimer.current)
    }
  }, [hydrated])

  const deliverDemoPush = (item, createdAt) => {
    setNotifications((prev) => {
      if (prev.some((n) => n.id === item.id)) return prev
      const next = [
        {
          read: false,
          createdAt: createdAt || Date.now(),
          ...item,
          id: item.id || `n-demo-${Date.now()}`,
        },
        ...prev,
      ]
      persist('m10-notifs', next)
      return next
    })
    markDemoQueueDelivered(item.id).catch(() => {})
  }

  const syncDemoInbox = () => {
    syncDemoQueueToInbox(
      notifications.map((n) => n.id),
      deliverDemoPush,
    ).catch(() => {})
  }

  useEffect(() => {
    if (!hydrated) return undefined
    syncDemoInbox()
    const detach = attachDemoPushListeners({ onDelivered: deliverDemoPush })
    const sub = AppState.addEventListener('change', (next) => {
      if (next === 'active') syncDemoInbox()
    })
    return () => {
      detach()
      sub.remove()
    }
  }, [hydrated])

  const cartCount = cart.reduce((n, i) => n + i.qty, 0)
  const cartStore = cart[0] ? getLiveStore(cart[0].storeId) : null
  const cartTotal = cart.reduce((n, i) => n + linePrice(i) * i.qty, 0)
  const cartDiscount = discountFor(cartTotal, coupon)
  const plusActive = isPlusActive(user)
  const cartFee = deliveryFeeFor(cartStore, cartTotal, coupon, { plusActive })
  const cartPayable = Math.max(0, cartTotal - cartDiscount) + cartFee

  const addToCart = (storeId, productId, qty = 1, opts = {}) => {
    const store = getLiveStore(storeId)
    const product = getLiveProduct(storeId, productId)
    if (!store || store.comingSoon || !product) return false
    const oKey = `${resolveStoreId(storeId)}:${productId}`
    const stockOverride = storeOverrides[oKey]?.stock
    const stocked = { ...product, stock: stockOverride != null ? stockOverride : product.stock }
    if (!isInStock(stocked)) return false
    const variantId = opts.variantId || null
    const unitPrice = opts.unitPrice != null ? opts.unitPrice : product.price
    setCart((prev) => {
      let next
      const sameLine = (x) => x.productId === productId && (x.variantId || null) === variantId
      if (prev.length && prev[0].storeId !== storeId) {
        next = [{ storeId, productId, qty, variantId, unitPrice }]
      } else {
        const i = prev.findIndex(sameLine)
        const stock = stocked.stock ?? 99
        if (i >= 0) {
          const nextQty = Math.min(stock, prev[i].qty + qty)
          next = prev.map((x, idx) => (idx === i ? { ...x, qty: nextQty, unitPrice } : x))
        } else {
          next = [...prev, { storeId, productId, qty: Math.min(stock, qty), variantId, unitPrice }]
        }
      }
      persist('m10-cart', next)
      return next
    })
    return true
  }

  const setQty = (productId, qty, variantId = null) => {
    setCart((prev) => {
      const line =
        prev.find((x) => x.productId === productId && (x.variantId || null) === (variantId || null)) ||
        prev.find((x) => x.productId === productId)
      const product = line ? getLiveProduct(line.storeId, productId) : null
      const stock = product?.stock ?? 99
      const capped = Math.min(qty, stock)
      const match = (x) =>
        x.productId === productId &&
        (line?.variantId != null ? (x.variantId || null) === (line.variantId || null) : true)
      const next =
        capped <= 0
          ? prev.filter((x) => !match(x))
          : prev.map((x) => (match(x) ? { ...x, qty: capped } : x))
      persist('m10-cart', next)
      return next
    })
  }

  const clearCart = () => {
    persist('m10-cart', [])
    setCart([])
  }

  const reorder = (order) => {
    if (!order?.items?.length) return false
    const storeId = resolveStoreId(order.storeId)
    const store = getLiveStore(storeId)
    if (!store || store.comingSoon) return false
    const next = order.items
      .map((i) => {
        const p = getLiveProduct(storeId, i.productId)
        if (!p || !isInStock(p)) return null
        return { storeId, productId: i.productId, qty: Math.min(i.qty, p.stock ?? 99) }
      })
      .filter(Boolean)
    if (!next.length) return false
    persist('m10-cart', next)
    setCart(next)
    return true
  }

  const cancelOrder = (orderId) => {
    setOrders((prev) => {
      const next = prev.map((o) =>
        o.id === orderId && o.status !== 'cancelled'
          ? { ...o, status: 'cancelled', cancelledAt: Date.now() }
          : o,
      )
      persist('m10-orders', next)
      return next
    })
  }

  const rateOrder = (orderId, { storeStars, courierStars, comment, answers } = {}) => {
    if (!orderId || !storeStars || !courierStars) return false
    setOrders((prev) => {
      const next = prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              rating: {
                store: storeStars,
                courier: courierStars,
                comment: comment || '',
                answers: answers || {},
                at: Date.now(),
              },
            }
          : o,
      )
      persist('m10-orders', next)
      return next
    })
    // Also keep a flat survey log for demo inspection
    const entry = {
      orderId,
      storeStars,
      courierStars,
      comment: comment || '',
      answers: answers || {},
      at: Date.now(),
    }
    setSurveys((prev) => {
      const list = Array.isArray(prev) ? prev : []
      const next = [entry, ...list].slice(0, 50)
      persist('m10-surveys', next)
      return next
    })
    setUser((u) => {
      const updated = { ...u, points: (u.points || 0) + 20 }
      persistUser(updated)
      return updated
    })
    return true
  }

  const toggleFavorite = (storeId) => {
    setFavorites((prev) => {
      const next = prev.includes(storeId)
        ? prev.filter((id) => id !== storeId)
        : [...prev, storeId]
      persist('m10-favs', next)
      return next
    })
  }

  const persistUser = (next) => {
    persist('m10-user', next)
    if (next?.loggedIn && next.phone) {
      const key = normalizePhone(next.phone)
      const snapshot = {
        name: next.name,
        phone: next.phone,
        points: next.points,
        tier: next.tier,
        role: next.role || 'customer',
        referralCode: next.referralCode,
        referredBy: next.referredBy,
        referralCount: next.referralCount,
        walletBalance,
      }
      Promise.resolve().then(() => {
        setAccounts((prev) => {
          const updated = { ...prev, [key]: snapshot }
          persist('m10-accounts', updated)
          return updated
        })
      })
    }
  }

  const topUpWallet = (amount) => {
    const n = Math.max(0, Number(amount) || 0)
    setWalletBalance((prev) => {
      const next = prev + n
      persist('m10-wallet', next)
      return next
    })
    return true
  }

  const addListToCart = (list) => {
    const resolved = resolveListItems(list)
    if (!resolved.length) return { ok: false, added: 0 }
    const storeId = resolveStoreId(list.storeId || DEFAULT_STORE_ID)
    let added = 0
    for (const row of resolved) {
      if (addToCart(storeId, row.productId, row.qty)) added += 1
    }
    return { ok: added > 0, added }
  }

  const saveCustomList = (list) => {
    setLists((prev) => {
      const next = [list, ...prev.filter((l) => l.id !== list.id)]
      persist('m10-lists', next)
      return next
    })
  }

  const requestButler = ({ need, pickup, dropoff, when }) => {
    const job = {
      id: `M10-B-${Date.now().toString().slice(-6)}`,
      createdAt: Date.now(),
      need,
      pickup,
      dropoff,
      when,
      status: 'active',
      captain: 'كاوه · M10',
      fee: 3500,
    }
    setButlerJobs((prev) => {
      const next = [job, ...prev]
      persist('m10-butler', next)
      return next
    })
    pushNotification({
      id: `n-butler-${job.id}`,
      titleAr: 'تم قبول طلب الشوفير',
      titleEn: 'Butler accepted',
      titleTr: 'Şoför talebi kabul edildi',
      bodyAr: job.need,
      bodyEn: job.need,
      bodyTr: job.need,
      cta: { screen: 'ButlerTrack', params: { id: job.id } },
    })
    return job
  }

  const redeemReferral = (code) => {
    const normalized = String(code || '')
      .trim()
      .toUpperCase()
    if (!normalized || !user?.loggedIn) return { ok: false, reason: 'auth' }
    if (user.referredBy) return { ok: false, reason: 'already' }
    if (normalized === (user.referralCode || '').toUpperCase()) return { ok: false, reason: 'self' }
    if (!/^M10-/.test(normalized)) return { ok: false, reason: 'invalid' }
    setUser((u) => {
      const updated = {
        ...u,
        referredBy: normalized,
        points: (u.points || 0) + REFERRAL_REDEEM_BONUS,
        referralCount: u.referralCount || 0,
      }
      persistUser(updated)
      return updated
    })
    setWalletBalance((prev) => {
      const next = prev + 1000
      persist('m10-wallet', next)
      return next
    })
    pushNotification({
      id: `n-ref-${Date.now()}`,
      titleAr: 'تم تفعيل رمز الدعوة',
      titleEn: 'Referral applied',
      titleTr: 'Davet kodu uygulandı',
      bodyAr: `+${REFERRAL_REDEEM_BONUS} نقطة`,
      bodyEn: `+${REFERRAL_REDEEM_BONUS} points`,
      bodyTr: `+${REFERRAL_REDEEM_BONUS} puan`,
      cta: { screen: 'Referral' },
    })
    return { ok: true, points: REFERRAL_REDEEM_BONUS }
  }

  const shareReferralCredit = () => {
    if (!user?.loggedIn) return false
    setUser((u) => {
      const updated = {
        ...u,
        points: (u.points || 0) + REFERRAL_BONUS,
        referralCount: (u.referralCount || 0) + 1,
      }
      persistUser(updated)
      return updated
    })
    return true
  }

  const submitReturn = ({ orderId, itemIds, reason, type }) => {
    const order = orders.find((o) => o.id === orderId)
    if (!order) return null
    const req = {
      id: `RET-${Date.now().toString().slice(-6)}`,
      orderId,
      itemIds: itemIds || [],
      reason: reason || '',
      type: type || 'missing',
      status: 'submitted',
      createdAt: Date.now(),
      refundHint: Math.round((order.total || 0) * 0.15),
    }
    setReturns((prev) => {
      const next = [req, ...prev]
      persist('m10-returns', next)
      return next
    })
    setOrders((prev) => {
      const next = prev.map((o) =>
        o.id === orderId ? { ...o, returnId: req.id, returnStatus: 'submitted' } : o,
      )
      persist('m10-orders', next)
      return next
    })
    pushNotification({
      id: `n-ret-${req.id}`,
      titleAr: 'تم استلام بلاغ الإرجاع',
      titleEn: 'Return request received',
      titleTr: 'İade talebi alındı',
      bodyAr: orderId,
      bodyEn: orderId,
      bodyTr: orderId,
      cta: { screen: 'OrdersTab' },
    })
    return req
  }

  const adminSetOrderStatus = (orderId, status) => {
    setOrders((prev) => {
      const next = prev.map((o) => (o.id === orderId ? { ...o, status, adminUpdatedAt: Date.now() } : o))
      persist('m10-orders', next)
      return next
    })
  }

  const adminToggleStock = (storeId, productId) => {
    const sid = resolveStoreId(storeId)
    setStoreOverrides((prev) => {
      const key = `${sid}:${productId}`
      const cur = prev[key] || {}
      const product = getLiveProduct(sid, productId)
      const nextStock = cur.stock != null ? (cur.stock > 0 ? 0 : 12) : product?.stock === 0 ? 12 : 0
      const next = { ...prev, [key]: { ...cur, stock: nextStock } }
      persist('m10-store-overrides', next)
      return next
    })
  }

  const adminUpsertProduct = (product) => {
    if (!product?.id) return false
    setLiveCatalog((prev) => {
      const i = prev.findIndex((p) => p.id === product.id)
      const names = product.names || {
        ar: product.nameAr || product.name || '',
        en: product.nameEn || '',
        tr: product.nameTr || '',
      }
      const normalized = {
        ...(i >= 0 ? prev[i] : {}),
        ...product,
        name: names.ar || product.name || '',
        names,
        image: product.image || product.imageUrl || (i >= 0 ? prev[i].image : ''),
        images: product.images || (product.image ? [product.image] : i >= 0 ? prev[i].images : []),
        disabled: !!product.disabled,
        price: Number(product.price) || 0,
        stock: product.stock != null ? Number(product.stock) : 20,
        aisle: product.aisle || 'pantry',
        tryInRoom: !!product.tryInRoom,
        barcode: product.barcode || '',
      }
      const next = i >= 0 ? prev.map((p, idx) => (idx === i ? normalized : p)) : [...prev, normalized]
      persist('m10-admin-catalog', next)
      return next
    })
    return true
  }

  const adminDeleteProduct = (productId) => {
    setLiveCatalog((prev) => {
      const next = prev.map((p) => (p.id === productId ? { ...p, disabled: true } : p))
      persist('m10-admin-catalog', next)
      return next
    })
  }

  const adminToggleProductDisabled = (productId) => {
    setLiveCatalog((prev) => {
      const next = prev.map((p) => (p.id === productId ? { ...p, disabled: !p.disabled } : p))
      persist('m10-admin-catalog', next)
      return next
    })
  }

  const adminUpsertAisle = (aisle) => {
    if (!aisle?.id) return false
    setLiveAisles((prev) => {
      const i = prev.findIndex((a) => a.id === aisle.id)
      const normalized = {
        id: String(aisle.id)
          .toLowerCase()
          .replace(/[^a-z0-9_-]/g, '-')
          .slice(0, 32),
        enabled: aisle.enabled !== false,
        nameAr: aisle.nameAr || '',
        nameEn: aisle.nameEn || '',
        nameTr: aisle.nameTr || '',
      }
      const next = i >= 0 ? prev.map((a, idx) => (idx === i ? { ...a, ...normalized, id: a.id } : a)) : [...prev, normalized]
      persist('m10-admin-aisles', next)
      return next
    })
    return true
  }

  const adminToggleAisle = (aisleId) => {
    setLiveAisles((prev) => {
      const next = prev.map((a) => (a.id === aisleId ? { ...a, enabled: !a.enabled } : a))
      persist('m10-admin-aisles', next)
      return next
    })
  }

  const adminUpsertCampaign = (campaign) => {
    if (!campaign?.id && !campaign?.titleAr && !campaign?.titleEn && !campaign?.titleTr) return false
    setLiveCampaigns((prev) => {
      const id = campaign.id || `camp-${Date.now().toString(36)}`
      const i = prev.findIndex((c) => c.id === id)
      const productIds = campaign.productIds || campaign.skus || []
      const normalized = {
        ...(i >= 0 ? prev[i] : {}),
        ...campaign,
        id,
        productIds,
        skus: productIds,
        discount: Number(campaign.discount) || 0,
        active: campaign.active !== false,
        kickerAr: campaign.kickerAr || 'عروض',
        kickerEn: campaign.kickerEn || 'DEALS',
        kickerTr: campaign.kickerTr || 'AKTÜEL',
        titleAr: campaign.titleAr || campaign.title || '',
        titleEn: campaign.titleEn || campaign.title || '',
        titleTr: campaign.titleTr || campaign.title || '',
        subAr: campaign.subAr || '',
        subEn: campaign.subEn || '',
        subTr: campaign.subTr || '',
      }
      const next = i >= 0 ? prev.map((c, idx) => (idx === i ? normalized : c)) : [...prev, normalized]
      persist('m10-admin-campaigns', next)
      return next
    })
    return true
  }

  const adminDeleteCampaign = (campaignId) => {
    setLiveCampaigns((prev) => {
      const next = prev.filter((c) => c.id !== campaignId)
      persist('m10-admin-campaigns', next)
      return next
    })
  }

  const adminUpdateStore = (storeId, patch) => {
    const sid = resolveStoreId(storeId)
    setLiveStores((prev) => {
      const next = prev.map((s) => {
        if (s.id !== sid) return s
        return {
          ...s,
          ...patch,
          eta: patch.eta != null ? String(patch.eta) : s.eta,
          fee: patch.fee != null ? Number(patch.fee) : s.fee,
          minOrder: patch.minOrder != null ? Number(patch.minOrder) : s.minOrder,
        }
      })
      persist('m10-admin-stores', next)
      return next
    })
  }

  const adminSetCustomerPoints = (phone, points) => {
    const key = normalizePhone(phone)
    if (!key) return false
    const pts = Math.max(0, Math.round(Number(points) || 0))
    setAccounts((prev) => {
      const cur = prev[key] || {}
      const next = { ...prev, [key]: { ...cur, phone: formatIqPhone(key), points: pts } }
      persist('m10-accounts', next)
      return next
    })
    setUser((u) => {
      if (normalizePhone(u.phone) !== key) return u
      const next = { ...u, points: pts }
      persistUser(next)
      return next
    })
    return true
  }

  const adminUpsertCourier = (courier) => {
    if (!courier?.name && !courier?.phone) return false
    setCouriers((prev) => {
      const id = courier.id || `c-${Date.now().toString(36)}`
      const i = prev.findIndex((c) => c.id === id)
      const normalized = {
        ...(i >= 0 ? prev[i] : {}),
        ...courier,
        id,
        name: courier.name || courier.nameTr || courier.nameEn || courier.nameAr || '',
        nameAr: courier.nameAr || courier.name || '',
        nameEn: courier.nameEn || courier.name || '',
        nameTr: courier.nameTr || courier.name || '',
        phone: courier.phone || '',
        vehicle: courier.vehicle || 'motorcycle',
        active: courier.active !== false,
      }
      const next = i >= 0 ? prev.map((c, idx) => (idx === i ? normalized : c)) : [...prev, normalized]
      persist('m10-admin-couriers', next)
      return next
    })
    return true
  }

  const adminToggleCourier = (courierId) => {
    setCouriers((prev) => {
      const next = prev.map((c) => (c.id === courierId ? { ...c, active: !c.active } : c))
      persist('m10-admin-couriers', next)
      return next
    })
  }

  const adminDeleteCourier = (courierId) => {
    setCouriers((prev) => {
      const next = prev.filter((c) => c.id !== courierId)
      persist('m10-admin-couriers', next)
      return next
    })
  }

  /** Add product IDs into an existing campaign (Aktüel) or the first active one. */
  const adminAddProductsToCampaign = (productIds, campaignId) => {
    const ids = (Array.isArray(productIds) ? productIds : [productIds]).filter(Boolean)
    if (!ids.length) return false
    setLiveCampaigns((prev) => {
      let target = campaignId ? prev.find((c) => c.id === campaignId) : null
      if (!target) target = prev.find((c) => c.active !== false) || prev[0]
      if (!target) {
        const created = {
          id: `camp-${Date.now().toString(36)}`,
          titleAr: 'عروض',
          titleEn: 'Deals',
          titleTr: 'Aktüel',
          kickerAr: 'عروض',
          kickerEn: 'DEALS',
          kickerTr: 'AKTÜEL',
          discount: 10,
          productIds: ids,
          skus: ids,
          active: true,
        }
        const next = [...prev, created]
        persist('m10-admin-campaigns', next)
        return next
      }
      const existing = new Set([...(target.productIds || target.skus || []), ...ids])
      const productIdsNext = [...existing]
      const next = prev.map((c) =>
        c.id === target.id ? { ...c, productIds: productIdsNext, skus: productIdsNext } : c,
      )
      persist('m10-admin-campaigns', next)
      return next
    })
    return true
  }

  const unlockAdmin = (pin) => {
    if (String(pin).trim() === ADMIN_PIN || user?.role === 'admin' || demoMode === 'admin') {
      setAdminUnlocked(true)
      return true
    }
    return false
  }

  const lockAdmin = () => setAdminUnlocked(false)

  const isAdminAccess =
    adminUnlocked || user?.role === 'admin' || demoMode === 'admin'

  const courierUpdateOrder = (orderId, status) => adminSetOrderStatus(orderId, status)

  const setOfflineSim = (on) => {
    setSimulateOffline(!!on)
    persist('m10-sim-offline', !!on)
  }

  const setAppDemoMode = (mode) => {
    const m = mode === 'admin' || mode === 'courier' ? mode : 'customer'
    setDemoMode(m)
    persist('m10-demo-mode', m)
    if (m === 'admin') setAdminUnlocked(true)
    setUser((u) => {
      const next = { ...u, role: m }
      persistUser(next)
      return next
    })
  }

  const setUserRole = (role) => {
    const r = normalizeRole(role)
    setDemoMode(r)
    persist('m10-demo-mode', r)
    if (r === 'admin') setAdminUnlocked(true)
    setUser((u) => {
      const next = { ...u, role: r }
      persistUser(next)
      return next
    })
  }

  const placeOrder = ({ payment, schedule, note, slot, cardLast4, paymentMethod, walletPaid }) => {
    if (isOffline) return null
    const fee = cartFee
    const discount = cartDiscount
    const method = paymentMethod || (payment === 'card' || payment === 'wallet' || payment === 'apple' || payment === 'google' ? payment : 'cash')
    let paidFromWallet = 0
    if (method === 'wallet' || walletPaid) {
      paidFromWallet = Math.min(walletBalance, cartPayable)
      if (paidFromWallet < cartPayable && method === 'wallet') return null
      const nextBal = walletBalance - paidFromWallet
      setWalletBalance(nextBal)
      persist('m10-wallet', nextBal)
    }
    const order = {
      id: `M10-${Date.now().toString().slice(-7)}`,
      createdAt: Date.now(),
      items: cart,
      storeId: cart[0]?.storeId,
      total: cartPayable,
      subtotal: cartTotal,
      fee,
      discount,
      payment: payment || method,
      paymentMethod: method,
      schedule: schedule || 'now',
      slot: slot || null,
      cardLast4: cardLast4 || null,
      walletPaid: paidFromWallet || 0,
      note,
      address: {
        ...(user.address || {}),
        lat: user.address?.lat ?? coordsForAddress(user.address).lat,
        lng: user.address?.lng ?? coordsForAddress(user.address).lng,
      },
      status: 'confirmed',
      coupon: coupon || null,
      pointsEarned: Math.round(cartTotal / 1000),
      paymentStatus: method === 'cash' ? 'cod' : 'paid',
    }
    const next = [order, ...orders]
    persist('m10-orders', next)
    setOrders(next)
    setUser((u) => {
      const updated = { ...u, points: (u.points || 0) + order.pointsEarned }
      persistUser(updated)
      return updated
    })
    if (coupon) {
      setCoupon(null)
      persist('m10-coupon', null)
    }
    pushNotification({
      id: `n-order-${order.id}`,
      titleAr: 'تم تأكيد طلبك',
      titleEn: 'Order confirmed',
      titleTr: 'Siparişin onaylandı',
      bodyAr: `${order.id} — يمكنك تتبع الطلب.`,
      bodyEn: `${order.id} — you can track it now.`,
      bodyTr: `${order.id} — şimdi takip edebilirsin.`,
      cta: { screen: 'Track', params: { id: order.id } },
    })
    if (user?.pushEnabled) {
      scheduleLocalDemo({
        title: 'M10',
        body: order.id,
        seconds: 0,
      }).catch(() => {})
    }
    clearCart()
    return order
  }

  const subscribePlus = () => {
    setUser((u) => {
      const expiresAt = Date.now() + M10_PLUS.durationDays * 24 * 60 * 60 * 1000
      const updated = {
        ...u,
        m10Plus: { active: true, since: Date.now(), expiresAt, planId: M10_PLUS.id },
        tier: 'Plus',
      }
      persistUser(updated)
      return updated
    })
    pushNotification({
      id: `n-plus-${Date.now()}`,
      titleAr: 'تم تفعيل M10+',
      titleEn: 'M10+ activated',
      titleTr: 'M10+ aktif',
      bodyAr: 'توصيل مجاني على كل الطلبات.',
      bodyEn: 'Free delivery on all orders.',
      bodyTr: 'Tüm siparişlerde ücretsiz teslimat.',
      cta: { screen: 'Plus' },
    })
  }

  const cancelPlus = () => {
    setUser((u) => {
      const updated = {
        ...u,
        m10Plus: u.m10Plus ? { ...u.m10Plus, active: false, cancelledAt: Date.now() } : null,
        tier: u.tier === 'Plus' ? 'Gold' : u.tier,
      }
      persistUser(updated)
      return updated
    })
  }

  const setPushEnabled = (enabled) => {
    setUser((u) => {
      const updated = { ...u, pushEnabled: !!enabled }
      persistUser(updated)
      return updated
    })
  }

  const setDemoPushEnabled = (enabled) => {
    const next = !!enabled
    setDemoPushEnabledState(next)
    persist('m10-demo-push-enabled', next)
  }

  const scheduleDemoNotifications = async (lang = 'tr') => {
    if (!demoPushEnabled) return { ok: false, reason: 'disabled' }
    return scheduleDemoPushSeries({ lang, onDelivered: deliverDemoPush })
  }

  const redeemReward = (reward) => {
    const cost = typeof reward === 'number' ? reward : reward?.cost
    const full = typeof reward === 'object' ? reward : null
    setUser((u) => {
      if ((u.points || 0) < cost) return u
      const updated = { ...u, points: u.points - cost }
      persistUser(updated)
      return updated
    })
    if (full?.type) {
      const nextCoupon = {
        id: full.id,
        type: full.type,
        value: full.value,
        title: full.title,
        titleEn: full.titleEn,
        titleTr: full.titleTr,
        productId: full.productId,
      }
      setCoupon(nextCoupon)
      persist('m10-coupon', nextCoupon)
    }
  }

  const clearCoupon = () => {
    setCoupon(null)
    persist('m10-coupon', null)
  }

  const updateUser = (updater) => {
    setUser((u) => {
      const next = typeof updater === 'function' ? updater(u) : updater
      persistUser(next)
      return next
    })
  }

  const findAccount = (phone) => accounts[normalizePhone(phone)] || null

  const login = (phone, name, opts = {}) => {
    const key = normalizePhone(phone)
    const existing = accounts[key]
    const demo = DEMO_ACCOUNTS.find((a) => normalizePhone(a.phone) === key)
    const role = normalizeRole(opts.role || existing?.role || demo?.role || roleFromDemo(phone) || user.role)
    const next = {
      ...user,
      loggedIn: true,
      phone: formatIqPhone(key),
      name: (name && String(name).trim()) || existing?.name || demo?.name || demoNameFromPhone(key),
      points: existing?.points ?? user.points ?? 0,
      tier: existing?.tier || user.tier || 'Gold',
      role,
      address: user.address || seedUser.address,
      referralCode: existing?.referralCode || makeReferralCode(key),
      referredBy: existing?.referredBy || user.referredBy || null,
      referralCount: existing?.referralCount ?? user.referralCount ?? 0,
      walletBalance: existing?.walletBalance ?? walletBalance,
    }
    if (existing?.walletBalance != null) {
      setWalletBalance(existing.walletBalance)
      persist('m10-wallet', existing.walletBalance)
    }
    setDemoMode(role)
    persist('m10-demo-mode', role)
    if (role === 'admin') setAdminUnlocked(true)
    persistUser(next)
    setUser(next)
    return next
  }

  const logout = () => {
    setUser((u) => {
      const next = { ...guestUser(), address: u.address || seedUser.address }
      persist('m10-user', next)
      return next
    })
  }

  const updateAddresses = (updater) => {
    setAddresses((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      persist('m10-addresses', next)
      return next
    })
  }

  const pushNotification = (item) => {
    setNotifications((prev) => {
      const next = [
        {
          read: false,
          createdAt: Date.now(),
          ...item,
          id: item.id || `n-${Date.now()}`,
        },
        ...prev,
      ]
      persist('m10-notifs', next)
      return next
    })
  }

  const markNotificationRead = (id) => {
    setNotifications((prev) => {
      const next = prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      persist('m10-notifs', next)
      return next
    })
  }

  const markAllNotificationsRead = () => {
    setNotifications((prev) => {
      const next = prev.map((n) => ({ ...n, read: true }))
      persist('m10-notifs', next)
      return next
    })
  }

  const markStorySeen = (id) => {
    setSeenStories((prev) => {
      if (prev.includes(id)) return prev
      const next = [...prev, id]
      persist('m10-seen-stories', next)
      return next
    })
    setNotifications((prev) => {
      const next = prev.map((n) => (n.storyId === id ? { ...n, read: true } : n))
      persist('m10-notifs', next)
      return next
    })
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  const value = useMemo(
    () => ({
      hydrated,
      cart,
      cartCount,
      cartStore,
      cartTotal,
      cartFee,
      cartDiscount,
      cartPayable,
      coupon,
      addToCart,
      setQty,
      clearCart,
      reorder,
      cancelOrder,
      rateOrder,
      favorites,
      toggleFavorite,
      orders,
      placeOrder,
      user,
      setUser: updateUser,
      addresses,
      setAddresses: updateAddresses,
      redeemReward,
      clearCoupon,
      subscribePlus,
      cancelPlus,
      plusActive,
      setPushEnabled,
      demoPushEnabled,
      setDemoPushEnabled,
      scheduleDemoNotifications,
      isLoggedIn: !!user?.loggedIn,
      login,
      logout,
      findAccount,
      accounts,
      notifications,
      unreadCount,
      pushNotification,
      markNotificationRead,
      markAllNotificationsRead,
      seenStories,
      markStorySeen,
      toast,
      dismissToast,
      walletBalance,
      topUpWallet,
      lists,
      addListToCart,
      saveCustomList,
      butlerJobs,
      requestButler,
      redeemReferral,
      shareReferralCredit,
      returns,
      submitReturn,
      storeOverrides,
      liveCatalog,
      liveAisles,
      liveCampaigns,
      liveStores,
      getLiveStore,
      getLiveProducts,
      getLiveProduct,
      getLiveFlyer,
      adminSetOrderStatus,
      adminToggleStock,
      adminUpsertProduct,
      adminDeleteProduct,
      adminToggleProductDisabled,
      adminUpsertAisle,
      adminToggleAisle,
      adminUpsertCampaign,
      adminDeleteCampaign,
      adminUpdateStore,
      adminSetCustomerPoints,
      adminUpsertCourier,
      adminToggleCourier,
      adminDeleteCourier,
      adminAddProductsToCampaign,
      couriers,
      surveys,
      unlockAdmin,
      lockAdmin,
      adminUnlocked,
      isAdminAccess,
      courierUpdateOrder,
      isOffline,
      setOfflineSim,
      simulateOffline,
      demoMode,
      setAppDemoMode,
      setUserRole,
      demoPushEnabled,
      isCourier: (user?.role || demoMode) === 'courier',
      isAdmin: (user?.role || demoMode) === 'admin',
    }),
    [
      hydrated,
      cart,
      cartCount,
      cartStore,
      cartTotal,
      cartFee,
      cartDiscount,
      cartPayable,
      coupon,
      favorites,
      orders,
      user,
      addresses,
      accounts,
      notifications,
      seenStories,
      toast,
      plusActive,
      walletBalance,
      lists,
      butlerJobs,
      returns,
      storeOverrides,
      liveCatalog,
      liveAisles,
      liveCampaigns,
      liveStores,
      couriers,
      surveys,
      adminUnlocked,
      isAdminAccess,
      isOffline,
      simulateOffline,
      demoMode,
      demoPushEnabled,
    ],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useApp = () => useContext(AppContext)
