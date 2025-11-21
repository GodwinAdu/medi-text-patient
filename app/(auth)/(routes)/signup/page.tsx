"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Pill, ArrowRight, AlertCircle, CheckCircle2, User, Mail, 
  Phone, Lock, Eye, EyeOff, Calendar, Shield 
} from "lucide-react"
import { registerPatient } from "@/lib/actions/patient-auth"

export default function SignUp() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: "",
    gender: "" as 'male' | 'female' | 'other' | "",
    medicalConditions: [] as string[]
  })



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    // Validation
    if (!formData.name || !formData.email || !formData.phone || !formData.password) {
      setError("Please fill in all required fields")
      return
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }
    
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long")
      return
    }
    
    if (!agreedToTerms) {
      setError("Please agree to the terms and conditions")
      return
    }
    
    setIsLoading(true)

    try {
      const result = await registerPatient({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        dateOfBirth: formData.dateOfBirth || undefined,
        gender: formData.gender || undefined,
        medicalConditions: formData.medicalConditions
      })
      
      if (result.success) {
        router.push("/dashboard")
      } else {
        setError(result.error || "Registration failed")
      }
    } catch (err) {
      setError("Registration failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleConditionChange = (condition: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        medicalConditions: [...prev.medicalConditions, condition]
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        medicalConditions: prev.medicalConditions.filter(c => c !== condition)
      }))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 via-teal-100/20 to-cyan-100/30" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-200/40 to-teal-200/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-teal-200/40 to-cyan-200/30 rounded-full blur-3xl animate-pulse" />
      
      <div className="w-full max-w-lg relative z-10">
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-3 mb-6 hover:opacity-80 transition-opacity group"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-teal-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <Pill className="w-7 h-7 text-white" />
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-blue-700 to-teal-700 bg-clip-text text-transparent">
              MediText
            </span>
          </Link>
          <h1 className="text-3xl font-bold text-slate-800">Create Account</h1>
          <p className="text-slate-600 mt-2">
            Join MediText to manage your medications
          </p>
        </div>

        <Card className="border-blue-200/50 bg-white/80 backdrop-blur-xl shadow-2xl">
          <CardHeader>
            <CardTitle className="text-slate-800 text-center flex items-center justify-center gap-2">
              <User className="w-5 h-5" />
              Patient Registration
            </CardTitle>
            <CardDescription className="text-slate-600 text-center">
              Create your patient account to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-700">Full Name *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                    <Input
                      type="text"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                      className="pl-11 bg-white/70 border-blue-200 text-slate-800 placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-slate-700">Email Address *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                    <Input
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                      className="pl-11 bg-white/70 border-blue-200 text-slate-800 placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20"
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-slate-700">Phone Number *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                  <Input
                    type="tel"
                    placeholder="+233 XX XXX XXXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    required
                    className="pl-11 bg-white/70 border-blue-200 text-slate-800 placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-700">Password *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Create password"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      required
                      className="pl-11 pr-11 bg-white/70 border-blue-200 text-slate-800 placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 text-slate-500 hover:text-slate-700"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-slate-700">Confirm Password *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                      required
                      className="pl-11 pr-11 bg-white/70 border-blue-200 text-slate-800 placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 text-slate-500 hover:text-slate-700"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-700">Date of Birth</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                    <Input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                      className="pl-11 bg-white/70 border-blue-200 text-slate-800 focus:border-blue-500 focus:ring-blue-500/20"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-slate-700">Gender</Label>
                  <Select onValueChange={(value: 'male' | 'female' | 'other') => setFormData({...formData, gender: value})}>
                    <SelectTrigger className="bg-white/70 border-blue-200 text-slate-800">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-3">
                <Label className="text-slate-700">Medical Conditions (Optional)</Label>
                <div className="space-y-2">
                  {['Hypertension', 'Diabetes', 'Heart Disease', 'Asthma'].map((condition) => (
                    <div key={condition} className="flex items-center space-x-2">
                      <Checkbox
                        id={condition}
                        checked={formData.medicalConditions.includes(condition)}
                        onCheckedChange={(checked) => handleConditionChange(condition, checked as boolean)}
                      />
                      <Label htmlFor={condition} className="text-sm text-slate-700">{condition}</Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-4 bg-blue-50/30 rounded-lg border border-blue-200">
                <Checkbox
                  id="terms"
                  checked={agreedToTerms}
                  onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                  className="mt-1"
                />
                <div className="space-y-1">
                  <Label htmlFor="terms" className="text-slate-700 text-sm font-medium cursor-pointer">
                    I agree to the Terms of Service and Privacy Policy
                  </Label>
                  <p className="text-xs text-slate-600">
                    By creating an account, you agree to our terms and privacy policy.
                  </p>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white h-12"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating Account...
                  </div>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Create Account
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-blue-200/50">
              <p className="text-center text-slate-600 text-sm">
                Already have an account?{" "}
                <Link href="/login" className="text-blue-600 hover:text-blue-700 font-semibold hover:underline">
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 space-y-2 text-xs sm:text-sm text-slate-600">
          <div className="flex gap-2">
            <Shield className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <span>Your data is encrypted and secure</span>
          </div>
          <div className="flex gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
            <span>HIPAA compliant healthcare platform</span>
          </div>
          <div className="flex gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <span>Free to use with no credit card required</span>
          </div>
        </div>
      </div>
    </div>
  )
}
