import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
import { SessionOptions } from "iron-session";
import { defaultSession, SessionData } from "@/models/auth";
import { cache } from "react";

const password = process.env.SESSION_SECRET;
if (!password) {
  throw new Error("SESSION_SECRET environment variable is not defined");
}

export const sessionOptions: SessionOptions = {
  password: password,
  cookieName: "user-session",
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  },
};

// Usa cache() para evitar múltiples llamadas a getSession en el mismo render
export const getSession = cache(async () => {
  // Si estamos en el cliente o en tiempo de compilación, devolver sesión por defecto
  if (typeof window !== 'undefined' || 
      (process.env.NODE_ENV === 'production' && !process.env.NEXT_RUNTIME)) {
    return defaultSession;
  }
  
  try {
    // Estamos en el servidor durante una solicitud
    const sessionCookies = await cookies();
    const session = await getIronSession<SessionData>(sessionCookies, sessionOptions);
    if (!session.isLoggedIn) {
      session.isLoggedIn = defaultSession.isLoggedIn;
    }
    return session;
  } catch (error) {
    // Si hay un error, devolver sesión por defecto
    console.error("Error getting session:", error);
    return defaultSession;
  }
});

// Función auxiliar para verificar si estamos en el servidor
const isServer = () => typeof window === 'undefined';

export async function saveSession(data: SessionData) {
  // Solo ejecutar en el servidor
  if (!isServer()) return;
  
  try {
    const session = await getSession() as unknown as { updateConfig: (config: SessionOptions) => void, save: () => Promise<void> } & SessionData;
    
    // Solo continuar si tenemos un objeto de sesión válido con métodos
    if ('updateConfig' in session && 'save' in session) {
      session.user = data.user;
      session.jwt = data.jwt;
      session.isLoggedIn = data.isLoggedIn;
      
      if (data.jwt) {
        const decodedJwt = jwtDecode(data.jwt);
        const exp = decodedJwt.exp as number;
        const currentTimestamp = Math.floor(Date.now() / 1000);
        const maxAge = Math.max(0, exp - currentTimestamp - 60);
        
        session.updateConfig({
          ...sessionOptions,
          cookieOptions: {
            ...sessionOptions.cookieOptions,
            maxAge: maxAge,
          },
        });
      }
      
      await session.save();
    }
  } catch (error) {
    console.error("Error saving session:", error);
  }
}

export async function updateSession(data: SessionData) {
  // Reutilizar la función saveSession para actualizar
  await saveSession(data);
}