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
        
        <div className="absolute inset-0 flex flex-col justify-center items-start pl-[48%] pr-[6%] z-10">
          <div className="flex flex-col w-max max-w-full" style={{ gap: '1.5vw' }}>
            {/* Desktop Heading with teal background block */}
            <div className="bg-gradient-to-r from-transparent via-[#124446]/80 to-[#124446] rounded-r-[1vw] pl-[3vw] pr-[2vw] py-[1.2vw] w-full">
              <h2 className="font-bold tracking-wide text-left whitespace-nowrap flex flex-col">
                <span className="text-[#a5c9cb] mb-[0.2vw]" style={{ fontSize: '1.2vw' }}>Getting Started with</span>
                <span className="text-[#cce4e6]" style={{ fontSize: '2vw' }}>Optimum Vehicle Noise Protection</span>
              </h2>
            </div>

            {/* Desktop Paragraph */}
            <div className="text-gray-300 text-justify w-full px-[2vw]" style={{ fontSize: '1.1vw', lineHeight: '1.6' }}>
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
