export default function About() {
  return (
    <main className="bg-[#F9F8F4] selection:bg-[#4A3B32] selection:text-white pb-20">
      
      {/* PREMIUM HEADER */}
      <header className="relative bg-[#EFEBE4] py-32 text-center border-b border-gray-200/60 px-6 overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-[-20%] left-[10%] w-96 h-96 bg-[#4A3B32]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-20%] right-[10%] w-96 h-96 bg-[#4A3B32]/5 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 animate-fade-in-up">
          <div className="w-16 h-[2px] bg-[#8C7A6B] mx-auto mb-8"></div>
          <h1 className="text-5xl md:text-7xl font-serif text-[#2C2420] mb-6 tracking-tight">Our Heritage</h1>
          <p className="text-[#8C7A6B] uppercase tracking-[0.3em] text-xs font-bold">From the Ponds of Bihar to Your Pantry</p>
        </div>
      </header>

      {/* EDITORIAL STORY CONTENT */}
      <section className="max-w-4xl mx-auto pt-24 px-6 md:px-12 text-lg text-gray-600 leading-loose font-serif">
        
        {/* Drop Cap & Lead Paragraph */}
        <p className="mb-10 md:text-xl font-medium text-[#2C2420] leading-relaxed">
          <span className="float-left text-7xl font-serif text-[#4A3B32] leading-[0.8] pr-4 pt-2">T</span>
          he story of <strong className="text-[#4A3B32] font-bold">Mithila Gaam</strong> begins in the serene wetlands of Bihar, a region famously known as the Mithila heartland. For centuries, this fertile soil has nurtured the delicate lotus flower, whose seeds give us the miraculous superfood known as Phool Makhana.
        </p>
        
        <p className="mb-16 md:text-xl leading-relaxed">
          However, despite producing over 85% of the world's Makhana, the farmers who endure the grueling process of diving into ponds, extracting the seeds, and hand-roasting them over open fires rarely saw the true value of their labor. The market was dominated by middlemen who prioritized volume over quality, leaving the true artisans behind.
        </p>

        {/* PARALLEL IMAGE GALLERY (Symmetrical Grid) */}
        <div className="my-24 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Image 1 */}
          <div className="group rounded-3xl overflow-hidden shadow-xl border border-gray-100 aspect-4/5 relative">
            <img
              src="https://ryjkveldjqwfrkmesjqs.supabase.co/storage/v1/object/public/products/img_1777057071956_858.png"
              alt="Mithila Gaam Origins"
              className="w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500"></div>
          </div>
          
          {/* Image 2 */}
          <div className="group rounded-3xl overflow-hidden shadow-xl border border-gray-100 aspect-4/5 relative">
            <img
              src="https://ryjkveldjqwfrkmesjqs.supabase.co/storage/v1/object/public/products/MG_00004.jpg"
              alt="Hand Harvesting"
              className="w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500"></div>
          </div>

          {/* Image 3 */}
          <div className="group rounded-3xl overflow-hidden shadow-xl border border-gray-100 aspect-4/5 relative">
            <img
              src="https://ryjkveldjqwfrkmesjqs.supabase.co/storage/v1/object/public/products/MG_00002.jpg"
              alt="Sorting the Harvest"
              className="w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500"></div>
          </div>

          {/* Image 4 */}
          <div className="group rounded-3xl overflow-hidden shadow-xl border border-gray-100 aspect-4/5 relative">
            <img
              src="https://ryjkveldjqwfrkmesjqs.supabase.co/storage/v1/object/public/products/MG_00001.jpg"
              alt="Premium Quality Makhana"
              className="w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500"></div>
          </div>
        </div>

        {/* MISSION STATEMENT */}
        <div className="relative py-12">
          {/* Decorative quote mark in background */}
          <div className="absolute top-0 left-0 text-[12rem] leading-none text-[#4A3B32]/5 font-serif -z-10 -mt-10 -ml-6 select-none">"</div>
          
          <h2 className="text-4xl md:text-5xl text-[#2C2420] mb-8 font-bold font-serif tracking-tight">Our Mission</h2>
          <p className="mb-10 md:text-xl leading-relaxed">
            We founded Mithila Gaam to change this narrative. Our goal is simple: to bring you the most premium, authentic, and crispiest Makhana while ensuring that the artisans who craft it are compensated fairly and recognized for their generational skills.
          </p>
          <p className="mb-16 md:text-xl leading-relaxed">
            Every batch of our Makhana is sourced directly from local cooperatives. We meticulously sort through the harvest, discarding the small and imperfect seeds, to ensure that only the "Jumbo" and premium grades make it into our elegant packaging. It is a labor of absolute love, tradition, and profound respect for our roots.
          </p>
        </div>

        {/* FOUNDER'S NOTE / CLOSING */}
        <div className="mt-10 p-12 md:p-16 bg-white border border-gray-100 rounded-3xl shadow-xl relative overflow-hidden text-center">
          <div className="absolute top-0 left-0 w-full h-2 bg-[#4A3B32]"></div>
          
          <div className="w-16 h-16 mx-auto bg-[#F9F8F4] text-[#4A3B32] rounded-full flex items-center justify-center mb-8 shadow-sm border border-gray-100">
            <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
          </div>
          
          <h3 className="text-2xl md:text-3xl font-serif text-[#2C2420] mb-6">
            Thank you for supporting authentic, fair-trade agriculture.
          </h3>
          
          <div className="w-12 h-px bg-gray-200 mx-auto mb-6"></div>
          
          <p className="text-xs font-sans text-[#8C7A6B] uppercase tracking-[0.3em] font-bold">
            — The Mithila Heritage Team
          </p>
        </div>
      </section>
    </main>
  );
}