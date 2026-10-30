import React, { createContext, useContext, useEffect, useState } from 'react'
import { authService } from '@/services/authService'
import { User, UserRole } from '@/types'

interface AuthContextType {
  user: User | null
  role: UserRole | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  loginAsRole: (role: UserRole) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

import { SEED_USERS } from '@/lib/constants'

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const demoRole = params.get('demoRole') as UserRole | null
      if (demoRole && ['END_USER', 'IT_SUPPORT', 'ADMIN'].includes(demoRole)) {
        const seed = SEED_USERS.find((u) => u.role === demoRole) || SEED_USERS[1]
        const u: User = {
          id: `u-${seed.role.toLowerCase()}`,
          name: seed.name,
          email: seed.email,
          role: seed.role,
          department: seed.department,
          avatar: seed.avatar,
        }
        localStorage.setItem('auth_user', JSON.stringify(u))
        localStorage.setItem('auth_token', `demo-token-${demoRole}`)
        return u
      }
    }
    return authService.getCurrentUser()
  })

  const [token, setToken] = useState<string | null>(() => {
    return authService.getToken()
  })

  const [isLoading, setIsLoading] = useState(false)

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const result = await authService.login(email, password)
      setUser(result.user)
      setToken(result.token)
    } finally {
      setIsLoading(false)
    }
  }

  const loginAsRole = async (role: UserRole) => {
    setIsLoading(true)
    try {
      const result = await authService.loginAsRole(role)
      setUser(result.user)
      setToken(result.token)
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    authService.logout()
    setUser(null)
    setToken(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        loginAsRole,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
