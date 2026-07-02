"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard, CheckSquare, Receipt, Wallet, BarChart3, Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useDemoStore } from "@/store/demoStore";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard, CheckSquare, Receipt, Wallet, BarChart3, Settings,
};

interface BottomNavItem {
  label: string;
  href: string;
  icon: string;
  badge?: number;
}

const ROLE_BOTTOM_NAV: Record<string, BottomNavItem[]> = {
  owner: [
    { label: "Dashboard", href: "/dashboard/owner", icon: "LayoutDashboard" },
    { label: "Approvals", href: "/dashboard/approvals", icon: "CheckSquare", badge: 7 },
    { label: "Expenses", href: "/dashboard/expenses", icon: "Receipt" },
    { label: "Reports", href: "/dashboard/reports", icon: "BarChart3" },
    { label: "Settings", href: "/dashboard/settings", icon: "Settings" },
  ],
  manager: [
    { label: "Dashboard", href: "/dashboard/manager", icon: "LayoutDashboard" },
    { label: "Verify", href: "/dashboard/approvals", icon: "CheckSquare", badge: 4 },
    { label: "Expenses", href: "/dashboard/expenses", icon: "Receipt" },
    { label: "Reports", href: "/dashboard/reports", icon: "BarChart3" },
    { label: "Settings", href: "/dashboard/settings", icon: "Settings" },
  ],
  supervisor: [
    { label: "Dashboard", href: "/dashboard/supervisor", icon: "LayoutDashboard" },
    { label: "My Entries", href: "/dashboard/expenses", icon: "Receipt" },
    { label: "Petty Cash", href: "/dashboard/petty-cash", icon: "Wallet" },
    { label: "Queue", href: "/dashboard/missing-proofs", icon: "CheckSquare", badge: 2 },
    { label: "Settings", href: "/dashboard/settings", icon: "Settings" },
  ],
};

export default function BottomNav() {
  const { role } = useDemoStore();
  const pathname = usePathname();
  const navItems = ROLE_BOTTOM_NAV[role] || ROLE_BOTTOM_NAV.owner;

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-40 md:hidden">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const Icon = ICON_MAP[item.icon];
          const active = isActive(item.href);

          return (
            <Link key={item.href} href={item.href}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full relative transition-colors duration-200 gap-1",
                active
                  ? "text-[#1B3A5C]"
                  : "text-slate-400 hover:text-slate-600"
              )}
            >
              <div className="relative">
                {Icon && <Icon className="w-5 h-5" />}
                {item.badge && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1 rounded-full h-4 w-4 flex items-center justify-center"
                  >
                    {item.badge > 9 ? "9+" : item.badge}
                  </motion.span>
                )}
              </div>
              <span className="text-[10px] font-semibold">{item.label}</span>

              {/* Active indicator */}
              {active && (
                <motion.div
                  layoutId="active-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1B3A5C]"
                  transition={{ type: "spring", stiffness: 380, damping: 40 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
