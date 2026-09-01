"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { portalFetch } from "@/lib/portalFetch";
import type { LiveClass, StreamIngestDetails } from "@/types/liveClass";

export default function StaffLiveClassDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [liveClass, setLiveClass] = useState<LiveClass | null>(null);
  const [ingest, setIngest] = useState<StreamIngestDetails | null>(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const data = await portalFetch(`/api/admin/live-classes/${id}`) as { liveClass: LiveClass };
      setLiveClass(data.liveClass);
      try {
        const ingestData = await portalFetch(`/api/admin/live-classes/${id}/ingest`) as { ingest: StreamIngestDetails };
        setIngest(ingestData.ingest);
      } catch {
        setIngest(null);
      }
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to load class.");
    }
  }, [id]);

  useEffect(() => { void load(); }, [load]);

  async function endClass() {
    await portalFetch(`/api/admin/live-classes/${id}/end`, { method: "POST", body: "{}" });
    await load();
  }

  async function cancelClass() {
    await portalFetch(`/api/admin/live-classes/${id}`, { method: "PATCH", body: JSON.stringify({ status: "cancelled" }) });
    await load();
  }

  if (error) return <p className="rounded-xl bg-red-50 p-4 text-red-700">{error}</p>;
  if (!liveClass) return <p className="text-slate-500">Loading…</p>;

  return (
    <div className="space-y-6">
      <Link href="/portal/staff/live-classes" className="text-sm font-bold text-[#6C3CE9]">← Live classes</Link>
      <section className="rounded-2xl border bg-white p-6 shadow-sm">
        <p className="text-xs font-black uppercase tracking-wide text-slate-400">{liveClass.uiStatus.replaceAll("_", " ")}</p>
        <h2 className="mt-2 text-2xl font-black">{liveClass.title}</h2>
        <p className="mt-2 text-sm text-slate-500">{liveClass.courseTitle} · {liveClass.teacherName}</p>
        <p className="mt-2 text-sm text-slate-500">{new Date(liveClass.startTime).toLocaleString("en-IN")} – {new Date(liveClass.endTime).toLocaleString("en-IN")}</p>
        <p className="mt-4 text-sm">Recording: {liveClass.recordingStatus}</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <button onClick={() => void endClass()} className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white">End class</button>
          <button onClick={() => void cancelClass()} className="rounded-xl border px-4 py-2 text-sm font-bold text-red-600">Cancel</button>
        </div>
      </section>
      {ingest && (
        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <h3 className="font-black text-amber-950">Teacher OBS setup</h3>
          <p className="mt-2 text-sm text-amber-800">{ingest.instructions}</p>
          <p className="mt-4 break-all text-sm"><span className="font-bold">RTMPS URL:</span> {ingest.ingestUrl}</p>
          <p className="mt-2 break-all text-sm"><span className="font-bold">Stream key:</span> {ingest.streamKey}</p>
          {ingest.srtUrl && <p className="mt-2 break-all text-sm"><span className="font-bold">SRT URL:</span> {ingest.srtUrl}</p>}
        </section>
      )}
    </div>
  );
}
