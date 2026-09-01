"use client";

import { usePortalAuth } from "@/context/PortalAuthContext";
import { useStaffAccess } from "@/hooks/useStaffAccess";
import { Lock } from "lucide-react";

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  const { loading } = usePortalAuth();
  const isStaff = useStaffAccess();
  if (loading) return <div className="grid min-h-64 place-items-center"><div className="size-10 animate-spin rounded-full border-4 border-violet-200 border-t-[#6C3CE9]" /></div>;
  if (!isStaff) {
    return (
      <div className="rounded-2xl border bg-white p-10 text-center">
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-red-50 text-red-600"><Lock /></span>
        <h2 className="mt-4 text-xl font-black">Staff access required</h2>
        <p className="mt-2 text-sm text-slate-500">To schedule classes, set <span className="font-semibold">role</span> to <span className="font-semibold">teacher</span> on your Firestore students document, or add your login email to <span className="font-semibold">PORTAL_STAFF_EMAILS</span> in .env.local and restart the server.</p>
      </div>
    );
  }
  return <>{children}</>;
}
