"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { CalendarClock, Radio } from "lucide-react";
import { db } from "@/lib/firebase";
import { usePortalAuth } from "@/context/PortalAuthContext";
import { usePortalData } from "@/context/PortalDataContext";
import { useAuthorizedLiveClasses } from "@/hooks/useAuthorizedLiveClasses";
import { useStaffAccess } from "@/hooks/useStaffAccess";
import { LiveClassCard } from "@/components/portal/LiveClassCard";
import { EmptyState } from "@/components/portal/EmptyState";
import { CardSkeleton } from "@/components/portal/Skeleton";

function countdown(start: string) {
  const diff = new Date(start).getTime() - Date.now();
  if (Number.isNaN(diff) || diff <= 0) return "";
  const hours = Math.floor(diff / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  if (hours >= 24) return `${Math.floor(hours / 24)}d ${hours % 24}h`;
  return `${hours}h ${minutes}m`;
}

export default function ClassesPage() {
  const { studentData } = usePortalAuth();
  const data = usePortalData();
  const live = useAuthorizedLiveClasses();
  const isStaff = useStaffAccess();
  const [courseId, setCourseId] = useState(data.enrolledCourse?.courseId ?? "");
  const [sent, setSent] = useState(false);

  const legacyLive = useMemo(
    () => data.classes.filter((item) => item.id === data.liveClass?.id && item.meetLink),
    [data.classes, data.liveClass],
  );
  const legacyUpcoming = useMemo(
    () => data.upcomingClasses.filter((item) => !live.liveClasses.some((liveItem) => liveItem.title === item.title && liveItem.startTime.startsWith(item.date))),
    [data.upcomingClasses, live.liveClasses],
  );

  async function requestLeave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const course = data.enrolledCourses.find((item) => item.courseId === courseId);
    await addDoc(collection(db, "leave_requests"), {
      studentId: studentData?.studentId,
      studentName: studentData?.fullName,
      courseId,
      courseTitle: course?.title,
      batchId: course?.batchId,
      batchName: course?.batch,
      leaveDate: String(form.get("date")),
      reason: String(form.get("reason")),
      status: "pending",
      createdAt: serverTimestamp(),
    });
    event.currentTarget.reset();
    setSent(true);
  }

  return (
    <div className="grid gap-6 xl:grid-cols-3">
      <section className="space-y-8 xl:col-span-2">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-black">Classes</h2>
            <p className="mt-1 text-sm text-slate-500">Join live sessions inside the Vivexa classroom.</p>
          </div>
          {isStaff && (
            <Link href="/portal/staff/live-classes" className="rounded-xl bg-[#6C3CE9] px-4 py-2.5 text-sm font-bold text-white">
              Schedule a class
            </Link>
          )}
        </div>

        <section className="space-y-4">
          <h3 className="flex items-center gap-2 font-black text-red-700"><Radio size={18} /> Live now</h3>
          {live.loading && <CardSkeleton />}
          {live.now.map((item) => <LiveClassCard key={item.id} item={item} href={`/portal/live-classes/${item.id}`} />)}
          {legacyLive.map((item) => (
            <article key={item.id} className="rounded-2xl border border-red-200 bg-white p-5 shadow-sm">
              <div className="flex gap-4">
                <span className="grid size-12 place-items-center rounded-xl bg-red-50 text-red-600"><Radio /></span>
                <div>
                  <p className="text-[11px] font-black text-red-600">🔴 LIVE · LEGACY</p>
                  <h3 className="font-black">{item.title}</h3>
                  <p className="mt-1 text-sm text-slate-500">{item.topic} · {item.instructor}</p>
                </div>
                {item.meetLink && <a href={item.meetLink} target="_blank" rel="noreferrer" className="ml-auto self-center rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white">Join live</a>}
              </div>
            </article>
          ))}
          {!live.loading && !live.now.length && !legacyLive.length && (
            <p className="rounded-2xl border border-dashed bg-white p-8 text-center text-slate-500">No classes are live right now.</p>
          )}
        </section>

        <section className="space-y-4">
          <h3 className="flex items-center gap-2 font-black"><CalendarClock size={18} className="text-[#6C3CE9]" /> Upcoming</h3>
          {live.upcoming.map((item) => (
            <div key={item.id} className="space-y-2">
              <LiveClassCard item={item} href={`/portal/live-classes/${item.id}`} />
              {countdown(item.startTime) && <p className="px-1 text-xs font-semibold text-[#6C3CE9]">Starts in {countdown(item.startTime)}</p>}
            </div>
          ))}
          {legacyUpcoming.map((item) => (
            <article key={item.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex gap-4">
                <span className="grid size-12 place-items-center rounded-xl bg-violet-50 text-[#6C3CE9]"><CalendarClock /></span>
                <div>
                  <h3 className="font-black">{item.title}</h3>
                  <p className="mt-1 text-sm text-slate-500">{item.topic} · {item.date} {item.time}</p>
                  <p className="mt-1 text-xs text-slate-500">{item.instructor}</p>
                </div>
              </div>
            </article>
          ))}
          {!live.loading && !live.upcoming.length && !legacyUpcoming.length && (
            <EmptyState icon={CalendarClock} title="No upcoming classes" description="New live classes will appear here once they are scheduled." />
          )}
        </section>

        <section className="space-y-4">
          <h3 className="font-black">Recorded classes</h3>
          {live.recorded.map((item) => <LiveClassCard key={item.id} item={item} href={`/portal/live-classes/${item.id}`} />)}
          {!live.loading && !live.recorded.length && (
            <p className="rounded-2xl border border-dashed bg-white p-8 text-center text-slate-500">Recorded classroom sessions will appear here after a live class ends.</p>
          )}
        </section>
      </section>

      <aside className="rounded-2xl border bg-white p-6 shadow-sm xl:sticky xl:top-24 xl:h-fit">
        <h3 className="font-black">Request leave</h3>
        <p className="mt-1 text-sm text-slate-500">Notify the institute before your class.</p>
        {sent && <p className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">Leave request submitted.</p>}
        <form onSubmit={requestLeave} className="mt-5 space-y-4">
          <select value={courseId} onChange={(event) => setCourseId(event.target.value)} className="w-full rounded-xl border px-3 py-3">
            {data.enrolledCourses.map((course) => <option key={course.courseId} value={course.courseId}>{course.title}</option>)}
          </select>
          <input name="date" type="date" required className="w-full rounded-xl border px-3 py-3" />
          <textarea name="reason" required placeholder="Reason" className="w-full rounded-xl border px-3 py-3" />
          <button className="w-full rounded-xl bg-[#6C3CE9] py-3 font-bold text-white">Submit request</button>
        </form>
      </aside>
    </div>
  );
}
