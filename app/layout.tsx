import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/auth/session-provider";
import { getSession } from "@/lib/auth";
import { Toaster } from "@/components/ui/sonner"


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
const session = await getSession();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <SessionProvider
            session={{
              isLoggedIn: session.isLoggedIn,
              user: session.user,
              jwt: session.jwt,
            }}
          >
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gradient-to-b from-[#0B1120] via-[#0F172A] to-[#1E293B] text-slate-100`}
      >
        {children}
        <Toaster />
      </body>
      </SessionProvider>
    </html>
  );
}
