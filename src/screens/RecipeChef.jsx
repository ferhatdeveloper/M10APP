import { useState } from 'react'
import { Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ChefHat, Plus, Sparkles, X } from 'lucide-react-native'
import TopBar from '../components/TopBar'
import SoftPress from '../components/SoftPress'
import { useApp } from '../context/AppContext'
import { useI18n } from '../context/I18nContext'
import { loadApiKey, loadChatModel, generateRecipe } from '../utils/openrouter'
import { colors, radius, shadow } from '../theme'

const SUGGESTED = [
  'egg',
  'milk',
  'cheese',
  'tomato',
  'onion',
  'chicken',
  'rice',
  'olive oil',
  'bread',
  'flour',
  'butter',
  'pasta',
]

export default function RecipeChefScreen({ navigation }) {
  const { t, lang, isRTL } = useI18n()
  const { getLiveProducts } = useApp()
  const [picked, setPicked] = useState([])
  const [custom, setCustom] = useState('')
  const [busy, setBusy] = useState(false)
  const [recipe, setRecipe] = useState(null)
  const [error, setError] = useState('')

  // Filter suggestions to ones that actually exist in catalog (by name or id)
  const availableSet = (() => {
    const all = getLiveProducts('m10-express')
    const s = new Set()
    for (const p of all) {
      s.add(p.id)
      s.add((p.names?.en || p.name || '').toLowerCase())
      s.add((p.names?.tr || '').toLowerCase())
      s.add((p.names?.ar || '').toLowerCase())
      s.add((p.brand || '').toLowerCase())
    }
    return s
  })()
  const visibleSUG = SUGGESTED.filter((s) => availableSet.has(s) || availableSet.has(s.toLowerCase()))

  const togglePick = (item) => {
    setPicked((prev) =>
      prev.includes(item) ? prev.filter((s) => s !== item) : [...prev, item],
    )
    setRecipe(null)
  }

  const addCustom = () => {
    const c = custom.trim().toLowerCase()
    if (!c) return
    if (!picked.includes(c)) setPicked((p) => [...p, c])
    setCustom('')
    setRecipe(null)
  }

  const askAI = async () => {
    if (picked.length < 2) {
      setError(t('recipePickMore'))
      return
    }
    setBusy(true)
    setError('')
    try {
      const apiKey = await loadApiKey()
      if (!apiKey) {
        setError(t('vsNoApiKey'))
        return
      }
      const model = await loadChatModel()
      const r = await generateRecipe(apiKey, { model, ingredients: picked, lang })
      setRecipe(r)
    } catch (e) {
      setError(e?.message || t('vsSearchFail'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={[]}>
      <TopBar title={t('recipesFromFridge')} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 14 }}>
        {/* Header hint */}
        <View
          style={{
            flexDirection: isRTL ? 'row-reverse' : 'row',
            alignItems: 'center',
            gap: 10,
            backgroundColor: colors.ink,
            borderRadius: 14,
            padding: 14,
          }}
        >
          <ChefHat size={20} color={colors.yellow} />
          <Text style={{ color: '#fff', fontWeight: '800', flex: 1 }}>
            {t('recipesFromFridgeHint')}
          </Text>
        </View>

        {/* Selected ingredients */}
        {picked.length > 0 ? (
          <View
            style={{
              flexDirection: isRTL ? 'row-reverse' : 'row',
              flexWrap: 'wrap',
              gap: 6,
              backgroundColor: '#fff',
              borderRadius: 12,
              padding: 10,
              borderWidth: 1,
              borderColor: colors.line,
            }}
          >
            {picked.map((p) => (
              <View
                key={p}
                style={{
                  flexDirection: isRTL ? 'row-reverse' : 'row',
                  alignItems: 'center',
                  gap: 4,
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  backgroundColor: colors.redSoft,
                  borderRadius: 999,
                }}
              >
                <Text style={{ color: colors.red, fontWeight: '800', fontSize: 12 }}>{p}</Text>
                <Pressable onPress={() => togglePick(p)} hitSlop={6}>
                  <X size={14} color={colors.red} />
                </Pressable>
              </View>
            ))}
          </View>
        ) : null}

        {/* Suggestion chips */}
        <View
          style={{
            flexDirection: isRTL ? 'row-reverse' : 'row',
            flexWrap: 'wrap',
            gap: 8,
          }}
        >
          {visibleSUG.map((s) => {
            const on = picked.includes(s)
            return (
              <SoftPress
                key={s}
                onPress={() => togglePick(s)}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  borderRadius: 999,
                  borderWidth: 1,
                  borderColor: on ? colors.red : colors.line,
                  backgroundColor: on ? colors.redSoft : '#fff',
                }}
              >
                <Text style={{ fontWeight: '700', color: on ? colors.red : colors.ink, fontSize: 13 }}>
                  {s}
                </Text>
              </SoftPress>
            )
          })}
        </View>

        {/* Custom input */}
        <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', gap: 8 }}>
          <TextInput
            value={custom}
            onChangeText={setCustom}
            placeholder={t('addReview')}
            placeholderTextColor={colors.muted}
            onSubmitEditing={addCustom}
            style={{
              flex: 1,
              paddingHorizontal: 12,
              paddingVertical: 12,
              borderRadius: 12,
              backgroundColor: '#fff',
              borderWidth: 1,
              borderColor: colors.line,
              color: colors.ink,
              textAlign: isRTL ? 'right' : 'left',
            }}
          />
          <SoftPress
            onPress={addCustom}
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: colors.ink,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Plus size={20} color={colors.yellow} />
          </SoftPress>
        </View>

        {error ? (
          <Text style={{ color: colors.red, fontWeight: '700' }}>{error}</Text>
        ) : null}

        <SoftPress
          onPress={askAI}
          disabled={busy}
          style={{
            backgroundColor: busy ? '#888' : colors.red,
            paddingVertical: 14,
            borderRadius: 14,
            flexDirection: isRTL ? 'row-reverse' : 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          <Sparkles size={18} color="#fff" />
          <Text style={{ color: '#fff', fontWeight: '900' }}>
            {busy ? t('vsSearching') : t('vsFindMatches')}
          </Text>
        </SoftPress>

        {/* Recipe result */}
        {recipe ? (
          <View
            style={{
              backgroundColor: '#fff',
              borderRadius: 16,
              padding: 14,
              borderWidth: 1,
              borderColor: colors.line,
              ...shadow.card,
            }}
          >
            <Text style={{ fontWeight: '900', fontSize: 18, marginBottom: 6 }}>
              {recipe.title}
            </Text>
            {recipe.time ? (
              <Text style={{ color: colors.muted, marginBottom: 10 }}>
                ⏱ {recipe.time}
              </Text>
            ) : null}
            {(recipe.steps || []).map((s, i) => (
              <View
                key={i}
                style={{
                  flexDirection: isRTL ? 'row-reverse' : 'row',
                  gap: 8,
                  marginBottom: 8,
                }}
              >
                <View
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    backgroundColor: colors.red,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text style={{ color: '#fff', fontWeight: '900', fontSize: 12 }}>{i + 1}</Text>
                </View>
                <Text style={{ flex: 1, color: colors.ink }}>{s}</Text>
              </View>
            ))}
            {recipe.tags?.length ? (
              <View
                style={{
                  flexDirection: isRTL ? 'row-reverse' : 'row',
                  flexWrap: 'wrap',
                  gap: 6,
                  marginTop: 6,
                }}
              >
                {recipe.tags.map((t) => (
                  <View
                    key={t}
                    style={{
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      backgroundColor: colors.bg,
                      borderRadius: 999,
                    }}
                  >
                    <Text style={{ fontSize: 11, color: colors.muted }}>#{t}</Text>
                  </View>
                ))}
              </View>
            ) : null}
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  )
}