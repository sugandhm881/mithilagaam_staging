import { Link, useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Product({ products, addToCart, loading }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeImage, setActiveImage] = useState('');
  const [qty, setQty] = useState(1);

  const product = products.find(p => p.id === Number(id));

  useEffect(() => {
    if (product && !activeImage) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveImage(product.image_url);
    }
  }, [product, activeImage]);

  // Reset quantity when product changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setQty(1);
    window.scrollTo(0, 0);
  }, [id]);

  // UI UPGRADE: Luxury Skeleton Loader
  if (loading) {
    return (
      <main className="bg-[#F9F8F4] py-16 px-6 min-h-screen">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 animate-pulse">
          <div className="aspect-square bg-[#4A3B32]/5 rounded-3xl border border-[#4A3B32]/10"></div>
          <div className="space-y-8 py-8">
            <div className="h-4 bg-[#4A3B32]/10 rounded-full w-32"></div>
            <div className="h-16 bg-[#4A3B32]/10 rounded-xl w-3/4"></div>
            <div className="h-8 bg-[#4A3B32]/5 rounded-lg w-1/4"></div>
            <div className="h-40 bg-[#4A3B32]/5 rounded-2xl w-full"></div>
            <div className="h-16 bg-[#4A3B32]/10 rounded-xl w-full mt-10"></div>
          </div>
        </div>
      </main>
    );
  }

  // UI UPGRADE: Refined Empty State
  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col justify-center items-center bg-[#F9F8F4] text-center px-6">
        <div className="w-20 h-20 mb-8 rounded-full bg-[#4A3B32]/5 flex items-center justify-center text-[#4A3B32]/30">
          <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zm-7.518-.267A8.25 8.25 0 1120.25 10.5M8.288 14.212A5.25 5.25 0 1117.25 10.5" />
          </svg>
        </div>
        <h2 className="text-4xl font-serif text-[#2C2420] mb-4">Harvest Not Found</h2>
        <p className="text-gray-500 mb-10 uppercase text-xs font-bold tracking-[0.2em]">This specific batch may no longer be available.</p>
        <button
          onClick={() => navigate('/')}
          className="bg-[#4A3B32] text-white px-12 py-4 uppercase tracking-[0.2em] text-xs font-bold rounded-xl shadow-xl hover:shadow-2xl hover:bg-[#3A2E27] active:scale-95 transition-all"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  const gallery = [product.image_url, ...(product.image_gallery || [])];
  const healthBenefits = (product.benefits && product.benefits.length > 0)
    ? product.benefits
    : ["100% Organic Origin", "Rich in Antioxidants", "Direct From Farmers"];

  const stock = Number(product.stock ?? 0);
  const isOutOfStock = stock <= 0;
  const isLowStock = stock > 0 && stock <= 5;

  const relatedProducts = products
    .filter(p => p.id !== product.id && p.category === product.category)
    .slice(0, 3);

  const decQty = () => setQty(q => Math.max(1, q - 1));
  const incQty = () => setQty(q => Math.min(Math.max(1, stock || 99), q + 1));

  const handleAdd = () => {
    if (isOutOfStock) return;
    addToCart(product, qty);
  };

  return (
    <main className="bg-[#F9F8F4] py-16 px-6 selection:bg-[#4A3B32] selection:text-white">
      <div className="max-w-7xl mx-auto">

        {/* UI UPGRADE: Elegant Breadcrumb */}
        <nav className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-12 font-bold flex items-center gap-3">
          <button className="hover:text-[#4A3B32] transition-colors" onClick={() => navigate('/')}>Home</button>
          <span className="text-gray-300">/</span>
          <button className="hover:text-[#4A3B32] transition-colors" onClick={() => navigate('/#shop')}>Shop</button>
          <span className="text-gray-300">/</span>
          <span className="text-[#4A3B32] truncate">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">

          {/* LEFT: Dynamic Gallery */}
          <div className="flex flex-col-reverse lg:flex-row gap-6 sticky top-32">
            {gallery.length > 1 && (
              <div className="flex lg:flex-col gap-4 overflow-x-auto lg:w-20 shrink-0 scrollbar-hide pb-2 lg:pb-0">
                {gallery.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`relative w-16 h-16 lg:w-20 lg:h-20 rounded-xl overflow-hidden shrink-0 transition-all duration-500 ease-out outline-none
                      ${activeImage === img 
                        ? 'ring-2 ring-[#4A3B32] ring-offset-2 ring-offset-[#F9F8F4] shadow-md' 
                        : 'border border-gray-200 opacity-60 hover:opacity-100 hover:shadow-sm'}`}
                  >
                    <img src={img} alt={`${product.name} - View ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            <div className="grow bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 aspect-square relative group">
              <img
                src={activeImage}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105"
              />
              <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md text-[#4A3B32] px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] shadow-sm border border-white">
                Verified Harvest
              </div>
            </div>
          </div>

          {/* RIGHT: Product Details & Purchase Engine */}
          <div className="flex flex-col pt-4">
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#8C7A6B] font-bold mb-4 block">
              {product.category}
            </span>
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-serif text-[#2C2420] mb-6 leading-[1.1] tracking-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-4 mb-8">
              <div className="flex text-[#D4AF37] text-lg tracking-tighter drop-shadow-sm">★★★★★</div>
              <span className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em] border-l border-gray-300 pl-4 py-1">
                Directly Sourced from Mithila
              </span>
            </div>

            <p className="text-4xl lg:text-5xl text-[#4A3B32] font-serif mb-8 flex items-baseline gap-2">
              <span className="text-2xl font-sans text-gray-400 font-light relative -top-2">₹</span>
              {product.price.toLocaleString('en-IN')}
            </p>

            {/* UI UPGRADE: Refined Stock Indicators */}
            <div className="mb-10">
              {isOutOfStock ? (
                <span className="inline-flex items-center gap-3 bg-red-50/80 text-red-700 px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest border border-red-100">
                  <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></span> Out of Stock
                </span>
              ) : isLowStock ? (
                <span className="inline-flex items-center gap-3 bg-orange-50/80 text-orange-700 px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest border border-orange-100">
                  <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse shadow-[0_0_8px_rgba(249,115,22,0.8)]"></span>
                  Only {stock} remaining — secure yours
                </span>
              ) : (
                <span className="inline-flex items-center gap-3 bg-[#4A3B32]/5 text-[#4A3B32] px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest border border-[#4A3B32]/10">
                  <span className="w-2 h-2 rounded-full bg-[#8C7A6B]"></span> In Stock & Ready to Ship
                </span>
              )}
            </div>

            {/* UI UPGRADE: Luxury Narrative Block */}
            <div className="relative mb-12">
              <div className="absolute -left-4 top-0 text-6xl text-gray-200 font-serif leading-none opacity-50">"</div>
              <p className="text-gray-600 leading-loose text-lg font-medium relative z-10 pl-6 border-l-2 border-[#4A3B32]/20">
                {product.description}
              </p>
            </div>

            {/* UI UPGRADE: Premium Quantity & Add to Cart */}
            {!isOutOfStock ? (
              <div className="flex flex-col sm:flex-row gap-5 mb-6">
                <div className="flex items-center border border-gray-300 rounded-xl bg-white shrink-0 shadow-sm h-16">
                  <button
                    onClick={decQty}
                    disabled={qty <= 1}
                    aria-label="Decrease quantity"
                    className="w-16 h-full text-xl font-bold text-[#4A3B32] disabled:opacity-30 hover:bg-[#F9F8F4] transition-colors rounded-l-xl outline-none"
                  >
                    −
                  </button>
                  <span className="w-16 text-center text-sm font-bold font-mono text-[#2C2420]">{qty}</span>
                  <button
                    onClick={incQty}
                    disabled={stock > 0 && qty >= stock}
                    aria-label="Increase quantity"
                    className="w-16 h-full text-xl font-bold text-[#4A3B32] disabled:opacity-30 hover:bg-[#F9F8F4] transition-colors rounded-r-xl outline-none"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={handleAdd}
                  className="grow h-16 bg-[#4A3B32] text-white rounded-xl uppercase tracking-[0.2em] font-bold text-[11px] shadow-2xl shadow-[#4A3B32]/30 hover:bg-[#3A2E27] hover:-translate-y-1 transition-all duration-300 active:scale-95 outline-none flex items-center justify-center gap-3"
                >
                  <span>Add to Cart</span>
                  <span className="text-white/40">|</span>
                  <span>₹{(product.price * qty).toLocaleString('en-IN')}</span>
                </button>
              </div>
            ) : (
              <button
                disabled
                className="w-full bg-gray-200 text-gray-500 h-16 rounded-xl uppercase tracking-[0.2em] font-bold text-[11px] cursor-not-allowed mb-6"
              >
                Currently Unavailable
              </button>
            )}

            {/* UI UPGRADE: Soft Health Benefits */}
            <div className="mt-8 pt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {healthBenefits.map((benefit, i) => (
                <div key={i} className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-full bg-[#4A3B32]/5 flex items-center justify-center text-[#4A3B32] border border-[#4A3B32]/10 group-hover:bg-[#4A3B32] group-hover:text-white transition-colors duration-300">
                    <svg fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-600 group-hover:text-[#2C2420] transition-colors">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* UI UPGRADE: Refined Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-32 pt-24 border-t border-gray-200">
            <div className="text-center mb-16">
              <h3 className="text-4xl font-serif text-[#2C2420] mb-4">You May Also Love</h3>
              <p className="text-[#8C7A6B] text-[10px] uppercase font-bold tracking-[0.3em]">Hand-picked from our harvest</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {relatedProducts.map(rp => (
                <Link
                  key={rp.id}
                  to={`/product/${rp.id}`}
                  className="group flex flex-col bg-white rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-50 overflow-hidden outline-none"
                >
                  <div className="aspect-4/3 overflow-hidden bg-[#F9F8F4] relative">
                    <img
                      src={rp.image_url || 'https://via.placeholder.com/400'}
                      alt={rp.name}
                      className="w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500"></div>
                  </div>
                  <div className="p-8 flex flex-col grow">
                    <div className="flex justify-between items-start mb-4">
                      <p className="text-xl font-bold text-[#2C2420] font-serif group-hover:text-[#8C7A6B] transition-colors">{rp.name}</p>
                      <span className="text-lg font-bold text-[#4A3B32]">₹{rp.price}</span>
                    </div>
                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">{rp.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* UI UPGRADE: Luxury Testimonials */}
        <div className="mt-32 pt-24 border-t border-gray-200 text-center">
          <h3 className="text-4xl font-serif text-[#2C2420] mb-4">The Mithila Heritage Experience</h3>
          <p className="text-[#8C7A6B] text-[10px] uppercase font-bold tracking-[0.3em] mb-20">Real stories from our community</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-left">
            <div className="bg-white p-12 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between hover:-translate-y-2 transition-transform duration-500">
              <div className="text-[#D4AF37] text-sm tracking-widest mb-6">★★★★★</div>
              <p className="text-gray-600 text-sm leading-loose mb-10 italic">"The texture and size of this Makhana is something I've never seen in regular store-bought packets. Truly premium harvest quality."</p>
              <p className="text-[10px] uppercase tracking-widest text-[#4A3B32] font-bold border-t border-gray-100 pt-6">— Ritu V., New Delhi</p>
            </div>
            <div className="bg-[#2C2420] p-12 rounded-3xl shadow-2xl flex flex-col justify-between transform md:-translate-y-4">
              <div className="text-[#D4AF37] text-sm tracking-widest mb-6">★★★★★</div>
              <p className="text-gray-300 text-sm leading-loose mb-10 italic">"Mithila Heritage brings the authentic taste of my hometown directly to my pantry. It has become my daily essential snack."</p>
              <p className="text-[10px] uppercase tracking-widest text-white font-bold border-t border-gray-700 pt-6">— Alok M., Mumbai</p>
            </div>
            <div className="bg-white p-12 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between hover:-translate-y-2 transition-transform duration-500">
              <div className="text-[#D4AF37] text-sm tracking-widest mb-6">★★★★★</div>
              <p className="text-gray-600 text-sm leading-loose mb-10 italic">"Fast delivery and beautiful eco-friendly packaging. You can really tell this is hand-sorted with immense care. Worth every rupee."</p>
              <p className="text-[10px] uppercase tracking-widest text-[#4A3B32] font-bold border-t border-gray-100 pt-6">— Sangeeta K., Bangalore</p>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}