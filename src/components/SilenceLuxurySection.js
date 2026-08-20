import React from 'react';
import Link from 'next/link';

const SilenceLuxurySection = () => {
  return (
    <section className="w-full bg-black relative flex flex-col">
      {/* ============================== */}
      {/* DESKTOP LAYOUT */}
      {/* ============================== */}
      <div className="relative w-full hidden md:block">
        <img
          src="/silence/When Silence Becomes a True Luxury/PHONE SIZE-06.webp"
          alt="When Silence Becomes a True Luxury"
          className="w-full h-auto"
        />

        {/* Desktop Left Side: Text Content */}
        <div className="absolute inset-0 flex flex-col justify-center items-start pr-[50%] pl-[8%] z-10" style={{ gap: '1.2vw' }}>

          {/* Heading */}
          <div className="flex flex-col self-start pl-[1.5vw]">
            <h2 className="font-bold tracking-wide uppercase text-[#cce4e6]" style={{ fontFamily: 'Geometos, sans-serif' }}>
              <div style={{ fontSize: '2.8vw', lineHeight: '1.2' }}>WHEN SILENCE</div>
              <div style={{ fontSize: '2.8vw', lineHeight: '1.2' }}>BECOMES A TRUE LUXURY</div>
            </h2>
          </div>

          {/* Paragraphs */}
          <div className="text-gray-200 text-left flex flex-col w-full pl-[1.5vw] mt-2" style={{ fontFamily: 'Gotham-Book, Gotham, sans-serif', fontSize: '1.15vw', lineHeight: '1.6', gap: '1.2vw' }}>
            <p>
              Premium soundproofing and heat insulation help block road noise, reduce heat, and create a quieter, more comfortable cabin.
            </p>
            <p>
              Upgrade with high-performance materials professionally installed by our experts for a smoother, cooler, and more luxurious driving experience.
            </p>
          </div>

          {/* Button Link */}
          <div className="pl-[1.5vw] mt-3">
            <Link
              href="/products/silence"
              className="inline-flex items-center justify-center gap-2 font-bold tracking-wider uppercase transition-all duration-300 rounded-full border border-[#8ce0e7]/60 text-black bg-[#8ce0e7] hover:bg-[#a6edf3] hover:shadow-[0_0_25px_rgba(140,224,231,0.6)] hover:scale-105 active:scale-95 cursor-pointer"
              style={{
                fontFamily: 'Geometos, sans-serif',
                padding: '0.65vw 1.8vw',
                fontSize: '1vw',
              }}
            >
              <span>Learn More</span>
              <svg className="w-[1vw] h-[1vw]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* ============================== */}
      {/* MOBILE LAYOUT */}
      {/* ============================== */}
      <div className="md:hidden w-full relative block bg-black">
        <img
          src="/silence/Phone/1.webp"
          alt="When Silence Becomes a True Luxury"
          className="w-full h-auto"
        />
        {/* Mobile Button Overlay */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center z-10 px-4">
          <Link
            href="/products/silence"
            className="inline-flex items-center justify-center gap-1.5 py-1.5 px-4 rounded-full bg-[#8ce0e7] hover:bg-[#a6edf3] text-black font-bold text-[11px] tracking-wider uppercase shadow-[0_0_15px_rgba(140,224,231,0.5)] active:scale-95 transition-all duration-200"
            style={{ fontFamily: 'Geometos, sans-serif' }}
          >
            <span>Learn More</span>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SilenceLuxurySection;
