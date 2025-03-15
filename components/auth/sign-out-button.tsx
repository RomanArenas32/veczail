"use client"
import { Button } from "@/components/common/ui/button";
import { LogOut } from "lucide-react";
import { DropdownMenuItem } from "../common/ui/dropdown-menu";
import { signOutAction } from "@/actions/auth";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";

export default function SignOutButton() {
  const params = useParams();
  const key = Array.isArray(params.key) ? params.key[0] : params.key;

  return (
    <Button
      size={"icon"}
      onClick={async () => {
        await signOutAction(key);
      }}
      className="size-12 bg-white/10"
    >
      <LogOut size={"24"} color="white" />
    </Button>
  );
}

export function SignOutDropdownItem() {
  const t = useTranslations('navbar');

  const params = useParams();
  const key = Array.isArray(params.key) ? params.key[0] : params.key;

  return (
    <DropdownMenuItem
      onClick={async () => await signOutAction(key)}
      className="cursor-pointer"
    >
      <LogOut className="mr-2 h-4 w-4" />
      <span>{t("logout")}</span>
    </DropdownMenuItem>
  );
}
