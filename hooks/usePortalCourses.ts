"use client";

import { useEffect, useMemo, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Category, Course } from "@/types/student";

export function usePortalCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const stopCourses = onSnapshot(collection(db, "courses"), (snap) => {
      setCourses(snap.docs.map((item) => ({ id: item.id, ...item.data() } as Course)).filter((item) => (item.status ?? "active") === "active"));
      setLoading(false); setError(null);
    }, () => { setError("Unable to load courses."); setLoading(false); });
    const stopCategories = onSnapshot(query(collection(db, "categories"), orderBy("order", "asc")), (snap) => {
      setCategories(snap.docs.filter((item) => item.data().active !== false).map((item) => ({ id: item.id, name: String(item.data().name ?? ""), icon: item.data().iconName ? String(item.data().iconName) : undefined })));
    });
    return () => { stopCourses(); stopCategories(); };
  }, []);
  return useMemo(() => ({ courses, categories, loading, error, getCourseById: (id: string) => courses.find((course) => course.id === id || course.courseId === id) }), [courses, categories, loading, error]);
}
