"use server"

import { connectToDB } from "../mongoose"
import { getCurrentUser } from "../auth"
import VitalSign from "../models/vital-sign.models"

export async function getVitalSigns() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { success: false, error: "Not authenticated" }
    }

    await connectToDB()
    
    const vitals = await VitalSign.find({ patientId: user.id })
      .sort({ recordedDate: -1 })
      .limit(10)

    return {
      success: true,
      vitals: vitals.map(vital => ({
        id: vital._id.toString(),
        bloodPressure: vital.bloodPressure,
        bloodSugar: vital.bloodSugar,
        weight: vital.weight,
        heartRate: vital.heartRate,
        temperature: vital.temperature,
        oxygenSaturation: vital.oxygenSaturation,
        respiratoryRate: vital.respiratoryRate,
        bmi: vital.bmi,
        recordedDate: vital.recordedDate,
        recordedBy: vital.recordedBy,
        location: vital.location,
        notes: vital.notes
      }))
    }
  } catch (error: any) {
    console.error("Get vital signs error:", error)
    return { success: false, error: "Failed to get vital signs" }
  }
}

export async function addVitalSign(vitalData: {
  bloodPressure?: { systolic: number; diastolic: number }
  bloodSugar?: number
  weight?: number
  heartRate?: number
  temperature?: number
  oxygenSaturation?: number
  respiratoryRate?: number
  location?: string
  notes?: string
}) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { success: false, error: "Not authenticated" }
    }

    await connectToDB()

    // Calculate BMI if weight is provided (assuming average height for demo)
    let bmi
    if (vitalData.weight) {
      const averageHeight = 1.7 // meters
      bmi = Math.round((vitalData.weight / (averageHeight * averageHeight)) * 10) / 10
    }

    const vital = await VitalSign.create({
      patientId: user.id,
      ...vitalData,
      bmi,
      recordedBy: 'patient'
    })

    return {
      success: true,
      vital: {
        id: vital._id.toString(),
        bloodPressure: vital.bloodPressure,
        bloodSugar: vital.bloodSugar,
        weight: vital.weight,
        heartRate: vital.heartRate,
        recordedDate: vital.recordedDate
      }
    }
  } catch (error: any) {
    console.error("Add vital sign error:", error)
    return { success: false, error: "Failed to add vital sign" }
  }
}

export async function updateVitalSign(vitalId: string, vitalData: {
  bloodPressure?: { systolic: number; diastolic: number }
  bloodSugar?: number
  weight?: number
  heartRate?: number
  temperature?: number
  oxygenSaturation?: number
  respiratoryRate?: number
  location?: string
  notes?: string
}) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { success: false, error: "Not authenticated" }
    }

    await connectToDB()

    // Calculate BMI if weight is provided
    let bmi
    if (vitalData.weight) {
      const averageHeight = 1.7 // meters
      bmi = Math.round((vitalData.weight / (averageHeight * averageHeight)) * 10) / 10
    }

    const vital = await VitalSign.findOneAndUpdate(
      { _id: vitalId, patientId: user.id },
      { ...vitalData, bmi },
      { new: true }
    )

    if (!vital) {
      return { success: false, error: "Vital sign not found" }
    }

    return { success: true, vital }
  } catch (error: any) {
    console.error("Update vital sign error:", error)
    return { success: false, error: "Failed to update vital sign" }
  }
}

export async function deleteVitalSign(vitalId: string) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { success: false, error: "Not authenticated" }
    }

    await connectToDB()

    const vital = await VitalSign.findOneAndDelete({ _id: vitalId, patientId: user.id })

    if (!vital) {
      return { success: false, error: "Vital sign not found" }
    }

    return { success: true }
  } catch (error: any) {
    console.error("Delete vital sign error:", error)
    return { success: false, error: "Failed to delete vital sign" }
  }
}