"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle } from "lucide-react"

interface Medication {
  id: string
  name: string
  dosage: string
  frequency: string
  time: string
}

interface AdherenceLog {
  id: string
  medicationId: string
  date: string
  taken: boolean
}

interface AIInsightsProps {
  medications: Medication[]
  adherenceLogs: AdherenceLog[]
}

export default function AIInsights({ medications, adherenceLogs }: AIInsightsProps) {
  // Calculate insights
  const getAdherenceStats = () => {
    const stats = medications.map((med) => {
      const medLogs = adherenceLogs.filter((log) => log.medicationId === med.id)
      const taken = medLogs.filter((log) => log.taken).length
      const total = medLogs.length
      const percentage = total > 0 ? Math.round((taken / total) * 100) : 0

      let riskLevel: "low" | "medium" | "high" = "low"
      if (percentage < 50) riskLevel = "high"
      else if (percentage < 75) riskLevel = "medium"

      return {
        medicationId: med.id,
        medicationName: med.name,
        adherence: percentage,
        riskLevel,
      }
    })

    return stats
  }

  const stats = getAdherenceStats()
  const avgAdherence = Math.round(stats.reduce((sum, s) => sum + s.adherence, 0) / stats.length || 0)
  const highRiskCount = stats.filter((s) => s.riskLevel === "high").length

  let overallStatus = "Excellent"
  let statusColor = "text-green-600"
  let recommendation = "Your medication adherence is excellent. Keep maintaining this routine!"

  if (avgAdherence < 50) {
    overallStatus = "Critical"
    statusColor = "text-red-600"
    recommendation =
      "Your overall adherence is low. Please enable SMS reminders and set daily alarms for all medications."
  } else if (avgAdherence < 70) {
    overallStatus = "Needs Improvement"
    statusColor = "text-yellow-600"
    recommendation = "Your adherence could be better. Consider using reminders and tracking tools."
  } else if (avgAdherence < 85) {
    overallStatus = "Good"
    statusColor = "text-blue-600"
    recommendation = "Your adherence is good. Small improvements could make it excellent."
  }

  return (
    <div className="space-y-6">
      {/* Overall Status */}
      <Card className="border-border bg-gradient-to-br from-card to-card/50">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>AI Health Insights</span>
            <Badge className={`${statusColor} bg-transparent border`}>{overallStatus}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Overall Adherence Rate</p>
            <div className="flex items-center gap-4">
              <div className="text-4xl font-bold text-primary">{avgAdherence}%</div>
              <div className="flex-1 bg-muted rounded-full h-3 overflow-hidden">
                <div className="bg-primary h-full transition-all" style={{ width: `${avgAdherence}%` }} />
              </div>
            </div>
          </div>
          <p className="text-sm text-foreground mt-4">{recommendation}</p>
        </CardContent>
      </Card>

      {/* Medication-Specific Predictions */}
      {stats.length > 0 && (
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Medication Adherence Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.map((stat) => (
                <div key={stat.medicationId} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{stat.medicationName}</p>
                    <p className="text-sm text-muted-foreground">Adherence: {stat.adherence}%</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {stat.riskLevel === "low" && (
                      <Badge className="bg-green-100 text-green-800 border-green-300">Low Risk</Badge>
                    )}
                    {stat.riskLevel === "medium" && (
                      <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">Medium Risk</Badge>
                    )}
                    {stat.riskLevel === "high" && (
                      <Badge className="bg-red-100 text-red-800 border-red-300">High Risk</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Risk Summary */}
      {highRiskCount > 0 && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="w-5 h-5" />
              Attention Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-foreground">
              You have {highRiskCount} medication{highRiskCount > 1 ? "s" : ""} with low adherence. Consider enabling
              SMS reminders to improve your medication adherence.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
