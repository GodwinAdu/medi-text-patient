"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Pill, Plus, TrendingUp, Calendar, LogOut, Brain, 
  Heart, Activity, Target, Zap, Sparkles, Bot, 
  Bell, Video, ChartLine, Lightbulb, AlertTriangle, 
  MessageSquare, Eye, Send, Radar, Droplets, Star,
  Smartphone, Menu, X, Home, User, Settings
} from "lucide-react"
import { getCurrentUser } from "@/lib/auth"
import { logout } from "@/lib/actions/patient-auth"
import { getMedications, addMedication, markMedicationTaken, getAdherenceStats } from "@/lib/actions/medication-actions"
import { getPatientProfile } from "@/lib/actions/patient-data"
import { getSMSHistory, getMedicationHistory } from "@/lib/actions/sms-actions"
import { getVitalSigns, addVitalSign, updateVitalSign, deleteVitalSign } from "@/lib/actions/vital-signs-actions"
import { getPatientMessages } from "@/lib/actions/message-actions"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

interface User {
  id: string
  name: string
  email: string
  phone: string
}

interface Medication {
  id: string
  name: string
  dosage: string
  frequency: string
  times: string[]
  startTime: string
  condition?: string
  instructions?: string
  adherenceRate: number
  nextDose?: string
  totalDoses: number
  takenDoses: number
  missedDoses: number
}

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [medications, setMedications] = useState<Medication[]>([])
  const [adherenceStats, setAdherenceStats] = useState({ taken: 0, total: 0, percentage: 0 })
  const [patientProfile, setPatientProfile] = useState<any>(null)
  const [smsHistory, setSmsHistory] = useState<any[]>([])
  const [medicationHistory, setMedicationHistory] = useState<any[]>([])
  const [vitalSigns, setVitalSigns] = useState<any[]>([])
  const [messages, setMessages] = useState<any[]>([])
  const [showVitalsModal, setShowVitalsModal] = useState(false)
  const [editingVital, setEditingVital] = useState<any>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [isLoading, setIsLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [notifications, setNotifications] = useState([
    { id: '1', type: 'reminder', message: 'Time to take your Metformin 500mg', time: '2 min ago', read: false },
    { id: '2', type: 'achievement', message: 'Great job! 7-day adherence streak', time: '1 hour ago', read: false },
    { id: '3', type: 'health', message: 'Blood pressure reading due', time: '3 hours ago', read: true },
  ])
  const [showNotifications, setShowNotifications] = useState(false)
  const [aiInsights, setAiInsights] = useState([
    { type: 'prediction', message: 'Your adherence pattern suggests optimal timing at 8:30 AM', confidence: 92 },
    { type: 'recommendation', message: 'Consider taking Metformin with breakfast for better absorption', confidence: 87 },
    { type: 'alert', message: 'Blood pressure trending slightly high - consult your doctor', confidence: 78 },
  ])
  const [healthScore, setHealthScore] = useState({
    overall: 85,
    adherence: 92,
    vitals: 78,
    lifestyle: 85,
    trend: '+5'
  })

  useEffect(() => {
    const initializeUser = async () => {
      try {
        const currentUser = await getCurrentUser()
        
        if (!currentUser) {
          router.push("/login")
          return
        }

        setUser(currentUser)
        await loadDashboardData()
      } catch (error) {
        console.error("Failed to get user:", error)
        toast.error("Session expired. Please login again.")
        router.push("/login")
      } finally {
        setIsLoading(false)
      }
    }

    initializeUser()
  }, [router])

  const loadDashboardData = async () => {
    try {
      const [medicationsResult, statsResult, profileResult, smsResult, historyResult, vitalsResult, messagesResult] = await Promise.all([
        getMedications(),
        getAdherenceStats(),
        getPatientProfile(),
        getSMSHistory(),
        getMedicationHistory(),
        getVitalSigns(),
        getPatientMessages()
      ])

      if (medicationsResult.success) {
        setMedications(medicationsResult.medications || [])
      }

      if (statsResult.success && statsResult.stats) {
        setAdherenceStats(statsResult.stats)
      }

      if (profileResult.success && profileResult.patient) {
        setPatientProfile(profileResult.patient)
        setUser({
          id: profileResult.patient.id,
          name: profileResult.patient.name,
          email: profileResult.patient.email,
          phone: profileResult.patient.phone
        })
      }

      if (smsResult.success) {
        setSmsHistory(smsResult.messages || [])
      }

      if (historyResult.success) {
        setMedicationHistory(historyResult.history || [])
      }

      if (vitalsResult.success) {
        setVitalSigns(vitalsResult.vitals || [])
      }

      if (messagesResult.success) {
        setMessages(messagesResult.messages || [])
      }
    } catch (error) {
      console.error("Failed to load dashboard data:", error)
      toast.error("Failed to load some dashboard data. Please refresh the page.")
    }
  }

  const handleLogout = async () => {
    toast.success("Logged out successfully. Stay healthy! 👋")
    await logout()
    router.push("/login")
  }

  const handleMarkTaken = async (medicationId: string) => {
    try {
      const result = await markMedicationTaken(medicationId)
      if (result.success) {
        toast.success("Medication marked as taken! 💊")
        await loadDashboardData()
      } else {
        toast.error("Failed to mark medication as taken")
      }
    } catch (error) {
      console.error("Failed to mark medication taken:", error)
      toast.error("Something went wrong. Please try again.")
    }
  }

  const handleEditVital = (vital: any) => {
    setEditingVital(vital)
    setShowVitalsModal(true)
  }

  const handleDeleteVital = async (vitalId: string) => {
    if (confirm('Are you sure you want to delete this vital sign reading?')) {
      try {
        const result = await deleteVitalSign(vitalId)
        if (result.success) {
          toast.success("Vital sign deleted successfully")
          await loadDashboardData()
        } else {
          toast.error("Failed to delete vital sign")
        }
      } catch (error) {
        console.error("Failed to delete vital sign:", error)
        toast.error("Something went wrong. Please try again.")
      }
    }
  }

  const handleSaveVital = async (vitalData: any) => {
    try {
      const result = editingVital 
        ? await updateVitalSign(editingVital.id, vitalData)
        : await addVitalSign(vitalData)
      
      if (result.success) {
        toast.success(editingVital ? "Vital signs updated successfully! 🎉" : "Vital signs saved successfully! 📊")
        await loadDashboardData()
        setShowVitalsModal(false)
        setEditingVital(null)
      } else {
        toast.error(editingVital ? "Failed to update vital signs" : "Failed to save vital signs")
      }
    } catch (error) {
      console.error("Failed to save vital sign:", error)
      toast.error("Something went wrong. Please try again.")
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Pill className="w-12 h-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  const unreadNotifications = notifications.filter(n => !n.read).length

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: Home, color: 'text-blue-600' },
    { id: 'profile', label: 'Profile', icon: User, color: 'text-purple-600' },
    { id: 'medications', label: 'Medications', icon: Pill, color: 'text-green-600' },
    { id: 'vitals', label: 'Vitals', icon: Heart, color: 'text-red-600' },
    { id: 'schedule', label: 'Schedule', icon: Calendar, color: 'text-orange-600' },
    { id: 'goals', label: 'Goals', icon: Target, color: 'text-teal-600' },
    { id: 'ai-coach', label: 'AI Coach', icon: Bot, color: 'text-indigo-600' },
    { id: 'telehealth', label: 'Telehealth', icon: Video, color: 'text-cyan-600' },
    { id: 'insights', label: 'Insights', icon: ChartLine, color: 'text-pink-600' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Pill className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">MediText</span>
          </div>
          <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id)
                    setSidebarOpen(false)
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === item.id
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${activeTab === item.id ? item.color : ''}`} />
                  <span className="font-medium">{item.label}</span>
                </button>
              )
            })}
          </div>
        </nav>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">{user?.name?.charAt(0)}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.phone}</p>
            </div>
          </div>
          <Button onClick={handleLogout} variant="outline" size="sm" className="w-full gap-2">
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
                <Menu className="w-5 h-5" />
              </Button>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white capitalize">
                {sidebarItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
              </h1>
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="sm" 
                className="relative"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell className="w-5 h-5" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadNotifications}
                  </span>
                )}
              </Button>
              <div className="flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/20 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs text-green-600 dark:text-green-400 font-medium">Online</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-4 sm:p-6">
          {/* Welcome Section - Only show on overview */}
          {activeTab === 'overview' && (
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Welcome back, {user?.name}!</h2>
                  <p className="text-gray-600 dark:text-gray-400">Manage your medications and track your adherence with AI-powered insights</p>
                </div>
                {user?.name?.startsWith('Patient') && (
                  <Button variant="outline" size="sm" className="gap-2">
                    <span>Update Name</span>
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Smart Notifications Panel */}
          {showNotifications && (
            <Card className="border-border mb-6 bg-gradient-to-r from-blue-500/5 to-purple-500/5">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5 text-blue-600" />
                    Smart Notifications
                  </CardTitle>
                  <Button size="sm" variant="ghost" onClick={() => setNotifications(notifications.map(n => ({ ...n, read: true })))}>
                    Mark all read
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {notifications.map((notification) => (
                  <div key={notification.id} className={`flex items-start gap-3 p-3 rounded-lg ${
                    notification.read ? 'bg-secondary/30' : 'bg-blue-500/10 border border-blue-500/20'
                  }`}>
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      notification.type === 'reminder' ? 'bg-blue-500' :
                      notification.type === 'achievement' ? 'bg-green-500' : 'bg-orange-500'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{notification.message}</p>
                      <p className="text-xs text-muted-foreground">{notification.time}</p>
                    </div>
                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                      <Eye className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Dynamic Content Based on Active Tab */}

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Enhanced Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-border bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 hover:shadow-lg transition-all duration-300 cursor-pointer group">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300 flex items-center gap-2">
                      <Pill className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      Active Medications
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl sm:text-3xl font-bold text-blue-900 dark:text-blue-100">{medications.length}</div>
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Currently tracking</p>
                    <div className="mt-2 flex items-center gap-1">
                      <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-1.5">
                        <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '100%' }} />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 hover:shadow-lg transition-all duration-300 cursor-pointer group">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      Adherence Rate
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl sm:text-3xl font-bold text-green-900 dark:text-green-100">{adherenceStats.percentage}%</div>
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">This month</p>
                    <div className="mt-2 flex items-center gap-1">
                      <div className="w-full bg-green-200 dark:bg-green-800 rounded-full h-1.5">
                        <div className="bg-green-600 h-1.5 rounded-full transition-all duration-500" style={{ width: `${adherenceStats.percentage}%` }} />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 hover:shadow-lg transition-all duration-300 cursor-pointer group">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300 flex items-center gap-2">
                      <Calendar className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      Next Dose
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-lg sm:text-xl font-bold text-purple-900 dark:text-purple-100">2:00 PM</div>
                    <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">Metformin 500mg</p>
                    <div className="mt-2 flex items-center gap-1">
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                      <span className="text-xs text-purple-600">In 3 hours</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 hover:shadow-lg transition-all duration-300 cursor-pointer group">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300 flex items-center gap-2">
                      <Brain className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      AI Health Score
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl sm:text-3xl font-bold text-orange-900 dark:text-orange-100">{healthScore.overall}</div>
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">{healthScore.trend} this week</p>
                    <div className="mt-2 flex items-center gap-1">
                      <Star className="w-3 h-3 text-orange-500 fill-current" />
                      <span className="text-xs text-orange-600">Excellent</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* AI Health Insights */}
              <Card className="border-border bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-indigo-600" />
                    AI Health Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {aiInsights.map((insight, idx) => (
                      <div key={idx} className="p-4 rounded-lg bg-white/50 dark:bg-black/20 border border-white/20">
                        <div className="flex items-start gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            insight.type === 'prediction' ? 'bg-blue-500/20 text-blue-600' :
                            insight.type === 'recommendation' ? 'bg-green-500/20 text-green-600' :
                            'bg-orange-500/20 text-orange-600'
                          }`}>
                            {insight.type === 'prediction' ? <TrendingUp className="w-4 h-4" /> :
                             insight.type === 'recommendation' ? <Lightbulb className="w-4 h-4" /> :
                             <AlertTriangle className="w-4 h-4" />}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium mb-1 capitalize">{insight.type}</p>
                            <p className="text-xs text-muted-foreground mb-2">{insight.message}</p>
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 bg-green-500 rounded-full" />
                              <span className="text-xs text-green-600">{insight.confidence}% confidence</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-600" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <Button variant="outline" className="h-20 flex-col gap-2 hover:bg-blue-50 hover:border-blue-200 group">
                      <Pill className="w-6 h-6 text-blue-600 group-hover:scale-110 transition-transform" />
                      <span className="text-xs">Add Medication</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex-col gap-2 hover:bg-red-50 hover:border-red-200 group" onClick={() => setShowVitalsModal(true)}>
                      <Heart className="w-6 h-6 text-red-600 group-hover:scale-110 transition-transform" />
                      <span className="text-xs">Log Vitals</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex-col gap-2 hover:bg-green-50 hover:border-green-200 group">
                      <MessageSquare className="w-6 h-6 text-green-600 group-hover:scale-110 transition-transform" />
                      <span className="text-xs">Message Doctor</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex-col gap-2 hover:bg-purple-50 hover:border-purple-200 group">
                      <Target className="w-6 h-6 text-purple-600 group-hover:scale-110 transition-transform" />
                      <span className="text-xs">Set Goal</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Today's Schedule with Progress */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-primary" />
                        Today's Schedule
                      </div>
                      <Badge className="bg-green-500/20 text-green-600">
                        {medications.filter(m => m.adherenceRate > 80).length}/{medications.length} on track
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {medications.slice(0, 3).map((med, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-gradient-to-r from-secondary/30 to-secondary/10 rounded-lg border border-border/50 hover:shadow-md transition-all">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                              <Pill className="w-6 h-6 text-primary" />
                            </div>
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                              <span className="text-xs text-white font-bold">✓</span>
                            </div>
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{med.name}</p>
                            <p className="text-sm text-muted-foreground">{med.dosage} • {med.times?.[0] || 'Not set'}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="w-16 bg-secondary rounded-full h-1.5">
                                <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${med.adherenceRate}%` }} />
                              </div>
                              <span className="text-xs text-green-600">{med.adherenceRate}%</span>
                            </div>
                          </div>
                        </div>
                        <Button size="sm" className="bg-primary hover:bg-primary/90 shadow-md" onClick={() => handleMarkTaken(med.id)}>
                          Mark Taken
                        </Button>
                      </div>
                    ))}
                    {medications.length === 0 && (
                      <div className="text-center py-8">
                        <Pill className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                        <p className="text-muted-foreground">No medications added yet</p>
                        <Button className="mt-3" onClick={() => setActiveTab('medications')}>
                          Add Your First Medication
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Health Progress Dashboard */}
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="w-5 h-5 text-green-600" />
                      Health Progress
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Medication Adherence</span>
                        <span className="text-sm font-bold text-green-600">{healthScore.adherence}%</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${healthScore.adherence}%` }} />
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Vital Signs</span>
                        <span className="text-sm font-bold text-blue-600">{healthScore.vitals}%</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${healthScore.vitals}%` }} />
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Lifestyle Goals</span>
                        <span className="text-sm font-bold text-purple-600">{healthScore.lifestyle}%</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div className="bg-purple-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${healthScore.lifestyle}%` }} />
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Overall Health Score</span>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-orange-600">{healthScore.overall}</span>
                          <div className="flex items-center gap-1 text-green-600">
                            <TrendingUp className="w-4 h-4" />
                            <span className="text-sm font-medium">{healthScore.trend}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Medications Tab */}
          {activeTab === 'medications' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">Your Medications</h2>
                <Button className="bg-primary hover:bg-primary/90 gap-2 w-full sm:w-auto">
                  <Plus className="w-4 h-4" />
                  Add Medication
                </Button>
              </div>
              <div className="grid gap-4">
                {medications.map((med) => (
                  <Card key={med.id} className="border-border hover:shadow-md transition-shadow">
                    <CardContent className="pt-4 sm:pt-6">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-base sm:text-lg font-semibold text-foreground">{med.name}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{med.dosage}</p>
                          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-3 text-sm text-muted-foreground">
                            <span>Frequency: {med.frequency}</span>
                            <span>Time: {med.times?.[0] || 'Not set'}</span>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <Button size="sm" className="bg-primary hover:bg-primary/90 gap-2 flex-1 sm:flex-none" onClick={() => handleMarkTaken(med.id)}>
                            <Plus className="w-4 h-4" />
                            Mark Taken
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Vitals Tab */}
          {activeTab === 'vitals' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">Vital Signs Tracking</h2>
                <Button onClick={() => setShowVitalsModal(true)} className="bg-red-600 hover:bg-red-700 gap-2">
                  <Plus className="w-4 h-4" />
                  Add Vital Signs
                </Button>
              </div>
              
              {/* Vital Signs Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Blood Pressure */}
                <Card className="border-border bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-950/20 dark:to-pink-950/20 hover:shadow-lg transition-all">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="w-5 h-5 text-red-600" />
                      Blood Pressure
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      {vitalSigns.length > 0 && vitalSigns[0].bloodPressure ? (
                        <>
                          <div className="text-3xl font-bold text-red-600 mb-2">
                            {vitalSigns[0].bloodPressure.systolic}/{vitalSigns[0].bloodPressure.diastolic}
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">mmHg</p>
                          <p className="text-sm text-muted-foreground mb-2">
                            {new Date(vitalSigns[0].recordedDate).toLocaleDateString()}
                          </p>
                          <Badge className={`${
                            vitalSigns[0].bloodPressure.systolic < 120 && vitalSigns[0].bloodPressure.diastolic < 80 
                              ? 'bg-green-500/20 text-green-600' 
                              : vitalSigns[0].bloodPressure.systolic < 140 && vitalSigns[0].bloodPressure.diastolic < 90
                              ? 'bg-yellow-500/20 text-yellow-600'
                              : 'bg-red-500/20 text-red-600'
                          }`}>
                            {vitalSigns[0].bloodPressure.systolic < 120 && vitalSigns[0].bloodPressure.diastolic < 80 
                              ? 'Normal' 
                              : vitalSigns[0].bloodPressure.systolic < 140 && vitalSigns[0].bloodPressure.diastolic < 90
                              ? 'Elevated'
                              : 'High'}
                          </Badge>
                        </>
                      ) : (
                        <div className="py-8">
                          <Heart className="w-12 h-12 text-red-300 mx-auto mb-4" />
                          <p className="text-muted-foreground">No readings yet</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Blood Sugar */}
                <Card className="border-border bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 hover:shadow-lg transition-all">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Droplets className="w-5 h-5 text-blue-600" />
                      Blood Sugar
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      {vitalSigns.length > 0 && vitalSigns[0].bloodSugar ? (
                        <>
                          <div className="text-3xl font-bold text-blue-600 mb-2">{vitalSigns[0].bloodSugar}</div>
                          <p className="text-xs text-muted-foreground mb-2">mg/dL</p>
                          <p className="text-sm text-muted-foreground mb-2">
                            {new Date(vitalSigns[0].recordedDate).toLocaleDateString()}
                          </p>
                          <Badge className={`${
                            vitalSigns[0].bloodSugar >= 70 && vitalSigns[0].bloodSugar <= 140
                              ? 'bg-green-500/20 text-green-600'
                              : vitalSigns[0].bloodSugar > 140 && vitalSigns[0].bloodSugar <= 200
                              ? 'bg-yellow-500/20 text-yellow-600'
                              : 'bg-red-500/20 text-red-600'
                          }`}>
                            {vitalSigns[0].bloodSugar >= 70 && vitalSigns[0].bloodSugar <= 140
                              ? 'Normal'
                              : vitalSigns[0].bloodSugar > 140 && vitalSigns[0].bloodSugar <= 200
                              ? 'Elevated'
                              : 'High'}
                          </Badge>
                        </>
                      ) : (
                        <div className="py-8">
                          <Droplets className="w-12 h-12 text-blue-300 mx-auto mb-4" />
                          <p className="text-muted-foreground">No readings yet</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Heart Rate */}
                <Card className="border-border bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 hover:shadow-lg transition-all">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="w-5 h-5 text-green-600" />
                      Heart Rate
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      {vitalSigns.length > 0 && vitalSigns[0].heartRate ? (
                        <>
                          <div className="text-3xl font-bold text-green-600 mb-2">{vitalSigns[0].heartRate}</div>
                          <p className="text-xs text-muted-foreground mb-2">bpm</p>
                          <p className="text-sm text-muted-foreground mb-2">
                            {new Date(vitalSigns[0].recordedDate).toLocaleDateString()}
                          </p>
                          <Badge className={`${
                            vitalSigns[0].heartRate >= 60 && vitalSigns[0].heartRate <= 100
                              ? 'bg-green-500/20 text-green-600'
                              : 'bg-yellow-500/20 text-yellow-600'
                          }`}>
                            {vitalSigns[0].heartRate >= 60 && vitalSigns[0].heartRate <= 100 ? 'Normal' : 'Abnormal'}
                          </Badge>
                        </>
                      ) : (
                        <div className="py-8">
                          <Activity className="w-12 h-12 text-green-300 mx-auto mb-4" />
                          <p className="text-muted-foreground">No readings yet</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Weight & BMI */}
                <Card className="border-border bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20 hover:shadow-lg transition-all">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-purple-600" />
                      Weight & BMI
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      {vitalSigns.length > 0 && vitalSigns[0].weight ? (
                        <>
                          <div className="text-2xl font-bold text-purple-600 mb-1">{vitalSigns[0].weight} kg</div>
                          {vitalSigns[0].bmi && (
                            <div className="text-lg font-semibold text-purple-500 mb-2">BMI: {vitalSigns[0].bmi}</div>
                          )}
                          <p className="text-sm text-muted-foreground mb-2">
                            {new Date(vitalSigns[0].recordedDate).toLocaleDateString()}
                          </p>
                          {vitalSigns[0].bmi && (
                            <Badge className={`${
                              vitalSigns[0].bmi >= 18.5 && vitalSigns[0].bmi < 25
                                ? 'bg-green-500/20 text-green-600'
                                : vitalSigns[0].bmi >= 25 && vitalSigns[0].bmi < 30
                                ? 'bg-yellow-500/20 text-yellow-600'
                                : 'bg-red-500/20 text-red-600'
                            }`}>
                              {vitalSigns[0].bmi >= 18.5 && vitalSigns[0].bmi < 25
                                ? 'Normal'
                                : vitalSigns[0].bmi >= 25 && vitalSigns[0].bmi < 30
                                ? 'Overweight'
                                : vitalSigns[0].bmi >= 30 ? 'Obese' : 'Underweight'}
                            </Badge>
                          )}
                        </>
                      ) : (
                        <div className="py-8">
                          <Target className="w-12 h-12 text-purple-300 mx-auto mb-4" />
                          <p className="text-muted-foreground">No readings yet</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Temperature */}
                <Card className="border-border bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 hover:shadow-lg transition-all">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-orange-600">🌡️</span>
                      Temperature
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      {vitalSigns.length > 0 && vitalSigns[0].temperature ? (
                        <>
                          <div className="text-3xl font-bold text-orange-600 mb-2">{vitalSigns[0].temperature}°C</div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {new Date(vitalSigns[0].recordedDate).toLocaleDateString()}
                          </p>
                          <Badge className={`${
                            vitalSigns[0].temperature >= 36.1 && vitalSigns[0].temperature <= 37.2
                              ? 'bg-green-500/20 text-green-600'
                              : 'bg-red-500/20 text-red-600'
                          }`}>
                            {vitalSigns[0].temperature >= 36.1 && vitalSigns[0].temperature <= 37.2 ? 'Normal' : 'Abnormal'}
                          </Badge>
                        </>
                      ) : (
                        <div className="py-8">
                          <span className="text-6xl mb-4 block opacity-30">🌡️</span>
                          <p className="text-muted-foreground">No readings yet</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Oxygen Saturation */}
                <Card className="border-border bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/20 dark:to-cyan-950/20 hover:shadow-lg transition-all">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-teal-600">💨</span>
                      Oxygen Saturation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      {vitalSigns.length > 0 && vitalSigns[0].oxygenSaturation ? (
                        <>
                          <div className="text-3xl font-bold text-teal-600 mb-2">{vitalSigns[0].oxygenSaturation}%</div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {new Date(vitalSigns[0].recordedDate).toLocaleDateString()}
                          </p>
                          <Badge className={`${
                            vitalSigns[0].oxygenSaturation >= 95
                              ? 'bg-green-500/20 text-green-600'
                              : 'bg-red-500/20 text-red-600'
                          }`}>
                            {vitalSigns[0].oxygenSaturation >= 95 ? 'Normal' : 'Low'}
                          </Badge>
                        </>
                      ) : (
                        <div className="py-8">
                          <span className="text-6xl mb-4 block opacity-30">💨</span>
                          <p className="text-muted-foreground">No readings yet</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Readings History */}
              {vitalSigns.length > 0 && (
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ChartLine className="w-5 h-5 text-blue-600" />
                      Recent Readings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 max-h-64 overflow-y-auto">
                      {vitalSigns.slice(0, 5).map((vital, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors">
                          <div className="flex-1">
                            <p className="font-medium text-sm">{new Date(vital.recordedDate).toLocaleDateString()}</p>
                            <div className="flex flex-wrap gap-4 mt-1 text-xs text-muted-foreground">
                              {vital.bloodPressure && (
                                <span>BP: {vital.bloodPressure.systolic}/{vital.bloodPressure.diastolic}</span>
                              )}
                              {vital.bloodSugar && <span>BS: {vital.bloodSugar} mg/dL</span>}
                              {vital.heartRate && <span>HR: {vital.heartRate} bpm</span>}
                              {vital.weight && <span>Weight: {vital.weight} kg</span>}
                              {vital.temperature && <span>Temp: {vital.temperature}°C</span>}
                            </div>
                            {vital.notes && (
                              <p className="text-xs text-muted-foreground mt-1 italic">{vital.notes}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {vital.recordedBy}
                            </Badge>
                            <Button size="sm" variant="ghost" onClick={() => handleEditVital(vital)} className="h-6 w-6 p-0">
                              <span className="text-xs">✏️</span>
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => handleDeleteVital(vital.id)} className="h-6 w-6 p-0 text-red-600 hover:text-red-700">
                              <span className="text-xs">🗑️</span>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Enhanced Vital Signs Modal */}
              {showVitalsModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                  <Card className="w-full max-w-2xl bg-white dark:bg-gray-900 max-h-[90vh] overflow-y-auto">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Heart className="w-5 h-5 text-red-600" />
                          <span>{editingVital ? 'Edit Vital Signs' : 'Add Vital Signs'}</span>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => {
                          setShowVitalsModal(false)
                          setEditingVital(null)
                        }}>
                          <X className="w-4 h-4" />
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium flex items-center gap-2">
                            <Heart className="w-4 h-4 text-red-600" />
                            Blood Pressure (mmHg)
                          </label>
                          <div className="flex gap-2">
                            <Input placeholder="Systolic" type="number" min="60" max="250" defaultValue={editingVital?.bloodPressure?.systolic || ''} />
                            <span className="flex items-center text-muted-foreground">/</span>
                            <Input placeholder="Diastolic" type="number" min="40" max="150" defaultValue={editingVital?.bloodPressure?.diastolic || ''} />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium flex items-center gap-2">
                            <Droplets className="w-4 h-4 text-blue-600" />
                            Blood Sugar (mg/dL)
                          </label>
                          <Input placeholder="Enter blood sugar level" type="number" min="50" max="400" defaultValue={editingVital?.bloodSugar || ''} />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium flex items-center gap-2">
                            <Activity className="w-4 h-4 text-green-600" />
                            Heart Rate (bpm)
                          </label>
                          <Input placeholder="Enter heart rate" type="number" min="40" max="200" defaultValue={editingVital?.heartRate || ''} />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium flex items-center gap-2">
                            <Target className="w-4 h-4 text-purple-600" />
                            Weight (kg)
                          </label>
                          <Input placeholder="Enter weight" type="number" min="20" max="300" step="0.1" defaultValue={editingVital?.weight || ''} />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium flex items-center gap-2">
                            <span className="text-orange-600">🌡️</span>
                            Temperature (°C)
                          </label>
                          <Input placeholder="Enter temperature" type="number" min="30" max="45" step="0.1" defaultValue={editingVital?.temperature || ''} />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium flex items-center gap-2">
                            <span className="text-teal-600">💨</span>
                            Oxygen Saturation (%)
                          </label>
                          <Input placeholder="Enter oxygen saturation" type="number" min="70" max="100" defaultValue={editingVital?.oxygenSaturation || ''} />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Respiratory Rate (breaths/min)</label>
                          <Input placeholder="Enter respiratory rate" type="number" min="8" max="40" defaultValue={editingVital?.respiratoryRate || ''} />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Location</label>
                          <Input placeholder="Where was this recorded?" defaultValue={editingVital?.location || ''} />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Notes</label>
                        <Input placeholder="Any additional notes or observations..." defaultValue={editingVital?.notes || ''} />
                      </div>
                      
                      <div className="flex gap-2 pt-4">
                        <Button onClick={() => {
                          setShowVitalsModal(false)
                          setEditingVital(null)
                        }} variant="outline" className="flex-1">
                          Cancel
                        </Button>
                        <Button onClick={async (e) => {
                          e.preventDefault()
                          const form = e.target.closest('.space-y-6')
                          const inputs = form.querySelectorAll('input')
                          const vitalData: any = {}
                          
                          const systolic = inputs[0]?.value
                          const diastolic = inputs[1]?.value
                          if (systolic && diastolic) {
                            vitalData.bloodPressure = { systolic: Number(systolic), diastolic: Number(diastolic) }
                          }
                          
                          if (inputs[2]?.value) vitalData.bloodSugar = Number(inputs[2].value)
                          if (inputs[3]?.value) vitalData.heartRate = Number(inputs[3].value)
                          if (inputs[4]?.value) vitalData.weight = Number(inputs[4].value)
                          if (inputs[5]?.value) vitalData.temperature = Number(inputs[5].value)
                          if (inputs[6]?.value) vitalData.oxygenSaturation = Number(inputs[6].value)
                          if (inputs[7]?.value) vitalData.respiratoryRate = Number(inputs[7].value)
                          if (inputs[8]?.value) vitalData.location = inputs[8].value
                          if (inputs[9]?.value) vitalData.notes = inputs[9].value
                          
                          await handleSaveVital(vitalData)
                        }} className="flex-1 bg-red-600 hover:bg-red-700">
                          <Heart className="w-4 h-4 mr-2" />
                          {editingVital ? 'Update' : 'Save'} Vital Signs
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && patientProfile && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Name</label>
                        <p className="font-semibold">{patientProfile.name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Phone</label>
                        <p className="font-semibold">{patientProfile.phone}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Email</label>
                        <p className="font-semibold">{patientProfile.email}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Gender</label>
                        <p className="font-semibold">{patientProfile.gender || 'Not specified'}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardHeader>
                    <CardTitle>Medical Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Medical Conditions</label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {patientProfile.medicalInfo?.conditions?.map((condition: string, idx: number) => (
                          <Badge key={idx} variant="outline">{condition}</Badge>
                        )) || <span className="text-sm text-muted-foreground">None specified</span>}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Adherence Score</label>
                      <p className="font-semibold text-green-600">{patientProfile.adherenceScore}%</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Message History */}
                <Card className="border-border lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span>📱</span> Message History
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 max-h-80 overflow-y-auto">
                      {messages.length > 0 ? messages.slice(0, 10).map((msg) => (
                        <div key={msg.id} className="border border-border rounded-lg p-4 bg-card">
                          {/* Header */}
                          <div className="flex items-center justify-between mb-3 pb-2 border-b border-border">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">🏥</span>
                              <span className="font-bold text-blue-600">MEDITEXT HEALTH REMINDER</span>
                            </div>
                            <div className="flex gap-1">
                              <Badge className={`text-xs ${
                                msg.status === 'DELIVERED' ? 'bg-green-500/20 text-green-600' :
                                msg.status === 'SENT' ? 'bg-blue-500/20 text-blue-600' :
                                msg.status === 'FAILED' ? 'bg-red-500/20 text-red-600' :
                                'bg-yellow-500/20 text-yellow-600'
                              }`}>
                                {msg.status}
                              </Badge>
                            </div>
                          </div>

                          {/* Message Content */}
                          <div className="space-y-2 text-sm">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <span className="font-semibold text-gray-700">TIME:</span>
                                <span className="ml-2">{msg.sentAt ? new Date(msg.sentAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) : new Date(msg.timeToSend).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</span>
                              </div>
                              <div>
                                <span className="font-semibold text-gray-700">DATE:</span>
                                <span className="ml-2">{msg.sentAt ? new Date(msg.sentAt).toLocaleDateString() : new Date(msg.timeToSend).toLocaleDateString()}</span>
                              </div>
                            </div>
                            
                            {msg.medicationName && (
                              <>
                                <div>
                                  <span className="font-semibold text-gray-700">MEDICATION:</span>
                                  <span className="ml-2 font-medium">{msg.medicationName}</span>
                                </div>
                                <div>
                                  <span className="font-semibold text-gray-700">DOSAGE:</span>
                                  <span className="ml-2">{msg.dosage}</span>
                                </div>
                                {msg.instructions && (
                                  <div>
                                    <span className="font-semibold text-gray-700">INSTRUCTIONS:</span>
                                    <span className="ml-2">{msg.instructions}</span>
                                  </div>
                                )}
                              </>
                            )}
                          </div>

                          {/* Quick Response Section */}
                          {msg.responseExpected && (
                            <div className="mt-3 pt-3 border-t border-border">
                              <div className="bg-blue-50 p-3 rounded">
                                <p className="font-semibold text-blue-800 text-xs mb-2">QUICK RESPONSE:</p>
                                <div className="text-xs space-y-1 text-blue-700">
                                  <p>Reply 1 - Medication taken</p>
                                  <p>Reply 2 - Missed this dose</p>
                                  <p>Reply 3 - Side effects</p>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Response Status */}
                          {msg.responseReceived && msg.responseText && (
                            <div className="mt-3 pt-3 border-t border-border">
                              <div className="bg-green-50 p-3 rounded">
                                <p className="font-semibold text-green-800 text-xs mb-1">PATIENT RESPONSE:</p>
                                <p className="text-green-700 font-medium">{msg.responseText}</p>
                                <p className="text-xs text-green-600 mt-1">Received at {new Date(msg.responseReceivedAt || msg.sentAt).toLocaleString()}</p>
                              </div>
                            </div>
                          )}

                          {/* Footer */}
                          <div className="mt-3 pt-2 border-t border-border text-xs text-muted-foreground text-center">
                            <p>Your health is our priority. Need help? Contact your healthcare provider.</p>
                            <p className="font-semibold text-blue-600">MediText - Professional Healthcare Solutions</p>
                          </div>
                        </div>
                      )) : (
                        <div className="text-center py-8">
                          <span className="text-4xl mb-4 block">📱</span>
                          <p className="text-muted-foreground">No messages sent yet</p>
                          <p className="text-sm text-muted-foreground mt-1">SMS reminders will appear here once scheduled</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Schedule Tab */}
          {activeTab === 'schedule' && (
            <div className="space-y-6">
              {medications.length === 0 ? (
                <Card className="border-border">
                  <CardContent className="pt-6 text-center">
                    <p className="text-muted-foreground">Add medications to see your schedule</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {medications.map((med) => (
                    <Card key={med.id} className="border-border">
                      <CardContent className="pt-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-card rounded-lg border border-border">
                          <div className="flex-1">
                            <p className="font-semibold text-foreground">{med.name}</p>
                            <p className="text-sm text-muted-foreground">{med.dosage}</p>
                          </div>
                          <div className="text-left sm:text-right">
                            <p className="font-semibold text-primary">{med.times?.[0] || 'Not set'}</p>
                            <p className="text-sm text-muted-foreground">{med.frequency}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Goals Tab */}
          {activeTab === 'goals' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">Health Goals</h2>
                <Button className="bg-primary hover:bg-primary/90 w-full sm:w-auto">
                  <Plus className="w-4 h-4 mr-2" />
                  Set New Goal
                </Button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Blood Pressure Control</span>
                      <span className="text-sm text-green-600">On Track</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Target</span>
                      <span className="font-semibold">&lt;130/80 mmHg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Current</span>
                      <span className="font-semibold text-green-600">120/80 mmHg</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-3">
                      <div className="bg-green-500 h-3 rounded-full" style={{ width: "85%" }} />
                    </div>
                    <p className="text-xs text-muted-foreground">85% progress toward goal</p>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Medication Adherence</span>
                      <span className="text-sm text-blue-600">Good</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Target</span>
                      <span className="font-semibold">95%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Current</span>
                      <span className="font-semibold text-blue-600">{adherenceStats.percentage}%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-3">
                      <div className="bg-blue-500 h-3 rounded-full" style={{ width: `${adherenceStats.percentage}%` }} />
                    </div>
                    <p className="text-xs text-muted-foreground">{adherenceStats.percentage}% adherence this month</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* AI Coach Tab */}
          {activeTab === 'ai-coach' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-border bg-gradient-to-br from-purple-500/5 to-blue-500/5">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="w-5 h-5 text-purple-600" />
                      Smart Medication Timing
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">AI optimizes your medication schedule based on your lifestyle</p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 rounded bg-white/50 dark:bg-black/20">
                        <span className="text-sm">Morning routine optimization</span>
                        <Badge className="bg-green-500/20 text-green-600">Active</Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded bg-white/50 dark:bg-black/20">
                        <span className="text-sm">Meal-based reminders</span>
                        <Badge className="bg-blue-500/20 text-blue-600">Learning</Badge>
                      </div>
                    </div>
                    <Button className="w-full bg-purple-600 hover:bg-purple-700">
                      <Zap className="w-4 h-4 mr-2" />
                      Optimize Schedule
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-border bg-gradient-to-r from-indigo-500/5 to-purple-500/5">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-indigo-600" />
                      Chat with Your AI Coach
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-white/50 dark:bg-black/20 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                            <Bot className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">AI Coach</p>
                            <p className="text-sm text-muted-foreground mt-1">
                              Great job on your adherence this week! Would you like me to suggest optimal timing for your morning dose?
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Input placeholder="Ask me anything about your health..." className="flex-1" />
                        <Button className="bg-indigo-600 hover:bg-indigo-700">
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Telehealth Tab */}
          {activeTab === 'telehealth' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Video className="w-5 h-5 text-blue-600" />
                      Video Consultations
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">Schedule and join video calls with your healthcare team</p>
                    <div className="space-y-3">
                      <Button className="w-full justify-start gap-2" variant="outline">
                        <Calendar className="w-4 h-4" />
                        Schedule Appointment
                      </Button>
                      <Button className="w-full justify-start gap-2" variant="outline">
                        <Video className="w-4 h-4" />
                        Join Consultation
                      </Button>
                      <Button className="w-full justify-start gap-2" variant="outline">
                        <MessageSquare className="w-4 h-4" />
                        Message Doctor
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Smartphone className="w-5 h-5 text-green-600" />
                      Remote Monitoring
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">Share your health data with your care team</p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 rounded bg-secondary/50">
                        <span className="text-sm">Blood Pressure</span>
                        <Badge className="bg-green-500/20 text-green-600">Shared</Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded bg-secondary/50">
                        <span className="text-sm">Medication Adherence</span>
                        <Badge className="bg-blue-500/20 text-blue-600">Auto-sync</Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded bg-secondary/50">
                        <span className="text-sm">Symptoms Log</span>
                        <Badge className="bg-orange-500/20 text-orange-600">Manual</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Insights Tab */}
          {activeTab === 'insights' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ChartLine className="w-5 h-5 text-blue-500" />
                      Adherence Analytics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">7-day average</span>
                        <span className="font-bold text-green-500">94.2%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Best streak</span>
                        <span className="font-bold text-blue-500">12 days</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Predicted next week</span>
                        <span className="font-bold text-purple-500">96.1%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Radar className="w-5 h-5 text-purple-500" />
                      Health Risk Assessment
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Overall Risk</span>
                        <Badge className="bg-green-500/20 text-green-600">Low</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Cardiovascular</span>
                        <Badge className="bg-yellow-500/20 text-yellow-600">Moderate</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Medication Interaction</span>
                        <Badge className="bg-green-500/20 text-green-600">None</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-border bg-gradient-to-r from-purple-500/5 to-blue-500/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-purple-600" />
                    Predictive Health Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-white/50 dark:bg-black/20">
                      <h4 className="font-medium text-sm mb-2">Adherence Prediction</h4>
                      <p className="text-xs text-muted-foreground mb-2">Based on your patterns, you're likely to maintain 95%+ adherence</p>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        <span className="text-xs font-medium">89% confidence</span>
                      </div>
                    </div>
                    <div className="p-4 rounded-lg bg-white/50 dark:bg-black/20">
                      <h4 className="font-medium text-sm mb-2">Health Outcome</h4>
                      <p className="text-xs text-muted-foreground mb-2">Your BP is trending toward target range within 2 months</p>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        <span className="text-xs font-medium">76% confidence</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}