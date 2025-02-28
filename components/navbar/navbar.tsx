import { HardHat } from "lucide-react";

export default function Navbar() {
    return (
      <div className="w-full flex flex-row items-center justify-start gap-2 lg:gap-5">
        <HardHat className="size-10 lg:size-12 text-orange-400"/>
        <h1 className="text-2xl font-bold uppercase text-purple-600">Operaciones</h1>
      </div>
    );
  }