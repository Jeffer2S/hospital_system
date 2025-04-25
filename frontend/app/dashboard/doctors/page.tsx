"use client"

import { useEffect, useState } from "react"
import { type Doctor, type User, type MedicalCenter, type Specialty, UserRole } from "@/lib/types"
import {
  getAllDoctors,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  getDoctors as getDoctorUsers,
  getAllMedicalCenters,
  getAllSpecialties,
} from "@/lib/api"
import AuthGuard from "@/components/auth-guard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { MoreHorizontal, Plus, Pencil, Trash2 } from "lucide-react"

export default function DoctorsPage() {
  return (
    <AuthGuard allowedRoles={[UserRole.ADMIN]}>
      <DoctorsContent />
    </AuthGuard>
  )
}

function DoctorsContent() {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [doctorUsers, setDoctorUsers] = useState<User[]>([])
  const [medicalCenters, setMedicalCenters] = useState<MedicalCenter[]>([])
  const [specialties, setSpecialties] = useState<Specialty[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)
  const [formData, setFormData] = useState({
    user_id: "",
    medical_center_id: "",
    specialty_id: "",
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [doctorsData, doctorUsersData, centersData, specialtiesData] = await Promise.all([
          getAllDoctors(),
          getDoctorUsers(),
          getAllMedicalCenters(),
          getAllSpecialties(),
        ])

        setDoctors(doctorsData)
        setDoctorUsers(doctorUsersData)
        setMedicalCenters(centersData)
        setSpecialties(specialtiesData)
      } catch (error) {
        console.error("Error al cargar datos:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleCreateDoctor = async () => {
    try {
      const newDoctor = await createDoctor({
        user_id: Number.parseInt(formData.user_id),
        medical_center_id: Number.parseInt(formData.medical_center_id),
        specialty_id: Number.parseInt(formData.specialty_id),
      })
      setDoctors([...doctors, newDoctor])
      setIsCreateDialogOpen(false)
      resetForm()
    } catch (error) {
      console.error("Error al crear doctor:", error)
    }
  }

  const handleUpdateDoctor = async () => {
    try {
      if (!selectedDoctor) return

      const updatedDoctor = await updateDoctor(selectedDoctor.id, {
        medical_center_id: Number.parseInt(formData.medical_center_id),
        specialty_id: Number.parseInt(formData.specialty_id),
      })
      setDoctors(doctors.map((doctor) => (doctor.id === updatedDoctor.id ? updatedDoctor : doctor)))
      setIsEditDialogOpen(false)
      resetForm()
    } catch (error) {
      console.error("Error al actualizar doctor:", error)
    }
  }

  const handleDeleteDoctor = async (id: number) => {
    try {
      await deleteDoctor(id)
      setDoctors(doctors.filter((doctor) => doctor.id !== id))
    } catch (error) {
      console.error("Error al eliminar doctor:", error)
    }
  }

  const openEditDialog = (doctor: Doctor) => {
    setSelectedDoctor(doctor)
    setFormData({
      user_id: doctor.user_id.toString(),
      medical_center_id: doctor.medical_center_id.toString(),
      specialty_id: doctor.specialty_id.toString(),
    })
    setIsEditDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      user_id: "",
      medical_center_id: "",
      specialty_id: "",
    })
    setSelectedDoctor(null)
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Filtrar usuarios doctores que aún no están asignados a un doctor
  const getAvailableDoctorUsers = () => {
    const assignedUserIds = doctors.map((doctor) => doctor.user_id)
    return doctorUsers.filter(
      (user) => !assignedUserIds.includes(user.id) || (selectedDoctor && user.id === selectedDoctor.user_id),
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Doctores</h1>
          <p className="text-muted-foreground">Gestiona los doctores del sistema</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Doctor
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Asignar Nuevo Doctor</DialogTitle>
              <DialogDescription>Asigna un usuario doctor a un centro médico y especialidad</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="user_id">Usuario Doctor</label>
                <Select value={formData.user_id} onValueChange={(value) => handleSelectChange("user_id", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un usuario" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableDoctorUsers().map((user) => (
                      <SelectItem key={user.id} value={user.id.toString()}>
                        {user.name} ({user.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <label htmlFor="medical_center_id">Centro Médico</label>
                <Select
                  value={formData.medical_center_id}
                  onValueChange={(value) => handleSelectChange("medical_center_id", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un centro médico" />
                  </SelectTrigger>
                  <SelectContent>
                    {medicalCenters
                      .filter((center) => center.active)
                      .map((center) => (
                        <SelectItem key={center.id} value={center.id.toString()}>
                          {center.name} ({center.city})
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <label htmlFor="specialty_id">Especialidad</label>
                <Select
                  value={formData.specialty_id}
                  onValueChange={(value) => handleSelectChange("specialty_id", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una especialidad" />
                  </SelectTrigger>
                  <SelectContent>
                    {specialties.map((specialty) => (
                      <SelectItem key={specialty.id} value={specialty.id.toString()}>
                        {specialty.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateDoctor}>Asignar Doctor</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Doctores</CardTitle>
          <CardDescription>Administra todos los doctores registrados en el sistema</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Cargando doctores...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Especialidad</TableHead>
                  <TableHead>Centro Médico</TableHead>
                  <TableHead>Ciudad</TableHead>
                  <TableHead>Fecha Registro</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {doctors.map((doctor) => {
                  const user = doctorUsers.find((u) => u.id === doctor.user_id)
                  const center = medicalCenters.find((c) => c.id === doctor.medical_center_id)
                  const specialty = specialties.find((s) => s.id === doctor.specialty_id)

                  return (
                    <TableRow key={doctor.id}>
                      <TableCell className="font-medium">
                        {user ? user.name : `Usuario ID: ${doctor.user_id}`}
                      </TableCell>
                      <TableCell>{specialty ? specialty.name : `Especialidad ID: ${doctor.specialty_id}`}</TableCell>
                      <TableCell>{center ? center.name : `Centro ID: ${doctor.medical_center_id}`}</TableCell>
                      <TableCell>{center ? center.city : "N/A"}</TableCell>
                      <TableCell>{format(new Date(doctor.created_at), "dd/MM/yyyy", { locale: es })}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => openEditDialog(doctor)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteDoctor(doctor.id)}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Asignación de Doctor</DialogTitle>
            <DialogDescription>Actualiza el centro médico y especialidad del doctor</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="edit-medical_center_id">Centro Médico</label>
              <Select
                value={formData.medical_center_id}
                onValueChange={(value) => handleSelectChange("medical_center_id", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un centro médico" />
                </SelectTrigger>
                <SelectContent>
                  {medicalCenters
                    .filter((center) => center.active)
                    .map((center) => (
                      <SelectItem key={center.id} value={center.id.toString()}>
                        {center.name} ({center.city})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <label htmlFor="edit-specialty_id">Especialidad</label>
              <Select
                value={formData.specialty_id}
                onValueChange={(value) => handleSelectChange("specialty_id", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una especialidad" />
                </SelectTrigger>
                <SelectContent>
                  {specialties.map((specialty) => (
                    <SelectItem key={specialty.id} value={specialty.id.toString()}>
                      {specialty.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdateDoctor}>Guardar Cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
