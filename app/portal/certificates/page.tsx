"use client";

import { Award, Download } from "lucide-react";
import { usePortalData } from "@/context/PortalDataContext";
import { EmptyState } from "@/components/portal/EmptyState";

export default function CertificatesPage() {
  const { certificates } = usePortalData();
  return <div><h2 className="text-2xl font-black">Certificates</h2><p className="mt-1 text-sm text-slate-500">Your verified learning credentials</p>{certificates.length ? <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{certificates.map((item) => <article key={item.id} className="rounded-2xl border bg-white p-6 shadow-sm"><span className="grid size-14 place-items-center rounded-2xl bg-amber-50 text-amber-600"><Award size={28} /></span><h3 className="mt-5 text-lg font-black">{item.courseName}</h3><p className="mt-1 text-sm text-slate-500">Issued {item.issueDate} · {item.organizationName}</p><a href={item.certificateUrl} target="_blank" rel="noreferrer" className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-[#6C3CE9] px-4 py-3 text-sm font-bold text-white"><Download size={17} />Open certificate</a></article>)}</div> : <div className="mt-6"><EmptyState icon={Award} title="No certificates yet" description="Earned certificates will appear here." /></div>}</div>;
}
