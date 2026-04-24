import { useState } from 'react';
import { API_URL } from '../config';

export default function TrackOrder() {
  const [orderId, setOrderId] = useState('');
  const [phone, setPhone] = useState('');
  const [orderData, setOrderData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTrack = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setOrderData(null);

    // FIX: Automatically strip spaces and dashes before sending to the strict backend
    const cleanPhone = phone.replace(/\D/g, '');
    const cleanId = orderId.replace(/\D/g, '');

    if (cleanPhone.length !== 10) {
      setError('Please enter a valid 10-digit phone number.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/orders/track?id=${cleanId}&phone=${cleanPhone}`);
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.message || 'Order not found.');
      
      setOrderData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // UX UPGRADE: Helper to determine timeline progress
  const getStepStatus = (stepName) => {
    if (!orderData) return 'upcoming';
    const status = orderData.status;
    
    if (status === 'Cancelled') return 'cancelled';
    
    if (stepName === 'Placed') return 'completed';
    if (stepName === 'Shipped') {
      return (status === 'Shipped' || status === 'Delivered') ? 'completed' : 'upcoming';
    }
    if (stepName === 'Delivered') {
      return status === 'Delivered' ? 'completed' : 'upcoming';
    }
    return 'upcoming';
  };

  return (
    <main className="bg-[#F9F8F4] min-h-[75vh] py-24 px-6 flex flex-col items-center">
      <div className="max-w-2xl w-full animate-fade-in-up">
        
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif text-[#2C2420] mb-4">Track Your Harvest</h1>
          <p className="text-[#8C7A6B] uppercase tracking-[0.2em] text-xs font-bold">Follow your order's journey</p>
        </div>

        {/* Premium Tracking Form */}
        <form onSubmit={handleTrack} className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-gray-100 mb-10 relative overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 relative z-10">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 mb-3 uppercase tracking-widest">Order Reference ID</label>
              <input 
                required 
                type="text" 
                placeholder="e.g. 1042" 
                value={orderId} 
                onChange={e => setOrderId(e.target.value)} 
                className="w-full border border-gray-200 p-4 rounded-xl bg-gray-50 text-sm font-bold text-[#2C2420] focus:bg-white focus:ring-2 focus:ring-[#4A3B32] outline-none transition-all" 
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 mb-3 uppercase tracking-widest">Registered Phone</label>
              <input 
                required 
                type="tel" 
                placeholder="e.g. 98765 43210" 
                value={phone} 
                onChange={e => setPhone(e.target.value)} 
                className="w-full border border-gray-200 p-4 rounded-xl bg-gray-50 text-sm font-bold text-[#2C2420] focus:bg-white focus:ring-2 focus:ring-[#4A3B32] outline-none transition-all" 
              />
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-[#4A3B32] text-white py-5 rounded-xl uppercase font-bold tracking-[0.2em] text-xs shadow-lg hover:shadow-xl hover:bg-[#3A2E27] transition-all active:scale-95 disabled:bg-gray-300 disabled:text-gray-500 disabled:active:scale-100"
          >
            {loading ? 'Locating Order...' : 'Check Live Status'}
          </button>

          {error && (
            <div className="mt-6 p-4 bg-red-50 rounded-xl border border-red-100 flex items-center gap-3">
              <span className="text-red-500 font-bold">!</span>
              <p className="text-red-700 text-xs font-bold uppercase tracking-widest">{error}</p>
            </div>
          )}
        </form>

        {/* Visual Timeline Results */}
        {orderData && (
          <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-gray-100 animate-fade-in-up">
            
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start border-b border-gray-100 pb-8 mb-12">
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2">Order Confirmed</p>
                <h3 className="text-3xl font-serif text-[#2C2420]">#{orderData.order_id}</h3>
              </div>
              <div className="mt-4 sm:mt-0 sm:text-right">
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2">Total Amount</p>
                <p className="text-xl font-bold text-[#4A3B32]">₹{orderData.total_amount}</p>
              </div>
            </div>

            {orderData.status !== 'Cancelled' ? (
              <div className="relative mb-12 px-4 sm:px-10">
                {/* Connecting Line Base */}
                <div className="absolute top-5 left-10 right-10 h-1 bg-gray-100 rounded-full z-0 hidden sm:block"></div>
                {/* Connecting Line Active */}
                <div 
                  className="absolute top-5 left-10 h-1 bg-[#4A3B32] rounded-full z-0 transition-all duration-1000 hidden sm:block"
                  style={{ width: orderData.status === 'Delivered' ? 'calc(100% - 5rem)' : orderData.status === 'Shipped' ? '50%' : '0%' }}
                ></div>

                <div className="flex flex-col sm:flex-row justify-between relative z-10 gap-8 sm:gap-0">
                  {/* Step 1 */}
                  <div className="flex sm:flex-col items-center gap-4 sm:gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#4A3B32] text-white flex items-center justify-center font-bold shadow-md border-4 border-white shrink-0">✓</div>
                    <span className="text-[10px] uppercase font-bold text-[#2C2420] tracking-widest sm:text-center">Order<br className="hidden sm:block"/>Placed</span>
                  </div>

                  {/* Step 2 */}
                  <div className="flex sm:flex-col items-center gap-4 sm:gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-4 border-white transition-colors duration-500 shrink-0
                      ${getStepStatus('Shipped') === 'completed' ? 'bg-[#4A3B32] text-white shadow-md' : 'bg-gray-100 text-gray-400'}`}>
                      {getStepStatus('Shipped') === 'completed' ? '✓' : '2'}
                    </div>
                    <span className={`text-[10px] uppercase font-bold tracking-widest sm:text-center ${getStepStatus('Shipped') === 'completed' ? 'text-[#2C2420]' : 'text-gray-400'}`}>In<br className="hidden sm:block"/>Transit</span>
                  </div>

                  {/* Step 3 */}
                  <div className="flex sm:flex-col items-center gap-4 sm:gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-4 border-white transition-colors duration-500 shrink-0
                      ${getStepStatus('Delivered') === 'completed' ? 'bg-green-600 text-white shadow-md' : 'bg-gray-100 text-gray-400'}`}>
                      {getStepStatus('Delivered') === 'completed' ? '✓' : '3'}
                    </div>
                    <span className={`text-[10px] uppercase font-bold tracking-widest sm:text-center ${getStepStatus('Delivered') === 'completed' ? 'text-green-700' : 'text-gray-400'}`}>Delivered<br className="hidden sm:block"/>Safely</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-red-50 p-6 rounded-2xl border border-red-100 text-center mb-10">
                <p className="text-red-700 font-bold uppercase tracking-widest text-sm">Order Cancelled</p>
                <p className="text-red-500 text-xs mt-2">This order has been voided. Please contact support if you need assistance.</p>
              </div>
            )}

            {orderData.tracking_url && orderData.status !== 'Cancelled' && (
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] text-[#8C7A6B] font-bold uppercase tracking-widest mb-1">Logistics Partner</p>
                  <p className="text-sm text-gray-600">Your harvest is on its way.</p>
                </div>
                <a 
                  href={orderData.tracking_url} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="w-full sm:w-auto bg-white border border-[#4A3B32] text-[#4A3B32] px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#4A3B32] hover:text-white transition-colors shadow-sm text-center"
                >
                  Track Package →
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}