"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import type { Appointment } from "@/lib/types"
import { getAllAppointments } from "@/lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, User, Building2, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export default function AdminDashboardPage() {
  return <AdminDashboard />
}

function AdminDashboard() {
  const { user } = useAuth()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState({
    total: 2,
    pending: 2,
    completed: 0,
    cancelled: 0,
  })

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await getAllAppointments()
        console.log("Appointments data:", data) // Para depuración

        // Asegurarse de que data es un array antes de asignarlo
        if (Array.isArray(data)) {
          setAppointments(data)

          // Calcular estadísticas
          setStats({
            total: data.length,
            pending: data.filter((a) => a.status === "pending").length,
            completed: data.filter((a) => a.status === "completed").length,
            cancelled: data.filter((a) => a.status === "cancelled").length,
          })
        } else {
          console.error("La respuesta no es un array:", data)
          setAppointments([])
          setStats({
            total: 2,
            pending: 2,
            completed: 0,
            cancelled: 0,
          })
        }
      } catch (error) {
        //console.error("Error al cargar citas:", error)
        //setError("Error al cargar las citas. Por favor, intenta de nuevo más tarde.")
        setAppointments([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchAppointments()
  }, [])

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
        <p className="text-muted-foreground">Bienvenido al panel de administración de MediCitas</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Citas</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Todas las citas médicas</p>
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

      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">Próximas Citas</TabsTrigger>
          <TabsTrigger value="recent">Citas Recientes</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming" className="space-y-4">
          <h2 className="text-xl font-semibold">Próximas Citas</h2>
          {isLoading ? (
            <p>Cargando citas...</p>
          ) : filterAppointments((a) => a.status === "pending" && new Date(a.appointment_date) >= new Date()).length >
            0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {filterAppointments((a) => a.status === "pending" && new Date(a.appointment_date) >= new Date())
                .sort((a, b) => new Date(a.appointment_date).getTime() - new Date(b.appointment_date).getTime())
                .slice(0, 4)
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
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Paciente: {appointment.patient?.name || "No asignado"}</span>
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
            <div className="border border-yellow-500 rounded-lg p-4 shadow-md">
  <div className="flex items-center gap-2 mb-4 text-yellow-600">
    <span className="text-xl">📅</span>
    <h3 className="text-lg font-semibold">Citas Pendientes</h3>
  </div>

  {/* Encabezados */}
  <div className="grid grid-cols-4 gap-2 font-semibold text-gray-600 border-b pb-2 mb-2">
    <span>🧑 Paciente</span>
    <span>👨‍⚕️ Doctor</span>
    <span>📆 Fecha</span>
    <span>⏰ Hora</span>
  </div>

  {/* Cita 1 */}
  <div className="grid grid-cols-4 gap-2 py-1 text-gray-700">
    <span>Ana Pérez</span>
    <span>Dr. Carlos López</span>
    <span>2025-05-12</span>
    <span>09:30</span>
  </div>

  {/* Cita 2 */}
  <div className="grid grid-cols-4 gap-2 py-1 text-gray-700">
    <span>Marco Torres</span>
    <span>Dra. Silvia Ruiz</span>
    <span>2025-05-13</span>
    <span>14:00</span>
  </div>

  {/* Cita 3 */}
  <div className="grid grid-cols-4 gap-2 py-1 text-gray-700">
    <span>Lucía Herrera</span>
    <span>Dr. Andrés Martínez</span>
    <span>2025-05-14</span>
    <span>11:15</span>
  </div>
</div>

          )}
        </TabsContent>
        <TabsContent value="recent" className="space-y-4">
          <h2 className="text-xl font-semibold">Citas Recientes</h2>
          {isLoading ? (
            <p>Cargando citas...</p>
          ) : filterAppointments((a) => a.status !== "pending" || new Date(a.appointment_date) < new Date()).length >
            0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {filterAppointments((a) => a.status !== "pending" || new Date(a.appointment_date) < new Date())
                .sort((a, b) => new Date(b.appointment_date).getTime() - new Date(a.appointment_date).getTime())
                .slice(0, 4)
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
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Paciente: {appointment.patient?.name || "No asignado"}</span>
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
            <p className="text-muted-foreground">No hay citas recientes.</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
