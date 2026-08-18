"use client";

import { Power, MessageCircle, Check } from "lucide-react";

export default function PowerBootSpecTable() {
  const features = [
    {
      feature: "Intelligent Anti-Pinch Safety",
      detail: "Built-in smart resistance sensor automatically stops and reverses when detecting obstacles",
      standard: true,
    },
    {
      feature: "Original Key Remote Control",
      detail: "Opens and closes directly via your factory remote key button (3x press or long press)",
      standard: true,
    },
    {
      feature: "Height Memory Adjustment",
      detail: "Set and memorize desired tailgate opening height to suit low garages or driver height",
      standard: true,
    },
    {
      feature: "Dual Control Buttons",
      detail: "Front dashboard button + rear tailgate close button included for effortless access",
      standard: true,
    },
    {
      feature: "Soft-Close Electric Suction Latch",
      detail: "Smooth, silent closing without noisy slamming or door latch wear",
      standard: true,
    },
    {
      feature: "Hands-Free Foot Kick Sensor",
      detail: "Opens/closes tailgate with a subtle foot wave under rear bumper when hands are full",
      standard: "Optional Upgrade",
    },
    {
      feature: "Installation & Wiring",
      detail: "100% Dedicated OEM brackets and plug-to-plug sockets with zero factory wire cutting",
      standard: true,
    },
  ];

  const getWhatsAppUrl = () => {
    const phoneNumber = "60192776056";
    const message = "Hi DRAGX, I would like to check DX Power Boot price and installation for my car.";
    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  };

  return (
    <section className="w-full bg-[#120505] py-16 px-4 sm:px-6 lg:px-8 border-t border-red-900/30">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-300 text-xs sm:text-sm font-semibold mb-3">
            <Power className="w-4 h-4" /> Feature Breakdown
          </div>
          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-white uppercase tracking-wider mb-4"
            style={{ fontFamily: "Geometos, sans-serif" }}
          >
            DX Power Boot System Specifications
          </h2>
          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
            Engineered for durability, silence, and effortless convenience with complete anti-pinch vehicle protection.
          </p>
          <div className="block lg:hidden mt-3 text-xs text-red-400/80 font-medium">
            👉 Swipe horizontally to view full features
          </div>
        </div>

        {/* Responsive Table */}
        <div className="w-full overflow-x-auto rounded-2xl border border-red-900/40 shadow-2xl bg-[#1c0808]">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-[#2a0c0c] border-b border-red-900/40 text-red-300 text-xs sm:text-sm uppercase tracking-wider">
                <th scope="col" className="py-4 px-6 font-bold w-1/3">System Feature</th>
                <th scope="col" className="py-4 px-6 font-bold w-1/2">Technical Functionality & Safety</th>
                <th scope="col" className="py-4 px-6 font-bold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-red-900/30 text-sm text-gray-200">
              {features.map((item, idx) => (
                <tr key={idx} className="hover:bg-red-950/40 transition-colors duration-150">
                  <td className="py-4 px-6 font-semibold text-white whitespace-nowrap">
                    {item.feature}
                  </td>
                  <td className="py-4 px-6 text-gray-300 leading-relaxed text-xs sm:text-sm">
                    {item.detail}
                  </td>
                  <td className="py-4 px-6 text-center whitespace-nowrap">
                    {typeof item.standard === "boolean" ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/30">
                        <Check className="w-3.5 h-3.5" /> Included Standard
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/30">
                        ✨ Optional Add-on
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Action */}
        <div className="mt-8 flex justify-center">
          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] hover:bg-[#20ba59] text-black font-bold rounded-xl text-sm transition-all shadow-lg hover:scale-105"
          >
            <MessageCircle className="w-5 h-5" /> Inquire Power Boot For My Car
          </a>
        </div>
      </div>
    </section>
  );
}
