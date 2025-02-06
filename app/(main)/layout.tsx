"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import SideNav from "../layout/sidenav";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Footer } from "../layout/footer";
import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "../context/AuthChecker";
import Header from "../layout/header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <SessionProvider>
        <SidebarProvider>
          <SideNav loggedIn={true} />

          <div className="main overflow-hidden w-full">
            <Header />

            <main className="h-full w-full">
              {children} <Footer />
            </main>
          </div>
        </SidebarProvider>
      </SessionProvider>
    </AuthProvider>
  );
}
