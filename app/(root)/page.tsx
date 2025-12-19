import React from "react";
import Chessboard from "@/components/Chessboard";
import Navbar from "@/components/Navbar";
import { auth } from "@/auth";

const page = async () => {
  const session = await auth();
  const userName = session?.user?.name || "Guest";
  return (
    <>
      <main className="p-4">
        <h1 className="text-2xl font-bold mb-4">Welcome to Chess App ♟️</h1>
        <Chessboard userName={userName} />
      </main>
    </>
  );
};

export default page;
