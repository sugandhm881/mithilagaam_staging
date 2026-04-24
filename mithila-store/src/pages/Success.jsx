import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

export default function Success() {
    useEffect(() => {
    document.title = "Order Confirmed | Mithila Gaam";
  }, []);
  const navigate = useNavigate();
  const location = useLocation();
  const orderId = location.state?.orderId;

  return (
    <div className="max-w-4xl mx-auto py-24 px-8 text-center flex flex-col items-center justify-center min-h-[70vh] bg-[#F9F8F4]">
      <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-8 shadow-sm">
        <svg fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-10 h-10">
          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
        </svg>
      </div>
      
      <h2 className="text-4xl md:text-5xl font-serif mb-4 text-[#2C2420]">Order Confirmed</h2>
      <p className="text-gray-500 uppercase tracking-[0.2em] text-xs font-bold mb-10">Thank you for trusting Mithila Gaam</p>

      {orderId && (
        <div className="bg-white border border-gray-200 p-8 rounded-2xl shadow-sm mb-12 w-full max-w-md">
          <p className="text-gray-400 text-[10px] uppercase font-bold tracking-widest mb-2">Your Order Reference</p>
          <p className="text-3xl font-serif text-[#4A3B32] font-bold">#{orderId}</p>
          <p className="text-xs text-gray-500 mt-4 leading-relaxed">
            Please save this ID. You can use it to track your order status on our website.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-lg">
        <button 
          onClick={() => navigate('/')} 
          className="bg-[#4A3B32] text-white px-8 py-4 uppercase tracking-widest text-xs font-bold hover:bg-[#3A2E27] transition-all rounded shadow-md"
        >
          Continue Shopping
        </button>
        <button 
          onClick={() => navigate('/track-order')} 
          className="border-2 border-[#4A3B32] text-[#4A3B32] px-8 py-4 uppercase tracking-widest text-xs font-bold hover:bg-[#4A3B32] hover:text-white transition-all rounded"
        >
          Track This Order
        </button>
      </div>
      
      <p className="mt-16 text-[10px] text-gray-400 uppercase tracking-widest font-bold">
        A confirmation email will be sent shortly.
      </p>
    </div>
  );
}