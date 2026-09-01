export type StreamConnectionState = "unknown" | "connected" | "disconnected" | "error";

export interface CreateLiveStreamInput {
  liveClassId: string;
  title: string;
  recordingEnabled: boolean;
  allowedOrigins?: string[];
}

export interface ProviderLiveStream {
  provider: "cloudflare" | "mux";
  streamId: string;
  playbackId?: string;
  ingestUrl: string;
  streamKey: string;
  srtUrl?: string;
  srtPassphrase?: string;
}

export interface AuthorizedPlayback {
  protocol: "hls";
  playbackUrl: string;
  expiresAt: Date;
}

export interface StreamStatus {
  connection: StreamConnectionState;
  isLive: boolean;
  recordingReady: boolean;
  recordingId?: string;
  recordingFailed?: boolean;
}

export interface StreamingProvider {
  name: "cloudflare" | "mux";
  createLiveStream(input: CreateLiveStreamInput): Promise<ProviderLiveStream>;
  getStreamIngestDetails(streamId: string): Promise<ProviderLiveStream>;
  getAuthorizedPlayback(streamId: string, ttlSeconds?: number): Promise<AuthorizedPlayback>;
  getAuthorizedRecordingPlayback(recordingId: string, ttlSeconds?: number): Promise<AuthorizedPlayback>;
  getStreamStatus(streamId: string): Promise<StreamStatus>;
  endLiveStream(streamId: string): Promise<void>;
}
