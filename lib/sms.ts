interface SMSConfig {
  text: string
  destinations: string[]
}

export async function sendSMS({ text, destinations }: SMSConfig) {
  try {
    // In production, integrate with actual SMS service
    console.log('SMS sent to:', destinations)
    console.log('Message:', text)
    
    // For demo purposes, return success
    return { success: true }
  } catch (error) {
    console.error('SMS sending failed:', error)
    return { success: false, error: 'Failed to send SMS' }
  }
}