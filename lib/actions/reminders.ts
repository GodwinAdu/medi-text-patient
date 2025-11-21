'use server'

import connectDB from '@/lib/db'
import MedicationReminder from '@/lib/models/MedicationReminder'
import Medication from '@/lib/models/Medication'
import User from '@/lib/models/User'
import { smsConfig } from '@/sms/sms.config'

export async function scheduleReminder(userId: string, medicationId: string, scheduledTime: string) {
  try {
    await connectDB()
    
    const user = await User.findById(userId)
    const medication = await Medication.findById(medicationId)
    
    if (!user || !medication) {
      return { success: false, error: 'User or medication not found' }
    }

    const reminder = await MedicationReminder.create({
      userId,
      medicationId,
      medicationName: medication.name,
      dosage: medication.dosage,
      scheduledTime,
      phone: user.phone,
      status: 'pending'
    })

    return { success: true, reminder: { id: reminder._id.toString() } }
  } catch (error) {
    console.error('Schedule reminder error:', error)
    return { success: false, error: 'Failed to schedule reminder' }
  }
}

export async function sendMedicationReminder(reminderId: string) {
  try {
    await connectDB()
    
    const reminder = await MedicationReminder.findById(reminderId)
    if (!reminder) {
      return { success: false, error: 'Reminder not found' }
    }

    const message = `🏥 MediText Reminder: Time to take your ${reminder.medicationName} (${reminder.dosage}).

Reply:
1 - I took it ✅
2 - I missed it ❌  
3 - I had complications ⚠️

Your health matters! 💊`

    const msgData = {
      text: message,
      destinations: [reminder.phone]
    }

    const smsResult = await smsConfig(msgData)
    
    if (!smsResult.success) {
      return { success: false, error: 'Failed to send SMS' }
    }

    // Update reminder status
    reminder.status = 'sent'
    reminder.sentAt = new Date()
    await reminder.save()

    return { success: true }
  } catch (error) {
    console.error('Send reminder error:', error)
    return { success: false, error: 'Failed to send reminder' }
  }
}

export async function handlePatientResponse(phone: string, response: string) {
  try {
    await connectDB()
    
    // Find the most recent sent reminder for this phone
    const reminder = await MedicationReminder.findOne({
      phone,
      status: 'sent',
      sentAt: { $gte: new Date(Date.now() - 2 * 60 * 60 * 1000) } // Within last 2 hours
    }).sort({ sentAt: -1 })

    if (!reminder) {
      return { success: false, error: 'No active reminder found' }
    }

    let status = 'pending'
    let replyMessage = ''

    switch (response.trim()) {
      case '1':
        status = 'taken'
        replyMessage = `✅ Great! You've marked ${reminder.medicationName} as taken. Keep up the good work! 💪`
        break
      case '2':
        status = 'missed'
        replyMessage = `⏰ You've marked ${reminder.medicationName} as missed. Please take it as soon as possible and consult your doctor if needed.`
        break
      case '3':
        status = 'complication'
        replyMessage = `⚠️ We've noted complications with ${reminder.medicationName}. Please contact your healthcare provider immediately. Stay safe! 🏥`
        break
      default:
        return { success: false, error: 'Invalid response' }
    }

    // Update reminder
    reminder.status = status
    reminder.response = response.trim()
    reminder.respondedAt = new Date()
    await reminder.save()

    // Send confirmation SMS
    const confirmMsg = {
      text: replyMessage,
      destinations: [phone]
    }
    await smsConfig(confirmMsg)

    return { success: true, status }
  } catch (error) {
    console.error('Handle response error:', error)
    return { success: false, error: 'Failed to handle response' }
  }
}

export async function getPatientActivity(userId: string) {
  try {
    await connectDB()
    
    const reminders = await MedicationReminder.find({ userId })
      .sort({ createdAt: -1 })
      .limit(50)

    const activity = reminders.map(r => ({
      id: r._id.toString(),
      medicationName: r.medicationName,
      dosage: r.dosage,
      scheduledTime: r.scheduledTime,
      status: r.status,
      sentAt: r.sentAt,
      respondedAt: r.respondedAt,
      response: r.response
    }))

    return { success: true, activity }
  } catch (error) {
    console.error('Get activity error:', error)
    return { success: false, error: 'Failed to get activity' }
  }
}