import { cloudflareProvider, isCloudflareConfigured } from "./cloudflare";
import { muxProvider } from "./mux";
import type { StreamingProvider } from "./types";

export type { StreamingProvider } from "./types";
export * from "./types";

export function getStreamingProviderName(): "cloudflare" | "mux" {
  const configured = process.env.STREAMING_PROVIDER?.trim().toLowerCase();
  if (configured === "mux") return "mux";
  return "cloudflare";
}

export function getStreamingProvider(): StreamingProvider {
  const name = getStreamingProviderName();
  if (name === "mux") return muxProvider;
  if (!isCloudflareConfigured()) {
    throw new Error(
      "Cloudflare Stream is not configured. Set CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_STREAM_API_TOKEN, and CLOUDFLARE_STREAM_CUSTOMER_SUBDOMAIN.",
    );
  }
  return cloudflareProvider;
}

export function createLiveStream(...args: Parameters<StreamingProvider["createLiveStream"]>) {
  return getStreamingProvider().createLiveStream(...args);
}

export function getStreamIngestDetails(...args: Parameters<StreamingProvider["getStreamIngestDetails"]>) {
  return getStreamingProvider().getStreamIngestDetails(...args);
}

export function getAuthorizedPlayback(...args: Parameters<StreamingProvider["getAuthorizedPlayback"]>) {
  return getStreamingProvider().getAuthorizedPlayback(...args);
}

export function getAuthorizedRecordingPlayback(...args: Parameters<StreamingProvider["getAuthorizedRecordingPlayback"]>) {
  return getStreamingProvider().getAuthorizedRecordingPlayback(...args);
}

export function endLiveStream(...args: Parameters<StreamingProvider["endLiveStream"]>) {
  return getStreamingProvider().endLiveStream(...args);
}

export function getStreamStatus(...args: Parameters<StreamingProvider["getStreamStatus"]>) {
  return getStreamingProvider().getStreamStatus(...args);
}
