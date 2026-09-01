"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Ban, Lock, Radio, VideoOff, WifiOff } from "lucide-react";
import { ClassroomPlayer } from "@/components/portal/ClassroomPlayer";
import { ClassroomState } from "@/components/portal/ClassroomState";
import { portalFetch } from "@/lib/portalFetch";
import type { ClassroomUiStatus, PlaybackAuthorization, RecordingStatus } from "@/types/liveClass";

interface ClassroomPayload {
  liveClass: {
    id: string;
    title: string;
    teacherName: string;
    courseTitle?: string;
    uiStatus: ClassroomUiStatus;
    recordingStatus: RecordingStatus;
    startTime: string;
    endTime: string;
    description?: string;
    thumbnailUrl?: string;
  };
  authorization: PlaybackAuthorization | null;
  message?: string;
}

export default function LiveClassroomPage() {
  const { id } = useParams<{ id: string }>();
  const [payload, setPayload] = useState<ClassroomPayload | null>(null);
  const [error, setError] = useState("");
  const [unauthorized, setUnauthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  const authorize = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const data = await portalFetch(`/api/portal/live-classes/${id}/authorize-playback`, {
        method: "POST",
        body: JSON.stringify({ kind: "live" }),
      }) as unknown as ClassroomPayload;
      setPayload((current) => {
        if (
          current?.authorization?.playbackUrl &&
          data.authorization?.playbackUrl &&
          current.liveClass.uiStatus === data.liveClass.uiStatus &&
          new Date(current.authorization.expiresAt).getTime() - Date.now() > 5 * 60 * 1000
        ) {
          return { ...data, authorization: current.authorization };
        }
        return data;
      });
      setUnauthorized(false);
      setError("");
    } catch (reason) {
      const message = reason instanceof Error ? reason.message : "Unable to load the classroom. Please try again.";
      if (message.toLowerCase().includes("access") || message.toLowerCase().includes("enrolled") || message.toLowerCase().includes("restricted") || message.toLowerCase().includes("active")) {
        setUnauthorized(true);
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void authorize(false);
  }, [authorize]);

  useEffect(() => {
    const status = payload?.liveClass.uiStatus;
    if (status === "waiting_for_teacher" || status === "upcoming") {
      const timer = window.setInterval(() => void authorize(true), 10000);
      return () => window.clearInterval(timer);
    }
    if (payload?.authorization) {
      const wait = Math.max(new Date(payload.authorization.expiresAt).getTime() - Date.now() - 5 * 60 * 1000, 60_000);
      const timer = window.setTimeout(() => void authorize(true), wait);
      return () => window.clearTimeout(timer);
    }
  }, [payload, authorize]);

  const liveClass = payload?.liveClass;
  const authorization = payload?.authorization;
  const status = liveClass?.uiStatus;

  return (
    <div className="space-y-6">
      <header className="rounded-3xl bg-gradient-to-br from-[#6C3CE9] to-indigo-600 p-6 text-white shadow-xl shadow-violet-200 sm:p-8">
        <p className="text-sm font-semibold text-violet-100">Vivexa Institute · Live Class</p>
        <h1 className="mt-2 text-3xl font-black">{liveClass?.title || "Classroom"}</h1>
        <p className="mt-2 text-sm text-violet-100">
          {liveClass?.courseTitle || "Course"} · Teacher: {liveClass?.teacherName || "Vivexa Faculty"}
        </p>
      </header>

      {loading && <ClassroomState icon={Radio} title="Preparing your classroom..." description="Verifying your access and loading the live session." />}
      {!loading && unauthorized && <ClassroomState icon={Lock} title="You don't have access to this class." description={error || "This classroom is only available to enrolled students."} tone="danger" />}
      {!loading && !unauthorized && error && !liveClass && <ClassroomState icon={WifiOff} title="Unable to load the classroom. Please try again." description={error} tone="danger" />}
      {!loading && liveClass && status === "upcoming" && (
        <ClassroomState icon={Radio} title="This class has not started yet." description={payload?.message || "Please come back at the scheduled start time."} />
      )}
      {!loading && liveClass && status === "waiting_for_teacher" && !authorization && (
        <ClassroomState icon={VideoOff} title="The teacher has not started the live stream yet." description="Stay on this page. The classroom will open automatically when the teacher goes live." tone="live" />
      )}
      {!loading && liveClass && status === "cancelled" && (
        <ClassroomState icon={Ban} title="This live class was cancelled." description="Please check your notifications for a rescheduled session." tone="danger" />
      )}
      {!loading && liveClass && status === "completed" && liveClass.recordingStatus === "processing" && (
        <ClassroomState icon={Radio} title="The class recording is being processed." description="The recording will appear here as soon as it is ready." />
      )}
      {!loading && liveClass && status === "completed" && liveClass.recordingStatus !== "available" && liveClass.recordingStatus !== "processing" && !authorization && (
        <ClassroomState icon={Ban} title="This live class has ended." description={payload?.message || "No recording is available for this session."} />
      )}
      {authorization && (
        <ClassroomPlayer
          src={authorization.playbackUrl}
          poster={liveClass?.thumbnailUrl}
          live={authorization.kind === "live"}
          onOffline={() => void authorize(true)}
        />
      )}

      {liveClass && (
        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            {(status === "live" || status === "waiting_for_teacher") && (
              <span className="rounded-lg bg-red-600 px-3 py-1 text-xs font-black text-white">🔴 LIVE</span>
            )}
            <h2 className="text-2xl font-black">{liveClass.title}</h2>
          </div>
          <p className="mt-3 text-sm text-slate-500">Teacher: {liveClass.teacherName}</p>
          <p className="mt-1 text-sm text-slate-500">
            {new Date(liveClass.startTime).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" })}
            {" – "}
            {new Date(liveClass.endTime).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" })}
          </p>
          {liveClass.description && <p className="mt-5 whitespace-pre-wrap text-sm leading-6 text-slate-600">{liveClass.description}</p>}
        </section>
      )}
    </div>
  );
}
