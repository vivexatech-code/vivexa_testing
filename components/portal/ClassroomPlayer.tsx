"use client";

import { Maximize, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type PlayerState = "idle" | "loading" | "playing" | "paused" | "offline" | "error";

export function ClassroomPlayer({
  src,
  poster,
  live,
  onOffline,
}: {
  src: string;
  poster?: string;
  live?: boolean;
  onOffline?: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [state, setState] = useState<PlayerState>("loading");
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || !src) return;
    let destroyed = false;
    let hls: { destroy: () => void } | null = null;

    async function attach(player: HTMLVideoElement) {
      setState("loading");
      const nativeHls = player.canPlayType("application/vnd.apple.mpegurl");
      if (nativeHls) {
        player.src = src;
        try {
          await player.play();
          if (!destroyed) setState("playing");
        } catch {
          if (!destroyed) setState("paused");
        }
        return;
      }

      const { default: Hls } = await import("hls.js");
      if (!Hls.isSupported()) {
        setState("error");
        return;
      }
      const instance = new Hls({ enableWorker: true, lowLatencyMode: Boolean(live) });
      hls = instance;
      instance.loadSource(src);
      instance.attachMedia(player);
      instance.on(Hls.Events.MANIFEST_PARSED, () => {
        void player.play().then(() => {
          if (!destroyed) setState("playing");
        }).catch(() => {
          if (!destroyed) setState("paused");
        });
      });
      instance.on(Hls.Events.ERROR, (_event, data) => {
        if (!data.fatal) return;
        if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
          setState("offline");
          onOffline?.();
          return;
        }
        setState("error");
      });
    }

    void attach(el);
    return () => {
      destroyed = true;
      hls?.destroy();
      el.removeAttribute("src");
      el.load();
    };
  }, [src, live, onOffline]);

  function togglePlay() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      void video.play();
      setState("playing");
    } else {
      video.pause();
      setState("paused");
    }
  }

  function toggleMute() {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  }

  function changeVolume(value: number) {
    const video = videoRef.current;
    if (!video) return;
    video.volume = value;
    video.muted = value === 0;
    setVolume(value);
    setMuted(value === 0);
  }

  function fullscreen() {
    const node = videoRef.current?.parentElement;
    if (!node) return;
    if (document.fullscreenElement) void document.exitFullscreen();
    else void node.requestFullscreen();
  }

  return (
    <div className="relative overflow-hidden rounded-2xl bg-slate-950 shadow-xl">
      <video
        ref={videoRef}
        poster={poster}
        playsInline
        className="aspect-video w-full bg-black"
        onWaiting={() => setState("loading")}
        onPlaying={() => setState("playing")}
        onPause={() => setState((current) => (current === "loading" ? current : "paused"))}
      />
      {(state === "loading" || state === "offline" || state === "error") && (
        <div className="absolute inset-0 grid place-items-center bg-slate-950/70 text-center text-white">
          <div>
            <p className="font-black">
              {state === "loading" && "Preparing your classroom..."}
              {state === "offline" && "The live stream is currently unavailable."}
              {state === "error" && "Unable to load the classroom. Please try again."}
            </p>
          </div>
        </div>
      )}
      <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
        <button type="button" onClick={togglePlay} className="rounded-lg bg-white/10 p-2" aria-label={state === "playing" ? "Pause" : "Play"}>
          {state === "playing" ? <Pause size={18} /> : <Play size={18} />}
        </button>
        <button type="button" onClick={toggleMute} className="rounded-lg bg-white/10 p-2" aria-label={muted ? "Unmute" : "Mute"}>
          {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={muted ? 0 : volume}
          onChange={(event) => changeVolume(Number(event.target.value))}
          className="w-24 accent-[#6C3CE9]"
          aria-label="Volume"
        />
        {live && <span className="rounded-md bg-red-600 px-2 py-1 text-[11px] font-black tracking-wide">LIVE</span>}
        <span className="ml-auto text-xs font-semibold text-white/80">Vivexa Classroom</span>
        <button type="button" onClick={fullscreen} className="rounded-lg bg-white/10 p-2" aria-label="Fullscreen">
          <Maximize size={18} />
        </button>
      </div>
    </div>
  );
}
