import { createNativeStackNavigator } from '@react-navigation/native-stack'
import AdminRoute from '../screens/AdminRoute'

const Stack = createNativeStackNavigator()

export default function AdminNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AdminHome" component={AdminRoute} />
    </Stack.Navigator>
  )
}
