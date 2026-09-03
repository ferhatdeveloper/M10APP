import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { dictionaries, LANGS, t as translate } from '../i18n'

const I18nContext = createContext(null)
const KEY_LANG = 'm10-lang'
const KEY_DIR = 'm10-dir' // auto | rtl | ltr

const normalizeDir = (d) => (d === 'rtl' || d === 'ltr' ? d : 'auto')

export function I18nProvider({ children }) {
  const [lang, setLangState] = useState(null)
  const [dirMode, setDirModeState] = useState('auto')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    ;(async () => {
      try {
        const savedLang = await AsyncStorage.getItem(KEY_LANG)
        if (savedLang && dictionaries[savedLang]) setLangState(savedLang)
        const savedDir = await AsyncStorage.getItem(KEY_DIR)
        if (savedDir) setDirModeState(normalizeDir(savedDir))
      } catch {
        /* ignore */
      }
      setReady(true)
    })()
  }, [])

  const setLang = async (next) => {
    setLangState(next)
    try {
      await AsyncStorage.setItem(KEY_LANG, next)
    } catch {
      /* ignore */
    }
    // If user switches away from Arabic, reset dirMode to 'auto' so we don't
    // keep an RTL override that's no longer visible/usable in the UI.
    if (next !== 'ar' && next !== 'ckb' && dirMode !== 'auto') {
      setDirModeState('auto')
      try {
        await AsyncStorage.setItem(KEY_DIR, 'auto')
      } catch {
        /* ignore */
      }
    }
  }

  const setDirMode = async (next) => {
    const v = normalizeDir(next)
    setDirModeState(v)
    try {
      await AsyncStorage.setItem(KEY_DIR, v)
    } catch {
      /* ignore */
    }
  }

  const dict = dictionaries[lang] || dictionaries.ar
  const langIsRTL = lang === 'ar' || lang === 'ckb'
  const isRTL =
    dirMode === 'rtl' ? true : dirMode === 'ltr' ? false : langIsRTL
  const t = (key, vars) => translate(dict, key, vars)

  const value = useMemo(
    () => ({ lang, setLang, t, isRTL, dirMode, setDirMode, ready, langs: LANGS }),
    [lang, dirMode, ready, dict],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export const useI18n = () => useContext(I18nContext)