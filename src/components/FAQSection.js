"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function FAQSection({
  title = "Frequently Asked Questions",
  subtitle = "Everything you need to know about our products and installation",
  items = [],
  theme = "dark", // "dark" | "light" | "green"
  className = "",
}) {
  const [openIndex, setOpenIndex] = useState(null);

  if (!items || items.length === 0) return null;

  const toggleItem = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Schema.org FAQPage JSON-LD
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": items.map((item) => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer,
      },
    })),
  };

  // Theme-based styles
  const isDark = theme === "dark";
  const isGreen = theme === "green";

  const containerBg = isDark
    ? "bg-[#0b1015]"
    : isGreen
    ? "bg-[#002b2a]"
    : "bg-[#f8f6f0]";

  const titleColor = isDark || isGreen ? "text-white" : "text-[#1c5434]";
  const subtitleColor = isDark
    ? "text-gray-400"
    : isGreen
    ? "text-[#b3c9c6]"
    : "text-gray-600";

  const cardBg = isDark
    ? "bg-[#141b22] border-gray-800 hover:border-gray-700"
    : isGreen
    ? "bg-[#033a39] border-[#075351] hover:border-[#0f7370]"
    : "bg-white border-gray-200 hover:border-[#1c5434]/40";

  const questionColor = isDark || isGreen ? "text-white" : "text-gray-900";
  const answerColor = isDark
    ? "text-gray-300"
    : isGreen
    ? "text-[#d1e3e1]"
    : "text-gray-700";

  return (
    <section className={`w-full py-16 md:py-24 px-4 sm:px-6 lg:px-8 ${containerBg} ${className}`}>
      {/* Schema.org FAQPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2
            className={`text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-4 ${titleColor}`}
            style={{ fontFamily: "Geometos, sans-serif" }}
          >
            {title}
          </h2>
          {subtitle && (
            <p
              className={`text-sm sm:text-base md:text-lg max-w-2xl mx-auto ${subtitleColor}`}
            >
              {subtitle}
            </p>
          )}
        </div>

        {/* Accordion Items */}
        <div className="space-y-4">
          {items.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${cardBg}`}
              >
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full py-5 px-6 flex items-center justify-between text-left focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span
                    className={`font-semibold text-base sm:text-lg pr-4 ${questionColor}`}
                  >
                    {item.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${
                      isOpen ? "transform rotate-180 text-emerald-400" : "text-gray-400"
                    }`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <div
                        className={`px-6 pb-6 pt-1 text-sm sm:text-base leading-relaxed ${answerColor} border-t ${
                          isDark
                            ? "border-gray-800/80"
                            : isGreen
                            ? "border-[#054947]"
                            : "border-gray-100"
                        }`}
                      >
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
