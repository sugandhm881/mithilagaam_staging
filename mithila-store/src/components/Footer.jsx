import { Link, useLocation } from 'react-router-dom';
import logo from '../../asset/mithila_gaam_logo.png';

// UI UPGRADE: Luxury link styling with expanding underline effect for the footer
const FooterLink = ({ to, children }) => (
  <li>
    <Link to={to} className="relative group text-sm text-gray-400 hover:text-white transition-colors inline-block py-1 outline-none">
      {children}
      <span className="absolute bottom-0 left-0 w-0 h-px bg-[#8C7A6B] transition-all duration-500 ease-out group-hover:w-full"></span>
    </Link>
  </li>
);

export default function Footer() {
  const location = useLocation();
  
  // Hide footer on Admin Portal to keep the workspace clean
  if (location.pathname === '/admin') return null;
  
  return (
    <footer className="bg-[#1A1A1A] text-[#F9F8F4] pt-24 pb-12 border-t border-[#333]">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-12 mb-20">
        
        {/* COLUMN 1: BRAND IDENTITY */}
        <div className="flex flex-col">
          <Link to="/" className="inline-flex items-center gap-4 mb-8 group outline-none">
            <div className="bg-white/5 p-2 rounded-xl border border-white/10 group-hover:bg-white/10 transition-colors duration-500">
              <img 
                src={logo} 
                alt="Mithila Heritage Logo" 
                className="h-12 w-12 object-contain drop-shadow-lg group-hover:scale-105 transition-transform duration-500" 
              />
            </div>
            <span className="text-2xl font-serif uppercase tracking-[0.2em] text-white mt-1">
              Mithila Gaam
            </span>
          </Link>
          <p className="text-sm text-gray-400 mb-10 max-w-sm leading-relaxed font-medium">
            Bringing the authentic, premium harvest of Bihar directly to your doorstep. Hand-sorted, sun-dried, and roasted to perfection in the heart of Mithila.
          </p>
          <div className="flex items-center gap-4 text-gray-400">
             <span className="text-2xl border border-gray-700 p-2.5 rounded-xl bg-white/5" title="Secure Card Payments">💳</span>
             <span className="text-2xl border border-gray-700 p-2.5 rounded-xl bg-white/5" title="UPI & Mobile Payments">📱</span>
             <span className="text-[10px] uppercase tracking-widest font-bold ml-2 leading-loose text-gray-300">
               100% Secure <br />Payments
             </span>
          </div>
        </div>

        {/* COLUMN 2: QUICK EXPLORATION */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white mb-8 border-b border-white/10 pb-3 inline-block">Explore</h4>
          <ul className="space-y-4 font-medium">
            <FooterLink to="/#shop">Shop Catalog</FooterLink>
            <FooterLink to="/about">Our Heritage</FooterLink>
            <FooterLink to="/contact">Contact Us</FooterLink>
            <FooterLink to="/track-order">Track Your Order</FooterLink>
          </ul>
        </div>

        {/* COLUMN 3: SOCIAL JOURNEY */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white mb-8 border-b border-white/10 pb-3 inline-block">Follow Our Journey</h4>
          <p className="text-sm text-gray-400 mb-8 leading-relaxed font-medium">Join our community for healthy recipes and glimpses of rural Bihar.</p>
          <div className="flex items-center gap-5">
            {/* INSTAGRAM */}
            <a 
              href="https://instagram.com/mithilagaam" 
              target="_blank" 
              rel="noreferrer" 
              className="w-12 h-12 rounded-full border border-gray-700 bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:border-white hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 outline-none"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            {/* FACEBOOK */}
            <a 
              href="https://facebook.com/mithilagaam" 
              target="_blank" 
              rel="noreferrer" 
              className="w-12 h-12 rounded-full border border-gray-700 bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:border-white hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 outline-none"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-8.74h-2.94v-3.403h2.94v-2.513c0-2.91 1.777-4.494 4.376-4.494 1.246 0 2.315.092 2.628.134v3.045l-1.802.001c-1.413 0-1.687.671-1.687 1.656v2.17h3.372l-.438 3.403h-2.934v8.741h6.013c.732 0 1.325-.593 1.325-1.325v-21.351c0-.732-.593-1.325-1.325-1.325z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* COLUMN 4: DIRECT REACH */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white mb-8 border-b border-white/10 pb-3 inline-block">Reach Us</h4>
          <ul className="space-y-6 text-sm text-gray-400 font-medium">
            <li className="flex flex-col gap-2">
              <span className="text-[9px] uppercase font-bold text-[#8C7A6B] tracking-[0.2em]">Email Support</span>
              <a href="mailto:hello@mithilagaam.com" className="text-gray-300 hover:text-white transition-colors">hello@mithilagaam.com</a>
            </li>
            <li className="flex flex-col gap-2">
              <span className="text-[9px] uppercase font-bold text-[#8C7A6B] tracking-[0.2em]">Phone Inquiries</span>
              <a href="tel:+919876543210" className="text-gray-300 hover:text-white transition-colors">+919876543210</a>
            </li>
            <li className="flex flex-col gap-2">
              <span className="text-[9px] uppercase font-bold text-[#8C7A6B] tracking-[0.2em]">Business Hours</span>
              <span className="text-gray-300">Mon - Sat, 9:00 AM - 6:00 PM</span>
            </li>
          </ul>
        </div>

      </div>

      {/* COPYRIGHT BAR */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 border-t border-white/5 pt-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] text-gray-500 uppercase tracking-[0.2em] font-bold">
          <p>© {new Date().getFullYear()} Mithila Heritage Food Pvt Ltd. All Rights Reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-white transition-colors outline-none">Privacy Policy</Link>
            <span className="text-gray-800">|</span>
            <Link to="/terms" className="hover:text-white transition-colors outline-none">Terms of Service</Link>
            <span className="text-gray-800 hidden sm:inline">|</span>
            <p className="text-[#8C7A6B] hidden sm:inline">Crafted with care in Darbhanga</p>
          </div>
        </div>
      </div>
    </footer>
  );
}