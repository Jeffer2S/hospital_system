"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { type Specialty, UserRole } from "@/lib/types"
import { getAllSpecialties, createSpecialty, updateSpecialty, deleteSpecialty } from "@/lib/api"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MoreHorizontal, Plus, Pencil, Trash2 } from "lucide-react"

export default function SpecialtiesPage() {
  return (
    <AuthGuard allowedRoles={[UserRole.ADMIN]}>
      <SpecialtiesContent />
    </AuthGuard>
  )
}

function SpecialtiesContent() {
  const [specialties, setSpecialties] = useState<Specialty[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedSpecialty, setSelectedSpecialty] = useState<Specialty | null>(null)
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
  })

  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const data = await getAllSpecialties()
        setSpecialties(data)
      } catch (error) {
        console.error("Error al cargar especialidades:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSpecialties()
  }, [])

  const handleCreateSpecialty = async () => {
    try {
      const newSpecialty = await createSpecialty({
        id: Number.parseInt(formData.id),
        name: formData.name,
        description: formData.description,
      })
      setSpecialties([...specialties, newSpecialty])
      setIsCreateDialogOpen(false)
      resetForm()
    } catch (error) {
      console.error("Error al crear especialidad:", error)
    }
  }

  const handleUpdateSpecialty = async () => {
    try {
      if (!selectedSpecialty) return

      const updatedSpecialty = await updateSpecialty(selectedSpecialty.id, {
        name: formData.name,
        description: formData.description,
      })
      setSpecialties(
        specialties.map((specialty) => (specialty.id === updatedSpecialty.id ? updatedSpecialty : specialty)),
      )
      setIsEditDialogOpen(false)
      resetForm()
    } catch (error) {
      console.error("Error al actualizar especialidad:", error)
    }
  }

  const handleDeleteSpecialty = async (id: number) => {
    try {
      await deleteSpecialty(id)
      setSpecialties(specialties.filter((specialty) => specialty.id !== id))
    } catch (error) {
      console.error("Error al eliminar especialidad:", error)
    }
  }

  const openEditDialog = (specialty: Specialty) => {
    setSelectedSpecialty(specialty)
    setFormData({
      id: specialty.id.toString(),
      name: specialty.name,
      description: specialty.description || "",
    })
    setIsEditDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      id: "",
      name: "",
      description: "",
    })
    setSelectedSpecialty(null)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Especialidades</h1>
          <p className="text-muted-foreground">Gestiona las especialidades médicas del sistema</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nueva Especialidad
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear Nueva Especialidad</DialogTitle>
              <DialogDescription>Completa el formulario para crear una nueva especialidad médica</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="id">ID</Label>
                <Input id="id" name="id" type="number" placeholder="1" value={formData.id} onChange={handleChange} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="name">Nombre</Label>
                <Input id="name" name="name" placeholder="Cardiología" value={formData.name} onChange={handleChange} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Especialidad dedicada al diagnóstico y tratamiento de enfermedades del corazón"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateSpecialty}>Crear Especialidad</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Especialidades</CardTitle>
          <CardDescription>Administra todas las especialidades médicas registradas en el sistema</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Cargando especialidades...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {specialties.map((specialty) => (
                  <TableRow key={specialty.id}>
                    <TableCell>{specialty.id}</TableCell>
                    <TableCell className="font-medium">{specialty.name}</TableCell>
                    <TableCell>{specialty.description}</TableCell>
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
                          <DropdownMenuItem onClick={() => openEditDialog(specialty)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteSpecialty(specialty.id)}>
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
            <DialogTitle>Editar Especialidad</DialogTitle>
            <DialogDescription>Actualiza la información de la especialidad médica</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Nombre</Label>
              <Input
                id="edit-name"
                name="name"
                placeholder="Cardiología"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Descripción</Label>
              <Textarea
                id="edit-description"
                name="description"
                placeholder="Especialidad dedicada al diagnóstico y tratamiento de enfermedades del corazón"
                value={formData.description}
                onChange={handleChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdateSpecialty}>Guardar Cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
