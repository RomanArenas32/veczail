import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth"; // Asumiendo que getSession se encarga de las cookies
import { Role } from "@/models/api";

const publicRoutes = [
  "/login",
  "/logout",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/404",
  "/500",
];

const roleRoutes = {
  [Role.ADMIN]: ["/operaciones", "/rrhh", "/contabilidad", "/settings", "/"],
};

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Llama a getSession directamente
  const session = await getSession(); // No necesitas pasar request si no lo requiere getSession
console.log(session)
  // Verifica si la ruta es pública
  const isPublicRoute = publicRoutes.some(
    (route) => pathname.startsWith(route) || pathname === route
  );

  // Si es una ruta pública, deja pasar la solicitud
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Si no hay sesión o no está logueado, redirige a la página de login
  if (!session.isLoggedIn) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Si es un ADMIN, verifica las rutas permitidas
  if (session.user.role === Role.ADMIN) {
    const isAllowedRoute = roleRoutes[Role.ADMIN].some((route) => {
      // Verifica las rutas dinámicas, como /operaciones/:id
      if (route.includes(":id")) {
        const baseRoute = route.split("/:", 1)[0];
        return pathname.startsWith(baseRoute); // Verifica solo la base de la ruta
      }
      return pathname === route || pathname.startsWith(route);
    });

    // Si la ruta es permitida para el rol ADMIN, deja pasar la solicitud
    if (isAllowedRoute) {
      return NextResponse.next();
    }
  }

  // Si no tiene acceso, redirige a login o alguna otra página
  return NextResponse.redirect(new URL("/login", request.url));
}

// Configura las rutas para que el middleware solo se aplique a las rutas específicas
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
