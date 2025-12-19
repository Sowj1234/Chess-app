import React from "react";
import Link from "next/link";
import Image from "next/image";
import { auth, signOut, signIn } from "@/auth";

const Navbar = async () => {
  const session = await auth();
  return (
    <header className="px-5 py-3 bg-white shadow-sm font-work-sans">
      <nav className="flex justify-between items-center">
        <Link href="/">
          <Image src="/logo.png" alt="logo" width={40} height={15} />
        </Link>

        <div className="flex items-center gap-5 text-black font-bold">
          {session && session?.user ? (
            <>
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <button
                  type="submit"
                  className="bg-red-100 text-red-800 px-4 py-2 rounded border border-red-300 hover:bg-red-200 transition"
                >
                  logout
                </button>
              </form>

              <Link href={`/user/${session?.id}`}>
                <span> {session?.user?.name}</span>
              </Link>
            </>
          ) : (
            <form
              action={async () => {
                "use server";
                await signIn("github");
              }}
            >
              <button
                type="submit"
                className="bg-green-100 text-green-800 px-4 py-2 rounded border border-green-300 hover:bg-green-200 transition"
              >
                Login
              </button>
            </form>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
//form tag is  a server side component , it is easy for the nextjs to render it , the action is implemented when the button is clicked ,
//  action hold a async fucntion which is either signin or signout
