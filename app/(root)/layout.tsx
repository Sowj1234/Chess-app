import Navbar from "@/components/Navbar";
import Chessboard from "@/components/Chessboard";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="font-work-sans">
      <Navbar />

      {children}
    </main>
  );
}
