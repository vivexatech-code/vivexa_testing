"use client";

import Link from "next/link";
import { CalendarClock, Radio } from "lucide-react";
import type { LiveClassListItem } from "@/types/liveClass";

function formatRange(start: string, end: string) {
  const from = new Date(start);
  const to = new Date(end);
  if (Number.isNaN(from.getTime())) return "";
  const date = from.toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });
  const time = `${from.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" })} – ${Number.isNaN(to.getTime()) ? "" : to.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" })}`;
  return `${date} · ${time}`;
}

const labels: Record<string, string> = {
  live: "LIVE",
  waiting_for_teacher: "WAITING FOR TRAINER",
  upcoming: "UPCOMING",
  completed: "COMPLETED",
  cancelled: "CANCELLED",
};

export function LiveClassCard({ item, href }: { item: LiveClassListItem; href: string }) {
  const live = item.uiStatus === "live";
  const waiting = item.uiStatus === "waiting_for_teacher";
  return (
    <article className={`overflow-hidden rounded-2xl border bg-white shadow-sm ${live ? "border-red-200" : "border-slate-200"}`}>
      {item.thumbnailUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={item.thumbnailUrl} alt="" className="aspect-video w-full object-cover" />
      )}
      <div className="flex gap-4 p-5">
        <span className={`grid size-12 shrink-0 place-items-center rounded-xl ${live || waiting ? "bg-red-50 text-red-600" : "bg-violet-50 text-[#6C3CE9]"}`}>
          {live || waiting ? <Radio /> : <CalendarClock />}
        </span>
        <div className="min-w-0 flex-1">
          <p className={`text-[11px] font-black tracking-wide ${live ? "text-red-600" : "text-slate-400"}`}>
            {live ? "🔴 " : ""}{labels[item.uiStatus] ?? item.uiStatus.toUpperCase()}
          </p>
          <h3 className="mt-1 font-black text-slate-900">{item.title}</h3>
          <p className="mt-1 text-sm text-slate-500">{item.courseTitle || "Course"}{item.subjectName ? ` · ${item.subjectName}` : ""}</p>
          <p className="mt-1 text-sm text-slate-500">Trainer: {item.teacherName}</p>
          <p className="mt-1 text-xs text-slate-400">{formatRange(item.startTime, item.endTime)}</p>
        </div>
        {item.playbackMode === "legacy" && item.legacyMeetLink ? (
          <a href={item.legacyMeetLink} target="_blank" rel="noreferrer" className="ml-auto self-center rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white">Join live</a>
        ) : (
          <Link href={href} className={`ml-auto self-center rounded-xl px-4 py-2 text-sm font-bold text-white ${live ? "bg-red-600" : "bg-[#6C3CE9]"}`}>
            {live ? "Join Live Class" : waiting ? "Enter classroom" : item.uiStatus === "completed" ? "Open recording" : "View class"}
          </Link>
        )}
      </div>
    </article>
  );
}
