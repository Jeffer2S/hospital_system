"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { type MedicalCenter, City } from "@/lib/types"
import { getAllMedicalCenters, getMedicalCentersByCity } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Building2, MapPin } from "lucide-react"

export default function MedicalCentersPage() {
  const [centers, setCenters] = useState<MedicalCenter[]>([])
  const [selectedCity, setSelectedCity] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCenters = async () => {
      try {
        setIsLoading(true)
        let data: MedicalCenter[]

        if (selectedCity === "all") {
          data = await getAllMedicalCenters()
        } else {
          data = await getMedicalCentersByCity(selectedCity)
        }

        // Filtrar solo centros activos
        setCenters(data.filter((center) => center.active))
      } catch (error) {
        console.error("Error al cargar centros médicos:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCenters()
  }, [selectedCity])

  const handleCityChange = (value: string) => {
    setSelectedCity(value)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Centros Médicos</h1>
          <p className="text-muted-foreground">Encuentra el centro médico más cercano a tu ubicación</p>
        </div>
        <div className="w-full md:w-auto">
          <Select value={selectedCity} onValueChange={handleCityChange}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Filtrar por ciudad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las ciudades</SelectItem>
              <SelectItem value={City.QUITO}>Quito</SelectItem>
              <SelectItem value={City.GUAYAQUIL}>Guayaquil</SelectItem>
              <SelectItem value={City.CUENCA}>Cuenca</SelectItem>
              <SelectItem value={City.CUENCA}>Latacunga</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <p>Cargando centros médicos...</p>
        </div>
      ) : centers.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {centers.map((center) => (
            <Card key={center.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl">{center.name}</CardTitle>
                <CardDescription className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {center.city}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-start gap-2">
                  <Building2 className="h-4 w-4 mt-1 text-muted-foreground" />
                  <p className="text-sm">{center.address}</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href={`/dashboard/appointments`}>Agendar Cita</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="border border-blue-500 rounded-lg p-4 shadow-md">
  <div className="flex items-center gap-2 mb-4 text-blue-600">
    <span className="text-xl">🏥</span>
    <h3 className="text-lg font-semibold">Centros Médicos</h3>
  </div>

  <p className="text-muted-foreground mt-2 flex items-center gap-2">
    <span className="text-red-500">📍</span>
    Centro Médico Quito Norte - Av. De los Shyris y Portugal - Quito
  </p>
  <p className="text-muted-foreground mt-2 flex items-center gap-2">
    <span className="text-red-500">📍</span>
    Hospital Los Ceibos - Av. del Bombero y Juan Tanca Marengo - Guayaquil
  </p>
  <p className="text-muted-foreground mt-2 flex items-center gap-2">
    <span className="text-red-500">📍</span>
    Centro Médico Cuenca Norte - Av. Remigio Crespo y Av. Solano - Cuenca
  </p>
  <p className="text-muted-foreground mt-2 flex items-center gap-2">
    <span className="text-red-500">📍</span>
    Centro Médico Latacunga - Calle Quito y Av. Unidad Nacional - Latacunga
  </p>
</div>

        </div>
      )}
    </div>
  )
}
