import React from 'react';

const features = [
  { name: "Sound Deadening", image: "/silence/last/element-22.webp" },
  { name: "Toxic Free", image: "/silence/last/element-23.webp" },
  { name: "Model Set", image: "/silence/last/element-24.webp" },
  { name: "Lightweight Material", image: "/silence/last/element-25.webp" },
  { name: "Acoustic Technology", image: "/silence/last/element-26.webp" },
  { name: "Thermal Insulation", image: "/silence/last/element-27.webp" },
  { name: "Enviroment Protection", image: "/silence/last/element-28.webp" },
  { name: "Module Selection", image: "/silence/last/element-29.webp" },
  { name: "Lifetime Warranty", image: "/silence/last/element-30.webp" },
  { name: "Analysis Report", image: "/silence/last/element-31.webp" }
];

const SilenceFeaturesGridSection = () => {
  return (
    <section className="bg-gradient-to-r from-black via-[#062426] to-black w-full flex flex-col">
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
      <div className="hidden md:flex w-full py-10 md:py-24 px-4 md:px-12 lg:px-20 xl:px-32 justify-center">
        <div className="w-full max-w-[1200px]">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-y-8 md:gap-y-12 gap-x-4 md:gap-x-10">
            {features.map((feature, index) => (
              <div key={index} className="flex flex-col items-center justify-center">
                <div className="w-20 h-20 md:w-32 md:h-32 flex items-center justify-center">
                  <img 
                    src={feature.image} 
                    alt={feature.name} 
                    title={feature.name}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SilenceFeaturesGridSection;
