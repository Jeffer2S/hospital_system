import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { UserRole } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Función para determinar la ruta del dashboard según el rol
export function getDashboardPath(role: UserRole): string {
  switch (role) {
    case UserRole.ADMIN:
      return "/dashboard"
    case UserRole.DOCTOR:
      return "/dashboard/doctor"
    case UserRole.PATIENT:
      return "/dashboard/patient"
    default:
      return "/dashboard"
  }
}
