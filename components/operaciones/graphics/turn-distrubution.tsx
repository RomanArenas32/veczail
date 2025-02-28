"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChartIcon } from "lucide-react"

// Función para agrupar datos y sumar "Kg /tal" por mes y turno
const processData = (data: any[]) => {
  // Agrupar por mes
  const groupedData: Record<string, { Día: number; Noche: number }> = {}

  // Inicializar los meses con 0 para ambos turnos
  data.forEach((item) => {
    const month = item["Month Short"]
    if (!groupedData[month]) {
      groupedData[month] = { Día: 0, Noche: 0 }
    }
  })

  // Sumar los valores según el turno
  data.forEach((item) => {
    const month = item["Month Short"]
    const guardia = item.Guardia
    const kgTal = Number.parseFloat(item["Kg /tal"]) || 0 // Asegurar que sea número

    if (guardia === "Día") {
      groupedData[month].Día += kgTal
    } else if (guardia === "Noche") {
      groupedData[month].Noche += kgTal
    }
  })

  // Convertir a formato para el gráfico
  return Object.entries(groupedData).map(([month, values]) => ({
    month,
    Día: Math.round(values.Día * 100) / 100,
    Noche: Math.round(values.Noche * 100) / 100,
  }))
}

export default function TurnDistributionGraphic({ data, selectedGuardia }: { data: any[]; selectedGuardia: string }) {
  const processedData = processData(data)

  // Definir colores para los turnos
  const dayColor = "#34d399" // Verde para Día
  const nightColor = "#f0a04b" // Naranja para Noche

  // Variables para las barras de día y noche
  let dayBar = null
  let nightBar = null

  // Configurar las barras según el filtro seleccionado
  if (selectedGuardia === "Todo" || selectedGuardia === "Día") {
    dayBar = <Bar dataKey="Día" fill={dayColor} radius={[4, 4, 0, 0]} name="Día" />
  }
  if (selectedGuardia === "Todo" || selectedGuardia === "Noche") {
    nightBar = <Bar dataKey="Noche" fill={nightColor} radius={[4, 4, 0, 0]} name="Noche" />
  }

  return (
    <Card className="w-full bg-[#111827] text-white border-none">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-semibold flex items-center gap-2 text-white">
          <BarChartIcon className="h-5 w-5" />
          Distribución por Turnos {selectedGuardia !== "Todo" ? `(${selectedGuardia})` : ""}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={processedData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" opacity={0.3} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#9ca3af" }} dy={10} />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9ca3af" }}
                domain={[0, "auto"]}
                label={{ value: "Kg/tal total", angle: -90, position: "insideLeft", fill: "#9ca3af" }}
              />
              <Tooltip
                cursor={{ fill: "#2d3748" }}
                contentStyle={{ backgroundColor: "#1a1f2e", borderRadius: "5px", border: "none", color: "#ffffff" }}
                formatter={(value: number) => value.toFixed(2)} // Mostrar con 2 decimales en el tooltip
              />
              <Legend wrapperStyle={{ color: "#ffffff" }} />
              {dayBar}
              {nightBar}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

