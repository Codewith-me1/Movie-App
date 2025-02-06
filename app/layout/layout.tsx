import React, { ReactNode } from "react";
import SideNav from "./sidenav";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import Header from "./header";

interface Props {
  children: ReactNode;
}
const Layout = ({ children }: Props) => {
  return (
    <SidebarProvider>
      <SideNav loggedIn={true} />

      <div className="main overflow-hidden">
        <Header />

        <main>{children}</main>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
