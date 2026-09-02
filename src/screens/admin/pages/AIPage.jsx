import { lazy, Suspense } from 'react'
import { ActivityIndicator, View } from 'react-native'
import { Sparkles } from 'lucide-react-native'
import SectionHeader from '../components/SectionHeader'

const AdminAIInner = lazy(() => import('../../AdminAI'))

export default function AIPage({ theme, isRTL }) {
  const c = theme.colors
  return (
    <View style={{ gap: 16 }}>
      <SectionHeader
        theme={theme}
        isRTL={isRTL}
        title="Yapay Zeka"
        subtitle="OpenRouter ile içerik üretimi"
      />
      <Suspense
        fallback={
          <View
            style={{
              paddingVertical: 60,
              alignItems: 'center',
              gap: 8,
              backgroundColor: c.card,
              borderRadius: theme.radius.lg,
              borderWidth: 1,
              borderColor: c.line,
            }}
          >
            <Sparkles size={24} color={c.muted} />
            <ActivityIndicator color={c.red} />
          </View>
        }
      >
        <AdminAIInner />
      </Suspense>
    </View>
  )
}
