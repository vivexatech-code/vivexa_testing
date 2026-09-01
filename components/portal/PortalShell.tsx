"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { usePortalAuth } from "@/context/PortalAuthContext";
import { PortalDataProvider } from "@/context/PortalDataContext";
import { PortalSidebar } from "./PortalSidebar";
import { PortalTopbar } from "./PortalTopbar";

export function PortalShell({ children }: { children: React.ReactNode }) {
  const path = usePathname(); const router = useRouter(); const { user, loading, mustChangePassword } = usePortalAuth();
  const [drawer, setDrawer] = useState(false); const isLogin = path === "/portal/login"; const isChange = path === "/portal/change-password";
  useEffect(() => {
    if (loading) return;
    if (isLogin) { if (user) router.replace(mustChangePassword ? "/portal/change-password" : "/portal"); return; }
    if (!user) { router.replace("/portal/login"); return; }
    if (mustChangePassword && !isChange) router.replace("/portal/change-password");
    if (!mustChangePassword && isChange) router.replace("/portal");
  }, [loading, user, mustChangePassword, isLogin, isChange, router]);
  if (loading || (!isLogin && !user) || (user && mustChangePassword && !isChange)) return <div className="grid min-h-screen place-items-center bg-slate-50"><div className="size-10 animate-spin rounded-full border-4 border-violet-200 border-t-[#6C3CE9]" /></div>;
  if (isLogin || isChange) return <>{children}</>;
  return (
    <PortalDataProvider>
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <div className="fixed inset-y-0 left-0 hidden lg:block"><PortalSidebar /></div>
        <AnimatePresence>{drawer && <><motion.button aria-label="Close navigation" className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDrawer(false)} /><motion.div className="fixed inset-y-0 left-0 z-50 lg:hidden" initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }}><button onClick={() => setDrawer(false)} className="absolute right-3 top-3 z-10 rounded-lg p-2 text-slate-500"><X /></button><PortalSidebar onNavigate={() => setDrawer(false)} /></motion.div></>}</AnimatePresence>
        <div className="lg:pl-72"><PortalTopbar onMenu={() => setDrawer(true)} /><motion.main key={path} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-[1500px] p-4 sm:p-7">{children}</motion.main></div>
      </div>
    </PortalDataProvider>
  );
}
