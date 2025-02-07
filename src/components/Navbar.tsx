"use client";

import { useSession, signOut } from "next-auth/react";
import React from "react";
import { User } from "next-auth";

import { Button } from "@/components/ui/button";

import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const { data: session } = useSession();
  const user: User = session?.user as User;
  const pathname = usePathname();

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
              {pathname !== "/dashboard" && (
                <Link href="/dashboard" className="mr-2">
                  <Button className="w-full md:w-auto" variant={"outline"}>
                    Dashboard
                  </Button>
                </Link>
              )}
              {pathname !== "/" && (
                <Link href="/" className="mr-2">
                  <Button className="w-full md:w-auto" variant={"outline"}>
                    Home
                  </Button>
                </Link>
              )}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    // onClick={() => signOut()}
                    className="w-full mr-3 md:w-auto"
                    variant="outline"
                  >
                    Logout
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Do you wish you logout?</AlertDialogTitle>
                    <AlertDialogDescription>
                      You can always login again and continue where you left all
                      the feedbacks are safe and secure.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => signOut()}>
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              {/* <Button
                onClick={() => signOut()}
                className="w-full mr-3 md:w-auto"
                variant="outline"
              >
                Logout
              </Button> */}
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
