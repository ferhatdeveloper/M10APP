import { useEffect, useRef, useState } from 'react'
import { Animated, Image, Pressable, StatusBar, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { X } from 'lucide-react-native'
import { useApp } from '../context/AppContext'
import { useI18n } from '../context/I18nContext'
import { stories, storyBody, storyCta, storyTitle } from '../data/mock'
import { src } from '../utils/images'
import { colors } from '../theme'

const DURATION = 5000

export default function StoryViewer({ navigation, route }) {
  const startId = route.params?.id
  const startIndex = Math.max(0, stories.findIndex((s) => s.id === startId))
  const [index, setIndex] = useState(startIndex < 0 ? 0 : startIndex)
  const { markStorySeen } = useApp()
  const { lang } = useI18n()
  const insets = useSafeAreaInsets()
  const timer = useRef(null)
  const progress = useRef(new Animated.Value(0)).current
  const anim = useRef(null)
  const story = stories[index]

  const close = () => navigation.goBack()

  const goTo = (next) => {
    if (next < 0 || next >= stories.length) {
      close()
      return
    }
    setIndex(next)
  }

  useEffect(() => {
    if (!story) return
    markStorySeen(story.id)
    progress.setValue(0)
    anim.current = Animated.timing(progress, {
      toValue: 1,
      duration: DURATION,
      useNativeDriver: false,
    })
    anim.current.start()
    timer.current = setTimeout(() => goTo(index + 1), DURATION)
    return () => {
      anim.current?.stop()
      clearTimeout(timer.current)
    }
  }, [index, story?.id])

  if (!story) return null

  const onCta = () => {
    const cta = story.cta
    if (!cta?.screen) {
      close()
      return
    }
    navigation.replace(cta.screen, cta.params)
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.ink }}>
      <StatusBar barStyle="light-content" />
      {story.image ? (
        <Image
          source={src(story.image)}
          pointerEvents="none"
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%' }}
        />
      ) : null}
      <View
        pointerEvents="none"
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.35)' }}
      />

      <Pressable
        onPress={() => goTo(index - 1)}
        style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: '42%' }}
      />
      <Pressable
        onPress={() => goTo(index + 1)}
        style={{ position: 'absolute', top: 0, bottom: 0, right: 0, width: '42%' }}
      />

      <View pointerEvents="box-none" style={{ flex: 1, paddingTop: insets.top + 8, paddingHorizontal: 12 }}>
        <View style={{ flexDirection: 'row', gap: 4 }}>
          {stories.map((s, i) => (
            <View key={s.id} style={{ flex: 1, height: 3, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.28)', overflow: 'hidden' }}>
              {i < index ? (
                <View style={{ height: '100%', width: '100%', backgroundColor: '#fff' }} />
              ) : i === index ? (
                <Animated.View
                  style={{
                    height: '100%',
                    backgroundColor: '#fff',
                    width: progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
                  }}
                />
              ) : (
                <View style={{ height: '100%', width: 0 }} />
              )}
            </View>
          ))}
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 }}>
          <Pressable
            onPress={close}
            style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(0,0,0,0.35)', alignItems: 'center', justifyContent: 'center' }}
          >
            <X size={20} color="#fff" />
          </Pressable>
        </View>

        <View style={{ flex: 1 }} />

        <View style={{ paddingBottom: insets.bottom + 20, paddingHorizontal: 8 }}>
          <Text style={{ color: colors.yellow, fontWeight: '800', fontSize: 12 }}>M10</Text>
          <Text style={{ color: '#fff', fontWeight: '900', fontSize: 28, marginTop: 4 }}>{storyTitle(story, lang)}</Text>
          <Text style={{ color: 'rgba(255,255,255,0.9)', marginTop: 6, fontSize: 16 }}>{storyBody(story, lang)}</Text>
          <Pressable
            onPress={onCta}
            style={{ marginTop: 16, backgroundColor: colors.red, borderRadius: 14, paddingVertical: 14, alignItems: 'center' }}
          >
            <Text style={{ color: '#fff', fontWeight: '800' }}>{storyCta(story, lang)}</Text>
          </Pressable>
        </View>
      </View>
    </View>
  )
}
