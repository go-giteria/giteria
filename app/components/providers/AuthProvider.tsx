'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

interface User {
  id: number
  username: string
  email: string
  avatar: string
  isAdmin: boolean
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (username: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      setLoading(true)
      
      const response = await fetch('/api/v1/user/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': document.querySelector('meta[name="_csrf"]')?.getAttribute('content') || ''
        },
        body: JSON.stringify({ username, password })
      })

      if (!response.ok) {
        return false
      }

      const userData = await response.json()
      setUser(userData)
      return true
    } catch (error) {
      console.error('Login error:', error)
      return false
    } finally {
      setLoading(false)
    }
  }

  const logout = async (): Promise<void> => {
    try {
      await fetch('/api/v1/user/logout', {
        method: 'POST',
        headers: {
          'X-CSRF-Token': document.querySelector('meta[name="_csrf"]')?.getAttribute('content') || ''
        }
      })
      setUser(null)
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const refreshUser = async (): Promise<void> => {
    try {
      const response = await fetch('/api/v1/user')
      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
      }
    } catch (error) {
      console.error('Refresh user error:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshUser()
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}