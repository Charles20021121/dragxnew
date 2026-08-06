import React from 'react';

const SilenceFeaturesGridSection = () => {
  return (
    <section className="w-full flex flex-col">
      {/* ============================== */}
      {/* MOBILE LAYOUT */}
      {/* ============================== */}
      <div className="md:hidden w-full relative block">
        <img 
          src="/silence/Phone/5.webp" 
          alt="Silence Features Grid Mobile Banner" 
          className="w-full h-auto"
        />
      </div>

      {/* ============================== */}
      {/* DESKTOP LAYOUT */}
      {/* ============================== */}
      <div className="hidden md:block w-full">
        <img 
          src="/silence/last/DX Silence PC 2-10.webp" 
          alt="DX Silence Features Banner" 
          className="w-full h-auto"
        />
      </div>
    </section>
  );
};

export default SilenceFeaturesGridSection;

