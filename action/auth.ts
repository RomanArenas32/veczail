"use server";

import { z } from "zod";
import { saveSession } from "@/lib/auth";
import { API_URL } from "@/lib/consts";
import { signInSchema } from "@/schemma/auth";

export type SessionData = {
  user?: any;
  jwt?: string;
  isLoggedIn: boolean;
};

export async function signInAction(data: z.infer<typeof signInSchema>) {
  try {
    const payload = {
      usernameOrEmail: data.usernameOrEmail,
      password: data.password,
    };
    const url = `${API_URL}/user/login`;
    const response = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorBody = await response.json();
      return {
        error: errorBody.error || "Request Failed",
        message: errorBody.message || "There was a problem with your request",
        statusCode: response.status,
      };
    }

    const body = await response.json();

    const user = { ...body.user };
    const session: SessionData = {
      isLoggedIn: true,
      user: user,
      jwt: body.jwt,
    };
    await saveSession(session);

    return {
      success: true,
      redirectTo: "/",
    };
  } catch (error: any) {
    console.error("Unhandled sign in Error :", error);
    if (error.cause?.code === "ECONNREFUSED") {
      return {
        error: "Connection Refused",
        message: "Could not connect to the server. Is it running?",
        statusCode: 503,
      };
    }
    return {
      error: "Uh oh! Something went wrong.",
      message: "There was a problem with your request.",
      statusCode: 500,
    };
  }
}