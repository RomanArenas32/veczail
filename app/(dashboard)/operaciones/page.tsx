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
import { Month, StatiticsData, week } from "@/models/api";
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
    const [guardiaSelection, setGuardiaSelection] = useState<{ Día: boolean; Noche: boolean }>({ Día: false, Noche: false });
    const [selectedMonths, setSelectedMonths] = useState<Month[]>([]);
    const [selectedWeeks, setSelectedWeeks] = useState<week[]>([]);
    const [monthPopoverOpen, setMonthPopoverOpen] = useState(false);
    const [weekPopoverOpen, setWeekPopoverOpen] = useState(false);



    const fetchData = useCallback(async () => {
        try {
            const response = await getAllData();
            setData(response);
        } catch (error) {
            console.error("Error al obtener los datos:", error);
        }
    }, []);

    const getAvailableMonthsByYear = useCallback(() => {
        const yearMonthMap: { [key: string]: Set<string> } = {};
        
        data.forEach(item => {
            const year = item.Anual?.toString();
            const monthShort = item["Month Short"];
            
            if (year && monthShort) {
                if (!yearMonthMap[year]) {
                    yearMonthMap[year] = new Set();
                }
                yearMonthMap[year].add(monthShort);
            }
        });

        return yearMonthMap;
    }, [data]);

    const getAvailableWeeksByMonthAndYear = useCallback(() => {
        const yearMonthWeekMap: { [key: string]: { [key: string]: Set<string> } } = {};
        
        data.forEach(item => {
            const year = item.Anual?.toString();
            const monthShort = item["Month Short"];
            const week = item.Semana;
            
            if (year && monthShort && week) {
                if (!yearMonthWeekMap[year]) {
                    yearMonthWeekMap[year] = {};
                }
                if (!yearMonthWeekMap[year][monthShort]) {
                    yearMonthWeekMap[year][monthShort] = new Set();
                }
                yearMonthWeekMap[year][monthShort].add(week);
            }
        });

        return yearMonthWeekMap;
    }, [data]);

    const getMonthValue = (monthShort: string) => {
        const month = months.find(m => m.name === monthShort);
        return month?.value || "";
    };

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const toggleMonthSelection = (month: string, year: string) => {
        setSelectedMonths(prev => {
            const exists = prev.some(m => m.month === month && m.year === year);
            return exists ? prev.filter(m => !(m.month === month && m.year === year)) : [...prev, { month, year }];
        });
        // Al seleccionar un mes, limpiar las semanas seleccionadas
        setSelectedWeeks([]);
    };

    const toggleWeekSelection = (week: string, month: string, year: string) => {
        setSelectedWeeks(prev => {
            const exists = prev.some(w => w.week === week && w.month === month && w.year === year);
            return exists 
                ? prev.filter(w => !(w.week === week && w.month === month && w.year === year)) 
                : [...prev, { week, month, year }];
        });
        // Al seleccionar una semana, limpiar los meses seleccionados
        setSelectedMonths([]);
    };

    const handleSetActivePeriod = (period: "Mes" | "Semana") => {
        setActivePeriod(period);
        if (period === "Mes") {
            setSelectedWeeks([]); // Limpia semanas al cambiar a Mes
        } else {
            setSelectedMonths([]); // Limpia meses al cambiar a Semana
        }
    };

    const toggleGuardia = (guardia: "Día" | "Noche") => {
        setGuardiaSelection(prev => ({
            ...prev,
            [guardia]: !prev[guardia],
        }));
    };

    const effectiveGuardia = guardiaSelection.Día && guardiaSelection.Noche 
        ? "Todo" 
        : guardiaSelection.Día 
        ? "Día" 
        : guardiaSelection.Noche 
        ? "Noche" 
        : "Todo";

    const currentYear = new Date().getFullYear();
    const years = [currentYear, currentYear - 1];

    return (
        <div className="flex flex-col gap-4 p-4 pb-[100px]">
            <div className="w-auto flex flex-col gap-4 py-4">
                <Navbar />
                <div className="inline-flex p-1.5 bg-slate-800/50 backdrop-blur-sm rounded-lg gap-1 max-w-fit-content">
                    <Popover open={monthPopoverOpen} onOpenChange={setMonthPopoverOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="ghost"
                                className={`px-4 py-2 transition-all duration-300 gap-2 ${activePeriod === "Mes" ? "bg-[#7E69AB]/20 text-[#7E69AB]" : "text-slate-400"}`}
                                onClick={() => handleSetActivePeriod("Mes")}
                            >
                                <Calendar className="w-4 h-4" />
                                {selectedMonths.length > 0
                                    ? (() => {
                                          const text = selectedMonths.map(m => `${m.month}/${m.year}`).join(", ");
                                          return text.length > 10 ? text.slice(0, 5) + "..." : text;
                                      })()
                                    : "Mes"}
                            </Button>
                        </PopoverTrigger>

                        <PopoverContent className="w-80 bg-slate-900 p-4 rounded-md shadow-md text-slate-100 font-semibold">
                            <p className="w-full text-end text-sm text-slate-100 underline hover:cursor-pointer" onClick={() => setSelectedMonths([])}>Limpiar</p>
                            {years.map(year => {
                                const availableMonths = getAvailableMonthsByYear()[year.toString()];
                                if (!availableMonths || availableMonths.size === 0) return null;

                                const monthArray = Array.from(availableMonths);
                                const monthGroups = [];
                                for (let i = 0; i < monthArray.length; i += 4) {
                                    monthGroups.push(monthArray.slice(i, i + 4));
                                }

                                return (
                                    <div key={year} className="border-b border-slate-700 last:border-none pb-4 mb-4 last:pb-0 last:mb-0">
                                        <p className="text-sm text-slate-400 mb-2">{year}</p>
                                        <div className="grid grid-cols-4 gap-2">
                                            {monthGroups.map((group) => (
                                                group.map((monthShort) => {
                                                    const monthValue = getMonthValue(monthShort);
                                                    const isSelected = selectedMonths.some(
                                                        m => m.month === monthValue && m.year === year.toString()
                                                    );

                                                    return (
                                                        <button
                                                            key={`${year}-${monthShort}`}
                                                            className={`flex items-center justify-center w-full text-left text-sm px-2 py-1 rounded-md hover:bg-slate-700 ${isSelected ? "bg-slate-700" : ""}`}
                                                            onClick={() => toggleMonthSelection(monthValue, year.toString())}
                                                        >
                                                            <span>{monthShort}</span>
                                                            {isSelected && (
                                                                <Check className="w-4 h-4 text-green-400 ml-1" />
                                                            )}
                                                        </button>
                                                    );
                                                })
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </PopoverContent>
                    </Popover>

                    <Popover open={weekPopoverOpen} onOpenChange={setWeekPopoverOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="ghost"
                                className={`px-4 py-2 transition-all duration-300 gap-2 ${activePeriod === "Semana" ? "bg-[#0EA5E9]/20 text-[#0EA5E9]" : "text-slate-400"}`}
                                onClick={() => handleSetActivePeriod("Semana")}
                            >
                                <Calendar className="w-4 h-4" />
                                {selectedWeeks.length > 0
                                    ? (() => {
                                          const text = selectedWeeks.map(w => `${w.week} ${w.month}/${w.year}`).join(", ");
                                          return text.length > 10 ? text.slice(0, 5) + "..." : text;
                                      })()
                                    : "Semana"}
                            </Button>
                        </PopoverTrigger>

                        <PopoverContent className="w-80 bg-slate-900 p-4 rounded-md shadow-md text-slate-100 font-semibold max-h-[300px] overflow-y-auto">
                            <p className="w-full text-end text-sm text-slate-100 underline hover:cursor-pointer" onClick={() => setSelectedWeeks([])}>Limpiar</p>

                            {years.map(year => {
                                const availableMonths = getAvailableWeeksByMonthAndYear()[year.toString()];
                                if (!availableMonths) return null;

                                return (
                                    <div key={year} className="border-b border-slate-700 last:border-none pb-4 mb-4 last:pb-0 last:mb-0">
                                        <p className="text-sm text-slate-400 mb-2">{year}</p>
                                        {Object.entries(availableMonths).map(([monthShort, weeks]) => {
                                            const weekArray = Array.from(weeks);
                                            return (
                                                <div key={`${year}-${monthShort}`} className="mb-2">
                                                    <p className="text-xs text-slate-500 mb-1">{monthShort}</p>
                                                    <div className="grid grid-cols-4 gap-2">
                                                        {weekArray.map(week => {
                                                            const monthValue = getMonthValue(monthShort);
                                                            const isSelected = selectedWeeks.some(
                                                                w => w.week === week && w.month === monthValue && w.year === year.toString()
                                                            );
                                                            return (
                                                                <button
                                                                    key={`${year}-${monthShort}-${week}`}
                                                                    className={`flex items-center justify-center w-full text-left text-sm px-2 py-1 rounded-md hover:bg-slate-700 ${isSelected ? "bg-slate-700" : ""}`}
                                                                    onClick={() => toggleWeekSelection(week, monthValue, year.toString())}
                                                                >
                                                                    <span>{week}</span>
                                                                    {isSelected && (
                                                                        <Check className="w-4 h-4 text-green-400 ml-1" />
                                                                    )}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                );
                            })}
                        </PopoverContent>
                    </Popover>

                    <Button
                        variant="ghost"
                        className={`px-4 py-2 transition-all duration-300 gap-2 ${guardiaSelection.Día ? "bg-[#F97316]/20 text-[#F97316]" : "text-slate-400"}`}
                        onClick={() => toggleGuardia("Día")}
                    >
                        <Sun className="w-4 h-4" />
                        D
                    </Button>

                    <Button
                        variant="ghost"
                        className={`px-4 py-2 transition-all duration-300 gap-2 ${guardiaSelection.Noche ? "bg-[#F97316]/20 text-slate-300" : "text-slate-400"}`}
                        onClick={() => toggleGuardia("Noche")}
                    >
                        <Moon className="w-4 h-4" />
                        N
                    </Button>
                </div>
            </div>

            <CardProgress selectedGuardia={effectiveGuardia} data={data} />
            <CardOnboarding data={data} selectedWeeks={selectedWeeks} selectedMonths={selectedMonths} selectedGuardia={effectiveGuardia} />

            <div className="flex flex-col gap-4 lg:grid lg:grid-cols-2">
                <ProgressOperationGraphic data={data} selectedWeeks={selectedWeeks} selectedMonths={selectedMonths} selectedGuardia={effectiveGuardia}/>
                <TurnDistrubutionGraphic data={data} selectedGuardia={effectiveGuardia} selectedWeeks={selectedWeeks} selectedMonths={selectedMonths}/>
                <CurrentSteelsGraphic data={data} selectedWeeks={selectedWeeks} selectedMonths={selectedMonths}/>
                <CurrentExplosivesGraphic data={data} selectedWeeks={selectedWeeks} selectedMonths={selectedMonths}/>
            </div>
        </div>
    );
}