"use client";

import Link from "next/link";
import { Bell, Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { usePortalAuth } from "@/context/PortalAuthContext";
import { usePortalData } from "@/context/PortalDataContext";

const title = (path: string) => path === "/portal" ? "Dashboard" : path.split("/").filter(Boolean).slice(1).map((part) => part[0]?.toUpperCase() + part.slice(1).replaceAll("-", " ")).join(" / ");
const initials = (name: string) => name.split(" ").map((part) => part[0]).slice(0, 2).join("").toUpperCase();

export function PortalTopbar({ onMenu }: { onMenu: () => void }) {
  const path = usePathname(); const { studentData } = usePortalAuth(); const { unreadCount } = usePortalData();
  return (
    <header className="sticky top-0 z-20 flex h-18 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur-xl sm:px-7">
      <div className="flex items-center gap-3">
        <button onClick={onMenu} aria-label="Open navigation" className="rounded-xl border border-slate-200 p-2.5 lg:hidden"><Menu size={20} /></button>
        <div><h1 className="font-black text-slate-900 sm:text-lg">{title(path)}</h1><p className="hidden text-xs text-slate-500 sm:block">Learn, grow, and track your journey</p></div>
      </div>
      <div className="flex items-center gap-3">
        <Link href="/portal/notifications" className="relative rounded-xl border border-slate-200 p-2.5 text-slate-600 hover:bg-slate-50"><Bell size={20} />{unreadCount > 0 && <span className="absolute -right-1 -top-1 grid min-w-5 place-items-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">{unreadCount}</span>}</Link>
        <Link href="/portal/profile" className="grid size-10 place-items-center rounded-full bg-[#6C3CE9] text-sm font-bold text-white">{initials(studentData?.fullName ?? "S")}</Link>
      </div>
    </header>
  );
}
