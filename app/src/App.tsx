import { Routes, Route } from 'react-router'
import Navigation from './components/Navigation'
import CartFlyout from './components/CartFlyout'
import { useCartSync } from './hooks/useCartSync'
import Home from './pages/Home'
import Shop from './pages/Shop'
import About from './pages/About'
import ProductDetail from './pages/ProductDetail'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Admin from './pages/Admin'
import NotFound from './pages/NotFound'

function AppContent() {
  useCartSync();

  return (
    <>
      <Navigation />
      <CartFlyout />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/about" element={<About />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default function App() {
  return <AppContent />;
}
