import AsyncStorage from '@react-native-async-storage/async-storage'

export const OR_KEY_STORAGE = '@m10/openrouter_api_key'
export const OR_CHAT_MODEL_STORAGE = '@m10/openrouter_chat_model'
export const OR_IMAGE_MODEL_STORAGE = '@m10/openrouter_image_model'
export const OR_SOCIAL_DRAFTS_STORAGE = '@m10/ai_social_drafts'

export const DEFAULT_CHAT_MODEL = 'openai/gpt-4o-mini'
export const DEFAULT_IMAGE_MODEL = 'google/gemini-2.5-flash-image'

const BASE = 'https://openrouter.ai/api/v1'
const APP_TITLE = 'M10'
const APP_REFERER = 'https://m10.app'

export function openRouterHeaders(apiKey) {
  return {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
    'HTTP-Referer': APP_REFERER,
    'X-Title': APP_TITLE,
  }
}

export async function loadApiKey() {
  try {
    return (await AsyncStorage.getItem(OR_KEY_STORAGE)) || ''
  } catch {
    return ''
  }
}

export async function saveApiKey(key) {
  const trimmed = String(key || '').trim()
  if (!trimmed) {
    await AsyncStorage.removeItem(OR_KEY_STORAGE)
    return
  }
  await AsyncStorage.setItem(OR_KEY_STORAGE, trimmed)
}

export async function loadChatModel() {
  try {
    return (await AsyncStorage.getItem(OR_CHAT_MODEL_STORAGE)) || DEFAULT_CHAT_MODEL
  } catch {
    return DEFAULT_CHAT_MODEL
  }
}

export async function saveChatModel(model) {
  await AsyncStorage.setItem(OR_CHAT_MODEL_STORAGE, String(model || DEFAULT_CHAT_MODEL).trim() || DEFAULT_CHAT_MODEL)
}

export async function loadImageModel() {
  try {
    return (await AsyncStorage.getItem(OR_IMAGE_MODEL_STORAGE)) || DEFAULT_IMAGE_MODEL
  } catch {
    return DEFAULT_IMAGE_MODEL
  }
}

export async function saveImageModel(model) {
  await AsyncStorage.setItem(OR_IMAGE_MODEL_STORAGE, String(model || DEFAULT_IMAGE_MODEL).trim() || DEFAULT_IMAGE_MODEL)
}

export async function loadSocialDrafts() {
  try {
    const raw = await AsyncStorage.getItem(OR_SOCIAL_DRAFTS_STORAGE)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export async function saveSocialDrafts(drafts) {
  await AsyncStorage.setItem(OR_SOCIAL_DRAFTS_STORAGE, JSON.stringify(drafts || []))
}

export function maskApiKey(key) {
  const s = String(key || '')
  if (s.length <= 8) return s ? '••••••••' : ''
  return `${s.slice(0, 4)}••••${s.slice(-4)}`
}

export class OpenRouterError extends Error {
  constructor(message, { status, code } = {}) {
    super(message)
    this.name = 'OpenRouterError'
    this.status = status
    this.code = code
  }
}

function extractErrorMessage(data, status) {
  const msg =
    data?.error?.message ||
    data?.error?.metadata?.raw ||
    (typeof data?.error === 'string' ? data.error : null) ||
    data?.message
  if (status === 401 || status === 403) {
    return msg || 'Geçersiz API anahtarı'
  }
  if (status === 429) {
    return msg || 'İstek limiti aşıldı (rate limit). Biraz bekleyip tekrar deneyin.'
  }
  return msg || `OpenRouter hatası (${status || '?'})`
}

async function parseJsonSafe(res) {
  const text = await res.text()
  try {
    return text ? JSON.parse(text) : {}
  } catch {
    return { message: text?.slice(0, 200) }
  }
}

export async function listModels(apiKey) {
  const res = await fetch(`${BASE}/models`, {
    method: 'GET',
    headers: openRouterHeaders(apiKey),
  })
  const data = await parseJsonSafe(res)
  if (!res.ok) {
    throw new OpenRouterError(extractErrorMessage(data, res.status), { status: res.status })
  }
  return data?.data || []
}

/** Bağlantı testi: models listesi; başarısızsa mini chat. */
export async function testConnection(apiKey) {
  try {
    const models = await listModels(apiKey)
    return { ok: true, via: 'models', count: models.length }
  } catch (e) {
    if (e?.status === 401 || e?.status === 403) throw e
  }
  const content = await chatCompletion(apiKey, {
    model: DEFAULT_CHAT_MODEL,
    messages: [{ role: 'user', content: 'Reply with OK only.' }],
    max_tokens: 8,
  })
  return { ok: true, via: 'chat', preview: String(content || '').slice(0, 40) }
}

export async function chatCompletion(apiKey, { model, messages, max_tokens = 1200, temperature = 0.4, response_format } = {}) {
  const body = {
    model: model || DEFAULT_CHAT_MODEL,
    messages,
    max_tokens,
    temperature,
  }
  if (response_format) body.response_format = response_format

  const res = await fetch(`${BASE}/chat/completions`, {
    method: 'POST',
    headers: openRouterHeaders(apiKey),
    body: JSON.stringify(body),
  })
  const data = await parseJsonSafe(res)
  if (!res.ok) {
    throw new OpenRouterError(extractErrorMessage(data, res.status), { status: res.status })
  }
  const content = data?.choices?.[0]?.message?.content
  if (content == null || content === '') {
    throw new OpenRouterError('Boş yanıt alındı')
  }
  return typeof content === 'string' ? content : JSON.stringify(content)
}

function parseJsonFromModel(text) {
  const raw = String(text || '').trim()
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/i)
  const candidate = fenced ? fenced[1].trim() : raw
  const start = candidate.indexOf('{')
  const end = candidate.lastIndexOf('}')
  if (start >= 0 && end > start) {
    return JSON.parse(candidate.slice(start, end + 1))
  }
  throw new Error('JSON ayrıştırılamadı')
}

const LANG_LABELS = { ar: 'Arabic', en: 'English', tr: 'Turkish' }

export async function translateProductText(apiKey, { text, targets, model }) {
  const langs = (targets || []).filter((l) => LANG_LABELS[l])
  if (!text?.trim()) throw new OpenRouterError('Çevrilecek metin boş')
  if (!langs.length) throw new OpenRouterError('Hedef dil seçin')

  const schemaHint = langs.map((l) => `"${l}"`).join(', ')
  const prompt = `You are a retail product copy translator for an Iraqi supermarket app (M10).
Translate the following product/campaign text into: ${langs.map((l) => LANG_LABELS[l]).join(', ')}.
Keep tone commercial, concise, natural. Do not add explanations.
Return ONLY valid JSON object with keys ${schemaHint}. Values are the translations.

Text:
"""
${text.trim()}
"""`

  const content = await chatCompletion(apiKey, {
    model,
    messages: [
      { role: 'system', content: 'You output only valid JSON. No markdown.' },
      { role: 'user', content: prompt },
    ],
    temperature: 0.2,
    max_tokens: 800,
  })

  const parsed = parseJsonFromModel(content)
  const out = {}
  for (const l of langs) {
    out[l] = String(parsed[l] || '').trim()
  }
  return out
}

/**
 * Görsel üretimi: önce /images, sonra chat modalities fallback.
 * Başarısızsa marketing copy + Unsplash arama önerisi döner.
 */
export async function generateImage(apiKey, { prompt, model }) {
  const p = String(prompt || '').trim()
  if (!p) throw new OpenRouterError('Prompt boş')
  const imageModel = model || DEFAULT_IMAGE_MODEL

  try {
    const res = await fetch(`${BASE}/images`, {
      method: 'POST',
      headers: openRouterHeaders(apiKey),
      body: JSON.stringify({
        model: imageModel,
        prompt: p,
        aspect_ratio: '1:1',
      }),
    })
    const data = await parseJsonSafe(res)
    if (res.ok) {
      const item = data?.data?.[0]
      const b64 = item?.b64_json || item?.b64
      const url = item?.url || item?.image_url
      if (b64) {
        const media = item?.media_type || 'image/png'
        return {
          ok: true,
          source: 'images',
          uri: `data:${media};base64,${b64}`,
          model: imageModel,
        }
      }
      if (url) {
        return { ok: true, source: 'images', uri: url, model: imageModel }
      }
    }
    if (res.status === 401 || res.status === 403 || res.status === 429) {
      throw new OpenRouterError(extractErrorMessage(data, res.status), { status: res.status })
    }
  } catch (e) {
    if (e instanceof OpenRouterError && (e.status === 401 || e.status === 403 || e.status === 429)) {
      throw e
    }
  }

  // Chat completions with image output (legacy / multimodal models)
  try {
    const res = await fetch(`${BASE}/chat/completions`, {
      method: 'POST',
      headers: openRouterHeaders(apiKey),
      body: JSON.stringify({
        model: imageModel,
        messages: [{ role: 'user', content: p }],
        modalities: ['image', 'text'],
      }),
    })
    const data = await parseJsonSafe(res)
    if (res.ok) {
      const msg = data?.choices?.[0]?.message
      const images = msg?.images || []
      const first = images[0]
      const url =
        first?.image_url?.url ||
        first?.imageUrl?.url ||
        (typeof first === 'string' ? first : null)
      if (url) {
        return { ok: true, source: 'chat', uri: url, model: imageModel }
      }
      const content = msg?.content
      if (typeof content === 'string' && content.startsWith('data:image')) {
        return { ok: true, source: 'chat', uri: content, model: imageModel }
      }
    }
    if (res.status === 401 || res.status === 403 || res.status === 429) {
      throw new OpenRouterError(extractErrorMessage(data, res.status), { status: res.status })
    }
  } catch (e) {
    if (e instanceof OpenRouterError && (e.status === 401 || e.status === 403 || e.status === 429)) {
      throw e
    }
  }

  // Fallback: copy + Unsplash suggestion
  let copy = ''
  try {
    copy = await chatCompletion(apiKey, {
      model: DEFAULT_CHAT_MODEL,
      messages: [
        {
          role: 'user',
          content: `Write a short marketing caption (TR + EN, 2 lines each) for this visual brief. Then suggest 3 Unsplash search keywords. Brief:\n${p}`,
        },
      ],
      max_tokens: 400,
    })
  } catch {
    copy = ''
  }
  const keywords = p
    .split(/\s+/)
    .filter((w) => w.length > 2)
    .slice(0, 4)
    .join(',')
  return {
    ok: false,
    fallback: true,
    copy,
    unsplashQuery: keywords || 'grocery product',
    unsplashUrl: `https://unsplash.com/s/photos/${encodeURIComponent(keywords || 'grocery product')}`,
  }
}

export async function generateSocialPack(apiKey, { brief, model, platform = 'instagram' }) {
  const text = String(brief || '').trim()
  if (!text) throw new OpenRouterError('Ürün / kampanya metni boş')

  const prompt = `You are a social media marketer for M10 supermarket (Iraq). Platform: ${platform}.
Create a caption pack from this product/campaign brief.
Return ONLY valid JSON:
{
  "tr": { "caption": "...", "short": "...", "hashtags": ["#..."] },
  "en": { "caption": "...", "short": "...", "hashtags": ["#..."] },
  "ar": { "caption": "...", "short": "...", "hashtags": ["#..."] },
  "imagePrompt": "English visual prompt for a post image"
}

Brief:
"""
${text}
"""`

  const content = await chatCompletion(apiKey, {
    model,
    messages: [
      { role: 'system', content: 'You output only valid JSON. No markdown.' },
      { role: 'user', content: prompt },
    ],
    temperature: 0.6,
    max_tokens: 1400,
  })

  return parseJsonFromModel(content)
}

/**
 * Send an image to a multimodal model and get a short textual description.
 * Uses OpenRouter chat/completions with a multipart content array (text + image_url).
 * `imageUrl` can be a remote URL or a data: URI.
 */
export async function describeImage(apiKey, { model, imageUrl, lang = 'ar' } = {}) {
  if (!apiKey) throw new OpenRouterError('API anahtarı yok')
  if (!imageUrl) throw new OpenRouterError('Görsel URL boş')
  const langName = lang === 'en' ? 'English' : lang === 'tr' ? 'Turkish' : 'Arabic'

  const systemPrompt = `You identify products from photos for a supermarket app. Given one image, return a very short product description (2-6 words) suitable to be matched against a product catalog.
Output ONLY the description text in ${langName}. No punctuation, no quotes, no preamble.`

  const body = {
    model: model || DEFAULT_CHAT_MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text:
              lang === 'ar'
                ? 'ما هذا المنتج؟ أجب بجملة قصيرة فقط.'
                : lang === 'tr'
                  ? 'Bu ürün nedir? Sadece kısa bir yanıt ver.'
                  : 'What product is this? Reply with a short description only.',
          },
          { type: 'image_url', image_url: { url: imageUrl } },
        ],
      },
    ],
    max_tokens: 60,
    temperature: 0.2,
  }

  const res = await fetch(`${BASE}/chat/completions`, {
    method: 'POST',
    headers: openRouterHeaders(apiKey),
    body: JSON.stringify(body),
  })
  const data = await parseJsonSafe(res)
  if (!res.ok) {
    throw new OpenRouterError(extractErrorMessage(data, res.status), { status: res.status })
  }
  const content = data?.choices?.[0]?.message?.content
  if (!content) throw new OpenRouterError('Boş yanıt')
  return String(content).trim()
}

/**
 * Generate a quick recipe based on a list of ingredients the user has on hand.
 * Returns a JSON object with `title`, `time`, `steps[]`, `tags[]` keys.
 */
export async function generateRecipe(apiKey, { model, ingredients, lang = 'ar' } = {}) {
  if (!apiKey) throw new OpenRouterError('API anahtarı yok')
  if (!ingredients || !ingredients.length) throw new OpenRouterError('Malzeme listesi boş')
  const langName = lang === 'en' ? 'English' : lang === 'tr' ? 'Turkish' : 'Arabic'

  const prompt = `You are a helpful chef. The user has these ingredients: ${ingredients.join(', ')}.
Suggest ONE simple recipe that mostly uses these ingredients. Reply ONLY with valid JSON:
{
  "title": "Recipe name in ${langName}",
  "time": "25 min",
  "steps": ["Step 1", "Step 2", "Step 3"],
  "tags": ["quick", "vegetarian"]
}
All text must be in ${langName}. No markdown.`

  const content = await chatCompletion(apiKey, {
    model,
    messages: [
      { role: 'system', content: 'You output only valid JSON. No markdown.' },
      { role: 'user', content: prompt },
    ],
    temperature: 0.5,
    max_tokens: 600,
  })
  return parseJsonFromModel(content)
}
