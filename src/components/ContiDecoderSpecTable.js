"use client";

import { Cpu, MessageCircle, Check } from "lucide-react";

export default function ContiDecoderSpecTable() {
  const carSystems = [
    {
      brand: "Mercedes-Benz",
      systems: "NTG 4.5 / 4.7 / 5.0 / 5.1 / 5.2 / 6.0 (MBUX)",
      carplay: "Wireless Apple CarPlay",
      androidAuto: "Wireless Android Auto",
      cam360: "Integrated HD 360° Cam Support",
      control: "Original COMAND Rotary Knob + Steering Wheel",
      screen: "Retains Original OEM Screen",
    },
    {
      brand: "BMW / MINI",
      systems: "CIC / NBT / NBT EVO (ID4/ID5/ID6)",
      carplay: "Wireless Apple CarPlay",
      androidAuto: "Wireless Android Auto",
      cam360: "Integrated HD 360° Cam Support",
      control: "Original iDrive Controller + Steering Buttons",
      screen: "Retains Original OEM Screen",
    },
    {
      brand: "Audi",
      systems: "MMI 3G High / 3G+ / MIB 1 / MIB 2 / MIB 3",
      carplay: "Wireless Apple CarPlay",
      androidAuto: "Wireless Android Auto",
      cam360: "Integrated HD 360° Cam Support",
      control: "Original MMI Central Console + Steering Controls",
      screen: "Retains Original OEM Screen",
    },
    {
      brand: "Porsche",
      systems: "PCM 3.1 / PCM 4.0 / CDR Plus",
      carplay: "Wireless Apple CarPlay",
      androidAuto: "Wireless Android Auto",
      cam360: "Integrated HD 360° Cam Support",
      control: "Original Touchscreen + Center Console Buttons",
      screen: "Retains Original OEM Screen",
    },
    {
      brand: "Volkswagen / Lexus / Volvo",
      systems: "MIB 2 / Lexus Remote Touch / Volvo Sensus",
      carplay: "Wireless Apple CarPlay",
      androidAuto: "Wireless Android Auto",
      cam360: "Integrated HD 360° Cam Support",
      control: "Factory Touchscreen / Joystick / Steering Buttons",
      screen: "Retains Original OEM Screen",
    },
  ];

  const getWhatsAppUrl = (brand) => {
    const phoneNumber = "60192776056";
    const message = `Hi DRAGX, I'm checking Conti Decoder compatibility for my ${brand}.`;
    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  };

  return (
    <section className="w-full bg-[#080d14] py-16 px-4 sm:px-6 lg:px-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs sm:text-sm font-semibold mb-3">
            <Cpu className="w-4 h-4" /> Compatibility Matrix
          </div>
          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-white uppercase tracking-wider mb-4"
            style={{ fontFamily: "Geometos, sans-serif" }}
          >
            Conti Decoder Vehicle Compatibility Table
          </h2>
          <p className="text-gray-400 text-sm sm:text-base max-w-3xl mx-auto">
            Upgrade your continental car's factory system with Wireless Apple CarPlay, Android Auto, and 360° Camera without replacing the original dashboard display or cutting wires.
          </p>
          <div className="block lg:hidden mt-3 text-xs text-blue-400/80 font-medium">
            👉 Swipe horizontally to view vehicle system compatibility
          </div>
        </div>

        {/* Responsive Table */}
        <div className="w-full overflow-x-auto rounded-2xl border border-gray-800 shadow-2xl bg-[#0f1722]">
          <table className="w-full text-left border-collapse min-w-[850px]">
            <thead>
              <tr className="bg-[#152130] border-b border-gray-800 text-blue-300 text-xs sm:text-sm uppercase tracking-wider">
                <th scope="col" className="py-4 px-5 font-bold">Vehicle Brand</th>
                <th scope="col" className="py-4 px-4 font-bold">Supported OEM Systems</th>
                <th scope="col" className="py-4 px-4 font-bold">CarPlay & Android Auto</th>
                <th scope="col" className="py-4 px-4 font-bold">360° Cam Interface</th>
                <th scope="col" className="py-4 px-4 font-bold">Factory Control Integration</th>
                <th scope="col" className="py-4 px-4 font-bold">Screen Status</th>
                <th scope="col" className="py-4 px-4 font-bold text-center">Compatibility</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/80 text-sm text-gray-200">
              {carSystems.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-800/40 transition-colors duration-150">
                  <td className="py-4 px-5 font-bold text-white whitespace-nowrap text-base">
                    {item.brand}
                  </td>
                  <td className="py-4 px-4 text-blue-300 font-medium whitespace-nowrap">
                    {item.systems}
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap text-emerald-400 font-medium">
                    <span className="inline-flex items-center gap-1">
                      <Check className="w-4 h-4" /> Wireless & Wired
                    </span>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap text-gray-300">
                    {item.cam360}
                  </td>
                  <td className="py-4 px-4 text-xs text-gray-300 leading-relaxed min-w-[180px]">
                    {item.control}
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap text-xs text-emerald-300 font-semibold">
                    {item.screen}
                  </td>
                  <td className="py-4 px-4 text-center whitespace-nowrap">
                    <a
                      href={getWhatsAppUrl(item.brand)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#25D366]/20 hover:bg-[#25D366] text-[#25D366] hover:text-black border border-[#25D366]/40 rounded-lg text-xs font-bold transition-all duration-200 shadow-sm hover:scale-105"
                    >
                      <MessageCircle className="w-3.5 h-3.5" /> Inquire
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
            * 100% Plug-and-Play installation. No wire cutting, preserves original factory vehicle functions and warranties.
          </p>
        </div>
      </div>
    </section>
  );
}
