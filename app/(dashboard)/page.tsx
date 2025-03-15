
import AdminHome from "@/components/admin/home";
import { getSession } from "@/lib/auth";
import { Role } from "@/models/api";
import { redirect } from "@/components/navigation/";

export default async function Page({
  params
}: {
  params: { key: string; locale: string }
}) {
  const session = await getSession();
  switch (session.user?.role) {
    case Role.ADMIN:
      return <AdminHome />;
    
    default:
      redirect({
        href: `/404`,
        locale: ""
      });
    }
  }