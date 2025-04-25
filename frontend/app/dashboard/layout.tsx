import type React from "react"
import AuthGuard from "@/components/auth-guard"
import DashboardLayout from "@/components/dashboard-layout"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard requireAuth={true}>
      <DashboardLayout>{children}</DashboardLayout>
    </AuthGuard>
  )
}
