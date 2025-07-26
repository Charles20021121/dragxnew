import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    pixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID,
    nodeEnv: process.env.NODE_ENV
  })
} 