import type { CourseEnrollment } from "@/types/student";

export interface AccessStudent {
  uid: string;
  studentId: string;
  docId: string;
  status: string;
  courseId?: string;
  batch?: string;
  enrolledCourses: CourseEnrollment[];
}

export interface AccessClass {
  courseId: string;
  batchIds?: string[];
  allowedStudentIds?: string[];
}

export function isStudentAccountActive(status: string): boolean {
  const value = status.trim().toLowerCase();
  return value === "active" || value === "enrolled";
}

export function studentCourseIds(student: AccessStudent): string[] {
  const ids = student.enrolledCourses.map((course) => course.courseId).filter(Boolean);
  if (student.courseId) ids.push(student.courseId);
  return [...new Set(ids)];
}

export function studentBatchIds(student: AccessStudent): string[] {
  const values = [
    student.batch,
    ...student.enrolledCourses.flatMap((course) => [course.batchId, course.batch]),
  ]
    .map((value) => String(value ?? "").trim())
    .filter(Boolean);
  return [...new Set(values)];
}

export function studentIdentityIds(student: AccessStudent): string[] {
  return [student.uid, student.studentId, student.docId].filter(Boolean);
}

export function isEnrolledInCourse(student: AccessStudent, courseId: string): boolean {
  if (!courseId) return false;
  return studentCourseIds(student).includes(courseId);
}

export function studentMayAccessLiveClass(student: AccessStudent, liveClass: AccessClass): { ok: true } | { ok: false; reason: string } {
  if (!isStudentAccountActive(student.status)) {
    return { ok: false, reason: "Your student account is not active." };
  }

  if (!isEnrolledInCourse(student, liveClass.courseId)) {
    return { ok: false, reason: "You are not enrolled in this course." };
  }

  const allowedStudents = (liveClass.allowedStudentIds ?? []).map((id) => id.trim()).filter(Boolean);
  if (allowedStudents.length) {
    const identities = new Set(studentIdentityIds(student));
    if (!allowedStudents.some((id) => identities.has(id))) {
      return { ok: false, reason: "This class is restricted to selected students." };
    }
    return { ok: true };
  }

  const batchIds = (liveClass.batchIds ?? []).map((id) => id.trim()).filter(Boolean);
  if (batchIds.length) {
    const studentBatches = new Set(studentBatchIds(student));
    if (!batchIds.some((id) => studentBatches.has(id))) {
      return { ok: false, reason: "This class is restricted to another batch." };
    }
  }

  return { ok: true };
}

export const STAFF_ROLES = [
  "admin", "teacher", "staff", "faculty", "superadmin", "instructor",
  "trainer", "principal", "owner", "director", "coordinator", "management",
];

export function readAccountRole(data: Record<string, unknown> | undefined): string {
  if (!data) return "student";
  const raw = data.role ?? data.userRole ?? data.accountType ?? data.designation ?? data.userType;
  return String(raw ?? "student").trim() || "student";
}

export function isStaffRole(role: string | undefined): boolean {
  return STAFF_ROLES.includes(String(role ?? "").trim().toLowerCase());
}

export function isStaffEmail(email: string | undefined | null): boolean {
  const value = String(email ?? "").trim().toLowerCase();
  if (!value) return false;
  const allowed = (process.env.PORTAL_STAFF_EMAILS || process.env.NEXT_PUBLIC_PORTAL_STAFF_EMAILS || "")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
  return allowed.includes(value);
}
