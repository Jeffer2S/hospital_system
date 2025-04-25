import type { User, MedicalCenter, Specialty, Doctor, Appointment } from "./types"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"

// Helper para manejar errores de fetch
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Ocurrió un error en la solicitud")
  }
  return response.json()
}

// Función para obtener el token de autenticación
function getAuthToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("auth_token")
  }
  return null
}

// Función para crear headers con autenticación
function getAuthHeaders(): HeadersInit {
  const token = getAuthToken()
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  return headers
}

// Autenticación
export async function login(email: string, password: string): Promise<any> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })

  const data = await handleResponse<any>(response)
  console.log("API login response:", data) // Para depuración
  return data
}

export async function register(userData: {
  dni: string
  name: string
  email: string
  password: string
  role?: string
}): Promise<any> {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  })

  const data = await handleResponse<any>(response)
  console.log("API register response:", data) // Para depuración
  return data
}

// Ejemplo de uso en getCurrentUser
export async function getCurrentUser(): Promise<User> {
  const token = getAuthToken()
  if (!token) {
    throw new Error("No authentication token found")
  }

  const response = await fetch(`${API_URL}/auth/me`, {
    headers: getAuthHeaders(),
  })

  const data = await handleResponse<any>(response)
  // Si la respuesta tiene una estructura anidada, extraer el usuario
  return data.data?.user || data.user || data
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<{ message: string }> {
  const response = await fetch(`${API_URL}/auth/change-password`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ currentPassword, newPassword }),
  })
  return handleResponse<{ message: string }>(response)
}

// Usuarios
export async function getAllUsers(): Promise<User[]> {
  const response = await fetch(`${API_URL}/users`, {
    headers: getAuthHeaders(),
  })
  return handleResponse<User[]>(response)
}

export async function getUserById(id: number): Promise<User> {
  const response = await fetch(`${API_URL}/users/${id}`, {
    headers: getAuthHeaders(),
  })
  return handleResponse<User>(response)
}

export async function createUser(userData: Partial<User>): Promise<User> {
  const response = await fetch(`${API_URL}/users`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(userData),
  })
  return handleResponse<User>(response)
}

export async function updateUser(id: number, userData: Partial<User>): Promise<User> {
  const response = await fetch(`${API_URL}/users/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(userData),
  })
  return handleResponse<User>(response)
}

export async function deleteUser(id: number): Promise<{ message: string }> {
  const response = await fetch(`${API_URL}/users/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  })
  return handleResponse<{ message: string }>(response)
}

export async function getDoctors(): Promise<User[]> {
  const response = await fetch(`${API_URL}/users/doctors`, {
    headers: getAuthHeaders(),
  })
  return handleResponse<User[]>(response)
}

export async function getPatients(): Promise<User[]> {
  const response = await fetch(`${API_URL}/users/patients`, {
    headers: getAuthHeaders(),
  })
  return handleResponse<User[]>(response)
}

// Centros Médicos
export async function getAllMedicalCenters(): Promise<MedicalCenter[]> {
  const response = await fetch(`${API_URL}/medical-centers`)
  return handleResponse<MedicalCenter[]>(response)
}

export async function getMedicalCenterById(id: number): Promise<MedicalCenter> {
  const response = await fetch(`${API_URL}/medical-centers/${id}`)
  return handleResponse<MedicalCenter>(response)
}

export async function getMedicalCentersByCity(city: string): Promise<MedicalCenter[]> {
  const response = await fetch(`${API_URL}/medical-centers/city/${city}`)
  return handleResponse<MedicalCenter[]>(response)
}

export async function createMedicalCenter(centerData: Partial<MedicalCenter>): Promise<MedicalCenter> {
  const response = await fetch(`${API_URL}/medical-centers`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(centerData),
  })
  return handleResponse<MedicalCenter>(response)
}

export async function updateMedicalCenter(id: number, centerData: Partial<MedicalCenter>): Promise<MedicalCenter> {
  const response = await fetch(`${API_URL}/medical-centers/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(centerData),
  })
  return handleResponse<MedicalCenter>(response)
}

export async function toggleMedicalCenterStatus(id: number): Promise<MedicalCenter> {
  const response = await fetch(`${API_URL}/medical-centers/${id}/toggle-status`, {
    method: "PATCH",
    headers: getAuthHeaders(),
  })
  return handleResponse<MedicalCenter>(response)
}

export async function deleteMedicalCenter(id: number): Promise<{ message: string }> {
  const response = await fetch(`${API_URL}/medical-centers/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  })
  return handleResponse<{ message: string }>(response)
}

// Especialidades
export async function getAllSpecialties(): Promise<Specialty[]> {
  const response = await fetch(`${API_URL}/specialties`)
  return handleResponse<Specialty[]>(response)
}

export async function getSpecialtyById(id: number): Promise<Specialty> {
  const response = await fetch(`${API_URL}/specialties/${id}`)
  return handleResponse<Specialty>(response)
}

export async function createSpecialty(specialtyData: Partial<Specialty>): Promise<Specialty> {
  const response = await fetch(`${API_URL}/specialties`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(specialtyData),
  })
  return handleResponse<Specialty>(response)
}

export async function updateSpecialty(id: number, specialtyData: Partial<Specialty>): Promise<Specialty> {
  const response = await fetch(`${API_URL}/specialties/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(specialtyData),
  })
  return handleResponse<Specialty>(response)
}

export async function deleteSpecialty(id: number): Promise<{ message: string }> {
  const response = await fetch(`${API_URL}/specialties/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  })
  return handleResponse<{ message: string }>(response)
}

// Doctores
export async function getAllDoctors(): Promise<Doctor[]> {
  const response = await fetch(`${API_URL}/doctors`)
  return handleResponse<Doctor[]>(response)
}

export async function getDoctorById(id: number): Promise<Doctor> {
  const response = await fetch(`${API_URL}/doctors/${id}`)
  return handleResponse<Doctor>(response)
}

export async function getDoctorsByMedicalCenter(medicalCenterId: number): Promise<Doctor[]> {
  const response = await fetch(`${API_URL}/doctors/medical-center/${medicalCenterId}`)
  return handleResponse<Doctor[]>(response)
}

export async function getDoctorsBySpecialty(specialtyId: number): Promise<Doctor[]> {
  const response = await fetch(`${API_URL}/doctors/specialty/${specialtyId}`)
  return handleResponse<Doctor[]>(response)
}

export async function createDoctor(doctorData: Partial<Doctor>): Promise<Doctor> {
  const response = await fetch(`${API_URL}/doctors`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(doctorData),
  })
  return handleResponse<Doctor>(response)
}

export async function updateDoctor(id: number, doctorData: Partial<Doctor>): Promise<Doctor> {
  const response = await fetch(`${API_URL}/doctors/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(doctorData),
  })
  return handleResponse<Doctor>(response)
}

export async function deleteDoctor(id: number): Promise<{ message: string }> {
  const response = await fetch(`${API_URL}/doctors/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  })
  return handleResponse<{ message: string }>(response)
}

// Citas
export async function getAllAppointments(): Promise<Appointment[]> {
  const response = await fetch(`${API_URL}/appointments`, {
    headers: getAuthHeaders(),
  })
  const data = await handleResponse<any>(response)

  // Verificar la estructura de la respuesta y extraer el array de citas
  if (data && Array.isArray(data)) {
    return data
  } else if (data && Array.isArray(data.data)) {
    return data.data
  } else if (data && typeof data === "object") {
    // Buscar cualquier propiedad que sea un array
    for (const key in data) {
      if (Array.isArray(data[key])) {
        return data[key]
      }
    }
  }

  // Si no se encuentra un array, devolver un array vacío
  console.error("Formato de respuesta inesperado:", data)
  return []
}

export async function getAppointmentById(id: number): Promise<Appointment> {
  const response = await fetch(`${API_URL}/appointments/${id}`, {
    headers: getAuthHeaders(),
  })
  return handleResponse<Appointment>(response)
}

export async function getAppointmentsByPatient(patientId: number): Promise<Appointment[]> {
  const response = await fetch(`${API_URL}/appointments/patient/${patientId}`, {
    headers: getAuthHeaders(),
  })
  const data = await handleResponse<any>(response)

  // Verificar la estructura de la respuesta y extraer el array de citas
  if (data && Array.isArray(data)) {
    return data
  } else if (data && Array.isArray(data.data)) {
    return data.data
  } else if (data && typeof data === "object") {
    // Buscar cualquier propiedad que sea un array
    for (const key in data) {
      if (Array.isArray(data[key])) {
        return data[key]
      }
    }
  }

  // Si no se encuentra un array, devolver un array vacío
  console.error("Formato de respuesta inesperado:", data)
  return []
}

export async function getAppointmentsByDoctor(doctorId: number): Promise<Appointment[]> {
  const response = await fetch(`${API_URL}/appointments/doctor/${doctorId}`, {
    headers: getAuthHeaders(),
  })
  const data = await handleResponse<any>(response)

  // Verificar la estructura de la respuesta y extraer el array de citas
  if (data && Array.isArray(data)) {
    return data
  } else if (data && Array.isArray(data.data)) {
    return data.data
  } else if (data && typeof data === "object") {
    // Buscar cualquier propiedad que sea un array
    for (const key in data) {
      if (Array.isArray(data[key])) {
        return data[key]
      }
    }
  }

  // Si no se encuentra un array, devolver un array vacío
  console.error("Formato de respuesta inesperado:", data)
  return []
}

export async function getAppointmentsByDate(date: string): Promise<Appointment[]> {
  const response = await fetch(`${API_URL}/appointments/date/${date}`, {
    headers: getAuthHeaders(),
  })
  return handleResponse<Appointment[]>(response)
}

export async function createAppointment(appointmentData: Partial<Appointment>): Promise<Appointment> {
  const response = await fetch(`${API_URL}/appointments`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(appointmentData),
  })
  return handleResponse<Appointment>(response)
}

export async function updateAppointmentStatus(id: number, status: string): Promise<Appointment> {
  const response = await fetch(`${API_URL}/appointments/${id}/status`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  })
  return handleResponse<Appointment>(response)
}

export async function deleteAppointment(id: number): Promise<{ message: string }> {
  const response = await fetch(`${API_URL}/appointments/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  })
  return handleResponse<{ message: string }>(response)
}
