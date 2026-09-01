import type { CourseEnrollment } from "@/types/student";

export interface AccessStudent {
  uid: string;
  studentId: string;
  docId: string;
  status: string;
  courseId?: string;
  course?: string;
  batch?: string;
  enrolledCourses: CourseEnrollment[];
}

export interface AccessClass {
  courseId: string;
  courseTitle?: string;
  courseIds?: string[];
  batchIds?: string[];
  batchName?: string;
  allowedStudentIds?: string[];
}

export function isStudentAccountActive(status: string): boolean {
  const value = status.trim().toLowerCase();
  return value === "active" || value === "enrolled";
}

function token(value: unknown): string {
  return String(value ?? "").trim();
}

function keySet(values: unknown[]): Set<string> {
  const set = new Set<string>();
  for (const value of values) {
    const raw = token(value);
    if (!raw) continue;
    set.add(raw);
    set.add(raw.toLowerCase());
  }
  return set;
}

function intersects(left: Set<string>, right: Iterable<string>): boolean {
  for (const value of right) {
    const raw = token(value);
    if (raw && (left.has(raw) || left.has(raw.toLowerCase()))) return true;
  }
  return false;
}

export function studentCourseIds(student: AccessStudent): string[] {
  const courses = Array.isArray(student.enrolledCourses) ? student.enrolledCourses.filter(Boolean) : [];
  const ids = courses.flatMap((course) => [
    course.courseId,
    (course as { id?: string }).id,
    course.title,
  ]);
  if (student.courseId) ids.push(student.courseId);
  if (student.course) ids.push(String(student.course));
  return [...new Set(ids.map(token).filter(Boolean))];
}

export function studentBatchIds(student: AccessStudent): string[] {
  const courses = Array.isArray(student.enrolledCourses) ? student.enrolledCourses.filter(Boolean) : [];
  const values = [
    student.batch,
    ...courses.flatMap((course) => [
      course.batchId,
      course.batch,
      (course as { batchName?: string }).batchName,
    ]),
  ];
  return [...new Set(values.map(token).filter(Boolean))];
}

export function studentIdentityIds(student: AccessStudent): string[] {
  return [student.uid, student.studentId, student.docId].filter(Boolean);
}

export function isEnrolledInCourse(student: AccessStudent, courseId: string, courseTitle?: string): boolean {
  const keys = keySet(studentCourseIds(student));
  if (courseId && intersects(keys, [courseId])) return true;
  if (courseTitle && intersects(keys, [courseTitle])) return true;
  return false;
}

export function studentMayAccessLiveClass(
  student: AccessStudent,
  liveClass: AccessClass,
  extras?: { courseAliases?: string[]; batchAliases?: string[]; batchStudentIds?: string[] },
): { ok: true } | { ok: false; reason: string } {
  if (!isStudentAccountActive(student.status)) {
    return { ok: false, reason: "Your student account is not active." };
  }

  const courseKeys = [
    liveClass.courseId,
    liveClass.courseTitle,
    ...(liveClass.courseIds ?? []),
    ...(extras?.courseAliases ?? []),
  ].map(token).filter(Boolean);

  const studentCourses = keySet(studentCourseIds(student));
  if (!courseKeys.length || !intersects(studentCourses, courseKeys)) {
    return { ok: false, reason: "You are not enrolled in this course." };
  }

  const allowedStudents = (liveClass.allowedStudentIds ?? []).map(token).filter(Boolean);
  if (allowedStudents.length) {
    const identities = keySet(studentIdentityIds(student));
    if (!intersects(identities, allowedStudents)) {
      return { ok: false, reason: "This class is restricted to selected students." };
    }
    return { ok: true };
  }

  const batchKeys = [
    ...(liveClass.batchIds ?? []),
    liveClass.batchName,
    ...(extras?.batchAliases ?? []),
  ].map(token).filter(Boolean);

  if (batchKeys.length) {
    const studentBatches = keySet(studentBatchIds(student));
    const identities = keySet(studentIdentityIds(student));
    const inNamedBatch = intersects(studentBatches, batchKeys);
    const inBatchRoster = extras?.batchStudentIds?.length
      ? intersects(identities, extras.batchStudentIds)
      : false;
    if (!inNamedBatch && !inBatchRoster) {
      return { ok: false, reason: "This class is restricted to another batch." };
    }
  }

  return { ok: true };
}

export const STAFF_ROLES = [
  "trainer", "teacher", "instructor", "faculty",
  "admin", "staff", "superadmin", "principal", "owner", "director", "coordinator", "management",
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
