"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard, CheckSquare, ShoppingCart, Wrench, Zap, Sparkles, Megaphone,
  Truck, Wallet, BarChart3, FileText, TrendingDown, Shield, PieChart, AlertCircle, Bell,
  Settings, ChevronLeft, ChevronRight, Upload, Building2, Receipt, History,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useDemoStore } from "@/store/demoStore";
import { ROLE_NAV } from "@/lib/constants";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard, CheckSquare, Receipt, ShoppingCart, Wrench, Zap, Sparkles, Megaphone,
  Truck, Wallet, BarChart3, FileText, TrendingDown, Shield, PieChart, AlertCircle, Bell,
  Settings, Upload, Building2, History,
};

const ROLE_META = {
  owner:      { label: "Owner",               name: "Rayudu Gari",    initials: "RG", ring: "ring-amber-400/50",   bg: "bg-gradient-to-br from-amber-400 to-orange-500" },
  manager:    { label: "Operations Manager",   name: "Narasimha Rao",  initials: "NR", ring: "ring-blue-400/50",    bg: "bg-gradient-to-br from-blue-500 to-[#1B3A5C]" },
  supervisor: { label: "Head Supervisor",      name: "Venkat Reddy",   initials: "VR", ring: "ring-emerald-400/50", bg: "bg-gradient-to-br from-emerald-400 to-teal-600" },
};

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

export default function Sidebar({ collapsed: externalCollapsed, onToggle }: SidebarProps) {
  const { role } = useDemoStore();
  const pathname = usePathname();
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const collapsed = externalCollapsed !== undefined ? externalCollapsed : internalCollapsed;
  const toggleCollapsed = onToggle || (() => setInternalCollapsed((v) => !v));
  
  const navItems = ROLE_NAV[role] || ROLE_NAV.owner;
  const meta = ROLE_META[role];

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <motion.aside
      animate={{ width: collapsed ? 68 : 252 }}
      transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
      className="relative flex flex-col h-full shrink-0 overflow-hidden"
      style={{ background: "linear-gradient(180deg, #0B1929 0%, #0F2035 100%)", borderRight: "1px solid rgba(255,255,255,0.05)" }}
    >
      {/* ── Logo ── */}
      <div className="flex items-center gap-3 px-4 py-3.5 shrink-0" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-extrabold text-base shrink-0"
          style={{ background: "linear-gradient(135deg, #E67E22, #F39C12)", boxShadow: "0 4px 12px rgba(230,126,34,0.4)" }}>
          R
        </div>
        {!collapsed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-w-0">
            <p className="text-white text-[13px] font-extrabold leading-tight tracking-tight truncate">Rayudu Gari Hotel</p>
            <p className="text-white/35 text-[11px] leading-none mt-1 font-medium tracking-wide">by Webresfolio</p>
          </motion.div>
        )}
      </div>

      {/* ── Nav ── */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-2 px-2 space-y-0.5">
        {navItems.map((item) => {
          const Icon = ICON_MAP[item.icon];

          /* ── Group with always-visible children ── */
          if (item.children) {
            return (
              <div key={item.label} className="mb-1">
                {/* Section label — not clickable, always open */}
                {!collapsed && (
                  <div className="flex items-center gap-2 px-2.5 pt-3 pb-1">
                    {Icon && <Icon className="w-3.5 h-3.5 text-white/25 shrink-0" />}
                    <span className="text-[10px] font-bold text-white/25 uppercase tracking-[0.12em]">
                      {item.label}
                    </span>
                  </div>
                )}
                {/* Children always rendered */}
                <div className={cn(
                  "space-y-0.5",
                  !collapsed && "ml-3 pl-3" ,
                  !collapsed && "border-l border-white/[0.07]"
                )}>
                  {item.children.map((child) => {
                    const CI = ICON_MAP[child.icon];
                    const active = isActive(child.href);
                    return (
                      <Link key={child.href} href={child.href}
                        title={collapsed ? child.label : undefined}
                        className={cn(
                          "flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-medium transition-all duration-150",
                          active
                            ? "bg-white/10 text-white"
                            : "text-white/45 hover:text-white hover:bg-white/[0.06]",
                          collapsed && "justify-center px-2"
                        )}
                      >
                        {CI && <CI className="w-3.5 h-3.5 shrink-0" />}
                        {!collapsed && (
                          <>
                            <span className="flex-1 truncate">{child.label}</span>
                            {child.badge && (
                              <span className="min-w-[18px] h-[18px] flex items-center justify-center bg-[#E67E22] text-white text-[10px] font-bold px-1 rounded-full">
                                {child.badge}
                              </span>
                            )}
                          </>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          }

          /* ── Top-level item ── */
          const active = isActive(item.href);
          return (
            <Link key={item.href} href={item.href} title={collapsed ? item.label : undefined}
              className={cn(
                "flex items-center gap-3 px-2.5 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150",
                active
                  ? "bg-white/[0.1] text-white"
                  : "text-white/50 hover:text-white hover:bg-white/[0.06]",
                collapsed && "justify-center px-2"
              )}
            >
              {Icon && <Icon className="w-4 h-4 shrink-0" />}
              {!collapsed && (
                <>
                  <span className="flex-1 truncate">{item.label}</span>
                  {item.badge && (
                    <span className="min-w-[18px] h-[18px] flex items-center justify-center bg-[#E67E22] text-white text-[10px] font-bold px-1 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* ── User strip ── */}
      {!collapsed && (
        <div className="px-3 pb-3 shrink-0 pt-2" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl" style={{ background: "rgba(255,255,255,0.04)" }}>
            <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0 ring-2", meta.bg, meta.ring)}>
              {meta.initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-white text-[13px] font-semibold truncate leading-tight">{meta.name}</p>
              <p className="text-white/35 text-[11px] truncate mt-0.5">{meta.label}</p>
            </div>
          </div>
        </div>
      )}

      {/* ── Collapse toggle ── */}
      <div className="px-3 pb-3 shrink-0 pt-2" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <button 
          onClick={toggleCollapsed}
          type="button"
          className="w-full flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-xl text-white/40 hover:text-white hover:bg-white/[0.08] active:bg-white/[0.12] transition-all duration-200 text-xs font-semibold"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed
            ? <ChevronRight className="w-4 h-4" />
            : <><ChevronLeft className="w-4 h-4" /><span>Collapse</span></>
          }
        </button>
      </div>
    </motion.aside>
  );
}
