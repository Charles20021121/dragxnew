"use client"
import { CldImage } from 'next-cloudinary';
import Link from 'next/link';
import { motion } from "framer-motion";

export default function GalleryDetailPage({
  product,
  category,
  isAdmin,
  onEdit,
  onAddImage
}) {
  return (
    <main className="min-h-screen bg-[#f8f4ec] relative pb-20">
      {/* Breadcrumb */}
      <nav className="py-4 px-5">
        <ol className="flex items-center gap-2 text-xs whitespace-nowrap overflow-hidden">
          <li>
            <Link href={isAdmin ? "/admin" : "/"} className="text-black hover:text-[#1c5434]">
              {isAdmin ? "Admin" : "Home"}
            </Link>
          </li>
          <span>/</span>
          <li>
            <Link href={isAdmin ? "/admin/gallery" : "/gallery"} className="text-black hover:text-[#1c5434]">
              Gallery
            </Link>
          </li>
          <span>/</span>
          <li>
            <Link href={isAdmin ? `/admin/gallery/${category}` : `/gallery/${category}`} className="text-black hover:text-[#1c5434] capitalize">
              {category}
            </Link>
          </li>
          <span>/</span>
          <li className="text-black">
            {product.name}
          </li>
        </ol>
      </nav>

      <div className="px-5">
        {/* Title Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-5">
            <motion.h1 
              className="text-[#023f1b] font-bold text-[clamp(24px,3vw,32px)]"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              {product.name}
            </motion.h1>
            {product.buy && (
              <a
                href={product.buy}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#88bc04] text-white px-6 py-2 rounded-full hover:bg-[#7aa704] transition-colors"
              >
                Shop Now
              </a>
            )}
          </div>
          <motion.div 
            className="h-[1px] bg-[#023f1b] w-full opacity-50"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={{ transformOrigin: 'left' }}
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Main Image */}
          <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
            <CldImage
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {product.specifications && (
              <div>
                <h2 className="text-xl font-semibold text-[#1c5434] mb-3">Specifications</h2>
                <div className="prose prose-sm max-w-none">
                  {product.specifications.split('\n').map((line, index) => (
                    <p key={index}>{line}</p>
                  ))}
                </div>
              </div>
            )}

            {product.description && (
              <div>
                <h2 className="text-xl font-semibold text-[#1c5434] mb-3">Description</h2>
                <div className="prose prose-sm max-w-none">
                  {product.description.split('\n').map((line, index) => (
                    <p key={index}>{line}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Admin Buttons */}
      {isAdmin && (
        <div className="fixed bottom-6 right-6 flex flex-col gap-4">
          {/* Edit Button */}
          <button
            onClick={onEdit}
            className="p-4 bg-[#1c5434] text-white rounded-full shadow-lg hover:bg-[#143a25] transition-colors duration-300 group"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>

          {/* Add Image Button */}
          <button
            onClick={onAddImage}
            className="bg-[#1c5434] hover:bg-[#143a25] text-white p-4 rounded-full shadow-lg flex items-center gap-2 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
          </button>
        </div>
      )}
    </main>
  );
} 