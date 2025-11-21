'use server'

import connectDB from '@/lib/db'
import Medication from '@/lib/models/Medication'

export async function getMedications(userId: string) {
  try {
    await connectDB()
    const medications = await Medication.find({ userId, isActive: true }).sort({ createdAt: -1 })
    return { 
      success: true, 
      medications: medications.map(med => ({
        id: med._id.toString(),
        name: med.name,
        dosage: med.dosage,
        frequency: med.frequency,
        time: med.time
      }))
    }
  } catch (error) {
    console.error('Get medications error:', error)
    return { success: false, error: 'Failed to get medications' }
  }
}

export async function createMedication(userId: string, medicationData: {
  name: string
  dosage: string
  frequency: string
  time: string
}) {
  try {
    await connectDB()
    const medication = await Medication.create({
      userId,
      ...medicationData
    })
    
    return { 
      success: true, 
      medication: {
        id: medication._id.toString(),
        name: medication.name,
        dosage: medication.dosage,
        frequency: medication.frequency,
        time: medication.time
      }
    }
  } catch (error) {
    console.error('Create medication error:', error)
    return { success: false, error: 'Failed to create medication' }
  }
}

export async function deleteMedication(userId: string, medicationId: string) {
  try {
    await connectDB()
    await Medication.findOneAndUpdate(
      { _id: medicationId, userId },
      { isActive: false }
    )
    return { success: true }
  } catch (error) {
    console.error('Delete medication error:', error)
    return { success: false, error: 'Failed to delete medication' }
  }
}