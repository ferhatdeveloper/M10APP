import { Platform } from 'react-native'

let Notifications = null
try {
  // Optional: web / missing native module should not crash the app
  // eslint-disable-next-line global-require
  Notifications = require('expo-notifications')
} catch {
  Notifications = null
}

let handlerReady = false

const ensureHandler = () => {
  if (!Notifications || handlerReady || Platform.OS === 'web') return
  try {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    })
    handlerReady = true
  } catch {
    /* ignore */
  }
}

export const pushSupported = () => !!(Notifications && Platform.OS !== 'web')

export async function getPushPermission() {
  if (!pushSupported()) return { status: 'unavailable', granted: false }
  ensureHandler()
  try {
    const { status } = await Notifications.getPermissionsAsync()
    return { status, granted: status === 'granted' }
  } catch {
    return { status: 'unavailable', granted: false }
  }
}

export async function requestPushPermission() {
  if (!pushSupported()) return { status: 'unavailable', granted: false }
  ensureHandler()
  try {
    const current = await Notifications.getPermissionsAsync()
    if (current.status === 'granted') return { status: 'granted', granted: true }
    const next = await Notifications.requestPermissionsAsync()
    return { status: next.status, granted: next.status === 'granted' }
  } catch {
    return { status: 'unavailable', granted: false }
  }
}

export async function scheduleLocalDemo({ title, body, seconds = 0 } = {}) {
  if (!pushSupported()) return { ok: false, reason: 'unavailable' }
  ensureHandler()
  const perm = await requestPushPermission()
  if (!perm.granted) return { ok: false, reason: 'denied' }
  try {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: title || 'M10',
        body: body || 'Demo notification',
        data: { demo: true },
      },
      trigger: seconds > 0 ? { type: Notifications.SchedulableTriggerInputTypes?.TIME_INTERVAL || 'timeInterval', seconds, repeats: false } : null,
    })
    return { ok: true, id }
  } catch (e) {
    // Fallback older trigger shape
    try {
      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: title || 'M10',
          body: body || 'Demo notification',
          data: { demo: true },
        },
        trigger: seconds > 0 ? { seconds, repeats: false } : null,
      })
      return { ok: true, id }
    } catch {
      return { ok: false, reason: 'error' }
    }
  }
}
