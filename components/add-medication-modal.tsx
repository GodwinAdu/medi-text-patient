"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { X } from "lucide-react"

interface AddMedicationModalProps {
  onClose: () => void
  onAdd: (data: any) => void
}

export default function AddMedicationModal({ onClose, onAdd }: AddMedicationModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    dosage: "",
    frequency: "",
    time: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAdd(formData)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md border-border">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-foreground">Add Medication</h2>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-foreground">
                Medication Name
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="e.g., Aspirin"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 bg-input border-border text-foreground"
              />
            </div>

            <div>
              <Label htmlFor="dosage" className="text-foreground">
                Dosage
              </Label>
              <Input
                id="dosage"
                name="dosage"
                placeholder="e.g., 500mg"
                value={formData.dosage}
                onChange={handleChange}
                required
                className="mt-1 bg-input border-border text-foreground"
              />
            </div>

            <div>
              <Label htmlFor="frequency" className="text-foreground">
                Frequency
              </Label>
              <select
                id="frequency"
                name="frequency"
                value={formData.frequency}
                onChange={handleChange}
                required
                className="w-full mt-1 px-3 py-2 bg-input border border-border rounded-md text-foreground"
              >
                <option value="">Select frequency</option>
                <option value="Once daily">Once daily</option>
                <option value="Twice daily">Twice daily</option>
                <option value="Three times daily">Three times daily</option>
                <option value="As needed">As needed</option>
              </select>
            </div>

            <div>
              <Label htmlFor="time" className="text-foreground">
                Time
              </Label>
              <Input
                id="time"
                name="time"
                type="time"
                value={formData.time}
                onChange={handleChange}
                required
                className="mt-1 bg-input border-border text-foreground"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
                Cancel
              </Button>
              <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90">
                Add Medication
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  )
}
