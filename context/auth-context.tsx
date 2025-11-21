"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string
  email: string
  name: string
  phone?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  signup: (email: string, password: string, name: string, phone: string) => Promise<void>
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("meditext_user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const signup = async (email: string, password: string, name: string, phone: string) => {
    // Simulate API call
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name,
      phone,
    }
    localStorage.setItem("meditext_user", JSON.stringify(newUser))
    localStorage.setItem(`meditext_password_${email}`, password)
    setUser(newUser)
  }

  const login = async (email: string, password: string) => {
    // Simulate API call
    const storedPassword = localStorage.getItem(`meditext_password_${email}`)
    if (storedPassword !== password) {
      throw new Error("Invalid credentials")
    }
    const users = JSON.parse(localStorage.getItem("meditext_users") || "{}")
    const user = users[email]
    if (!user) {
      throw new Error("User not found")
    }
    localStorage.setItem("meditext_user", JSON.stringify(user))
    setUser(user)
  }

  const logout = () => {
    localStorage.removeItem("meditext_user")
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, isLoading, signup, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
