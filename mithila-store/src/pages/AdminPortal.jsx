/* eslint-disable no-unused-vars */
import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { API_URL } from '../config';

export default function AdminPortal({ refreshProducts }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authInput, setAuthInput] = useState('');
  const [token, setToken] = useState(sessionStorage.getItem('adminToken') || '');
  const [authError, setAuthError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [orders, setOrders] = useState([]);
  const [adminProducts, setAdminProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [orderFilter, setOrderFilter] = useState('All');

  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: '', price: '', description: '', image_url: '', image_base64: null,
    gallery_uploads: [], stock: 100, category: 'Makhana', benefits: 'Protein, Fiber, Low Fat'
  });

  const getHeaders = useCallback(() => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }), [token]);

  const handleLogout = useCallback(() => {
    sessionStorage.removeItem('adminToken');
    setToken('');
    setIsAuthenticated(false);
  }, []);

  const fetchAdminData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [ordersRes, productsRes] = await Promise.all([
        fetch(`${API_URL}/api/admin/orders`, { headers: getHeaders() }),
        fetch(`${API_URL}/api/admin/products`, { headers: getHeaders() })
      ]);

      if (ordersRes.status === 401 || productsRes.status === 401) {
        setAuthError('Session expired. Please log in again.');
        handleLogout();
        return;
      }

      const ordersData = await ordersRes.json();
      const productsData = await productsRes.json();
      setOrders(Array.isArray(ordersData) ? ordersData : []);
      setAdminProducts(Array.isArray(productsData) ? productsData : []);
      setIsAuthenticated(true);
    } catch (err) {
      console.error("Admin Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  }, [token, getHeaders, handleLogout]);

  useEffect(() => {
    if (token) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchAdminData();
    }
  }, [token, fetchAdminData]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    setIsLoggingIn(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: authInput })
      });
      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.message || 'Login failed.');
        return;
      }
      sessionStorage.setItem('adminToken', data.token);
      setToken(data.token);
      setAuthInput('');
    } catch (err) {
      console.error("Admin login error:", err);
      setAuthError('Network error. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const updateOrder = async (id, field, value) => {
    await fetch(`${API_URL}/api/admin/orders/${id}`, { 
      method: 'PATCH', 
      headers: getHeaders(), 
      body: JSON.stringify({ [field]: value }) 
    });
    setOrders(orders.map(o => o.order_id === id ? { ...o, [field]: value } : o));
  };

  const handleMainImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (editingProduct) setEditingProduct({ ...editingProduct, image_base64: reader.result, image_url: reader.result });
        else setNewProduct({ ...newProduct, image_base64: reader.result, image_url: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (editingProduct) {
          setEditingProduct(prev => ({ ...prev, gallery_uploads: [...(prev.gallery_uploads || []), reader.result] }));
        } else {
          setNewProduct(prev => ({ ...prev, gallery_uploads: [...(prev.gallery_uploads || []), reader.result] }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const isEdit = !!editingProduct;
    const target = isEdit ? editingProduct : newProduct;
    const url = isEdit ? `${API_URL}/api/admin/products/${editingProduct.id}` : `${API_URL}/api/admin/products`;

    const payload = {
      ...target,
      benefits: typeof target.benefits === 'string' ? target.benefits.split(',').map(b => b.trim()) : target.benefits
    };

    try {
      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: getHeaders(),
        body: JSON.stringify(payload)
      });

      const result = await res.json().catch(() => ({}));

      if (!res.ok) {
        const fieldErrors = result.errors ? Object.entries(result.errors).map(([k, v]) => `${k}: ${v.join(', ')}`).join('\n') : '';
        alert(`${result.message || 'Save failed.'}${fieldErrors ? '\n\n' + fieldErrors : ''}`);
        return;
      }

      if (result.galleryFailures) {
        alert(`Product saved, but ${result.galleryFailures} gallery image(s) failed to upload. Check server logs.`);
      }

      setEditingProduct(null);
      setNewProduct({ name: '', price: '', description: '', image_url: '', image_base64: null, gallery_uploads: [], stock: 100, category: 'Makhana', benefits: 'Protein, Fiber' });
      fetchAdminData();
      if (refreshProducts) refreshProducts();
    } catch (err) {
      console.error('Product submit error:', err);
      alert('Network error while saving. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const updateProductQuick = async (product, field, value) => {
    await fetch(`${API_URL}/api/admin/products/${product.id}`, { 
      method: 'PUT', 
      headers: getHeaders(), 
      body: JSON.stringify({ ...product, [field]: value }) 
    });
    fetchAdminData();
    if(refreshProducts) refreshProducts();
  };

  const handleDeleteProduct = async (id) => {
    if(window.confirm("Permanently delete this product?")) {
      await fetch(`${API_URL}/api/admin/products/${id}`, { method: 'DELETE', headers: getHeaders() });
      fetchAdminData();
      if(refreshProducts) refreshProducts();
    }
  };

  // --- UI: LUXURY LOGIN SCREEN ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9F8F4] relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#4A3B32]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-[#4A3B32]/10 rounded-full blur-3xl"></div>
        
        <form onSubmit={handleLogin} className="bg-white p-12 rounded-2xl shadow-2xl border border-gray-100 max-w-sm w-full text-center relative z-10 animate-fade-in-up">
          <div className="w-16 h-1 bg-[#4A3B32] mx-auto mb-6 rounded-full"></div>
          <h2 className="text-3xl font-serif text-[#2C2420] mb-2 uppercase tracking-widest font-bold">Admin Portal</h2>
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-10 font-bold">Mithila Heritage</p>
          
          {authError && <p className="text-red-500 text-[10px] font-bold mb-4 uppercase tracking-widest bg-red-50 py-2 rounded">{authError}</p>}
          
          <input 
            type="password" 
            placeholder="Enter Secure Token" 
            value={authInput} 
            onChange={e => setAuthInput(e.target.value)} 
            required 
            className="w-full border border-gray-200 bg-gray-50 p-4 rounded-xl mb-8 text-center tracking-[0.3em] font-mono outline-none focus:bg-white focus:ring-2 focus:ring-[#4A3B32] transition-all" 
          />
          <button 
            type="submit" 
            disabled={isLoggingIn} 
            className="w-full bg-[#4A3B32] text-white py-4 rounded-xl uppercase text-xs font-bold tracking-widest shadow-lg hover:shadow-xl hover:bg-[#3A2E27] active:scale-95 transition-all disabled:bg-gray-400 disabled:active:scale-100"
          >
            {isLoggingIn ? 'Authenticating...' : 'Unlock System'}
          </button>
        </form>
      </div>
    );
  }

  const filteredOrders = orders.filter(o => orderFilter === 'All' || o.status === orderFilter);
  const revenue = orders.filter(o => o.status !== 'Cancelled').reduce((sum, o) => sum + Number(o.total_amount || 0), 0);

  return (
    <div className="flex min-h-screen bg-[#F9F8F4] font-sans text-gray-800">
      
      {/* UI: PREMIUM SIDEBAR */}
      <aside className="hidden md:flex flex-col w-64 bg-[#2C2420] text-white p-8 shrink-0 shadow-2xl z-20">
        <h2 className="text-xl font-bold tracking-tighter mb-12 text-[#F9F8F4] uppercase bg-white/5 p-4 rounded-xl text-center border border-white/10 shadow-inner">
          Mithila Admin
        </h2>
        <nav className="space-y-3 grow">
          <button 
            onClick={() => setActiveTab('dashboard')} 
            className={`w-full text-left p-4 rounded-xl text-[10px] uppercase tracking-widest font-bold transition-all ${activeTab === 'dashboard' ? 'bg-[#4A3B32] shadow-md border-l-4 border-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
          >
            Orders Ledger
          </button>
          <button 
            onClick={() => setActiveTab('inventory')} 
            className={`w-full text-left p-4 rounded-xl text-[10px] uppercase tracking-widest font-bold transition-all ${activeTab === 'inventory' ? 'bg-[#4A3B32] shadow-md border-l-4 border-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
          >
            Catalog & Stock
          </button>
        </nav>
        <div className="border-t border-white/10 pt-6 space-y-4">
          <button onClick={handleLogout} className="w-full text-left text-[10px] text-red-400 hover:text-red-300 uppercase tracking-widest font-bold transition-colors">Lock System 🔒</button>
          <Link to="/" className="block w-full text-left text-[10px] text-gray-500 hover:text-white uppercase tracking-widest font-bold transition-colors">← Storefront</Link>
        </div>
      </aside>

      <main className="grow p-10 overflow-x-hidden relative">
        {loading ? (
          <div className="space-y-8 animate-pulse max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="h-32 bg-white border border-gray-100 rounded-2xl shadow-sm"></div>
              <div className="h-32 bg-white border border-gray-100 rounded-2xl shadow-sm"></div>
            </div>
            <div className="h-150 bg-white border border-gray-100 rounded-2xl shadow-sm"></div>
          </div>
        ) : activeTab === 'dashboard' ? (
          
          // UI: DASHBOARD TAB
          <section className="max-w-7xl mx-auto animate-fade-in-up">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              <div className="bg-white p-8 shadow-sm border border-gray-100 rounded-2xl relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-2">Net Revenue</p>
                <p className="text-4xl font-serif text-[#2C2420]">₹{revenue.toLocaleString()}</p>
              </div>
              <div className="bg-white p-8 shadow-sm border border-gray-100 rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#4A3B32]"></div>
                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-2">Total Orders</p>
                <p className="text-4xl font-serif text-[#2C2420]">{orders.length}</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gray-50/50 p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="uppercase tracking-widest text-sm font-bold text-[#2C2420]">Orders Ledger</h3>
                <select value={orderFilter} onChange={e => setOrderFilter(e.target.value)} className="text-[10px] border border-gray-200 p-2 rounded-lg font-bold uppercase tracking-widest outline-none bg-white focus:ring-2 focus:ring-[#4A3B32] transition-shadow cursor-pointer">
                  <option value="All">All Statuses</option><option value="Pending">Pending</option><option value="Shipped">Shipped</option><option value="Delivered">Delivered</option>
                </select>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-white text-[10px] uppercase tracking-widest text-gray-400 border-b border-gray-100">
                    <tr>
                      <th className="p-6 font-bold">Customer Info</th>
                      <th className="p-6 font-bold">Payment</th>
                      <th className="p-6 font-bold">Status & Tracking</th>
                      <th className="p-6 font-bold">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-xs">
                    {filteredOrders.map(o => (
                      <tr key={o.order_id} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="p-6">
                          <div className="font-bold text-[#2C2420] text-sm mb-1">#{o.order_id} - {o.first_name} {o.last_name}</div>
                          <div className="text-[10px] text-gray-500 max-w-62.5 truncate leading-relaxed">{o.address}</div>
                          <div className="text-[10px] text-gray-400 font-mono mt-1 bg-gray-100 inline-block px-2 py-0.5 rounded">{o.phone}</div>
                        </td>
                        <td className="p-6">
                          <div className="text-sm font-bold text-green-700 mb-1">₹{o.total_amount}</div>
                          <div className="text-[9px] uppercase font-bold text-gray-400 tracking-widest">{o.payment_method}</div>
                        </td>
                        <td className="p-6">
                          <span className={`px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest inline-block mb-3
                            ${o.status === 'Delivered' ? 'bg-green-100 text-green-800 border border-green-200' : 
                              o.status === 'Shipped' ? 'bg-blue-100 text-blue-800 border border-blue-200' : 
                              o.status === 'Cancelled' ? 'bg-red-100 text-red-800 border border-red-200' : 
                              'bg-yellow-100 text-yellow-800 border border-yellow-200'}`}>
                            {o.status}
                          </span>
                          {o.status !== 'Delivered' && o.status !== 'Cancelled' && (
                            <input 
                              type="text" 
                              placeholder="Add Tracking URL..." 
                              defaultValue={o.tracking_url || ''} 
                              onBlur={(e) => updateOrder(o.order_id, 'tracking_url', e.target.value)} 
                              className="block w-full border border-gray-200 p-2.5 rounded-lg text-[10px] outline-none bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#4A3B32] transition-all" 
                            />
                          )}
                        </td>
                        <td className="p-6">
                          {(o.status === 'Delivered' || o.status === 'Cancelled') ? (
                            <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400 italic bg-gray-100 px-3 py-2 rounded-lg">Locked</span>
                          ) : (
                            <select 
                              value={o.status} 
                              onChange={(e) => updateOrder(o.order_id, 'status', e.target.value)} 
                              className="border border-gray-200 p-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest outline-none bg-white focus:ring-2 focus:ring-[#4A3B32] cursor-pointer transition-shadow"
                            >
                              <option value="Pending">Pending</option><option value="Shipped">Shipped</option><option value="Delivered">Delivered</option><option value="Cancelled">Cancelled</option>
                            </select>
                          )}
                        </td>
                      </tr>
                    ))}
                    {filteredOrders.length === 0 && (
                      <tr><td colSpan="4" className="p-12 text-center text-gray-400 font-bold uppercase tracking-widest">No orders found matching criteria.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

        ) : (
          
          // UI: INVENTORY TAB
          <section className="grid grid-cols-1 xl:grid-cols-3 gap-10 max-w-7xl mx-auto animate-fade-in-up">
            
            {/* INVENTORY FORM */}
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm h-fit xl:sticky xl:top-10">
              <h4 className="font-bold uppercase tracking-widest mb-8 border-b border-gray-100 pb-4 text-[#4A3B32] text-sm">
                {editingProduct ? 'Edit SKU' : 'Create SKU'}
              </h4>
              <form onSubmit={handleProductSubmit} className="space-y-6">
                
                {/* Main Image Dropzone */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-widest">Main Showcase Photo</label>
                  <div className="flex items-center gap-4 p-4 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="w-16 h-16 bg-white border border-gray-200 rounded-lg flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                      {(editingProduct?.image_url || newProduct?.image_url) ? <img src={editingProduct ? editingProduct.image_url : newProduct.image_url} className="w-full h-full object-cover" alt="Preview" /> : <span className="text-[10px] text-gray-400 font-bold">IMG</span>}
                    </div>
                    <input type="file" accept="image/*" onChange={handleMainImage} className="text-[10px] text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:bg-[#4A3B32] file:text-white cursor-pointer" />
                  </div>
                </div>

                {/* Gallery Dropzone */}
                <div>
                  <label className="block text-[10px] font-bold text-[#4A3B32] mb-2 uppercase tracking-widest">Gallery Multi-Upload</label>
                  <div className="p-4 border-2 border-dashed border-[#4A3B32]/20 rounded-xl bg-[#4A3B32]/5 hover:bg-[#4A3B32]/10 transition-colors">
                    <input type="file" multiple accept="image/*" onChange={handleGalleryChange} className="text-[10px] text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:bg-[#4A3B32] file:text-white cursor-pointer w-full" />
                    <div className="flex gap-2 mt-4 flex-wrap">
                      {(editingProduct?.gallery_uploads || newProduct?.gallery_uploads || []).map((img, i) => (
                        <img key={i} src={img} alt="Gallery thumb" className="w-10 h-10 object-cover rounded-lg border border-gray-200 shadow-sm" />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Text Inputs */}
                <div className="space-y-4">
                  <input required placeholder="Product Name" value={editingProduct ? editingProduct.name : newProduct.name} onChange={e => editingProduct ? setEditingProduct({...editingProduct, name: e.target.value}) : setNewProduct({...newProduct, name: e.target.value})} className="w-full border border-gray-200 bg-gray-50 p-3 rounded-xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-[#4A3B32] transition-all" />
                  <div className="grid grid-cols-2 gap-4">
                    <input required type="number" placeholder="Price (₹)" value={editingProduct ? editingProduct.price : newProduct.price} onChange={e => editingProduct ? setEditingProduct({...editingProduct, price: e.target.value}) : setNewProduct({...newProduct, price: e.target.value})} className="w-full border border-gray-200 bg-gray-50 p-3 rounded-xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-[#4A3B32] transition-all" />
                    <input required type="number" placeholder="Stock Qty" value={editingProduct ? editingProduct.stock : newProduct.stock} onChange={e => editingProduct ? setEditingProduct({...editingProduct, stock: e.target.value}) : setNewProduct({...newProduct, stock: e.target.value})} className="w-full border border-gray-200 bg-gray-50 p-3 rounded-xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-[#4A3B32] transition-all" />
                  </div>
                  <input placeholder="Benefits (Comma separated)" value={editingProduct ? editingProduct.benefits : newProduct.benefits} onChange={e => editingProduct ? setEditingProduct({...editingProduct, benefits: e.target.value}) : setNewProduct({...newProduct, benefits: e.target.value})} className="w-full border border-gray-200 bg-gray-50 p-3 rounded-xl text-xs outline-none focus:bg-white focus:ring-2 focus:ring-[#4A3B32] transition-all" />
                  <textarea required placeholder="Detailed Description" rows="4" value={editingProduct ? editingProduct.description : newProduct.description} onChange={e => editingProduct ? setEditingProduct({...editingProduct, description: e.target.value}) : setNewProduct({...newProduct, description: e.target.value})} className="w-full border border-gray-200 bg-gray-50 p-3 rounded-xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-[#4A3B32] transition-all resize-none"></textarea>
                </div>

                <div className="pt-2">
                  <button type="submit" disabled={isSaving} className="w-full bg-[#4A3B32] text-white py-4 rounded-xl uppercase text-[10px] font-bold tracking-widest shadow-lg hover:shadow-xl hover:bg-[#3A2E27] active:scale-95 transition-all disabled:bg-gray-400 disabled:active:scale-100">
                    {isSaving ? 'Processing Uploads...' : 'Save Product SKU'}
                  </button>
                  {editingProduct && (
                    <button type="button" onClick={() => setEditingProduct(null)} className="w-full text-gray-500 py-3 mt-2 text-[10px] uppercase font-bold tracking-widest hover:text-[#2C2420] transition-colors rounded-xl hover:bg-gray-50">
                      Cancel Editing
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* LIVE PRODUCT LIST */}
            <div className="xl:col-span-2 space-y-4">
               {adminProducts.map(p => (
                 <div key={p.id} className={`flex items-center justify-between bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group ${p.is_active ? '' : 'opacity-50 grayscale bg-gray-50'}`}>
                    
                    {/* Visual Section: Main Image + Thumbnails */}
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-3">
                        <div className="relative shrink-0">
                          <img src={p.image_url} alt={p.name} className="w-16 h-16 object-cover rounded-xl shadow-sm border border-gray-100 group-hover:scale-105 transition-transform" />
                          {!p.is_active && <span className="absolute -top-2 -right-2 bg-gray-500 text-white text-[8px] px-2 py-1 rounded-full uppercase font-bold tracking-widest shadow-sm">Hidden</span>}
                        </div>
                        
                        {/* Gallery Thumbnails Next to Main Image */}
                        {p.image_gallery && p.image_gallery.length > 0 && (
                          <div className="hidden sm:flex gap-1.5 pl-3 ml-1 border-l border-gray-100">
                            {p.image_gallery.slice(0, 3).map((gImg, idx) => (
                              <img key={idx} src={gImg} className="w-8 h-8 object-cover rounded-md border border-gray-200 shadow-sm" alt="gallery" />
                            ))}
                            {p.image_gallery.length > 3 && (
                              <div className="w-8 h-8 rounded-md bg-gray-50 border border-gray-200 flex items-center justify-center text-[9px] text-gray-500 font-bold shadow-sm">
                                +{p.image_gallery.length - 3}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Info Section */}
                      <div className="ml-2">
                        <p className="font-bold text-sm text-[#2C2420] mb-1">{p.name}</p>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] text-green-700 font-bold bg-green-50 px-2 py-0.5 rounded-md">₹{p.price}</span>
                          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Stock: {p.stock}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-3">
                      <div className="flex gap-2">
                        <button onClick={() => updateProductQuick(p, 'is_active', !p.is_active)} className="px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200 text-[9px] font-bold text-gray-600 uppercase tracking-widest hover:bg-gray-100 transition-colors">
                          {p.is_active ? 'Hide' : 'Show'}
                        </button>
                        <button onClick={() => setEditingProduct({...p, benefits: Array.isArray(p.benefits) ? p.benefits.join(', ') : p.benefits})} className="px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-100 text-[9px] font-bold text-blue-700 uppercase tracking-widest hover:bg-blue-100 transition-colors">
                          Edit
                        </button>
                        <button onClick={() => {if(window.confirm("Permanently delete?")) fetch(`${API_URL}/api/admin/products/${p.id}`, {method:'DELETE', headers:getHeaders()}).then(()=>fetchAdminData())}} className="px-3 py-1.5 rounded-lg bg-red-50 border border-red-100 text-[9px] font-bold text-red-700 uppercase tracking-widest hover:bg-red-100 transition-colors">
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