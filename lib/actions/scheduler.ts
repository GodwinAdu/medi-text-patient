'use server'

import connectDB from '@/lib/db'
import MedicationReminder from '@/lib/models/MedicationReminder'
import Medication from '@/lib/models/Medication'
import User from '@/lib/models/User'
import { sendMedicationReminder } from './reminders'

export async function checkAndSendReminders() {
  try {
    await connectDB()
    
    const now = new Date()
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
    
    // Find all medications that should have reminders sent now
    const medications = await Medication.find({
      time: currentTime,
      isActive: { $ne: false }
    }).populate('userId')

    for (const medication of medications) {
      if (!medication.userId) continue
      
      // Check if reminder already sent today
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      const existingReminder = await MedicationReminder.findOne({
        userId: medication.userId._id,
        medicationId: medication._id,
        createdAt: { $gte: today }
      })

      if (!existingReminder) {
        // Create and send reminder
        const reminder = await MedicationReminder.create({
          userId: medication.userId._id,
          medicationId: medication._id,
          medicationName: medication.name,
          dosage: medication.dosage,
          scheduledTime: medication.time,
          phone: medication.userId.phone,
          status: 'pending'
        })

        // Send the reminder
        await sendMedicationReminder(reminder._id.toString())
      }
    }

    return { success: true }
  } catch (error) {
    console.error('Scheduler error:', error)
    return { success: false, error: 'Failed to check reminders' }
  }
}

export async function scheduleAllUserReminders(userId: string) {
  try {
    await connectDB()
    
    const medications = await Medication.find({ 
      userId,
      isActive: { $ne: false }
    })

    const user = await User.findById(userId)
    if (!user) {
      return { success: false, error: 'User not found' }
    }

    const reminders = []
    
    for (const medication of medications) {
      const reminder = await MedicationReminder.create({
        userId,
        medicationId: medication._id,
        medicationName: medication.name,
        dosage: medication.dosage,
        scheduledTime: medication.time,
        phone: user.phone,
        status: 'pending'
      })
      
      reminders.push({
        id: reminder._id.toString(),
        medicationName: medication.name,
        scheduledTime: medication.time
      })
    }

    return { success: true, reminders }
  } catch (error) {
    console.error('Schedule all reminders error:', error)
    return { success: false, error: 'Failed to schedule reminders' }
  }
}