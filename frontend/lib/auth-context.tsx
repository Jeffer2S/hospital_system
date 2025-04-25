"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import type { User, UserRole } from "./types"
import { getCurrentUser } from "./api"
import { useRouter } from "next/navigation"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (token: string, userData: User) => void
  logout: () => void
  hasRole: (roles: UserRole[]) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Cargar usuario al iniciar
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("auth_token")
      if (!token) {
        setIsLoading(false)
        return
      }

      try {
        const userData = await getCurrentUser()
        console.log("User loaded:", userData) // Para depuración
        setUser(userData)
      } catch (error) {
        console.error("Error loading user:", error) // Para depuración
        localStorage.removeItem("auth_token")
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, [])

  const login = (token: string, userData: User) => {
    console.log("Setting auth token and user:", token, userData) // Para depuración
    localStorage.setItem("auth_token", token)
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem("auth_token")
    setUser(null)
    router.push("/login")
  }

  const hasRole = (roles: UserRole[]) => {
    if (!user) return false
    return roles.includes(user.role as UserRole)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
