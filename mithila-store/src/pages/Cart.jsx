/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FREE_SHIPPING_THRESHOLD } from '../components/CartDrawer';


export default function Cart({ cart, updateQuantity, removeFromCart }) {
    useEffect(() => {
    document.title = "Your Basket | Mithila Gaam";
  }, []);
  const navigate = useNavigate();
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - total);
  const progress = Math.min(100, (total / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <div className="bg-[#F9F8F4] min-h-screen py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl tracking-tight mb-12 text-[#2C2420] font-serif border-b border-gray-200 pb-6">Your Harvest Basket</h2>
        
        {cart.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center">
            <div className="w-24 h-24 bg-[#4A3B32]/5 rounded-full flex items-center justify-center mb-8">
              <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-[#4A3B32]/30">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
            </div>
            <p className="text-[#8C7A6B] mb-10 text-[10px] uppercase font-bold tracking-[0.3em]">Your basket is currently empty.</p>
            <button onClick={() => navigate('/')} className="bg-[#4A3B32] text-white px-12 py-5 tracking-[0.2em] uppercase text-xs font-bold hover:bg-[#3A2E27] hover:-translate-y-1 transition-all active:scale-95 rounded-xl shadow-xl outline-none">
              Explore Our Catalog
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
            
            {/* CART ITEMS */}
            <div className="lg:col-span-2 space-y-6">
              {cart.map((item) => (
                <div key={item.id} className="flex flex-col sm:flex-row items-center bg-white p-6 rounded-3xl shadow-sm border border-gray-100 gap-8 transition-all hover:shadow-md group">
                  <img src={item.image_url || 'https://via.placeholder.com/100'} alt={item.name} className="w-32 h-32 object-cover rounded-2xl shadow-sm border border-gray-50 group-hover:scale-105 transition-transform duration-500 shrink-0" />
                  
                  <div className="grow text-center sm:text-left w-full sm:w-auto">
                    <span className="text-[9px] text-[#8C7A6B] uppercase tracking-[0.3em] font-bold mb-1 block">{item.category || 'Makhana'}</span>
                    <h3 className="font-bold text-2xl text-[#2C2420] mb-2 font-serif">{item.name}</h3>
                    <p className="text-[#4A3B32] font-bold text-lg">₹{item.price.toLocaleString('en-IN')}</p>
                  </div>
                  
                  <div className="flex flex-col items-center sm:items-end gap-5 shrink-0 w-full sm:w-auto">
                    <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm h-12">
                      <button onClick={() => updateQuantity(item.id, -1)} className="w-12 h-full hover:bg-[#F9F8F4] transition-colors text-lg font-bold text-[#4A3B32] outline-none">−</button>
                      <span className="w-12 font-bold font-mono text-[#2C2420] border-x border-gray-200 h-full flex items-center justify-center bg-gray-50/50 text-sm">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="w-12 h-full hover:bg-[#F9F8F4] transition-colors text-lg font-bold text-[#4A3B32] outline-none">+</button>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600 text-[10px] tracking-[0.2em] uppercase font-bold transition-colors outline-none pb-1 border-b border-transparent hover:border-red-600">
                      Remove Item
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {/* SUMMARY SIDEBAR */}
            <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-gray-100 h-fit lg:sticky lg:top-32 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-[#4A3B32]"></div>
              <h3 className="text-sm font-bold uppercase tracking-[0.2em] mb-8 border-b border-gray-100 pb-4 text-[#8C7A6B]">Basket Summary</h3>

              {/* Elegant Free Shipping Progress */}
              <div className="mb-8 bg-[#F9F8F4] p-5 rounded-2xl border border-[#4A3B32]/10 relative overflow-hidden">
                {remaining > 0 ? (
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#4A3B32] mb-4 text-center">
                    Add <span className="text-green-700 bg-green-100/50 px-2 py-0.5 rounded">₹{remaining}</span> more for Free Shipping
                  </p>
                ) : (
                  <p className="text-[10px] font-bold uppercase tracking-widest text-green-700 mb-4 text-center flex justify-center items-center gap-2">
                    <span className="w-4 h-4 bg-green-200 text-green-800 rounded-full flex items-center justify-center">✓</span> You've unlocked free shipping
                  </p>
                )}
                <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#4A3B32] transition-all duration-1000 ease-out relative"
                    style={{ width: `${progress}%` }}
                  >
                    {/* Shimmer effect for progress bar */}
                    <div className="absolute top-0 left-0 w-full h-full bg-white/20 -translate-x-full animate-[shimmer_2s_infinite]"></div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center mb-5 text-gray-600 text-sm font-medium">
                <span>Subtotal</span>
                <span className="font-bold text-[#2C2420]">₹{total.toLocaleString('en-IN')}</span>
              </div>
              
              <div className="flex justify-between items-center mb-8 text-gray-600 text-sm font-medium">
                <span>Shipping Estimate</span>
                <span className={`font-bold uppercase tracking-widest text-[10px] px-2 py-1 rounded-md ${remaining > 0 ? 'bg-gray-100 text-gray-500' : 'bg-green-50 text-green-700 border border-green-100'}`}>
                  {remaining > 0 ? 'Calculated next' : 'Complimentary'}
                </span>
              </div>
              
              <div className="flex justify-between items-center mb-8 text-3xl font-bold text-[#2C2420] font-serif border-t border-gray-100 pt-8">
                <span>Total</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
              </div>
              
              <button onClick={() => navigate('/checkout')} className="w-full bg-[#4A3B32] text-white py-5 tracking-[0.2em] uppercase text-xs font-bold hover:bg-[#3A2E27] active:scale-95 transition-all rounded-xl shadow-xl flex justify-center items-center gap-3 outline-none">
                <span>Proceed to Checkout</span>
                <svg fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}