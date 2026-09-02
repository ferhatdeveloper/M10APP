import { lazy, Suspense } from 'react'
import { ActivityIndicator, View } from 'react-native'
import ErrorBoundary from '../components/ErrorBoundary'
import { colors } from '../theme'

const AdminScreen = lazy(() => import('./Admin'))

function AdminFallback() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg }}>
      <ActivityIndicator color={colors.red} size="large" />
    </View>
  )
}

export default function AdminRoute(props) {
  return (
    <ErrorBoundary title="Admin panel failed to load" retryLabel="Try again">
      <Suspense fallback={<AdminFallback />}>
        <AdminScreen {...props} />
      </Suspense>
    </ErrorBoundary>
  )
}
