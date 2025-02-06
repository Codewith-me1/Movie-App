"use client";

import { ChevronDown, UserCircle } from "lucide-react";
import { useSession, signIn, signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useState } from "react";
import { useAuth } from "../context/AuthChecker";
import { getAuth } from "firebase/auth";
import { useRouter } from "next/navigation";
import { destroyCookie } from "nookies";

export default function Header() {
  const auth = getAuth();
  const { user } = useAuth();
  const [dropDown, setDropDown] = useState(false);

  const router = useRouter();

  const handleSignOut = () => {
    auth.signOut();

    destroyCookie(null, "auth-token", {
      path: "/",
      maxAge: 60 * 60 * 24,
    });
    alert("Sign Out Successfully");
  };

  const handleSignIn = () => {
    router.push("/pages/au");
  };

  return (
    <header className="w-full shadow-md p-4 flex items-center justify-between">
      {/* Sidebar Trigger */}
      <SidebarTrigger />

      {/* App Title */}
      <h1 className="text-xl font-semibold">Movie App</h1>

      {/* User Dropdown */}
      <DropdownMenu onOpenChange={(open) => setDropDown(open)}>
        <DropdownMenuTrigger asChild>
          <div className="flex mr-10 items-center cursor-pointer">
            <UserCircle className="w-8 h-8 text-gray-600" />
            <ChevronDown
              className={`transition-transform ${
                dropDown ? "rotate-180" : "rotate-0"
              }`}
            />
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-36">
          {!auth || !user ? (
            <DropdownMenuItem
              onClick={() => handleSignIn()}
              className="cursor-pointer text-blue-500"
            >
              Sign In
            </DropdownMenuItem>
          ) : (
            <>
              <DropdownMenuItem
                onClick={() => handleSignOut()}
                className="cursor-pointer text-red-500"
              >
                Sign Out
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
