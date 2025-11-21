"use server"

import { connectToDB } from "../mongoose"
import { getCurrentUser } from "../auth"
import Message from "../models/message.models"

export async function getPatientMessages() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { success: false, error: "Not authenticated" }
    }

    await connectToDB()
    
    const messages = await Message.find({ patientId: user.id })
      .sort({ createdAt: -1 })
      .limit(50)

    return {
      success: true,
      messages: messages.map(msg => ({
        id: msg._id.toString(),
        type: msg.type,
        priority: msg.priority,
        category: msg.category,
        subject: msg.subject,
        message: msg.message,
        medicationName: msg.medicationName,
        dosage: msg.dosage,
        scheduledTime: msg.scheduledTime,
        timeToSend: msg.timeToSend,
        status: msg.status,
        sentAt: msg.sentAt,
        deliveredAt: msg.deliveredAt,
        responseExpected: msg.responseExpected,
        responseReceived: msg.responseReceived,
        responseText: msg.responseText,
        responseTime: msg.responseTime,
        responseStatus: msg.responseStatus,
        channel: msg.channel,
        createdAt: msg.createdAt
      }))
    }
  } catch (error: any) {
    console.error("Get patient messages error:", error)
    return { success: false, error: "Failed to get messages" }
  }
}