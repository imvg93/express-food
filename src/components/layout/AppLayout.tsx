"use client";
import { useState } from "react";
import Sidebar from "./Sidebar";
import TopNav from "./TopNav";
import MobileNav from "./MobileNav";
import MobileDrawer from "./MobileDrawer";
import BottomNav from "./BottomNav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  return (
    <>
      {/* Mobile Layout */}
      <div className="md:hidden flex flex-col h-screen bg-[#F8FAFC] overflow-hidden">
        <MobileNav onMenuClick={() => setMobileDrawerOpen(true)} />
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          {children}
        </main>
        <BottomNav />
        <MobileDrawer isOpen={mobileDrawerOpen} onClose={() => setMobileDrawerOpen(false)} />
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex h-screen bg-[#F8FAFC] overflow-hidden">
        <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          <TopNav />
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </>
  );
}
