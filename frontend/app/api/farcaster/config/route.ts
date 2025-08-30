import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Verificar que las variables existan
    const hasConfig = !!(
      process.env.FARCASTER_MNEMONIC &&
      process.env.NEXT_PUBLIC_URL &&
      process.env.FARCASTER_HEADER &&
      process.env.FARCASTER_PAYLOAD &&
      process.env.FARCASTER_SIGNATURE
    )

    return NextResponse.json({
      configured: hasConfig,
      baseUrl: process.env.NEXT_PUBLIC_URL || 'http://localhost:3000',
      hasHeader: !!process.env.FARCASTER_HEADER,
      hasPayload: !!process.env.FARCASTER_PAYLOAD,
      hasSignature: !!process.env.FARCASTER_SIGNATURE,
      hasMnemonic: !!process.env.FARCASTER_MNEMONIC
    })
  } catch (error) {
    console.error('Error checking Farcaster config:', error)
    return NextResponse.json({ configured: false }, { status: 500 })
  }
}
