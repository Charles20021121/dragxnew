import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  // 清除 auth token
  cookies().delete('auth-token')
  
  return NextResponse.json({ success: true })
} 