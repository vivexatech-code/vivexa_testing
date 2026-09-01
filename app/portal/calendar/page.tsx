"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePortalData } from "@/context/PortalDataContext";

export default function CalendarPage() {
  const data = usePortalData(); const [month, setMonth] = useState(() => new Date());
  const events = useMemo(() => [...data.calendarEvents, ...data.classes.map((item) => ({ id: `class-${item.id}`, title: item.title, date: item.date, time: item.time, type: "class" as const, color: "#6C3CE9" })), ...data.tests.filter((item) => item.dueDate).map((item) => ({ id: `test-${item.id}`, title: item.title, date: item.dueDate, time: "", type: "test" as const, color: "#f59e0b" }))], [data.calendarEvents, data.classes, data.tests]);
  const year = month.getFullYear(), index = month.getMonth(), first = new Date(year, index, 1).getDay(), count = new Date(year, index + 1, 0).getDate();
  const cells = [...Array.from({ length: first }, () => null), ...Array.from({ length: count }, (_, i) => i + 1)];
  return <div className="rounded-2xl border bg-white p-4 shadow-sm sm:p-6"><header className="flex items-center justify-between"><button onClick={() => setMonth(new Date(year, index - 1, 1))} className="rounded-lg border p-2"><ChevronLeft /></button><h2 className="text-xl font-black">{month.toLocaleDateString("en-IN", { month: "long", year: "numeric" })}</h2><button onClick={() => setMonth(new Date(year, index + 1, 1))} className="rounded-lg border p-2"><ChevronRight /></button></header><div className="mt-6 grid grid-cols-7 text-center text-xs font-bold uppercase text-slate-400">{["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((day) => <span key={day} className="py-2">{day}</span>)}</div><div className="grid grid-cols-7">{cells.map((day, position) => { const date = day ? `${year}-${String(index + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}` : ""; const matches = events.filter((event) => event.date.slice(0, 10) === date); return <div key={position} className="min-h-20 border border-slate-100 p-1.5 sm:min-h-28 sm:p-2">{day && <><span className="text-sm font-bold">{day}</span><div className="mt-1 space-y-1">{matches.slice(0, 2).map((event) => <div key={event.id} title={event.title} className="truncate rounded px-1.5 py-1 text-[10px] font-semibold text-white" style={{ backgroundColor: event.color }}>{event.title}</div>)}</div></>}</div>; })}</div></div>;
}
