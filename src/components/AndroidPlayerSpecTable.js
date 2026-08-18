"use client";

import Link from "next/link";
import { Check, Sparkles, MessageCircle } from "lucide-react";

export default function AndroidPlayerSpecTable() {
  const seriesSpecs = [
    {
      name: "EI Series",
      tag: "Budget Friendly",
      tagColor: "bg-gray-700 text-gray-200",
      cpu: "4-Core / 8-Core",
      memory: "2GB+32GB / 4GB+64GB",
      screen: '9" / 10" HD IPS (1280x720)',
      camera360: "Optional (Select Models)",
      carplay: "Wireless CarPlay / Auto",
      dsp: "16-Band Basic DSP",
      suitedFor: "Daily navigation (Waze/Maps), radio & music streaming",
      hash: "TRONMMEXT_EI_series",
    },
    {
      name: "Advance Series",
      tag: "Great Value",
      tagColor: "bg-blue-900/70 text-blue-200 border border-blue-500/30",
      cpu: "8-Core High Speed",
      memory: "4GB RAM + 64GB ROM",
      screen: '9" / 10" QLED High Contrast',
      camera360: "Supported (AHD)",
      carplay: "Wireless CarPlay / Auto",
      dsp: "32-Band Digital DSP",
      suitedFor: "Smooth multitasking, YouTube streaming & responsive touch",
      hash: "Advance_series",
    },
    {
      name: "Cyber Series",
      tag: "Most Popular",
      tagColor: "bg-emerald-500/20 text-emerald-300 border border-emerald-400/40",
      cpu: "8-Core 2.0GHz High Performance",
      memory: "4GB+64GB / 6GB+128GB",
      screen: '9" / 10" / 12" 2K QLED Ultra Clear',
      camera360: "Native HD 360° Ready",
      carplay: "Wireless CarPlay / Auto",
      dsp: "48-Band Audiophile DSP",
      suitedFor: "Heavy app users, high-definition 360 camera integration",
      hash: "Cyber_series",
    },
    {
      name: "Diamond / 40 Series",
      tag: "Premium Grade",
      tagColor: "bg-amber-500/20 text-amber-300 border border-amber-400/40",
      cpu: "8-Core Ultra Fast",
      memory: "6GB+128GB / 8GB+128GB",
      screen: '2K Super QLED / Anti-Glare',
      camera360: "3D Real-Time 360° Cam",
      carplay: "Wireless CarPlay / Auto",
      dsp: "Professional DSP + Optical Out",
      suitedFor: "Luxury interiors, crystal-clear 2K display & split-screen",
      hash: "Diamond_series",
    },
    {
      name: "Ultra / LYNO Series",
      tag: "Flagship Top-Tier",
      tagColor: "bg-purple-500/20 text-purple-300 border border-purple-400/40",
      cpu: "6nm 8-Core UIS 7870 (2.7GHz)",
      memory: "8GB RAM + 256GB ROM",
      screen: '2K Full Fit QLED Display',
      camera360: "3D Dynamic Trajectory 360°",
      carplay: "Wireless CarPlay / Auto",
      dsp: "Dual DSP + Hi-Fi DTS Audio",
      suitedFor: "Automotive enthusiasts, maximum speed & ultimate sound quality",
      hash: "Lyno",
      href: "/lyno",
    },
  ];

  const getWhatsAppUrl = (seriesName) => {
    const phoneNumber = "60192776056";
    const message = `Hi DRAGX, I would like to inquire about the ${seriesName} for my car.`;
    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  };

  return (
    <section className="w-full bg-[#001f1d] py-16 px-4 sm:px-6 lg:px-8 border-t border-[#04423a]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs sm:text-sm font-semibold mb-3">
            <Sparkles className="w-4 h-4" /> Comprehensive Comparison
          </div>
          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-white uppercase tracking-wider mb-4"
            style={{ fontFamily: "Geometos, sans-serif" }}
          >
            Android Player Series Specification Matrix
          </h2>
          <p className="text-gray-300 text-sm sm:text-base max-w-3xl mx-auto">
            Compare processors, memory capacities, screen resolutions, and 360° camera capabilities across all DRAGX Android Player models to find the perfect fit for your vehicle.
          </p>
          <div className="block lg:hidden mt-3 text-xs text-emerald-400/80 font-medium">
            👉 Swipe horizontally to view full specifications
          </div>
        </div>

        {/* Responsive Table Container */}
        <div className="w-full overflow-x-auto rounded-2xl border border-[#065850] shadow-2xl bg-[#011413]">
          <table className="w-full text-left border-collapse min-w-[850px]">
            <thead>
              <tr className="bg-[#02312d] border-b border-[#065850] text-emerald-300 text-xs sm:text-sm uppercase tracking-wider">
                <th scope="col" className="py-4 px-5 font-bold">Series Model</th>
                <th scope="col" className="py-4 px-4 font-bold">Processor (CPU)</th>
                <th scope="col" className="py-4 px-4 font-bold">RAM + Storage</th>
                <th scope="col" className="py-4 px-4 font-bold">Screen Display</th>
                <th scope="col" className="py-4 px-4 font-bold">360° Camera</th>
                <th scope="col" className="py-4 px-4 font-bold">CarPlay / Auto</th>
                <th scope="col" className="py-4 px-4 font-bold">DSP Sound</th>
                <th scope="col" className="py-4 px-4 font-bold">Recommended For</th>
                <th scope="col" className="py-4 px-4 font-bold text-center">Inquiry</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#06423c] text-sm text-gray-200">
              {seriesSpecs.map((item, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-[#032e2a]/70 transition-colors duration-150"
                >
                  {/* Model Name & Tag */}
                  <td className="py-4 px-5 font-semibold text-white whitespace-nowrap">
                    <div className="flex flex-col gap-1.5 items-start">
                      <span className="text-base font-bold text-white tracking-wide">
                        {item.name}
                      </span>
                      {item.tag && (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${item.tagColor}`}>
                          {item.tag}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* CPU */}
                  <td className="py-4 px-4 whitespace-nowrap text-gray-300">
                    {item.cpu}
                  </td>

                  {/* Memory */}
                  <td className="py-4 px-4 whitespace-nowrap font-medium text-emerald-300">
                    {item.memory}
                  </td>

                  {/* Screen */}
                  <td className="py-4 px-4 whitespace-nowrap text-gray-300">
                    {item.screen}
                  </td>

                  {/* 360 Cam */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md bg-[#022623] border border-emerald-500/20 text-emerald-200">
                      {item.camera360}
                    </span>
                  </td>

                  {/* CarPlay */}
                  <td className="py-4 px-4 whitespace-nowrap text-emerald-400 font-medium flex items-center gap-1 mt-3.5">
                    <Check className="w-4 h-4 flex-shrink-0" />
                    <span>Wireless</span>
                  </td>

                  {/* DSP */}
                  <td className="py-4 px-4 whitespace-nowrap text-gray-300">
                    {item.dsp}
                  </td>

                  {/* Suited For */}
                  <td className="py-4 px-4 text-xs text-gray-300 min-w-[200px] leading-relaxed">
                    {item.suitedFor}
                  </td>

                  {/* WhatsApp Action */}
                  <td className="py-4 px-4 text-center whitespace-nowrap">
                    <a
                      href={getWhatsAppUrl(item.name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#25D366]/20 hover:bg-[#25D366] text-[#25D366] hover:text-black border border-[#25D366]/40 rounded-lg text-xs font-bold transition-all duration-200 shadow-sm hover:scale-105"
                    >
                      <MessageCircle className="w-3.5 h-3.5" /> Quote
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bottom Tip */}
        <div className="mt-6 text-center">
          <p className="text-xs sm:text-sm text-gray-400">
            * All DRAGX Android Players include customized OEM plug-and-play wiring sockets, factory steering control decoders, and full manufacturer warranty protection.
          </p>
        </div>
      </div>
    </section>
  );
}
