import type {
  AuthorizedPlayback,
  CreateLiveStreamInput,
  ProviderLiveStream,
  StreamStatus,
  StreamingProvider,
} from "./types";

function unavailable(): never {
  throw new Error("Mux is not the active streaming provider in this deployment.");
}

export const muxProvider: StreamingProvider = {
  name: "mux",
  createLiveStream(_input: CreateLiveStreamInput): Promise<ProviderLiveStream> {
    return unavailable();
  },
  getStreamIngestDetails(): Promise<ProviderLiveStream> {
    return unavailable();
  },
  getAuthorizedPlayback(): Promise<AuthorizedPlayback> {
    return unavailable();
  },
  getAuthorizedRecordingPlayback(): Promise<AuthorizedPlayback> {
    return unavailable();
  },
  getStreamStatus(): Promise<StreamStatus> {
    return unavailable();
  },
  endLiveStream(): Promise<void> {
    return unavailable();
  },
};
