"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDemoStore } from "@/store/demoStore";

export default function DashboardIndex() {
  const { role } = useDemoStore();
  const router = useRouter();
  useEffect(() => { router.replace(`/dashboard/${role}`); }, [role, router]);
  return null;
}
