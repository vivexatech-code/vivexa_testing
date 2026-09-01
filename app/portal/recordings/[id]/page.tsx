"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { usePortalData } from "@/context/PortalDataContext";
import { getStreamingVideoUrl } from "@/lib/videoUrl";

export default function RecordingPlayerPage() {
  const { id } = useParams<{ id: string }>();
  const { recordings } = usePortalData();
  const recording = recordings.find((item) => item.id === id);

  if (!recording) {
    return (
      <div className="rounded-2xl border bg-white p-10 text-center">
        <h2 className="font-black">Recording not found</h2>
        <p className="mt-2 text-sm text-slate-500">Classroom recordings now open inside the live class page.</p>
        <Link href="/portal/recordings" className="mt-4 inline-block text-[#6C3CE9]">Back to recordings</Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <Link href="/portal/recordings" className="text-sm font-bold text-[#6C3CE9]">← All recordings</Link>
      <section className="overflow-hidden rounded-2xl bg-slate-950 shadow-xl">
        <video controls playsInline preload="metadata" poster={recording.thumbnailUrl} className="aspect-video w-full" src={getStreamingVideoUrl(recording.secureVideoUrl ?? "")}>
          Your browser does not support video playback.
        </video>
      </section>
      <section className="rounded-2xl border bg-white p-6">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Legacy assigned recording</p>
        <h2 className="mt-2 text-2xl font-black">{recording.title}</h2>
        <p className="mt-2 text-slate-500">{recording.topic || recording.description}</p>
        <p className="mt-3 text-sm text-slate-400">{recording.date} · {recording.duration}</p>
      </section>
    </div>
  );
}
