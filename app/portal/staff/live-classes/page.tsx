"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePortalCourses } from "@/hooks/usePortalCourses";
import { usePortalData } from "@/context/PortalDataContext";
import { portalFetch } from "@/lib/portalFetch";
import type { LiveClass } from "@/types/liveClass";

export default function StaffLiveClassesPage() {
  const { courses } = usePortalCourses();
  const { batches } = usePortalData();
  const [items, setItems] = useState<LiveClass[]>([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [created, setCreated] = useState<{ id: string; ingestUrl?: string; streamKey?: string } | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await portalFetch("/api/admin/live-classes") as { liveClasses?: LiveClass[] };
      setItems(data.liveClasses ?? []);
      setError("");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to load live classes.");
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  async function createClass(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    const form = new FormData(event.currentTarget);
    const course = courses.find((item) => item.id === String(form.get("courseId")) || item.courseId === String(form.get("courseId")));
    try {
      const payload = await portalFetch("/api/admin/live-classes", {
        method: "POST",
        body: JSON.stringify({
          title: String(form.get("title")),
          courseId: String(form.get("courseId")),
          courseTitle: course?.title,
          subjectName: String(form.get("subjectName") || ""),
          teacherName: String(form.get("teacherName")),
          description: String(form.get("description") || ""),
          thumbnailUrl: String(form.get("thumbnailUrl") || ""),
          startTime: new Date(String(form.get("startTime"))).toISOString(),
          endTime: new Date(String(form.get("endTime"))).toISOString(),
          recordingEnabled: form.get("recordingEnabled") === "on",
          batchIds: String(form.get("batchIds") || "").split(",").map((item) => item.trim()).filter(Boolean),
          allowedStudentIds: String(form.get("allowedStudentIds") || "").split(",").map((item) => item.trim()).filter(Boolean),
        }),
      }) as { liveClass: LiveClass; ingest?: { ingestUrl?: string; streamKey?: string } };
      setCreated({ id: payload.liveClass.id, ingestUrl: payload.ingest?.ingestUrl, streamKey: payload.ingest?.streamKey });
      event.currentTarget.reset();
      await load();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to create live class.");
    } finally {
      setBusy(false);
    }
  }

  const groups = {
    liveNow: items.filter((item) => item.uiStatus === "live" || item.uiStatus === "waiting_for_teacher"),
    upcoming: items.filter((item) => item.uiStatus === "upcoming"),
    completed: items.filter((item) => item.uiStatus === "completed"),
    recordings: items.filter((item) => item.recordingEnabled),
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black">Live Classes</h2>
        <p className="mt-1 text-sm text-slate-500">Create secure classroom sessions. OBS credentials are never shown to students.</p>
      </div>
      {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {created && (
        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <h3 className="font-black text-amber-900">OBS ingest created</h3>
          <p className="mt-2 text-sm text-amber-800">Keep this stream key private. Students cannot see it.</p>
          <p className="mt-3 break-all text-sm"><span className="font-bold">Server:</span> {created.ingestUrl}</p>
          <p className="mt-1 break-all text-sm"><span className="font-bold">Stream key:</span> {created.streamKey}</p>
          <Link href={`/portal/staff/live-classes/${created.id}`} className="mt-4 inline-block font-bold text-[#6C3CE9]">Open class details →</Link>
        </section>
      )}

      <section className="rounded-2xl border bg-white p-6 shadow-sm">
        <h3 className="font-black">Create Live Class</h3>
        <form onSubmit={createClass} className="mt-5 grid gap-4 md:grid-cols-2">
          <input name="title" required placeholder="Class title" className="rounded-xl border px-3 py-3 md:col-span-2" />
          <select name="courseId" required className="rounded-xl border px-3 py-3">
            <option value="">Select course</option>
            {courses.map((course) => <option key={course.id} value={course.courseId || course.id}>{course.title}</option>)}
          </select>
          <input name="subjectName" placeholder="Subject" className="rounded-xl border px-3 py-3" />
          <input name="teacherName" required placeholder="Trainer name" className="rounded-xl border px-3 py-3" />
          <input name="thumbnailUrl" placeholder="Thumbnail URL" className="rounded-xl border px-3 py-3" />
          <input name="startTime" type="datetime-local" required className="rounded-xl border px-3 py-3" />
          <input name="endTime" type="datetime-local" required className="rounded-xl border px-3 py-3" />
          <input name="batchIds" placeholder="Batch IDs (comma separated)" className="rounded-xl border px-3 py-3" />
          <input name="allowedStudentIds" placeholder="Optional student IDs" className="rounded-xl border px-3 py-3" />
          <textarea name="description" placeholder="Description" className="rounded-xl border px-3 py-3 md:col-span-2" />
          <label className="flex items-center gap-2 text-sm font-semibold md:col-span-2">
            <input name="recordingEnabled" type="checkbox" defaultChecked /> Enable recording
          </label>
          <p className="text-xs text-slate-500 md:col-span-2">Available batches: {batches.map((batch) => batch.batchId || batch.id).join(", ") || "none loaded"}</p>
          <button disabled={busy} className="rounded-xl bg-[#6C3CE9] px-4 py-3 font-bold text-white md:col-span-2">{busy ? "Creating…" : "Create secure live class"}</button>
        </form>
      </section>

      {([
        ["Live Now", groups.liveNow],
        ["Upcoming", groups.upcoming],
        ["Completed", groups.completed],
        ["Recordings", groups.recordings],
      ] as const).map(([label, list]) => (
        <section key={label} className="space-y-3">
          <h3 className="font-black">{label}</h3>
          {list.map((item) => (
            <Link key={`${label}-${item.id}`} href={`/portal/staff/live-classes/${item.id}`} className="block rounded-2xl border bg-white p-5 shadow-sm">
              <p className="text-xs font-black uppercase tracking-wide text-slate-400">{item.uiStatus.replaceAll("_", " ")}</p>
              <h4 className="mt-1 font-black">{item.title}</h4>
              <p className="mt-1 text-sm text-slate-500">{item.courseTitle} · {item.teacherName}</p>
            </Link>
          ))}
          {!list.length && <p className="rounded-2xl border border-dashed bg-white p-6 text-sm text-slate-500">None yet.</p>}
        </section>
      ))}
    </div>
  );
}
