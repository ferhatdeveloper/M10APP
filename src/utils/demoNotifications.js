import AsyncStorage from '@react-native-async-storage/async-storage'
import { Platform } from 'react-native'
import { dictionaries, t as translate } from '../i18n'
import {
  cancelScheduledDemoNotifications,
  pushSupported,
  requestPushPermission,
  scheduleLocalDemo,
  subscribePushEvents,
} from './push'

export const DEMO_PUSH_QUEUE_KEY = 'm10-demo-push-queue'

export const DEMO_PUSH_SPECS = [
  {
    id: 'n-demo-push-1',
    titleKey: 'demoNotif1Title',
    bodyKey: 'demoNotif1Body',
    cta: { screen: 'OrdersTab' },
  },
  {
    id: 'n-demo-push-2',
    titleKey: 'demoNotif2Title',
    bodyKey: 'demoNotif2Body',
    cta: { screen: 'Track', params: { id: 'M10-DEMO' } },
  },
  {
    id: 'n-demo-push-3',
    titleKey: 'demoNotif3Title',
    bodyKey: 'demoNotif3Body',
    cta: { screen: 'HomeTab' },
  },
  {
    id: 'n-demo-push-4',
    titleKey: 'demoNotif4Title',
    bodyKey: 'demoNotif4Body',
    storyId: 's-aktuel',
    cta: { screen: 'Flyer', params: { id: 'week' } },
  },
  {
    id: 'n-demo-push-5',
    titleKey: 'demoNotif5Title',
    bodyKey: 'demoNotif5Body',
    cta: { screen: 'Plus' },
  },
]

export const DEMO_PUSH_SECONDS = [5, 30, 60, 120, 180]

const webTimers = []

export function buildDemoPushItem(spec) {
  return {
    id: spec.id,
    titleTr: translate(dictionaries.tr, spec.titleKey),
    titleEn: translate(dictionaries.en, spec.titleKey),
    titleAr: translate(dictionaries.ar, spec.titleKey),
    bodyTr: translate(dictionaries.tr, spec.bodyKey),
    bodyEn: translate(dictionaries.en, spec.bodyKey),
    bodyAr: translate(dictionaries.ar, spec.bodyKey),
    ...(spec.storyId ? { storyId: spec.storyId } : {}),
    ...(spec.cta ? { cta: spec.cta } : {}),
    demo: true,
  }
}

export function demoPushPreviewKeys() {
  return DEMO_PUSH_SPECS.map((_, i) => `demoNotifList${i + 1}`)
}

export function localizedPushText(item, lang) {
  const l = lang === 'en' || lang === 'tr' || lang === 'ar' ? lang : 'tr'
  const title = item[`title${l === 'tr' ? 'Tr' : l === 'en' ? 'En' : 'Ar'}`] || item.titleTr
  const body = item[`body${l === 'tr' ? 'Tr' : l === 'en' ? 'En' : 'Ar'}`] || item.bodyTr
  return { title, body }
}

export async function loadDemoPushQueue() {
  try {
    const raw = await AsyncStorage.getItem(DEMO_PUSH_QUEUE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export async function saveDemoPushQueue(entries) {
  try {
    await AsyncStorage.setItem(DEMO_PUSH_QUEUE_KEY, JSON.stringify(entries))
  } catch {
    /* ignore */
  }
}

export function flushDueDemoQueue(queue, existingIds, now = Date.now()) {
  const ids = existingIds instanceof Set ? existingIds : new Set(existingIds || [])
  const toAdd = []
  const remaining = []
  for (const entry of queue) {
    if (entry.delivered || ids.has(entry.item?.id)) continue
    if (entry.firesAt <= now) {
      toAdd.push({ ...entry.item, createdAt: entry.firesAt, read: false })
      continue
    }
    remaining.push(entry)
  }
  return { toAdd, remaining }
}

export function demoItemFromPayload(data) {
  if (!data?.demoId) return null
  const spec = DEMO_PUSH_SPECS.find((s) => s.id === data.demoId)
  if (!spec) return null
  return buildDemoPushItem(spec)
}

const clearWebTimers = () => {
  while (webTimers.length) {
    clearTimeout(webTimers.pop())
  }
}

export async function requestWebNotificationPermission() {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return { granted: false, status: 'unsupported' }
  }
  if (Notification.permission === 'granted') return { granted: true, status: 'granted' }
  if (Notification.permission === 'denied') return { granted: false, status: 'denied' }
  try {
    const status = await Notification.requestPermission()
    return { granted: status === 'granted', status }
  } catch {
    return { granted: false, status: 'error' }
  }
}

function showWebOsNotification(title, body) {
  if (typeof window === 'undefined' || !('Notification' in window)) return
  if (Notification.permission !== 'granted') return
  try {
    new Notification(title, { body, icon: '/favicon.ico' })
  } catch {
    /* ignore */
  }
}

export async function scheduleDemoPushSeries({ lang = 'tr', onDelivered } = {}) {
  const items = DEMO_PUSH_SPECS.map(buildDemoPushItem)
  const entries = items.map((item, i) => ({
    item,
    firesAt: Date.now() + DEMO_PUSH_SECONDS[i] * 1000,
    delivered: false,
    osId: null,
  }))

  if (Platform.OS === 'web') {
    clearWebTimers()
    await saveDemoPushQueue(entries)
    const webPerm = await requestWebNotificationPermission()
    entries.forEach((entry, i) => {
      const { title, body } = localizedPushText(entry.item, lang)
      const timer = setTimeout(() => {
        onDelivered?.(entry.item, entry.firesAt)
        if (webPerm.granted) showWebOsNotification(title, body)
      }, DEMO_PUSH_SECONDS[i] * 1000)
      webTimers.push(timer)
    })
    return { ok: true, count: entries.length, web: true, webPerm }
  }

  if (!pushSupported()) {
    return { ok: false, reason: 'unavailable' }
  }

  const perm = await requestPushPermission()
  if (!perm.granted) return { ok: false, reason: 'denied' }

  await cancelScheduledDemoNotifications()

  const nextEntries = []
  for (let i = 0; i < entries.length; i += 1) {
    const entry = entries[i]
    const { title, body } = localizedPushText(entry.item, lang)
    const res = await scheduleLocalDemo({
      title,
      body,
      seconds: DEMO_PUSH_SECONDS[i],
      data: { demo: true, demoId: entry.item.id },
    })
    nextEntries.push({ ...entry, osId: res.ok ? res.id : null })
  }

  await saveDemoPushQueue(nextEntries)
  return { ok: true, count: nextEntries.length, web: false }
}

export function attachDemoPushListeners({ onDelivered }) {
  if (Platform.OS === 'web') return () => {}
  return subscribePushEvents({
    onReceived: (data) => {
      const item = demoItemFromPayload(data)
      if (item) onDelivered?.(item, Date.now())
    },
    onResponse: (data) => {
      const item = demoItemFromPayload(data)
      if (item) onDelivered?.(item, Date.now())
    },
  })
}

export async function markDemoQueueDelivered(itemId) {
  const queue = await loadDemoPushQueue()
  const next = queue.map((e) => (e.item?.id === itemId ? { ...e, delivered: true } : e))
  await saveDemoPushQueue(next)
}

export async function syncDemoQueueToInbox(existingIds, deliver) {
  const queue = await loadDemoPushQueue()
  if (!queue.length) return
  const { toAdd, remaining } = flushDueDemoQueue(queue, existingIds)
  for (const item of toAdd) {
    deliver(item)
  }
  const deliveredIds = new Set(toAdd.map((x) => x.id))
  const synced = remaining.map((e) => (deliveredIds.has(e.item?.id) ? { ...e, delivered: true } : e))
  await saveDemoPushQueue(synced)
}
