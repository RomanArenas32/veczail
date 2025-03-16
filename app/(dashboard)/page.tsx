import AdminHome from "@/components/admin/home";
import { getSession } from "@/lib/auth";
import { Role } from "@/models/api";
import { redirect } from "next/navigation";

// Forzar renderizado dinámico en el servidor
export const dynamic = "force-dynamic";

export default async function Page() {
  const session = await getSession();
  
  // Verifica si el usuario tiene rol ADMIN
  if (!session.isLoggedIn || session.user?.role !== Role.ADMIN) {
    // Usar redirect en lugar de renderizar NotFound
    redirect("/404");
  }

  // Si el rol es ADMIN, renderiza la página del admin
  return <AdminHome />;
}