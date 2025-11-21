'use server'


import User from '@/lib/models/User'
import OTP from '@/lib/models/OTP'
import { smsConfig } from '@/sms/sms.config'
import { connectToDB } from '../db'


export async function sendOTP(phone: string) {
  try {
    await connectToDB()
    
    // Generate 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    
    // Delete any existing OTPs for this phone
    await OTP.deleteMany({ phone })
    
    // Create new OTP
    await OTP.create({
      phone,
      code,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    })

    const msgData = {
      text: `Your MediText verification code is ${code}. Valid for 10 minutes.`,
      destinations: [phone],
    }
    
    // Send SMS
  
    const smsResult = await smsConfig(msgData)
    
    if (!smsResult.success) {
      throw new Error('Failed to send SMS')
    }
    
    return { success: true }
  } catch (error) {
    console.error('Send OTP error:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to send OTP' 
    }
  }
}

export async function verifyOTP(phone: string, code: string) {
  try {
    await connectToDB()
    
    const otpRecord = await OTP.findOne({
      phone,
      code,
      verified: false,
      expiresAt: { $gt: new Date() }
    })
    
    if (!otpRecord) {
      return { success: false, error: 'Invalid or expired OTP' }
    }
    
    // Mark OTP as verified
    otpRecord.verified = true
    await otpRecord.save()
    
    // Check if user exists
    const user = await User.findOne({ phone })
    
    return { 
      success: true, 
      user: user ? {
        id: user._id.toString(),
        phone: user.phone,
        fullName: user.fullName,
        email: user.email
      } : null
    }
  } catch (error) {
    console.error('Verify OTP error:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to verify OTP' 
    }
  }
}

export async function checkUserExists(phone: string) {
  try {
    await connectToDB()
    const user = await User.findOne({ phone })
    return { exists: !!user, user: user ? { id: user._id.toString(), fullName: user.fullName, email: user.email, phone: user.phone } : null }
  } catch (error) {
    console.error('Check user error:', error)
    return { exists: false, user: null }
  }
}

export async function createUser(phone: string, fullName: string, email?: string) {
  try {
    await connectToDB()
    
    // Check if user already exists
    const existingUser = await User.findOne({ phone })
    if (existingUser) {
      return { success: false, error: 'User already exists' }
    }
    
    const user = await User.create({
      phone,
      fullName,
      email,
      isVerified: true
    })
    
    return { 
      success: true, 
      user: { 
        id: user._id.toString(), 
        fullName: user.fullName, 
        email: user.email, 
        phone: user.phone 
      } 
    }
  } catch (error) {
    console.error('Create user error:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to create user' 
    }
  }
}

