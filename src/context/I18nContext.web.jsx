import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { dictionaries, LANGS, t as translate } from '../i18n'

const I18nContext = createContext(null)

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
    if (savedLang && dictionaries[savedLang]) setLangState(savedLang)
    const savedDir = localStorage.getItem('m10-dir')
    if (savedDir) setDirModeState(savedDir)
  }, [])

  const dict = dictionaries[lang] || dictionaries.ar
  const langIsRTL = lang === 'ar' || lang === 'ckb'
  const isRTL = dirMode === 'rtl' ? true : dirMode === 'ltr' ? false : langIsRTL
  const t = (key, vars) => translate(dict, key, vars)

  const value = useMemo(
    () => ({
      lang,
      setLang,
      t,
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
