"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { BookOpen, ClipboardList, Radio, Video } from "lucide-react";
import { usePortalData } from "@/context/PortalDataContext";
import { useAuthorizedLiveClasses } from "@/hooks/useAuthorizedLiveClasses";
import { ProgressBar } from "@/components/portal/ProgressBar";

export default function CourseDetailPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const data = usePortalData();
  const liveClasses = useAuthorizedLiveClasses();
  const course = data.enrolledCourses.find((item) => item.courseId === courseId);
  if (!course) return <div className="rounded-2xl border bg-white p-10 text-center"><h2 className="text-xl font-black">Course not found</h2><Link href="/portal/courses" className="mt-4 inline-block text-[#6C3CE9]">Back to courses</Link></div>;
  const tests = data.tests.filter((item) => !item.courseId || item.courseId === courseId);
  const secureLive = liveClasses.now.find((item) => item.courseId === courseId);
  const legacyLive = data.liveClass?.courseId === courseId ? data.liveClass : null;
  return (
    <div className="space-y-6">
      {secureLive && (
        <Link href={`/portal/live-classes/${secureLive.id}`} className="flex items-center gap-3 rounded-2xl bg-red-50 p-4 font-bold text-red-700">
          <Radio className="animate-pulse" />{secureLive.title} is live <span className="ml-auto">Join →</span>
        </Link>
      )}
      {!secureLive && legacyLive && (
        <a target="_blank" rel="noreferrer" href={legacyLive.meetLink} className="flex items-center gap-3 rounded-2xl bg-red-50 p-4 font-bold text-red-700">
          <Radio className="animate-pulse" />{legacyLive.topic} is live <span className="ml-auto">Join →</span>
        </a>
      )}
      <section className="rounded-3xl bg-gradient-to-r from-[#6C3CE9] to-indigo-600 p-8 text-white">
        <p className="text-violet-100">{course.batch || "Active enrollment"}</p>
        <h2 className="mt-2 text-3xl font-black">{course.title}</h2>
        <p className="mt-2 text-violet-100">{course.instructor || "Vivexa Faculty"}</p>
        <div className="mt-7 max-w-xl"><ProgressBar value={course.progress} label="Course progress" color="bg-white" /></div>
      </section>
      <div className="grid gap-4 sm:grid-cols-3">
        {[["Materials", "/portal/materials", BookOpen], ["Recordings", "/portal/recordings", Video], ["Exams", "/portal/exams", ClipboardList]].map(([label, href, Icon]) => (
          <Link key={String(label)} href={String(href)} className="flex items-center gap-3 rounded-2xl border bg-white p-5 font-bold shadow-sm">
            <span className="rounded-xl bg-violet-50 p-3 text-[#6C3CE9]"><Icon /></span>{String(label)}
          </Link>
        ))}
      </div>
      <section className="rounded-2xl border bg-white p-6">
        <h3 className="font-black">Assessments</h3>
        <div className="mt-4 space-y-3">
          {tests.map((test) => (
            <div key={test.id} className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
              <div>
                <p className="font-bold">{test.title}</p>
                <p className="text-sm text-slate-500">{test.questions} questions · {test.duration} min</p>
              </div>
              {test.canAttempt && <Link href={`/portal/exams/${test.id}`} className="rounded-lg bg-[#6C3CE9] px-3 py-2 text-sm font-bold text-white">Attempt</Link>}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
