"use client"
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { signOutAction } from "@/action/auth";

export default function SignOutButton() {

  return (
    <Button
      size={"icon"}
      onClick={async () => {
        await signOutAction();
      }}
      className="size-12 bg-white/10"
    >
      <LogOut size={"24"} color="white" />
    </Button>
  );
}

export function SignOutItem() {


  return (
    <div className="flex items-center space-x-2">
      <LogOut size={16} color="white" />
      <Button
        size={"sm"}
        onClick={async () => {
          await signOutAction();
        }}
        className="text-white"
      >
        Salir
      </Button>
    </div>
  );
}
