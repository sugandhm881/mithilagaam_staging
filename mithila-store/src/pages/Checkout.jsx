import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config';

export default function Checkout({ cart, setCart, showToast }) {
    useEffect(() => {
    document.title = "Secure Checkout | Mithila Gaam";
  }, []);
  const navigate = useNavigate();
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [showUPI, setShowUPI] = useState(false);
  const [utr, setUtr] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [pincodeLoading, setPincodeLoading] = useState(false);
  // FIX: Flag to prevent the "empty cart" redirect from stealing the route
  const [orderSuccess, setOrderSuccess] = useState(false);
  
  const [formData, setFormData] = useState({ fname: '', lname: '', email: '', phone: '', street: '', pincode: '', city: '', state: '' });

  // FIX: Only redirect to cart if the cart is empty AND an order wasn't just placed
  useEffect(() => { 
    if (cart.length === 0 && !orderSuccess) {
      navigate('/cart'); 
    }
  }, [cart.length, navigate, orderSuccess]);

  if (cart.length === 0 && !orderSuccess) return null;

  const upiString = `upi://pay?pa=728980408@okaxis&pn=Mithila%20Heritage&am=${total}&cu=INR`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiString)}`;

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handlePincode = async (e) => {
    const pin = e.target.value.replace(/\D/g, '').slice(0, 6);
    setFormData(prev => ({ ...prev, pincode: pin, city: '', state: '' }));
    if (pin.length !== 6) return;

    setPincodeLoading(true);
    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
      const data = await res.json();
      const entry = Array.isArray(data) ? data[0] : null;
      const po = entry?.PostOffice?.[0];
      if (entry?.Status === "Success" && po) {
        setFormData(prev => ({ ...prev, city: po.District, state: po.State }));
      }
    } catch (err) {
      console.error("Pincode lookup failed:", err);
    } finally {
      setPincodeLoading(false);
    }
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (paymentMethod === 'UPI') setShowUPI(true);
    else placeOrder('COD', 'N/A', formData);
  };

  const handleUPIConfirm = (e) => {
    e.preventDefault();
    if (utr.trim().length < 12) {
      showToast("Please enter a valid 12-digit UTR number.");
      return;
    }
    placeOrder('UPI', utr, formData);
  };

  const placeOrder = async (method, utrNumber, finalCustomer) => {
    setIsProcessing(true);
    try {
      const response = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customer: finalCustomer, cart, total, paymentMethod: method, utr: utrNumber })
      });
      
      if (!response.ok) throw new Error('Order failed');

      const result = await response.json();
      const serverGeneratedId = result.orderId;

      // FIX: Tell the component the order succeeded so it doesn't bounce back to cart
      setOrderSuccess(true);
      setCart([]);
      
      // Use replace: true so the user can't hit the "back" button into a dead checkout
      navigate('/success', { state: { orderId: serverGeneratedId }, replace: true });
    } catch (error) {
      console.error("Checkout Error:", error);
      showToast("Error placing order. Please try again or contact support.");
      setIsProcessing(false);
    }
  };

  const inputClass = "w-full border border-gray-200 p-4 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4A3B32] focus:border-transparent transition-all shadow-sm text-sm font-medium text-[#2C2420]";

  return (
    <div className="min-h-screen bg-[#F9F8F4] py-16 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
        
        {/* FORM SECTION */}
        <div className="lg:col-span-3 animate-fade-in-up">
          {!showUPI ? (
            <div className="bg-white p-8 sm:p-12 rounded-3xl shadow-xl border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-[#4A3B32]"></div>
              <h2 className="text-3xl font-serif mb-8 border-b border-gray-100 pb-6 font-bold text-[#2C2420] tracking-tight">Shipping Details</h2>
              <form onSubmit={handleNextStep} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div><label className="block text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-widest">First Name</label><input name="fname" required value={formData.fname} onChange={handleInputChange} className={inputClass} placeholder="Jane" /></div>
                  <div><label className="block text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-widest">Last Name</label><input name="lname" required value={formData.lname} onChange={handleInputChange} className={inputClass} placeholder="Doe" /></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div><label className="block text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-widest">Email Address</label><input name="email" type="email" required value={formData.email} onChange={handleInputChange} className={inputClass} placeholder="jane@example.com" /></div>
                  <div><label className="block text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-widest">Phone Number</label><input name="phone" required type="tel" value={formData.phone} onChange={handleInputChange} className={inputClass} placeholder="9876543210" /></div>
                </div>
                
                <div className="border-t border-gray-100 pt-8 mt-4">
                  <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-[#8C7A6B] mb-6">Delivery Address</h3>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-widest">
                      Pincode {pincodeLoading && <span className="text-[#4A3B32] normal-case tracking-normal ml-2">looking up…</span>}
                    </label>
                    <input name="pincode" inputMode="numeric" maxLength="6" required value={formData.pincode} onChange={handlePincode} className={inputClass} placeholder="6 Digits" />
                  </div>
                  <div className="grid grid-cols-2 gap-6 mt-6">
                    <div><label className="block text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-widest">City</label><input name="city" required value={formData.city} onChange={handleInputChange} className={inputClass} placeholder="City" /></div>
                    <div><label className="block text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-widest">State</label><input name="state" required value={formData.state} onChange={handleInputChange} className={inputClass} placeholder="State" /></div>
                  </div>
                  <div className="mt-6"><label className="block text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-widest">Street Address / House No.</label><textarea name="street" required rows="2" value={formData.street} onChange={handleInputChange} className={`${inputClass} resize-none`} placeholder="Detailed address..."></textarea></div>
                </div>
                
                <div className="pt-8 border-t border-gray-100 mt-6">
                  <label className="block text-sm font-bold text-[#2C2420] mb-6 uppercase tracking-widest">Payment Method</label>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button type="button" onClick={() => setPaymentMethod('COD')} className={`flex-1 p-6 rounded-2xl border-2 transition-all font-bold tracking-widest uppercase text-[10px] outline-none ${paymentMethod === 'COD' ? 'border-[#4A3B32] bg-[#4A3B32] text-white shadow-lg' : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'}`}>Cash on Delivery</button>
                    <button type="button" onClick={() => setPaymentMethod('UPI')} className={`flex-1 p-6 rounded-2xl border-2 transition-all font-bold tracking-widest uppercase text-[10px] outline-none ${paymentMethod === 'UPI' ? 'border-green-600 bg-green-600 text-white shadow-lg' : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'}`}>Pay Securely via UPI</button>
                  </div>
                </div>

                <button type="submit" disabled={isProcessing} className="w-full bg-[#4A3B32] text-white py-6 tracking-[0.2em] uppercase text-xs font-bold hover:bg-[#3A2E27] active:scale-95 transition-all rounded-xl shadow-2xl mt-10 outline-none disabled:bg-gray-400 disabled:active:scale-100">
                  {isProcessing ? 'Processing...' : paymentMethod === 'UPI' ? `Proceed to UPI Gateway` : `Complete Order — ₹${total}`}
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-white p-8 sm:p-12 rounded-3xl shadow-xl border border-gray-100 text-center animate-fade-in-up relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1 bg-green-600"></div>
               <h2 className="text-3xl font-serif mb-3 text-[#2C2420] font-bold">Secure UPI Gateway</h2>
               <p className="text-gray-500 mb-10 tracking-widest text-xs font-medium">Scan using GPay, PhonePe, or Paytm to pay <b>₹{total}</b> to Mithila Heritage.</p>
               
               <div className="bg-[#F9F8F4] inline-block p-6 rounded-3xl shadow-inner mb-10 border border-gray-200">
                  <img src={qrCodeUrl} className="mx-auto w-56 h-56 rounded-xl" alt="UPI QR Code" />
               </div>
               
               <form onSubmit={handleUPIConfirm} className="space-y-6 max-w-sm mx-auto text-left">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-widest text-center">12-Digit UTR / Reference No.</label>
                    <input required type="text" maxLength="12" placeholder="e.g. 312345678901" value={utr} onChange={(e) => setUtr(e.target.value)} className={`${inputClass} font-mono tracking-[0.3em] text-center text-lg`} />
                  </div>
                  <button type="submit" disabled={isProcessing} className="w-full bg-green-600 text-white py-5 uppercase text-xs font-bold tracking-[0.2em] rounded-xl hover:bg-green-700 shadow-xl active:scale-95 transition-all outline-none disabled:bg-gray-400 disabled:active:scale-100">
                    {isProcessing ? 'Verifying Transaction...' : 'Verify & Place Order'}
                  </button>
                  <button type="button" onClick={() => setShowUPI(false)} className="w-full text-gray-400 py-3 uppercase text-[10px] font-bold tracking-widest hover:text-[#4A3B32] transition-colors outline-none">
                    ← Change Payment Method
                  </button>
               </form>
            </div>
          )}
        </div>

        {/* SUMMARY SECTION */}
        <div className="lg:col-span-2">
          <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-xl sticky top-32 border border-gray-100">
            <h2 className="text-lg font-serif uppercase tracking-widest font-bold mb-8 border-b border-gray-100 pb-4 text-[#2C2420]">Order Summary</h2>
            <div className="space-y-6 mb-8 max-h-[40vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200">
              {cart.map((item, i) => (
                <div key={i} className="flex gap-5 items-center">
                  <div className="relative shrink-0">
                    <img src={item.image_url} className="w-16 h-16 object-cover rounded-xl border border-gray-100 shadow-sm" alt={item.name} />
                    <span className="absolute -top-2 -right-2 bg-[#4A3B32] text-white w-6 h-6 flex items-center justify-center rounded-full text-[10px] font-bold shadow-md">{item.quantity}</span>
                  </div>
                  <div className="grow flex justify-between items-center text-sm text-[#2C2420]">
                    <span className="font-bold truncate max-w-30">{item.name}</span>
                    <span className="font-bold bg-gray-50 px-3 py-1 rounded-lg">₹{item.price * item.quantity}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center border-t border-gray-100 pt-8 text-2xl text-[#2C2420] font-bold font-serif">
              <span className="uppercase tracking-[0.2em] text-xs font-bold font-sans text-[#8C7A6B]">Total</span>
              <span>₹{total.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}