import type { ClassroomUiStatus, LiveClassStatus, RecordingStatus } from "@/types/liveClass";
import type { StreamConnectionState } from "@/lib/streaming/types";

const EARLY_JOIN_MS = 10 * 60 * 1000;

export function parseDate(value: unknown): Date | null {
  if (!value) return null;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
  if (typeof value === "object" && value && "toDate" in value && typeof (value as { toDate: () => Date }).toDate === "function") {
    return (value as { toDate: () => Date }).toDate();
  }
  if (typeof value === "object" && value && "seconds" in value) {
    return new Date(Number((value as { seconds: number }).seconds) * 1000);
  }
  const date = new Date(String(value));
  return Number.isNaN(date.getTime()) ? null : date;
}

export function computeClassroomStatus(input: {
  storedStatus?: string;
  startTime: unknown;
  endTime: unknown;
  connection?: StreamConnectionState;
  playbackMode?: string;
  now?: Date;
}): { status: LiveClassStatus; uiStatus: ClassroomUiStatus } {
  if (input.storedStatus === "cancelled") {
    return { status: "cancelled", uiStatus: "cancelled" };
  }

  if (input.storedStatus === "completed") {
    return { status: "completed", uiStatus: "completed" };
  }

  const now = input.now ?? new Date();
  const start = parseDate(input.startTime);
  const end = parseDate(input.endTime);

  if (start && now.getTime() < start.getTime() - EARLY_JOIN_MS) {
    return { status: "upcoming", uiStatus: "upcoming" };
  }

  if (end && now.getTime() > end.getTime()) {
    return { status: "completed", uiStatus: "completed" };
  }

  if (input.playbackMode === "youtube" || input.connection === "connected") {
    return { status: "live", uiStatus: "live" };
  }

  return { status: "live", uiStatus: "waiting_for_teacher" };
}

export function recordingUiStatus(enabled: boolean, status?: RecordingStatus): RecordingStatus {
  if (!enabled) return "disabled";
  return status ?? "processing";
}
