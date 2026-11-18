import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { dictionaries, LANGS, t as translate } from '../i18n'

const I18nContext = createContext(null)

/** Only Arabic-script languages use RTL */
const isArabicScript = (code) => code === 'ar' || code === 'ckb'

export function I18nProvider({ children }) {
  const [lang, setLangState] = useState('tr')
  const [ready, setReady] = useState(true)

  const setLang = (next) => {
    setLangState(next)
    localStorage.setItem('m10-lang', next)
  }

  useEffect(() => {
    const savedLang = localStorage.getItem('m10-lang')
    if (savedLang && dictionaries[savedLang]) setLangState(savedLang)
  }, [])

  const dict = dictionaries[lang] || dictionaries.tr
  const isRTL = isArabicScript(lang)
  const t = (key, vars) => translate(dict, key, vars)

  // Keep <html dir/lang> in sync — never leave page stuck in RTL for TR/EN
  useEffect(() => {
    const root = document.documentElement
    root.setAttribute('dir', isRTL ? 'rtl' : 'ltr')
    root.setAttribute('lang', lang || 'tr')
    document.body?.setAttribute('dir', isRTL ? 'rtl' : 'ltr')
  }, [lang, isRTL])

  const value = useMemo(
    () => ({
      lang,
      setLang,
      t,
      isRTL,
      dirMode: isRTL ? 'rtl' : 'ltr',
      setDirMode: () => {},
      ready,
      langs: LANGS,
    }),
    [lang, ready, dict, isRTL]
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export const useI18n = () => useContext(I18nContext)
