"use client";

import { useCallback, useEffect, useState } from "react";
import { portalFetch } from "@/lib/portalFetch";
import type { LiveClassListItem } from "@/types/liveClass";

interface LiveClassPayload {
  liveClasses: LiveClassListItem[];
  now: LiveClassListItem[];
  upcoming: LiveClassListItem[];
  recorded: LiveClassListItem[];
}

export function useAuthorizedLiveClasses(pollMs = 20000) {
  const [data, setData] = useState<LiveClassPayload>({ liveClasses: [], now: [], upcoming: [], recorded: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const reload = useCallback(async () => {
    try {
      const payload = await portalFetch("/api/portal/live-classes") as unknown as LiveClassPayload;
      setData({
        liveClasses: payload.liveClasses ?? [],
        now: payload.now ?? [],
        upcoming: payload.upcoming ?? [],
        recorded: payload.recorded ?? [],
      });
      setError("");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to load live classes.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
    const timer = window.setInterval(() => void reload(), pollMs);
    return () => window.clearInterval(timer);
  }, [pollMs, reload]);

  return { ...data, loading, error, reload };
}
