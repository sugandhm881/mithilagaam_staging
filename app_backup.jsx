import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';

export default function App() {
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // FIXED: Function hoisted above the useEffect to clear the ESLint error
  const fetchProducts = () => {
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch products:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // --- SMART CART LOGIC ---
  const addToCart = (product) => {
    setCart(prevCart => {
      const existing = prevCart.find(item => item.id === product.id);
      if (existing) {
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    alert(`${product.name} added to cart!`);
  };

  const updateQuantity = (id, delta) => {
    setCart(prevCart => prevCart.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  };

  const removeFromCart = (id) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  // Calculate total items for the navbar badge
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <Router>
      <div className="min-h-screen relative pb-20 bg-brand-cream">
        
        {/* NAVBAR */}
        <nav className="flex justify-between items-center px-8 py-6 border-b border-brand-accent/20 bg-white sticky top-0 z-50">
          <Link to="/" className="text-2xl tracking-widest font-bold uppercase text-brand-brown">
            Mithila Gaam
          </Link>
          <div className="flex items-center gap-8">
            <Link to="/admin" className="hidden md:block text-xs tracking-widest uppercase text-brand-light-brown hover:text-brand-brown transition-colors">Admin Portal</Link>
            <Link to="/cart">
              <button className="border border-brand-brown bg-brand-brown text-white px-6 py-2 text-sm tracking-widest uppercase hover:bg-brand-light-brown transition-colors">
                Cart ({cartItemCount})
              </button>
            </Link>
          </div>
        </nav>

        {/* ROUTES */}
        <Routes>
          <Route path="/" element={<Home addToCart={addToCart} products={products} loading={loading} />} />
          <Route path="/cart" element={<Cart cart={cart} updateQuantity={updateQuantity} removeFromCart={removeFromCart} />} />
          <Route path="/checkout" element={<Checkout cart={cart} setCart={setCart} />} />
          <Route path="/success" element={<Success />} />
          <Route path="/admin" element={<AdminPortal refreshProducts={fetchProducts} products={products} />} />
        </Routes>

        {/* FLOATING WHATSAPP BUTTON */}
        <a 
          href="https://wa.me/911234567890?text=I%20need%20help%20with%20my%20Mithila%20Gaam%20order" 
          target="_blank" 
          rel="noreferrer"
          className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-colors z-50 flex items-center justify-center font-bold"
        >
          💬 WhatsApp
        </a>

      </div>
    </Router>
  );
}

// --- HOME PAGE COMPONENT ---
function Home({ addToCart, products, loading }) {
  return (
    <>
      <section className="flex flex-col items-center justify-center text-center py-24 px-4">
        <h1 className="text-5xl md:text-7xl mb-6 font-light">
          The Authentic Taste <br/> <span className="italic font-serif">of Mithila.</span>
        </h1>
        <p className="max-w-xl text-lg text-brand-light-brown mb-10 leading-relaxed font-sans">
          Premium quality Phool Makhana, sourced directly from the heart of Bihar.
        </p>
      </section>

      <section id="products" className="py-12 px-8 max-w-7xl mx-auto">
        <h2 className="text-3xl tracking-widest uppercase text-center mb-16">Curated Selection</h2>
        
        {loading ? (
          <div className="text-center text-brand-light-brown text-xl">Loading harvest from the database...</div>
        ) : products.length === 0 ? (
          <div className="text-center text-brand-light-brown text-xl">No products available at the moment.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {products.map((product) => (
              <div key={product.id} className="group flex flex-col">
                <div className="bg-white aspect-square mb-6 overflow-hidden border border-brand-accent/10 transition-transform duration-500 group-hover:shadow-md">
                   {/* Updated to use actual Image URLs */}
                  <img 
                    src={product.image_url || 'https://via.placeholder.com/400x400.png?text=Mithila+Gaam'} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  />
                </div>
                <h3 className="text-xl mb-2 font-bold">{product.name}</h3>
                <p className="text-brand-light-brown font-sans mb-4 text-sm">{product.description}</p>
                <div className="mt-auto flex justify-between items-center border-t border-brand-accent/20 pt-4">
                  <span className="text-lg font-bold">₹{product.price}</span>
                  <button 
                    onClick={() => addToCart(product)}
                    className="text-sm tracking-widest uppercase hover:text-brand-accent font-bold cursor-pointer"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

// --- CART PAGE COMPONENT ---
function Cart({ cart, updateQuantity, removeFromCart }) {
  const navigate = useNavigate();
  // Total now factors in quantity
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="max-w-4xl mx-auto py-16 px-8">
      <h2 className="text-3xl tracking-widest uppercase mb-12 border-b border-brand-accent/20 pb-4">Your Cart</h2>
      
      {cart.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-brand-light-brown mb-6">Your cart is currently empty.</p>
          <button onClick={() => navigate('/')} className="bg-brand-brown text-brand-cream px-8 py-3 text-sm tracking-widest uppercase hover:bg-brand-light-brown transition-colors">
            Continue Shopping
          </button>
        </div>
      ) : (
        <div>
          {cart.map((item) => (
            <div key={item.id} className="flex flex-col md:flex-row justify-between items-center mb-6 bg-white p-4 shadow-sm border border-brand-accent/10 gap-4">
              <div className="flex items-center gap-4 w-full md:w-1/2">
                <img src={item.image_url || 'https://via.placeholder.com/100'} alt={item.name} className="w-16 h-16 object-cover border border-brand-accent/20" />
                <div>
                  <h3 className="font-bold text-lg">{item.name}</h3>
                  <p className="text-sm text-brand-light-brown font-sans">₹{item.price} each</p>
                </div>
              </div>
              
              <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                {/* Quantity Controls */}
                <div className="flex items-center border border-brand-accent/30">
                  <button onClick={() => updateQuantity(item.id, -1)} className="px-3 py-1 bg-gray-50 hover:bg-gray-200 transition-colors">-</button>
                  <span className="px-4 font-bold font-sans">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)} className="px-3 py-1 bg-gray-50 hover:bg-gray-200 transition-colors">+</button>
                </div>
                
                <span className="font-bold text-lg w-20 text-right">₹{item.price * item.quantity}</span>
                <button onClick={() => removeFromCart(item.id)} className="text-red-500 text-xs tracking-widest uppercase hover:text-red-700">
                  Remove
                </button>
              </div>
            </div>
          ))}
          <div className="mt-12 flex flex-col items-end border-t border-brand-accent/20 pt-8">
            <div className="text-xl mb-6 font-sans">Subtotal: <span className="font-bold text-3xl ml-4">₹{total}</span></div>
            <button onClick={() => navigate('/checkout')} className="bg-brand-brown text-brand-cream px-12 py-4 text-sm tracking-widest uppercase hover:bg-brand-light-brown transition-colors w-full md:w-auto text-center cursor-pointer">
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// --- CHECKOUT PAGE COMPONENT ---
function Checkout({ cart, setCart }) {
  const navigate = useNavigate();
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [showUPI, setShowUPI] = useState(false);
  const [utr, setUtr] = useState('');
  
  // Controlled Address Form State
  const [formData, setFormData] = useState({
    fname: '', lname: '', email: '', phone: '', street: '', pincode: '', city: '', state: ''
  });

  useEffect(() => {
    if (cart.length === 0) navigate('/cart');
  }, [cart.length, navigate]);

  if (cart.length === 0) return null;

  const upiString = `upi://pay?pa=728980408@okaxis&pn=Mithila%20Gaam&am=${total}&cu=INR`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiString)}`;

  // Handle Form Inputs
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // India Post Pincode Logic
  const handlePincode = async (e) => {
    const pin = e.target.value;
    setFormData(prev => ({ ...prev, pincode: pin }));
    
    if (pin.length === 6) {
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
        const data = await res.json();
        if (data[0].Status === "Success") {
          const postOffice = data[0].PostOffice[0];
          setFormData(prev => ({ ...prev, city: postOffice.District, state: postOffice.State }));
        }
      } catch (err) {
        console.error("Pincode lookup failed", err);
      }
    }
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (paymentMethod === 'UPI') {
      setShowUPI(true);
    } else {
      placeOrder('COD', 'N/A', formData);
    }
  };

  const handleUPIConfirm = (e) => {
    e.preventDefault();
    if (utr.trim().length < 12) {
      alert("Please enter a valid 12-digit UTR number.");
      return;
    }
    placeOrder('UPI', utr, formData);
  };

  const placeOrder = async (method, utrNumber, finalCustomer) => {
    try {
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          customer: finalCustomer, 
          cart, 
          total, 
          paymentMethod: method, 
          utr: utrNumber 
        })
      });

      if (!response.ok) throw new Error('Order failed');

      setCart([]);
      navigate('/success');
    } catch (error) {
      alert("Something went wrong placing the order. Check backend terminal!");
      console.error(error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-16 px-8 grid grid-cols-1 md:grid-cols-2 gap-16">
      <div>
        {!showUPI ? (
          <>
            <h2 className="text-2xl tracking-widest uppercase mb-8 border-b border-brand-accent/20 pb-4">Shipping & Payment</h2>
            <form onSubmit={handleNextStep} className="space-y-6 font-sans">
              
              {/* Personal Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-brand-light-brown mb-2">First Name</label>
                  <input name="fname" required value={formData.fname} onChange={handleInputChange} className="w-full border border-brand-accent/30 p-3 bg-white focus:outline-none focus:border-brand-brown" />
                </div>
                <div>
                  <label className="block text-sm text-brand-light-brown mb-2">Last Name</label>
                  <input name="lname" required value={formData.lname} onChange={handleInputChange} className="w-full border border-brand-accent/30 p-3 bg-white focus:outline-none focus:border-brand-brown" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-brand-light-brown mb-2">Email Address</label>
                  <input name="email" type="email" required value={formData.email} onChange={handleInputChange} className="w-full border border-brand-accent/30 p-3 bg-white focus:outline-none focus:border-brand-brown" />
                </div>
                <div>
                  <label className="block text-sm text-brand-light-brown mb-2">Phone Number</label>
                  <input name="phone" required type="tel" value={formData.phone} onChange={handleInputChange} className="w-full border border-brand-accent/30 p-3 bg-white focus:outline-none focus:border-brand-brown" />
                </div>
              </div>

              {/* Automated Address Details */}
              <div className="pt-4">
                <label className="block text-sm text-brand-light-brown mb-2">Pincode</label>
                <input name="pincode" maxLength="6" required value={formData.pincode} onChange={handlePincode} className="w-full border border-brand-accent/30 p-3 bg-white focus:outline-none focus:border-brand-brown" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-brand-light-brown mb-2">City / District</label>
                  <input name="city" required readOnly value={formData.city} className="w-full border border-brand-accent/10 p-3 bg-gray-50 cursor-not-allowed text-gray-600" />
                </div>
                <div>
                  <label className="block text-sm text-brand-light-brown mb-2">State</label>
                  <input name="state" required readOnly value={formData.state} className="w-full border border-brand-accent/10 p-3 bg-gray-50 cursor-not-allowed text-gray-600" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-brand-light-brown mb-2">House No. / Street Address</label>
                <textarea name="street" required rows="2" value={formData.street} onChange={handleInputChange} className="w-full border border-brand-accent/30 p-3 bg-white focus:outline-none focus:border-brand-brown"></textarea>
              </div>

              {/* Payment Methods */}
              <div className="pt-6 border-t border-brand-accent/20">
                <label className="block text-sm text-brand-light-brown mb-4 uppercase tracking-widest">Select Payment Method</label>
                <div className="flex gap-4">
                  <button type="button" onClick={() => setPaymentMethod('COD')} className={`flex-1 p-4 border transition-colors ${paymentMethod === 'COD' ? 'border-brand-brown bg-brand-brown text-white' : 'border-brand-accent/30 bg-white text-brand-brown'}`}>
                    Cash on Delivery
                  </button>
                  <button type="button" onClick={() => setPaymentMethod('UPI')} className={`flex-1 p-4 border transition-colors ${paymentMethod === 'UPI' ? 'border-brand-brown bg-brand-brown text-white' : 'border-brand-accent/30 bg-white text-brand-brown'}`}>
                    Pay via UPI
                  </button>
                </div>
              </div>

              <button type="submit" className="w-full bg-brand-brown text-brand-cream px-12 py-4 text-sm tracking-widest uppercase hover:bg-brand-light-brown transition-colors cursor-pointer mt-8 font-bold">
                {paymentMethod === 'UPI' ? `Proceed to Pay ₹${total}` : `Complete Order (₹${total})`}
              </button>
            </form>
          </>
        ) : (
          <div className="bg-white p-8 border border-brand-accent/20 text-center shadow-sm">
             <h2 className="text-xl tracking-widest uppercase mb-4 text-brand-brown">Scan to Pay</h2>
             <p className="text-brand-light-brown font-sans mb-6">Scan with any UPI app and pay exactly <b>₹{total}</b>.</p>
             
             <div className="flex justify-center mb-6">
                <img src={qrCodeUrl} alt="UPI QR Code" className="w-56 h-56 border-4 border-brand-cream shadow-md" />
             </div>

             <form onSubmit={handleUPIConfirm} className="space-y-4 text-left border-t border-brand-accent/20 pt-6">
                <div>
                  <label className="block text-sm text-brand-light-brown mb-2 font-sans">Enter 12-Digit UTR / Reference No.</label>
                  <input 
                    required 
                    type="text" 
                    maxLength="12"
                    placeholder="e.g. 312345678901"
                    value={utr}
                    onChange={(e) => setUtr(e.target.value)}
                    className="w-full border border-brand-accent/30 p-3 bg-white focus:outline-none focus:border-brand-brown font-mono" 
                  />
                </div>
                <button type="submit" className="w-full bg-green-700 text-white px-12 py-4 text-sm tracking-widest uppercase hover:bg-green-800 transition-colors cursor-pointer font-bold">
                  Confirm Payment & Place Order
                </button>
                <button type="button" onClick={() => setShowUPI(false)} className="w-full text-brand-light-brown text-sm tracking-widest uppercase mt-4 hover:text-brand-brown font-bold">
                  Go Back
                </button>
             </form>
          </div>
        )}
      </div>

      {/* RIGHT COLUMN: ORDER SUMMARY */}
      <div className="bg-[#EFEBE4] p-8 h-fit sticky top-32 border border-brand-accent/10">
        <h2 className="text-xl tracking-widest uppercase mb-6 border-b border-brand-accent/20 pb-4">Order Summary</h2>
        <div className="space-y-4 mb-6">
          {cart.map((item, index) => (
            <div key={index} className="flex justify-between text-brand-brown font-sans text-sm">
              <span>{item.name} <span className="text-brand-light-brown ml-2">x {item.quantity}</span></span>
              <span className="font-bold">₹{item.price * item.quantity}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center border-t border-brand-accent/20 pt-4 text-xl mt-6">
          <span className="tracking-widest uppercase text-sm font-bold">Total</span>
          <span className="font-bold font-sans">₹{total}</span>
        </div>
      </div>
    </div>
  );
}

// --- SUCCESS PAGE COMPONENT ---
function Success() {
  const navigate = useNavigate();
  return (
    <div className="max-w-2xl mx-auto py-32 px-8 text-center">
      <div className="text-6xl mb-6">✨</div>
      <h2 className="text-4xl tracking-widest uppercase mb-6 text-brand-brown">Order Confirmed</h2>
      <p className="text-brand-light-brown font-sans text-lg mb-10 leading-relaxed">
        Thank you for choosing Mithila Gaam. Your premium Phool Makhana is being prepared.
      </p>
      <button onClick={() => navigate('/')} className="bg-brand-brown text-brand-cream px-10 py-4 text-sm tracking-widest uppercase hover:bg-brand-light-brown transition-colors cursor-pointer">
        Return to Shop
      </button>
    </div>
  );
}

// --- FULL ADMIN DASHBOARD (D2C PRO EDITION) ---
function AdminPortal({ refreshProducts }) {
  const [orders, setOrders] = useState([]);
  const [adminProducts, setAdminProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false); // To show loading state during image upload
  const [activeTab, setActiveTab] = useState('dashboard');
  const [orderFilter, setOrderFilter] = useState('All'); 
  
  const [editingProduct, setEditingProduct] = useState(null); 
  const [newProduct, setNewProduct] = useState({ 
    name: '', price: '', description: '', image_url: '', image_base64: null, stock: 100, category: 'Makhana' 
  });

  const fetchAdminData = () => {
    Promise.all([
      fetch('http://localhost:5000/api/admin/orders').then(res => res.json()),
      fetch('http://localhost:5000/api/admin/products').then(res => res.json())
    ]).then(([ordersData, productsData]) => {
      setOrders(Array.isArray(ordersData) ? ordersData : []);
      setAdminProducts(Array.isArray(productsData) ? productsData : []);
      setLoading(false);
    }).catch(err => {
      console.error("Failed to load admin data:", err);
      setLoading(false);
    });
  };

  useEffect(() => { fetchAdminData(); }, []);

  // --- IMAGE UPLOAD HANDLER ---
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (editingProduct) {
          setEditingProduct({ ...editingProduct, image_base64: reader.result, image_url: reader.result });
        } else {
          setNewProduct({ ...newProduct, image_base64: reader.result, image_url: reader.result });
        }
      };
      reader.readAsDataURL(file); // Converts file to string for backend
    }
  };

  // --- ORDER MANAGEMENT ---
  const updateOrder = async (id, field, value) => {
    await fetch(`http://localhost:5000/api/admin/orders/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ [field]: value })
    });
    setOrders(orders.map(o => o.order_id === id ? { ...o, [field]: value } : o));
  };

  // --- PRODUCT MANAGEMENT ---
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const isEdit = !!editingProduct;
    const url = isEdit ? `http://localhost:5000/api/admin/products/${editingProduct.id}` : 'http://localhost:5000/api/admin/products';
    
    await fetch(url, {
      method: isEdit ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(isEdit ? editingProduct : newProduct)
    });
    
    setEditingProduct(null);
    setNewProduct({ name: '', price: '', description: '', image_url: '', image_base64: null, stock: 100, category: 'Makhana' });
    fetchAdminData();
    refreshProducts();
    setIsSaving(false);
  };

  const updateProductQuick = async (product, field, value) => {
    const updatedProduct = { ...product, [field]: value };
    await fetch(`http://localhost:5000/api/admin/products/${product.id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updatedProduct)
    });
    fetchAdminData();
    refreshProducts();
  };

  const handleDeleteProduct = async (id) => {
    if(window.confirm("Are you sure you want to permanently delete this product?")) {
      await fetch(`http://localhost:5000/api/admin/products/${id}`, { method: 'DELETE' });
      fetchAdminData();
      refreshProducts();
    }
  };

  const filteredOrders = orders.filter(o => orderFilter === 'All' || o.status === orderFilter);
  const revenue = orders.filter(o => o.status !== 'Cancelled').reduce((sum, order) => sum + Number(order.total_amount), 0);

  if (loading) return <div className="p-20 text-center font-bold text-gray-500 uppercase tracking-widest min-h-screen bg-gray-50 flex items-center justify-center">Loading Command Center...</div>;

  return (
    <div className="flex min-h-screen bg-[#F8F9FA] font-sans">
      
      {/* SIDEBAR */}
      <aside className="hidden md:flex flex-col w-64 bg-[#1A1A1A] text-white p-6 shrink-0">
        <h2 className="text-xl font-bold tracking-tighter mb-10 text-brand-accent uppercase">Mithila ERP</h2>
        <nav className="space-y-4 grow">
          <button onClick={() => setActiveTab('dashboard')} className={`w-full text-left p-3 rounded text-sm uppercase tracking-widest font-bold transition-colors ${activeTab === 'dashboard' ? 'bg-brand-brown' : 'hover:bg-[#333]'}`}>
            Orders Ledger
          </button>
          <button onClick={() => setActiveTab('inventory')} className={`w-full text-left p-3 rounded text-sm uppercase tracking-widest font-bold transition-colors ${activeTab === 'inventory' ? 'bg-brand-brown' : 'hover:bg-[#333]'}`}>
            Catalog & Stock
          </button>
        </nav>
        <Link to="/" className="text-xs text-gray-500 hover:text-white mt-auto border-t border-gray-800 pt-4">← Return to Storefront</Link>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="grow p-6 md:p-10 overflow-x-hidden">
        {activeTab === 'dashboard' ? (
          <section>
            {/* KPI HEADERS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 shadow-sm border border-gray-100 rounded-xl border-l-4 border-l-green-600">
                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1">Net Revenue</p>
                <p className="text-3xl font-bold text-[#2C2420]">₹{revenue.toLocaleString()}</p>
              </div>
              <div className="bg-white p-6 shadow-sm border border-gray-100 rounded-xl border-l-4 border-l-[#4A3B32]">
                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1">Total Orders</p>
                <p className="text-3xl font-bold text-[#2C2420]">{orders.length}</p>
              </div>
            </div>

            {/* ORDERS TABLE */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              <div className="bg-gray-50 p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                <h3 className="uppercase tracking-widest text-sm font-bold text-gray-700">Order Management</h3>
                <select value={orderFilter} onChange={e => setOrderFilter(e.target.value)} className="text-xs border p-2 rounded bg-white font-bold focus:outline-none focus:ring-2 focus:ring-brand-brown">
                  <option value="All">All Orders</option>
                  <option value="Pending">Pending</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-[10px] uppercase tracking-widest text-gray-500">
                    <tr><th className="p-4">Customer</th><th className="p-4">Payment</th><th className="p-4">Status & Tracking</th><th className="p-4">Action</th></tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-sm">
                    {filteredOrders.length === 0 ? (
                      <tr><td colSpan="4" className="p-8 text-center text-gray-400">No orders found.</td></tr>
                    ) : filteredOrders.map(o => (
                      <tr key={o.order_id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-4">
                          <div className="font-bold text-[#2C2420]">#{o.order_id} - {o.first_name} {o.last_name}</div>
                          <div className="text-xs text-gray-500 mt-1">{o.phone} | {o.email}</div>
                          <div className="text-[10px] text-gray-400 mt-1 max-w-50 truncate">{o.address}</div>
                        </td>
                        <td className="p-4">
                          <div className="text-xs font-bold text-gray-700">{o.payment_method}</div>
                          <div className="text-sm font-bold text-green-700 mt-1">₹{o.total_amount}</div>
                          {o.utr_number && <div className="text-[10px] text-blue-600 font-mono mt-1">UTR: {o.utr_number}</div>}
                        </td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${o.status === 'Delivered' ? 'bg-green-100 text-green-700' : o.status === 'Shipped' ? 'bg-blue-100 text-blue-700' : o.status === 'Cancelled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {o.status}
                          </span>
                          {o.status === 'Shipped' && (
                            <input 
                              type="text" placeholder="Add Tracking Link / AWB" defaultValue={o.tracking_url || ''}
                              onBlur={(e) => updateOrder(o.order_id, 'tracking_url', e.target.value)}
                              className="mt-3 w-full border border-gray-200 text-xs p-2 rounded bg-white focus:outline-none focus:border-brand-brown transition-colors"
                            />
                          )}
                          {o.status === 'Delivered' && o.tracking_url && (
                             <a href={o.tracking_url} target="_blank" rel="noreferrer" className="block mt-2 text-[10px] text-blue-500 underline uppercase tracking-widest">View Tracking</a>
                          )}
                        </td>
                        <td className="p-4">
                          {o.status === 'Delivered' || o.status === 'Cancelled' ? (
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Locked</span>
                          ) : (
                            <select 
                              value={o.status} onChange={(e) => updateOrder(o.order_id, 'status', e.target.value)}
                              className="bg-white border border-gray-200 p-2 rounded text-xs font-bold text-gray-700 focus:ring-2 focus:ring-brand-brown outline-none cursor-pointer shadow-sm"
                            >
                              <option value="Pending">Pending</option><option value="Shipped">Shipped</option><option value="Delivered">Delivered</option><option value="Cancelled">Cancelled</option>
                            </select>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        ) : (
          <section className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            
            {/* EDITOR FORM COLUMN WITH IMAGE UPLOAD */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit xl:sticky xl:top-8">
              <h4 className="font-bold uppercase tracking-widest mb-6 border-b border-gray-100 pb-4 text-[#4A3B32]">
                {editingProduct ? 'Edit Product SKU' : 'Add New SKU'}
              </h4>
              <form onSubmit={handleProductSubmit} className="space-y-4">
                
                {/* IMAGE UPLOAD UI */}
                <div className="mb-4">
                  <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-widest">Product Image</label>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-gray-100 border border-gray-200 rounded flex items-center justify-center overflow-hidden shrink-0">
                       {(editingProduct?.image_url || newProduct?.image_url) ? (
                          <img src={editingProduct ? editingProduct.image_url : newProduct.image_url} alt="Preview" className="w-full h-full object-cover" />
                       ) : (
                          <span className="text-gray-400 text-xs">No Image</span>
                       )}
                    </div>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageChange} 
                      className="text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#4A3B32] file:text-white hover:file:bg-[#3A2E27] cursor-pointer"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-widest">Product Name</label>
                  <input required value={editingProduct ? editingProduct.name : newProduct.name} onChange={e => editingProduct ? setEditingProduct({...editingProduct, name: e.target.value}) : setNewProduct({...newProduct, name: e.target.value})} className="w-full border border-gray-200 p-3 rounded-md bg-gray-50 text-sm focus:outline-none focus:ring-1 focus:ring-brand-brown" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-widest">Price (₹)</label>
                    <input required type="number" value={editingProduct ? editingProduct.price : newProduct.price} onChange={e => editingProduct ? setEditingProduct({...editingProduct, price: e.target.value}) : setNewProduct({...newProduct, price: e.target.value})} className="w-full border border-gray-200 p-3 rounded-md bg-gray-50 text-sm focus:outline-none focus:ring-1 focus:ring-brand-brown" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-widest">Stock</label>
                    <input required type="number" value={editingProduct ? editingProduct.stock : newProduct.stock} onChange={e => editingProduct ? setEditingProduct({...editingProduct, stock: e.target.value}) : setNewProduct({...newProduct, stock: e.target.value})} className="w-full border border-gray-200 p-3 rounded-md bg-gray-50 text-sm focus:outline-none focus:ring-1 focus:ring-brand-brown" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-widest">Category</label>
                  <input required value={editingProduct ? editingProduct.category : newProduct.category} onChange={e => editingProduct ? setEditingProduct({...editingProduct, category: e.target.value}) : setNewProduct({...newProduct, category: e.target.value})} className="w-full border border-gray-200 p-3 rounded-md bg-gray-50 text-sm focus:outline-none focus:ring-1 focus:ring-brand-brown" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-widest">Description</label>
                  <textarea required rows="3" value={editingProduct ? editingProduct.description : newProduct.description} onChange={e => editingProduct ? setEditingProduct({...editingProduct, description: e.target.value}) : setNewProduct({...newProduct, description: e.target.value})} className="w-full border border-gray-200 p-3 rounded-md bg-gray-50 text-sm focus:outline-none focus:ring-1 focus:ring-brand-brown"></textarea>
                </div>
                
                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={isSaving} className="grow bg-[#4A3B32] hover:bg-[#3A2E27] transition-colors text-white py-3 rounded-md uppercase text-xs font-bold tracking-widest shadow-sm disabled:bg-gray-400">
                    {isSaving ? 'Uploading...' : (editingProduct ? 'Save Changes' : 'Publish SKU')}
                  </button>
                  {editingProduct && (
                    <button type="button" disabled={isSaving} onClick={() => setEditingProduct(null)} className="px-6 py-3 border border-gray-200 rounded-md text-xs uppercase font-bold text-gray-500 hover:bg-gray-50 transition-colors">
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* CATALOG LIST COLUMN */}
            <div className="xl:col-span-2 space-y-4">
              <h4 className="font-bold uppercase tracking-widest mb-6 text-[#4A3B32]">Live Catalog</h4>
              {adminProducts.map(p => (
                <div key={p.id} className={`flex flex-col sm:flex-row sm:items-center justify-between bg-white p-5 rounded-xl shadow-sm border border-gray-100 gap-4 transition-all duration-300 ${p.is_active ? '' : 'opacity-60 bg-gray-50 grayscale-30'}`}>
                  
                  <div className="flex items-center gap-5">
                    <img src={p.image_url} className="w-16 h-16 object-cover rounded-lg shadow-sm border border-gray-100" alt={p.name} />
                    <div>
                      <p className="font-bold text-sm text-[#2C2420]">
                        {p.name} 
                        {!p.is_active && <span className="ml-2 px-2 py-0.5 bg-gray-200 text-gray-600 rounded text-[10px] tracking-widest uppercase">Hidden</span>}
                      </p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1 mb-1">{p.category}</p>
                      <p className="text-sm text-green-700 font-bold">₹{p.price}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 border-t sm:border-t-0 sm:border-l border-gray-100 pt-4 sm:pt-0 sm:pl-4 justify-between sm:justify-end">
                    
                    {/* QUICK STOCK ADJUST */}
                    <div className="text-center">
                      <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Stock</label>
                      <input 
                        type="number" defaultValue={p.stock} 
                        onBlur={(e) => { if(Number(e.target.value) !== p.stock) updateProductQuick(p, 'stock', Number(e.target.value)) }} 
                        className="w-16 border border-gray-200 p-1.5 text-center text-sm font-bold bg-gray-50 rounded focus:outline-none focus:border-brand-brown" 
                      />
                    </div>

                    <div className="flex gap-2">
                      <button onClick={() => updateProductQuick(p, 'is_active', !p.is_active)} className={`p-2 rounded text-[10px] font-bold uppercase tracking-widest border transition-colors ${p.is_active ? 'border-yellow-200 text-yellow-700 hover:bg-yellow-50' : 'border-green-200 text-green-700 hover:bg-green-50'}`}>
                        {p.is_active ? 'Hide' : 'Show'}
                      </button>
                      <button onClick={() => setEditingProduct(p)} className="p-2 rounded text-[10px] font-bold uppercase tracking-widest border border-blue-200 text-blue-600 hover:bg-blue-50 transition-colors">
                        Edit
                      </button>
                      <button onClick={() => handleDeleteProduct(p.id)} className="p-2 rounded text-[10px] font-bold uppercase tracking-widest border border-red-200 text-red-600 hover:bg-red-50 transition-colors">
                        Del
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}