"use client";

import Link from "next/link";
import { useNotices, type NoticeType } from "@/hooks/useNotices";

const TYPE_LABELS: Record<NoticeType, string> = {
  offer: "Offer",
  notice: "Notice",
  popup: "Alert",
  admission: "Admission",
};

function NoticeItem({
  notice,
}: {
  notice: {
    id: string;
    title: string;
    type: NoticeType;
    color: string;
    link?: string;
  };
}) {
  const href = notice.link || "/admissions";
  const label = TYPE_LABELS[notice.type] ?? "Notice";

  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2.5 shrink-0 px-4 py-1 rounded-full hover:bg-white/10 transition-colors group"
    >
      <span
        className="w-2 h-2 rounded-full shrink-0 ring-2 ring-white/30"
        style={{ backgroundColor: notice.color || "#22d3ee" }}
        aria-hidden
      />
      <span className="text-[10px] font-bold uppercase tracking-wider text-white/70 border border-white/20 rounded px-1.5 py-0.5">
        {label}
      </span>
      <span className="text-sm font-semibold text-white whitespace-nowrap group-hover:underline underline-offset-2">
        {notice.title}
      </span>
      <span className="text-white/40 mx-2 select-none" aria-hidden>
        •
      </span>
    </Link>
  );
}

/** Slim premium marquee bar fixed below the site header. */
export default function NoticeMarquee() {
  const { marqueeNotices } = useNotices();

  if (marqueeNotices.length === 0) return null;

  const items = marqueeNotices;

  return (
    <div
      className="fixed top-[4.25rem] md:top-[4.5rem] left-0 right-0 z-40 w-full overflow-hidden border-b border-white/10 bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 shadow-md"
      role="region"
      aria-label="Latest notices"
      data-notice-marquee
    >
      <div className="notice-marquee-track flex w-max py-2">
        <div className="flex items-center">
          {items.map((n) => (
            <NoticeItem key={`a-${n.id}`} notice={n} />
          ))}
        </div>
        <div className="flex items-center" aria-hidden>
          {items.map((n) => (
            <NoticeItem key={`b-${n.id}`} notice={n} />
          ))}
        </div>
      </div>
    </div>
  );
}
