"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Circle } from "lucide-react"

interface Medication {
  id: string
  name: string
  dosage: string
  frequency: string
  time: string
  taken?: boolean
}

interface MedicationListProps {
  medications: Medication[]
  onMarkTaken: (id: string) => void
}

export default function MedicationList({ medications, onMarkTaken }: MedicationListProps) {
  if (medications.length === 0) {
    return (
      <Card className="border-border">
        <CardContent className="pt-6 text-center">
          <p className="text-muted-foreground">No medications added yet. Add your first medication to get started!</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4">
      {medications.map((med) => (
        <Card key={med.id} className="border-border hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground">{med.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{med.dosage}</p>
                <div className="flex gap-4 mt-3 text-sm text-muted-foreground">
                  <span>Frequency: {med.frequency}</span>
                  <span>Time: {med.time}</span>
                </div>
              </div>
              <Button
                onClick={() => onMarkTaken(med.id)}
                variant={med.taken ? "default" : "outline"}
                size="sm"
                className="gap-2"
              >
                {med.taken ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Taken
                  </>
                ) : (
                  <>
                    <Circle className="w-4 h-4" />
                    Mark Taken
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
