import { StatusBar } from 'expo-status-bar'
import { ActivityIndicator, View } from 'react-native'
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { I18nProvider, useI18n } from './src/context/I18nContext'
import { AppProvider } from './src/context/AppContext'
import RootNavigator from './src/navigation/RootNavigator'
import InAppToast from './src/components/InAppToast'
import OfflineBanner from './src/components/OfflineBanner'
import { colors } from './src/theme'

const navigationRef = createNavigationContainerRef()

function Boot() {
  const { ready } = useI18n()
  if (!ready) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.red }}>
        <ActivityIndicator color="#fff" />
      </View>
    )
  }
  return (
    <>
      <StatusBar style="light" />
      <OfflineBanner />
      <RootNavigator />
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
            <NavigationContainer ref={navigationRef}>
              <Boot />
            </NavigationContainer>
          </AppProvider>
        </I18nProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}
