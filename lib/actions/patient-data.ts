"use server"


import { Patient } from "../models/patient.models"
import { getCurrentUser } from "../auth"
import { connectToDB } from "../mongoose"

export async function getPatientProfile() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { success: false, error: "Not authenticated" }
    }

    await connectToDB()
    
    const patient = await Patient.findById(user.id).populate('medicationHistory')
    if (!patient) {
      return { success: false, error: "Patient not found" }
    }

    return {
      success: true,
      patient: {
        id: patient._id.toString(),
        name: patient.name,
        email: patient.email,
        phone: patient.phone,
        dateOfBirth: patient.dateOfBirth,
        gender: patient.gender,
        address: patient.address,
        emergencyContact: patient.emergencyContact,
        medicalInfo: patient.medicalInfo,
        medicationHistory: patient.medicationHistory,
        documents: patient.documents,
        preferences: patient.preferences,
        riskFactors: patient.riskFactors,
        socialHistory: patient.socialHistory,
        adherenceScore: patient.adherenceScore,
        riskLevel: patient.riskLevel,
        status: patient.status,
        smsPreferences: patient.smsPreferences,
        facilityId: patient.facilityId,
        assignedDate: patient.assignedDate,
        lastActivity: patient.lastActivity,
        notes: patient.notes,
        createdAt: patient.createdAt,
        updatedAt: patient.updatedAt
      }
    }
  } catch (error: any) {
    console.error("Get patient profile error:", error)
    return { success: false, error: "Failed to get patient profile" }
  }
}

export async function updatePatientProfile(updates: {
  name?: string
  email?: string
  phone?: string
  dateOfBirth?: string
  gender?: 'male' | 'female' | 'other'
  address?: any
  emergencyContact?: any
  medicalInfo?: any
  preferences?: any
}) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { success: false, error: "Not authenticated" }
    }

    await connectToDB()
    
    const patient = await Patient.findByIdAndUpdate(
      user.id,
      { ...updates, lastActivity: new Date() },
      { new: true }
    )

    if (!patient) {
      return { success: false, error: "Patient not found" }
    }

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
    console.error("Update patient profile error:", error)
    return { success: false, error: "Failed to update profile" }
  }
}