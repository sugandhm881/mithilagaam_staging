import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../../asset/mithila_gaam_logo.png';

// FIX: Moved DesktopLink outside the main component to prevent 'static-components' re-render error
const DesktopLink = ({ to, children }) => (
  <Link to={to} className="relative group py-2 text-[10px] font-bold tracking-[0.2em] uppercase text-[#2C2420] hover:text-[#8C7A6B] transition-colors">
    {children}
    {/* FIX: Used canonical Tailwind class h-px instead of h-[1px] */}
    <span className="absolute bottom-0 left-0 w-0 h-px bg-[#8C7A6B] transition-all duration-500 ease-out group-hover:w-full"></span>
  </Link>
);

export default function Navigation({ cartItemCount, onCartClick }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  // FIX: Rule of Hooks - useEffect must be called before any early returns
  useEffect(() => {
    if (location.hash === '#shop') {
      setTimeout(() => {
        document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location]);

  // Hide navigation entirely on the Admin Portal
  if (location.pathname === '/admin') return null;

  const closeMobile = () => setMobileOpen(false);

  const handleShopClick = (e) => {
    e.preventDefault();
    closeMobile();
    if (location.pathname === '/') {
      document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/#shop');
    }
  };

  return (
    <nav className="bg-[#F9F8F4]/95 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200/50 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex justify-between items-center h-20 md:h-24">

          {/* LEFT: Mobile Hamburger & Desktop Links */}
          <div className="flex items-center gap-6 w-1/3">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
              className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 outline-none group"
            >
              <span className={`block w-6 h-0.5 bg-[#2C2420] transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-2' : 'group-hover:w-4'}`}></span>
              <span className={`block w-6 h-0.5 bg-[#2C2420] transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`}></span>
              <span className={`block w-6 h-0.5 bg-[#2C2420] transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-2' : 'group-hover:w-4'}`}></span>
            </button>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-10">
              <DesktopLink to="/">Home</DesktopLink>
              <a href="#shop" onClick={handleShopClick} className="relative group py-2 text-[10px] font-bold tracking-[0.2em] uppercase text-[#2C2420] hover:text-[#8C7A6B] transition-colors cursor-pointer">
                Shop
                {/* FIX: Used canonical Tailwind class h-px */}
                <span className="absolute bottom-0 left-0 w-0 h-px bg-[#8C7A6B] transition-all duration-500 ease-out group-hover:w-full"></span>
              </a>
              <DesktopLink to="/about">Our Heritage</DesktopLink>
            </div>
          </div>

          {/* CENTER: Premium Brand Lockup */}
          <div className="flex justify-center w-1/3">
            <Link to="/" onClick={closeMobile} className="flex flex-col items-center group outline-none">
              <img
                src={logo}
                alt="Mithila Gaam Logo"
                className="h-10 md:h-12 w-auto object-contain drop-shadow-sm group-hover:scale-105 transition-transform duration-500"
              />
              <span className="text-sm md:text-lg tracking-[0.25em] font-bold uppercase text-[#2C2420] font-serif pt-2 hidden sm:block">
                Mithila Gaam
              </span>
            </Link>
          </div>

          {/* RIGHT: Contact & Luxury Cart Icon */}
          <div className="flex items-center justify-end gap-8 w-1/3">
            <DesktopLink to="/track-order">Track Order</DesktopLink>

            <button
              onClick={onCartClick}
              aria-label="Open cart"
              className="relative p-2 text-[#2C2420] hover:text-[#8C7A6B] transition-colors outline-none group"
            >
              {/* Premium Tote Bag Icon */}
              <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 md:w-7 md:h-7 group-hover:-translate-y-1 transition-transform duration-300">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              
              {/* Refined Cart Badge */}
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#4A3B32] text-white text-[9px] w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-md ring-2 ring-[#F9F8F4]">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* UI UPGRADE: Smooth Mobile Slide-Down Menu */}
      {/* FIX: Used canonical Tailwind class max-h-125 */}
      <div 
        className={`md:hidden absolute w-full bg-white shadow-2xl transition-all duration-500 ease-in-out border-t border-gray-100 overflow-hidden ${mobileOpen ? 'max-h-125 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="flex flex-col px-6 py-4">
          <Link onClick={closeMobile} to="/" className="py-4 text-xs font-bold uppercase tracking-[0.2em] text-[#2C2420] border-b border-gray-50 flex justify-between items-center group">
            Home <span className="text-gray-300 group-hover:translate-x-1 transition-transform">→</span>
          </Link>
          <a href="#shop" onClick={handleShopClick} className="py-4 text-xs font-bold uppercase tracking-[0.2em] text-[#2C2420] border-b border-gray-50 flex justify-between items-center group cursor-pointer">
            Shop Collection <span className="text-gray-300 group-hover:translate-x-1 transition-transform">→</span>
          </a>
          <Link onClick={closeMobile} to="/about" className="py-4 text-xs font-bold uppercase tracking-[0.2em] text-[#2C2420] border-b border-gray-50 flex justify-between items-center group">
            Our Heritage <span className="text-gray-300 group-hover:translate-x-1 transition-transform">→</span>
          </Link>
          <Link onClick={closeMobile} to="/track-order" className="py-4 text-xs font-bold uppercase tracking-[0.2em] text-[#2C2420] border-b border-gray-50 flex justify-between items-center group">
            Track Order <span className="text-gray-300 group-hover:translate-x-1 transition-transform">→</span>
          </Link>
          <Link onClick={closeMobile} to="/contact" className="py-4 text-xs font-bold uppercase tracking-[0.2em] text-[#2C2420] flex justify-between items-center group">
            Contact Support <span className="text-gray-300 group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}