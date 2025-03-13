import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
import { SessionOptions } from "iron-session";
import { defaultSession, SessionData } from "@/models/auth";

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

export async function getSession() {
  const sessionCookies = await cookies();
  const session = await getIronSession<SessionData>(sessionCookies, sessionOptions);
  if (!session.isLoggedIn) {
    session.isLoggedIn = defaultSession.isLoggedIn;
  }
  return session;
}

export async function saveSession(data: SessionData) {
  const session = await getSession();
  session.user = data.user;
  session.jwt = data.jwt;
  session.isLoggedIn = data.isLoggedIn;
  const decodedJwt = jwtDecode(data.jwt!);
  const exp = decodedJwt.exp as number;
  const currentTimestamp = Math.floor(Date.now() / 1000);
  // Expire cookie before the session expires, 60 seconds before
  const maxAge = Math.max(0, exp - currentTimestamp - 60);
  session.updateConfig({
    ...sessionOptions,
    cookieOptions: {
      ...sessionOptions.cookieOptions,
      maxAge: maxAge,
    },
  });
  await session.save();
}

export async function updateSession(data: SessionData) {
  const session = await getSession();
  session.user = data.user;
  session.jwt = data.jwt;
  session.isLoggedIn = data.isLoggedIn;
  const decodedJwt = jwtDecode(data.jwt!);
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
  await session.save();
}
