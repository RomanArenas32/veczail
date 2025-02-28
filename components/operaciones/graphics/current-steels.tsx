import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip, // Added Tooltip import
} from "recharts";
import { Hammer, ExternalLink } from 'lucide-react';
import { Card } from "@/components/ui/card";

const relevantFields = [
  "Cordon detonante 5P",
  "Cuadro resumen B.C3",
  "Cuadro resumen B.C4",
  "Cuadro resumen B.C5",
  "Cuadro resumen B.C6",
  "Cuadro resumen B.C8",
  "Cuadro resumen B.I3",
  "Cuadro resumen B.I4",
  "Cuadro resumen B.I5",
  "Cuadro resumen B.I6",
  "Cuadro resumen BROCAS 38"
];

export default function CurrentSteelsGraphic({data}: {data: any[]}) {
  // Process the data to sum the relevant fields and filter out zeros
  const processedData = relevantFields
    .map((field) => {
      const sum = data.reduce((acc, curr) => acc + (curr[field] || 0), 0);
      return {
        name: field,
        value: sum
      };
    })
    .filter(item => item.value > 0);

  return (
    <Card className="w-full bg-[#111827] text-white border-none p-4">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Hammer className="h-5 w-5 text-[#FFA500]" />
          <h2 className="text-xl font-medium text-[#FFA500]">
            Actual Aceros
          </h2>
        </div>
        <ExternalLink className="h-5 w-5 text-gray-400" />
      </div>

      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={processedData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
          >
            <CartesianGrid horizontal={false} stroke="#334155" strokeDasharray="3 3" />
            <XAxis
              type="number"
              domain={[0, 'dataMax']}
              tickCount={5}
              tick={{ fill: "#94a3b8" }}
              axisLine={{ stroke: "#334155" }}
              tickLine={{ stroke: "#334155" }}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={120}
              tick={{ fill: "#94a3b8" }}
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