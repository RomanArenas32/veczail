import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { Hammer, ExternalLink } from 'lucide-react';


const getBarColor = (index: number) => {
  const colors = [
    "#f97316", // orange-500
    "#f59e0b", // amber-500
    "#ea580c", // orange-600
    "#d97706", // amber-600
    "#f97316", // orange-500
    "#f59e0b", // amber-500
  ];
  return colors[index % colors.length];
};

export default function CurrentSteelsGraphic({data}: {data: any[]}) {
  return (
    <div className="rounded-xl bg-[#0f172a] p-6 text-white shadow-lg">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Hammer className="h-5 w-5 text-emerald-400" />
          <h2 className="text-xl font-medium text-emerald-400">
            Actual Aceros (Noche)
          </h2>
        </div>
        <ExternalLink className="h-5 w-5 text-gray-400" />
      </div>

      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid horizontal={false} stroke="#334155" strokeDasharray="3 3" />
            <XAxis
              type="number"
              domain={[0, 185]}
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
            {data.map((entry, index) => (
              <Bar
                key={`bar-${index}`}
                dataKey="value"
                fill={getBarColor(index)}
                background={{ fill: "transparent" }}
                radius={[0, 4, 4, 0]}
                data={[entry]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
