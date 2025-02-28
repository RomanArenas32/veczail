"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChartIcon } from "lucide-react"
import { Month, StatiticsData, week } from "@/models/api"

// Función para agrupar datos y sumar "Kg /tal" por mes y turno
const processData = (data: StatiticsData[]) => {
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
    const kgTal = Number.parseFloat(item["Kg /tal"].toString()) || 0 

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

type Data = {
  data: StatiticsData[];
  selectedMonths: Month[] | [];
  selectedWeeks: week[] | [];
  selectedGuardia: string;
}

export default function TurnDistributionGraphic({ data, selectedMonths, selectedWeeks, selectedGuardia }: Data) {
  const normalizeMonth = (month: string) => month.slice(0, 3).toLowerCase();

  // Mapeo de números de mes a nombres abreviados
  const monthNumberToName = (monthNumber: string) => {
    const monthMap: { [key: string]: string } = {
      "01": "Jan",
      "02": "Feb",
      "03": "Mar",
      "04": "Apr",
      "05": "May",
      "06": "Jun",
      "07": "Jul",
      "08": "Aug",
      "09": "Sep",
      "10": "Oct",
      "11": "Nov",
      "12": "Dec"
    };
    return monthMap[monthNumber] || monthNumber; // Fallback al valor original si no hay coincidencia
  };

  console.log("Datos de entrada (data):", data);
  console.log("Semanas seleccionadas:", selectedWeeks);
  console.log("Meses seleccionados:", selectedMonths);
  console.log("Guardia seleccionada:", selectedGuardia);

  const getFilteredData = () => {
    if (!data || data.length === 0) {
      console.log("No hay datos disponibles para procesar.");
      return data;
    }

    let filteredData = data;

    // Filtrar por semanas seleccionadas
    if (selectedWeeks.length > 0) {
      filteredData = filteredData.filter((item: StatiticsData) => {
        return selectedWeeks.some(w => {
          const normalizedItemMonth = normalizeMonth(item["Month Short"]);
          const normalizedSelectedMonth = normalizeMonth(monthNumberToName(w.month));
          const yearMatch = item.Anual === Number(w.year);
          const monthMatch = normalizedItemMonth === normalizedSelectedMonth;
          const weekMatch = item.Semana === w.week;

          console.log(`Filtro semana - Comparando: item["Month Short"]=${item["Month Short"]} (normalized: ${normalizedItemMonth}) vs w.month=${w.month} (mapped: ${monthNumberToName(w.month)}, normalized: ${normalizedSelectedMonth})`);
          console.log(`Filtro semana - Comparando: item.Semana=${item.Semana} vs w.week=${w.week}`);
          console.log(`Filtro semana - Comparando: item.Anual=${item.Anual} vs w.year=${w.year} (Number: ${Number(w.year)})`);
          console.log(`Filtro semana - Resultado: weekMatch=${weekMatch}, monthMatch=${monthMatch}, yearMatch=${yearMatch}`);

          return weekMatch && monthMatch && yearMatch;
        });
      });
    }
    // Filtrar por meses seleccionados
    else if (selectedMonths.length > 0) {
      filteredData = filteredData.filter((item: StatiticsData) => {
        return selectedMonths.some(m => {
          const normalizedItemMonth = normalizeMonth(item["Month Short"]);
          const normalizedSelectedMonth = normalizeMonth(monthNumberToName(m.month));
          const yearMatch = item.Anual === Number(m.year);
          const monthMatch = normalizedItemMonth === normalizedSelectedMonth;

          console.log(`Filtro mes - Comparando: item["Month Short"]=${item["Month Short"]} (normalized: ${normalizedItemMonth}) vs m.month=${m.month} (mapped: ${monthNumberToName(m.month)}, normalized: ${normalizedSelectedMonth})`);
          console.log(`Filtro mes - Comparando: item.Anual=${item.Anual} vs m.year=${m.year} (Number: ${Number(m.year)})`);
          console.log(`Filtro mes - Resultado: monthMatch=${monthMatch}, yearMatch=${yearMatch}`);

          return monthMatch && yearMatch;
        });
      });
    }

    // Filtrar por guardia seleccionada
    if (selectedGuardia !== "Todo") {
      filteredData = filteredData.filter((item: StatiticsData) => item.Guardia === selectedGuardia);
      console.log(`Datos filtrados por guardia (${selectedGuardia}):`, filteredData);
    }

    return filteredData;
  };

  const filteredData = getFilteredData();
  const processedData = processData(filteredData);

  console.log("Datos procesados:", processedData);

  // Definir colores para los turnos
  const dayColor = "#34d399" // Verde para Día
  const nightColor = "#f0a04b" // Naranja para Noche

  // Variables para las barras de día y noche
  let dayBar = null;
  let nightBar = null;

  // Configurar las barras según el filtro seleccionado
  if (selectedGuardia === "Todo" || selectedGuardia === "Día") {
    dayBar = <Bar dataKey="Día" fill={dayColor} radius={[4, 4, 0, 0]} name="Día" />;
  }
  if (selectedGuardia === "Todo" || selectedGuardia === "Noche") {
    nightBar = <Bar dataKey="Noche" fill={nightColor} radius={[4, 4, 0, 0]} name="Noche" />;
  }

  // Si no hay datos procesados, mostrar un mensaje
  if (processedData.length === 0) {
    return (
      <Card className="w-full bg-[#111827] text-white border-none">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl font-semibold flex items-center gap-2 text-white">
            <BarChartIcon className="h-5 w-5" />
            Distribución por Turnos {selectedGuardia !== "Todo" ? `(${selectedGuardia})` : ""}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] flex items-center justify-center">
            <p className="text-gray-400">No hay datos disponibles para mostrar.</p>
          </div>
        </CardContent>
      </Card>
    );
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
  );
}