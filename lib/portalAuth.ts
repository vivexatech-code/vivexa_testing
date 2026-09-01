import type { DocumentData } from "firebase-admin/firestore";
import type { CourseEnrollment } from "@/types/student";
import { getAdminAuth, getAdminDb, isFirebaseAdminConfigured } from "@/lib/firebaseAdmin";
import { isStaffEmail, isStaffRole, readAccountRole, type AccessStudent } from "@/lib/liveClasses/access";

export interface PortalStudentSession extends AccessStudent {
  email: string;
  fullName: string;
  role: string;
}

export interface PortalRequestUser {
  uid: string;
  email?: string;
  claims: Record<string, unknown>;
}

function bearerToken(request: Request): string | null {
  const header = request.headers.get("authorization") || request.headers.get("Authorization");
  if (!header?.toLowerCase().startsWith("bearer ")) return null;
  const token = header.slice(7).trim();
  return token || null;
}

export async function getRequestUser(request: Request): Promise<PortalRequestUser> {
  if (!isFirebaseAdminConfigured()) {
    throw Object.assign(new Error("Server authentication is not configured."), { status: 503 });
  }
  const token = bearerToken(request);
  if (!token) {
    throw Object.assign(new Error("Authentication required."), { status: 401 });
  }
  try {
    const decoded = await getAdminAuth().verifyIdToken(token);
    return { uid: decoded.uid, email: decoded.email, claims: decoded as unknown as Record<string, unknown> };
  } catch {
    throw Object.assign(new Error("Invalid or expired session."), { status: 401 });
  }
}

function enrollments(data: DocumentData): CourseEnrollment[] {
  if (Array.isArray(data.enrolledCourses)) return data.enrolledCourses as CourseEnrollment[];
  const legacy = data.enrolledCourse as CourseEnrollment | undefined;
  if (legacy?.title) {
    return [{ ...legacy, courseId: legacy.courseId || String(data.courseId ?? "primary") }];
  }
  if (data.course) {
    return [{
      courseId: String(data.courseId ?? ""),
      title: String(data.course),
      instructor: "",
      progress: 0,
      totalClasses: 0,
      completedClasses: 0,
      attendancePercentage: 0,
      isLiveNow: false,
      liveTopic: "",
    }];
  }
  return [];
}

async function findStudentDoc(uid: string, email?: string) {
  const db = getAdminDb();
  const byUid = await db.collection("students").where("uid", "==", uid).limit(1).get();
  if (!byUid.empty) return byUid.docs[0];

  const byId = await db.collection("students").doc(uid).get();
  if (byId.exists) return byId;

  if (email) {
    const byEmail = await db.collection("students").where("email", "==", email).limit(1).get();
    if (!byEmail.empty) return byEmail.docs[0];
  }
  return null;
}

export async function getPortalStudent(request: Request): Promise<PortalStudentSession> {
  const user = await getRequestUser(request);
  const doc = await findStudentDoc(user.uid, user.email);
  if (!doc) {
    throw Object.assign(new Error("No student profile is linked to this account."), { status: 403 });
  }
  const data = doc.data() ?? {};
  return {
    uid: user.uid,
    docId: doc.id,
    studentId: String(data.studentId ?? doc.id),
    email: String(data.email ?? user.email ?? ""),
    fullName: String(data.fullName ?? "Student"),
    status: String(data.status ?? "Active"),
    courseId: data.courseId ? String(data.courseId) : undefined,
    course: data.course ? String(data.course) : undefined,
    batch: data.batch ? String(data.batch) : undefined,
    role: readAccountRole(data as Record<string, unknown>),
    enrolledCourses: enrollments(data),
  };
}

async function findInstituteUser(uid: string, email?: string) {
  const db = getAdminDb();
  const byUid = await db.collection("users").where("uid", "==", uid).limit(1).get();
  if (!byUid.empty) return byUid.docs[0];

  if (email) {
    const byDocId = await db.collection("users").doc(email).get();
    if (byDocId.exists) return byDocId;
    const byEmail = await db.collection("users").where("email", "==", email).limit(1).get();
    if (!byEmail.empty) return byEmail.docs[0];
  }

  const byUidDoc = await db.collection("users").doc(uid).get();
  if (byUidDoc.exists) return byUidDoc;
  return null;
}

function asStaffSession(user: PortalRequestUser, role: string, extra?: Partial<PortalStudentSession>): PortalStudentSession {
  return {
    uid: user.uid,
    docId: extra?.docId ?? user.uid,
    studentId: extra?.studentId ?? user.uid,
    email: extra?.email ?? user.email ?? "",
    fullName: extra?.fullName ?? user.email ?? "Staff",
    status: extra?.status ?? "Active",
    courseId: extra?.courseId,
    batch: extra?.batch,
    role,
    enrolledCourses: extra?.enrolledCourses ?? [],
  };
}

function sessionFromUserDoc(user: PortalRequestUser, staffDoc: { id: string; data(): DocumentData | undefined }): PortalStudentSession {
  const data = staffDoc.data() ?? {};
  return asStaffSession(user, readAccountRole(data as Record<string, unknown>) || "trainer", {
    docId: staffDoc.id,
    studentId: String(data.staffId ?? data.studentId ?? staffDoc.id),
    email: String(data.email ?? user.email ?? ""),
    fullName: String(data.fullName ?? user.email ?? "Staff"),
    status: String(data.status ?? "Active"),
  });
}

export async function requireStaff(request: Request): Promise<PortalStudentSession> {
  const user = await getRequestUser(request);
  const claimedRole = String(user.claims.role ?? user.claims.adminRole ?? "");
  const emailIsStaff = isStaffEmail(user.email);

  const instituteUser = await findInstituteUser(user.uid, user.email);
  if (instituteUser) {
    const staff = sessionFromUserDoc(user, instituteUser);
    if (isStaffRole(staff.role) || emailIsStaff) return staff;
  }

  try {
    const student = await getPortalStudent(request);
    if (isStaffRole(student.role) || user.claims.admin === true || isStaffRole(claimedRole) || emailIsStaff) {
      return {
        ...student,
        role: isStaffRole(student.role) ? student.role : claimedRole || (emailIsStaff ? "trainer" : "admin"),
      };
    }
  } catch {
    if (user.claims.admin === true || isStaffRole(claimedRole) || emailIsStaff) {
      return asStaffSession(user, claimedRole || (emailIsStaff ? "trainer" : "admin"));
    }
  }

  const db = getAdminDb();
  const staffDoc = await db.collection("staff").doc(user.uid).get();
  if (staffDoc.exists) {
    const data = staffDoc.data() ?? {};
    return asStaffSession(user, String(data.role ?? "staff"), {
      fullName: data.fullName ? String(data.fullName) : undefined,
    });
  }

  throw Object.assign(new Error("Staff access is required."), { status: 403 });
}

export function httpError(error: unknown): { status: number; message: string } {
  if (error && typeof error === "object" && "status" in error && typeof (error as { status: unknown }).status === "number") {
    return { status: (error as { status: number }).status, message: error instanceof Error ? error.message : "Request failed." };
  }
  if (error instanceof Error) return { status: 500, message: error.message };
  return { status: 500, message: "Request failed." };
}
