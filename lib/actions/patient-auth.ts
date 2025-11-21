"use server"


import { generateToken } from "../jwt"
import { cookies } from "next/headers"
import { smsConfig } from "../../sms/sms.config"
import crypto from "crypto"
import mongoose from "mongoose"
import { Patient } from "../models/patient.models"
import OTP from "../models/otp.models"
import { connectToDB } from "../mongoose"

interface RegisterData {
  name: string
  email: string
  phone: string
  password: string
  dateOfBirth?: string
  gender?: 'male' | 'female' | 'other'
  medicalConditions?: string[]
}

export async function registerPatient(data: RegisterData) {
  try {
    await connectToDB()

    const existingPatient = await Patient.findOne({
      $or: [{ email: data.email }, { phone: data.phone }]
    })

    if (existingPatient) {
      return {
        success: false,
        error: existingPatient.email === data.email 
          ? "Email already registered" 
          : "Phone number already registered"
      }
    }

    const patient = await Patient.create({
      name: data.name.trim(),
      email: data.email.toLowerCase().trim(),
      phone: data.phone.trim(),
      password: data.password,
      dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
      gender: data.gender,
      medicalInfo: {
        conditions: data.medicalConditions || []
      }
    })

    const token = generateToken({
      id: patient._id.toString(),
      email: patient.email,
      name: patient.name
    })

    const cookieStore = await cookies()
    cookieStore.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    })

    return {
      success: true,
      patient: {
        id: patient._id.toString(),
        name: patient.name,
        email: patient.email,
        phone: patient.phone
      }
    }
  } catch (error: any) {
    console.error("Registration error:", error)
    return {
      success: false,
      error: error.message || "Registration failed"
    }
  }
}

export async function sendOTPToPhone(phone: string) {
  try {
    await connectToDB()

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Save OTP to database
    const otpDoc = await OTP.create({
      phone: phone.trim(),
      otp,
      expiresAt,
      isUsed: false
    })

    console.log('Created OTP document:', otpDoc)

    // Send SMS
    const message = `Your MediText verification code is: ${otp}. Valid for 10 minutes.`
    await smsConfig({
      text: message,
      destinations: [phone]
    })

    console.log(`OTP for ${phone}: ${otp}`) // For demo

    return { success: true, message: "OTP sent successfully" }
  } catch (error: any) {
    console.error("OTP error:", error)
    return { success: false, error: "Failed to send OTP" }
  }
}

export async function verifyOTPAndLogin(phone: string, otp: string) {
  try {
    await connectToDB()

    console.log(`Verifying OTP: ${otp} for phone: ${phone}`)
    
    // Check all OTPs for this phone for debugging
    const allOTPs = await OTP.find({ phone: phone.trim() }).sort({ createdAt: -1 })
    console.log('All OTPs for phone:', allOTPs)

    // Verify OTP
    const otpRecord = await OTP.findOne({
      phone: phone.trim(),
      otp: otp.trim(),
      isUsed: false,
      expiresAt: { $gt: new Date() }
    })

    console.log('Found OTP record:', otpRecord)

    if (!otpRecord) {
      return { success: false, error: "Invalid or expired OTP" }
    }

    // Find or create patient
    let patient = await Patient.findOne({ phone })
    
    if (!patient) {
      throw new Error("Patient not found. Please register first.")
    }

    // Mark OTP as used
    await OTP.updateOne({ _id: otpRecord._id }, { isUsed: true })

    // Generate JWT token
    const token = generateToken({
      id: patient._id.toString(),
      email: patient.email,
      name: patient.name
    })

    const cookieStore = await cookies()
    cookieStore.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    })

    console.log(`Patient ${patient.phone} logged in via OTP`)
    
    console.log(`Generated token: ${token}`)
    console.log(patient, patient._id.toString()," ", patient.email, patient.name)

    return {
      success: true,
      patient: {
        id: patient._id.toString(),
        name: patient.name,
        email: patient.email,
        phone: patient.phone
      }
    }
  } catch (error: any) {
    console.error("OTP verification error:", error)
    return { success: false, error: "OTP verification failed" }
  }
}

export async function checkPatientExists(phone: string) {
  try {
    await connectToDB()
    const patient = await Patient.findOne({ phone: phone.trim() })
    return { exists: !!patient, patient: patient ? {
      id: patient._id.toString(),
      name: patient.name,
      email: patient.email,
      phone: patient.phone
    } : null }
  } catch (error: any) {
    console.error("Check patient error:", error)
    return { exists: false, patient: null }
  }
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete('auth-token')
  return { success: true }
}