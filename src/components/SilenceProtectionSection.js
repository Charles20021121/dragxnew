import React from 'react';

const SilenceProtectionSection = () => {
  return (
    <section className="w-full bg-black relative flex flex-col">
      {/* ============================== */}
      {/* DESKTOP LAYOUT */}
      {/* ============================== */}
      <div className="relative w-full hidden md:block">
        <img
          src="/silence/getting/PHONE SIZE-061.webp"
          alt="Optimum Vehicle Noise Protection"
          className="w-full h-auto"
        />

        <div className="absolute inset-0 flex flex-col justify-center items-start pl-[50%] lg:pl-[54%] pr-[5%] z-10">
          <div className="flex flex-col w-full max-w-3xl" style={{ gap: '0.8vw' }}>
            {/* Desktop Heading */}
            <div className="w-full">
              <h2 className="tracking-wide text-left flex flex-col font-bold" style={{ fontFamily: 'Gotham-Bold, Gotham, sans-serif' }}>
                <span className="text-[#a5c9cb] mb-1 uppercase leading-none" style={{ fontSize: 'clamp(14px, 2.08vw, 40px)' }}>GETTING STARTED WITH</span>
                <span className="text-[#cce4e6] uppercase leading-[1.05]" style={{ fontSize: 'clamp(18px, 3.78vw, 70px)' }}>
                  OPTIMUM VEHICLE<br />NOISE PROTECTION
                </span>
              </h2>
            </div>

            {/* Desktop Paragraph */}
            <div className="text-gray-300 text-justify w-full mt-2" style={{ fontFamily: 'Gotham-Book, Gotham, sans-serif', fontSize: 'clamp(14px, 1.53vw, 40px)', lineHeight: '1.4' }}>
              <p>
                Driver and passenger comfort is essential for success. Understanding noise sources and how to optimize them is one of the best ways to ensure your vehicle will meet greatest silence. Implementing NVH test to ascertain their effect on the passenger and driver experience inside the vehicle and solved as possible.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ============================== */}
      {/* MOBILE LAYOUT */}
      {/* ============================== */}
      <div className="md:hidden w-full relative block">
        <img
          src="/silence/Phone/2.webp"
          alt="Optimum Vehicle Noise Protection"
          className="w-full h-auto"
        />
      </div>
    </section>
  );
};

export default SilenceProtectionSection;
