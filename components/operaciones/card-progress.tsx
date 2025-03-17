"use client"

import { Month, StatiticsData, week } from "@/models/api";
import { CircleIcon } from "lucide-react"

type Data = {
    data: StatiticsData[];
    selectedWeeks: week[];
    selectedMonths: Month[];
    selectedGuardia: string; 
}

export default function CardProgress({ data, selectedWeeks, selectedGuardia, selectedMonths }: Data) {
  if (!data) return null; // Evita errores si data es undefined

  const normalizeMonth = (month: string) => month.slice(0, 3).toLowerCase();

  const monthNumberToName = (monthNumber: string) => {
    const monthMap: { [key: string]: string } = {
      "01": "Jan", "02": "Feb", "03": "Mar", "04": "Apr", "05": "May", "06": "Jun",
      "07": "Jul", "08": "Aug", "09": "Sep", "10": "Oct", "11": "Nov", "12": "Dec"
    };
    return monthMap[monthNumber] || monthNumber;
  };

  const getFilteredData = () => {
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

    // Filter by selected shift (guardia)
    if (selectedGuardia !== "Todo") {
      filteredData = filteredData.filter((item: StatiticsData) => item.Guardia === selectedGuardia);
    }

    return filteredData;
  };

  const filteredData = getFilteredData();

  let executed = 0;
  let programmed = 0;

  // Iterar sobre los datos filtrados y sumar los valores
  for (const item of filteredData) {
    // Asegurarse de que Avance_ejec sea un número, si no, usar 0
    const avanceEjec = typeof item.Avance_ejec === 'number' ? item.Avance_ejec : 0;
    // Asegurarse de que Avance_programado sea un número, si no, usar 0
    const avanceProg = typeof item.Avance_programado === 'number' ? item.Avance_programado : 0;

    executed += avanceEjec;
    programmed += avanceProg;
  }

  // Redondear valores a 1 decimal
  const formattedExecuted = executed.toFixed(1);
  const formattedProgrammed = programmed.toFixed(1);

  // Calcular el porcentaje como promedio de Avance (%) si existe, o fallback al cálculo anterior
  const percentage = filteredData.length === 0 
    ? "0.0"
    : filteredData.some(item => typeof item["Avance (%)"] === 'number')
      ? (filteredData.reduce((sum, item) => sum + (typeof item["Avance (%)"] === 'number' ? item["Avance (%)"] : 0), 0) / filteredData.length * 100).toFixed(1)
      : programmed > 0 ? ((executed / programmed) * 100).toFixed(1) : "0.0";

  return (
    <div className="bg-slate-900 p-6 rounded-lg text-white">
      <div className="flex items-center gap-2 mb-4">
        <CircleIcon className="h-5 w-5 text-purple-500" />
        <span className="text-gray-300 font-medium">Total Ejecutado / Programado {selectedGuardia !== "Todo" ? `(${selectedGuardia})` : ""}</span>
      </div>

      <div className="flex justify-between mb-3">
        <div className="font-semibold">Ejecutado: {formattedExecuted}</div>
        <div className="font-semibold">Programado: {formattedProgrammed}</div>
      </div>

      <div className="relative h-2 w-full bg-slate-800 rounded-full mb-2">
        <div className="absolute top-0 left-0 h-full bg-purple-500 rounded-full" style={{ width: `${percentage}%` }} />
      </div>

      <div className="flex justify-end">
        <span className="text-gray-400">{percentage}%</span>
      </div>
    </div>
  );
}