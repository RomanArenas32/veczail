"use client"

import { StatiticsData } from "@/models/api";
import { CircleIcon } from "lucide-react"

export default function CardProgress({ selectedGuardia, data }: { selectedGuardia?: string, data: StatiticsData[] }) {
  if (!data) return null; // Evita errores si data es undefined

  // Filtrar datos según la guardia seleccionada o traer todos si es "Todo" o no hay filtro
  const filteredData = selectedGuardia && selectedGuardia !== "Todo"
    ? data.filter(item => item.Guardia === selectedGuardia)
    : data;

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

  // Calcular el porcentaje y redondearlo a 1 decimal
  const percentage = programmed > 0 ? ((executed / programmed) * 100).toFixed(1) : "0.0";

  return (
    <div className="bg-slate-900 p-6 rounded-lg text-white">
      <div className="flex items-center gap-2 mb-4">
        <CircleIcon className="h-5 w-5 text-purple-500" />
        <span className="text-gray-300 font-medium">Total Ejecutado / Programado {`(${selectedGuardia})`}</span>
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