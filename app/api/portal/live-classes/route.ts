import { NextResponse } from "next/server";
import { getPortalStudent, httpError, requireStaff } from "@/lib/portalAuth";
import { isStaffRole } from "@/lib/liveClasses/access";
import { listAllLiveClasses, listLiveClassesForStudent, toStudentLiveClass } from "@/lib/liveClasses/service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function grouped(items: ReturnType<typeof toStudentLiveClass>[], error = "") {
  return {
    liveClasses: items,
    now: items.filter((item) => item.uiStatus === "live" || item.uiStatus === "waiting_for_teacher"),
    upcoming: items.filter((item) => item.uiStatus === "upcoming"),
    recorded: items.filter((item) => item.uiStatus === "completed" && item.recordingEnabled),
    error,
  };
}

export async function GET(request: Request) {
  try {
    const student = await getPortalStudent(request).catch((error) => {
      const { status } = httpError(error);
      if (status === 401 || status === 503) throw error;
      return null;
    });

    if (student && !isStaffRole(student.role)) {
      const liveClasses = await listLiveClassesForStudent(student);
      return NextResponse.json(grouped(liveClasses.map(toStudentLiveClass)));
    }

    if (student && isStaffRole(student.role)) {
      const liveClasses = await listAllLiveClasses().catch(() => listLiveClassesForStudent(student));
      return NextResponse.json(grouped(liveClasses.map(toStudentLiveClass)));
    }

    await requireStaff(request);
    const liveClasses = await listAllLiveClasses();
    return NextResponse.json(grouped(liveClasses.map(toStudentLiveClass)));
  } catch (error) {
    const { status, message } = httpError(error);
    console.error("GET /api/portal/live-classes failed", error);
    if (status === 401 || status === 503) {
      return NextResponse.json({ error: message, ...grouped([]) }, { status });
    }
    return NextResponse.json(grouped([], message));
  }
}
