import { NextResponse } from 'next/server'
import { sign } from 'jsonwebtoken'
import { cookies } from 'next/headers'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function POST(request) {
  try {
    const { username, password } = await request.json()

    // 使用環境變數中的憑證進行比對
    if (username === process.env.ADMIN_USERNAME && 
        password === process.env.ADMIN_PASSWORD) {
      // 創建 JWT token
      const token = sign(
        { username, role: 'admin' },
        JWT_SECRET,
        { expiresIn: '1d' }
      )

      // 設置 cookie
      cookies().set('auth-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 86400 // 24 hours
      })

      return NextResponse.json({ success: true })
    }

    return NextResponse.json(
      { message: 'Invalid credentials' },
      { status: 401 }
    )
  } catch (error) {
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    )
  }
} 