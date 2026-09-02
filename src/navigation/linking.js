import { Platform } from 'react-native'

const web = Platform.OS === 'web'
const prefixes =
  web && typeof window !== 'undefined' && window.location?.origin ? [window.location.origin] : []

/** Customer storefront deep links. Admin is a separate shell (`/admin` or `#/admin`). */
export const customerLinking = {
  enabled: web,
  prefixes,
  config: {
    screens: {
      Language: 'lang',
      Tabs: {
        screens: {
          HomeTab: 'home',
          SearchTab: 'search',
          ButlerTab: 'butler',
          OrdersTab: 'orders',
          ProfileTab: 'profile',
        },
      },
      CourierHome: 'courier',
      Cart: 'cart',
      Checkout: 'checkout',
      Store: 'store/:id',
      Product: 'product/:productId',
      Category: 'category/:id',
      Favorites: 'favorites',
    },
  },
}
