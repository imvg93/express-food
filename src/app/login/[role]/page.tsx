"use client";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, Mail, ArrowRight } from "lucide-react";
import { useDemoStore } from "@/store/demoStore";
import type { Role } from "@/types";

const ROLE_DATA: Record<string, {
  name: string; email: string; role: string; title: string;
  gradient: string; avatarBg: string; accent: string;
}> = {
  owner: {
    name: "Rayudu Gari", email: "owner@rayudugari.in",
    role: "Owner", title: "Full system access · Final approval authority",
    gradient: "from-amber-500 via-amber-600 to-orange-600",
    avatarBg: "bg-amber-500", accent: "#E67E22",
  },
  manager: {
    name: "Narasimha Rao", email: "manager@rayudugari.in",
    role: "Operations Manager", title: "Expense verification · Vendor management",
    gradient: "from-[#1B3A5C] via-[#1B3A5C] to-[#2A5080]",
    avatarBg: "bg-[#1B3A5C]", accent: "#1B3A5C",
  },
  supervisor: {
    name: "Venkat Reddy", email: "supervisor@rayudugari.in",
    role: "Head Supervisor", title: "Expense entry · Proof upload",
    gradient: "from-emerald-500 via-emerald-600 to-green-600",
    avatarBg: "bg-emerald-500", accent: "#22C55E",
  },
};

export default function LoginPage({ params }: { params: Promise<{ role: string }> }) {
  const { role: paramRole } = use(params);
  const router = useRouter();
  const { setRole } = useDemoStore();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showPass, setShowPass] = useState(false);

  const data = ROLE_DATA[paramRole] || ROLE_DATA.owner;

  const handleLogin = () => {
    if (loading) return;
    setLoading(true);
    setProgress(0);
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 12 + 6;
      if (p >= 100) {
        setProgress(100);
        clearInterval(interval);
        setRole(paramRole as Role);
        setTimeout(() => router.push(`/dashboard/${paramRole}`), 400);
      } else {
        setProgress(Math.min(p, 95));
      }
    }, 60);
  };

  // Auto-login after 800ms for demo convenience
  useEffect(() => {
    const t = setTimeout(handleLogin, 800);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-sm"
      >
        <div className="bg-white rounded-3xl border border-slate-200 shadow-[0_20px_60px_rgba(0,0,0,0.12)] overflow-hidden">
          {/* Header gradient */}
          <div className={`bg-gradient-to-br ${data.gradient} p-7 text-white`}>
            <div className={`w-14 h-14 rounded-2xl ${data.avatarBg}/30 border border-white/20 flex items-center justify-center text-white font-bold text-xl mb-4 backdrop-blur-sm`}>
              {data.name.charAt(0)}
            </div>
            <p className="text-xl font-bold leading-tight">{data.name}</p>
            <p className="text-white/75 text-sm mt-1 font-medium">{data.role}</p>
            <p className="text-white/45 text-xs mt-1">{data.title}</p>
            <div className="mt-4 text-xs text-white/50 border-t border-white/10 pt-3">
              Rayudu Gari Military Hotel
            </div>
          </div>

          <div className="p-6 space-y-4">
            {!loading ? (
              <>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-1.5 uppercase tracking-wide">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        readOnly
                        value={data.email}
                        className="w-full h-10 pl-10 pr-4 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none cursor-default select-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-1.5 uppercase tracking-wide">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        readOnly
                        type={showPass ? "text" : "password"}
                        value="demo@2026"
                        className="w-full h-10 pl-10 pr-10 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none cursor-default"
                      />
                      <button
                        onClick={() => setShowPass((v) => !v)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleLogin}
                  style={{ background: data.accent }}
                  className="w-full flex items-center justify-center gap-2 py-3 text-sm font-bold text-white rounded-xl hover:opacity-90 transition-opacity shadow-lg"
                >
                  Sign In as {data.role} <ArrowRight className="w-4 h-4" />
                </button>
                <p className="text-center text-xs text-slate-400">Demo mode · credentials pre-filled · auto-signing in…</p>
              </>
            ) : (
              <div className="py-6 space-y-5">
                <div className="text-center">
                  <div className="relative w-14 h-14 mx-auto mb-4">
                    <div className="w-14 h-14 rounded-full border-4 border-slate-100" />
                    <div
                      className="absolute inset-0 w-14 h-14 rounded-full border-4 border-transparent animate-spin"
                      style={{ borderTopColor: data.accent }}
                    />
                    <div className={`absolute inset-2 rounded-full ${data.avatarBg} flex items-center justify-center text-white text-sm font-bold`}>
                      {data.name.charAt(0)}
                    </div>
                  </div>
                  <p className="text-base font-bold text-slate-900">Signing in…</p>
                  <p className="text-sm text-slate-500 mt-1">Loading {data.role} workspace</p>
                </div>
                <div className="bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <motion.div
                    animate={{ width: `${progress}%` }}
                    transition={{ ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{ background: data.accent }}
                  />
                </div>
                <p className="text-center text-xs text-slate-400">{Math.round(progress)}% complete</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 text-center">
          <a href="/demo" className="text-sm text-slate-400 hover:text-slate-600 transition-colors">
            ← Choose different role
          </a>
        </div>
      </motion.div>
    </div>
  );
}
