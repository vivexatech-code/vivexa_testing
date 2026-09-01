"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, CalendarDays, ChartNoAxesCombined, CheckCircle2, CircleDollarSign, GraduationCap, Headphones, Home, Library, LogOut, Medal, Settings, UserRound, Video, Bell, ClipboardList, Radio } from "lucide-react";
import { usePortalAuth } from "@/context/PortalAuthContext";
import { useStaffAccess } from "@/hooks/useStaffAccess";

const studentNav = [
  ["Dashboard", "/portal", Home], ["My Courses", "/portal/courses", BookOpen], ["Classes", "/portal/classes", Video],
] as const;
const staffNav = [
  ["Schedule Classes", "/portal/staff/live-classes", Radio],
] as const;
const restNav = [
  ["Attendance", "/portal/attendance", CheckCircle2], ["Materials", "/portal/materials", Library], ["Recordings", "/portal/recordings", Video],
  ["Exams", "/portal/exams", ClipboardList], ["Results", "/portal/results", ChartNoAxesCombined], ["Certificates", "/portal/certificates", Medal],
  ["Fees", "/portal/fees", CircleDollarSign], ["Calendar", "/portal/calendar", CalendarDays], ["Notifications", "/portal/notifications", Bell],
  ["Progress", "/portal/progress", ChartNoAxesCombined], ["Profile", "/portal/profile", UserRound], ["Support", "/portal/support", Headphones],
  ["Settings", "/portal/settings", Settings],
] as const;

export function PortalSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname(); const { studentData, logout } = usePortalAuth();
  const isStaff = useStaffAccess();
  const items = isStaff ? [...studentNav, ...staffNav, ...restNav] : [...studentNav, ...restNav];
  return (
    <aside className="flex h-full w-72 flex-col border-r border-slate-200 bg-white">
      <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-5">
        <span className="grid size-11 place-items-center rounded-2xl bg-[#6C3CE9] text-white"><GraduationCap /></span>
        <div><p className="font-black text-slate-900">Vivexa Learn</p><p className="text-xs text-slate-500">Student Portal</p></div>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {items.map(([label, href, Icon]) => {
          const active = href === "/portal" ? pathname === href : pathname.startsWith(href);
          return <Link key={href} href={href} onClick={onNavigate} className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${active ? "bg-violet-50 text-[#6C3CE9]" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}><Icon size={18} />{label}</Link>;
        })}
      </nav>
      <div className="border-t border-slate-100 p-4">
        <p className="truncate px-3 text-xs text-slate-500">{studentData?.fullName}</p>
        <button onClick={() => void logout()} className="mt-2 flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50"><LogOut size={18} />Sign out</button>
      </div>
    </aside>
  );
}
