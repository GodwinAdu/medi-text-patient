"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, Droplets, Weight, Activity, Plus, TrendingUp, Calendar } from "lucide-react"

interface VitalSigns {
  bloodPressure: { systolic: number; diastolic: number; date: string }[]
  bloodSugar: { value: number; type: string; date: string }[]
  weight: { value: number; date: string }[]
  heartRate: { value: number; date: string }[]
}

export default function VitalSignsTracker() {
  const [vitals, setVitals] = useState<VitalSigns>({
    bloodPressure: [
      { systolic: 120, diastolic: 80, date: "2025-01-06" },
      { systolic: 118, diastolic: 78, date: "2025-01-05" },
    ],
    bloodSugar: [
      { value: 95, type: "fasting", date: "2025-01-06" },
      { value: 140, type: "post_meal", date: "2025-01-05" },
    ],
    weight: [
      { value: 70, date: "2025-01-06" },
    ],
    heartRate: [
      { value: 72, date: "2025-01-06" },
    ]
  })

  const [newReading, setNewReading] = useState({
    systolic: "",
    diastolic: "",
    bloodSugar: "",
    bloodSugarType: "fasting",
    weight: "",
    heartRate: ""
  })

  const addBloodPressure = () => {
    if (newReading.systolic && newReading.diastolic) {
      setVitals(prev => ({
        ...prev,
        bloodPressure: [
          { 
            systolic: parseInt(newReading.systolic), 
            diastolic: parseInt(newReading.diastolic), 
            date: new Date().toISOString().split('T')[0] 
          },
          ...prev.bloodPressure
        ]
      }))
      setNewReading(prev => ({ ...prev, systolic: "", diastolic: "" }))
    }
  }

  const addBloodSugar = () => {
    if (newReading.bloodSugar) {
      setVitals(prev => ({
        ...prev,
        bloodSugar: [
          { 
            value: parseInt(newReading.bloodSugar), 
            type: newReading.bloodSugarType,
            date: new Date().toISOString().split('T')[0] 
          },
          ...prev.bloodSugar
        ]
      }))
      setNewReading(prev => ({ ...prev, bloodSugar: "" }))
    }
  }

  const getBloodPressureStatus = (systolic: number, diastolic: number) => {
    if (systolic < 120 && diastolic < 80) return { status: "Normal", color: "text-green-600" }
    if (systolic < 130 && diastolic < 80) return { status: "Elevated", color: "text-yellow-600" }
    if (systolic < 140 || diastolic < 90) return { status: "Stage 1", color: "text-orange-600" }
    return { status: "Stage 2", color: "text-red-600" }
  }

  const getBloodSugarStatus = (value: number, type: string) => {
    if (type === "fasting") {
      if (value < 100) return { status: "Normal", color: "text-green-600" }
      if (value < 126) return { status: "Prediabetes", color: "text-yellow-600" }
      return { status: "Diabetes", color: "text-red-600" }
    }
    if (value < 140) return { status: "Normal", color: "text-green-600" }
    if (value < 200) return { status: "Prediabetes", color: "text-yellow-600" }
    return { status: "Diabetes", color: "text-red-600" }
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="bp">Blood Pressure</TabsTrigger>
          <TabsTrigger value="bs">Blood Sugar</TabsTrigger>
          <TabsTrigger value="weight">Weight</TabsTrigger>
          <TabsTrigger value="hr">Heart Rate</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Blood Pressure Summary */}
            <Card className="border-border bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-red-700 dark:text-red-300 flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  Blood Pressure
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-900 dark:text-red-100">
                  {vitals.bloodPressure[0]?.systolic}/{vitals.bloodPressure[0]?.diastolic}
                </div>
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                  {getBloodPressureStatus(vitals.bloodPressure[0]?.systolic || 0, vitals.bloodPressure[0]?.diastolic || 0).status}
                </p>
              </CardContent>
            </Card>

            {/* Blood Sugar Summary */}
            <Card className="border-border bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300 flex items-center gap-2">
                  <Droplets className="w-4 h-4" />
                  Blood Sugar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                  {vitals.bloodSugar[0]?.value} mg/dL
                </div>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1 capitalize">
                  {vitals.bloodSugar[0]?.type.replace('_', ' ')}
                </p>
              </CardContent>
            </Card>

            {/* Weight Summary */}
            <Card className="border-border bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300 flex items-center gap-2">
                  <Weight className="w-4 h-4" />
                  Weight
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-900 dark:text-green-100">
                  {vitals.weight[0]?.value} kg
                </div>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">Stable</p>
              </CardContent>
            </Card>

            {/* Heart Rate Summary */}
            <Card className="border-border bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300 flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Heart Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                  {vitals.heartRate[0]?.value} bpm
                </div>
                <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">Normal</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="bp" className="space-y-6">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" />
                Record Blood Pressure
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="systolic">Systolic (mmHg)</Label>
                  <Input
                    id="systolic"
                    type="number"
                    placeholder="120"
                    value={newReading.systolic}
                    onChange={(e) => setNewReading(prev => ({ ...prev, systolic: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="diastolic">Diastolic (mmHg)</Label>
                  <Input
                    id="diastolic"
                    type="number"
                    placeholder="80"
                    value={newReading.diastolic}
                    onChange={(e) => setNewReading(prev => ({ ...prev, diastolic: e.target.value }))}
                  />
                </div>
              </div>
              <Button onClick={addBloodPressure} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Record Reading
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle>Recent Readings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {vitals.bloodPressure.map((reading, idx) => {
                  const status = getBloodPressureStatus(reading.systolic, reading.diastolic)
                  return (
                    <div key={idx} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                      <div>
                        <p className="font-semibold">{reading.systolic}/{reading.diastolic} mmHg</p>
                        <p className="text-sm text-muted-foreground">{reading.date}</p>
                      </div>
                      <span className={`text-sm font-medium ${status.color}`}>{status.status}</span>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bs" className="space-y-6">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Droplets className="w-5 h-5 text-blue-500" />
                Record Blood Sugar
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bloodSugar">Blood Sugar (mg/dL)</Label>
                  <Input
                    id="bloodSugar"
                    type="number"
                    placeholder="95"
                    value={newReading.bloodSugar}
                    onChange={(e) => setNewReading(prev => ({ ...prev, bloodSugar: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="bloodSugarType">Type</Label>
                  <Select value={newReading.bloodSugarType} onValueChange={(value) => setNewReading(prev => ({ ...prev, bloodSugarType: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fasting">Fasting</SelectItem>
                      <SelectItem value="random">Random</SelectItem>
                      <SelectItem value="post_meal">Post Meal</SelectItem>
                      <SelectItem value="bedtime">Bedtime</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={addBloodSugar} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Record Reading
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle>Recent Readings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {vitals.bloodSugar.map((reading, idx) => {
                  const status = getBloodSugarStatus(reading.value, reading.type)
                  return (
                    <div key={idx} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                      <div>
                        <p className="font-semibold">{reading.value} mg/dL</p>
                        <p className="text-sm text-muted-foreground capitalize">{reading.type.replace('_', ' ')} • {reading.date}</p>
                      </div>
                      <span className={`text-sm font-medium ${status.color}`}>{status.status}</span>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}