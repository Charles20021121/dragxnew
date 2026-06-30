/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },

  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/dmkxx68km/image/upload/**',
      },
      {
        protocol: 'https',
        hostname: 'pub-332f16c726da4f048f11221d7baacb53.r2.dev',
      },
    ],
  },

  // 添加这个以确保 API 路由正确处理
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
      {
        source: '/sitemap.xml',
        destination: '/sitemap/sitemap.xml',
      },
      {
        source: '/sitemap_static.xml',
        destination: '/sitemap/sitemap_static.xml',
      },
      {
        source: '/sitemap_products.xml',
        destination: '/sitemap/sitemap_products.xml',
      },
      {
        source: '/sitemap_gallery.xml',
        destination: '/sitemap/sitemap_gallery.xml',
      },
    ]
  },

  async headers() {
    return [
      {
        source: '/sitemap.xml',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/xml',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig 