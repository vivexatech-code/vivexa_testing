import { NextResponse } from "next/server";
import type { DocumentData } from "firebase-admin/firestore";
import { getPortalStudent } from "@/lib/portalAuth";
import { jsonError } from "@/lib/api/respond";
import { getAdminDb } from "@/lib/firebaseAdmin";
import { listLiveClassesForStudent } from "@/lib/liveClasses/service";

export const dynamic = "force-dynamic";

type YouTubeVideo = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
};

function playlistIdFromUrl(playlistUrl: string): string | null {
  try {
    return new URL(playlistUrl).searchParams.get("list");
  } catch {
    return null;
  }
}

async function youtubeVideos(playlistId: string): Promise<YouTubeVideo[]> {
  const apiKey = process.env.YOUTUBE_API_KEY || process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
  if (!apiKey) {
    throw Object.assign(new Error("YouTube API is not configured."), { status: 503 });
  }

  const videos: YouTubeVideo[] = [];
  let nextPageToken = "";

  do {
    const params = new URLSearchParams({
      part: "snippet,contentDetails",
      playlistId,
      maxResults: "50",
      key: apiKey,
    });
    if (nextPageToken) params.set("pageToken", nextPageToken);

    const response = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?${params.toString()}`, {
      cache: "no-store",
    });
    const data = await response.json() as {
      items?: Array<{
        contentDetails?: { videoId?: string };
        snippet?: { title?: string; description?: string; publishedAt?: string; thumbnails?: Record<string, { url?: string }> };
      }>;
      nextPageToken?: string;
      error?: { message?: string };
    };

    if (!response.ok) {
      throw Object.assign(new Error(data.error?.message || "YouTube API request failed."), { status: response.status });
    }

    for (const item of data.items ?? []) {
      const videoId = item.contentDetails?.videoId;
      if (!videoId) continue;
      videos.push({
        id: videoId,
        title: item.snippet?.title || "Class Recording",
        description: item.snippet?.description || "",
        thumbnail:
          item.snippet?.thumbnails?.high?.url ||
          item.snippet?.thumbnails?.medium?.url ||
          item.snippet?.thumbnails?.default?.url ||
          "",
        publishedAt: item.snippet?.publishedAt || "",
      });
    }

    nextPageToken = data.nextPageToken || "";
  } while (nextPageToken);

  return videos;
}

export async function GET(request: Request) {
  try {
    const student = await getPortalStudent(request);
    const liveClasses = await listLiveClassesForStudent(student);
    const classroomRecordings = liveClasses
      .filter((item) => item.recordingEnabled && item.uiStatus === "completed")
      .map((item) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        date: item.scheduledDate,
        teacherName: item.teacherName,
        courseTitle: item.courseTitle,
        thumbnailUrl: item.thumbnailUrl,
        recordingStatus: item.recordingStatus,
        source: "classroom" as const,
      }));

    const db = getAdminDb();
    const batchId = String(student.batch ?? "").trim();
    let youtube: YouTubeVideo[] = [];
    let youtubeError = "";

    if (batchId) {
      let batchData: DocumentData | undefined;
      const direct = await db.collection("batches").doc(batchId).get();
      if (direct.exists) batchData = direct.data();
      if (!batchData) {
        const querySnap = await db.collection("batches").where("batchId", "==", batchId).limit(1).get();
        if (!querySnap.empty) batchData = querySnap.docs[0].data();
      }
      if (!batchData) {
        const byName = await db.collection("batches").where("name", "==", batchId).limit(1).get();
        if (!byName.empty) batchData = byName.docs[0].data();
      }

      const playlistUrl = String(batchData?.playlistUrl || batchData?.youtubePlaylistUrl || batchData?.youtubePlaylist || "");
      const playlistId = playlistUrl ? playlistIdFromUrl(playlistUrl) : null;
      if (playlistId) {
        try {
          youtube = await youtubeVideos(playlistId);
        } catch (error) {
          youtubeError = error instanceof Error ? error.message : "Unable to load batch recordings.";
        }
      }
    }

    return NextResponse.json(
      { classroomRecordings, youtube, youtubeError },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  } catch (error) {
    return jsonError(error);
  }
}
