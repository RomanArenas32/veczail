"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChartIcon } from "lucide-react";

// Función para agrupar datos y sumar "Kg /tal" por mes con truncado a 2 decimales
const processData = (data: any[]) => {
  const groupedData: Record<string, number> = {};

  data.forEach((item) => {
    const month = item["Month Short"];
    if (!groupedData[month]) {
      groupedData[month] = 0;
    }
    groupedData[month] += item["Kg /tal"] || 0;
  });

  return Object.entries(groupedData).map(([month, totalKg]) => ({
    month,
    totalKg: Math.floor(totalKg * 100) / 100, // Truncar a 2 decimales
  }));
};

export default function TurnDistributionGraphic({ data, selectedGuardia }: { data: any[], selectedGuardia?: string }) {
  const processedData = processData(data);

  // Definir el color de las barras según el turno
  const barColor = selectedGuardia === "Día" ? "#34d399" : "#f0a04b"; // Verde para Día, Naranja para Noche
  const legendText = selectedGuardia === "Día" ? "Día" : "Noche"; // Leyenda dinámica

  return (
    <Card className="w-full bg-[#111827] text-white border-none">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-semibold flex items-center gap-2" style={{ color: barColor }}>
          <BarChartIcon className="h-5 w-5" />
          Distribución por Turnos {selectedGuardia ? `(${selectedGuardia})` : ""}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={processedData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" opacity={0.3} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#9ca3af" }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "#9ca3af" }} domain={[0, "dataMax"]} />
              <Tooltip
                cursor={{ fill: "#2d3748" }}
                contentStyle={{ backgroundColor: "#1a1f2e", borderRadius: "5px", border: "none", color: barColor }}
                formatter={(value: number) => value.toFixed(2)} // Mostrar con 2 decimales en el tooltip
              />
              <Legend wrapperStyle={{ color: barColor }} payload={[{ value: legendText, type: "square", color: barColor }]} />
              <Bar dataKey="totalKg" fill={barColor} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
