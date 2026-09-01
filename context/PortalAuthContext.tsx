"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, type User, type Unsubscribe } from "firebase/auth";
import { collection, doc, getDoc, getDocs, onSnapshot, query, where } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { readAccountRole } from "@/lib/liveClasses/access";
import type { CourseEnrollment, StudentProfile } from "@/types/student";

interface PortalAuthValue {
  user: User | null; studentDocId: string | null; studentData: StudentProfile | null; loading: boolean;
  mustChangePassword: boolean; login: (email: string, password: string) => Promise<void>; logout: () => Promise<void>;
}
const PortalAuthContext = createContext<PortalAuthValue | null>(null);

function enrollments(data: Record<string, unknown>): CourseEnrollment[] {
  if (Array.isArray(data.enrolledCourses)) return data.enrolledCourses as CourseEnrollment[];
  const legacy = data.enrolledCourse as CourseEnrollment | undefined;
  if (legacy?.title) return [{ ...legacy, courseId: legacy.courseId || String(data.courseId ?? "primary") }];
  if (data.course) return [{ courseId: String(data.courseId ?? ""), title: String(data.course), instructor: "", progress: 0, totalClasses: 0, completedClasses: 0, attendancePercentage: 0, isLiveNow: false, liveTopic: "" }];
  return [];
}

function profileFrom(uid: string, recordId: string, data: Record<string, unknown>, email: string): StudentProfile {
  const list = enrollments(data);
  return {
    uid, studentId: String(data.studentId ?? recordId), fullName: String(data.fullName ?? "Student"),
    email: String(data.email ?? email), phone: String(data.phone ?? ""), course: String(data.course ?? list.map((c) => c.title).join(", ")),
    courseId: data.courseId ? String(data.courseId) : undefined, batch: data.batch ? String(data.batch) : undefined,
    rollNumber: data.rollNumber ? String(data.rollNumber) : undefined, parentName: data.parentName ? String(data.parentName) : undefined,
    status: String(data.status ?? "Active"), address: data.address ? String(data.address) : undefined,
    qualification: data.qualification ? String(data.qualification) : undefined, joinDate: data.joinDate ? String(data.joinDate) : undefined,
    role: readAccountRole(data), mustChangePassword: Boolean(data.mustChangePassword), avatarUrl: data.avatarUrl ? String(data.avatarUrl) : undefined,
    enrolledCourses: list, enrolledCourse: list[0] ?? null,
    preferences: { inAppNotifications: (data.preferences as { inAppNotifications?: boolean } | undefined)?.inAppNotifications ?? true, emailAlerts: (data.preferences as { emailAlerts?: boolean } | undefined)?.emailAlerts ?? false },
  };
}

export function PortalAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [studentDocId, setStudentDocId] = useState<string | null>(null);
  const [studentData, setStudentData] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let stopStudent: Unsubscribe = () => {};
    let cancelled = false;
    const stopAuth = onAuthStateChanged(auth, (current) => {
      stopStudent(); setUser(current);
      if (!current) { setStudentDocId(null); setStudentData(null); setLoading(false); return; }
      setLoading(true);
      void (async () => {
        try {
          const byUid = await getDocs(query(collection(db, "students"), where("uid", "==", current.uid)));
          let ref = byUid.docs[0]?.ref;
          if (!ref) {
            const byId = await getDoc(doc(db, "students", current.uid));
            if (byId.exists()) ref = byId.ref;
          }
          if (!ref && current.email) {
            const byEmail = await getDocs(query(collection(db, "students"), where("email", "==", current.email)));
            ref = byEmail.docs[0]?.ref;
          }
          if (cancelled) return;
          if (!ref) { setStudentDocId(null); setStudentData(null); setLoading(false); return; }
          stopStudent = onSnapshot(ref, (record) => {
            if (!record.exists()) { setStudentDocId(null); setStudentData(null); setLoading(false); return; }
            setStudentDocId(record.id);
            setStudentData(profileFrom(current.uid, record.id, record.data(), current.email ?? ""));
            setLoading(false);
          }, () => { setStudentDocId(null); setStudentData(null); setLoading(false); });
        } catch {
          if (!cancelled) { setStudentDocId(null); setStudentData(null); setLoading(false); }
        }
      })();
    });
    return () => { cancelled = true; stopAuth(); stopStudent(); };
  }, []);
  async function login(email: string, password: string) { await signInWithEmailAndPassword(auth, email.trim(), password); }
  async function logout() { setStudentDocId(null); setStudentData(null); await signOut(auth); }
  return <PortalAuthContext.Provider value={{ user, studentDocId, studentData, loading, mustChangePassword: Boolean(studentData?.mustChangePassword), login, logout }}>{children}</PortalAuthContext.Provider>;
}

export function usePortalAuth() {
  const value = useContext(PortalAuthContext);
  if (!value) throw new Error("usePortalAuth must be used inside PortalAuthProvider");
  return value;
}
