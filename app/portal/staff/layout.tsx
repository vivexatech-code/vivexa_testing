"use client";

import { usePortalAuth } from "@/context/PortalAuthContext";
import { isStaffRole } from "@/lib/liveClasses/access";
import { Lock } from "lucide-react";

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  const { studentData, loading } = usePortalAuth();
  if (loading) return <div className="grid min-h-64 place-items-center"><div className="size-10 animate-spin rounded-full border-4 border-violet-200 border-t-[#6C3CE9]" /></div>;
  if (!isStaffRole(studentData?.role)) {
    return (
      <div className="rounded-2xl border bg-white p-10 text-center">
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-red-50 text-red-600"><Lock /></span>
        <h2 className="mt-4 text-xl font-black">Staff access required</h2>
        <p className="mt-2 text-sm text-slate-500">Live class management is only available to teachers and administrators.</p>
      </div>
    );
  }
  return <>{children}</>;
}
