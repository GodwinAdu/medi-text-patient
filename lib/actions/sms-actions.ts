"use server"

import { connectToDB } from "../mongoose"
import { getCurrentUser } from "../auth"
import MedicationHistory from "../models/medication-history.models"

export async function getSMSHistory() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { success: false, error: "Not authenticated" }
    }

    await connectToDB()
    
    const smsHistory = await MedicationHistory.find({ 
      patientId: user.id,
      reminderSent: true 
    })
    .sort({ createdAt: -1 })
    .limit(50)

    return {
      success: true,
      messages: smsHistory.map(msg => ({
        id: msg._id.toString(),
        medicationName: msg.medicationName,
        dosage: msg.dosage,
        scheduledTime: msg.scheduledTime,
        reminderSentAt: msg.reminderSentAt,
        status: msg.status,
        takenTime: msg.takenTime,
        notes: msg.notes
      }))
    }
  } catch (error: any) {
    console.error("Get SMS history error:", error)
    return { success: false, error: "Failed to get SMS history" }
  }
}

export async function getMedicationHistory() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { success: false, error: "Not authenticated" }
    }

    await connectToDB()
    
    const history = await MedicationHistory.find({ patientId: user.id })
      .sort({ createdAt: -1 })
      .limit(100)

    return {
      success: true,
      history: history.map(record => ({
        id: record._id.toString(),
        medicationName: record.medicationName,
        dosage: record.dosage,
        scheduledTime: record.scheduledTime,
        takenTime: record.takenTime,
        status: record.status,
        notes: record.notes,
        sideEffects: record.sideEffects,
        recordedBy: record.recordedBy,
        reminderSent: record.reminderSent,
        reminderSentAt: record.reminderSentAt,
        createdAt: record.createdAt
      }))
    }
  } catch (error: any) {
    console.error("Get medication history error:", error)
    return { success: false, error: "Failed to get medication history" }
  }
}