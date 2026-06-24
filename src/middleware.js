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
    '/admin/:path*'
  ]
} 