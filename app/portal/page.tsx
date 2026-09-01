"use client";

import Link from "next/link";
import { Bell, BookOpen, CalendarClock, CheckCircle2, ClipboardList, IndianRupee, Radio } from "lucide-react";
import { usePortalAuth } from "@/context/PortalAuthContext";
import { usePortalData } from "@/context/PortalDataContext";
import { useAuthorizedLiveClasses } from "@/hooks/useAuthorizedLiveClasses";
import { isStaffRole } from "@/lib/liveClasses/access";
import { StatCard } from "@/components/portal/StatCard";
import { ProgressBar } from "@/components/portal/ProgressBar";
import { CardSkeleton } from "@/components/portal/Skeleton";

export default function DashboardPage() {
  const { studentData } = usePortalAuth();
  const data = usePortalData();
  const live = useAuthorizedLiveClasses();
  const liveNow = live.now[0];
  if (isStaffRole(studentData?.role)) {
    return (
      <div className="space-y-7">
        <section className="rounded-3xl bg-gradient-to-br from-[#6C3CE9] to-indigo-600 p-7 text-white shadow-xl shadow-violet-200 sm:p-9">
          <p className="text-violet-100">Trainer portal</p>
          <h2 className="mt-1 text-3xl font-black">Welcome, {studentData?.fullName}</h2>
          <p className="mt-3 max-w-xl text-sm text-violet-100">Create a live class, copy the OBS stream key, and start teaching inside the Vivexa classroom.</p>
        </section>
        <section className="grid gap-4 sm:grid-cols-2">
          <Link href="/portal/staff/live-classes" className="rounded-2xl border bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
            <span className="grid size-12 place-items-center rounded-xl bg-violet-50 text-[#6C3CE9]"><Radio /></span>
            <h3 className="mt-4 text-lg font-black">Schedule a class</h3>
            <p className="mt-2 text-sm text-slate-500">Set the course, date, and time. You will receive the OBS ingest URL and stream key.</p>
          </Link>
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <span className="grid size-12 place-items-center rounded-xl bg-red-50 text-red-600"><CalendarClock /></span>
            <h3 className="mt-4 text-lg font-black">How to go live</h3>
            <p className="mt-2 text-sm text-slate-500">Open Schedule Classes, create the session, then in OBS use Server = RTMPS URL and Stream Key = the private key shown only to you.</p>
          </div>
        </section>
      </div>
    );
  }
  if (data.dataLoading) return <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 8 }, (_, i) => <CardSkeleton key={i} />)}</div>;
  return <div className="space-y-7">
    <section className="rounded-3xl bg-gradient-to-br from-[#6C3CE9] to-indigo-600 p-7 text-white shadow-xl shadow-violet-200 sm:p-9"><p className="text-violet-100">Welcome back,</p><h2 className="mt-1 text-3xl font-black">{studentData?.fullName} 👋</h2><p className="mt-3 max-w-xl text-sm text-violet-100">Keep building momentum. Every class, test, and practice session takes you closer to your goals.</p></section>
    {data.feeReminder.kind !== "none" && <Link href="/portal/fees" className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 font-semibold text-amber-900"><IndianRupee />{data.feeReminder.message}<span className="ml-auto text-sm">View fees →</span></Link>}
    {liveNow && <Link href={`/portal/live-classes/${liveNow.id}`} className="flex items-center gap-4 rounded-2xl border border-red-200 bg-red-50 p-5"><span className="animate-pulse rounded-xl bg-red-500 p-3 text-white"><Radio /></span><div><p className="font-black text-red-900">Live now: {liveNow.title}</p><p className="text-sm text-red-700">{liveNow.uiStatus === "waiting_for_teacher" ? "Waiting for teacher" : liveNow.subjectName || liveNow.courseTitle}</p></div><span className="ml-auto rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white">Join class</span></Link>}
    {!liveNow && data.liveClass && <a href={data.liveClass.meetLink} target="_blank" rel="noreferrer" className="flex items-center gap-4 rounded-2xl border border-red-200 bg-red-50 p-5"><span className="animate-pulse rounded-xl bg-red-500 p-3 text-white"><Radio /></span><div><p className="font-black text-red-900">Live now: {data.liveClass.title}</p><p className="text-sm text-red-700">{data.liveClass.topic}</p></div><span className="ml-auto rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white">Join class</span></a>}
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><StatCard label="Enrolled courses" value={data.enrolledCourses.length} icon={BookOpen} /><StatCard label="Attendance" value={`${data.attendance.percentage}%`} icon={CheckCircle2} /><StatCard label="Pending tests" value={data.enabledTests.length} icon={ClipboardList} /><StatCard label="Pending fee" value={`₹${(data.feeSummary?.remainingBalance ?? 0).toLocaleString("en-IN")}`} icon={IndianRupee} /></section>
    <div className="grid gap-6 xl:grid-cols-5">
      <section className="rounded-2xl border bg-white p-6 shadow-sm xl:col-span-3"><div className="flex justify-between"><h3 className="font-black">Active course</h3><Link href="/portal/courses" className="text-sm font-bold text-[#6C3CE9]">View all</Link></div>{data.enrolledCourse ? <div className="mt-6"><p className="text-xl font-bold">{data.enrolledCourse.title}</p><p className="mt-1 text-sm text-slate-500">{data.enrolledCourse.instructor || "Vivexa Faculty"}</p><div className="mt-5"><ProgressBar value={data.enrolledCourse.progress} label="Course progress" /></div></div> : <p className="mt-6 text-slate-500">No active enrollment.</p>}</section>
      <section className="rounded-2xl border bg-white p-6 shadow-sm xl:col-span-2"><div className="flex justify-between"><h3 className="font-black">Recent notifications</h3><Bell size={19} className="text-[#6C3CE9]" /></div><div className="mt-4 space-y-3">{data.notifications.slice(0, 3).map((item) => <Link href={item.route || "/portal/notifications"} key={item.id} className="block rounded-xl bg-slate-50 p-3"><p className="text-sm font-bold">{item.title}</p><p className="mt-1 line-clamp-1 text-xs text-slate-500">{item.message}</p></Link>)}{!data.notifications.length && <p className="text-sm text-slate-500">You&apos;re all caught up.</p>}</div></section>
    </div>
    <section className="rounded-2xl border bg-white p-6 shadow-sm"><h3 className="flex items-center gap-2 font-black"><CalendarClock className="text-[#6C3CE9]" />Upcoming classes</h3><div className="mt-4 grid gap-3 md:grid-cols-2">{(live.upcoming.length ? live.upcoming.slice(0, 4).map((item) => ({ id: item.id, title: item.title, when: new Date(item.startTime).toLocaleString("en-IN"), href: `/portal/live-classes/${item.id}` })) : data.upcomingClasses.slice(0, 4).map((item) => ({ id: item.id, title: item.title, when: `${item.date} · ${item.time}`, href: "/portal/classes" }))).map((item) => <Link href={item.href} key={item.id} className="rounded-xl border border-slate-200 p-4"><p className="font-bold">{item.title}</p><p className="mt-1 text-sm text-slate-500">{item.when}</p></Link>)}{!live.upcoming.length && !data.upcomingClasses.length && <p className="text-sm text-slate-500">No upcoming classes scheduled.</p>}</div></section>
  </div>;
}
