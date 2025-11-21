"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Plus, Trash2, Send } from "lucide-react"

interface Medication {
  id: string
  name: string
  dosage: string
  frequency: string
  time: string
}

interface SMSReminder {
  id: string
  medicationId: string
  medicationName: string
  scheduledTime: string
  phoneNumber: string
  sent: boolean
  sentAt?: string
}

interface SMSRemindersProps {
  medications: Medication[]
  phoneNumber: string
  onAddReminder: (medicationId: string, time: string) => void
  onSendReminder: (reminderId: string) => void
  onDeleteReminder: (reminderId: string) => void
  reminders: SMSReminder[]
}

export default function SMSReminders({
  medications,
  phoneNumber,
  onAddReminder,
  onSendReminder,
  onDeleteReminder,
  reminders,
}: SMSRemindersProps) {
  const [selectedMedication, setSelectedMedication] = useState<string>("")

  const handleAddReminder = () => {
    if (selectedMedication) {
      const med = medications.find((m) => m.id === selectedMedication)
      if (med) {
        onAddReminder(selectedMedication, med.time)
        setSelectedMedication("")
      }
    }
  }

  return (
    <div className="space-y-4">
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            SMS/WhatsApp Reminders
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">Phone Number</p>
            <p className="font-medium text-foreground">{phoneNumber}</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Add Reminder for Medication</label>
            <div className="flex gap-2">
              <select
                value={selectedMedication}
                onChange={(e) => setSelectedMedication(e.target.value)}
                className="flex-1 px-3 py-2 bg-input border border-border rounded-md text-foreground"
              >
                <option value="">Select a medication</option>
                {medications.map((med) => (
                  <option key={med.id} value={med.id}>
                    {med.name} - {med.time}
                  </option>
                ))}
              </select>
              <Button onClick={handleAddReminder} className="bg-primary hover:bg-primary/90 gap-2">
                <Plus className="w-4 h-4" />
                Add
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {reminders.length > 0 && (
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Active Reminders ({reminders.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {reminders.map((reminder) => (
                <div key={reminder.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{reminder.medicationName}</p>
                    <p className="text-sm text-muted-foreground">Scheduled for {reminder.scheduledTime}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {reminder.sent ? (
                      <Badge className="bg-green-100 text-green-800 border-green-300">Sent</Badge>
                    ) : (
                      <Badge className="bg-blue-100 text-blue-800 border-blue-300">Pending</Badge>
                    )}
                    {!reminder.sent && (
                      <Button onClick={() => onSendReminder(reminder.id)} size="sm" variant="outline" className="gap-1">
                        <Send className="w-3 h-3" />
                        Send
                      </Button>
                    )}
                    <Button onClick={() => onDeleteReminder(reminder.id)} size="sm" variant="outline" className="gap-1">
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
