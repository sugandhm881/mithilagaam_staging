import { Link } from 'react-router-dom';

export default function Home({ addToCart, products, loading }) {
  return (
    <main className="overflow-x-hidden bg-[#F9F8F4] selection:bg-[#4A3B32] selection:text-white">
      
      {/* 1. ELEGANT SPLIT-SCREEN HERO BANNER */}
      <section className="relative py-20 md:py-32 px-6 max-w-7xl mx-auto flex flex-col-reverse lg:flex-row items-center gap-16 border-b border-gray-200/60">
        
        {/* Background decorative blur */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#4A3B32]/5 rounded-full blur-3xl -z-10"></div>
        
        <div className="w-full lg:w-1/2 text-center lg:text-left flex flex-col justify-center animate-fade-in-up">
          <div className="flex items-center justify-center lg:justify-start gap-4 mb-8">
            <div className="w-12 h-0.5 bg-[#8C7A6B]"></div>
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#8C7A6B] font-bold">Harvested in Bihar</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl mb-8 text-[#2C2420] font-serif leading-[1.1] tracking-tight">
            Authentic Taste <br/> 
            <span className="italic font-light text-[#4A3B32]">Of Mithila.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 mb-12 leading-relaxed max-w-lg mx-auto lg:mx-0 font-medium">
            Premium quality Phool Makhana, hand-harvested from the pristine ponds of Mithila and gently roasted to preserve nature's finest crunch.
          </p>
          
          <div>
            <a href="#shop" className="inline-flex items-center gap-4 bg-[#4A3B32] text-white px-12 py-5 tracking-[0.2em] uppercase text-xs font-bold hover:bg-[#3A2E27] transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 rounded-xl outline-none group">
              Explore The Harvest
              <svg fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 group-hover:translate-x-1 transition-transform">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </a>
          </div>
        </div>
        
        <div className="w-full lg:w-1/2 relative">
          <div className="aspect-square md:aspect-4/3 rounded-3xl overflow-hidden shadow-2xl relative group border-4 border-white">
            <img 
              src="https://cdn.pixabay.com/photo/2026/01/27/04/33/asia-10089951_1280.jpg?w=1200" 
              alt="Premium Makhana" 
              className="w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-105" 
            />
            {/* Subtle inner shadow overlay for depth */}
            <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-3xl"></div>
          </div>
          {/* Decorative Badge */}
          <div className="absolute -bottom-6 -left-6 md:-left-10 bg-white p-6 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-4 animate-bounce-slow">
            <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-700">
              <svg fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
              </svg>
            </div>
            <div>
              <p className="text-[#2C2420] font-bold text-sm font-serif">100% Export Quality</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Verified Grade A</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. D2C TRUST STRIP (Upgraded with SVGs instead of Emojis) */}
      <section className="bg-white py-16 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center divide-y md:divide-y-0 md:divide-x divide-gray-100">
          <div className="pt-8 md:pt-0 px-6 flex flex-col items-center group">
            <div className="w-16 h-16 rounded-full bg-[#F9F8F4] flex items-center justify-center text-[#4A3B32] mb-6 group-hover:scale-110 transition-transform duration-500">
              <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.866 8.21 8.21 0 003 2.48z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
              </svg>
            </div>
            <h4 className="font-bold uppercase tracking-[0.2em] text-xs mb-3 text-[#2C2420]">100% Organic Origin</h4>
            <p className="text-sm text-gray-500 leading-relaxed font-medium">Cultivated naturally in the pristine wetlands of Bihar.</p>
          </div>
          
          <div className="pt-8 md:pt-0 px-6 flex flex-col items-center group">
            <div className="w-16 h-16 rounded-full bg-[#F9F8F4] flex items-center justify-center text-[#4A3B32] mb-6 group-hover:scale-110 transition-transform duration-500">
              <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
              </svg>
            </div>
            <h4 className="font-bold uppercase tracking-[0.2em] text-xs mb-3 text-[#2C2420]">Direct From Farmers</h4>
            <p className="text-sm text-gray-500 leading-relaxed font-medium">Bypassing middlemen to ensure fair trade and pure freshness.</p>
          </div>

          <div className="pt-8 md:pt-0 px-6 flex flex-col items-center group">
            <div className="w-16 h-16 rounded-full bg-[#F9F8F4] flex items-center justify-center text-[#4A3B32] mb-6 group-hover:scale-110 transition-transform duration-500">
              <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
              </svg>
            </div>
            <h4 className="font-bold uppercase tracking-[0.2em] text-xs mb-3 text-[#2C2420]">Premium Sorting</h4>
            <p className="text-sm text-gray-500 leading-relaxed font-medium">Double hand-sorted to guarantee the perfect size and crunch.</p>
          </div>
        </div>
      </section>

      {/* 3. PRODUCT CATALOG */}
      <section id="shop" className="py-32 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-serif text-[#2C2420] mb-6">Our Curated Selection</h2>
          <div className="w-20 h-1 bg-[#4A3B32] mx-auto rounded-full"></div>
        </div>
        
        {loading ? (
          // UI UPGRADE: Luxury Skeleton Loader
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-3xl border border-gray-100 overflow-hidden animate-pulse shadow-sm">
                <div className="aspect-4/3 bg-[#4A3B32]/5"></div>
                <div className="p-8 space-y-6">
                  <div className="flex justify-between items-center">
                    <div className="h-6 bg-[#4A3B32]/10 rounded-md w-2/3"></div>
                    <div className="h-6 bg-[#4A3B32]/10 rounded-md w-16"></div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-3 bg-[#4A3B32]/5 rounded-sm w-full"></div>
                    <div className="h-3 bg-[#4A3B32]/5 rounded-sm w-4/5"></div>
                  </div>
                  <div className="h-14 bg-[#4A3B32]/10 rounded-xl mt-4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          // UI UPGRADE: Refined Empty State
          <div className="text-center py-20 bg-white border border-gray-100 rounded-3xl shadow-sm">
             <div className="w-16 h-16 bg-[#F9F8F4] text-[#4A3B32] rounded-full flex items-center justify-center mx-auto mb-6">
               <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
               </svg>
             </div>
             <p className="text-gray-500 font-serif text-xl mb-2">Fresh harvest is arriving soon.</p>
             <p className="text-xs uppercase tracking-widest text-gray-400 font-bold">Please check back later</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-14">
            {products.map((product) => (
              <div key={product.id} className="group flex flex-col bg-white rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-50 overflow-hidden outline-none">
                
                {/* Clicking the image navigates to Product Page */}
                <Link to={`/product/${product.id}`} className="block aspect-4/3 overflow-hidden bg-[#F9F8F4] relative">
                  <img 
                    src={product.image_url || 'https://via.placeholder.com/400x400.png?text=Mithila+Gaam'} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s] ease-out" 
                  />
                  {/* Overlay to darken image slightly on hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500"></div>
                  
                  {product.category && (
                     <span className="absolute top-5 left-5 bg-white/95 backdrop-blur-md text-[#4A3B32] px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] rounded-full shadow-sm border border-white">
                       {product.category}
                     </span>
                  )}
                </Link>

                <div className="p-8 flex flex-col grow">
                  <div className="flex justify-between items-start mb-4">
                    <Link to={`/product/${product.id}`} className="text-2xl font-bold text-[#2C2420] font-serif group-hover:text-[#8C7A6B] transition-colors outline-none pr-4">
                      {product.name}
                    </Link>
                    <span className="text-xl font-bold text-[#4A3B32]">₹{product.price.toLocaleString('en-IN')}</span>
                  </div>
                  
                  <p className="text-gray-500 mb-8 text-sm leading-relaxed grow line-clamp-2 font-medium">
                    {product.description}
                  </p>
                  
                  <button 
                    onClick={() => addToCart(product)} 
                    className="w-full py-4 text-[11px] tracking-[0.2em] uppercase bg-white border-2 border-[#4A3B32] text-[#4A3B32] rounded-xl hover:bg-[#4A3B32] hover:text-white active:scale-95 transition-all duration-300 font-bold outline-none flex justify-center items-center gap-2"
                  >
                    Quick Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

    </main>
  );
}