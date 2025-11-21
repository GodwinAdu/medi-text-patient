"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { 
  Pill, ArrowRight, AlertCircle, Phone, MessageSquare, 
  Shield, CheckCircle2, Lock 
} from "lucide-react"
import { sendOTPToPhone, verifyOTPAndLogin } from "@/lib/actions/patient-auth"

export default function Login() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  
  // Phone/OTP state
  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [phoneNumber, setPhoneNumber] = useState("")
  const [otp, setOtp] = useState("")



  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const result = await sendOTPToPhone(phoneNumber)
      
      if (result.success) {
        setStep('otp')
      } else {
        setError(result.error || "Failed to send verification code")
      }
    } catch (err) {
      setError("Failed to send verification code. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const result = await verifyOTPAndLogin(phoneNumber, otp)
      
      if (result.success) {
        router.push("/dashboard")
      } else {
        setError(result.error || "Invalid verification code")
      }
    } catch (err) {
      setError("Verification failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOtp = async () => {
    setError("")
    setIsLoading(true)
    
    try {
      const result = await sendOTPToPhone(phoneNumber)
      
      if (!result.success) {
        setError(result.error || "Failed to resend code")
      }
    } catch (err) {
      setError("Failed to resend code")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 via-teal-100/20 to-cyan-100/30" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-200/40 to-teal-200/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-teal-200/40 to-cyan-200/30 rounded-full blur-3xl animate-pulse" />
      
      <div className="w-full max-w-md relative z-10">
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
          <h1 className="text-3xl font-bold text-slate-800">Welcome Back</h1>
          <p className="text-slate-600 mt-2">
            {step === 'phone' ? 'Enter your phone number to continue' : 'Enter the verification code'}
          </p>
        </div>

        <Card className="border-blue-200/50 bg-white/80 backdrop-blur-xl shadow-2xl">
          <CardHeader>
            <CardTitle className="text-slate-800 text-center flex items-center justify-center gap-2">
              {step === 'phone' ? <Phone className="w-5 h-5" /> : <MessageSquare className="w-5 h-5" />}
              {step === 'phone' ? 'Phone Number' : 'Verification Code'}
            </CardTitle>
            <CardDescription className="text-slate-600 text-center">
              {step === 'phone' 
                ? 'We\'ll send you a verification code' 
                : `Code sent to ${phoneNumber}`
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === 'phone' ? (
              <form onSubmit={handlePhoneSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-slate-700 font-medium">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                    <Input
                      type="tel"
                      placeholder="+233 XX XXX XXXX"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      required
                      className="pl-11 bg-white/70 border-blue-200 text-slate-800 placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20 h-12"
                    />
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
                  disabled={isLoading || !phoneNumber}
                  className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white h-12 shadow-lg group"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending Code...
                    </div>
                  ) : (
                    <>
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Send Verification Code
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleOtpSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-slate-700 font-medium">Verification Code</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                    <Input
                      type="text"
                      placeholder="Enter 6-digit code"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      required
                      maxLength={6}
                      className="pl-11 bg-white/70 border-blue-200 text-slate-800 text-center text-xl tracking-[0.5em] placeholder:text-slate-500 focus:border-teal-500 focus:ring-teal-500/20 h-12"
                    />
                  </div>
                  <p className="text-xs text-slate-600 text-center">
                    Check console for demo OTP code
                  </p>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isLoading || otp.length !== 6}
                  className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white h-12 shadow-lg group"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Verifying...
                    </div>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Verify & Sign In
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleResendOtp}
                    disabled={isLoading}
                    className="border-blue-200 text-slate-700 hover:bg-blue-50"
                  >
                    Resend Code
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setStep('phone')
                      setOtp('')
                      setError('')
                    }}
                    className="text-slate-700 hover:bg-blue-50"
                  >
                    Change Number
                  </Button>
                </div>
              </form>
            )}

            <div className="mt-6 pt-6 border-t border-blue-200/50">
              <p className="text-center text-slate-600 text-sm">
                Don't have an account?{" "}
                <Link href="/signup" className="text-blue-600 hover:text-blue-700 font-semibold hover:underline">
                  Create one now
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>


      </div>
    </div>
  )
}
