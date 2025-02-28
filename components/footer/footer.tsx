import { BarChart, Users, DollarSign, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function Footer() {
  const menuItems = [
    { icon: BarChart, label: "Operaciones", path: "/operaciones" },
    { icon: Users, label: "RRHH", path: "/operaciones" },
    { icon: DollarSign, label: "Contabilidad", path: "/operaciones" },
    { icon: Settings, label: "Settings", path: "/operaciones" },
  ];
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-sm border-t border-slate-800  z-50">
      
      <div className="flex justify-around items-center p-3">
        {menuItems.map((item) => (
          <Link
            key={item.label}
            href={item.path}
            className={cn(
              "flex flex-col items-center text-slate-400 hover:text-slate-100 transition-colors",
              "p-2 rounded-lg"
            )}
          >
            <item.icon className="w-6 h-6" />
            <span className="text-xs mt-1">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};
  



