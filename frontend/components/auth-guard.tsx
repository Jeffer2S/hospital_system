"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { getDashboardPath } from "@/lib/utils"
import type { UserRole } from "@/lib/types"
import { Loader2 } from "lucide-react"

interface AuthGuardProps {
  children: React.ReactNode
  allowedRoles?: UserRole[]
  requireAuth?: boolean
}

export default function AuthGuard({ children, allowedRoles = [], requireAuth = true }: AuthGuardProps) {
  const { isAuthenticated, isLoading, user, hasRole } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    // Solo ejecutar la lógica cuando la carga inicial haya terminado
    if (!isLoading) {
      // Si requiere autenticación y no está autenticado, redirigir a login
      if (requireAuth && !isAuthenticated) {
        console.log("Not authenticated, redirecting to login")
        router.push(`/login?redirect=${encodeURIComponent(pathname)}`)
        return
      }

      // Si está autenticado pero no tiene los roles permitidos
      if (isAuthenticated && user && allowedRoles.length > 0 && !hasRole(allowedRoles)) {
        console.log("Not authorized, redirecting to appropriate dashboard")

        // Verificar que no estemos ya en la ruta correcta para evitar bucles
        const correctPath = getDashboardPath(user.role)
        if (pathname !== correctPath) {
          router.push(correctPath)
          return
        }
      }

      setChecked(true)
    }
  }, [isLoading, isAuthenticated, router, pathname, requireAuth, allowedRoles, hasRole, user])

  // Mostrar loader mientras se verifica la autenticación
  if (isLoading || !checked) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // Si requiere autenticación y no está autenticado, no mostrar nada
  if (requireAuth && !isAuthenticated) {
    return null
  }

  // Si requiere roles específicos y no los tiene, no mostrar nada
  if (isAuthenticated && allowedRoles.length > 0 && !hasRole(allowedRoles)) {
    return null
  }

  return <>{children}</>
}
