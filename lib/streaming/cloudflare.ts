import { createPrivateKey } from "node:crypto";
import { SignJWT } from "jose";
import type {
  AuthorizedPlayback,
  CreateLiveStreamInput,
  ProviderLiveStream,
  StreamStatus,
  StreamingProvider,
} from "./types";

interface CloudflareLiveInput {
  uid: string;
  rtmps?: { url?: string; streamKey?: string };
  srt?: { url?: string; passphrase?: string };
  status?: unknown;
  recording?: { mode?: string };
}

interface CloudflareVideo {
  uid: string;
  liveInput?: string;
  readyToStream?: boolean;
  status?: { state?: string };
}

function requiredEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} is not configured.`);
  return value;
}

function accountId(): string {
  return requiredEnv("CLOUDFLARE_ACCOUNT_ID");
}

function apiToken(): string {
  return process.env.CLOUDFLARE_STREAM_API_TOKEN?.trim() || requiredEnv("CLOUDFLARE_API_TOKEN");
}

function customerHost(): string {
  const raw =
    process.env.CLOUDFLARE_STREAM_CUSTOMER_SUBDOMAIN?.trim() ||
    process.env.CLOUDFLARE_STREAM_CUSTOMER_CODE?.trim();
  if (!raw) throw new Error("CLOUDFLARE_STREAM_CUSTOMER_SUBDOMAIN is not configured.");
  if (raw.includes("cloudflarestream.com")) return raw.replace(/^https?:\/\//, "").replace(/\/$/, "");
  return `customer-${raw.replace(/^customer-/, "")}.cloudflarestream.com`;
}

function allowedOrigins(): string[] {
  const configured = process.env.CLOUDFLARE_STREAM_ALLOWED_ORIGINS?.split(",").map((item) => item.trim()).filter(Boolean);
  if (configured?.length) return configured;
  return ["vit.vivexatech.in", "localhost", "127.0.0.1"];
}

async function cf<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId()}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${apiToken()}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });
  const body = (await response.json()) as { success?: boolean; result?: T; errors?: Array<{ message?: string }> };
  if (!response.ok || body.success === false) {
    const message = body.errors?.[0]?.message || `Cloudflare Stream request failed (${response.status})`;
    throw new Error(message);
  }
  return body.result as T;
}

function connectionFromStatus(status: unknown): StreamStatus["connection"] {
  if (!status) return "disconnected";
  let parsed: { current?: { state?: string } } | string = status as { current?: { state?: string } } | string;
  if (typeof status === "string") {
    const trimmed = status.trim();
    if (trimmed.startsWith("{")) {
      try {
        parsed = JSON.parse(trimmed) as { current?: { state?: string } };
      } catch {
        parsed = trimmed;
      }
    } else {
      parsed = trimmed;
    }
  }
  const state =
    typeof parsed === "string"
      ? parsed
      : String(parsed.current?.state ?? "");
  if (state === "connected" || state === "reconnected") return "connected";
  if (state === "disconnected" || state === "client_disconnect" || state === "ttl_exceeded") return "disconnected";
  if (state === "failed_to_connect" || state === "failed_to_reconnect" || state === "errored") return "error";
  if (state === "reconnecting") return "disconnected";
  return "unknown";
}

function hlsUrl(tokenOrId: string): string {
  return `https://${customerHost()}/${tokenOrId}/manifest/video.m3u8`;
}

function decodePem(raw: string): string {
  const trimmed = raw.replace(/\\n/g, "\n").trim();
  if (trimmed.includes("BEGIN")) return trimmed;
  return Buffer.from(trimmed, "base64").toString("utf8");
}

async function signPlaybackToken(videoUid: string, ttlSeconds: number): Promise<{ token: string; expiresAt: Date }> {
  const keyId = process.env.CLOUDFLARE_STREAM_SIGNING_KEY_ID?.trim();
  const pemRaw = process.env.CLOUDFLARE_STREAM_SIGNING_KEY_PEM?.trim();
  const expiresAt = new Date(Date.now() + ttlSeconds * 1000);

  if (keyId && pemRaw) {
    const key = createPrivateKey(decodePem(pemRaw));
    const token = await new SignJWT({
      sub: videoUid,
      kid: keyId,
      downloadable: false,
    })
      .setProtectedHeader({ alg: "RS256", kid: keyId })
      .setExpirationTime(Math.floor(expiresAt.getTime() / 1000))
      .setNotBefore(Math.floor(Date.now() / 1000) - 10)
      .sign(key);
    return { token, expiresAt };
  }

  const result = await cf<{ token: string }>(`/stream/${videoUid}/token`, {
    method: "POST",
    body: JSON.stringify({ exp: Math.floor(expiresAt.getTime() / 1000), downloadable: false }),
  });
  return { token: result.token, expiresAt };
}

function toProviderStream(input: CloudflareLiveInput): ProviderLiveStream {
  return {
    provider: "cloudflare",
    streamId: input.uid,
    playbackId: input.uid,
    ingestUrl: input.rtmps?.url || "rtmps://live.cloudflare.com:443/live/",
    streamKey: input.rtmps?.streamKey || "",
    srtUrl: input.srt?.url,
    srtPassphrase: input.srt?.passphrase,
  };
}

export const cloudflareProvider: StreamingProvider = {
  name: "cloudflare",

  async createLiveStream(input: CreateLiveStreamInput): Promise<ProviderLiveStream> {
    const created = await cf<CloudflareLiveInput>("/stream/live_inputs", {
      method: "POST",
      body: JSON.stringify({
        meta: { name: input.title, liveClassId: input.liveClassId },
        recording: {
          mode: input.recordingEnabled ? "automatic" : "off",
          requireSignedURLs: true,
          allowedOrigins: input.allowedOrigins?.length ? input.allowedOrigins : allowedOrigins(),
          hideLiveViewerCount: true,
          timeoutSeconds: 30,
        },
      }),
    });
    return toProviderStream(created);
  },

  async getStreamIngestDetails(streamId: string): Promise<ProviderLiveStream> {
    const live = await cf<CloudflareLiveInput>(`/stream/live_inputs/${streamId}`);
    return toProviderStream(live);
  },

  async getAuthorizedPlayback(streamId: string, ttlSeconds = 90 * 60): Promise<AuthorizedPlayback> {
    const { token, expiresAt } = await signPlaybackToken(streamId, ttlSeconds);
    return { protocol: "hls", playbackUrl: hlsUrl(token), expiresAt };
  },

  async getAuthorizedRecordingPlayback(recordingId: string, ttlSeconds = 3 * 60 * 60): Promise<AuthorizedPlayback> {
    const { token, expiresAt } = await signPlaybackToken(recordingId, ttlSeconds);
    return { protocol: "hls", playbackUrl: hlsUrl(token), expiresAt };
  },

  async getStreamStatus(streamId: string): Promise<StreamStatus> {
    const live = await cf<CloudflareLiveInput>(`/stream/live_inputs/${streamId}`);
    const connection = connectionFromStatus(live.status);
    let recordingId: string | undefined;
    let recordingReady = false;
    let recordingFailed = false;

    try {
      const videos = await cf<CloudflareVideo[]>(`/stream?liveInput=${encodeURIComponent(streamId)}`);
      const list = Array.isArray(videos) ? videos : [];
      const latest = list[0];
      if (latest) {
        recordingId = latest.uid;
        recordingReady = Boolean(latest.readyToStream || latest.status?.state === "ready");
        recordingFailed = latest.status?.state === "error";
      }
    } catch {
      // Live status still useful if the recording lookup fails.
    }

    return {
      connection,
      isLive: connection === "connected",
      recordingReady,
      recordingId,
      recordingFailed,
    };
  },

  async endLiveStream(streamId: string): Promise<void> {
    await cf(`/stream/live_inputs/${streamId}`, {
      method: "PUT",
      body: JSON.stringify({
        uid: streamId,
        recording: { timeoutSeconds: 0 },
      }),
    }).catch(() => undefined);
  },
};

export function isCloudflareConfigured(): boolean {
  return Boolean(
    process.env.CLOUDFLARE_ACCOUNT_ID &&
      (process.env.CLOUDFLARE_STREAM_API_TOKEN || process.env.CLOUDFLARE_API_TOKEN) &&
      (process.env.CLOUDFLARE_STREAM_CUSTOMER_SUBDOMAIN || process.env.CLOUDFLARE_STREAM_CUSTOMER_CODE),
  );
}
