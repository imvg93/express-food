"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Crown, BarChart3, ClipboardList, ArrowRight, Check, Building2 } from "lucide-react";
import { useDemoStore } from "@/store/demoStore";

const ROLES = [
  {
    id: "owner" as const,
    icon: <Crown className="w-7 h-7" />,
    name: "Owner",
    person: "Rayudu Gari",
    description: "Full system visibility with final approval authority over all expenses.",
    gradient: "from-amber-500 to-orange-500",
    bg: "bg-amber-50",
    border: "border-amber-200",
    badge: "bg-amber-100 text-amber-800 border border-amber-200",
    permissions: ["View all 14 modules", "Approve or reject expenses", "Access all reports & analytics", "Manage budgets & limits"],
    accent: "#E67E22",
  },
  {
    id: "manager" as const,
    icon: <BarChart3 className="w-7 h-7" />,
    name: "Operations Manager",
    person: "Narasimha Rao",
    description: "Verify submitted expenses, manage vendor relationships, and access reports.",
    gradient: "from-[#1B3A5C] to-[#2A5080]",
    bg: "bg-blue-50",
    border: "border-blue-200",
    badge: "bg-blue-100 text-blue-800 border border-blue-200",
    permissions: ["Verify submitted expenses", "View all expense categories", "Manage vendor records", "Access monthly reports"],
    accent: "#1B3A5C",
  },
  {
    id: "supervisor" as const,
    icon: <ClipboardList className="w-7 h-7" />,
    name: "Supervisor",
    person: "Venkat Reddy",
    description: "Enter daily expenses, upload bill proofs, and manage petty cash entries.",
    gradient: "from-emerald-500 to-green-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    badge: "bg-emerald-100 text-emerald-800 border border-emerald-200",
    permissions: ["Add expense entries", "Upload bill proofs", "Manage petty cash register", "View my entries & status"],
    accent: "#22C55E",
  },
];

export default function DemoPage() {
  const { setRole } = useDemoStore();

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 h-16 flex items-center justify-between shadow-sm">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1B3A5C] to-[#2A5080] flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-slate-900/20">W</div>
          <div>
            <p className="text-[15px] font-bold text-slate-900 leading-none" style={{ fontFamily: "var(--font-jakarta, Plus Jakarta Sans, sans-serif)" }}>Webresfolio</p>
            <p className="text-[10px] text-slate-400 leading-none mt-0.5">Expense Control System</p>
          </div>
        </Link>
        <Link href="/" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1">
          ← Overview
        </Link>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-14">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="text-center mb-10 max-w-xl"
        >
          <div className="inline-flex items-center gap-2 bg-[#1B3A5C]/8 text-[#1B3A5C] text-xs font-semibold px-4 py-2 rounded-full border border-[#1B3A5C]/15 mb-4">
            <Building2 className="w-3.5 h-3.5" /> Rayudu Gari Military Hotel
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 leading-tight tracking-tight" style={{ fontFamily: "var(--font-jakarta, Plus Jakarta Sans, sans-serif)" }}>
            Choose Your Demo Experience
          </h1>
          <p className="text-slate-500 text-base mt-3 leading-relaxed">
            Select a user role to explore the system from their perspective.
            Each role has different modules, permissions, and workflow access.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full max-w-4xl">
          {ROLES.map((role, i) => (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: i * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <Link
                href={`/login/${role.id}`}
                onClick={() => setRole(role.id)}
                className={`flex flex-col h-full bg-white border-2 ${role.border} rounded-3xl p-6 hover:shadow-xl transition-all duration-300 group relative overflow-hidden`}
              >
                {/* Gradient top accent */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${role.gradient}`} />

                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${role.gradient} flex items-center justify-center text-white mb-5 shadow-lg`}>
                  {role.icon}
                </div>

                <div className="mb-1 flex items-center gap-2">
                  <p className="text-xl font-extrabold text-slate-900" style={{ fontFamily: "var(--font-jakarta, Plus Jakarta Sans, sans-serif)" }}>{role.name}</p>
                </div>
                <p className={`text-xs font-semibold px-2.5 py-1 rounded-full inline-block mb-3 ${role.badge}`}>{role.person}</p>
                <p className="text-sm text-slate-500 mb-5 leading-relaxed">{role.description}</p>

                <div className="space-y-2 flex-1 mb-5">
                  {role.permissions.map((p) => (
                    <div key={p} className="flex items-center gap-2.5 text-sm text-slate-700">
                      <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5 text-emerald-600" />
                      </div>
                      {p}
                    </div>
                  ))}
                </div>

                <div
                  className="flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold transition-all"
                  style={{ background: role.accent, color: "white" }}
                >
                  Enter as {role.name}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center gap-2 mt-8 text-sm text-slate-400"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          Demo mode · No real data · All actions are simulated locally
        </motion.div>
      </div>
    </div>
  );
}
