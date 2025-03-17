"use client"; 
import { BarChart, Users, DollarSign, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { signOutAction } from "@/action/auth";
import { useRouter } from "next/navigation";

export default function Footer() {

  const router = useRouter();

  const handleLogout = async() => {
    const result = await signOutAction();
   if (result?.success) {
      router.push(result.redirectTo.toString()); 
    } 
  };

  const menuItems = [
    { icon: BarChart, label: "Operaciones", path: "/" },
    { icon: Users, label: "RRHH", path: "/rrhh" },
    { icon: DollarSign, label: "Contabilidad", path: "/contabilidad" },
    { icon: Settings, label: "Settings", path: "/settings" },
    { 
      icon: LogOut, 
      label: "Log Out", 
      path: "#", 
      isLogout: true, 
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-sm border-t border-slate-800 z-50">
      <div className="flex flex-row">
        <div className="flex justify-around items-center py-3 px-1 md:p-3 w-full">
          {menuItems.map((item) => (
            item.isLogout ? (
              <button
                key={item.label}
                onClick={handleLogout}
                className={cn(
                  "flex flex-col items-center text-red-500 hover:text-red-400 hover:cursor-pointer transition-colors",
                  "p-2 rounded-lg"
                )}
              >
                <item.icon className="w-6 h-6" />
                <span className="text-xs mt-1">{item.label}</span>
              </button>
            ) : (
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
            )
          ))}
        </div>
      </div>
    </div>
  );
}