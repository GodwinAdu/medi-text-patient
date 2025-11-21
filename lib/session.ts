'use client'

export function createSession(phone: string, userType: 'patient' | 'facility' = 'patient') {
  if (typeof window !== 'undefined') {
    // Set cookies for persistent session
    document.cookie = `${userType}Phone=${phone}; path=/; max-age=${30 * 24 * 60 * 60}` // 30 days
    document.cookie = `isVerified=true; path=/; max-age=${30 * 24 * 60 * 60}`
    
    // Store in localStorage as backup
    localStorage.setItem(`${userType}Phone`, phone)
    localStorage.setItem('isVerified', 'true')
  }
}

export function clearSession() {
  if (typeof window !== 'undefined') {
    // Clear cookies
    document.cookie = 'userPhone=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
    document.cookie = 'facilityPhone=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
    document.cookie = 'isVerified=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
    
    // Clear localStorage
    localStorage.removeItem('userPhone')
    localStorage.removeItem('facilityPhone')
    localStorage.removeItem('isVerified')
    localStorage.removeItem('userId')
    localStorage.removeItem('userEmail')
  }
}