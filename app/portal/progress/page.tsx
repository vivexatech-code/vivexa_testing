"use client";

import { Award, Clock, Flame } from "lucide-react";
import { usePortalData } from "@/context/PortalDataContext";
import { ProgressBar } from "@/components/portal/ProgressBar";
import { StatCard } from "@/components/portal/StatCard";

export default function ProgressPage() {
  const { performance, studyStats, weeklyActivity } = usePortalData(); const max = Math.max(1, ...weeklyActivity.map((item) => item.hours));
  return <div className="space-y-6"><section className="grid gap-4 sm:grid-cols-3"><StatCard label="Overall score" value={`${performance.overallScore}%`} icon={Award} /><StatCard label="Study time" value={studyStats.totalStudyTime} icon={Clock} /><StatCard label="Active streak" value={`${studyStats.activeStreak} days`} icon={Flame} /></section><section className="rounded-2xl border bg-white p-6 shadow-sm"><h2 className="text-xl font-black">Performance</h2><div className="mt-6 space-y-5"><ProgressBar value={performance.attendanceScore} label="Attendance" color="bg-emerald-500" /><ProgressBar value={performance.testScore} label="Tests" color="bg-amber-500" /><ProgressBar value={performance.progressScore} label="Course progress" /></div></section><section className="rounded-2xl border bg-white p-6"><h3 className="font-black">Weekly activity</h3><div className="mt-6 flex h-48 items-end gap-3">{weeklyActivity.map((item) => <div key={item.day} className="flex flex-1 flex-col items-center gap-2"><span className="text-xs font-bold">{item.hours}h</span><div className="w-full max-w-12 rounded-t-lg bg-[#6C3CE9]" style={{ height: `${Math.max(8, item.hours / max * 140)}px` }} /><span className="text-xs text-slate-500">{item.day}</span></div>)}{!weeklyActivity.length && <p className="self-center text-sm text-slate-500">No weekly activity recorded.</p>}</div></section></div>;
}
