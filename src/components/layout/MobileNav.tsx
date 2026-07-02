"use client";
import { useMemo } from "react";
import { Bell, Menu } from "lucide-react";
import { useDemoStore } from "@/store/demoStore";
import { cn } from "@/lib/utils";

const ROLE_META = {
  owner:      { label: "Owner",               name: "Rayudu Gari",    initials: "RG", ring: "ring-amber-400/50",   bg: "bg-gradient-to-br from-amber-400 to-orange-500" },
  manager:    { label: "Operations Manager",   name: "Narasimha Rao",  initials: "NR", ring: "ring-blue-400/50",    bg: "bg-gradient-to-br from-blue-500 to-[#1B3A5C]" },
  supervisor: { label: "Head Supervisor",      name: "Venkat Reddy",   initials: "VR", ring: "ring-emerald-400/50", bg: "bg-gradient-to-br from-emerald-400 to-teal-600" },
};

interface MobileNavProps {
  onMenuClick?: () => void;
}

export default function MobileNav({ onMenuClick }: MobileNavProps) {
  const { role } = useDemoStore();
  const meta = useMemo(() => ROLE_META[role], [role]);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-100">
      <div className="flex items-center justify-between px-4 py-3 gap-3">
        {/* Menu Button */}
        <button
          onClick={onMenuClick}
          className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-slate-100 active:bg-slate-200 transition-colors"
          title="Open menu"
        >
          <Menu className="w-5 h-5 text-slate-700" />
        </button>

        {/* Profile Avatar */}
        <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0 ring-2", meta.bg, meta.ring)}>
          {meta.initials}
        </div>

        {/* Title */}
        <div className="flex-1 min-w-0">
          <h1 className="text-sm font-bold text-slate-900 truncate">{meta.name}</h1>
          <p className="text-[11px] text-slate-400 font-medium">{meta.label}</p>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-50 transition-colors active:bg-slate-100 relative">
            <Bell className="w-5 h-5 text-slate-700" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>
        </div>
      </div>
    </header>
  );
}
