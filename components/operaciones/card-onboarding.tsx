"use client"
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Month, StatiticsData, week } from "@/models/api";
import { ArrowUpRight, BarChart3, Users, Package, Timer } from "lucide-react";

interface KPICardProps {
    title: string;
    value: string | number | React.ReactNode;
    icon?: React.ReactNode;
    color?: string;
}

type Data = {
    data: StatiticsData[];
    selectedWeeks: week[];
    selectedMonths: Month[];
    selectedGuardia: string; 
}

export default function CardOnboarding({ data, selectedWeeks, selectedGuardia, selectedMonths }: Data) {
    const normalizeMonth = (month: string) => month.slice(0, 3).toLowerCase();

    const monthNumberToName = (monthNumber: string) => {
        const monthMap: { [key: string]: string } = {
            "01": "Jan", "02": "Feb", "03": "Mar", "04": "Apr",
            "05": "May", "06": "Jun", "07": "Jul", "08": "Aug",
            "09": "Sep", "10": "Oct", "11": "Nov", "12": "Dec"
        };
        return monthMap[monthNumber] || monthNumber;
    };

    const getFilteredData = () => {
        if (!data || data.length === 0) return [];

        const filteredByGuardia = selectedGuardia === 'Todo' 
            ? data 
            : data.filter(item => item.Guardia === selectedGuardia);

        let definitiveFilteredData = filteredByGuardia;

        if (selectedWeeks.length > 0) {
            definitiveFilteredData = filteredByGuardia.filter((item: StatiticsData) => {
                const matches = selectedWeeks.some(w => {
                    const normalizedItemMonth = normalizeMonth(item["Month Short"]);
                    const normalizedSelectedMonth = normalizeMonth(monthNumberToName(w.month));
                    const yearMatch = item.Anual === Number(w.year);
                    const monthMatch = normalizedItemMonth === normalizedSelectedMonth;
                    const weekMatch = item.Semana === w.week;
                    return weekMatch && monthMatch && yearMatch;
                });
                return matches;
            });
        } else if (selectedMonths.length > 0) {
            definitiveFilteredData = filteredByGuardia.filter((item: StatiticsData) => {
                const matches = selectedMonths.some(m => {
                    const normalizedItemMonth = normalizeMonth(item["Month Short"]);
                    const normalizedSelectedMonth = normalizeMonth(monthNumberToName(m.month));
                    const yearMatch = item.Anual === Number(m.year);
                    const monthMatch = normalizedItemMonth === normalizedSelectedMonth;
                    return monthMatch && yearMatch;
                });
                return matches;
            });
        }

        return definitiveFilteredData;
    };

    const filteredData = getFilteredData();

    // Calcular el promedio de Prom_Eficiencia_vol usando reduce
    const promEficienciaVolAvg = filteredData.length === 0 
        ? 0 
        : filteredData.reduce((sum, item) => 
            sum + (typeof item["Prom_Eficiencia_vol"] === 'number' ? item["Prom_Eficiencia_vol"] : 0), 0
        ) / filteredData.length;

    const kpiData = [
        {
            title: "Prom_Eficiencia_vol",
            value: `${(promEficienciaVolAvg * 100).toFixed(1)}%`, // Simplemente formatear el valor decimal como porcentaje
            icon: <BarChart3 className="size-6 text-green-400" />,
            color: "#1d3f4f",
        },
        {
            title: "????????????",
            value: filteredData.length === 0 
                ? "0" 
                : `${(filteredData.reduce((sum, item) => sum + (typeof item["Avance (%)"] === 'number' ? item["Avance (%)"] : 0), 0) / filteredData.length * 100).toFixed(1)}%`,
            icon: <Users className="size-6 text-red-400" />,
            color: "#4f1d3f",
        },
        {
            title: "Kg /Tal",
            value: filteredData.length === 0 
                ? "0" 
                : (filteredData.reduce((sum, item) => sum + (typeof item["Kg /tal"] === 'number' ? item["Kg /tal"] : 0), 0) / filteredData.length).toFixed(2),
            icon: <Package className="size-6 text-pink-400" />,
            color: "#322135",
        },
        {
            title: "F. Avance",
            value: filteredData.length === 0 
                ? "0" 
                : (filteredData.reduce((sum, item) => sum + (typeof item["Prom_F_A"] === 'number' ? item["Prom_F_A"] : 0), 0) / filteredData.length).toFixed(2),
            icon: <Timer className="size-6 text-blue-400" />,
            color: "#2b5531",
        }
    ];

    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:grid-rows-2">
            {kpiData.map((kpi, index) => (
                <KPICard
                    key={index}
                    title={kpi.title}
                    value={kpi.value}
                    icon={kpi.icon}
                    color={kpi.color}
                />
            ))}
        </div>
    );
}

const KPICard = ({ title, value, icon, color }: KPICardProps) => {
    return (
        <Card
            className={cn(
                "p-4 h-[108px] w-full flex flex-col justify-between relative overflow-hidden",
                "group hover:scale-[1.02] hover:-translate-y-0.5 transition-all duration-300",
                "backdrop-blur-xl border-slate-700/30 shadow-xl shadow-slate-900/10"
            )}
            style={{
                background: `linear-gradient(to bottom right, ${color}, rgba(15, 23, 42, 0.5))`,
            }}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-slate-900/5 to-slate-900/20 pointer-events-none" />
            <div className="relative z-10">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                        {icon}
                        <h3 className="text-slate-400 text-sm font-semibold">{title}</h3>
                    </div>
                    <ArrowUpRight className="w-5 h-5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 duration-300" />
                </div>
                <div className={cn(
                    "font-semibold text-slate-100 mt-2 text-2xl",
                    typeof value !== 'string' && typeof value !== 'number' && "!text-base"
                )}>
                    {value}
                </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-500/0 via-slate-500/0 to-slate-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-slate-500/10 to-transparent" />
        </Card>
    );
};