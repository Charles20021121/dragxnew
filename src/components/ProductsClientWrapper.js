"use client"
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3
    }
  }
};

export default function ProductsClientWrapper({ children }) {
  return (
    <motion.div
      className="py-1 bg-[#f8f4ec]"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-[1400px] mx-auto px-2">
        <motion.h1
          className="text-[#1c5434] font-bold text-center mb-10 text-[clamp(24px,3vw,40px)]"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        />
        <div>
          {children}
        </div>
      </div>
    </motion.div>
  );
}
