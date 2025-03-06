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
import { Hammer, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Month, StatiticsData, week } from "@/models/api";

const relevantFields = [
  "Cuadro resumen B.C3",
  "Cuadro resumen B.C4",
  "Cuadro resumen B.C5",
  "Cuadro resumen B.C6",
  "Cuadro resumen B.C8",
  "Cuadro resumen B.I3",
  "Cuadro resumen B.I4",
  "Cuadro resumen B.I5",
  "Cuadro resumen B.I6",
  "Cuadro resumen BROCAS 38",
];

type Data = {
  selectedMonths: Month[] | [];
  selectedWeeks: week[] | [];
  data: any[] | [];
};

export default function CurrentSteelsGraphic({ data, selectedMonths, selectedWeeks }: Data) {
  const normalizeMonth = (month: string) => month.slice(0, 3).toLowerCase();

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
      "12": "Dec",
    };
    return monthMap[monthNumber] || monthNumber;
  };

  const getFilteredData = () => {
    if (!data || data.length === 0) {
      return data;
    }

    if (selectedWeeks.length > 0) {
      return data.filter((item: StatiticsData) => {
        return selectedWeeks.some((w) => {
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
        return selectedMonths.some((m) => {
          const normalizedItemMonth = normalizeMonth(item["Month Short"]);
          const normalizedSelectedMonth = normalizeMonth(monthNumberToName(m.month));
          const yearMatch = item.Anual === Number(m.year);
          const monthMatch = normalizedItemMonth === normalizedSelectedMonth;

          return monthMatch && yearMatch;
        });
      });
    }
    return data;
  };

  const filteredData = getFilteredData();

  const processedData = relevantFields
    .map((field) => {
      const sum = filteredData.reduce((acc, curr) => acc + (curr[field] || 0), 0);
      return {
        name: field,
        value: sum,
      };
    })
    .filter((item) => item.value > 0);

  // Determine if the screen is small (e.g., mobile)
  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;

  if (processedData.length === 0) {
    return (
      <Card className="w-full bg-[#111827] text-white border-none p-4">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Hammer className="h-5 w-5 text-[#FFA500]" />
            <h2 className="text-xl font-medium text-[#FFA500]">Actual Aceros</h2>
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
          <h2 className="text-xl font-medium text-[#FFA500]">Actual Aceros</h2>
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
              right: isMobile ? 10 : 20, // Reduce right margin on mobile
              left: isMobile ? 60 : 20, // Reduce left margin on mobile
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
              domain={[0, "dataMax"]}
              tickCount={5}
              tick={{ fill: "#94a3b8", fontSize: isMobile ? 10 : 12 }} // Smaller font on mobile
              axisLine={{ stroke: "#334155" }}
              tickLine={{ stroke: "#334155" }}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={isMobile ? 6 : 120} // Reduce Y-axis width on mobile
              tick={{ fill: "#94a3b8", fontSize: isMobile ? 10 : 12 }} // Smaller font on mobile
              axisLine={{ stroke: "#334155" }}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1e293b",
                border: "none",
                borderRadius: "4px",
                color: "#fff",
              }}
              cursor={{ fill: "rgba(255, 255, 255, 0.1)" }}
            />
            <Bar
              dataKey="value"
              fill="#FFA500"
              background={{ fill: "transparent" }}
              radius={[0, 4, 4, 0]}
              barSize={isMobile ? 15 : 20} // Smaller bars on mobile
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}