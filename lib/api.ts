'use client'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

class ApiService {
  private baseURL: string
  private token: string | null = null

  constructor() {
    this.baseURL = API_BASE_URL
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('authToken')
    }
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }
    
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`
    }
    
    return headers
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    
    const config: RequestInit = {
      headers: this.getHeaders(),
      ...options,
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Network error' }))
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  // Auth methods
  async register(userData: { fullName: string; email: string; phone: string; password: string; role?: string }) {
    const response = await this.request<{ success: boolean; data: { user: any; token: string } }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
    
    if (response.success && response.data.token) {
      this.setToken(response.data.token)
    }
    
    return response
  }

  async login(credentials: { email: string; password: string }) {
    const response = await this.request<{ success: boolean; data: { user: any; token: string } }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
    
    if (response.success && response.data.token) {
      this.setToken(response.data.token)
    }
    
    return response
  }

  async getProfile() {
    return this.request<{ success: boolean; data: { user: any } }>('/auth/profile')
  }

  // Medication methods
  async getMedications() {
    return this.request<{ success: boolean; data: { medications: any[] } }>('/medications')
  }

  async createMedication(medicationData: any) {
    return this.request<{ success: boolean; data: { medication: any } }>('/medications', {
      method: 'POST',
      body: JSON.stringify(medicationData),
    })
  }

  async deleteMedication(medicationId: string) {
    return this.request<{ success: boolean }>(`/medications/${medicationId}`, {
      method: 'DELETE',
    })
  }

  // Reminder methods
  async scheduleReminder(reminderData: { medicationId: string; scheduledTime: string }) {
    return this.request<{ success: boolean; reminder: any }>('/reminders/schedule', {
      method: 'POST',
      body: JSON.stringify(reminderData),
    })
  }

  async getPatientActivity() {
    return this.request<{ success: boolean; activity: any[] }>('/reminders/activity')
  }

  // SMS methods
  async sendTestReminder(data: { phone: string; medicationName: string; dosage: string }) {
    return this.request<{ success: boolean; message: string }>('/sms/test', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // Facility methods
  async facilityRegister(facilityData: { name: string; email: string; phone: string; address: string; licenseNumber: string; type: string; password: string }) {
    const response = await this.request<{ success: boolean; data: { facility: any; token: string } }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ ...facilityData, role: 'facility' }),
    })
    
    if (response.success && response.data.token) {
      this.setToken(response.data.token)
    }
    
    return response
  }

  async facilityLogin(credentials: { email: string; password: string }) {
    const response = await this.request<{ success: boolean; data: { user: any; token: string } }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
    
    if (response.success && response.data.token) {
      this.setToken(response.data.token)
    }
    
    return response
  }

  // Token management
  setToken(token: string) {
    this.token = token
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token)
    }
  }

  clearToken() {
    this.token = null
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken')
      localStorage.removeItem('facilityData')
    }
  }

  isAuthenticated(): boolean {
    return !!this.token
  }
}

export const apiService = new ApiService()
export default apiService