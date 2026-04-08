import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function ProductCard({ product, categoryPath }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col"
    >
      <Link
        href={`/products/${categoryPath}/${product.slug}`}
        className="group"
      >
        <div className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
          <div className="relative aspect-square">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
          </div>
        </div>
        <div className="mt-3 text-center">
          <h3 className="text-[#1c5434] font-bold text-[clamp(14px,1.5vw,16px)] group-hover:text-[#023f1b] transition-colors duration-300">
            {product.name}
          </h3>
        </div>
      </Link>
    </motion.div>
  );
} 