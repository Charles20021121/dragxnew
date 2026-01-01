/** @type {import('next').NextConfig} */
const nextConfig = {
  // 禁用 Turbopack 以避免 Windows 上的崩溃问题
  experimental: {
    turbo: undefined,
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/dmkxx68km/image/upload/**',
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