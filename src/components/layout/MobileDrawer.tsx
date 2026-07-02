"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import {
  LayoutDashboard, CheckSquare, ShoppingCart, Wrench, Zap, Sparkles, Megaphone,
  Truck, Wallet, BarChart3, FileText, TrendingDown, Shield, PieChart, AlertCircle, Bell,
  Settings, Upload, Building2, Receipt,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useDemoStore } from "@/store/demoStore";
import { ROLE_NAV } from "@/lib/constants";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard, CheckSquare, Receipt, ShoppingCart, Wrench, Zap, Sparkles, Megaphone,
  Truck, Wallet, BarChart3, FileText, TrendingDown, Shield, PieChart, AlertCircle, Bell,
  Settings, Upload, Building2,
};

const ROLE_META = {
  owner:      { label: "Owner",               name: "Rayudu Gari",    initials: "RG", ring: "ring-amber-400/50",   bg: "bg-gradient-to-br from-amber-400 to-orange-500" },
  manager:    { label: "Operations Manager",   name: "Narasimha Rao",  initials: "NR", ring: "ring-blue-400/50",    bg: "bg-gradient-to-br from-blue-500 to-[#1B3A5C]" },
  supervisor: { label: "Head Supervisor",      name: "Venkat Reddy",   initials: "VR", ring: "ring-emerald-400/50", bg: "bg-gradient-to-br from-emerald-400 to-teal-600" },
};

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  const { role } = useDemoStore();
  const pathname = usePathname();
  const navItems = ROLE_NAV[role] || ROLE_NAV.owner;
  const meta = ROLE_META[role];

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  const handleLinkClick = () => {
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed left-0 top-0 bottom-0 w-80 bg-gradient-to-b from-slate-900 to-slate-950 z-40 md:hidden flex flex-col overflow-hidden"
            style={{ borderRight: "1px solid rgba(255,255,255,0.05)" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-extrabold text-sm"
                  style={{ background: "linear-gradient(135deg, #E67E22, #F39C12)", boxShadow: "0 4px 12px rgba(230,126,34,0.4)" }}>
                  R
                </div>
                <div>
                  <p className="text-white text-xs font-extrabold">Rayudu Gari Hotel</p>
                  <p className="text-white/40 text-[10px] font-medium">by Webresfolio</p>
                </div>
              </div>
              <button onClick={onClose} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
                <X className="w-5 h-5 text-white/60" />
              </button>
            </div>

            {/* User Info */}
            <div className="px-4 py-3 border-b border-white/10">
              <div className="flex items-center gap-3 px-3 py-2 rounded-lg" style={{ background: "rgba(255,255,255,0.04)" }}>
                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0 ring-2", meta.bg, meta.ring)}>
                  {meta.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-white text-xs font-semibold truncate">{meta.name}</p>
                  <p className="text-white/40 text-[10px] truncate">{meta.label}</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5">
              {navItems.map((item) => {
                const Icon = ICON_MAP[item.icon];

                /* Group with children */
                if (item.children) {
                  return (
                    <div key={item.label} className="mb-1">
                      <div className="flex items-center gap-2 px-3 py-2">
                        {Icon && <Icon className="w-3.5 h-3.5 text-white/25 shrink-0" />}
                        <span className="text-[9px] font-bold text-white/25 uppercase tracking-wider">
                          {item.label}
                        </span>
                      </div>
                      <div className="ml-3 pl-3 border-l border-white/10 space-y-0.5">
                        {item.children.map((child) => {
                          const CI = ICON_MAP[child.icon];
                          const active = isActive(child.href);
                          return (
                            <Link key={child.href} href={child.href}
                              onClick={handleLinkClick}
                              className={cn(
                                "flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150",
                                active
                                  ? "bg-white/15 text-white"
                                  : "text-white/50 hover:text-white hover:bg-white/[0.08]"
                              )}
                            >
                              {CI && <CI className="w-3.5 h-3.5 shrink-0" />}
                              <span className="flex-1 truncate">{child.label}</span>
                              {child.badge && (
                                <span className="min-w-[18px] h-[18px] flex items-center justify-center bg-red-500 text-white text-[9px] font-bold px-1 rounded-full">
                                  {child.badge}
                                </span>
                              )}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  );
                }

                /* Top-level item */
                const active = isActive(item.href);
                return (
                  <Link key={item.href} href={item.href}
                    onClick={handleLinkClick}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150",
                      active
                        ? "bg-white/15 text-white"
                        : "text-white/50 hover:text-white hover:bg-white/[0.08]"
                    )}
                  >
                    {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
                    <span className="flex-1 truncate">{item.label}</span>
                    {item.badge && (
                      <span className="min-w-[18px] h-[18px] flex items-center justify-center bg-red-500 text-white text-[9px] font-bold px-1 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Footer */}
            <div className="px-3 pb-4 shrink-0 pt-2 border-t border-white/10">
              <p className="text-[10px] text-white/30 px-2 py-2">v1.0.0 • Mobile App</p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
