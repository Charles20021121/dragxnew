import { NextResponse } from 'next/server'

export function middleware(request) {
  // 檢查是否訪問管理員頁面
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const token = request.cookies.get('auth-token')

    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // 簡單驗證 token 是否存在
    // 詳細的 token 驗證會在 API 路由中進行
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    // 排除靜態文件、sitemap、robots.txt，避免干擾 SEO 爬蟲
    '/((?!_next/static|_next/image|favicon\\.ico|robots\\.txt|sitemap\\.xml|sitemap/.*|site\\.webmanifest).*)'
  ]
} 