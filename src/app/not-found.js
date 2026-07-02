import Link from 'next/link';

export const metadata = {
  title: '404 - Page Not Found | DRAGX',
  description: 'The page you are looking for does not exist.',
};

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#f8f4ec] flex items-center justify-center px-4">
      <div className="text-center max-w-lg mx-auto">
        {/* 404 Number */}
        <div className="relative mb-6">
          <h1 className="text-[120px] md:text-[160px] font-black text-[#1c5434] leading-none select-none opacity-10">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[80px] md:text-[100px] font-black text-[#1c5434] leading-none">
              404
            </span>
          </div>
        </div>

        {/* Message */}
        <h2 className="text-2xl md:text-3xl font-bold text-[#1c5434] mb-3">
          Page Not Found
        </h2>
        <p className="text-gray-600 text-base mb-8">
          The page you are looking for doesn&apos;t exist or has been moved.
        </p>

        {/* Divider */}
        <div className="h-[2px] bg-gradient-to-r from-transparent via-[#1c5434] to-transparent mb-8 opacity-30" />

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-[#1c5434] text-white font-semibold px-8 py-3 rounded-full hover:bg-[#143a25] transition-colors duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Back to Home
          </Link>
          <Link
            href="/products/androidplayer"
            className="inline-flex items-center justify-center gap-2 border-2 border-[#1c5434] text-[#1c5434] font-semibold px-8 py-3 rounded-full hover:bg-[#1c5434] hover:text-white transition-colors duration-300"
          >
            Browse Products
          </Link>
        </div>

        {/* Brand */}
        <p className="mt-10 text-xs text-gray-400 uppercase tracking-widest">
          DRAGX — Malaysia&apos;s Leading Car Accessories
        </p>
      </div>
    </main>
  );
}
