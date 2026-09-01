import { NextResponse } from "next/server";
import { getPortalStudent } from "@/lib/portalAuth";
import { jsonError } from "@/lib/api/respond";
import { listLiveClassesForStudent, toStudentLiveClass } from "@/lib/liveClasses/service";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const student = await getPortalStudent(request);
    const liveClasses = await listLiveClassesForStudent(student);
    const items = liveClasses.map(toStudentLiveClass);
    const now = items.filter((item) => item.uiStatus === "live" || item.uiStatus === "waiting_for_teacher");
    const upcoming = items.filter((item) => item.uiStatus === "upcoming");
    const recorded = items.filter((item) => item.uiStatus === "completed" && item.recordingEnabled);
    return NextResponse.json({ liveClasses: items, now, upcoming, recorded });
  } catch (error) {
    return jsonError(error);
  }
}
