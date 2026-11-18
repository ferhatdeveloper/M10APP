import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { formatIQD, stores, getProducts, getStore, getProduct, categories, rewards } from '../data/mock.web.js'

const AppContext = createContext(null)

const DEFAULT_USER = {
  name: 'مستخدم M10',
  phone: '0770 123 4567',
  points: 2500,
  tier: 'Gold',
  address: {
    label: 'المنزل',
    city: 'بغداد',
    area: 'المنصور',
    details: 'شارع 14 رمضان، قرب مول المنصور',
    note: '',
  },
}

const load = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

const persist = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {}
}

export function AppProvider({ children }) {
  const [cart, setCart] = useState([])
  const [favorites, setFavorites] = useState([])
  const [orders, setOrders] = useState([])
  const [user, setUser] = useState(DEFAULT_USER)
  const [addresses, setAddresses] = useState([DEFAULT_USER.address])

  useEffect(() => {
    setCart(load('m10-cart', []))
    setFavorites(load('m10-favs', []))
    setOrders(load('m10-orders', []))
    const storedUser = load('m10-user', null)
    if (storedUser) setUser({ ...DEFAULT_USER, ...storedUser })
    setAddresses(load('m10-addresses', [DEFAULT_USER.address]))
  }, [])

  const cartCount = cart.reduce((n, i) => n + i.qty, 0)
  const cartStore = cart[0] ? getStore(cart[0].storeId) : null
  const cartTotal = cart.reduce((n, i) => {
    const p = getProduct(i.storeId, i.productId)
    return n + (p?.price || 0) * i.qty
  }, 0)

  const addToCart = (storeId, productId, qty = 1) => {
    setCart((prev) => {
      let next
      if (prev.length && prev[0].storeId !== storeId) {
        next = [{ storeId, productId, qty }]
      } else {
        const i = prev.findIndex((x) => x.productId === productId)
        if (i >= 0) {
          next = prev.map((x, idx) => (idx === i ? { ...x, qty: x.qty + qty } : x))
        } else {
          next = [...prev, { storeId, productId, qty }]
        }
      }
      persist('m10-cart', next)
      return next
    })
    return true
  }

  const setQty = (productId, qty) => {
    setCart((prev) => {
      const next = qty <= 0
        ? prev.filter((x) => x.productId !== productId)
        : prev.map((x) => (x.productId === productId ? { ...x, qty } : x))
      persist('m10-cart', next)
      return next
    })
  }

  const clearCart = () => {
    persist('m10-cart', [])
    setCart([])
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

  const placeOrder = async ({ payment, schedule, note }) => {
    const fee = cartStore?.fee || 0
    const order = {
      id: `M10-${Date.now().toString(36).toUpperCase()}`,
      createdAt: Date.now(),
      items: cart.map((c) => ({ ...c })),
      storeId: cart[0]?.storeId,
      total: cartTotal + fee,
      fee,
      payment,
      schedule,
      note,
      status: 'confirmed',
    }
    setOrders((prev) => {
      const next = [order, ...prev]
      persist('m10-orders', next)
      return next
    })
    clearCart()
    return order
  }

  const redeemReward = (reward) => {
    const cost = typeof reward === 'number' ? reward : reward?.cost
    setUser((u) => {
      if ((u.points || 0) < cost) return u
      const updated = { ...u, points: u.points - cost }
      persist('m10-user', updated)
      return updated
    })
  }

  const value = useMemo(
    () => ({
      cart,
      cartCount,
      cartStore,
      cartTotal,
      addToCart,
      setQty,
      clearCart,
      favorites,
      toggleFavorite,
      orders,
      placeOrder,
      user,
      setUser,
      addresses,
      setAddresses,
      redeemReward,
      formatIQD,
      stores,
      categories,
      rewards,
      getStore,
      getProducts,
      getProduct,
      getLiveStore: getStore,
    }),
    [cart, cartCount, cartStore, cartTotal, favorites, orders, user, addresses]
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useApp = () => useContext(AppContext)
