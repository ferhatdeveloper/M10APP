import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Animated,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  View,
  useWindowDimensions,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { GestureDetector, Gesture, GestureHandlerRootView } from 'react-native-gesture-handler'
import { ChevronLeft, ChevronRight, ExternalLink, Maximize2, X } from 'lucide-react-native'
import SoftPress from '../components/SoftPress'
import PhoneMockup, {
  MockAdmin,
  MockButler,
  MockCart,
  MockCheckout,
  MockHome,
  MockLanguage,
  MockLogin,
  MockOrders,
  MockPlus,
  MockProfile,
  MockStore,
  MockTracking,
} from '../components/PhoneMockup'
import { useI18n } from '../context/I18nContext'
import { colors, radius, shadow } from '../theme'
import { PRESENTATION_META, PRESENTATION_SLIDES, PRESENTATION_TOTAL } from '../data/presentation'

// --- helpers ---------------------------------------------------------------

function pickLocalized(value, lang) {
  if (!value) return ''
  if (typeof value === 'string') return value
  return value[lang] || value.tr || value.en || value.ar || ''
}

const MOCK_COMPONENTS = {
  MockLanguage,
  MockLogin,
  MockHome,
  MockStore,
  MockCart,
  MockCheckout,
  MockTracking,
  MockOrders,
  MockPlus,
  MockButler,
  MockAdmin,
  MockProfile,
}

function MockScreenRenderer({ name }) {
  const Component = MOCK_COMPONENTS[name]
  if (!Component) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: '#7A7A7A' }}>Ekran bulunamadı: {name}</Text>
      </View>
    )
  }
  return <Component />
}

// --- main slide layout: phone mockup on the left, text on the right ---------

function ScreenSlide({ slide, lang, isRTL }) {
  const MockComponent = MOCK_COMPONENTS[slide.mock]
  const title = pickLocalized(slide.title, lang)
  const subtitle = pickLocalized(slide.subtitle, lang)
  const body = pickLocalized(slide.body, lang)
  const bullets = slide.bullets || []
  const [previewOpen, setPreviewOpen] = useState(false)

  // Telefon çerçevesinin iç ölçüsü: 280 - 9*2 padding = 262 px (yaklaşık iPhone 17 Pro Max ekran oranı)
  // iframe'in mobil görünmesi için bir scale uygulanabilir; burada native en/boy oranını koruyoruz.
  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingVertical: 24,
        paddingHorizontal: 16,
      }}
      showsVerticalScrollIndicator={false}
    >
      {/* Beyaz container — belirli bir alan içinde tut */}
      <View
        style={{
          width: '100%',
          maxWidth: 880,
          backgroundColor: '#fff',
          borderRadius: 24,
          padding: 24,
          flexDirection: isRTL ? 'row-reverse' : 'row',
          gap: 24,
          alignItems: 'flex-start',
          ...shadow.card,
        }}
      >
      {/* Mock phone */}
      <View style={{ alignItems: 'center', justifyContent: 'flex-start', gap: 10 }}>
        <View
          style={{
            // iframe content'i mobil gibi görünsün diye sabit tut
            width: 280,
            alignItems: 'center',
          }}
        >
          <PhoneMockup image={slide.image}>
            {slide.image ? null : MockComponent ? <MockComponent /> : null}
          </PhoneMockup>
        </View>
        {slide.previewUrl && Platform.OS === 'web' && (
          <SoftPress
            onPress={() => setPreviewOpen(true)}
            style={{
              flexDirection: isRTL ? 'row-reverse' : 'row',
              alignItems: 'center',
              gap: 6,
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 999,
              backgroundColor: '#161616',
            }}
          >
            <Maximize2 size={14} color="#fff" />
            <Text style={{ color: '#fff', fontWeight: '800', fontSize: 12 }}>
              {lang === 'ar' ? 'معاينة كاملة' : lang === 'en' ? 'Full preview' : 'Tam önizleme'}
            </Text>
          </SoftPress>
        )}
      </View>

      {/* Text column */}
      <View
        style={{
          flex: 1,
          minWidth: 280,
          maxWidth: 480,
          gap: 12,
          alignItems: isRTL ? 'flex-end' : 'flex-start',
        }}
      >
        <View
          style={{
            alignSelf: isRTL ? 'flex-end' : 'flex-start',
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 999,
            backgroundColor: colors.redSoft,
          }}
        >
          <Text style={{ color: colors.red, fontWeight: '900', fontSize: 11 }}>
            {slide.badge}
          </Text>
        </View>

        <Text
          style={{
            fontWeight: '900',
            fontSize: 32,
            color: colors.ink,
            textAlign: isRTL ? 'right' : 'left',
          }}
        >
          {title}
        </Text>

        <Text
          style={{
            fontSize: 15,
            fontWeight: '700',
            color: colors.red,
            textAlign: isRTL ? 'right' : 'left',
          }}
        >
          {subtitle}
        </Text>

        <View
          style={{
            backgroundColor: '#fff',
            borderRadius: radius.lg,
            padding: 14,
            borderWidth: 1,
            borderColor: colors.line,
            ...shadow.soft,
            alignSelf: 'stretch',
          }}
        >
          <Text
            style={{
              color: colors.ink,
              fontSize: 14,
              lineHeight: 21,
              textAlign: isRTL ? 'right' : 'left',
            }}
          >
            {body}
          </Text>
        </View>

        {bullets.length > 0 && (
          <View style={{ gap: 8, alignSelf: 'stretch' }}>
            {bullets.map((b, i) => (
              <View
                key={i}
                style={{
                  flexDirection: isRTL ? 'row-reverse' : 'row',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <View
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: colors.red,
                  }}
                />
                <Text
                  style={{
                    flex: 1,
                    color: colors.ink,
                    fontSize: 13,
                    fontWeight: '700',
                    textAlign: isRTL ? 'right' : 'left',
                  }}
                >
                  {pickLocalized(b, lang)}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
      {/* Full-screen preview modal — gerçek telefon boyutunda iframe */}
      {previewOpen && slide.previewUrl && Platform.OS === 'web' && (
        <PreviewModal url={slide.previewUrl} onClose={() => setPreviewOpen(false)} />
      )}
      </View>
    </ScrollView>
  )
}

function PreviewModal({ url, onClose }) {
  // Esc tuşuyla kapatma — web için
  useEffect(() => {
    if (Platform.OS !== 'web') return
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        e.stopPropagation()
        onClose()
      }
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [onClose])
  if (Platform.OS !== 'web') return null
  return (
    <View
      onPress={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(15,15,18,0.92)',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 60,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          backgroundColor: 'rgba(15,15,18,0.6)',
        }}
      >
        <Text style={{ color: '#fff', fontWeight: '900', fontSize: 14 }}>
          Canlı Önizleme · apk.retailex.app
        </Text>
        <SoftPress
          onPress={onClose}
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: 'rgba(255,255,255,0.15)',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <X size={18} color="#fff" />
        </SoftPress>
      </View>
      {/* iPhone 17 Pro Max boyutunda iframe */}
      <View
        style={{
          width: 393,
          height: 852,
          borderRadius: 56,
          backgroundColor: '#0F0F12',
          padding: 9,
          overflow: 'hidden',
        }}
      >
        <View
          style={{
            flex: 1,
            borderRadius: 48,
            backgroundColor: '#fff',
            overflow: 'hidden',
          }}
        >
          {/* eslint-disable-next-line react/no-unknown-property */}
          <iframe
            src={url}
            title="M10 preview full"
            style={{
              width: '100%',
              height: '100%',
              border: '0',
              display: 'block',
            }}
            allow="camera; microphone; geolocation; clipboard-write"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
          />
        </View>
      </View>
      <Text style={{ color: '#fff', marginTop: 16, fontSize: 12, opacity: 0.7 }}>
        Esc veya ✕ ile kapat
      </Text>
    </View>
  )
}

function EndingSlide({ slide, lang, isRTL, onClose, t }) {
  // ending slide uses last entry as a thank-you/contact screen
  const meta = PRESENTATION_META
  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingVertical: 24,
        paddingHorizontal: 16,
      }}
      showsVerticalScrollIndicator={false}
    >
      <View
        style={{
          width: '100%',
          maxWidth: 720,
          backgroundColor: '#fff',
          borderRadius: 24,
          padding: 24,
          alignItems: 'center',
          gap: 16,
          ...shadow.card,
        }}
      >
      <PhoneMockup>
        <MockProfile />
      </PhoneMockup>

      <View
        style={{
          backgroundColor: colors.red,
          paddingHorizontal: 24,
          paddingVertical: 18,
          borderRadius: radius.xl,
          alignItems: 'center',
          ...shadow.card,
        }}
      >
        <Text style={{ color: colors.yellow, fontSize: 36, fontWeight: '900' }}>{meta.brand}</Text>
        <Text style={{ color: '#fff', fontSize: 14, marginTop: 4 }}>{meta.subtitle}</Text>
      </View>

      <Text style={{ color: colors.ink, fontSize: 18, fontWeight: '900' }}>
        {lang === 'ar' ? 'شكراً لاهتمامك' : lang === 'en' ? 'Thank you' : 'İlginiz için teşekkürler'}
      </Text>

      <SoftPress
        onPress={onClose}
        style={{
          backgroundColor: colors.red,
          paddingHorizontal: 32,
          paddingVertical: 14,
          borderRadius: 999,
          ...shadow.card,
        }}
      >
        <Text style={{ color: '#fff', fontWeight: '900', fontSize: 15 }}>
          {t('close')}
        </Text>
      </SoftPress>

      <Text style={{ color: colors.muted, fontSize: 11 }}>{meta.copyright}</Text>
      </View>
    </ScrollView>
  )
}

function renderSlide(slide, lang, isRTL, onClose, t) {
  if (slide.type === 'ending') return <EndingSlide slide={slide} lang={lang} isRTL={isRTL} onClose={onClose} t={t} />
  return <ScreenSlide slide={slide} lang={lang} isRTL={isRTL} />
}

// --- screen ----------------------------------------------------------------

export default function PresentationScreen({ navigation }) {
  const { t, lang, isRTL } = useI18n()
  const { width } = useWindowDimensions()
  const [index, setIndex] = useState(0)
  const slideAnim = useRef(new Animated.Value(1)).current
  const translateX = useRef(new Animated.Value(0)).current

  const goTo = (next) => {
    if (next < 0 || next >= PRESENTATION_TOTAL || next === index) return
    Animated.sequence([
      Animated.timing(slideAnim, { toValue: 0, duration: 120, useNativeDriver: true }),
      Animated.timing(translateX, { toValue: next > index ? -1 : 1, duration: 0, useNativeDriver: true }),
    ]).start(() => {
      setIndex(next)
      Animated.parallel([
        Animated.timing(translateX, { toValue: 0, duration: 0, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 1, duration: 220, useNativeDriver: true }),
      ]).start()
    })
  }

  const next = () => goTo(Math.min(index + 1, PRESENTATION_TOTAL - 1))
  const prev = () => goTo(Math.max(index - 1, 0))

  // Klavye ok tuşları — web'de aktif
  useEffect(() => {
    if (Platform.OS !== 'web') return
    const onKey = (e) => {
      if (e.key === 'ArrowRight') {
        if (isRTL) prev()
        else next()
      } else if (e.key === 'ArrowLeft') {
        if (isRTL) next()
        else prev()
      } else if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, isRTL])

  const onClose = () => {
    if (navigation?.canGoBack?.()) navigation.goBack()
    else navigation?.reset?.({ index: 0, routes: [{ name: 'Tabs' }] })
  }

  // Swipe gesture — RTL'de yön ters
  const pan = useMemo(
    () =>
      Gesture.Pan()
        .activeOffsetX([-15, 15])
        .onEnd((e) => {
          const threshold = 60
          if (e.translationX < -threshold) {
            if (isRTL) prev()
            else next()
          } else if (e.translationX > threshold) {
            if (isRTL) next()
            else prev()
          }
        }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [index, isRTL],
  )

  const slide = PRESENTATION_SLIDES[index]
  const Chevron = isRTL ? ChevronRight : ChevronLeft
  const ChevronOpp = isRTL ? ChevronLeft : ChevronRight

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#F4F4F6' }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F4F4F6' }} edges={['top', 'left', 'right']}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />

        {/* Header */}
        <View
          style={{
            flexDirection: isRTL ? 'row-reverse' : 'row',
            alignItems: 'center',
            paddingHorizontal: 12,
            paddingVertical: 10,
            backgroundColor: '#fff',
            borderBottomWidth: 1,
            borderBottomColor: colors.line,
            gap: 8,
          }}
        >
          <SoftPress
            onPress={prev}
            disabled={index === 0}
            style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              backgroundColor: index === 0 ? colors.bg : colors.redSoft,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Chevron size={20} color={index === 0 ? colors.muted : colors.red} />
          </SoftPress>

          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={{ color: colors.muted, fontSize: 11, fontWeight: '700' }}>
              {PRESENTATION_META.title}
            </Text>
            <Text style={{ color: colors.ink, fontWeight: '900', fontSize: 13 }}>
              {index + 1} / {PRESENTATION_TOTAL}
            </Text>
          </View>

          <SoftPress
            onPress={onClose}
            style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              backgroundColor: colors.redSoft,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={18} color={colors.red} />
          </SoftPress>
        </View>

        {/* Slide area */}
        <GestureDetector gesture={pan}>
          <Animated.View
            style={{
              flex: 1,
              backgroundColor: '#F4F4F6',
              opacity: slideAnim,
              transform: [
                {
                  translateX: translateX.interpolate({
                    inputRange: [-1, 0, 1],
                    outputRange: [-width * 0.3, 0, width * 0.3],
                  }),
                },
              ],
            }}
          >
            {renderSlide(slide, lang, isRTL, onClose, t)}
          </Animated.View>
        </GestureDetector>

        {/* Footer nav: dots + next */}
        <View
          style={{
            flexDirection: isRTL ? 'row-reverse' : 'row',
            alignItems: 'center',
            paddingHorizontal: 14,
            paddingVertical: 12,
            backgroundColor: '#fff',
            borderTopWidth: 1,
            borderTopColor: colors.line,
            gap: 10,
          }}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 6, paddingHorizontal: 4 }}
          >
            {PRESENTATION_SLIDES.map((_, i) => {
              const active = i === index
              return (
                <SoftPress
                  key={i}
                  onPress={() => goTo(i)}
                  style={{
                    width: active ? 22 : 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: active ? colors.red : colors.line,
                  }}
                />
              )
            })}
          </ScrollView>

          <View style={{ flex: 1 }} />

          <SoftPress
            onPress={next}
            disabled={index === PRESENTATION_TOTAL - 1}
            style={{
              flexDirection: isRTL ? 'row-reverse' : 'row',
              alignItems: 'center',
              gap: 6,
              paddingHorizontal: 14,
              paddingVertical: 10,
              borderRadius: 999,
              backgroundColor: index === PRESENTATION_TOTAL - 1 ? colors.bg : colors.red,
            }}
          >
            <Text
              style={{
                color: index === PRESENTATION_TOTAL - 1 ? colors.muted : '#fff',
                fontWeight: '800',
                fontSize: 13,
              }}
            >
              {t('next')}
            </Text>
            <ChevronOpp size={16} color={index === PRESENTATION_TOTAL - 1 ? colors.muted : '#fff'} />
          </SoftPress>
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  )
}
