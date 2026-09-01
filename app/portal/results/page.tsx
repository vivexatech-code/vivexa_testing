"use client";

import { Trophy } from "lucide-react";
import { usePortalData } from "@/context/PortalDataContext";
import { ProgressBar } from "@/components/portal/ProgressBar";
import { EmptyState } from "@/components/portal/EmptyState";

export default function ResultsPage() {
  const { testHistory } = usePortalData();
  return <div><h2 className="text-2xl font-black">Results</h2><p className="mt-1 text-sm text-slate-500">Your completed assessment scores</p>{testHistory.length ? <div className="mt-6 space-y-4">{testHistory.map((test) => { const percent = test.maxScore ? Math.round(test.score / test.maxScore * 100) : 0; return <article key={test.id} className="rounded-2xl border bg-white p-5 shadow-sm"><div className="flex justify-between"><div><h3 className="font-black">{test.title}</h3><p className="mt-1 text-sm text-slate-500">{test.date} · {test.type}</p></div><p className="text-xl font-black">{test.score}/{test.maxScore}</p></div><div className="mt-5"><ProgressBar value={percent} label="Score" color={percent >= 60 ? "bg-emerald-500" : "bg-amber-500"} /></div></article>; })}</div> : <div className="mt-6"><EmptyState icon={Trophy} title="No results yet" description="Scores appear after you submit an assessment." /></div>}</div>;
}
