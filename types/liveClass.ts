export const LIVE_CLASS_STATUSES = ["upcoming", "live", "completed", "cancelled"] as const;
export type LiveClassStatus = (typeof LIVE_CLASS_STATUSES)[number];

export const CLASSROOM_UI_STATUSES = [
  "upcoming",
  "waiting_for_teacher",
  "live",
  "completed",
  "cancelled",
] as const;
export type ClassroomUiStatus = (typeof CLASSROOM_UI_STATUSES)[number];

export const RECORDING_STATUSES = ["disabled", "processing", "available", "failed"] as const;
export type RecordingStatus = (typeof RECORDING_STATUSES)[number];

export const STREAMING_PROVIDERS = ["cloudflare", "mux"] as const;
export type StreamingProviderName = (typeof STREAMING_PROVIDERS)[number];

export const PLAYBACK_MODES = ["secure", "legacy"] as const;
export type PlaybackMode = (typeof PLAYBACK_MODES)[number];

export interface ClassAccessRules {
  courseId: string;
  batchIds: string[];
  allowedStudentIds: string[];
}

export interface LiveClass {
  id: string;
  title: string;
  courseId: string;
  courseTitle?: string;
  subjectId?: string;
  subjectName?: string;
  teacherId?: string;
  teacherName: string;
  batchIds: string[];
  allowedStudentIds: string[];
  description?: string;
  thumbnailUrl?: string;
  scheduledDate: string;
  startTime: string;
  endTime: string;
  status: LiveClassStatus;
  uiStatus: ClassroomUiStatus;
  playbackMode: PlaybackMode;
  streamingProvider?: StreamingProviderName;
  recordingEnabled: boolean;
  recordingStatus: RecordingStatus;
  recordingId?: string;
  /** Legacy external meeting URL. Used only for old classes. */
  legacyMeetLink?: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
}

export interface LiveClassSecret {
  liveClassId: string;
  providerStreamId: string;
  ingestUrl?: string;
  streamKey?: string;
  srtUrl?: string;
  srtPassphrase?: string;
  playbackId?: string;
}

export interface PlaybackAuthorization {
  liveClassId: string;
  kind: "live" | "recording";
  protocol: "hls";
  playbackUrl: string;
  expiresAt: string;
  provider: StreamingProviderName;
}

export interface LiveClassListItem extends LiveClass {
  canJoin: boolean;
}

export interface StreamIngestDetails {
  provider: StreamingProviderName;
  protocol: "rtmps" | "srt";
  ingestUrl: string;
  streamKey: string;
  srtUrl?: string;
  srtPassphrase?: string;
  instructions: string;
}

export interface CreateLiveClassInput {
  title: string;
  courseId: string;
  courseTitle?: string;
  subjectId?: string;
  subjectName?: string;
  teacherId?: string;
  teacherName: string;
  batchIds?: string[];
  allowedStudentIds?: string[];
  description?: string;
  thumbnailUrl?: string;
  startTime: string;
  endTime: string;
  recordingEnabled?: boolean;
  playbackMode?: PlaybackMode;
  legacyMeetLink?: string;
}
