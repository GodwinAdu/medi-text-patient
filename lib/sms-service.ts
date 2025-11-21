interface Reminder {
  id: string
  userId: string
  medicationId: string
  medicationName: string
  time: string
  phoneNumber: string
  active: boolean
  lastSent?: string
}

class SMSService {
  private storageKey = "meditext_sms_reminders"

  private getRemindersFromStorage(): Record<string, Reminder[]> {
    if (typeof window === 'undefined') return {}
    return JSON.parse(localStorage.getItem(this.storageKey) || "{}")
  }

  private saveRemindersToStorage(reminders: Record<string, Reminder[]>) {
    if (typeof window === 'undefined') return
    localStorage.setItem(this.storageKey, JSON.stringify(reminders))
  }

  getReminders(userId: string): Reminder[] {
    const allReminders = this.getRemindersFromStorage()
    return allReminders[userId] || []
  }

  scheduleReminder(
    userId: string,
    medicationId: string,
    medicationName: string,
    time: string,
    phoneNumber: string
  ): Reminder {
    const reminder: Reminder = {
      id: `reminder_${Date.now()}`,
      userId,
      medicationId,
      medicationName,
      time,
      phoneNumber,
      active: true
    }

    const allReminders = this.getRemindersFromStorage()
    if (!allReminders[userId]) {
      allReminders[userId] = []
    }
    allReminders[userId].push(reminder)
    this.saveRemindersToStorage(allReminders)

    return reminder
  }

  sendReminder(reminderId: string): Reminder | null {
    const allReminders = this.getRemindersFromStorage()
    
    for (const userId in allReminders) {
      const userReminders = allReminders[userId]
      const reminderIndex = userReminders.findIndex(r => r.id === reminderId)
      
      if (reminderIndex !== -1) {
        const reminder = userReminders[reminderIndex]
        reminder.lastSent = new Date().toISOString()
        this.saveRemindersToStorage(allReminders)
        return reminder
      }
    }
    
    return null
  }

  deleteReminder(reminderId: string): boolean {
    const allReminders = this.getRemindersFromStorage()
    
    for (const userId in allReminders) {
      const userReminders = allReminders[userId]
      const reminderIndex = userReminders.findIndex(r => r.id === reminderId)
      
      if (reminderIndex !== -1) {
        userReminders.splice(reminderIndex, 1)
        this.saveRemindersToStorage(allReminders)
        return true
      }
    }
    
    return false
  }

  simulateSendSMS(phoneNumber: string, medicationName: string): void {
    // Simulate SMS sending - in a real app, this would integrate with Twilio, AWS SNS, etc.
    console.log(`📱 SMS sent to ${phoneNumber}:`)
    console.log(`🏥 MediText Reminder: It's time to take your ${medicationName}. Don't forget your health! Reply TAKEN when you've taken it.`)
    
    // Show a toast notification in the browser
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification('SMS Reminder Sent', {
          body: `Reminder sent to ${phoneNumber} for ${medicationName}`,
          icon: '/favicon.ico'
        })
      }
    }
  }

  // Get all active reminders that should be sent now
  getActiveRemindersForTime(currentTime: string): Reminder[] {
    const allReminders = this.getRemindersFromStorage()
    const activeReminders: Reminder[] = []
    
    for (const userId in allReminders) {
      const userReminders = allReminders[userId].filter(r => 
        r.active && r.time === currentTime
      )
      activeReminders.push(...userReminders)
    }
    
    return activeReminders
  }
}

export const smsService = new SMSService()