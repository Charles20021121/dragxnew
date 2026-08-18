"use client"
import { motion } from "framer-motion"
import HeroSection from "@/components/HeroSection"

const locations = [
  {
    name: "DRAGX Maluri Cheras",
    address: "28, Jalan Jejaka 9, Maluri, 55100 Cheras, Wilayah Persekutuan Kuala Lumpur",
    mapLink: "https://maps.app.goo.gl/hp3ndNgNX5CG4ERp7"
  },
  {
    name: "DRAGX Batu Caves",
    address: "141, JIn Sbc 1, Taman Sri Batu Caves, 68100 Batu Caves, Selangor",
    mapLink: "https://maps.app.goo.gl/19MGjx5KyPuggbQ18"
  },
  {
    name: "DRAGX Equine Park",
    address: "9, JIn Equine 1g, Taman Equine, 43300 Seri Kembangan, Selangor",
    mapLink: "https://maps.app.goo.gl/RGKAHs8L1CJrz2y66"
  },
  {
    name: "DRAGX Balakong Alphard/Vellfire",
    address: "Lot 24, Persiaran Cheras Raya 4, Balakong, 43200 Cheras, Selangor",
    mapLink: "https://maps.app.goo.gl/DxQirLWmaRi3CTbF7"
  },
  {
    name: "DRAGX Shah Alam",
    address: "49, Jalan Pelabur B 23/B, Seksyen 23, 40300 Shah Alam, Selangor",
    mapLink: "https://maps.app.goo.gl/V7xZDMNEL1RWPC8BA"
  },
  {
    name: "DRAGX Balakong",
    address: "Kampong Dato Ujang Balakong, Lot 23, Batu 11, Balakong,43200 Cheras, Selangor",
    mapLink: "https://maps.app.goo.gl/kuKH2Zs33TUWWFZ28"
  },
  {
    name: "DRAGX Puchong",
    address: "22a, Jalan Puteri 4/8, Bandar Puteri, 47100 Puchong, Selangor",
    mapLink: "https://maps.app.goo.gl/W7iTewJV5RDpQw496"
  },
  {
    name: "COMING SOON",
    address: "",
    mapLink: ""
  }
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1]
    }
  }
}

const handleLocationClick = (location) => {
  if (window.fbq) {
    window.fbq('track', 'FindLocation', {
      content_name: location.name,
      content_category: 'Store Location'
    });
  }
};

export default function Locations() {
  return (
    <div className="min-h-screen">
      <HeroSection
        image="/locations/PCmap.webp"
        aspectRatio="3334 / 1562"
        mobileImage="/locations/PHONEmap.webp"
        mobileAspectRatio="3334/2929"
      />

      <div
        className="relative bg-cover bg-center py-5"
        style={{
          backgroundImage: 'url(https://pub-332f16c726da4f048f11221d7baacb53.r2.dev/dragx/dragx/obxfovzofmswunpamu9k.webp)'
        }}
      >
        {/* 背景遮罩 */}
        <div className="absolute inset-0 bg-black/30" />

        <motion.div
          className="relative mx-auto px-2 md:px-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {locations.map((location, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group"
              >
                <div className="border border-white/20 bg-black/10 backdrop-blur-[2px] rounded-lg p-4 md:p-5 h-full
                  hover:border-[#7DBF3F]/50 hover:bg-black/20 transition-all duration-300">
                  <h3 className="text-lg md:text-xl font-bold mb-3">
                    <span className="text-[#7DBF3F]">
                      {location.name.split(" ")[0]}
                    </span>
                    <span className="text-white">
                      {" " + location.name.split(" ").slice(1).join(" ")}
                    </span>
                  </h3>

                  {location.address && (
                    <p className="text-gray-200 mb-4 min-h-[60px] text-sm md:text-base">
                      {location.address}
                    </p>
                  )}

                  {location.mapLink && (
                    <div className="text-right">
                      <a
                        href={location.mapLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-[#7DBF3F] hover:text-[#9ed867] transition-colors duration-300 group"
                        onClick={() => handleLocationClick(location)}
                      >
                        Direction
                        <svg
                          className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </a>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Schema.org LocalBusiness / AutoPartsStore for all branches */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": locations
              .filter((loc) => loc.address)
              .map((loc) => ({
                "@type": "AutoPartsStore",
                "name": loc.name,
                "url": "https://www.dragx.asia/locations",
                "telephone": "+60192776056",
                "priceRange": "$$",
                "address": {
                  "@type": "PostalAddress",
                  "streetAddress": loc.address,
                  "addressCountry": "MY"
                },
                "hasMap": loc.mapLink,
                "parentOrganization": {
                  "@type": "Organization",
                  "name": "DRAGX",
                  "url": "https://www.dragx.asia/"
                }
              }))
          })
        }}
      />
    </div>
  )
}