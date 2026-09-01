"use client";

import { useEffect, useMemo, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

export type PublicCourse = {
  id: string;
  title: string;
  description: string;
  category?: string;
  duration?: string;
  level?: string;
  featured?: boolean;
  status?: string;
};

export function usePublicCourses(initialCourses: PublicCourse[] = []) {
  const [courses, setCourses] = useState<PublicCourse[]>(initialCourses);
  const [loading, setLoading] = useState(initialCourses.length === 0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "courses"),
      (snap) => {
        const list = snap.docs
          .map((d) => ({
            id: d.id,
            ...(d.data() as Omit<PublicCourse, "id">),
          }))
          .filter((c) => (c.status ?? "active") === "active");
        setCourses(list);
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

  const categories = useMemo(() => {
    const set = new Set<string>();
    courses.forEach((c) => {
      if (c.category) set.add(c.category);
    });
    return ["All Courses", ...Array.from(set).sort()];
  }, [courses]);

  const featuredCourses = useMemo(
    () => courses.filter((c) => c.featured).slice(0, 6),
    [courses]
  );

  const displayCourses = featuredCourses.length > 0 ? featuredCourses : courses.slice(0, 6);

  return { courses, displayCourses, categories, loading, error };
}
