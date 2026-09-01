import { NextResponse } from "next/server";
import { getPortalStudent, requireStaff } from "@/lib/portalAuth";
import { jsonError } from "@/lib/api/respond";
import { isStaffRole } from "@/lib/liveClasses/access";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    try {
      const staff = await requireStaff(request);
      return NextResponse.json({
        isStaff: true,
        role: staff.role,
        fullName: staff.fullName,
        email: staff.email,
        status: staff.status,
        studentId: staff.studentId,
      });
    } catch (error) {
      const { status } = (error && typeof error === "object" && "status" in error)
        ? { status: Number((error as { status: number }).status) }
        : { status: 500 };
      if (status === 401 || status === 503) throw error;
      const student = await getPortalStudent(request).catch(() => null);
      return NextResponse.json({
        isStaff: isStaffRole(student?.role),
        role: student?.role ?? "student",
        fullName: student?.fullName ?? "",
      });
    }
  } catch (error) {
    return jsonError(error);
  }
}
