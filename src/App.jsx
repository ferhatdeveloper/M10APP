import { Routes, Route } from 'react-router'
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'
import Search from './pages/Search.jsx'
import Category from './pages/Category.jsx'
import Store from './pages/Store.jsx'
import Cart from './pages/Cart.jsx'
import Checkout from './pages/Checkout.jsx'
import Orders from './pages/Orders.jsx'
import OrderTracking from './pages/OrderTracking.jsx'
import Profile from './pages/Profile.jsx'
import Favorites from './pages/Favorites.jsx'
import Rewards from './pages/Rewards.jsx'
import Butler from './pages/Butler.jsx'
import Addresses from './pages/Addresses.jsx'
import Brands from './pages/Brands.jsx'
import Brand from './pages/Brand.jsx'
import Product from './pages/Product.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/category/:id" element={<Category />} />
        <Route path="/brands" element={<Brands />} />
        <Route path="/brand/:id" element={<Brand />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/store/:id" element={<Store />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/track/:id" element={<OrderTracking />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/rewards" element={<Rewards />} />
        <Route path="/butler" element={<Butler />} />
        <Route path="/addresses" element={<Addresses />} />
      </Route>
    </Routes>
  )
}
