import React from 'react';

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
        <div className="absolute inset-0 flex flex-col justify-center items-start pr-[50%] pl-[8%] z-10" style={{ gap: '1.5vw' }}>

          {/* Heading */}
          <div className="flex flex-col self-start pl-[1.5vw]">
            <h2 className="font-bold tracking-wide uppercase text-[#cce4e6]" style={{ fontFamily: 'Geometos, sans-serif' }}>
              <div style={{ fontSize: '2.8vw', lineHeight: '1.2' }}>WHEN SILENCE</div>
              <div style={{ fontSize: '2.8vw', lineHeight: '1.2' }}>BECOMES A TRUE LUXURY</div>
            </h2>
          </div>

          {/* Paragraphs */}
          <div className="text-gray-200 text-left flex flex-col w-full pl-[1.5vw] mt-4" style={{ fontFamily: 'Gotham-Book, Gotham, sans-serif', fontSize: '1.2vw', lineHeight: '1.6', gap: '1.5vw' }}>
            <p>
              Premium soundproofing and heat insulation help block road noise, reduce heat, and create a quieter, more comfortable cabin.
            </p>
            <p>
              Upgrade with high-performance materials professionally installed by our experts for a smoother, cooler, and more luxurious driving experience.
            </p>
          </div>
        </div>
      </div>

      {/* ============================== */}
      {/* MOBILE LAYOUT */}
      {/* ============================== */}
      <div className="md:hidden w-full relative block">
        <img
          src="/silence/Phone/1.webp"
          alt="When Silence Becomes a True Luxury"
          className="w-full h-auto"
        />
      </div>
    </section>
  );
};

export default SilenceLuxurySection;
