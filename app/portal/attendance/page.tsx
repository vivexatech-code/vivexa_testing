"use client";

import { Check, X } from "lucide-react";
import { usePortalData } from "@/context/PortalDataContext";
import { ProgressBar } from "@/components/portal/ProgressBar";

export default function AttendancePage() {
  const { attendance } = usePortalData(); const days = Array.from(new Set([...attendance.present, ...attendance.absent, ...attendance.upcoming])).sort((a, b) => a - b);
  return <div className="space-y-6"><section className="rounded-2xl border bg-white p-6 shadow-sm"><h2 className="text-2xl font-black">Attendance overview</h2><p className="mt-1 text-sm text-slate-500">{attendance.present.length} present · {attendance.absent.length} absent</p><div className="mt-6 max-w-2xl"><ProgressBar value={attendance.percentage} label="Overall attendance" color={attendance.percentage >= 75 ? "bg-emerald-500" : "bg-amber-500"} /></div></section><section className="rounded-2xl border bg-white p-6"><h3 className="font-black">Monthly record</h3><div className="mt-5 grid grid-cols-7 gap-2">{days.map((day) => { const present = attendance.present.includes(day); const absent = attendance.absent.includes(day); return <div key={day} className={`grid aspect-square place-items-center rounded-xl text-sm font-bold ${present ? "bg-emerald-50 text-emerald-700" : absent ? "bg-red-50 text-red-700" : "bg-slate-100 text-slate-500"}`}><span>{day}</span>{present ? <Check size={13} /> : absent ? <X size={13} /> : null}</div>; })}</div>{!days.length && <p className="mt-5 text-sm text-slate-500">No attendance records yet.</p>}</section></div>;
}
