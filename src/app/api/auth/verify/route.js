import { NextResponse } from 'next/server'
import { verify } from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function GET(request) {
  try {
    const token = request.cookies.get('auth-token')

    if (!token) {
      return NextResponse.json({ isValid: false }, { status: 401 })
    }

    verify(token.value, JWT_SECRET)
    return NextResponse.json({ isValid: true })
  } catch (error) {
    return NextResponse.json({ isValid: false }, { status: 401 })
  }
} 