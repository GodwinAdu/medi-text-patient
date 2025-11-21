"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  CheckCircle2,
  Pill,
  TrendingUp,
  MessageSquare,
  Clock,
  BarChart3,
  ArrowRight,
  Zap,
  Shield,
  Users,
  Brain,
  Heart,
  Activity,
  AlertCircle,
  Building2,
} from "lucide-react"

export default function Home() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/40 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <Pill className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              MediText
            </span>
          </div>
          <div className="flex gap-3">
            <Link href="/facility/login">
              <Button variant="ghost" className="text-foreground hover:bg-secondary gap-2">
                <Building2 className="w-4 h-4" />
                Facility Portal
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="ghost" className="text-foreground hover:bg-secondary">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary via-background to-background pointer-events-none" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center space-y-8">
            <Badge className="mx-auto bg-accent/20 text-accent hover:bg-accent/30 border-accent/30">
              <Zap className="w-3 h-3 mr-1" />
              AI-Powered Medication Management
            </Badge>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground leading-tight text-balance">
              Never Miss Your{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Medication</span>{" "}
              Again
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto text-balance leading-relaxed">
              Stay on top of your health with intelligent reminders, AI-powered insights, and seamless medication
              tracking. Improve your adherence and health outcomes.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/signup">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground group">
                  Start Free Trial
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-border hover:bg-secondary bg-transparent">
                Watch Demo
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-accent" />
                <span>HIPAA Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-accent" />
                <span>10,000+ Users</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-accent" />
                <span>95% Adherence Rate</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16 space-y-4">
          <Badge variant="outline" className="mx-auto">
            Features
          </Badge>
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground text-balance">
            Everything You Need to Stay Healthy
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive tools designed to help you manage your medications and improve your health outcomes
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: MessageSquare,
              title: "Smart Reminders",
              description: "Get timely SMS and WhatsApp reminders tailored to your medication schedule",
              color: "from-primary to-primary/60",
            },
            {
              icon: CheckCircle2,
              title: "Easy Tracking",
              description: "Mark medications as taken with a single tap and maintain perfect records",
              color: "from-accent to-accent/60",
            },
            {
              icon: Brain,
              title: "AI Insights",
              description: "Receive personalized adherence predictions and health recommendations",
              color: "from-primary to-accent",
            },
            {
              icon: BarChart3,
              title: "Health Analytics",
              description: "Visualize your adherence patterns and track progress over time",
              color: "from-accent to-primary",
            },
          ].map((feature, idx) => {
            const Icon = feature.icon
            return (
              <Card
                key={idx}
                className="border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer group"
                onMouseEnter={() => setHoveredFeature(idx)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <CardHeader>
                  <div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} p-2.5 mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-full h-full text-primary-foreground" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16 space-y-4">
          <Badge variant="outline" className="mx-auto">
            Platform Features
          </Badge>
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground text-balance">
            Powerful Tools for Better Health
          </h2>
        </div>

        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-card border border-border">
            <TabsTrigger value="dashboard" className="gap-2">
              <Activity className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="medications" className="gap-2">
              <Pill className="w-4 h-4" />
              <span className="hidden sm:inline">Medications</span>
            </TabsTrigger>
            <TabsTrigger value="tracking" className="gap-2">
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">Tracking</span>
            </TabsTrigger>
            <TabsTrigger value="ai" className="gap-2">
              <Brain className="w-4 h-4" />
              <span className="hidden sm:inline">AI</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-4 mt-8">
            <Card className="border-border overflow-hidden">
              <CardHeader>
                <CardTitle>Personal Dashboard</CardTitle>
                <CardDescription>Get a complete overview of your medication adherence at a glance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-secondary/50 border border-border">
                    <p className="text-sm text-muted-foreground mb-1">Active Medications</p>
                    <p className="text-3xl font-bold text-primary">5</p>
                  </div>
                  <div className="p-4 rounded-lg bg-secondary/50 border border-border">
                    <p className="text-sm text-muted-foreground mb-1">Adherence Rate</p>
                    <p className="text-3xl font-bold text-accent">94%</p>
                  </div>
                  <div className="p-4 rounded-lg bg-secondary/50 border border-border">
                    <p className="text-sm text-muted-foreground mb-1">Doses Taken</p>
                    <p className="text-3xl font-bold text-primary">142</p>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  Real-time statistics help you monitor your medication adherence and stay motivated to maintain your
                  health routine.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="medications" className="space-y-4 mt-8">
            <Card className="border-border overflow-hidden">
              <CardHeader>
                <CardTitle>Medication Management</CardTitle>
                <CardDescription>Easily add, edit, and manage all your medications in one place</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {[
                    { name: "Aspirin", dosage: "500mg", frequency: "Twice daily", time: "08:00 AM" },
                    { name: "Metformin", dosage: "1000mg", frequency: "Once daily", time: "02:00 PM" },
                    { name: "Lisinopril", dosage: "10mg", frequency: "Once daily", time: "08:00 PM" },
                  ].map((med, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-lg bg-secondary/50 border border-border flex justify-between items-start"
                    >
                      <div>
                        <p className="font-semibold text-foreground">{med.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {med.dosage} • {med.frequency}
                        </p>
                      </div>
                      <Badge variant="outline">{med.time}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tracking" className="space-y-4 mt-8">
            <Card className="border-border overflow-hidden">
              <CardHeader>
                <CardTitle>Adherence Tracking</CardTitle>
                <CardDescription>Visual charts and detailed logs of your medication adherence</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-foreground">This Week</span>
                      <span className="text-sm text-muted-foreground">94%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: "94%" }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-foreground">This Month</span>
                      <span className="text-sm text-muted-foreground">91%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div className="bg-accent h-2 rounded-full" style={{ width: "91%" }} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai" className="space-y-4 mt-8">
            <Card className="border-border overflow-hidden">
              <CardHeader>
                <CardTitle>AI Health Insights</CardTitle>
                <CardDescription>Personalized recommendations based on your adherence patterns</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-4 rounded-lg bg-accent/10 border border-accent/30 flex gap-3">
                    <Heart className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-foreground">Excellent Adherence</p>
                      <p className="text-sm text-muted-foreground">You're maintaining 94% adherence. Keep it up!</p>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-primary/10 border border-primary/30 flex gap-3">
                    <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-foreground">Reminder Optimization</p>
                      <p className="text-sm text-muted-foreground">Consider setting reminders 15 minutes earlier</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>

      {/* Facility Portal Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 bg-gradient-to-br from-primary/5 via-background to-accent/5 rounded-2xl my-24">
        <div className="text-center space-y-8">
          <Badge className="mx-auto bg-primary/20 text-primary hover:bg-primary/30 border-primary/30">
            <Building2 className="w-3 h-3 mr-1" />
            For Healthcare Facilities
          </Badge>

          <h2 className="text-4xl sm:text-5xl font-bold text-foreground text-balance">
            Monitor Patients & Manage{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Medications</span>
          </h2>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance leading-relaxed">
            Healthcare facilities can now monitor patient adherence, track medication deliveries, and access advanced
            analytics to improve patient outcomes.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <Card className="border-border bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <Users className="w-8 h-8 text-primary mb-2" />
                <CardTitle>Patient Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Assign and monitor patients, track their medication adherence in real-time
                </p>
              </CardContent>
            </Card>

            <Card className="border-border bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <Pill className="w-8 h-8 text-accent mb-2" />
                <CardTitle>Delivery Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Schedule and track medication deliveries to patients with status updates
                </p>
              </CardContent>
            </Card>

            <Card className="border-border bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <BarChart3 className="w-8 h-8 text-primary mb-2" />
                <CardTitle>Advanced Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Access detailed reports and insights on patient adherence and medication performance
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link href="/facility/signup">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground group">
                Register Your Facility
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/facility/login">
              <Button size="lg" variant="outline" className="border-border hover:bg-secondary bg-transparent">
                Facility Login
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div>
              <Badge variant="outline" className="mb-4">
                Why MediText
              </Badge>
              <h2 className="text-4xl font-bold text-foreground mb-4 text-balance">Improve Your Health Outcomes</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Studies show that medication adherence is crucial for managing chronic conditions. MediText helps you
                stay consistent with your treatment plan.
              </p>
            </div>

            <div className="space-y-4">
              {[
                { title: "95% Adherence Rate", desc: "Users report significantly improved medication adherence" },
                { title: "Real-time Insights", desc: "AI-powered analytics to understand your health patterns" },
                { title: "Multi-language Support", desc: "Available in English and Twi for accessibility" },
                { title: "Secure & Private", desc: "Your health data is encrypted and protected" },
              ].map((benefit, idx) => (
                <div
                  key={idx}
                  className="flex gap-4 p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                >
                  <CheckCircle2 className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-foreground">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl blur-2xl" />
            <Card className="relative border-border/50 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-accent" />
                  Your Medication Schedule
                </CardTitle>
                <CardDescription>Stay organized with smart reminders</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { time: "08:00 AM", med: "Aspirin", status: "Completed" },
                  { time: "02:00 PM", med: "Metformin", status: "Pending" },
                  { time: "08:00 PM", med: "Lisinopril", status: "Upcoming" },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-lg bg-background/50 hover:bg-background transition-colors"
                  >
                    <div>
                      <p className="font-medium text-foreground">{item.med}</p>
                      <p className="text-sm text-muted-foreground">{item.time}</p>
                    </div>
                    <Badge variant={item.status === "Completed" ? "default" : "secondary"}>{item.status}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground border-0 overflow-hidden relative">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary-foreground rounded-full blur-3xl" />
          </div>
          <CardHeader className="text-center relative z-10">
            <CardTitle className="text-4xl sm:text-5xl text-balance">Ready to Take Control of Your Health?</CardTitle>
            <CardDescription className="text-primary-foreground/90 text-lg">
              Join thousands of patients improving their medication adherence today
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center relative z-10">
            <Link href="/signup">
              <Button size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
                Sign Up Now
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/30 backdrop-blur-sm mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Pill className="w-5 h-5 text-primary" />
                <span className="font-bold text-foreground">MediText</span>
              </div>
              <p className="text-sm text-muted-foreground">Improving medication adherence in Ghana and beyond.</p>
            </div>
            {[
              { title: "Product", links: ["Features", "Pricing", "Security"] },
              { title: "Company", links: ["About", "Blog", "Contact"] },
              { title: "Legal", links: ["Privacy", "Terms", "Cookies"] },
            ].map((col, idx) => (
              <div key={idx}>
                <h3 className="font-semibold text-foreground mb-4">{col.title}</h3>
                <ul className="space-y-2">
                  {col.links.map((link, linkIdx) => (
                    <li key={linkIdx}>
                      <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 MediText. All rights reserved. Improving medication adherence in Ghana and beyond.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
