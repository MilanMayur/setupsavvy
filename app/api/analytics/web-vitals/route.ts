import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const metric = await request.json()
    
    // Log web vitals for monitoring
    console.log('Web Vitals:', {
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      id: metric.id,
      timestamp: new Date().toISOString(),
      url: request.headers.get('referer') || 'unknown'
    })
    
    // Here you could send to external monitoring services:
    // - Sentry
    // - DataDog
    // - New Relic
    // - Custom analytics database
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Web Vitals logging error:', error)
    return NextResponse.json({ error: 'Failed to log web vitals' }, { status: 500 })
  }
}