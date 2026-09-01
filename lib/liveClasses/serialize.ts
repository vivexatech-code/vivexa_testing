import { Timestamp, type DocumentData, type QueryDocumentSnapshot } from "firebase-admin/firestore";
import type { LiveClass, PlaybackMode, RecordingStatus, StreamingProviderName } from "@/types/liveClass";
import { computeClassroomStatus, parseDate } from "@/lib/liveClasses/status";
import type { StreamConnectionState } from "@/lib/streaming/types";

export const LIVE_CLASSES_COLLECTION = "live_classes";
export const LIVE_CLASS_SECRETS_COLLECTION = "live_class_secrets";

export function toIso(value: unknown): string {
  const date = parseDate(value);
  return date ? date.toISOString() : "";
}

export function liveClassFromDoc(
  doc: QueryDocumentSnapshot | { id: string; data(): DocumentData },
  connection: StreamConnectionState = "unknown",
): LiveClass {
  const data = doc.data();
  const startTime = toIso(data.startTime);
  const endTime = toIso(data.endTime);
  const computed = computeClassroomStatus({
    storedStatus: String(data.status ?? "upcoming"),
    startTime: data.startTime,
    endTime: data.endTime,
    connection,
  });

  return {
    id: doc.id,
    title: String(data.title ?? "Live class"),
    courseId: String(data.courseId ?? ""),
    courseTitle: data.courseTitle ? String(data.courseTitle) : undefined,
    subjectId: data.subjectId ? String(data.subjectId) : undefined,
    subjectName: data.subjectName ? String(data.subjectName) : undefined,
    teacherId: data.teacherId ? String(data.teacherId) : undefined,
    teacherName: String(data.teacherName ?? data.instructor ?? "Vivexa Faculty"),
    batchIds: Array.isArray(data.batchIds) ? data.batchIds.map(String) : [],
    allowedStudentIds: Array.isArray(data.allowedStudentIds) ? data.allowedStudentIds.map(String) : [],
    description: data.description ? String(data.description) : undefined,
    thumbnailUrl: data.thumbnailUrl ? String(data.thumbnailUrl) : undefined,
    scheduledDate: startTime.slice(0, 10) || String(data.scheduledDate ?? ""),
    startTime,
    endTime,
    status: computed.status,
    uiStatus: computed.uiStatus,
    playbackMode: (data.playbackMode === "legacy" ? "legacy" : "secure") as PlaybackMode,
    streamingProvider: data.streamingProvider as StreamingProviderName | undefined,
    recordingEnabled: Boolean(data.recordingEnabled),
    recordingStatus: (data.recordingStatus ?? (data.recordingEnabled ? "processing" : "disabled")) as RecordingStatus,
    recordingId: data.recordingId ? String(data.recordingId) : undefined,
    legacyMeetLink: data.legacyMeetLink || data.meetLink || data.liveClassLink || data.link ? String(data.legacyMeetLink || data.meetLink || data.liveClassLink || data.link) : undefined,
    createdAt: toIso(data.createdAt),
    updatedAt: toIso(data.updatedAt),
    createdBy: data.createdBy ? String(data.createdBy) : undefined,
  };
}

export function publicLiveClass(liveClass: LiveClass): Omit<LiveClass, "allowedStudentIds"> & { allowedStudentIds?: undefined } {
  const { allowedStudentIds: _hidden, ...rest } = liveClass;
  return rest;
}

export function timestampFromIso(value: string): Timestamp {
  const date = parseDate(value);
  if (!date) throw new Error("Invalid date.");
  return Timestamp.fromDate(date);
}
