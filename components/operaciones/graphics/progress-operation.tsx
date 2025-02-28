"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MoveUpRight, ArrowUpRight } from 'lucide-react'

export default function ProgressOperationGraphic({ data }: { data: any }) {
  
  // Lista de meses de enero a diciembre en formato corto
  const monthsOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // Agrupar y sumar los datos por mes
  const groupedData = monthsOrder.map((month) => {
    const monthlyData = data.filter((item: any) => item["Month Short"] === month);
    
    return {
      "Month Short": month,
      Avance_programado: monthlyData.reduce((sum: number, item: any) => sum + (item.Avance_programado || 0), 0),
      Avance_ejec: monthlyData.reduce((sum: number, item: any) => sum + (item.Avance_ejec || 0), 0),
    };
  });

  return (
    <Card className="w-full bg-[#111827] text-white border-none">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <MoveUpRight className="h-5 w-5 text-purple-400" />
          <CardTitle className="text-xl font-medium text-purple-400">Progreso Operaciones</CardTitle>
        </div>
        <ArrowUpRight className="h-5 w-5 text-gray-400" />
      </CardHeader>
      <CardContent>
        <div className="h-[400px] p-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={groupedData}
              margin={{
                top: 20,
                right: 5,
                left: 5,
                bottom: 50,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
              <XAxis 
                dataKey="Month Short" 
                stroke="#666" 
                tick={{ fill: "#999" }} 
                axisLine={{ stroke: "#333" }} 
              />
              
              <YAxis
                stroke="#666"
                tick={{ fill: "#999" }}
                axisLine={{ stroke: "#333" }}
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "none",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                formatter={(value) => (
                  <span style={{ color: value === "Avance_programado" ? "#4ade80" : "#fbbf24" }}>
                    {value === "Avance_programado" ? "Programado" : "Ejecutado"}
                  </span>
                )}
              />
              
              <Line
                type="monotone"
                dataKey="Avance_programado"
                stroke="#4ade80"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="Avance_ejec"
                stroke="#fbbf24"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
