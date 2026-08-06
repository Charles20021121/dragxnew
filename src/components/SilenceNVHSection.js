import React from 'react';

const SilenceNVHSection = () => {
  return (
    <section className="bg-black text-white w-full relative overflow-hidden flex flex-col z-0">

      {/* ============================== */}
      {/* MOBILE LAYOUT (Hidden on Desktop) */}
      {/* ============================== */}
      {/* ============================== */}
      {/* MOBILE LAYOUT */}
      {/* ============================== */}
      <div className="md:hidden w-full relative block">
        <img
          src="/silence/Phone/3.webp"
          alt="NVH Stand for Mobile Banner"
          className="w-full h-auto"
        />
      </div>


      {/* ============================== */}
      {/* DESKTOP LAYOUT (Hidden on Mobile) */}
      {/* ============================== */}

      <div className="hidden md:flex w-full flex-col min-h-[500px] lg:min-h-[700px] py-16 lg:py-24 relative">

        {/* Desktop Background Image (Full Section) */}
        <div className="absolute inset-0 z-0">
          <img src="/silence/nhv Stand for/DX Silence PAGE FA 2-09.webp" alt="NVH Stand for" className="absolute inset-0 w-full h-full object-cover object-center" />
          {/* Dark overlay ensuring text readability on the left */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent z-10"></div>
        </div>

        {/* Desktop Content Overlay */}
        <div className="relative z-20 w-full md:w-[75%] lg:w-[60%] xl:w-[55%] pl-12 lg:pl-20 xl:pl-32 flex flex-col space-y-12">

          {/* Top Section: Title & Subtitle */}
          <div className="space-y-6">
            {/* Title Block */}
            <div className="mb-2">
              <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-wide uppercase" style={{ fontFamily: 'Geometos, sans-serif' }}>
                <span className="text-[#9bc7ca]">NVH STAND FOR?</span>
              </h2>
            </div>

            {/* Intro Text */}
            <p className="text-gray-200 text-lg md:text-xl text-left leading-relaxed pr-8" style={{ fontFamily: 'Gotham-Book, Gotham, sans-serif' }}>
              The three parts of NVH cover a range of sound indicators — how it is heard, how it is felt, and whether it is perceived to be pleasant or annoying.
            </p>
          </div>

          {/* Bottom Section: 3 Columns */}
          <div className="grid grid-cols-3 gap-8 pr-8">

            {/* Column 1: Noise */}
            <div className="flex flex-col space-y-3">
              <h3 className="text-white text-lg md:text-xl font-bold tracking-wider uppercase" style={{ fontFamily: 'Geometos, sans-serif' }}>NOISE :</h3>
              <p className="text-gray-200 text-sm md:text-base text-left leading-relaxed" style={{ fontFamily: 'Gotham-Book, Gotham, sans-serif' }}>
                Unwanted sounds from the engine, road, wind, tires, or other vehicle components.
              </p>
            </div>

            {/* Column 2: Vibration */}
            <div className="flex flex-col space-y-3">
              <h3 className="text-white text-lg md:text-xl font-bold tracking-wider uppercase" style={{ fontFamily: 'Geometos, sans-serif' }}>VIBRATION :</h3>
              <p className="text-gray-200 text-sm md:text-base text-left leading-relaxed" style={{ fontFamily: 'Gotham-Book, Gotham, sans-serif' }}>
                Unwanted movement transmitted through the steering wheel, seats, floor, and pedals.
              </p>
            </div>

            {/* Column 3: Harshness */}
            <div className="flex flex-col space-y-3">
              <h3 className="text-white text-lg md:text-xl font-bold tracking-wider uppercase" style={{ fontFamily: 'Geometos, sans-serif' }}>HARSHNESS :</h3>
              <p className="text-gray-200 text-sm md:text-base text-left leading-relaxed" style={{ fontFamily: 'Gotham-Book, Gotham, sans-serif' }}>
                The uncomfortable feeling caused by excessive noise and vibration, affecting overall ride comfort.
              </p>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default SilenceNVHSection;
