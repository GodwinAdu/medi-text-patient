"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, TrendingUp, TrendingDown, Activity } from "lucide-react"

interface PatientMonitorProps {
  patientName: string
  adherenceRate: number
  dosesThisWeek: number
  missedDoses: number
  riskLevel: "low" | "medium" | "high"
}

export function FacilityPatientMonitor({
  patientName,
  adherenceRate,
  dosesThisWeek,
  missedDoses,
  riskLevel,
}: PatientMonitorProps) {
  const getRiskColor = (level: string) => {
    switch (level) {
      case "low":
        return "bg-green-500/20 text-green-700 border-green-500/30"
      case "medium":
        return "bg-orange-500/20 text-orange-700 border-orange-500/30"
      case "high":
        return "bg-red-500/20 text-red-700 border-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-700 border-gray-500/30"
    }
  }

  const getTrendIcon = (rate: number) => {
    if (rate >= 90) return <TrendingUp className="w-4 h-4 text-green-500" />
    if (rate >= 70) return <Activity className="w-4 h-4 text-orange-500" />
    return <TrendingDown className="w-4 h-4 text-red-500" />
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{patientName}</CardTitle>
            <CardDescription>Real-time adherence monitoring</CardDescription>
          </div>
          <Badge className={getRiskColor(riskLevel)}>
            {riskLevel === "high" && <AlertCircle className="w-3 h-3 mr-1" />}
            {riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)} Risk
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {riskLevel === "high" && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>This patient requires immediate attention. Adherence is declining.</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-foreground">Adherence Rate</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-primary">{adherenceRate}%</span>
              {getTrendIcon(adherenceRate)}
            </div>
          </div>
          <div className="w-full bg-secondary rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all ${
                adherenceRate >= 90 ? "bg-green-500" : adherenceRate >= 70 ? "bg-orange-500" : "bg-red-500"
              }`}
              style={{ width: `${adherenceRate}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="p-3 rounded-lg bg-secondary/50 text-center">
            <p className="text-2xl font-bold text-primary">{dosesThisWeek}</p>
            <p className="text-xs text-muted-foreground">Doses Taken</p>
          </div>
          <div className="p-3 rounded-lg bg-secondary/50 text-center">
            <p className="text-2xl font-bold text-red-500">{missedDoses}</p>
            <p className="text-xs text-muted-foreground">Missed</p>
          </div>
          <div className="p-3 rounded-lg bg-secondary/50 text-center">
            <p className="text-2xl font-bold text-accent">3</p>
            <p className="text-xs text-muted-foreground">Pending</p>
          </div>
        </div>

        <Button className="w-full bg-primary hover:bg-primary/90">View Detailed Report</Button>
      </CardContent>
    </Card>
  )
}
