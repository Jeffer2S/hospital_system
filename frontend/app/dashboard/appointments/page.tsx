"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { UserRole, type Appointment, type Doctor } from "@/lib/types"
import {
  getAllAppointments,
  getAppointmentsByPatient,
  getAppointmentsByDoctor,
  createAppointment,
  updateAppointmentStatus,
  deleteAppointment,
  getAllDoctors,
} from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, User, Building2, CheckCircle, XCircle, AlertCircle, Plus } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export default function AppointmentsPage() {
  const { user, hasRole } = useAuth()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newAppointment, setNewAppointment] = useState({
    doctor_id: "",
    appointment_date: "",
    appointment_time: "",
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Cargar citas según el rol del usuario
        let appointmentsData: Appointment[] = []
        if (hasRole([UserRole.PATIENT]) && user) {
          appointmentsData = await getAppointmentsByPatient(user.id)
        } else if (hasRole([UserRole.DOCTOR]) && user) {
          appointmentsData = await getAppointmentsByDoctor(user.id)
        } else if (hasRole([UserRole.ADMIN])) {
          appointmentsData = await getAllAppointments()
        }
        setAppointments(appointmentsData)

        // Cargar doctores para el formulario de nueva cita
        if (hasRole([UserRole.PATIENT, UserRole.ADMIN])) {
          const doctorsData = await getAllDoctors()
          setDoctors(doctorsData)
        }
      } catch (error) {
        console.error("Error al cargar datos:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [user, hasRole])

  const handleCreateAppointment = async () => {
    try {
      if (!user) return

      const appointmentData = {
        patient_id: user.id,
        doctor_id: Number.parseInt(newAppointment.doctor_id),
        appointment_date: newAppointment.appointment_date,
        appointment_time: newAppointment.appointment_time,
        status: "pending",
      }

      const createdAppointment = await createAppointment(appointmentData)
      setAppointments([...appointments, createdAppointment])
      setIsDialogOpen(false)
      setNewAppointment({
        doctor_id: "",
        appointment_date: "",
        appointment_time: "",
      })
    } catch (error) {
      console.error("Error al crear cita:", error)
    }
  }

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await updateAppointmentStatus(id, status)
      setAppointments(
        appointments.map((appointment) => (appointment.id === id ? { ...appointment, status } : appointment)),
      )
    } catch (error) {
      console.error("Error al actualizar estado:", error)
    }
  }

  const handleDeleteAppointment = async (id: number) => {
    try {
      await deleteAppointment(id)
      setAppointments(appointments.filter((appointment) => appointment.id !== id))
    } catch (error) {
      console.error("Error al eliminar cita:", error)
    }
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

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Pendiente"
      case "completed":
        return "Completada"
      case "cancelled":
        return "Cancelada"
      default:
        return status
    }
  }

  const pendingAppointments = appointments.filter(
    (a) => a.status === "pending" && new Date(a.appointment_date) >= new Date(),
  )
  const pastAppointments = appointments.filter(
    (a) => a.status !== "pending" || new Date(a.appointment_date) < new Date(),
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Citas Médicas</h1>
          <p className="text-muted-foreground">Gestiona tus citas médicas programadas</p>
        </div>
        {hasRole([UserRole.PATIENT]) && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nueva Cita
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Programar Nueva Cita</DialogTitle>
                <DialogDescription>Completa el formulario para agendar una nueva cita médica</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="doctor">Doctor</Label>
                  <Select
                    value={newAppointment.doctor_id}
                    onValueChange={(value) => setNewAppointment({ ...newAppointment, doctor_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un doctor" />
                    </SelectTrigger>
                    <SelectContent>
                      {doctors.map((doctor) => (
                        <SelectItem key={doctor.id} value={doctor.id.toString()}>
                          Dr. {doctor.user?.name} - {doctor.specialty?.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="date">Fecha</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newAppointment.appointment_date}
                    onChange={(e) =>
                      setNewAppointment({
                        ...newAppointment,
                        appointment_date: e.target.value,
                      })
                    }
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="time">Hora</Label>
                  <Input
                    id="time"
                    type="time"
                    value={newAppointment.appointment_time}
                    onChange={(e) =>
                      setNewAppointment({
                        ...newAppointment,
                        appointment_time: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreateAppointment}>Agendar Cita</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">Próximas Citas</TabsTrigger>
          <TabsTrigger value="past">Citas Pasadas</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming" className="space-y-4">
          {isLoading ? (
            <p>Cargando citas...</p>
          ) : pendingAppointments.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pendingAppointments
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
                    <CardFooter className="flex justify-between">
                      {hasRole([UserRole.DOCTOR, UserRole.ADMIN]) && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusChange(appointment.id, "completed")}
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Completar
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusChange(appointment.id, "cancelled")}
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Cancelar
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No tienes citas próximas programadas.</p>
          )}
        </TabsContent>
        <TabsContent value="past" className="space-y-4">
          {isLoading ? (
            <p>Cargando citas...</p>
          ) : pastAppointments.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pastAppointments
                .sort((a, b) => new Date(b.appointment_date).getTime() - new Date(a.appointment_date).getTime())
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
                      <div className="mt-2 text-sm font-medium">Estado: {getStatusText(appointment.status)}</div>
                    </CardContent>
                    {hasRole([UserRole.ADMIN]) && (
                      <CardFooter>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => handleDeleteAppointment(appointment.id)}
                        >
                          Eliminar
                        </Button>
                      </CardFooter>
                    )}
                  </Card>
                ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No tienes citas pasadas.</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
