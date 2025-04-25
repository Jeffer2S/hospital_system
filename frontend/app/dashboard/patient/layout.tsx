import type React from "react"
import AuthGuard from "@/components/auth-guard"
import DashboardLayout from "@/components/dashboard-layout"
import { UserRole } from "@/lib/types"

export default function PatientLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard requireAuth={true} allowedRoles={[UserRole.PATIENT]}>
      <DashboardLayout>{children}</DashboardLayout>
    </AuthGuard>
  )
}
