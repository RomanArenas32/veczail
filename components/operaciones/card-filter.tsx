import { Button } from "@/components/ui/button";
import { Calendar, Sun, Moon } from "lucide-react";

interface TimeToggleProps {
  selected?: "month" | "week" | "day" | "night";
  onChange: (value: "month" | "week" | "day" | "night") => void;
}

export const CardFilter = ({ selected, onChange }: TimeToggleProps) => {
  return (
    <div className="inline-flex p-1.5 bg-slate-800/50 backdrop-blur-sm rounded-lg gap-1 max-w-fit-content">
      <Button
        variant="ghost"
        className={`px-4 py-2 transition-all duration-300 gap-2 ${
          selected === "month"
            ? "bg-[#7E69AB]/20 text-[#7E69AB] hover:text-[#7E69AB] hover:bg-[#7E69AB]/30"
            : "text-slate-400 hover:text-slate-100"
        }`}
        onClick={() => onChange("month")}
      >
        <Calendar className="w-4 h-4" />
        Mes
      </Button>
      <Button
        variant="ghost"
        className={`px-4 py-2 transition-all duration-300 gap-2 ${
          selected === "week"
            ? "bg-[#0EA5E9]/20 text-[#0EA5E9] hover:text-[#0EA5E9] hover:bg-[#0EA5E9]/30"
            : "text-slate-400 hover:text-slate-100"
        }`}
        onClick={() => onChange("week")}
      >
        <Calendar className="w-4 h-4" />
        Sem
      </Button>
      <Button
        variant="ghost"
        className={`px-4 py-2 transition-all duration-300 gap-2 ${
          selected === "day"
            ? "bg-[#F97316]/20 text-[#F97316] hover:text-[#F97316] hover:bg-[#F97316]/30"
            : "text-slate-400 hover:text-slate-100"
        }`}
        onClick={() => onChange("day")}
      >
        <Sun className="w-4 h-4" />
        Día
      </Button>
      <Button
        className={`px-4 py-2 transition-all duration-300 gap-2 ${
          selected === "night"
            ? "bg-[#1A1F2C]/50 text-slate-300 hover:text-slate-200 hover:bg-[#1A1F2C]/60"
            : "text-slate-400 hover:text-slate-100"
        }`}
        onClick={() => onChange("night")}
      >
        <Moon className="w-4 h-4" />
        Noche
      </Button>
    </div>
  );
};

