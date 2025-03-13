import { z } from "zod";

export const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  usernameReferred: z.string().min(2).optional(),
  companyKey: z.string().min(1),
  checked: z.boolean(),
});




export const signInSchema = z.object({
  usernameOrEmail: z.string().min(1, "Username or email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  companyKey: z.string().min(1).optional(),
});



export type SessionData = {
  user?: any;
  jwt?: string;
  isLoggedIn: boolean;
};

export const defaultSession: SessionData = {
  isLoggedIn: false,
};


export type SignInResponse = {
  jwt: string;
  user: any
};


