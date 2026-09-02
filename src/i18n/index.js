import ar from './ar'
import en from './en'
import tr from './tr'

export const LANGS = [
  { id: 'ar', label: 'العربية', native: 'العربية' },
  { id: 'en', label: 'English', native: 'English' },
  { id: 'tr', label: 'Türkçe', native: 'Türkçe' },
]

export const dictionaries = { ar, en, tr }

export function t(dict, key, vars = {}) {
  const parts = key.split('.')
  let cur = dict
  for (const p of parts) {
    if (cur == null) return key
    cur = cur[p]
  }
  if (typeof cur !== 'string') return key
  return Object.keys(vars).reduce(
    (s, k) => s.replaceAll(`{{${k}}}`, String(vars[k])),
    cur,
  )
}

export const localeFor = (lang) =>
  lang === 'en' ? 'en-US' : lang === 'tr' ? 'tr-TR' : 'ar-IQ'
