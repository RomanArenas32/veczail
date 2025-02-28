"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MoveUpRight, ArrowUpRight } from 'lucide-react'
import { Month, StatiticsData, week } from "@/models/api"

type Data = {
  selectedMonths: Month[] | [],
  selectedWeeks: week[] | [],
  data: StatiticsData[] | []
}

export default function ProgressOperationGraphic({ data, selectedMonths, selectedWeeks }: Data) {
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

  const getGroupedData = () => {
    if (!data || data.length === 0) {
      return [];
    }

    if (selectedWeeks.length > 0) {
      return selectedWeeks.map(w => {
        const weeklyData = data.filter((item: StatiticsData) => {
          const normalizedItemMonth = normalizeMonth(item["Month Short"]);
          const normalizedSelectedMonth = normalizeMonth(monthNumberToName(w.month));
          const yearMatch = item.Anual === Number(w.year);
          const monthMatch = normalizedItemMonth === normalizedSelectedMonth;
          const weekMatch = item.Semana === w.week;


          return weekMatch && monthMatch && yearMatch;
        });

        const weekData = {
          name: `Sem ${w.week} ${w.month} ${w.year}`,
          Avance_programado: weeklyData.reduce((sum, item) => sum + (item.Avance_programado || 0), 0),
          Avance_ejec: weeklyData.reduce((sum, item) => sum + (item.Avance_ejec || 0), 0),
        };


        return weekData;
      });
    } else if (selectedMonths.length > 0) {
      return selectedMonths.map(m => {
        const monthlyData = data.filter((item: StatiticsData) => {
          const normalizedItemMonth = normalizeMonth(item["Month Short"]);
          const normalizedSelectedMonth = normalizeMonth(monthNumberToName(m.month));
          const yearMatch = item.Anual === Number(m.year);
          const monthMatch = normalizedItemMonth === normalizedSelectedMonth;

          return monthMatch && yearMatch;
        });

        const monthData = {
          name: `${m.month} ${m.year}`,
          Avance_programado: monthlyData.reduce((sum, item) => sum + (item.Avance_programado || 0), 0),
          Avance_ejec: monthlyData.reduce((sum, item) => sum + (item.Avance_ejec || 0), 0),
        };

        return monthData;
      });
    } else {
      const monthsOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      return monthsOrder.map(month => {
        const monthlyData = data.filter((item: StatiticsData) => 
          normalizeMonth(item["Month Short"]) === normalizeMonth(month)
        );
        const monthData = {
          name: month,
          Avance_programado: monthlyData.reduce((sum, item) => sum + (item.Avance_programado || 0), 0),
          Avance_ejec: monthlyData.reduce((sum, item) => sum + (item.Avance_ejec || 0), 0),
        };
  
        return monthData;
      });
    }
  };

  const groupedData = getGroupedData();

  if (!data || data.length === 0) {
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
                dataKey="name"
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
  );
}