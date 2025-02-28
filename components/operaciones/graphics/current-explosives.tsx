"use cliente";
import { StatiticsData } from "@/models/api";
import type React from "react"
import {
  Bar,
  BarChart as RechartsBarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

interface BarChartProps {
  data: StatiticsData[]
  layout: "horizontal" | "vertical"
  categories: string[]
  index: string
  valueFormatter?: (value: number) => string
  colors: string[]
  showLegend?: boolean
  showXAxis?: boolean
  showYAxis?: boolean
  showGridLines?: boolean
  startAxisAtZero?: boolean
  className?: string
}

export default function CurrentExplosivesGraphic({
  data,
  layout,
  categories,
  index,
  valueFormatter = (value) => `${value}`,
  colors,
  showLegend = false,
  showXAxis = true,
  showYAxis = true,
  showGridLines = false,
  startAxisAtZero = true,
  className = "",
}: BarChartProps) {
  // For horizontal bars in Recharts, we use layout="vertical" (counterintuitive but that's how it works)
  const isHorizontal = layout === "vertical"

  return (
    <div className={`w-full h-full ${className}`}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart data={data} layout={layout} margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
          {showGridLines && <CartesianGrid strokeDasharray="3 3" horizontal={!isHorizontal} vertical={isHorizontal} />}

          {showXAxis && (
            <XAxis
              type={isHorizontal ? "number" : "category"}
              dataKey={isHorizontal ? undefined : index}
              domain={isHorizontal && startAxisAtZero ? [0, "auto"] : undefined}
              tick={{ fill: "#9ca3af" }}
            />
          )}

          {showYAxis && (
            <YAxis
              type={isHorizontal ? "category" : "number"}
              dataKey={isHorizontal ? index : undefined}
              domain={!isHorizontal && startAxisAtZero ? [0, "auto"] : undefined}
              tick={{ fill: "#9ca3af" }}
              width={100}
            />
          )}

          <Tooltip
            formatter={valueFormatter}
            contentStyle={{ backgroundColor: "#1f2937", border: "none", borderRadius: "0.5rem" }}
            labelStyle={{ color: "#e5e7eb" }}
            itemStyle={{ color: "#e5e7eb" }}
          />

          {showLegend && <Legend />}

          {categories.map((category, i) => (
            <Bar key={category} dataKey={category} fill={colors[i % colors.length]} radius={[0, 4, 4, 0]} />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  )
}

