import { FieldValue } from "firebase-admin/firestore";
import { getAdminDb } from "@/lib/firebaseAdmin";
import { studentMayAccessLiveClass, type AccessStudent } from "@/lib/liveClasses/access";
import { liveClassFromDoc, LIVE_CLASSES_COLLECTION, LIVE_CLASS_SECRETS_COLLECTION, publicLiveClass, timestampFromIso } from "@/lib/liveClasses/serialize";
import { computeClassroomStatus } from "@/lib/liveClasses/status";
import {
  createLiveStream,
  endLiveStream,
  getAuthorizedPlayback,
  getAuthorizedRecordingPlayback,
  getStreamIngestDetails,
  getStreamingProviderName,
  getStreamStatus,
} from "@/lib/streaming";
import type { CreateLiveClassInput, LiveClass, PlaybackAuthorization, StreamIngestDetails, StreamingProviderName } from "@/types/liveClass";
import type { StreamConnectionState } from "@/lib/streaming/types";
import { youtubeEmbedUrl } from "@/lib/youtube";

async function loadAccessIndexes(db: ReturnType<typeof getAdminDb>) {
  const [coursesSnap, batchesSnap] = await Promise.all([
    db.collection("courses").get(),
    db.collection("batches").get(),
  ]);

  const courseAliases = new Map<string, string[]>();
  for (const doc of coursesSnap.docs) {
    const data = doc.data();
    const aliases = [doc.id, data.courseId, data.title].map((value) => String(value ?? "").trim()).filter(Boolean);
    for (const key of aliases) {
      courseAliases.set(key, [...new Set([...(courseAliases.get(key) ?? []), ...aliases])]);
    }
  }

  const batchAliases = new Map<string, { keys: string[]; studentIds: string[] }>();
  for (const doc of batchesSnap.docs) {
    const data = doc.data();
    const keys = [doc.id, data.batchId, data.name].map((value) => String(value ?? "").trim()).filter(Boolean);
    const studentIds = Array.isArray(data.studentIds) ? data.studentIds.map(String) : [];
    const record = { keys: [...new Set(keys)], studentIds };
    for (const key of record.keys) batchAliases.set(key, record);
  }

  return { courseAliases, batchAliases };
}

function extrasForClass(
  data: { courseId?: unknown; courseTitle?: unknown; batchIds?: unknown; batchName?: unknown },
  indexes: Awaited<ReturnType<typeof loadAccessIndexes>>,
) {
  const courseKeys = [
    data.courseId,
    data.courseTitle,
    ...(Array.isArray((data as { courseIds?: unknown }).courseIds) ? (data as { courseIds: unknown[] }).courseIds : []),
  ].map((value) => String(value ?? "").trim()).filter(Boolean);
  const courseAliases = [...new Set(courseKeys.flatMap((key) => indexes.courseAliases.get(key) ?? [key]))];
  const batchIds = Array.isArray(data.batchIds) ? data.batchIds.map(String) : [];
  if (data.batchName) batchIds.push(String(data.batchName));
  const matchedBatches = batchIds.map((id) => indexes.batchAliases.get(id)).filter(Boolean);
  return {
    courseAliases,
    batchAliases: [...new Set(matchedBatches.flatMap((item) => item!.keys))],
    batchStudentIds: [...new Set(matchedBatches.flatMap((item) => item!.studentIds))],
  };
}

async function connectionFor(streamId?: string): Promise<StreamConnectionState> {
  if (!streamId) return "unknown";
  try {
    const status = await getStreamStatus(streamId);
    return status.connection;
  } catch {
    return "unknown";
  }
}

export async function loadLiveClass(id: string) {
  const db = getAdminDb();
  const doc = await db.collection(LIVE_CLASSES_COLLECTION).doc(id).get();
  if (!doc.exists) {
    throw Object.assign(new Error("Live class not found."), { status: 404 });
  }
  const secretSnap = await db.collection(LIVE_CLASS_SECRETS_COLLECTION).doc(id).get();
  const streamId = secretSnap.exists ? String(secretSnap.data()?.providerStreamId ?? "") : "";
  const preview = liveClassFromDoc({ id: doc.id, data: () => doc.data()! }, "unknown");
  const connection = preview.playbackMode === "youtube" ? "connected" : await connectionFor(streamId || undefined);
  let liveClass = liveClassFromDoc({ id: doc.id, data: () => doc.data()! }, connection);

  if (streamId && liveClass.playbackMode === "secure" && liveClass.recordingEnabled && liveClass.recordingStatus !== "available") {
    try {
      const status = await getStreamStatus(streamId);
      if (status.recordingReady && status.recordingId) {
        await doc.ref.update({
          recordingId: status.recordingId,
          recordingStatus: "available",
          updatedAt: FieldValue.serverTimestamp(),
        });
        liveClass = { ...liveClass, recordingId: status.recordingId, recordingStatus: "available" };
      } else if (status.recordingFailed) {
        await doc.ref.update({ recordingStatus: "failed", updatedAt: FieldValue.serverTimestamp() });
        liveClass = { ...liveClass, recordingStatus: "failed" };
      }
    } catch {
      // Keep stored recording status if the provider lookup fails.
    }
  }

  return { liveClass, streamId, secret: secretSnap.data() ?? null, ref: doc.ref };
}

export async function assertStudentCanAccess(student: AccessStudent, liveClass: LiveClass) {
  const extras = extrasForClass(liveClass, await loadAccessIndexes(getAdminDb()));
  const access = studentMayAccessLiveClass(student, liveClass, extras);
  if (!access.ok) {
    throw Object.assign(new Error(access.reason), { status: 403 });
  }
}

export async function listLiveClassesForStudent(student: AccessStudent): Promise<LiveClass[]> {
  const db = getAdminDb();
  let snap;
  try {
    snap = await db.collection(LIVE_CLASSES_COLLECTION).orderBy("startTime", "desc").limit(200).get();
  } catch {
    snap = await db.collection(LIVE_CLASSES_COLLECTION).limit(200).get();
  }
  const indexes = await loadAccessIndexes(db);
  const accessible: LiveClass[] = [];

  for (const doc of snap.docs) {
    const data = doc.data();
    const extras = extrasForClass(data, indexes);
    const access = studentMayAccessLiveClass(student, {
      courseId: String(data.courseId ?? ""),
      courseTitle: data.courseTitle ? String(data.courseTitle) : undefined,
      courseIds: Array.isArray(data.courseIds) ? data.courseIds.map(String) : [],
      batchIds: Array.isArray(data.batchIds) ? data.batchIds.map(String) : [],
      batchName: data.batchName ? String(data.batchName) : undefined,
      allowedStudentIds: Array.isArray(data.allowedStudentIds) ? data.allowedStudentIds.map(String) : [],
    }, extras);
    if (!access.ok) continue;
    const isYoutube = data.playbackMode === "youtube" || data.streamingProvider === "youtube" || data.youtubeVideoId;
    const secret = isYoutube ? undefined : (await db.collection(LIVE_CLASS_SECRETS_COLLECTION).doc(doc.id).get()).data();
    const resolvedStreamId = String(secret?.providerStreamId ?? data.providerStreamId ?? "");
    const uiGuess = computeClassroomStatus({
      storedStatus: String(data.status ?? "upcoming"),
      startTime: data.startTime,
      endTime: data.endTime,
      connection: "unknown",
      playbackMode: String(data.playbackMode ?? ""),
    }).uiStatus;
    const needsLiveCheck = !isYoutube && (uiGuess === "live" || uiGuess === "waiting_for_teacher");
    const connection = isYoutube ? "connected" : needsLiveCheck ? await connectionFor(resolvedStreamId || undefined) : "unknown";
    accessible.push(liveClassFromDoc(doc, connection));
  }

  return accessible;
}

export async function listAllLiveClasses(): Promise<LiveClass[]> {
  const db = getAdminDb();
  const snap = await db.collection(LIVE_CLASSES_COLLECTION).orderBy("startTime", "desc").limit(200).get();
  return Promise.all(
    snap.docs.map(async (doc) => {
      const data = doc.data();
      const isYoutube = data.playbackMode === "youtube" || data.streamingProvider === "youtube" || data.youtubeVideoId;
      if (isYoutube) {
        return liveClassFromDoc(doc, "connected");
      }
      const secret = await db.collection(LIVE_CLASS_SECRETS_COLLECTION).doc(doc.id).get();
      const streamId = secret.exists ? String(secret.data()?.providerStreamId ?? "") : "";
      const uiGuess = computeClassroomStatus({
        storedStatus: String(data.status ?? "upcoming"),
        startTime: data.startTime,
        endTime: data.endTime,
        connection: "unknown",
        playbackMode: String(data.playbackMode ?? ""),
      }).uiStatus;
      const connection = uiGuess === "upcoming" || uiGuess === "cancelled" || uiGuess === "completed"
        ? "unknown"
        : await connectionFor(streamId || undefined);
      return liveClassFromDoc(doc, connection);
    }),
  );
}

export async function createLiveClassRecord(input: CreateLiveClassInput, createdBy: string) {
  const start = timestampFromIso(input.startTime);
  const end = timestampFromIso(input.endTime);
  if (end.toMillis() <= start.toMillis()) {
    throw Object.assign(new Error("End time must be after start time."), { status: 400 });
  }

  const db = getAdminDb();
  const ref = db.collection(LIVE_CLASSES_COLLECTION).doc();
  const playbackMode = input.playbackMode === "legacy" ? "legacy" : "secure";
  const recordingEnabled = input.recordingEnabled !== false && playbackMode === "secure";
  const provider = getStreamingProviderName();

  let streamId = "";
  let ingest: StreamIngestDetails | null = null;

  if (playbackMode === "secure") {
    const stream = await createLiveStream({
      liveClassId: ref.id,
      title: input.title,
      recordingEnabled,
    });
    streamId = stream.streamId;
    ingest = {
      provider: stream.provider,
      protocol: "rtmps",
      ingestUrl: stream.ingestUrl,
      streamKey: stream.streamKey,
      srtUrl: stream.srtUrl,
      srtPassphrase: stream.srtPassphrase,
      instructions: "In OBS, set Service to Custom, paste the ingest URL as Server, and paste the stream key. Never share these credentials with students.",
    };
    await db.collection(LIVE_CLASS_SECRETS_COLLECTION).doc(ref.id).set({
      liveClassId: ref.id,
      providerStreamId: stream.streamId,
      playbackId: stream.playbackId ?? stream.streamId,
      ingestUrl: stream.ingestUrl,
      streamKey: stream.streamKey,
      srtUrl: stream.srtUrl ?? "",
      srtPassphrase: stream.srtPassphrase ?? "",
      createdAt: FieldValue.serverTimestamp(),
    });
  }

  await ref.set({
    title: input.title.trim(),
    courseId: input.courseId,
    courseTitle: input.courseTitle ?? "",
    subjectId: input.subjectId ?? "",
    subjectName: input.subjectName ?? "",
    teacherId: input.teacherId ?? "",
    teacherName: input.teacherName.trim(),
    batchIds: input.batchIds ?? [],
    allowedStudentIds: input.allowedStudentIds ?? [],
    description: input.description ?? "",
    thumbnailUrl: input.thumbnailUrl ?? "",
    scheduledDate: start,
    startTime: start,
    endTime: end,
    status: "upcoming",
    playbackMode,
    streamingProvider: playbackMode === "secure" ? provider : null,
    recordingEnabled,
    recordingStatus: recordingEnabled ? "processing" : "disabled",
    recordingId: "",
    legacyMeetLink: input.legacyMeetLink ?? "",
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
    createdBy,
  });

  const created = await loadLiveClass(ref.id);
  return { liveClass: created.liveClass, ingest };
}

export async function getIngestForStaff(id: string): Promise<StreamIngestDetails> {
  const { liveClass, streamId } = await loadLiveClass(id);
  if (liveClass.playbackMode !== "secure" || !streamId) {
    throw Object.assign(new Error("This class does not have secure ingest credentials."), { status: 400 });
  }
  const details = await getStreamIngestDetails(streamId);
  return {
    provider: details.provider,
    protocol: "rtmps",
    ingestUrl: details.ingestUrl,
    streamKey: details.streamKey,
    srtUrl: details.srtUrl,
    srtPassphrase: details.srtPassphrase,
    instructions: "Configure OBS with this RTMPS server and stream key. Students never receive these values.",
  };
}

export async function authorizeStudentPlayback(
  student: AccessStudent,
  liveClassId: string,
  kind: "live" | "recording" = "live",
): Promise<{ liveClass: LiveClass; authorization: PlaybackAuthorization | null; message?: string }> {
  const { liveClass, streamId } = await loadLiveClass(liveClassId);
  const indexes = await loadAccessIndexes(getAdminDb());
  const extras = extrasForClass(liveClass, indexes);
  const access = studentMayAccessLiveClass(student, liveClass, extras);
  if (!access.ok) {
    throw Object.assign(new Error(access.reason), { status: 403 });
  }

  if (liveClass.playbackMode === "legacy") {
    throw Object.assign(new Error("This class uses a legacy external meeting link."), { status: 409 });
  }

  if (liveClass.playbackMode === "youtube") {
    if (!liveClass.youtubeVideoId) {
      throw Object.assign(new Error("This class does not have a YouTube video yet."), { status: 400 });
    }
    if (liveClass.uiStatus === "cancelled") {
      return { liveClass, authorization: null, message: "This live class was cancelled." };
    }
    if (kind === "live" && liveClass.uiStatus === "upcoming") {
      return { liveClass, authorization: null, message: "This class has not started yet." };
    }
    if (kind === "live" && liveClass.uiStatus === "completed") {
      if (liveClass.recordingEnabled) {
        return { liveClass, authorization: youtubeAuthorization(liveClass, "recording"), message: undefined };
      }
      return { liveClass, authorization: null, message: "This live class has ended." };
    }
    if (kind === "recording") {
      if (!liveClass.recordingEnabled) {
        return { liveClass, authorization: null, message: "Recording was not enabled for this class." };
      }
      return { liveClass, authorization: youtubeAuthorization(liveClass, "recording") };
    }
    return { liveClass, authorization: youtubeAuthorization(liveClass, "live") };
  }

  if (kind === "live") {
    if (liveClass.uiStatus === "cancelled") {
      return { liveClass, authorization: null, message: "This live class was cancelled." };
    }
    if (liveClass.uiStatus === "upcoming") {
      return { liveClass, authorization: null, message: "This class has not started yet." };
    }
    if (liveClass.uiStatus === "completed") {
      if (liveClass.recordingStatus === "available" && liveClass.recordingId) {
        const playback = await getAuthorizedRecordingPlayback(liveClass.recordingId);
        return {
          liveClass,
          authorization: {
            liveClassId,
            kind: "recording",
            protocol: "hls",
            playbackUrl: playback.playbackUrl,
            expiresAt: playback.expiresAt.toISOString(),
            provider: playbackProvider(liveClass),
          },
        };
      }
      return { liveClass, authorization: null, message: "This live class has ended." };
    }
    if (liveClass.uiStatus === "waiting_for_teacher" || !streamId) {
      return { liveClass, authorization: null, message: "The trainer has not started the live stream yet." };
    }
    const playback = await getAuthorizedPlayback(streamId);
    return {
      liveClass,
      authorization: {
        liveClassId,
        kind: "live",
        protocol: "hls",
        playbackUrl: playback.playbackUrl,
        expiresAt: playback.expiresAt.toISOString(),
        provider: playbackProvider(liveClass),
      },
    };
  }

  if (liveClass.recordingStatus === "disabled") {
    return { liveClass, authorization: null, message: "Recording was not enabled for this class." };
  }
  if (liveClass.recordingStatus === "processing" || !liveClass.recordingId) {
    return { liveClass, authorization: null, message: "The class recording is being processed." };
  }
  if (liveClass.recordingStatus === "failed") {
    return { liveClass, authorization: null, message: "The class recording could not be processed." };
  }
  const playback = await getAuthorizedRecordingPlayback(liveClass.recordingId);
  return {
    liveClass,
    authorization: {
      liveClassId,
      kind: "recording",
      protocol: "hls",
      playbackUrl: playback.playbackUrl,
      expiresAt: playback.expiresAt.toISOString(),
      provider: playbackProvider(liveClass),
    },
  };
}

function youtubeAuthorization(liveClass: LiveClass, kind: "live" | "recording"): PlaybackAuthorization {
  return {
    liveClassId: liveClass.id,
    kind,
    protocol: "youtube",
    playbackUrl: youtubeEmbedUrl(liveClass.youtubeVideoId || "", kind === "live"),
    expiresAt: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
    provider: "youtube",
  };
}

function playbackProvider(liveClass: LiveClass): StreamingProviderName {
  if (liveClass.streamingProvider === "mux") return "mux";
  if (liveClass.streamingProvider === "youtube" || liveClass.playbackMode === "youtube") return "youtube";
  return "cloudflare";
}

export async function endLiveClass(id: string) {
  const { liveClass, streamId, ref } = await loadLiveClass(id);
  if (streamId) {
    await endLiveStream(streamId).catch(() => undefined);
    try {
      const status = await getStreamStatus(streamId);
      await ref.update({
        status: "completed",
        recordingId: status.recordingId ?? liveClass.recordingId ?? "",
        recordingStatus: status.recordingReady ? "available" : liveClass.recordingEnabled ? "processing" : "disabled",
        updatedAt: FieldValue.serverTimestamp(),
      });
    } catch {
      await ref.update({ status: "completed", updatedAt: FieldValue.serverTimestamp() });
    }
  } else {
    await ref.update({ status: "completed", updatedAt: FieldValue.serverTimestamp() });
  }
  return (await loadLiveClass(id)).liveClass;
}

export async function updateLiveClass(id: string, patch: Partial<CreateLiveClassInput> & { status?: string }) {
  const db = getAdminDb();
  const ref = db.collection(LIVE_CLASSES_COLLECTION).doc(id);
  const snap = await ref.get();
  if (!snap.exists) throw Object.assign(new Error("Live class not found."), { status: 404 });

  const updates: Record<string, unknown> = { updatedAt: FieldValue.serverTimestamp() };
  if (patch.title) updates.title = patch.title.trim();
  if (patch.description !== undefined) updates.description = patch.description;
  if (patch.thumbnailUrl !== undefined) updates.thumbnailUrl = patch.thumbnailUrl;
  if (patch.teacherName) updates.teacherName = patch.teacherName.trim();
  if (patch.subjectName !== undefined) updates.subjectName = patch.subjectName;
  if (patch.courseTitle !== undefined) updates.courseTitle = patch.courseTitle;
  if (patch.batchIds) updates.batchIds = patch.batchIds;
  if (patch.allowedStudentIds) updates.allowedStudentIds = patch.allowedStudentIds;
  if (patch.startTime) updates.startTime = timestampFromIso(patch.startTime);
  if (patch.endTime) updates.endTime = timestampFromIso(patch.endTime);
  if (patch.status === "cancelled") updates.status = "cancelled";

  await ref.update(updates);
  return (await loadLiveClass(id)).liveClass;
}

export function toStudentLiveClass(liveClass: LiveClass) {
  return {
    ...publicLiveClass(liveClass),
    canJoin: liveClass.uiStatus === "live" || liveClass.uiStatus === "waiting_for_teacher",
  };
}

export async function applyProviderWebhook(payload: {
  eventType?: string;
  inputId?: string;
  videoUid?: string;
  readyToStream?: boolean;
}) {
  const db = getAdminDb();
  const inputId = payload.inputId;
  if (!inputId) return;

  const secrets = await db.collection(LIVE_CLASS_SECRETS_COLLECTION).where("providerStreamId", "==", inputId).limit(1).get();
  if (secrets.empty) return;
  const liveClassId = secrets.docs[0].id;
  const ref = db.collection(LIVE_CLASSES_COLLECTION).doc(liveClassId);
  const event = payload.eventType ?? "";

  if (event.includes("connected")) {
    await ref.update({ status: "live", updatedAt: FieldValue.serverTimestamp() });
    return;
  }
  if (event.includes("disconnected")) {
    await ref.update({ updatedAt: FieldValue.serverTimestamp() });
    return;
  }
  if (payload.videoUid) {
    await ref.update({
      recordingId: payload.videoUid,
      recordingStatus: payload.readyToStream === false ? "processing" : "available",
      updatedAt: FieldValue.serverTimestamp(),
    });
  }
}
