import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { API_URL } from './config';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Success from './pages/Success';
import AdminPortal from './pages/AdminPortal';
import Product from './pages/Product';
import TrackOrder from './pages/TrackOrder';

const CART_STORAGE_KEY = 'mithila_cart_v1';

function loadCart() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function App() {
  const [cart, setCart] = useState(loadCart);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  const fetchProducts = () => {
    fetch(`${API_URL}/api/products`)
      .then(res => res.json())
      .then(data => { setProducts(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  };

  useEffect(() => { fetchProducts(); }, []);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const addToCart = (product, quantity = 1) => {
    setCart(prevCart => {
      const existing = prevCart.find(item => item.id === product.id);
      if (existing) {
        return prevCart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prevCart, { ...product, quantity }];
    });
    showToast(`${product.name} added to your cart.`);
    setDrawerOpen(true);
  };

  const updateQuantity = (id, delta) => {
    setCart(prevCart => prevCart.map(item =>
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  };

  const removeFromCart = (id) => setCart(prevCart => prevCart.filter(item => item.id !== id));

  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <Router>
      <div className="min-h-screen bg-[#F9F8F4] text-gray-800 font-sans flex flex-col relative">

        {toast && (
          <div className="fixed top-24 right-8 bg-[#4A3B32] text-white px-6 py-3 shadow-xl z-50 border-l-4 border-[#2C2420] animate-fade-in-up">
            <p className="font-bold text-sm tracking-widest">{toast}</p>
          </div>
        )}

        <Navigation cartItemCount={cartItemCount} onCartClick={() => setDrawerOpen(true)} />

        <CartDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          cart={cart}
          updateQuantity={updateQuantity}
          removeFromCart={removeFromCart}
        />

        <div className="grow">
          <Routes>
            <Route path="/" element={<Home addToCart={addToCart} products={products} loading={loading} />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact showToast={showToast} />} />
            <Route path="/cart" element={<Cart cart={cart} updateQuantity={updateQuantity} removeFromCart={removeFromCart} />} />
            <Route path="/checkout" element={<Checkout cart={cart} setCart={setCart} showToast={showToast} />} />
            <Route path="/success" element={<Success />} />
            <Route path="/admin" element={<AdminPortal refreshProducts={fetchProducts} />} />
            <Route path="/product/:id" element={<Product products={products} addToCart={addToCart} loading={loading} />} />
            <Route path="/track-order" element={<TrackOrder />} />
          </Routes>
        </div>

        <Footer />
      </div>
    </Router>
  );
}
