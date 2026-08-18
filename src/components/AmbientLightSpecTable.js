"use client";

import { Sparkles, MessageCircle, Check, X } from "lucide-react";

export default function AmbientLightSpecTable() {
  const options = [
    {
      feature: "Control Method",
      universal: "iOS / Android Bluetooth Mobile App + Wireless Remote",
      oem: "OEM Infotainment Screen + Steering Controls + Mobile App",
      highlight: true,
    },
    {
      feature: "Light Bar Appearance",
      universal: "Ultra-thin Embedded Fiber Optic (Concealed Gap Fit)",
      oem: "100% Dedicated Custom-Molded OEM Trim Bars (Factory Look)",
      highlight: false,
    },
    {
      feature: "Color Spectrum & Modes",
      universal: "64 / 128 Colors + Flowing Water & Music Sync Modes",
      oem: "64 / 128 Colors + Multi-Zone Control + Welcome Lighting",
      highlight: false,
    },
    {
      feature: "Blind Spot / Safety Sync",
      universal: "Stand-alone Ambient Lighting",
      oem: "Integrates with Factory Blind Spot Warning / Door Open Flash",
      highlight: true,
    },
    {
      feature: "Vehicle Compatibility",
      universal: "99% Universal Fit (All Sedan, SUV, MPV Models)",
      oem: "Vehicle Specific (Mercedes, BMW, Audi, Alphard, Vellfire, etc.)",
      highlight: false,
    },
    {
      feature: "Installation Wiring",
      universal: "Plug-and-Play Fuse Tap (Zero Wire Slicing)",
      oem: "OEM Protocol Plug-to-Plug Harness Socket",
      highlight: false,
    },
    {
      feature: "Estimated Install Time",
      universal: "2.0 – 3.0 Hours",
      oem: "3.0 – 4.5 Hours (Full Precision Panel Integration)",
      highlight: false,
    },
  ];

  const getWhatsAppUrl = (type) => {
    const phoneNumber = "60192776056";
    const message = `Hi DRAGX, I'm interested in ${type} Ambient Light for my car model.`;
    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  };

  return (
    <section className="w-full bg-[#0a0f16] py-16 px-4 sm:px-6 lg:px-8 border-t border-gray-800">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs sm:text-sm font-semibold mb-3">
            <Sparkles className="w-4 h-4" /> Lighting Comparison
          </div>
          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-white uppercase tracking-wider mb-4"
            style={{ fontFamily: "Geometos, sans-serif" }}
          >
            Universal vs OEM Ambient Light Matrix
          </h2>
          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
            Compare key features, control interfaces, and installation options between Universal and OEM-Integrated systems.
          </p>
          <div className="block lg:hidden mt-3 text-xs text-purple-400/80 font-medium">
            👉 Swipe horizontally to view full comparison
          </div>
        </div>

        {/* Responsive Table */}
        <div className="w-full overflow-x-auto rounded-2xl border border-gray-800 shadow-2xl bg-[#101722]">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-[#172233] border-b border-gray-800 text-purple-300 text-xs sm:text-sm uppercase tracking-wider">
                <th scope="col" className="py-4 px-6 font-bold w-1/3">Feature Category</th>
                <th scope="col" className="py-4 px-6 font-bold w-1/3">
                  <div className="flex flex-col">
                    <span className="text-white text-base">Universal Ambient Light</span>
                    <span className="text-xs text-gray-400 font-normal">Flexible & Affordable For Any Car</span>
                  </div>
                </th>
                <th scope="col" className="py-4 px-6 font-bold w-1/3">
                  <div className="flex flex-col">
                    <span className="text-emerald-400 text-base">OEM Integrated Ambient Light</span>
                    <span className="text-xs text-emerald-400/70 font-normal">Factory Look & Original Screen Control</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/80 text-sm text-gray-200">
              {options.map((item, idx) => (
                <tr
                  key={idx}
                  className={`hover:bg-gray-800/40 transition-colors duration-150 ${
                    item.highlight ? "bg-purple-950/20" : ""
                  }`}
                >
                  <td className="py-4 px-6 font-semibold text-white whitespace-nowrap">
                    {item.feature}
                  </td>
                  <td className="py-4 px-6 text-gray-300 leading-relaxed">
                    {item.universal}
                  </td>
                  <td className="py-4 px-6 text-emerald-200 font-medium leading-relaxed">
                    {item.oem}
                  </td>
                </tr>
              ))}

              {/* Inquiry Action Row */}
              <tr className="bg-[#141d2b]">
                <td className="py-5 px-6 font-bold text-white">Get Instant Quote</td>
                <td className="py-5 px-6">
                  <a
                    href={getWhatsAppUrl("Universal")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-xs font-bold transition-all shadow-sm"
                  >
                    <MessageCircle className="w-4 h-4" /> Quote Universal
                  </a>
                </td>
                <td className="py-5 px-6">
                  <a
                    href={getWhatsAppUrl("OEM Integrated")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#25D366] hover:bg-[#20ba59] text-black rounded-lg text-xs font-bold transition-all shadow-sm hover:scale-105"
                  >
                    <MessageCircle className="w-4 h-4" /> Quote OEM System
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
