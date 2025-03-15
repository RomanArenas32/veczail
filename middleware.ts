import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { Role } from "@/models/api";

const publicRoutes = [
  "/login",
  "/logout",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/404",
  "/500",
  "/",
];

const roleRoutes = {
  [Role.ADMIN]: ["/operaciones"],
};

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const session = await getSession();

  const isPublicRoute = publicRoutes.some(
    (route) => pathname.startsWith(route) || pathname === route
  );

  if (isPublicRoute) {
    return NextResponse.next();
  }

  if (!session.isLoggedIn) {
    console.log("No session, redirecting to /login");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (session.user.role === Role.ADMIN) {
    const isAllowedRoute = roleRoutes[Role.ADMIN].some((route) => {
      if (route.includes(":id")) {
        const baseRoute = route.split("/:", 1)[0];
        return pathname.startsWith(baseRoute);
      }
      return pathname === route || pathname.startsWith(route);
    });

    if (isAllowedRoute) {
      return NextResponse.next();
    }
  }

  console.log("Role mismatch or route not allowed, redirecting to /login");
  return NextResponse.redirect(new URL("/login", request.url));
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};