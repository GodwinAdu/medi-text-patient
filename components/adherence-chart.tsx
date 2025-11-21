"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface AdherenceLog {
  id: string
  medicationId: string
  date: string
  taken: boolean
}

interface AdherenceChartProps {
  data: AdherenceLog[]
}

export default function AdherenceChart({ data }: AdherenceChartProps) {
  const chartData = data
    .reduce(
      (acc, log) => {
        const existing = acc.find((item) => item.date === log.date)
        if (existing) {
          if (log.taken) {
            existing.taken += 1
          } else {
            existing.missed += 1
          }
        } else {
          acc.push({
            date: log.date,
            taken: log.taken ? 1 : 0,
            missed: log.taken ? 0 : 1,
          })
        }
        return acc
      },
      [] as Array<{ date: string; taken: number; missed: number }>,
    )
    .slice(-7)
    .map((item, index) => ({
      ...item,
      day: `Day ${index + 1}`,
    }))

  if (data.length === 0) {
    return (
      <Card className="border-border">
        <CardContent className="pt-6 text-center">
          <p className="text-muted-foreground">No adherence data yet. Start marking your medications as taken!</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle>Weekly Adherence</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="day" stroke="var(--muted-foreground)" />
            <YAxis stroke="var(--muted-foreground)" />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
                color: "var(--foreground)",
              }}
            />
            <Legend />
            <Bar dataKey="taken" fill="var(--primary)" name="Taken" />
            <Bar dataKey="missed" fill="var(--destructive)" name="Missed" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
