"use client";

import { Download, FileText } from "lucide-react";
import { usePortalData } from "@/context/PortalDataContext";
import { EmptyState } from "@/components/portal/EmptyState";

export default function MaterialsPage() {
  const { studyMaterials } = usePortalData();
  return <div><h2 className="text-2xl font-black">Study materials</h2><p className="mt-1 text-sm text-slate-500">Resources shared for your enrolled courses</p><div className="mt-6 space-y-3">{studyMaterials.map((item) => <article key={item.id} className="flex items-center gap-4 rounded-2xl border bg-white p-4 shadow-sm"><span className="rounded-xl bg-violet-50 p-3 text-[#6C3CE9]"><FileText /></span><div className="min-w-0"><h3 className="truncate font-bold">{item.title}</h3><p className="text-sm text-slate-500">{item.type || "Resource"}</p></div><a href={item.fileUrl} target="_blank" rel="noreferrer" className="ml-auto rounded-xl border p-2.5 text-[#6C3CE9]" aria-label={`Open ${item.title}`}><Download size={19} /></a></article>)}</div>{!studyMaterials.length && <div className="mt-6"><EmptyState icon={FileText} title="No materials yet" description="Files shared by your faculty will appear here." /></div>}</div>;
}
