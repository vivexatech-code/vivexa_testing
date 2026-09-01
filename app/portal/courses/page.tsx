"use client";

import Link from "next/link";
import { BookOpen } from "lucide-react";
import { usePortalData } from "@/context/PortalDataContext";
import { ProgressBar } from "@/components/portal/ProgressBar";
import { EmptyState } from "@/components/portal/EmptyState";

export default function CoursesPage() {
  const { enrolledCourses } = usePortalData();
  return <div><div className="mb-6 flex items-end justify-between"><div><h2 className="text-2xl font-black">My courses</h2><p className="mt-1 text-sm text-slate-500">Your active learning paths</p></div><Link href="/courses" className="rounded-xl border px-4 py-2 text-sm font-bold text-[#6C3CE9]">Browse catalog</Link></div>{!enrolledCourses.length ? <EmptyState icon={BookOpen} title="No enrolled courses" description="Your active enrollments will appear here." /> : <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{enrolledCourses.map((course) => <Link href={`/portal/courses/${course.courseId}`} key={course.courseId} className="rounded-2xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"><span className="grid size-12 place-items-center rounded-xl bg-violet-50 text-[#6C3CE9]"><BookOpen /></span><h3 className="mt-5 text-lg font-black">{course.title}</h3><p className="mt-1 text-sm text-slate-500">{course.instructor || "Vivexa Faculty"} · {course.batch || "Active batch"}</p><div className="mt-6"><ProgressBar value={course.progress} label="Progress" /></div><p className="mt-5 text-sm font-bold text-[#6C3CE9]">Open course →</p></Link>)}</div>}</div>;
}
