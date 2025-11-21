"use server"

import { connectToDB } from "../mongoose"
import Medication from "../models/medication.models"
import { Patient } from "../models/patient.models"
import { getCurrentUser } from "../auth"

export async function getMedications() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { success: false, error: "Not authenticated" }
    }

    await connectToDB()
    
    const medications = await Medication.find({ 
      patientId: user.id,
      status: 'active'
    }).sort({ createdAt: -1 })

    return {
      success: true,
      medications: medications.map(med => ({
        id: med._id.toString(),
        name: med.name,
        dosage: med.dosage,
        frequency: med.frequency,
        times: med.times,
        startTime: med.startTime,
        condition: med.condition,
        instructions: med.instructions,
        adherenceRate: med.adherenceRate,
        nextDose: med.nextDose,
        totalDoses: med.totalDoses,
        takenDoses: med.takenDoses,
        missedDoses: med.missedDoses
      }))
    }
  } catch (error: any) {
    console.error("Get medications error:", error)
    return { success: false, error: "Failed to fetch medications" }
  }
}

export async function addMedication(medicationData: {
  name: string
  dosage: string
  frequency: string
  times: string[]
  startTime: string
  condition?: string
  instructions?: string
}) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { success: false, error: "Not authenticated" }
    }

    await connectToDB()

    const medication = await Medication.create({
      patientId: user.id,
      name: medicationData.name,
      dosage: medicationData.dosage,
      frequency: medicationData.frequency,
      times: medicationData.times,
      startTime: medicationData.startTime,
      startDate: new Date(),
      condition: medicationData.condition,
      instructions: medicationData.instructions
    })

    return {
      success: true,
      medication: {
        id: medication._id.toString(),
        name: medication.name,
        dosage: medication.dosage,
        frequency: medication.frequency,
        times: medication.times,
        startTime: medication.startTime
      }
    }
  } catch (error: any) {
    console.error("Add medication error:", error)
    return { success: false, error: "Failed to add medication" }
  }
}

export async function markMedicationTaken(medicationId: string) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { success: false, error: "Not authenticated" }
    }

    await connectToDB()

    const medication = await Medication.findOne({
      _id: medicationId,
      patientId: user.id
    })

    if (!medication) {
      return { success: false, error: "Medication not found" }
    }

    // Update taken doses and adherence
    medication.takenDoses += 1
    medication.totalDoses += 1
    medication.adherenceRate = Math.round((medication.takenDoses / medication.totalDoses) * 100)
    
    await medication.save()

    return { success: true }
  } catch (error: any) {
    console.error("Mark medication taken error:", error)
    return { success: false, error: "Failed to mark medication as taken" }
  }
}

export async function getAdherenceStats() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { success: false, error: "Not authenticated" }
    }

    await connectToDB()

    const medications = await Medication.find({ 
      patientId: user.id,
      status: 'active'
    })

    if (medications.length === 0) {
      return {
        success: true,
        stats: { taken: 0, total: 0, percentage: 0 }
      }
    }

    const totalTaken = medications.reduce((sum, med) => sum + med.takenDoses, 0)
    const totalDoses = medications.reduce((sum, med) => sum + med.totalDoses, 0)
    const percentage = totalDoses > 0 ? Math.round((totalTaken / totalDoses) * 100) : 0

    return {
      success: true,
      stats: {
        taken: totalTaken,
        total: totalDoses,
        percentage
      }
    }
  } catch (error: any) {
    console.error("Get adherence stats error:", error)
    return { success: false, error: "Failed to get adherence stats" }
  }
}