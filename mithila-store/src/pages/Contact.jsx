export default function Contact({ showToast }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would send this to a backend route or Formspree
    showToast("Message sent! We will get back to you within 24 hours.");
    e.target.reset();
  };

  return (
    <main className="bg-[#F9F8F4] min-h-[70vh]">
      <header className="bg-[#EFEBE4] py-20 text-center border-b border-gray-200 px-6">
        <h1 className="text-4xl md:text-5xl font-serif text-[#2C2420] mb-4">Get in Touch</h1>
        <p className="text-gray-600 uppercase tracking-widest text-sm font-bold">We would love to hear from you</p>
      </header>

      <section className="max-w-6xl mx-auto py-24 px-8 grid grid-cols-1 lg:grid-cols-2 gap-16">
        
        {/* Contact Info */}
        <div>
          <h2 className="text-3xl font-serif text-[#2C2420] mb-8">Reach Out Directly</h2>
          <p className="text-gray-600 mb-10 leading-relaxed">
            Whether you have a question about your order, want to inquire about bulk corporate gifting, or just want to say hello, our team is here for you.
          </p>
          
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="text-2xl">📍</div>
              <div>
                <h4 className="font-bold uppercase tracking-widest text-xs text-gray-500 mb-1">Corporate Office</h4>
                <p className="text-[#2C2420] font-bold">Mithila Heritage Food Pvt Ltd</p>
                <p className="text-sm text-gray-600">Darbhanga, Bihar - 847427, India</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="text-2xl">✉️</div>
              <div>
                <h4 className="font-bold uppercase tracking-widest text-xs text-gray-500 mb-1">Email Us</h4>
                <p className="text-[#2C2420] font-bold">support@mithilagaam.com</p>
                <p className="text-sm text-gray-600">Replies within 24 hours</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="text-2xl">💬</div>
              <div>
                <h4 className="font-bold uppercase tracking-widest text-xs text-gray-500 mb-1">Instant Support</h4>
                <a 
                  href="https://wa.me/919876543210" 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-block mt-2 bg-green-600 text-white px-6 py-2 rounded uppercase tracking-widest text-xs font-bold hover:bg-green-700 transition-colors"
                >
                  Chat on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-[#FDFBF7] p-10 rounded-2xl border border-gray-200 shadow-sm">
          <h3 className="font-bold uppercase tracking-widest text-[#4A3B32] mb-8 border-b border-gray-200 pb-4">Send a Message</h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-widest">First Name</label>
                <input required type="text" className="w-full border border-gray-300 p-3 rounded bg-white focus:outline-none focus:ring-2 focus:ring-[#4A3B32]" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-widest">Last Name</label>
                <input required type="text" className="w-full border border-gray-300 p-3 rounded bg-white focus:outline-none focus:ring-2 focus:ring-[#4A3B32]" />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-widest">Email Address</label>
              <input required type="email" className="w-full border border-gray-300 p-3 rounded bg-white focus:outline-none focus:ring-2 focus:ring-[#4A3B32]" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-widest">Message</label>
              <textarea required rows="4" className="w-full border border-gray-300 p-3 rounded bg-white focus:outline-none focus:ring-2 focus:ring-[#4A3B32]"></textarea>
            </div>
            <button type="submit" className="w-full bg-[#4A3B32] text-white py-4 rounded uppercase text-sm font-bold tracking-widest hover:bg-[#3A2E27] transition-all shadow-md">
              Send Message
            </button>
          </form>
        </div>

      </section>
    </main>
  );
}