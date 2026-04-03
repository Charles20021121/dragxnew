import { NextResponse } from 'next/server'
import pool from '@/lib/db'

// 定義車款路由映射
const carRoutes = {
  'bmw': { ImgUrl: 'https://pub-332f16c726da4f048f11221d7baacb53.r2.dev/dragx/dragx/pjeo4wxziqxdxsjcfpbb.webp', domainUrl: '/gallery/gbmw' },
  'mercedes': { ImgUrl: 'https://pub-332f16c726da4f048f11221d7baacb53.r2.dev/dragx/dragx/ltvgxtgdnfvpu6e5lifw.webp', domainUrl: '/gallery/gmercedes' },
  'audi': { ImgUrl: 'https://pub-332f16c726da4f048f11221d7baacb53.r2.dev/dragx/dragx/r9bx7381jafl517oyo23.webp', domainUrl: '/gallery/audi' },
  'honda': { ImgUrl: 'https://pub-332f16c726da4f048f11221d7baacb53.r2.dev/dragx/dragx/z38nzrmqjjm52uyfupuq.webp', domainUrl: '/gallery/honda' },
  'toyota': { ImgUrl: 'https://pub-332f16c726da4f048f11221d7baacb53.r2.dev/dragx/dragx/cvq1aoaa7hjrpj2gplly.webp', domainUrl: '/gallery/toyota' },
  'alphard': { ImgUrl: 'https://pub-332f16c726da4f048f11221d7baacb53.r2.dev/dragx/dragx/lyeylq4n5vfrh5n39izv.webp', domainUrl: '/gallery/alphard' },
  'vellfire': { ImgUrl: 'https://pub-332f16c726da4f048f11221d7baacb53.r2.dev/dragx/dragx/eeldtvtiwd3a8nmh50gk.webp', domainUrl: '/gallery/vellfire' }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')

  if (!query) {
    return NextResponse.json([])
  }

  try {
    const connection = await pool.getConnection()
    
    try {
      // 搜索產品
      const searchQuery = `
        SELECT 
          Id,
          Name,
          Url,
          categories,
          description,
          buy,
          Specifications,
          'product' as type
        FROM products 
        WHERE 
          LOWER(Name) LIKE LOWER(?) OR
          LOWER(categories) LIKE LOWER(?) OR
          LOWER(Specifications) LIKE LOWER(?)
      `
      const searchTerm = `%${query}%`
      const [products] = await connection.execute(
        searchQuery, 
        [searchTerm, searchTerm, searchTerm]
      )

      // 搜索車款
      const searchLower = query.toLowerCase()
      const galleryResults = Object.entries(carRoutes)
        .filter(([key]) => key.includes(searchLower))
        .map(([key, value]) => ({
          Id: key,
          Name: key.charAt(0).toUpperCase() + key.slice(1), // 首字母大寫
          Url: value.ImgUrl,
          categories: 'Gallery',
          type: 'gallery',
          domainUrl: value.domainUrl
        }))

      // 合併結果
      const allResults = [...products, ...galleryResults]
      
      // 根據相關性排序
      const sortedResults = allResults.sort((a, b) => {
        const aName = a.Name.toLowerCase()
        const bName = b.Name.toLowerCase()
        
        // 完全匹配放在最前面
        if (aName === searchLower && bName !== searchLower) return -1
        if (bName === searchLower && aName !== searchLower) return 1
        
        // 開頭匹配的次之
        if (aName.startsWith(searchLower) && !bName.startsWith(searchLower)) return -1
        if (bName.startsWith(searchLower) && !aName.startsWith(searchLower)) return 1
        
        return 0
      })

      return NextResponse.json(sortedResults.slice(0, 12))
    } finally {
      connection.release()
    }
  } catch (error) {
    console.error('Connection error:', error)
    return NextResponse.json(
      { error: 'Connection error', details: error.message },
      { status: 500 }
    )
  }
} 