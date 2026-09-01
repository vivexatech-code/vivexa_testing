"use client";

import { useEffect, useMemo, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

export type NoticeType = "offer" | "notice" | "popup" | "admission";

export type Notice = {
  id: string;
  title: string;
  description: string;
  type: NoticeType;
  color: string;
  priority: number;
  startDate?: string;
  endDate?: string;
  active: boolean;
  showInMarquee: boolean;
  showAsPopup: boolean;
  showOnHomepage: boolean;
  link?: string;
  createdAt: string;
  updatedAt: string;
};

function isWithinDateRange(notice: Notice, now: Date): boolean {
  if (!notice.startDate && !notice.endDate) return true;

  const start = notice.startDate ? new Date(notice.startDate) : null;
  const end = notice.endDate ? new Date(notice.endDate) : null;

  if (start && Number.isNaN(start.getTime())) return true;
  if (end && Number.isNaN(end.getTime())) return true;

  if (start && now < start) return false;
  if (end && now > end) return false;
  return true;
}

export function useNotices() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "notices"),
      (snap) => {
        const list = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<Notice, "id">),
        }));
        setNotices(list);
        setLoading(false);
        setError(null);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsub();
  }, []);

  const marqueeNotices = useMemo(() => {
    const now = new Date();
    return notices
      .filter(
        (n) =>
          n.active &&
          n.showInMarquee &&
          Boolean(n.title) &&
          isWithinDateRange(n, now)
      )
      .sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
  }, [notices]);

  const popupNotice = useMemo(() => {
    const now = new Date();
    const candidates = notices
      .filter(
        (n) =>
          n.active &&
          n.showAsPopup &&
          Boolean(n.title) &&
          isWithinDateRange(n, now)
      )
      .sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));

    return candidates[0] ?? null;
  }, [notices]);

  return { notices, marqueeNotices, popupNotice, loading, error };
}
