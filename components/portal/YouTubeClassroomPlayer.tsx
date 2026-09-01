"use client";

export function YouTubeClassroomPlayer({
  src,
  live,
  title,
}: {
  src: string;
  live?: boolean;
  title?: string;
}) {
  return (
    <div className="overflow-hidden rounded-2xl bg-slate-950 shadow-xl">
      <div className="flex items-center justify-between bg-slate-950 px-4 py-3 text-white">
        <p className="text-sm font-black tracking-wide">Vivexa Classroom</p>
        {live && <span className="rounded-md bg-red-600 px-2 py-1 text-[11px] font-black tracking-wide">LIVE</span>}
      </div>
      <div className="relative aspect-video w-full bg-black">
        <iframe
          src={src}
          title={title || "Live class"}
          className="absolute inset-0 h-full w-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    </div>
  );
}
