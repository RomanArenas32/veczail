"use client";

import { getAllData } from "@/action/data";
import Navbar from "@/components/navbar/navbar";
import CardOnboarding from "@/components/operaciones/card-onboarding";
import CardProgress from "@/components/operaciones/card-progress";
import CurrentExplosivesGraphic from "@/components/operaciones/graphics/current-explosives";
import CurrentSteelsGraphic from "@/components/operaciones/graphics/current-steels";
import ProgressOperationGraphic from "@/components/operaciones/graphics/progress-operation";
import TurnDistrubutionGraphic from "@/components/operaciones/graphics/turn-distrubution";
import { Button } from "@/components/ui/button";
import { StatiticsData } from "@/models/api";
import { Calendar, Check, Moon, Sun } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";


const months = [
    { name: "Jan", value: "01" },
    { name: "Feb", value: "02" },
    { name: "Mar", value: "03" },
    { name: "Apr", value: "04" },
    { name: "May", value: "05" },
    { name: "Jun", value: "06" },
    { name: "Jul", value: "07" },
    { name: "Aug", value: "08" },
    { name: "Sep", value: "09" },
    { name: "Oct", value: "10" },
    { name: "Nov", value: "11" },
    { name: "Dec", value: "12" }
];

export default function Operaciones() {
    const [data, setData] = useState<StatiticsData[]>([]);
    const [activePeriod, setActivePeriod] = useState<"Mes" | "Semana">("Mes");
    const [selectedGuardia, setSelectedGuardia] = useState<"Día" | "Noche">("Día");
    const [selectedMonths, setSelectedMonths] = useState<{ month: string; year: string }[]>([]);
    const [popoverOpen, setPopoverOpen] = useState(false);


    
    const fetchData = useCallback(async () => {
        try {
            const response = await getAllData();
            setData(response);
        } catch (error) {
            console.error("Error al obtener los datos:", error);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const toggleMonthSelection = (month: string, year: string) => {
        setSelectedMonths(prev => {
            const exists = prev.some(m => m.month === month && m.year === year);
            return exists ? prev.filter(m => !(m.month === month && m.year === year)) : [...prev, { month, year }];
        });
    };

    const currentYear = new Date().getFullYear();
    const years = [currentYear, currentYear - 1];


    return (
        <div className="flex flex-col gap-4 p-4 pb-[100px]">
            <div className="w-auto flex flex-col gap-4 py-4">
                <Navbar />
                <div className="inline-flex p-1.5 bg-slate-800/50 backdrop-blur-sm rounded-lg gap-1 max-w-fit-content">
                    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="ghost"
                                className={`px-4 py-2 transition-all duration-300 gap-2 ${activePeriod === "Mes" ? "bg-[#7E69AB]/20 text-[#7E69AB]" : "text-slate-400"
                                    }`}
                                onClick={() => setActivePeriod("Mes")}
                            >
                                <Calendar className="w-4 h-4" />
                                {selectedMonths.length > 0
                                    ? (() => {
                                        const text = selectedMonths.map(m => `${m.month}/${m.year}`).join(", ");
                                        return text.length > 10 ? text.slice(0, 10) + "..." : text;
                                    })()
                                    : "Mes"}
                            </Button>
                        </PopoverTrigger>

                        <PopoverContent className="w-60 bg-slate-900 p-2 rounded-md shadow-md text-slate-100 font-semibold">
                            {years.map(year => (
                                <div key={year} className="border-b border-slate-700 last:border-none pb-2 mb-2 last:pb-0 last:mb-0">
                                    <p className="text-sm text-slate-400 mb-1">{year}</p>
                                    {months.map(({ name, value }) => (
                                        <button
                                            key={value}
                                            className={`flex items-center justify-between w-full text-left text-sm px-2 py-1 rounded-md hover:bg-slate-700 ${selectedMonths.some(m => m.month === value && m.year === year.toString()) ? "bg-slate-700" : ""
                                                }`}
                                            onClick={() => toggleMonthSelection(value, year.toString())}
                                        >
                                            {name}
                                            {selectedMonths.some(m => m.month === value && m.year === year.toString()) && (
                                                <Check className="w-4 h-4 text-green-400" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            ))}
                        </PopoverContent>
                    </Popover>

                    <Button
                        variant="ghost"
                        className={`px-4 py-2 transition-all duration-300 gap-2 ${activePeriod === "Semana" ? "bg-[#0EA5E9]/20 text-[#0EA5E9]" : "text-slate-400"
                            }`}
                        onClick={() => setActivePeriod("Semana")}
                    >
                        <Calendar className="w-4 h-4" />
                        Semana
                    </Button>

                    <Button
                        variant="ghost"
                        className={`px-4 py-2 transition-all duration-300 gap-2 ${selectedGuardia === "Día" ? "bg-[#F97316]/20 text-[#F97316]" : "text-slate-400"
                            }`}
                        onClick={() => setSelectedGuardia("Día")}
                    >
                        <Sun className="w-4 h-4" />
                        Día
                    </Button>

                    <Button
                        className={`px-4 py-2 transition-all duration-300 gap-2 ${selectedGuardia === "Noche" ? "bg-[#1A1F2C]/50 text-slate-300" : "text-slate-400"
                            }`}
                        onClick={() => setSelectedGuardia("Noche")}
                    >
                        <Moon className="w-4 h-4" />
                        Noche
                    </Button>
                </div>
            </div>

            <CardProgress selectedGuardia={selectedGuardia} data={data} />
            <CardOnboarding data={data} />

            <div className="flex flex-col gap-4 md:grid md:grid-cols-2">
                <ProgressOperationGraphic data={data} />
                <TurnDistrubutionGraphic data={data} selectedGuardia={selectedGuardia} />
                {/* ESTA BASADO EN: EJE X: CANTIDAD  en el y va: "Cordon detonante 5P": 0,
                "Cuadro resumen B.C3": 0,
                "Cuadro resumen B.C4": 0,
                "Cuadro resumen B.C5": 0,
                "Cuadro resumen B.C6": 0,
                "Cuadro resumen B.C8": 0,
                "Cuadro resumen B.I3": 0,
                "Cuadro resumen B.I4": 0,
                "Cuadro resumen B.I5": 0,
                "Cuadro resumen B.I6": 0,
                "Cuadro resumen BROCAS 38": 0*/}
                <CurrentSteelsGraphic data={data} />

                {/*el eje Y es: "CRE E1000 1x12": 0,
                "CRE E3000 1x12": 0,
                "CRE E5000 1x12": 0,
                "E3000 1 14\"X24\"": 0,
                "E5000 1 14\"X12\"": 0,
                "E1000 1 14\"X24\"": 0,
                "E1000 1 14\"X16\"": 0,
                "E1000 \"1x7\"": 0,
                "E3000 \"1x8\"": 0,
                "E5000 78": 0,
                "CRE Carmex \"1 x 5\"": 0,
                "CRE Carmex \"1 x 8\"": 0,
                "CRE Carmex \"2 x 1\"": 0,
                "CRE Carmex \"2 x 40\"": 0,
                "CRE Carmex \"3 x 60\"": 0,
                "CRE Carmex \"4 x 50\"": 0,
                "Carmex Blanca \"1X5\"": 0,
                "CRE Mecha Rapida": 0,
                "FANEL LARGO LP 3.60": 0,
                "FANEL CORTO MS 4.0": 0,
                "FANEL LARGO 4.2": 0,
                "Mukinel  LP Largo 4.20": 0,
                "Cordon detonante 5P": 0 , EN EL EJE X VA LA CANTIDAD*/}
                <CurrentExplosivesGraphic data={data} layout={"vertical"} categories={[]} index={""} colors={[]} />
            </div>
        </div>
    );
}
