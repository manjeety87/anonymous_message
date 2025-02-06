"use client";

import { useSession, signOut } from "next-auth/react";
import React from "react";
import { User } from "next-auth";

import { Button } from "@/components/ui/button";

import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  const { data: session } = useSession();
  const user: User = session?.user as User;

  return (
    <nav className="p-4 md:p-6 shadow-[0_12px_20px_-15px_rgba(255,255,255,0.3)] ">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <a href="#" className="text-xl font-bold mb-4 md:mb-0">
          Anonymous Feedback
        </a>
        <div></div>
        {session && (
          <span className="mr-20">
            Welcome, {user?.username || user?.email}
          </span>
        )}
        <div></div>
        <div className="flex items-center">
          {session ? (
            <>
              <Link href="/dashboard" className="mr-2">
                <Button className="w-full md:w-auto" variant={"outline"}>
                  Dashboard
                </Button>
              </Link>
              <Button
                onClick={() => signOut()}
                className="w-full mr-3 md:w-auto"
                variant="outline"
              >
                Logout
              </Button>
            </>
          ) : (
            <Link href="/sign-in" className="mr-2">
              <Button className="w-full md:w-auto" variant={"outline"}>
                Login
              </Button>
            </Link>
          )}
          <>
            <ThemeToggle />
          </>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
