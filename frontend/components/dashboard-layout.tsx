"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { UserRole } from "@/lib/types"
import { Button } from "@/components/ui/button"
import {
  Calendar,
  LayoutDashboard,
  Users,
  Building2,
  Stethoscope,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
  title: string
  href: string
  icon: React.ElementType
  roles: UserRole[]
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: [UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT],
  },
  {
    title: "Citas",
    href: "/dashboard/appointments",
    icon: Calendar,
    roles: [UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT],
  },
  {
    title: "Usuarios",
    href: "/dashboard/users",
    icon: Users,
    roles: [UserRole.ADMIN],
  },
  {
    title: "Centros Médicos",
    href: "/dashboard/medical-centers",
    icon: Building2,
    roles: [UserRole.ADMIN],
  },
  {
    title: "Especialidades",
    href: "/dashboard/specialties",
    icon: FileText,
    roles: [UserRole.ADMIN],
  },
  {
    title: "Doctores",
    href: "/dashboard/doctors",
    icon: Stethoscope,
    roles: [UserRole.ADMIN],
  },
  {
    title: "Configuración",
    href: "/dashboard/settings",
    icon: Settings,
    roles: [UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT],
  },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, hasRole } = useAuth()
  const pathname = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar para móvil */}
      <div className="lg:hidden">
        <Button variant="ghost" size="icon" className="fixed top-4 left-4 z-50" onClick={toggleSidebar}>
          {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>

        {isSidebarOpen && <div className="fixed inset-0 z-40 bg-black/50" onClick={toggleSidebar} />}

        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out",
            isSidebarOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex flex-col h-full">
            <div className="p-4 border-b">
              <h2 className="text-xl font-bold text-primary">MediCitas</h2>
            </div>
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              {navItems
                .filter((item) => hasRole(item.roles))
                .map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                      pathname === item.href ? "bg-primary text-primary-foreground" : "hover:bg-gray-100",
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.title}
                  </Link>
                ))}
            </nav>
            <div className="p-4 border-t">
              <div className="flex items-center gap-3 mb-4">
                <div className="rounded-full bg-primary/10 p-1">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
              </div>
              <Button variant="outline" className="w-full justify-start gap-2" onClick={logout}>
                <LogOut className="h-4 w-4" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </aside>
      </div>

      {/* Sidebar para desktop */}
      <aside className="hidden lg:flex lg:w-64 flex-col border-r bg-white">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold text-primary">MediCitas</h2>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems
            .filter((item) => hasRole(item.roles))
            .map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  pathname === item.href ? "bg-primary text-primary-foreground" : "hover:bg-gray-100",
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.title}
              </Link>
            ))}
        </nav>
        <div className="p-4 border-t">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-full bg-primary/10 p-1">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
          </div>
          <Button variant="outline" className="w-full justify-start gap-2" onClick={logout}>
            <LogOut className="h-4 w-4" />
            Cerrar Sesión
          </Button>
        </div>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-6">{children}</div>
      </main>
    </div>
  )
}
