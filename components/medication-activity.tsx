"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, CheckCircle2, XCircle, AlertTriangle, RefreshCw } from "lucide-react"


interface ActivityItem {
  id: string
  medicationName: string
  dosage: string
  scheduledTime: string
  status: 'pending' | 'sent' | 'taken' | 'missed' | 'complication'
  sentAt?: string
  respondedAt?: string
  response?: string
}

interface MedicationActivityProps {
  userId: string
}

export default function MedicationActivity({ userId }: MedicationActivityProps) {
  const [activity, setActivity] = useState<ActivityItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadActivity = async () => {
    setIsLoading(true)
    try {
     
    } catch (error) {
      console.error('Failed to load activity:', error)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    loadActivity()
  }, [userId])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'taken':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />
      case 'missed':
        return <XCircle className="w-4 h-4 text-red-500" />
      case 'complication':
        return <AlertTriangle className="w-4 h-4 text-orange-500" />
      case 'sent':
        return <Clock className="w-4 h-4 text-blue-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      taken: "bg-green-500/20 text-green-700 border-green-500/30",
      missed: "bg-red-500/20 text-red-700 border-red-500/30",
      complication: "bg-orange-500/20 text-orange-700 border-orange-500/30",
      sent: "bg-blue-500/20 text-blue-700 border-blue-500/30",
      pending: "bg-gray-500/20 text-gray-700 border-gray-500/30"
    }

    return (
      <Badge className={variants[status as keyof typeof variants] || variants.pending}>
        {getStatusIcon(status)}
        <span className="ml-1 capitalize">{status}</span>
      </Badge>
    )
  }

  if (isLoading) {
    return (
      <Card className="border-border">
        <CardContent className="pt-6 text-center">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
          <p className="text-muted-foreground">Loading activity...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Medication Activity</CardTitle>
          <Button variant="outline" size="sm" onClick={loadActivity}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {activity.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">No medication activity yet</p>
        ) : (
          <div className="space-y-3">
            {activity.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-foreground">{item.medicationName}</p>
                  <p className="text-sm text-muted-foreground">{item.dosage} • {item.scheduledTime}</p>
                  {item.sentAt && (
                    <p className="text-xs text-muted-foreground">
                      Sent: {new Date(item.sentAt).toLocaleString()}
                    </p>
                  )}
                  {item.respondedAt && (
                    <p className="text-xs text-muted-foreground">
                      Responded: {new Date(item.respondedAt).toLocaleString()}
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2">
                  {getStatusBadge(item.status)}
                  {item.response && (
                    <span className="text-xs text-muted-foreground">
                      Response: {item.response}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}