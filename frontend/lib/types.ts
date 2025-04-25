export enum UserRole {
  ADMIN = "admin",
  DOCTOR = "doctor",
  PATIENT = "patient",
}

export enum AppointmentStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export enum City {
  QUITO = "Quito",
  GUAYAQUIL = "Guayaquil",
  CUENCA = "Cuenca",
}

export interface User {
  id: number
  dni: string
  name: string
  email: string
  role: UserRole
  created_at: string
}

export interface MedicalCenter {
  id: number
  name: string
  address: string
  city: City
  active: boolean
  created_at: string
}

export interface Specialty {
  id: number
  name: string
  description: string
}

export interface Doctor {
  id: number
  user_id: number
  medical_center_id: number
  specialty_id: number
  created_at: string
  user?: User
  medical_center?: MedicalCenter
  specialty?: Specialty
}

export interface Appointment {
  id: number
  patient_id: number
  doctor_id: number
  appointment_date: string
  appointment_time: string
  status: AppointmentStatus
  created_at: string
  patient?: User
  doctor?: Doctor
}

export interface AuthResponse {
  user: User
  token: string
  success?: boolean
  message?: string
  data?: {
    user: User
    token: string
  }
}
