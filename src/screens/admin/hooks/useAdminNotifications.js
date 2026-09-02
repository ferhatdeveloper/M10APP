import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

const SAMPLE_NOTIFICATIONS = [
  { id: 'n1', kind: 'order', title: 'Yeni sipariş #ORD-2418', body: 'Müşteri: Ali Y. — 47.500 IQD', minutesAgo: 1 },
  { id: 'n2', kind: 'stock', title: 'Stok uyarısı: Süzme Yoğurt 1kg', body: 'Mevcut stok: 4 adet (eşik altında)', minutesAgo: 8 },
  { id: 'n3', kind: 'campaign', title: 'Kampanya sona eriyor', body: 'Hafta sonu indirimi bugün bitiyor', minutesAgo: 22 },
  { id: 'n4', kind: 'customer', title: 'Yeni müşteri kaydı', body: '+964 770 555 22 11 M10+ üyesi oldu', minutesAgo: 47 },
  { id: 'n5', kind: 'order', title: 'Sipariş #ORD-2411 teslim edildi', body: 'Kurye: Hüseyin D.', minutesAgo: 65 },
  { id: 'n6', kind: 'system', title: 'J-Suite ERP senkronu tamamlandı', body: '142 ürün güncellendi', minutesAgo: 120 },
]

const KIND_COLOR = {
  order: '#E31E24',
  stock: '#B86A00',
  campaign: '#6E36F3',
  customer: '#12803C',
  system: '#7A7A7A',
}

export default function useAdminNotifications({ intervalMs = 30000 } = {}) {
  const [items, setItems] = useState(SAMPLE_NOTIFICATIONS)
  const counterRef = useRef(SAMPLE_NOTIFICATIONS.length)

  const add = useCallback((n) => {
    counterRef.current += 1
    setItems((prev) => [
      { id: `live-${counterRef.current}`, minutesAgo: 0, kind: 'order', ...n },
      ...prev,
    ])
  }, [])

  useEffect(() => {
    if (!intervalMs) return undefined
    const timer = setInterval(() => {
      const sample = {
        order: () => ({
          kind: 'order',
          title: `Yeni sipariş #ORD-${Math.floor(2000 + Math.random() * 800)}`,
          body: 'Otomatik bildirim',
        }),
        stock: () => ({
          kind: 'stock',
          title: 'Düşük stok',
          body: 'Bir ürün eşiğin altına düştü',
        }),
      }[Math.random() < 0.7 ? 'order' : 'stock']()
      add(sample)
    }, intervalMs)
    return () => clearInterval(timer)
  }, [add, intervalMs])

  const markAllRead = useCallback(() => {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })))
  }, [])

  const unreadCount = useMemo(() => items.filter((n) => !n.read).length, [items])

  return { items, add, markAllRead, unreadCount, KIND_COLOR }
}
