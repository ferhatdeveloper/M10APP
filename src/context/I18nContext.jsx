import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { dictionaries, LANGS, t as translate } from '../i18n'

const I18nContext = createContext(null)
const KEY = 'm10-lang'

export function I18nProvider({ children }) {
  const [lang, setLangState] = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    ;(async () => {
      try {
        const saved = await AsyncStorage.getItem(KEY)
        if (saved && dictionaries[saved]) setLangState(saved)
      } catch {
        /* ignore */
      }
      setReady(true)
    })()
  }, [])

  const setLang = async (next) => {
    setLangState(next)
    try {
      await AsyncStorage.setItem(KEY, next)
    } catch {
      /* ignore */
    }
  }

  const dict = dictionaries[lang] || dictionaries.ar
  const isRTL = lang === 'ar'
  const t = (key, vars) => translate(dict, key, vars)

  const value = useMemo(
    () => ({ lang, setLang, t, isRTL, ready, langs: LANGS }),
    [lang, ready, dict],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export const useI18n = () => useContext(I18nContext)
