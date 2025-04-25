"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import type { Appointment, Doctor } from "@/lib/types"
import { getAppointmentsByPatient, getAllDoctors } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, User, Building2, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export default function PatientDashboardPage() {
  return <PatientDashboard />
}

function PatientDashboard() {
  const { user } = useAuth()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    cancelled: 0,
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user) {
          const [appointmentsData, doctorsData] = await Promise.all([
            getAppointmentsByPatient(user.id),
            getAllDoctors(),
          ])

          console.log("Patient appointments data:", appointmentsData) // Para depuración

          // Asegurarse de que appointmentsData es un array antes de asignarlo
          if (Array.isArray(appointmentsData)) {
            setAppointments(appointmentsData)

            // Calcular estadísticas
            setStats({
              total: appointmentsData.length,
              pending: appointmentsData.filter((a) => a.status === "pending").length,
              completed: appointmentsData.filter((a) => a.status === "completed").length,
              cancelled: appointmentsData.filter((a) => a.status === "cancelled").length,
            })
          } else {
            console.error("La respuesta de citas no es un array:", appointmentsData)
            setAppointments([])
            setStats({
              total: 0,
              pending: 0,
              completed: 0,
              cancelled: 0,
            })
          }

          // Asegurarse de que doctorsData es un array antes de asignarlo
          if (Array.isArray(doctorsData)) {
            setDoctors(doctorsData)
          } else {
            console.error("La respuesta de doctores no es un array:", doctorsData)
            setDoctors([])
          }
        }
      } catch (error) {
        console.error("Error al cargar datos:", error)
        setError("Error al cargar los datos. Por favor, intenta de nuevo más tarde.")
        setAppointments([])
        setDoctors([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [user])

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Buenos días"
    if (hour < 18) return "Buenas tardes"
    return "Buenas noches"
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "cancelled":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return null
    }
  }

  // Función segura para filtrar citas
  const filterAppointments = (condition: (a: Appointment) => boolean) => {
    if (!Array.isArray(appointments)) return []
    return appointments.filter(condition)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {getGreeting()}, {user?.name}
        </h1>
        <p className="text-muted-foreground">Bienvenido a tu panel de control de MediCitas</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Citas</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Todas tus citas médicas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">Citas programadas pendientes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completadas</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completed}</div>
            <p className="text-xs text-muted-foreground">Citas atendidas satisfactoriamente</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Canceladas</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.cancelled}</div>
            <p className="text-xs text-muted-foreground">Citas que fueron canceladas</p>
          </CardContent>
        </Card>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <h2 className="text-xl font-semibold mt-8">Mis Próximas Citas</h2>
      {isLoading ? (
        <p>Cargando citas...</p>
      ) : filterAppointments((a) => a.status === "pending" && new Date(a.appointment_date) >= new Date()).length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filterAppointments((a) => a.status === "pending" && new Date(a.appointment_date) >= new Date())
            .sort((a, b) => new Date(a.appointment_date).getTime() - new Date(b.appointment_date).getTime())
            .map((appointment) => (
              <Card key={appointment.id}>
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                  <div>
                    <CardTitle className="text-base">
                      {appointment.doctor?.specialty?.name || "Consulta Médica"}
                    </CardTitle>
                    <CardDescription>
                      {format(new Date(appointment.appointment_date), "EEEE, d 'de' MMMM 'de' yyyy", {
                        locale: es,
                      })}
                    </CardDescription>
                  </div>
                  {getStatusIcon(appointment.status)}
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{appointment.appointment_time.substring(0, 5)} hrs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Dr. {appointment.doctor?.user?.name || "No asignado"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {appointment.doctor?.medical_center?.name || "Centro médico no especificado"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium">No tienes citas próximas</h3>
          <p className="text-muted-foreground mt-2 mb-4">Programa una cita con uno de nuestros especialistas</p>
          <Button asChild>
            <a href="/dashboard/appointments">Agendar Cita</a>
          </Button>
        </div>
      )}

      <h2 className="text-xl font-semibold mt-8">Historial de Citas</h2>
      {isLoading ? (
        <p>Cargando historial...</p>
      ) : filterAppointments((a) => a.status !== "pending" || new Date(a.appointment_date) < new Date()).length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filterAppointments((a) => a.status !== "pending" || new Date(a.appointment_date) < new Date())
            .sort((a, b) => new Date(b.appointment_date).getTime() - new Date(a.appointment_date).getTime())
            .slice(0, 3)
            .map((appointment) => (
              <Card key={appointment.id}>
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                  <div>
                    <CardTitle className="text-base">
                      {appointment.doctor?.specialty?.name || "Consulta Médica"}
                    </CardTitle>
                    <CardDescription>
                      {format(new Date(appointment.appointment_date), "EEEE, d 'de' MMMM 'de' yyyy", {
                        locale: es,
                      })}
                    </CardDescription>
                  </div>
                  {getStatusIcon(appointment.status)}
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{appointment.appointment_time.substring(0, 5)} hrs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Dr. {appointment.doctor?.user?.name || "No asignado"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {appointment.doctor?.medical_center?.name || "Centro médico no especificado"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      ) : (
        <p className="text-muted-foreground">No tienes historial de citas.</p>
      )}

      <div className="mt-8 text-center">
        <Button asChild>
          <a href="/dashboard/appointments">Ver todas mis citas</a>
        </Button>
      </div>
    </div>
  )
}
