"use client";

import { useEffect, useMemo, useState } from "react";
import { collection, doc, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { usePortalAuth } from "@/context/PortalAuthContext";
import type { Achievement, AppNotification, AttendanceRecord, BatchSchedule, CalendarEvent, Certificate, ClassSchedule, FeeSummary, PerformanceMetrics, Recording, StudyMaterial, TestAssignment, TestHistory } from "@/types/student";

const emptyAttendance: AttendanceRecord = { present: [], absent: [], upcoming: [], percentage: 0 };
const asDate = (value: unknown) => value && typeof value === "object" && "toDate" in value ? (value as { toDate(): Date }).toDate() : value ? new Date(String(value)) : null;
const textDate = (value: unknown) => { const date = asDate(value); return date && !Number.isNaN(date.getTime()) ? date.toISOString() : String(value ?? ""); };
const rows = <T extends { id: string }>(snap: { docs: Array<{ id: string; data(): object }> }) => snap.docs.map((item) => ({ id: item.id, ...item.data() }) as T);
const safeTest = (item: TestAssignment): TestAssignment => ({ ...item, questionItems: item.questionItems?.map(({ id, question, options }) => ({ id, question, options })) });

function fee(data: Record<string, unknown>): FeeSummary {
  const totalFee = Number(data.totalFee ?? data.totalAmount ?? 0);
  const paidAmount = Number(data.paidAmount ?? data.amountPaid ?? 0);
  const remainingBalance = Number(data.remainingBalance ?? data.dueAmount ?? Math.max(0, totalFee - paidAmount));
  return {
    totalFee, paidAmount, dueAmount: remainingBalance, remainingBalance,
    dueDate: textDate(data.dueDate), nextDueDate: textDate(data.nextDueDate ?? data.dueDate),
    paymentStatus: String(data.paymentStatus ?? data.status ?? (remainingBalance <= 0 ? "Paid" : paidAmount > 0 ? "Partial" : "Pending")) as FeeSummary["paymentStatus"],
    installmentType: data.installmentType ? String(data.installmentType) : undefined,
    course: data.course ? String(data.course) : undefined, paymentUrl: data.paymentUrl ? String(data.paymentUrl) : undefined,
    transactions: Array.isArray(data.transactions) ? data.transactions as FeeSummary["transactions"] : [],
    installments: Array.isArray(data.installments) ? data.installments as FeeSummary["installments"] : [],
  };
}

export function useStudentPortalData() {
  const { studentDocId, studentData } = usePortalAuth();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [tests, setTests] = useState<TestAssignment[]>([]);
  const [instituteTests, setInstituteTests] = useState<TestAssignment[]>([]);
  const [testHistory, setTestHistory] = useState<TestHistory[]>([]);
  const [classes, setClasses] = useState<ClassSchedule[]>([]);
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord>(emptyAttendance);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [feeSummary, setFeeSummary] = useState<FeeSummary | null>(null);
  const [batches, setBatches] = useState<BatchSchedule[]>([]);
  const [studyMaterials, setStudyMaterials] = useState<StudyMaterial[]>([]);
  const [studyStats, setStudyStats] = useState({ totalStudyTime: "0h", activeStreak: 0 });
  const [weeklyActivity, setWeeklyActivity] = useState<{ day: string; hours: number }[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!studentDocId) { setDataLoading(false); return; }
    setDataLoading(true); const base = doc(db, "students", studentDocId); let loaded = 0;
    const done = () => { loaded += 1; if (loaded >= 14) setDataLoading(false); };
    const error = () => done();
    const stops = [
      onSnapshot(query(collection(base, "notifications"), orderBy("createdAt", "desc")), (snap) => { setNotifications(snap.docs.map((item) => { const d = item.data(); return { id: item.id, type: String(d.type ?? "system"), title: String(d.title ?? ""), message: String(d.message ?? ""), time: String(d.time ?? (asDate(d.createdAt)?.toLocaleString("en-IN") ?? "")), isRead: Boolean(d.isRead), route: d.route ? String(d.route) : undefined, createdAt: textDate(d.createdAt) }; })); done(); }, error),
      onSnapshot(collection(base, "tests"), (snap) => { setTests(rows<TestAssignment>(snap).map(safeTest)); done(); }, error),
      onSnapshot(collection(base, "testHistory"), (snap) => { setTestHistory(rows<TestHistory>(snap)); done(); }, error),
      onSnapshot(collection(base, "classes"), (snap) => { setClasses(snap.docs.map((item) => { const d = item.data(); return { id: item.id, courseId: d.courseId, title: String(d.title ?? ""), topic: String(d.topic ?? d.title ?? ""), date: String(d.date ?? textDate(d.startTime).slice(0, 10)), time: String(d.time ?? ""), duration: String(d.duration ?? d.durationMinutes ?? "60 min"), startTime: textDate(d.startTime), endTime: textDate(d.endTime), status: String(d.status ?? "upcoming") as ClassSchedule["status"], meetLink: d.meetLink ?? d.liveClassLink ?? d.link, instructor: String(d.instructor ?? d.trainerName ?? "") }; })); done(); }, error),
      onSnapshot(collection(base, "recordings"), (snap) => { setRecordings(rows<Recording>(snap)); done(); }, error),
      onSnapshot(collection(base, "achievements"), (snap) => { setAchievements(rows<Achievement>(snap)); done(); }, error),
      onSnapshot(collection(base, "calendarEvents"), (snap) => { setCalendarEvents(rows<CalendarEvent>(snap)); done(); }, error),
      onSnapshot(collection(base, "attendance"), (snap) => { const d = snap.docs[0]?.data(); setAttendance(d ? { present: d.present ?? [], absent: d.absent ?? [], upcoming: d.upcoming ?? [], percentage: Number(d.percentage ?? 0) } : emptyAttendance); done(); }, error),
      onSnapshot(doc(base, "progress", "summary"), (snap) => { const d = snap.data(); if (d) { setStudyStats({ totalStudyTime: String(d.totalStudyTime ?? "0h"), activeStreak: Number(d.activeStreak ?? 0) }); setWeeklyActivity(Array.isArray(d.weeklyActivity) ? d.weeklyActivity : []); } done(); }, error),
      onSnapshot(collection(base, "certificates"), (snap) => { setCertificates(rows<Certificate>(snap)); done(); }, error),
      onSnapshot(doc(db, "student_fees", studentDocId), (snap) => { setFeeSummary(snap.exists() ? fee(snap.data()) : null); done(); }, error),
      onSnapshot(collection(db, "institute_tests"), (snap) => { setInstituteTests(rows<TestAssignment>(snap)); done(); }, error),
      onSnapshot(collection(db, "batches"), (snap) => { setBatches(snap.docs.map((item) => ({ id: item.id, batchId: item.data().batchId ?? item.id, ...item.data() } as BatchSchedule))); done(); }, error),
      onSnapshot(collection(db, "study_materials"), (snap) => { setStudyMaterials(rows<StudyMaterial>(snap)); done(); }, error),
    ];
    return () => stops.forEach((stop) => stop());
  }, [studentDocId]);

  return useMemo(() => {
    const enrolledCourses = studentData?.enrolledCourses ?? []; const ids = new Set(enrolledCourses.map((course) => course.courseId).filter(Boolean));
    const forCourse = <T extends { courseId?: string }>(items: T[]) => ids.size ? items.filter((item) => !item.courseId || ids.has(item.courseId)) : items;
    const assigned = new Map(tests.map((test) => [test.instituteTestId ?? test.id, test]));
    const catalogTests = instituteTests.length ? instituteTests.filter((test) => !ids.size || !test.courseId || ids.has(test.courseId)).map((test) => {
      const match = assigned.get(test.id); return safeTest(match ? { ...test, ...match, instituteTestId: test.id, isAssigned: true, canAttempt: match.enabled && match.status === "pending" && Boolean(match.questionItems?.length) } : { ...test, instituteTestId: test.id, type: test.type ?? "weekly", dueDate: test.dueDate ?? "", questions: 0, duration: 0, status: "disabled", enabled: false, isAssigned: false, canAttempt: false });
    }) : forCourse(tests).map((test) => ({ ...test, isAssigned: true, canAttempt: test.enabled && test.status === "pending" }));
    const filteredClasses = forCourse(classes); const history = forCourse(testHistory);
    const now = Date.now(); const classTime = (item: ClassSchedule) => new Date(item.startTime || `${item.date} ${item.time}`).getTime();
    const liveClass = filteredClasses.find((item) => item.status === "live" || (classTime(item) <= now && new Date(item.endTime ?? classTime(item) + 3_600_000).getTime() >= now)) ?? null;
    const upcomingClasses = filteredClasses.filter((item) => item.status === "upcoming" && classTime(item) > now).sort((a, b) => classTime(a) - classTime(b));
    const attendanceScore = attendance.percentage || studentData?.enrolledCourse?.attendancePercentage || 0;
    const testScore = history.length ? Math.round(history.reduce((sum, item) => sum + (item.maxScore ? item.score / item.maxScore * 100 : 0), 0) / history.length) : 0;
    const progressScore = enrolledCourses.length ? Math.round(enrolledCourses.reduce((sum, item) => sum + item.progress, 0) / enrolledCourses.length) : 0;
    const overallScore = Math.round(attendanceScore * .3 + testScore * .4 + progressScore * .3);
    const performance: PerformanceMetrics = { overallScore, attendanceScore, testScore, progressScore, grade: overallScore >= 90 ? "A+" : overallScore >= 80 ? "A" : overallScore >= 70 ? "B+" : overallScore >= 60 ? "B" : "C" };
    const days = feeSummary?.nextDueDate ? Math.ceil((new Date(feeSummary.nextDueDate).getTime() - now) / 86_400_000) : Infinity;
    const feeReminder = !feeSummary || feeSummary.remainingBalance <= 0 ? { kind: "none" as const, message: "" } : days < 0 ? { kind: "overdue" as const, message: `Fee payment of ₹${feeSummary.remainingBalance.toLocaleString("en-IN")} is overdue.` } : days <= 7 ? { kind: "due_soon" as const, message: `₹${feeSummary.remainingBalance.toLocaleString("en-IN")} is due soon.` } : { kind: "none" as const, message: "" };
    return { notifications, unreadCount: notifications.filter((item) => !item.isRead).length, tests: catalogTests, enabledTests: catalogTests.filter((item) => item.canAttempt), testHistory: history, classes: filteredClasses, liveClass, upcomingClasses, recordings: forCourse(recordings), achievements, calendarEvents, attendance: { ...attendance, percentage: attendanceScore }, certificates: forCourse(certificates), feeSummary, feeReminder, batches, studyMaterials: forCourse(studyMaterials), enrolledCourses, enrolledCourse: enrolledCourses[0] ?? null, performance, studyStats, weeklyActivity, dataLoading };
  }, [studentData, notifications, tests, instituteTests, testHistory, classes, recordings, achievements, calendarEvents, attendance, certificates, feeSummary, batches, studyMaterials, studyStats, weeklyActivity, dataLoading]);
}
