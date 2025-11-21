"use server"

import { cookies } from "next/headers"
import { verifyToken } from "./jwt"
import { Patient } from "./models/patient.models"
import { connectToDB } from "./mongoose"


export async function getCurrentUser() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token')?.value

    if (!token) {
      return null
    }

    const payload = verifyToken(token)
    if (!payload) {
      return null
    }

    await connectToDB()
    const patient = await Patient.findById(payload.id)
    
    if (!patient) {
      return null
    }

    return {
      id: patient._id.toString(),
      name: patient.name,
      email: patient.email,
      phone: patient.phone
    }
  } catch (error) {
    console.error("Get current user error:", error)
    return null
  }
}