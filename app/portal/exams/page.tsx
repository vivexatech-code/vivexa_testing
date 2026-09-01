"use client";

import Link from "next/link";
import { ClipboardList } from "lucide-react";
import { usePortalData } from "@/context/PortalDataContext";
import { EmptyState } from "@/components/portal/EmptyState";

export default function ExamsPage() {
  const { tests } = usePortalData();
  return <div><h2 className="text-2xl font-black">Exams & assessments</h2><p className="mt-1 text-sm text-slate-500">Complete enabled assessments before their due dates</p>{tests.length ? <div className="mt-6 space-y-4">{tests.map((test) => <article key={test.id} className="flex flex-col gap-4 rounded-2xl border bg-white p-5 shadow-sm sm:flex-row sm:items-center"><span className="rounded-xl bg-violet-50 p-3 text-[#6C3CE9]"><ClipboardList /></span><div><h3 className="font-black">{test.title}</h3><p className="mt-1 text-sm text-slate-500">{test.questions || test.questionItems?.length || 0} questions · {test.duration || Math.ceil((test.timeLimitInSeconds ?? 0) / 60)} min</p><p className="mt-1 text-xs text-slate-400">{test.isAssigned ? test.status : "Not assigned"}</p></div>{test.canAttempt ? <Link href={`/portal/exams/${test.id}`} className="sm:ml-auto rounded-xl bg-[#6C3CE9] px-4 py-2.5 text-center text-sm font-bold text-white">Start exam</Link> : <span className="sm:ml-auto rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-500">Unavailable</span>}</article>)}</div> : <div className="mt-6"><EmptyState icon={ClipboardList} title="No exams assigned" description="New assessments will appear here." /></div>}</div>;
}
