"use client";

import { Eye, MessageCircle, Check, X } from "lucide-react";

export default function DX360SpecTable() {
  const comparison = [
    {
      feature: "Viewing Angle & Coverage",
      standard: "Single Rear 120° View (Blind Spots Remain)",
      dx360: "Full 360° Panoramic Surround 3D Bird's-Eye View (0 Blind Spots)",
      dx360Highlight: true,
    },
    {
      feature: "Blind Spot Monitoring (BSM)",
      standard: "Not Supported",
      dx360: "24GHz / 77GHz Dual Microwave Radar with Side Mirror LED Chime",
      dx360Highlight: true,
    },
    {
      feature: "24-Hour Parking Surveillance",
      standard: "Not Supported (Only Active When Reverse Selected)",
      dx360: "4-Way Continuous Dashcam Loop Recording with G-Sensor Battery Protection",
      dx360Highlight: true,
    },
    {
      feature: "Dynamic Trajectory Guidelines",
      standard: "Static Lines or Basic Guidelines",
      dx360: "Real-Time Steering Wheel Angle Trajectory Tracking Guidelines",
      dx360Highlight: false,
    },
    {
      feature: "Night Vision & Low Light",
      standard: "Standard Analog Video (Grainy in Low Light)",
      dx360: "Starlight HD / SONY Sensor Low-Light Night Vision Clarity",
      dx360Highlight: false,
    },
    {
      feature: "Turning Auto-Trigger",
      standard: "No Signal Trigger",
      dx360: "Auto-Switches to Left/Right Camera View on Turn Signal Indicator",
      dx360Highlight: true,
    },
  ];

  const getWhatsAppUrl = () => {
    const phoneNumber = "60192776056";
    const message = "Hi DRAGX, I would like to inquire about DX360 360° Camera & BSM safety upgrade for my car.";
    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  };

  return (
    <section className="w-full bg-[#030b14] py-16 px-4 sm:px-6 lg:px-8 border-t border-gray-800">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs sm:text-sm font-semibold mb-3">
            <Eye className="w-4 h-4" /> Safety Performance Matrix
          </div>
          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-white uppercase tracking-wider mb-4"
            style={{ fontFamily: "Geometos, sans-serif" }}
          >
            DX360 Vision Suite vs Standard Reverse Camera
          </h2>
          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
            Discover why upgrading to DX360 Surround View & Radar Detection provides complete driving safety and total parking confidence.
          </p>
          <div className="block lg:hidden mt-3 text-xs text-cyan-400/80 font-medium">
            👉 Swipe horizontally to view full comparison
          </div>
        </div>

        {/* Responsive Table */}
        <div className="w-full overflow-x-auto rounded-2xl border border-gray-800 shadow-2xl bg-[#09131e]">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-[#111e2f] border-b border-gray-800 text-cyan-300 text-xs sm:text-sm uppercase tracking-wider">
                <th scope="col" className="py-4 px-6 font-bold w-1/3">Safety Feature</th>
                <th scope="col" className="py-4 px-6 font-bold w-1/3 text-gray-300">
                  Standard Reverse Camera
                </th>
                <th scope="col" className="py-4 px-6 font-bold w-1/3 text-cyan-400">
                  DX360 Panoramic Safety Suite
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/80 text-sm text-gray-200">
              {comparison.map((item, idx) => (
                <tr
                  key={idx}
                  className={`hover:bg-gray-800/40 transition-colors duration-150 ${
                    item.dx360Highlight ? "bg-cyan-950/20" : ""
                  }`}
                >
                  <td className="py-4 px-6 font-semibold text-white whitespace-nowrap">
                    {item.feature}
                  </td>
                  <td className="py-4 px-6 text-gray-400 leading-relaxed">
                    <span className="inline-flex items-center gap-1.5">
                      {item.standard.includes("Not Supported") ? (
                        <X className="w-4 h-4 text-red-400 flex-shrink-0" />
                      ) : null}
                      {item.standard}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-cyan-200 font-medium leading-relaxed">
                    <span className="inline-flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                      {item.dx360}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Call to action */}
        <div className="mt-8 flex justify-center">
          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] hover:bg-[#20ba59] text-black font-bold rounded-xl text-sm transition-all shadow-lg hover:scale-105"
          >
            <MessageCircle className="w-5 h-5" /> Book DX360 Safety Installation
          </a>
        </div>
      </div>
    </section>
  );
}
