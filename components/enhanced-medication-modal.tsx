"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { X, Pill, Clock, AlertTriangle, Calendar } from "lucide-react"

interface EnhancedMedicationModalProps {
  onClose: () => void
  onAdd: (medication: any) => void
}

export default function EnhancedMedicationModal({ onClose, onAdd }: EnhancedMedicationModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    genericName: "",
    dosage: "",
    unit: "mg",
    frequency: "once_daily",
    times: ["08:00"],
    condition: "hypertension",
    medicationType: "blood_pressure",
    instructions: "",
    prescribedBy: "",
    prescriptionDate: "",
    stockCount: "",
    refillReminder: true
  })

  const [selectedTimes, setSelectedTimes] = useState<string[]>(["08:00"])

  const frequencyOptions = {
    once_daily: { label: "Once Daily", times: 1 },
    twice_daily: { label: "Twice Daily", times: 2 },
    three_times_daily: { label: "Three Times Daily", times: 3 },
    four_times_daily: { label: "Four Times Daily", times: 4 }
  }

  const medicationTypes = {
    hypertension: [
      { value: "blood_pressure", label: "Blood Pressure Medication" },
      { value: "other", label: "Other" }
    ],
    diabetes: [
      { value: "diabetes", label: "Diabetes Medication" },
      { value: "insulin", label: "Insulin" },
      { value: "other", label: "Other" }
    ]
  }

  const commonMedications = {
    hypertension: [
      "Lisinopril", "Amlodipine", "Metoprolol", "Losartan", "Hydrochlorothiazide",
      "Atenolol", "Carvedilol", "Valsartan", "Nifedipine", "Enalapril"
    ],
    diabetes: [
      "Metformin", "Glipizide", "Glyburide", "Insulin Glargine", "Insulin Lispro",
      "Sitagliptin", "Pioglitazone", "Acarbose", "Repaglinide", "Canagliflozin"
    ]
  }

  const handleFrequencyChange = (frequency: string) => {
    const timesNeeded = frequencyOptions[frequency as keyof typeof frequencyOptions].times
    const defaultTimes = ["08:00", "14:00", "20:00", "02:00"].slice(0, timesNeeded)
    setSelectedTimes(defaultTimes)
    setFormData(prev => ({ ...prev, frequency, times: defaultTimes }))
  }

  const handleTimeChange = (index: number, time: string) => {
    const newTimes = [...selectedTimes]
    newTimes[index] = time
    setSelectedTimes(newTimes)
    setFormData(prev => ({ ...prev, times: newTimes }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.name && formData.dosage && selectedTimes.length > 0) {
      onAdd({
        ...formData,
        times: selectedTimes,
        stockCount: formData.stockCount ? parseInt(formData.stockCount) : undefined
      })
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Pill className="w-5 h-5 text-primary" />
            Add New Medication
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Basic Information</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="condition">Medical Condition</Label>
                  <Select value={formData.condition} onValueChange={(value) => setFormData({ ...formData, condition: value, medicationType: "" })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hypertension">Hypertension</SelectItem>
                      <SelectItem value="diabetes">Diabetes</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="medicationType">Medication Type</Label>
                  <Select value={formData.medicationType} onValueChange={(value) => setFormData({ ...formData, medicationType: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {medicationTypes[formData.condition as keyof typeof medicationTypes]?.map((type) => (
                        <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="name">Medication Name</Label>
                <Input
                  id="name"
                  placeholder="Enter medication name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                <div className="flex flex-wrap gap-1 mt-2">
                  {commonMedications[formData.condition as keyof typeof commonMedications]?.slice(0, 5).map((med) => (
                    <Badge 
                      key={med} 
                      variant="outline" 
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                      onClick={() => setFormData({ ...formData, name: med })}
                    >
                      {med}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="genericName">Generic Name (Optional)</Label>
                <Input
                  id="genericName"
                  placeholder="Generic name"
                  value={formData.genericName}
                  onChange={(e) => setFormData({ ...formData, genericName: e.target.value })}
                />
              </div>
            </div>

            {/* Dosage Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Dosage & Schedule</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dosage">Dosage Amount</Label>
                  <Input
                    id="dosage"
                    placeholder="e.g., 10"
                    value={formData.dosage}
                    onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="unit">Unit</Label>
                  <Select value={formData.unit} onValueChange={(value) => setFormData({ ...formData, unit: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mg">mg</SelectItem>
                      <SelectItem value="ml">ml</SelectItem>
                      <SelectItem value="units">units</SelectItem>
                      <SelectItem value="tablets">tablets</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="frequency">Frequency</Label>
                <Select value={formData.frequency} onValueChange={handleFrequencyChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(frequencyOptions).map(([key, option]) => (
                      <SelectItem key={key} value={key}>{option.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Medication Times</Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
                  {selectedTimes.map((time, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <Input
                        type="time"
                        value={time}
                        onChange={(e) => handleTimeChange(index, e.target.value)}
                        className="text-sm"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Additional Information</h3>
              
              <div>
                <Label htmlFor="instructions">Instructions</Label>
                <Textarea
                  id="instructions"
                  placeholder="Take with food, avoid alcohol, etc."
                  value={formData.instructions}
                  onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="prescribedBy">Prescribed By</Label>
                  <Input
                    id="prescribedBy"
                    placeholder="Dr. Smith"
                    value={formData.prescribedBy}
                    onChange={(e) => setFormData({ ...formData, prescribedBy: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="prescriptionDate">Prescription Date</Label>
                  <Input
                    id="prescriptionDate"
                    type="date"
                    value={formData.prescriptionDate}
                    onChange={(e) => setFormData({ ...formData, prescriptionDate: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="stockCount">Current Stock Count</Label>
                <Input
                  id="stockCount"
                  type="number"
                  placeholder="30"
                  value={formData.stockCount}
                  onChange={(e) => setFormData({ ...formData, stockCount: e.target.value })}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  We'll remind you when you're running low
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90">
                <Pill className="w-4 h-4 mr-2" />
                Add Medication
              </Button>
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}