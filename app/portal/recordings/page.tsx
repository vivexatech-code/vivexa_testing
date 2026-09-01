"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PlayCircle, Video } from "lucide-react";
import { usePortalAuth } from "@/context/PortalAuthContext";
import { usePortalData } from "@/context/PortalDataContext";
import { EmptyState } from "@/components/portal/EmptyState";
import { portalFetch } from "@/lib/portalFetch";
import type { RecordingStatus } from "@/types/liveClass";

type YouTubeVideo = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
};

type ClassroomRecording = {
  id: string;
  title: string;
  description?: string;
  date: string;
  teacherName: string;
  courseTitle?: string;
  thumbnailUrl?: string;
  recordingStatus: RecordingStatus;
};

export default function RecordingsPage() {
  const { studentData } = usePortalAuth();
  const { recordings, dataLoading } = usePortalData();
  const [youtube, setYoutube] = useState<YouTubeVideo[]>([]);
  const [classroomRecordings, setClassroomRecordings] = useState<ClassroomRecording[]>([]);
  const [youtubeError, setYoutubeError] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await portalFetch("/api/portal/recordings") as {
          classroomRecordings?: ClassroomRecording[];
          youtube?: YouTubeVideo[];
          youtubeError?: string;
        };
        setClassroomRecordings(data.classroomRecordings ?? []);
        setYoutube(data.youtube ?? []);
        setYoutubeError(data.youtubeError ?? "");
      } catch (error) {
        setYoutubeError(error instanceof Error ? error.message : "Unable to load recordings.");
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, []);

  if (dataLoading || loading) {
    return (
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div key={item} className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
            <div className="aspect-video animate-pulse bg-gray-200" />
            <div className="space-y-3 p-5">
              <div className="h-5 animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (selectedVideo) {
    return (
      <div className="space-y-6">
        <button onClick={() => setSelectedVideo(null)} className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700">
          ← Back to recordings
        </button>
        <div className="overflow-hidden rounded-2xl bg-black shadow-xl">
          <div className="aspect-video w-full">
            <iframe
              className="h-full w-full"
              src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(selectedVideo.id)}?autoplay=1&rel=0`}
              title={selectedVideo.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Legacy batch recording</p>
          <h1 className="mt-1 text-2xl font-bold text-gray-900">{selectedVideo.title}</h1>
          {selectedVideo.description && <p className="mt-5 whitespace-pre-wrap rounded-2xl bg-gray-50 p-5 text-sm leading-6 text-gray-600">{selectedVideo.description}</p>}
        </div>
      </div>
    );
  }

  const hasAny = classroomRecordings.length || youtube.length || recordings.length;

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Class Recordings</h1>
        <p className="mt-1 text-sm text-gray-500">Watch completed classroom sessions and your batch library.</p>
      </div>

      <section className="space-y-4">
        <h2 className="font-black">Classroom recordings</h2>
        {classroomRecordings.length ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {classroomRecordings.map((item) => (
              item.recordingStatus === "available" ? (
                <Link key={item.id} href={`/portal/live-classes/${item.id}`} className="group overflow-hidden rounded-2xl border border-gray-200 bg-white text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                  <div className="relative aspect-video bg-slate-100">
                    {item.thumbnailUrl ? <img src={item.thumbnailUrl} alt="" className="h-full w-full object-cover" /> : <div className="grid h-full place-items-center text-[#6C3CE9]"><PlayCircle size={40} /></div>}
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-gray-900">{item.title}</h3>
                    <p className="mt-2 text-sm text-gray-500">{item.courseTitle || "Course"} · {item.teacherName}</p>
                  </div>
                </Link>
              ) : (
                <div key={item.id} className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-5">
                  <p className="text-xs font-black uppercase tracking-wide text-amber-600">{item.recordingStatus === "failed" ? "Recording failed" : "Processing"}</p>
                  <h3 className="mt-2 font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm text-slate-500">
                    {item.recordingStatus === "failed" ? "The class recording could not be processed." : "The class recording is being processed."}
                  </p>
                </div>
              )
            ))}
          </div>
        ) : (
          <p className="rounded-2xl border border-dashed bg-white p-8 text-center text-slate-500">Secure classroom recordings will appear here after live classes end.</p>
        )}
      </section>

      {recordings.length > 0 && (
        <section className="space-y-4">
          <h2 className="font-black">Assigned recordings</h2>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {recordings.map((item) => (
              <Link key={item.id} href={`/portal/recordings/${item.id}`} className="rounded-2xl border bg-white p-5 shadow-sm">
                <h3 className="font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-500">{item.date} · {item.duration}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="space-y-4">
        <h2 className="font-black">Batch library</h2>
        {youtubeError && !youtube.length && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">{youtubeError}</div>
        )}
        {youtube.length ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {youtube.map((video, index) => (
              <button key={video.id} onClick={() => setSelectedVideo(video)} className="group overflow-hidden rounded-2xl border border-gray-200 bg-white text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                <div className="relative aspect-video overflow-hidden bg-gray-100">
                  <img src={video.thumbnail} alt={video.title} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
                  <div className="absolute bottom-3 left-3 rounded-lg bg-black/75 px-3 py-1 text-xs font-semibold text-white">Class {index + 1}</div>
                </div>
                <div className="p-5">
                  <h2 className="line-clamp-2 font-semibold text-gray-900">{video.title}</h2>
                  <p className="mt-2 text-sm text-gray-500">Watch recording</p>
                </div>
              </button>
            ))}
          </div>
        ) : !youtubeError ? (
          <EmptyState
            icon={Video}
            title="No batch recordings available"
            description={studentData?.batch ? "Your batch playlist has not been added yet." : "Your account is not assigned to a batch yet."}
          />
        ) : null}
      </section>

      {!hasAny && !youtubeError && <EmptyState icon={Video} title="No recordings available" description="New class recordings will automatically appear here." />}
    </div>
  );
}
