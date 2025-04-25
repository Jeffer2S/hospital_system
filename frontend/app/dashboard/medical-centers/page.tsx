"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { type MedicalCenter, UserRole, City } from "@/lib/types"
import {
  getAllMedicalCenters,
  createMedicalCenter,
  updateMedicalCenter,
  toggleMedicalCenterStatus,
  deleteMedicalCenter,
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { MoreHorizontal, Plus, Pencil, Trash2, Power } from "lucide-react"

export default function MedicalCentersPage() {
  return (
    <AuthGuard allowedRoles={[UserRole.ADMIN]}>
      <MedicalCentersContent />
    </AuthGuard>
  )
}

function MedicalCentersContent() {
  const [centers, setCenters] = useState<MedicalCenter[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedCenter, setSelectedCenter] = useState<MedicalCenter | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: City.QUITO,
  })

  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const data = await getAllMedicalCenters()
        setCenters(data)
      } catch (error) {
        console.error("Error al cargar centros médicos:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCenters()
  }, [])

  const handleCreateCenter = async () => {
    try {
      const newCenter = await createMedicalCenter(formData)
      setCenters([...centers, newCenter])
      setIsCreateDialogOpen(false)
      resetForm()
    } catch (error) {
      console.error("Error al crear centro médico:", error)
    }
  }

  const handleUpdateCenter = async () => {
    try {
      if (!selectedCenter) return

      const updatedCenter = await updateMedicalCenter(selectedCenter.id, formData)
      setCenters(centers.map((center) => (center.id === updatedCenter.id ? updatedCenter : center)))
      setIsEditDialogOpen(false)
      resetForm()
    } catch (error) {
      console.error("Error al actualizar centro médico:", error)
    }
  }

  const handleToggleStatus = async (id: number) => {
    try {
      const updatedCenter = await toggleMedicalCenterStatus(id)
      setCenters(centers.map((center) => (center.id === updatedCenter.id ? updatedCenter : center)))
    } catch (error) {
      console.error("Error al cambiar estado del centro médico:", error)
    }
  }

  const handleDeleteCenter = async (id: number) => {
    try {
      await deleteMedicalCenter(id)
      setCenters(centers.filter((center) => center.id !== id))
    } catch (error) {
      console.error("Error al eliminar centro médico:", error)
    }
  }

  const openEditDialog = (center: MedicalCenter) => {
    setSelectedCenter(center)
    setFormData({
      name: center.name,
      address: center.address,
      city: center.city as City,
    })
    setIsEditDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      name: "",
      address: "",
      city: City.QUITO,
    })
    setSelectedCenter(null)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCityChange = (value: string) => {
    setFormData((prev) => ({ ...prev, city: value as City }))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Centros Médicos</h1>
          <p className="text-muted-foreground">Gestiona los centros médicos del sistema</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Centro
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear Nuevo Centro Médico</DialogTitle>
              <DialogDescription>Completa el formulario para crear un nuevo centro médico</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Hospital General"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">Dirección</Label>
                <Textarea
                  id="address"
                  name="address"
                  placeholder="Av. Principal 123"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="city">Ciudad</Label>
                <Select value={formData.city} onValueChange={handleCityChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una ciudad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={City.QUITO}>Quito</SelectItem>
                    <SelectItem value={City.GUAYAQUIL}>Guayaquil</SelectItem>
                    <SelectItem value={City.CUENCA}>Cuenca</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateCenter}>Crear Centro</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Centros Médicos</CardTitle>
          <CardDescription>Administra todos los centros médicos registrados en el sistema</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Cargando centros médicos...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Dirección</TableHead>
                  <TableHead>Ciudad</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha Registro</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {centers.map((center) => (
                  <TableRow key={center.id}>
                    <TableCell className="font-medium">{center.name}</TableCell>
                    <TableCell>{center.address}</TableCell>
                    <TableCell>{center.city}</TableCell>
                    <TableCell>
                      <Badge variant={center.active ? "default" : "secondary"}>
                        {center.active ? "Activo" : "Inactivo"}
                      </Badge>
                    </TableCell>
                    <TableCell>{format(new Date(center.created_at), "dd/MM/yyyy", { locale: es })}</TableCell>
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
                          <DropdownMenuItem onClick={() => openEditDialog(center)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleStatus(center.id)}>
                            <Power className="mr-2 h-4 w-4" />
                            {center.active ? "Desactivar" : "Activar"}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteCenter(center.id)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Centro Médico</DialogTitle>
            <DialogDescription>Actualiza la información del centro médico</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Nombre</Label>
              <Input
                id="edit-name"
                name="name"
                placeholder="Hospital General"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-address">Dirección</Label>
              <Textarea
                id="edit-address"
                name="address"
                placeholder="Av. Principal 123"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-city">Ciudad</Label>
              <Select value={formData.city} onValueChange={handleCityChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una ciudad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={City.QUITO}>Quito</SelectItem>
                  <SelectItem value={City.GUAYAQUIL}>Guayaquil</SelectItem>
                  <SelectItem value={City.CUENCA}>Cuenca</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdateCenter}>Guardar Cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
