import React from 'react';

const SilenceReductionMethodsSection = () => {
    return (
        <section 
            className="text-white w-full relative overflow-hidden flex flex-col bg-black bg-no-repeat bg-cover bg-center"
            style={{ backgroundImage: `url('/silence/Understanding Noise Reduction Methods/backgrond.webp')` }}
        >

            {/* ============================== */}
            {/* MOBILE LAYOUT */}
            {/* ============================== */}
            <div className="md:hidden w-full relative block">
                <img 
                    src="/silence/Phone/4.webp" 
                    alt="Understanding Noise Reduction Methods Mobile Banner" 
                    className="w-full h-auto"
                />
            </div>

            {/* ============================== */}
            {/* DESKTOP LAYOUT */}
            {/* ============================== */}
            <div className="hidden md:flex flex-col items-center py-10 md:py-16 px-6 md:px-12 lg:px-20 xl:px-32 relative w-full min-h-[500px]">
                {/* Dark Overlay for Readability */}
                <div className="absolute inset-0 z-0 bg-black/40"></div>

                {/* Content Container */}
                <div className="relative z-10 w-full max-w-[1300px] flex flex-col items-center space-y-8 md:space-y-10">

                    {/* Top Header */}
                    <div className="flex flex-col items-center text-center space-y-2 md:space-y-4 mb-4 md:mb-8">
                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-widest uppercase text-[#c0e1e1] drop-shadow-lg leading-tight">
                            UNDERSTANDING NOISE<br />
                            REDUCTION METHODS
                        </h2>
                        <p className="text-gray-200 text-base md:text-xl lg:text-2xl font-light tracking-wider">
                            Different Purpose. Different Technology.
                        </p>
                    </div>

                    {/* Three Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 lg:gap-8 w-full">

                        {/* Card 1 */}
                        <div className="flex flex-col bg-transparent border border-white/30 rounded-[2rem] p-6 md:p-8 space-y-4 backdrop-blur-sm">
                            {/* Image Area */}
                            <div className="w-full h-40 md:h-48 rounded-xl overflow-hidden flex justify-center items-center">
                                <img src="/silence/Understanding Noise Reduction Methods/element-19.webp" alt="Sound Deadening" className="w-full h-full object-contain drop-shadow-xl" />
                            </div>
                            {/* Text Area */}
                            <div className="space-y-2 mt-4">
                                <h3 className="text-white font-bold text-lg md:text-xl lg:text-2xl">• Sound Deadening</h3>
                                <p className="text-gray-300 text-xs md:text-sm lg:text-base text-justify leading-relaxed">
                                    Designed to enhance audio quality and minimize road noise and vibrations, sound deadening materials are commonly used in vehicles to create a more comfortable and enjoyable driving experience.
                                </p>
                            </div>
                        </div>

                        {/* Card 2 */}
                        <div className="flex flex-col bg-transparent border border-white/30 rounded-[2rem] p-6 md:p-8 space-y-4 backdrop-blur-sm">
                            {/* Image Area */}
                            <div className="w-full h-40 md:h-48 rounded-xl overflow-hidden flex justify-center items-center">
                                <img src="/silence/Understanding Noise Reduction Methods/element-20.webp" alt="Soundproofing" className="w-full h-full object-contain drop-shadow-xl" />
                            </div>
                            {/* Text Area */}
                            <div className="space-y-2 mt-4">
                                <h3 className="text-white font-bold text-lg md:text-xl lg:text-2xl">• Soundproofing</h3>
                                <p className="text-gray-300 text-xs md:text-sm lg:text-base text-justify leading-relaxed">
                                    This method uses dense, airtight barriers to block sound from entering or leaving a space. Soundproofing is ideal for situations where preventing sound leakage is essential.
                                </p>
                            </div>
                        </div>

                        {/* Card 3 */}
                        <div className="flex flex-col bg-transparent border border-white/30 rounded-[2rem] p-6 md:p-8 space-y-4 backdrop-blur-sm">
                            {/* Image Area */}
                            <div className="w-full h-40 md:h-48 rounded-xl overflow-hidden flex justify-center items-center">
                                <img src="/silence/Understanding Noise Reduction Methods/element-21.webp" alt="Sound Absorption" className="w-full h-full object-contain drop-shadow-xl" />
                            </div>
                            {/* Text Area */}
                            <div className="space-y-2 mt-4">
                                <h3 className="text-white font-bold text-lg md:text-xl lg:text-2xl">• Sound Absorption</h3>
                                <p className="text-gray-300 text-xs md:text-sm lg:text-base text-justify leading-relaxed">
                                    Soft, porous materials are used to trap and convert sound waves, improving the acoustic quality within a space. This method is perfect for reducing echoes and reverberation, enhancing speech clarity.
                                </p>
                            </div>
                        </div>

                    </div>

                    {/* Bottom Footer Text */}
                    <div className="pt-2 text-gray-300 text-sm md:text-base lg:text-lg text-justify max-w-5xl leading-relaxed">
                        Combining sound-absorbing and sound-blocking materials often provides an effective shield against noise pollution. However, understanding the unique characteristics of these methods is crucial for selecting the right solution for your specific needs
                    </div>

                </div>
            </div>
        </section>
    );
};

export default SilenceReductionMethodsSection;
