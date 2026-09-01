"use client";

import { UserRound } from "lucide-react";
import { usePortalAuth } from "@/context/PortalAuthContext";

export default function ProfilePage() {
  const { studentData } = usePortalAuth(); if (!studentData) return null;
  const details = [["Student ID", studentData.studentId], ["Email", studentData.email], ["Phone", studentData.phone], ["Course", studentData.course], ["Batch", studentData.batch], ["Roll number", studentData.rollNumber], ["Parent name", studentData.parentName], ["Qualification", studentData.qualification], ["Address", studentData.address], ["Status", studentData.status]];
  const initials = studentData.fullName.split(" ").map((part) => part[0]).slice(0, 2).join("").toUpperCase();
  return <div className="grid gap-6 lg:grid-cols-3"><section className="rounded-2xl border bg-white p-7 text-center shadow-sm"><span className="mx-auto grid size-24 place-items-center rounded-full bg-[#6C3CE9] text-2xl font-black text-white">{initials || <UserRound />}</span><h2 className="mt-5 text-xl font-black">{studentData.fullName}</h2><p className="mt-1 text-sm text-slate-500">{studentData.course}</p><span className="mt-4 inline-block rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">{studentData.status}</span></section><section className="rounded-2xl border bg-white p-6 shadow-sm lg:col-span-2"><h3 className="font-black">Student information</h3><dl className="mt-5 grid gap-4 sm:grid-cols-2">{details.map(([label, value]) => <div key={label} className="rounded-xl bg-slate-50 p-4"><dt className="text-xs font-bold uppercase text-slate-400">{label}</dt><dd className="mt-1 font-semibold text-slate-800">{value || "—"}</dd></div>)}</dl></section></div>;
}
