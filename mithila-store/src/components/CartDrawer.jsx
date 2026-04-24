import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const FREE_SHIPPING_THRESHOLD = 499;

export default function CartDrawer({ open, onClose, cart, updateQuantity, removeFromCart }) {
  const navigate = useNavigate();
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - total);
  const progress = Math.min(100, (total / FREE_SHIPPING_THRESHOLD) * 100);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  const goToCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  const goToFullCart = () => {
    onClose();
    navigate('/cart');
  };

  return (
    <>
      {/* Backdrop Overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity duration-500 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      />
      
      {/* Slide-out Drawer */}
      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-[#F9F8F4] shadow-2xl z-50 flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${open ? 'translate-x-0' : 'translate-x-full'}`}
        aria-hidden={!open}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-200 bg-white shrink-0">
          <h3 className="font-serif text-2xl text-[#2C2420] tracking-tight font-bold">Your Basket</h3>
          <button
            onClick={onClose}
            aria-label="Close cart"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 hover:bg-[#4A3B32] hover:text-white transition-colors text-gray-500 outline-none"
          >
            <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Free Shipping Tracker */}
        {cart.length > 0 && (
          <div className="px-8 py-5 bg-white border-b border-gray-100 shrink-0">
            {remaining > 0 ? (
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#4A3B32] mb-3">
                Add <span className="text-green-700 bg-green-50 px-1.5 py-0.5 rounded">₹{remaining}</span> more for <span className="text-green-700">Free Shipping</span>
              </p>
            ) : (
              <p className="text-[10px] font-bold uppercase tracking-widest text-green-700 mb-3 flex items-center gap-2">
                <span className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center text-[8px]">✓</span> 
                You've unlocked free shipping!
              </p>
            )}
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#4A3B32] transition-all duration-1000 ease-out relative"
                style={{ width: `${progress}%` }}
              >
                {/* Shimmer effect */}
                <div className="absolute top-0 left-0 w-full h-full bg-white/20 -translate-x-full animate-[shimmer_2s_infinite]"></div>
              </div>
            </div>
          </div>
        )}

        {/* Cart Items List */}
        <div className="grow overflow-y-auto px-6 py-6 scrollbar-thin scrollbar-thumb-gray-200">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center animate-fade-in-up">
              <div className="w-20 h-20 bg-[#4A3B32]/5 rounded-full flex items-center justify-center mb-6">
                <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-[#4A3B32]/40">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
              </div>
              <p className="text-[#8C7A6B] text-[10px] uppercase font-bold tracking-[0.3em] mb-8">Your basket is empty</p>
              <button
                onClick={onClose}
                className="bg-[#4A3B32] text-white px-10 py-4 uppercase tracking-widest text-xs font-bold hover:bg-[#3A2E27] active:scale-95 rounded-xl shadow-xl transition-all outline-none"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map(item => (
                <div key={item.id} className="flex gap-5 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm group">
                  <img src={item.image_url} alt={item.name} className="w-20 h-20 object-cover rounded-xl border border-gray-50 shrink-0" />
                  
                  <div className="grow min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-1">
                        <p className="font-bold text-sm text-[#2C2420] truncate pr-2 font-serif">{item.name}</p>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          aria-label="Remove"
                          className="text-gray-300 hover:text-red-500 transition-colors outline-none shrink-0"
                        >
                          <svg fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-[#8C7A6B] font-bold">₹{item.price}</p>
                    </div>
                    
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50 h-8">
                        <button onClick={() => updateQuantity(item.id, -1)} className="w-8 h-full text-gray-500 font-bold hover:bg-[#F9F8F4] transition-colors outline-none rounded-l-lg">−</button>
                        <span className="w-8 text-xs font-bold text-center border-x border-gray-200 bg-white h-full flex items-center justify-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="w-8 h-full text-gray-500 font-bold hover:bg-[#F9F8F4] transition-colors outline-none rounded-r-lg">+</button>
                      </div>
                      <p className="font-bold text-[#4A3B32] text-sm">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Checkout Area */}
        {cart.length > 0 && (
          <div className="bg-white border-t border-gray-100 px-8 py-6 shrink-0 shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.1)]">
            <div className="flex justify-between items-end mb-6">
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500">Estimated Total</span>
              <span className="text-3xl font-bold text-[#2C2420] font-serif">₹{total.toLocaleString('en-IN')}</span>
            </div>
            
            <button
              onClick={goToCheckout}
              className="w-full bg-[#4A3B32] text-white py-5 tracking-[0.2em] uppercase text-xs font-bold hover:bg-[#3A2E27] active:scale-95 transition-all rounded-xl shadow-xl outline-none flex justify-center items-center gap-2 mb-4"
            >
              Secure Checkout
              <svg fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </button>
            
            <button
              onClick={goToFullCart}
              className="w-full text-[#8C7A6B] text-[10px] tracking-[0.2em] uppercase font-bold hover:text-[#2C2420] transition-colors outline-none py-2"
            >
              Review Full Basket
            </button>
          </div>
        )}
      </aside>
    </>
  );
}