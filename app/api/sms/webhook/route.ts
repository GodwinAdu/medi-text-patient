import { NextRequest, NextResponse } from 'next/server'
import { handlePatientResponse } from '@/lib/actions/reminders'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Extract phone and message from webhook payload
    // Adjust based on your SMS provider's webhook format
    const { from, text } = body
    
    if (!from || !text) {
      return NextResponse.json({ error: 'Missing phone or message' }, { status: 400 })
    }

    // Handle the patient response
    const result = await handlePatientResponse(from, text)
    
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json({ success: true, status: result.status })
  } catch (error) {
    console.error('SMS webhook error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Handle GET for webhook verification (if needed by SMS provider)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const challenge = searchParams.get('challenge')
  
  if (challenge) {
    return NextResponse.json({ challenge })
  }
  
  return NextResponse.json({ message: 'SMS webhook endpoint' })
}