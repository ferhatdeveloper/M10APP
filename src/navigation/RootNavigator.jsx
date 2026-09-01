import { ActivityIndicator, View } from 'react-native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Bike, Home, Receipt, Search, User } from 'lucide-react-native'
import { useApp } from '../context/AppContext'
import { useI18n } from '../context/I18nContext'
import { colors } from '../theme'
import LanguageScreen from '../screens/Language'
import HomeScreen from '../screens/Home'
import SearchScreen from '../screens/Search'
import CategoryScreen from '../screens/Category'
import StoreScreen from '../screens/Store'
import CartScreen from '../screens/Cart'
import CheckoutScreen from '../screens/Checkout'
import OrdersScreen from '../screens/Orders'
import OrderTrackingScreen from '../screens/OrderTracking'
import ProfileScreen from '../screens/Profile'
import FavoritesScreen from '../screens/Favorites'
import RewardsScreen from '../screens/Rewards'
import ButlerScreen from '../screens/Butler'
import AddressesScreen from '../screens/Addresses'
import LoginScreen from '../screens/Login'
import VerifyScreen from '../screens/Verify'
import StoryViewer from '../screens/StoryViewer'
import NotificationsScreen from '../screens/Notifications'
import ProductDetailScreen from '../screens/ProductDetail'
import FlyerScreen from '../screens/Flyer'
import RateOrderScreen from '../screens/RateOrder'
import SupportScreen from '../screens/Support'
import PlusScreen from '../screens/Plus'
import ListsScreen from '../screens/Lists'
import RecipeDetailScreen from '../screens/RecipeDetail'
import ButlerTrackScreen from '../screens/ButlerTrack'
import ReferralScreen from '../screens/Referral'
import WalletScreen from '../screens/Wallet'
import ReturnRequestScreen from '../screens/ReturnRequest'
import AdminRoute from '../screens/AdminRoute'
import CourierScreen from '../screens/Courier'
import ScanScreen from '../screens/Scan'
import TryInRoomScreen from '../screens/TryInRoom'

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

function Tabs() {
  const { t } = useI18n()
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.red,
        tabBarInactiveTintColor: '#9A9A9A',
        tabBarLabelStyle: { fontWeight: '700', fontSize: 11 },
        tabBarStyle: { borderTopColor: colors.line, height: 62, paddingBottom: 8, paddingTop: 6 },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{ tabBarLabel: t('home'), tabBarIcon: ({ color }) => <Home size={22} color={color} /> }}
      />
      <Tab.Screen
        name="SearchTab"
        component={SearchScreen}
        options={{ tabBarLabel: t('search'), tabBarIcon: ({ color }) => <Search size={22} color={color} /> }}
      />
      <Tab.Screen
        name="ButlerTab"
        component={ButlerScreen}
        options={{ tabBarLabel: t('butler'), tabBarIcon: ({ color }) => <Bike size={22} color={color} /> }}
      />
      <Tab.Screen
        name="OrdersTab"
        component={OrdersScreen}
        options={{ tabBarLabel: t('orders'), tabBarIcon: ({ color }) => <Receipt size={22} color={color} /> }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{ tabBarLabel: t('profile'), tabBarIcon: ({ color }) => <User size={22} color={color} /> }}
      />
    </Tab.Navigator>
  )
}

export default function RootNavigator() {
  const { lang } = useI18n()
  const { isCourier, hydrated } = useApp()

  if (!hydrated) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg }}>
        <ActivityIndicator color={colors.red} size="large" />
      </View>
    )
  }

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={lang ? (isCourier ? 'CourierHome' : 'Tabs') : 'Language'}
    >
      <Stack.Screen name="Language" component={LanguageScreen} />
      <Stack.Screen name="Tabs" component={Tabs} />
      <Stack.Screen name="CourierHome" component={CourierScreen} />
      <Stack.Screen name="Category" component={CategoryScreen} />
      <Stack.Screen name="Store" component={StoreScreen} />
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
      <Stack.Screen name="Track" component={OrderTrackingScreen} />
      <Stack.Screen name="Rewards" component={RewardsScreen} />
      <Stack.Screen name="Butler" component={ButlerScreen} />
      <Stack.Screen name="Favorites" component={FavoritesScreen} />
      <Stack.Screen name="Addresses" component={AddressesScreen} />
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Verify" component={VerifyScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Story" component={StoryViewer} options={{ headerShown: false, animation: 'fade' }} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="Product" component={ProductDetailScreen} />
      <Stack.Screen name="Flyer" component={FlyerScreen} />
      <Stack.Screen name="RateOrder" component={RateOrderScreen} />
      <Stack.Screen name="Support" component={SupportScreen} />
      <Stack.Screen name="Plus" component={PlusScreen} />
      <Stack.Screen name="Lists" component={ListsScreen} />
      <Stack.Screen name="RecipeDetail" component={RecipeDetailScreen} />
      <Stack.Screen name="ButlerTrack" component={ButlerTrackScreen} />
      <Stack.Screen name="Referral" component={ReferralScreen} />
      <Stack.Screen name="Wallet" component={WalletScreen} />
      <Stack.Screen name="ReturnRequest" component={ReturnRequestScreen} />
      <Stack.Screen name="Admin" component={AdminRoute} />
      <Stack.Screen name="Courier" component={CourierScreen} />
      <Stack.Screen name="Scan" component={ScanScreen} />
      <Stack.Screen name="TryInRoom" component={TryInRoomScreen} options={{ animation: 'fade' }} />
    </Stack.Navigator>
  )
}
