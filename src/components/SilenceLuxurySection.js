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
        {/* Optional overlay to ensure text is readable if image is bright */}
        <div className="absolute inset-0 bg-black/40"></div>
        
        {/* Desktop Left Side: Text Content */}
        <div className="absolute inset-0 flex flex-col justify-center items-start pr-[50%] pl-[8%] z-10" style={{ gap: '1.5vw' }}>
          
          {/* Heading with teal background block */}
          <div className="inline-block bg-gradient-to-r from-[#053d40] via-[#053d40]/40 to-transparent rounded-lg md:rounded-l-[1vw] pl-[1.5vw] pr-[2.5vw] py-[1vw] self-start w-max">
            <h2 className="font-bold tracking-wide whitespace-nowrap">
              <span className="text-[#cce4e6]" style={{ fontSize: '2vw', lineHeight: '1.2' }}>When Silence Becomes a True Luxury</span>
            </h2>
          </div>

          {/* Paragraphs */}
          <div className="text-gray-300 text-justify flex flex-col w-full pl-[1.5vw]" style={{ fontSize: '1.05vw', lineHeight: '1.6', gap: '1.5vw' }}>
            <p>
              The often overlooked yet essential components of an automobile are its soundproofing and insulation materials, hidden within its structure. These elements not only shield occupants from external heat but also minimize intrusive noise, ensuring a more peaceful cabin environment.
            </p>
            <p>
              Upgrading to advanced soundproofing and heat insulation provides an enhanced layer of protection from external elements, delivering an unparalleled sense of serenity and comfort.
            </p>
            <p>
              Our skilled experts are here to guide you in upgrading or adding high-performance sound-deadening and heat-resistant materials, transforming your vehicle's interior into a whisper-quiet haven for the ultimate luxurious ride!
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
