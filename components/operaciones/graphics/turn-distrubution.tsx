"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChartIcon } from "lucide-react"
import { Month, StatiticsData, week } from "@/models/api"

// Function to group data by month or week-month and sum "Kg /tal" by shift
const processData = (data: StatiticsData[], selectedWeeks: week[]) => {
  const groupedData: Record<string, { Día: number; Noche: number }> = {}

  // If selectedWeeks is provided, group by week and month; otherwise, group by month
  if (selectedWeeks.length > 0) {
    // Initialize groupedData with week-month combinations
    data.forEach((item) => {
      const month = item["Month Short"];
      const week = item.Semana;
      const key = `${month}-${week}`; // e.g., "Jan-S1"
      if (!groupedData[key]) {
        groupedData[key] = { Día: 0, Noche: 0 };
      }
    });

    // Sum values by shift
    data.forEach((item) => {
      const month = item["Month Short"];
      const week = item.Semana;
      const key = `${month}-${week}`;
      const guardia = item.Guardia;
      const kgTal = Number.parseFloat(item["Kg /tal"].toString()) || 0;

      if (guardia === "Día") {
        groupedData[key].Día += kgTal;
      } else if (guardia === "Noche") {
        groupedData[key].Noche += kgTal;
      }
    });

    // Convert to chart format
    return Object.entries(groupedData).map(([key, values]) => ({
      key, // e.g., "Jan-S1"
      Día: Math.round(values.Día * 100) / 100,
      Noche: Math.round(values.Noche * 100) / 100,
    }));
  } else {
    // Original month-based grouping
    data.forEach((item) => {
      const month = item["Month Short"];
      if (!groupedData[month]) {
        groupedData[month] = { Día: 0, Noche: 0 };
      }
    });

    data.forEach((item) => {
      const month = item["Month Short"];
      const guardia = item.Guardia;
      const kgTal = Number.parseFloat(item["Kg /tal"].toString()) || 0;

      if (guardia === "Día") {
        groupedData[month].Día += kgTal;
      } else if (guardia === "Noche") {
        groupedData[month].Noche += kgTal;
      }
    });

    return Object.entries(groupedData).map(([month, values]) => ({
      key: month, // Use "key" instead of "month" for consistency
      Día: Math.round(values.Día * 100) / 100,
      Noche: Math.round(values.Noche * 100) / 100,
    }));
  }
};

type Data = {
  data: StatiticsData[];
  selectedMonths: Month[] | [];
  selectedWeeks: week[] | [];
  selectedGuardia: string;
}

export default function TurnDistributionGraphic({ data, selectedMonths, selectedWeeks, selectedGuardia }: Data) {
  const normalizeMonth = (month: string) => month.slice(0, 3).toLowerCase();

  const monthNumberToName = (monthNumber: string) => {
    const monthMap: { [key: string]: string } = {
      "01": "Jan", "02": "Feb", "03": "Mar", "04": "Apr", "05": "May", "06": "Jun",
      "07": "Jul", "08": "Aug", "09": "Sep", "10": "Oct", "11": "Nov", "12": "Dec"
    };
    return monthMap[monthNumber] || monthNumber;
  };

  const getFilteredData = () => {
    if (!data || data.length === 0) {
      return data;
    }

    let filteredData = data;

    // Filter by selected weeks
    if (selectedWeeks.length > 0) {
      filteredData = filteredData.filter((item: StatiticsData) => {
        return selectedWeeks.some(w => {
          const normalizedItemMonth = normalizeMonth(item["Month Short"]);
          const normalizedSelectedMonth = normalizeMonth(monthNumberToName(w.month));
          const yearMatch = item.Anual === Number(w.year);
          const monthMatch = normalizedItemMonth === normalizedSelectedMonth;
          const weekMatch = item.Semana === w.week;

          return weekMatch && monthMatch && yearMatch;
        });
      });
    }
    // Filter by selected months
    else if (selectedMonths.length > 0) {
      filteredData = filteredData.filter((item: StatiticsData) => {
        return selectedMonths.some(m => {
          const normalizedItemMonth = normalizeMonth(item["Month Short"]);
          const normalizedSelectedMonth = normalizeMonth(monthNumberToName(m.month));
          const yearMatch = item.Anual === Number(m.year);
          const monthMatch = normalizedItemMonth === normalizedSelectedMonth;

          return monthMatch && yearMatch;
        });
      });
    }

    // Filter by selected shift
    if (selectedGuardia !== "Todo") {
      filteredData = filteredData.filter((item: StatiticsData) => item.Guardia === selectedGuardia);
    }

    return filteredData;
  };

  const filteredData = getFilteredData();
  const processedData = processData(filteredData, selectedWeeks);

  const dayColor = "#34d399"; // Green for Day
  const nightColor = "#f0a04b"; // Orange for Night

  let dayBar = null;
  let nightBar = null;

  if (selectedGuardia === "Todo" || selectedGuardia === "Día") {
    dayBar = <Bar dataKey="Día" fill={dayColor} radius={[4, 4, 0, 0]} name="Día" />;
  }
  if (selectedGuardia === "Todo" || selectedGuardia === "Noche") {
    nightBar = <Bar dataKey="Noche" fill={nightColor} radius={[4, 4, 0, 0]} name="Noche" />;
  }

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
          Distribución por Turnos (kg/Tal) {selectedGuardia !== "Todo" ? `(${selectedGuardia})` : ""}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-1 min-w-full">
        <div className="h-[400px] w-full overflow-x-auto">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={processedData} margin={{ top: 20, right: 0, left: 0, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" opacity={0.3} />
              <XAxis dataKey="key" axisLine={false} tickLine={false} tick={{ fill: "#9ca3af" }} dy={10} />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9ca3af" }}
                domain={[0, "auto"]}
              />
              <Tooltip
                cursor={{ fill: "#2d3748" }}
                contentStyle={{ backgroundColor: "#1a1f2e", borderRadius: "5px", border: "none", color: "#ffffff" }}
                formatter={(value: number) => value.toFixed(2)}
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