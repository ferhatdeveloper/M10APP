import { useEffect } from 'react'
import { StatusBar } from 'expo-status-bar'
import { ActivityIndicator, View } from 'react-native'
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { I18nProvider, useI18n } from './src/context/I18nContext'
import { AppProvider } from './src/context/AppContext'
import { ShellProvider, useShell } from './src/context/ShellContext'
import RootNavigator from './src/navigation/RootNavigator'
import AdminNavigator from './src/navigation/AdminNavigator'
import { customerLinking } from './src/navigation/linking'
import StorefrontFrame from './src/components/StorefrontFrame'
import InAppToast from './src/components/InAppToast'
import OfflineBanner from './src/components/OfflineBanner'
import { ensureIosWebMeta } from './src/utils/iosWebMeta'
import { colors } from './src/theme'

const navigationRef = createNavigationContainerRef()

function Boot() {
  const { ready } = useI18n()
  const { shell } = useShell()

  useEffect(() => {
    ensureIosWebMeta()
  }, [])

  if (!ready) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.red }}>
        <ActivityIndicator color="#fff" />
      </View>
    )
  }

  const admin = shell === 'admin'

  return (
    <>
      <StatusBar style="light" />
      <OfflineBanner />
      {admin ? (
        <NavigationContainer
          key="admin"
          ref={navigationRef}
          documentTitle={{ enabled: true, formatter: () => 'M10 Admin' }}
        >
          <AdminNavigator />
        </NavigationContainer>
      ) : (
        <NavigationContainer
          key="customer"
          ref={navigationRef}
          linking={customerLinking}
          documentTitle={{ enabled: true, formatter: () => 'M10' }}
        >
          <StorefrontFrame>
            <RootNavigator />
          </StorefrontFrame>
        </NavigationContainer>
      )}
      <InAppToast navigationRef={navigationRef} />
    </>
  )
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <I18nProvider>
          <AppProvider>
            <ShellProvider>
              <Boot />
            </ShellProvider>
          </AppProvider>
        </I18nProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}
