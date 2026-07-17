import Navbar from "@/components/Navbar";
import { Outlet } from "react-router";

export default function MainLayout() {
  return (
    <div className="min-h-svh">
      <header className="sticky top-0 z-50 bg-primary pt-6">
        <Navbar />
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}