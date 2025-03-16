import AdminHome from "@/components/admin/home";
import { getSession } from "@/lib/auth";
import { Role } from "@/models/api";
import { notFound } from "next/navigation";

// Forzar renderizado dinámico en el servidor
export const dynamic = "force-dynamic";

export default async function Page() {
  const session = await getSession();
  
  // Verifica si el usuario tiene rol ADMIN
  if (session.user?.role !== Role.ADMIN) {
    notFound(); // Redirige a la página 404 si el rol no es ADMIN
  }

  // Si el rol es ADMIN, renderiza la página del admin
  return <AdminHome />;
}