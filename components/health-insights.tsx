"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Heart, 
  Droplets, 
  Pill, 
  Calendar,
  Target,
  Award,
  Activity
} from "lucide-react"

interface HealthInsightsProps {
  medications: any[]
  adherenceRate: number
}

export default function HealthInsights({ medications, adherenceRate }: HealthInsightsProps) {
  const insights = [
    {
      type: "success",
      icon: CheckCircle,
      title: "Excellent Blood Pressure Control",
      description: "Your recent readings show consistent control. Keep taking your medications as prescribed.",
      priority: "high",
      category: "Blood Pressure",
      trend: "stable"
    },
    {
      type: "warning",
      icon: AlertTriangle,
      title: "Medication Adherence Alert",
      description: `Your adherence rate is ${adherenceRate}%. Try to maintain above 90% for optimal health outcomes.`,
      priority: "medium",
      category: "Adherence",
      trend: adherenceRate >= 90 ? "up" : "down"
    },
    {
      type: "info",
      icon: Heart,
      title: "Heart Health Recommendation",
      description: "Consider adding 30 minutes of light exercise to your daily routine. Consult your doctor first.",
      priority: "low",
      category: "Lifestyle",
      trend: "neutral"
    },
    {
      type: "success",
      icon: Droplets,
      title: "Blood Sugar Stability",
      description: "Your fasting glucose levels have been within target range for the past week.",
      priority: "high",
      category: "Blood Sugar",
      trend: "stable"
    }
  ]

  const healthScore = Math.round((adherenceRate + 85 + 80) / 3) // Simplified calculation

  const goals = [
    {
      title: "Blood Pressure Target",
      current: "120/80",
      target: "<130/80",
      progress: 85,
      status: "on_track"
    },
    {
      title: "Medication Adherence",
      current: `${adherenceRate}%`,
      target: "95%",
      progress: adherenceRate,
      status: adherenceRate >= 90 ? "on_track" : "needs_attention"
    },
    {
      title: "Blood Sugar Control",
      current: "95 mg/dL",
      target: "<100 mg/dL",
      progress: 90,
      status: "on_track"
    }
  ]

  return (
    <div className="space-y-6">
      {/* Health Score Overview */}
      <Card className="border-border bg-gradient-to-br from-primary/5 to-accent/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" />
            Your Health Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-4xl font-bold text-primary">{healthScore}</div>
              <p className="text-sm text-muted-foreground">Out of 100</p>
            </div>
            <div className="text-right">
              <Badge className={`${
                healthScore >= 80 ? 'bg-green-100 text-green-800' :
                healthScore >= 60 ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {healthScore >= 80 ? 'Excellent' : healthScore >= 60 ? 'Good' : 'Needs Improvement'}
              </Badge>
              <p className="text-xs text-muted-foreground mt-1">
                {healthScore >= 80 ? 'Keep it up!' : 'Room for improvement'}
              </p>
            </div>
          </div>
          <Progress value={healthScore} className="h-3" />
        </CardContent>
      </Card>

      {/* Health Goals */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-accent" />
            Health Goals Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {goals.map((goal, idx) => (
            <div key={idx} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium text-foreground">{goal.title}</span>
                <Badge variant={goal.status === 'on_track' ? 'default' : 'destructive'}>
                  {goal.status === 'on_track' ? 'On Track' : 'Needs Attention'}
                </Badge>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Current: {goal.current}</span>
                <span>Target: {goal.target}</span>
              </div>
              <Progress value={goal.progress} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* AI Insights */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Personalized Health Insights
        </h3>
        
        {insights.map((insight, idx) => {
          const Icon = insight.icon
          return (
            <Card key={idx} className="border-border">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-full ${
                    insight.type === 'success' ? 'bg-green-100 text-green-600' :
                    insight.type === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                    insight.type === 'error' ? 'bg-red-100 text-red-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-foreground">{insight.title}</h4>
                      <Badge variant="outline" className="text-xs">
                        {insight.category}
                      </Badge>
                      {insight.trend === 'up' && <TrendingUp className="w-4 h-4 text-green-500" />}
                      {insight.trend === 'down' && <TrendingDown className="w-4 h-4 text-red-500" />}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{insight.description}</p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        Learn More
                      </Button>
                      {insight.type === 'warning' && (
                        <Button size="sm" className="bg-primary hover:bg-primary/90">
                          Take Action
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Weekly Summary */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            This Week's Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-secondary/50 rounded-lg">
              <Pill className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">28/30</div>
              <p className="text-sm text-muted-foreground">Doses Taken</p>
            </div>
            <div className="text-center p-4 bg-secondary/50 rounded-lg">
              <Heart className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">5</div>
              <p className="text-sm text-muted-foreground">BP Readings</p>
            </div>
            <div className="text-center p-4 bg-secondary/50 rounded-lg">
              <Droplets className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">3</div>
              <p className="text-sm text-muted-foreground">Blood Sugar Tests</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}