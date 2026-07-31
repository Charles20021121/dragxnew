import React from 'react';

const SilenceReductionMethodsSection = () => {
    return (
        <section className="bg-gradient-to-r from-[#082a2d] via-[#041214] to-[#031518] text-white w-full relative overflow-hidden flex flex-col">

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
                {/* Background Overlay Placeholder */}
                <div className="absolute inset-0 z-0 flex justify-center items-center opacity-20 border-t border-b border-gray-800 bg-gray-900/30 border-dashed">
                    <span className="text-gray-500 text-xl md:text-3xl font-bold tracking-widest text-center px-4">Background Image Placeholder (Car)</span>
                </div>

                {/* Content Container */}
                <div className="relative z-10 w-full max-w-[1300px] flex flex-col items-center space-y-8 md:space-y-10">

                    {/* Top Header */}
                    <div className="flex flex-col items-center text-center space-y-4 md:space-y-5">

                        {/* Pill Title */}
                        <div className="bg-gradient-to-r from-[#165355] via-[#0a2729] to-[#06181a] rounded-lg md:rounded-2xl px-2 sm:px-6 md:px-16 py-2 sm:py-3 md:py-5 shadow-lg mb-4 text-center max-w-full overflow-hidden">
                            <h2 className="text-[3.8vw] sm:text-[15px] md:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tighter sm:tracking-tight md:tracking-wide uppercase text-white drop-shadow-md whitespace-nowrap">
                                Understanding Noise Reduction Methods
                            </h2>
                        </div>

                        {/* Subheadings */}
                        <div className="flex flex-row justify-center items-center gap-1 min-[375px]:gap-2 md:gap-8 lg:gap-12 text-[2.8vw] sm:text-[12px] md:text-2xl lg:text-3xl font-bold tracking-tighter md:tracking-wider text-white w-full overflow-hidden">
                            <span className="whitespace-nowrap">- Sound Deadening</span>
                            <span className="whitespace-nowrap">- Soundproofing</span>
                            <span className="whitespace-nowrap">- Sound Absorption</span>
                        </div>

                        {/* Intro Text */}
                        <p className="text-gray-300 text-sm md:text-xl lg:text-2xl mt-2 md:mt-4 lg:whitespace-nowrap text-center">
                            While all three methods aim to reduce noise, they serve distinct purposes and employ different techniques.
                        </p>
                    </div>

                    {/* Three Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 lg:gap-8 w-full">

                        {/* Card 1 */}
                        <div className="flex flex-col bg-black/60 border border-gray-400 rounded-3xl overflow-hidden p-4 md:p-6 space-y-4 backdrop-blur-sm">
                            {/* Image Area */}
                            <div className="w-full h-40 md:h-48 rounded-xl overflow-hidden bg-black/40">
                                <img src="/silence/Understanding Noise Reduction Methods/element-19.webp" alt="Sound Deadening" className="w-full h-full object-contain" />
                            </div>
                            {/* Text Area */}
                            <div className="space-y-2">
                                <h3 className="text-white font-bold text-base md:text-lg lg:text-xl">• Sound Deadening</h3>
                                <p className="text-gray-300 text-sm md:text-base text-justify leading-relaxed">
                                    Designed to enhance audio quality and minimize road noise and vibrations, sound deadening materials are commonly used in vehicles to create a more comfortable and enjoyable driving experience.
                                </p>
                            </div>
                        </div>

                        {/* Card 2 */}
                        <div className="flex flex-col bg-black/60 border border-gray-400 rounded-3xl overflow-hidden p-4 md:p-6 space-y-4 backdrop-blur-sm">
                            {/* Image Area */}
                            <div className="w-full h-40 md:h-48 rounded-xl overflow-hidden bg-black/40">
                                <img src="/silence/Understanding Noise Reduction Methods/element-20.webp" alt="Soundproofing" className="w-full h-full object-contain" />
                            </div>
                            {/* Text Area */}
                            <div className="space-y-2">
                                <h3 className="text-white font-bold text-base md:text-lg lg:text-xl">• Soundproofing</h3>
                                <p className="text-gray-300 text-sm md:text-base text-justify leading-relaxed">
                                    This method uses dense, airtight barriers to block sound from entering or leaving a space. Soundproofing is ideal for situations where preventing sound leakage is essential.
                                </p>
                            </div>
                        </div>

                        {/* Card 3 */}
                        <div className="flex flex-col bg-black/60 border border-gray-400 rounded-3xl overflow-hidden p-4 md:p-6 space-y-4 backdrop-blur-sm">
                            {/* Image Area */}
                            <div className="w-full h-40 md:h-48 rounded-xl overflow-hidden bg-black/40">
                                <img src="/silence/Understanding Noise Reduction Methods/element-21.webp" alt="Sound Absorption" className="w-full h-full object-contain" />
                            </div>
                            {/* Text Area */}
                            <div className="space-y-2">
                                <h3 className="text-white font-bold text-base md:text-lg lg:text-xl">• Sound Absorption</h3>
                                <p className="text-gray-300 text-sm md:text-base text-justify leading-relaxed">
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
