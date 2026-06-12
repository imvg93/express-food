"use client";
import Sidebar from "./Sidebar";
import TopNav from "./TopNav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-[#F0F2F5] overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopNav />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
