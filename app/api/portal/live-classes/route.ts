import { NextResponse } from "next/server";
import { getPortalStudent, requireStaff } from "@/lib/portalAuth";
import { jsonError } from "@/lib/api/respond";
import { listAllLiveClasses, listLiveClassesForStudent, toStudentLiveClass } from "@/lib/liveClasses/service";

export const dynamic = "force-dynamic";

function grouped(items: ReturnType<typeof toStudentLiveClass>[]) {
  return {
    liveClasses: items,
    now: items.filter((item) => item.uiStatus === "live" || item.uiStatus === "waiting_for_teacher"),
    upcoming: items.filter((item) => item.uiStatus === "upcoming"),
    recorded: items.filter((item) => item.uiStatus === "completed" && item.recordingEnabled),
  };
}

export async function GET(request: Request) {
  try {
    try {
      await requireStaff(request);
      const liveClasses = await listAllLiveClasses();
      return NextResponse.json(grouped(liveClasses.map(toStudentLiveClass)));
    } catch (error) {
      const status = error && typeof error === "object" && "status" in error ? Number((error as { status: number }).status) : 500;
      if (status === 401 || status === 503) throw error;
    }
    const student = await getPortalStudent(request);
    const liveClasses = await listLiveClassesForStudent(student);
    return NextResponse.json(grouped(liveClasses.map(toStudentLiveClass)));
  } catch (error) {
    return jsonError(error);
  }
}
