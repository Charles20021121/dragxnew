"use client";

import { Shield, Sparkles, MessageCircle, Check } from "lucide-react";

export default function SilenceSpecTable() {
  const packages = [
    {
      name: "COMFORT PACKAGE",
      tag: "Essential Upgrade",
      tagColor: "bg-gray-700 text-gray-200",
      areas: "4 Doors (Inner & Outer Panels)",
      layers: "2-Layer (Vibration Damping + Acoustic Foam)",
      noiseReduction: "Up to 60% Reduction",
      benefits: "Eliminates door panel vibration, solid door slam feeling, improves car speaker bass & audio clarity",
      warranty: "Lifetime Material Warranty",
      suitedFor: "Daily city commuting, music lovers wanting cleaner door speaker acoustic resonance",
    },
    {
      name: "COMFORT MAX",
      tag: "Most Popular",
      tagColor: "bg-emerald-500/20 text-emerald-300 border border-emerald-400/40",
      areas: "4 Doors + 4 Wheel Arches + Rear Trunk / Boot",
      layers: "3-Layer Composite Insulation",
      noiseReduction: "Up to 75% Reduction",
      benefits: "Drastically cuts tyre roar, road gravel splash noise, and hollow trunk echo vibrations",
      warranty: "Lifetime Material Warranty",
      suitedFor: "Highway drivers, EV / Hybrid cars with noticeable tyre friction noise",
    },
    {
      name: "ACOUSTIC PROMAX",
      tag: "Flagship Full NVH",
      tagColor: "bg-amber-500/20 text-amber-300 border border-amber-400/40",
      areas: "Full Chassis Floor + 4 Doors + Wheel Arches + Trunk + Hood/Firewall",
      layers: "4-Layer Aerospace-Grade NVH Shield",
      noiseReduction: "Up to 90% Noise Cancellation",
      benefits: "Ultra-quiet luxury cabin experience, isolates engine bay heat, reduces cabin temperature & eliminates road fatigue",
      warranty: "Lifetime Material Warranty",
      suitedFor: "Luxury car owners, MPVs (Alphard/Vellfire), long-distance travellers seeking ultimate quietness",
    },
  ];

  const getWhatsAppUrl = (pkgName) => {
    const phoneNumber = "60192776056";
    const message = `Hi DRAGX, I would like to check pricing and package details for DX Silence ${pkgName} for my car.`;
    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  };

  return (
    <section className="w-full bg-[#0a0a0a] py-16 px-4 sm:px-6 lg:px-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs sm:text-sm font-semibold mb-3">
            <Shield className="w-4 h-4" /> Package Comparison
          </div>
          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-white uppercase tracking-wider mb-4"
            style={{ fontFamily: "Geometos, sans-serif" }}
          >
            DX Silence Soundproofing Comparison Matrix
          </h2>
          <p className="text-gray-400 text-sm sm:text-base max-w-3xl mx-auto">
            Choose the ideal noise cancellation package based on treatment areas, material layers, and noise reduction levels for your vehicle.
          </p>
          <div className="block lg:hidden mt-3 text-xs text-emerald-400/80 font-medium">
            👉 Swipe horizontally to view full package comparison
          </div>
        </div>

        {/* Responsive Table */}
        <div className="w-full overflow-x-auto rounded-2xl border border-gray-800 shadow-2xl bg-[#11161d]">
          <table className="w-full text-left border-collapse min-w-[850px]">
            <thead>
              <tr className="bg-[#18202a] border-b border-gray-800 text-emerald-400 text-xs sm:text-sm uppercase tracking-wider">
                <th scope="col" className="py-4 px-5 font-bold">Package Name</th>
                <th scope="col" className="py-4 px-4 font-bold">Treatment Areas</th>
                <th scope="col" className="py-4 px-4 font-bold">Material Layers</th>
                <th scope="col" className="py-4 px-4 font-bold">Noise Reduction</th>
                <th scope="col" className="py-4 px-4 font-bold">Key Acoustic Benefits</th>
                <th scope="col" className="py-4 px-4 font-bold">Warranty</th>
                <th scope="col" className="py-4 px-4 font-bold">Recommended For</th>
                <th scope="col" className="py-4 px-4 font-bold text-center">Inquiry</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/80 text-sm text-gray-200">
              {packages.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-800/40 transition-colors duration-150">
                  {/* Name & Tag */}
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

                  {/* Areas */}
                  <td className="py-4 px-4 text-emerald-300 font-medium whitespace-nowrap">
                    {item.areas}
                  </td>

                  {/* Layers */}
                  <td className="py-4 px-4 whitespace-nowrap text-gray-300">
                    {item.layers}
                  </td>

                  {/* Reduction */}
                  <td className="py-4 px-4 whitespace-nowrap font-bold text-emerald-400">
                    {item.noiseReduction}
                  </td>

                  {/* Benefits */}
                  <td className="py-4 px-4 text-xs text-gray-300 min-w-[220px] leading-relaxed">
                    {item.benefits}
                  </td>

                  {/* Warranty */}
                  <td className="py-4 px-4 whitespace-nowrap text-xs text-amber-300 font-semibold">
                    <span className="inline-flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 text-amber-400" /> {item.warranty}
                    </span>
                  </td>

                  {/* Recommended */}
                  <td className="py-4 px-4 text-xs text-gray-300 min-w-[180px] leading-relaxed">
                    {item.suitedFor}
                  </td>

                  {/* Action */}
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

        {/* Footer note */}
        <div className="mt-6 text-center">
          <p className="text-xs sm:text-sm text-gray-500">
            * All DX Silence materials are 100% odorless, non-toxic, and fire-retardant butyl with lifetime material warranty.
          </p>
        </div>
      </div>
    </section>
  );
}
