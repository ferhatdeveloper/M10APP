import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const I18nContext = createContext(null)

// Simple Arabic translations for web
const translations = {
  ar: {
    // Add any needed translations here
  }
}

const LANGS = [
  { code: 'ar', name: 'العربية', nameEn: 'Arabic' },
  { code: 'en', name: 'English', nameEn: 'English' },
  { code: 'tr', name: 'Türkçe', nameEn: 'Turkish' },
]

const t = (dict, key, vars) => {
  let str = dict[key] || key
  if (vars) {
    Object.keys(vars).forEach(k => {
      str = str.replace(`{${k}}`, vars[k])
    })
  }
  return str
}

export function I18nProvider({ children }) {
  const [lang, setLangState] = useState('ar')
  const [dirMode, setDirModeState] = useState('auto')
  const [ready, setReady] = useState(true)

  const setLang = (next) => {
    setLangState(next)
    localStorage.setItem('m10-lang', next)
    if (next !== 'ar' && next !== 'ckb' && dirMode !== 'auto') {
      setDirModeState('auto')
      localStorage.setItem('m10-dir', 'auto')
    }
  }

  const setDirMode = (next) => {
    const v = next === 'rtl' || next === 'ltr' ? next : 'auto'
    setDirModeState(v)
    localStorage.setItem('m10-dir', v)
  }

  useEffect(() => {
    const savedLang = localStorage.getItem('m10-lang')
    if (savedLang) setLangState(savedLang)
    const savedDir = localStorage.getItem('m10-dir')
    if (savedDir) setDirModeState(savedDir)
  }, [])

  const dict = translations[lang] || translations.ar
  const langIsRTL = lang === 'ar' || lang === 'ckb'
  const isRTL = dirMode === 'rtl' ? true : dirMode === 'ltr' ? false : langIsRTL

  const value = useMemo(
    () => ({
      lang,
      setLang,
      t: (key, vars) => t(dict, key, vars),
      isRTL,
      dirMode,
      setDirMode,
      ready,
      langs: LANGS,
    }),
    [lang, dirMode, ready, dict, isRTL]
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export const useI18n = () => useContext(I18nContext)
