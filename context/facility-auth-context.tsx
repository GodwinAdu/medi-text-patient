"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { apiService } from "@/lib/api"
import { createSession, clearSession } from "@/lib/session"

interface Facility {
  id: string
  fullName: string
  email: string
  phone: string
  role: string
  createdAt?: string
}

interface FacilityAuthContextType {
  facility: Facility | null
  isLoading: boolean
  facilitySignup: (data: { name: string; email: string; phone: string; address: string; licenseNumber: string; type: string; password: string }) => Promise<void>
  facilityLogin: (email: string, password: string) => Promise<void>
  facilityLogout: () => void
}

const FacilityAuthContext = createContext<FacilityAuthContextType | undefined>(undefined)

export function FacilityAuthProvider({ children }: { children: React.ReactNode }) {
  const [facility, setFacility] = useState<Facility | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initializeFacility = async () => {
      const storedFacility = localStorage.getItem("facilityData")
      const authToken = localStorage.getItem("authToken")
      
      if (storedFacility && authToken) {
        try {
          // Verify token is still valid by getting profile
          apiService.setToken(authToken)
          const profile = await apiService.getProfile()
          if (profile.success && profile.data.user.role === 'facility') {
            setFacility(profile.data.user)
          } else {
            // Invalid token or not a facility
            clearSession()
            apiService.clearToken()
          }
        } catch (error) {
          // Token expired or invalid
          clearSession()
          apiService.clearToken()
        }
      }
      setIsLoading(false)
    }
    
    initializeFacility()
  }, [])

  const facilitySignup = async (data: { name: string; email: string; phone: string; address: string; licenseNumber: string; type: string; password: string }) => {
    try {
      const response = await apiService.facilityRegister({
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        licenseNumber: data.licenseNumber,
        type: data.type,
        password: data.password
      })
      
      if (response.success) {
        const facilityData = response.data.facility
        createSession(data.phone, 'facility')
        localStorage.setItem('facilityData', JSON.stringify(facilityData))
        setFacility(facilityData)
      } else {
        throw new Error('Registration failed')
      }
    } catch (error) {
      console.error('Facility signup error:', error)
      throw error
    }
  }

  const facilityLogin = async (email: string, password: string) => {
    try {
      const response = await apiService.facilityLogin({ email, password })
      
      if (response.success) {
        const facilityData = response.data.user
        if (facilityData.role !== 'facility') {
          throw new Error('Not a facility account')
        }
        createSession(facilityData.phone, 'facility')
        localStorage.setItem('facilityData', JSON.stringify(facilityData))
        setFacility(facilityData)
      } else {
        throw new Error('Invalid credentials')
      }
    } catch (error) {
      console.error('Facility login error:', error)
      throw error
    }
  }

  const facilityLogout = () => {
    clearSession()
    apiService.clearToken()
    setFacility(null)
  }

  return (
    <FacilityAuthContext.Provider value={{ facility, isLoading, facilitySignup, facilityLogin, facilityLogout }}>
      {children}
    </FacilityAuthContext.Provider>
  )
}

export function useFacilityAuth() {
  const context = useContext(FacilityAuthContext)
  if (context === undefined) {
    throw new Error("useFacilityAuth must be used within FacilityAuthProvider")
  }
  return context
}
