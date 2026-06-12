"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Search, Bell, ChevronDown, LogOut, RefreshCw, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn, formatDateTime } from "@/lib/utils";
import { useDemoStore } from "@/store/demoStore";

const ROLE_LABELS: Record<string, string> = { owner: "Owner", manager: "Ops Manager", supervisor: "Supervisor" };
const ROLE_BADGE: Record<string, string> = {
  owner:      "bg-amber-100   text-amber-800   border border-amber-300/60",
  manager:    "bg-blue-100    text-blue-800    border border-blue-300/60",
  supervisor: "bg-emerald-100 text-emerald-800 border border-emerald-300/60",
};
const USER_NAMES:    Record<string, string> = { owner: "Rayudu Gari", manager: "Narasimha Rao", supervisor: "Venkat Reddy" };
const USER_INITIALS: Record<string, string> = { owner: "RG", manager: "NR", supervisor: "VR" };
const AVATAR_BG:     Record<string, string> = {
  owner:      "from-amber-400 to-orange-500",
  manager:    "from-blue-500 to-[#1B3A5C]",
  supervisor: "from-emerald-400 to-teal-600",
};

const NOTIF_DOT: Record<string, string> = {
  "budget-alert": "bg-amber-500", "missing-proof": "bg-red-500",
  "approval-request": "bg-blue-500", reminder: "bg-purple-500", "approval-done": "bg-emerald-500",
};

export default function TopNav() {
  const { role, notifications, unreadCount, markAllNotificationsRead, markNotificationRead } = useDemoStore();
  const [notifOpen, setNotifOpen]   = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const notifRef   = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (notifRef.current   && !notifRef.current.contains(e.target as Node))   setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center px-5 gap-4 shrink-0 z-20"
      style={{ boxShadow: "0 1px 0 rgba(15,23,42,0.06)" }}>

      {/* Branch */}
      <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 shrink-0">
        <MapPin className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-sm font-semibold text-slate-700">Main Branch</span>
      </div>

      {/* Search */}
      <div className="flex-1 max-w-xs">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text" placeholder="Search expenses, vendors…"
            className="w-full h-9 pl-9 pr-3 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1B3A5C]/20 focus:border-[#1B3A5C]/50 transition-all"
          />
        </div>
      </div>

      <div className="ml-auto flex items-center gap-1">
        {/* Date */}
        <span className="hidden lg:block text-sm font-medium text-slate-500 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 mr-1">
          12 Jun 2026
        </span>

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button onClick={() => { setNotifOpen(v => !v); setProfileOpen(false); }}
            className="relative p-2.5 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors">
            <Bell style={{ width: 18, height: 18 }} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 bg-[#E67E22] text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 leading-none">
                {unreadCount}
              </span>
            )}
          </button>
          <AnimatePresence>
            {notifOpen && (
              <motion.div initial={{ opacity: 0, y: 6, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.96 }} transition={{ duration: 0.13 }}
                className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl z-50 overflow-hidden"
                style={{ boxShadow: "0 8px 32px rgba(15,23,42,0.14), 0 0 0 1px rgba(15,23,42,0.06)" }}>
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
                  <p className="text-sm font-bold text-slate-900">Notifications</p>
                  <button onClick={markAllNotificationsRead} className="text-xs font-semibold text-[#1B3A5C] hover:text-[#E67E22] transition-colors">Mark all read</button>
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
                  {notifications.slice(0, 7).map((n) => (
                    <Link key={n.id} href={n.link || "#"}
                      onClick={() => { markNotificationRead(n.id); setNotifOpen(false); }}
                      className={cn("flex gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors", !n.isRead && "bg-orange-50/50")}>
                      <span className={cn("w-2 h-2 rounded-full mt-1.5 shrink-0", NOTIF_DOT[n.type] || "bg-slate-400")} />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900 leading-snug">{n.title}</p>
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{n.message}</p>
                        <p className="text-[11px] text-slate-400 mt-1">{formatDateTime(n.timestamp)}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile */}
        <div ref={profileRef} className="relative">
          <button onClick={() => { setProfileOpen(v => !v); setNotifOpen(false); }}
            className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl hover:bg-slate-100 transition-colors">
            <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold bg-gradient-to-br shrink-0", AVATAR_BG[role])}>
              {USER_INITIALS[role]}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-bold text-slate-800 leading-none">{USER_NAMES[role]}</p>
              <span className={cn("text-[11px] px-1.5 py-0.5 rounded-full font-semibold mt-0.5 inline-block", ROLE_BADGE[role])}>
                {ROLE_LABELS[role]}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>
          <AnimatePresence>
            {profileOpen && (
              <motion.div initial={{ opacity: 0, y: 6, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.96 }} transition={{ duration: 0.13 }}
                className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl z-50 overflow-hidden"
                style={{ boxShadow: "0 8px 32px rgba(15,23,42,0.14), 0 0 0 1px rgba(15,23,42,0.06)" }}>
                <div className="px-4 py-3.5 border-b border-slate-100">
                  <p className="text-sm font-bold text-slate-900">{USER_NAMES[role]}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{ROLE_LABELS[role]}</p>
                </div>
                <div className="py-1.5">
                  <Link href="/demo" onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                    <RefreshCw className="w-3.5 h-3.5" /> Switch Role
                  </Link>
                  <Link href="/demo" onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
                    <LogOut className="w-3.5 h-3.5" /> Exit Demo
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
