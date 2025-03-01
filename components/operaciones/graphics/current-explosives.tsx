"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Hammer, ExternalLink } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Month, StatiticsData, week } from "@/models/api";

const relevantFields = [
  "CRE E3000 1x12",
  "CRE E5000 1x12",
  "E3000 1 14\"X24\"",
  "E5000 1 14\"X12\"",
  "E1000 1 14\"X24\"",
  "E1000 1 14\"X16\"",
  "E1000 \"1x7\"",
  "E3000 \"1x8\"",
  "E5000 78",
  "CRE Carmex \"1 x 5\"",
  "CRE Carmex \"1 x 8\"",
  "CRE Carmex \"2 x 1\"",
  "CRE Carmex \"2 x 40\"",
  "CRE Carmex \"3 x 60\"",
  "CRE Carmex \"4 x 50\"",
  "Carmex Blanca \"1X5\"",
  "CRE Mecha Rapida",
  "FANEL LARGO LP 3.60",
  "FANEL CORTO MS 4.0",
  "FANEL LARGO 4.2",
  "Mukinel  LP Largo 4.20",
  "Cordon detonante 5P"
];

type Data = {
  selectedMonths: Month[] | [],
  selectedWeeks: week[] | [],
  data: any[] | []
}

export default function CurrentExplosivesGraphic({ data, selectedMonths, selectedWeeks }: Data) {
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


  const getFilteredData = () => {
    if (!data || data.length === 0) {
      return data;
    }

    if (selectedWeeks.length > 0) {
      return data.filter((item: StatiticsData) => {
        return selectedWeeks.some(w => {
          const normalizedItemMonth = normalizeMonth(item["Month Short"]);
          const normalizedSelectedMonth = normalizeMonth(monthNumberToName(w.month));
          const yearMatch = item.Anual === Number(w.year);
          const monthMatch = normalizedItemMonth === normalizedSelectedMonth;
          const weekMatch = item.Semana === w.week;


          return weekMatch && monthMatch && yearMatch;
        });
      });
    } else if (selectedMonths.length > 0) {
      return data.filter((item: StatiticsData) => {
        return selectedMonths.some(m => {
          const normalizedItemMonth = normalizeMonth(item["Month Short"]);
          const normalizedSelectedMonth = normalizeMonth(monthNumberToName(m.month));
          const yearMatch = item.Anual === Number(m.year);
          const monthMatch = normalizedItemMonth === normalizedSelectedMonth;

          return monthMatch && yearMatch;
        });
      });
    }
    return data; // Si no hay filtros, devolver todos los datos
  };

  const filteredData = getFilteredData();

  // Process the data to sum the relevant fields and filter out zeros
  const processedData = relevantFields
    .map((field) => {
      const sum = filteredData.reduce((acc, curr) => acc + (curr[field] || 0), 0);
      return {
        name: field,
        value: sum
      };
    })
    .filter(item => item.value > 0);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;


  // Si no hay datos procesados, mostrar un mensaje
  if (processedData.length === 0) {
    return (
      <Card className="w-full bg-[#111827] text-white border-none p-4">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Hammer className="h-5 w-5 text-[#FFA500]" />
            <h2 className="text-xl font-medium text-[#FFA500]">
              Actual Explosivos
            </h2>
          </div>
          <ExternalLink className="h-5 w-5 text-gray-400" />
        </div>
        <div className="h-[400px] flex items-center justify-center">
          <p className="text-gray-400">No hay datos disponibles para mostrar.</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-full bg-[#111827] text-white border-none p-4">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Hammer className="h-5 w-5 text-[#FFA500]" />
          <h2 className="text-xl font-medium text-[#FFA500]">
            Actual Explosivos
          </h2>
        </div>
        <ExternalLink className="h-5 w-5 text-gray-400" />
      </div>

      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={processedData}
            layout="vertical"
            margin={{
              top: 5,
              right: isMobile ? 10 : 30, // Reduce right margin on mobile
              left: isMobile ? 80 : 120, // Reduce left margin on mobile
              bottom: 5,
            }}
          >
            <CartesianGrid
              horizontal={false}
              stroke="#334155"
              strokeDasharray="3 3"
            />
            <XAxis
              type="number"
              domain={[0, 'dataMax']}
              tickCount={5}
              tick={{ fill: "#94a3b8", fontSize: isMobile ? 10 : 12 }}
              axisLine={{ stroke: "#334155" }}
              tickLine={{ stroke: "#334155" }}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={isMobile ? 6 : 120}
              tick={{ fill: "#94a3b8", fontSize: isMobile ? 10 : 12 }}
              axisLine={{ stroke: "#334155" }}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: 'none',
                borderRadius: '4px',
                color: '#fff'
              }}
              cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}
            />
            <Bar
              dataKey="value"
              fill="#FFA500"
              background={{ fill: "transparent" }}
              radius={[0, 4, 4, 0]}
              barSize={20}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}