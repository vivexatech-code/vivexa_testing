import { NextResponse } from "next/server";
import { requireStaff } from "@/lib/portalAuth";
import { jsonError } from "@/lib/api/respond";
import { createLiveClassRecord, listAllLiveClasses } from "@/lib/liveClasses/service";
import type { CreateLiveClassInput } from "@/types/liveClass";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    await requireStaff(request);
    const liveClasses = await listAllLiveClasses();
    return NextResponse.json({
      liveClasses,
      upcoming: liveClasses.filter((item) => item.uiStatus === "upcoming"),
      liveNow: liveClasses.filter((item) => item.uiStatus === "live" || item.uiStatus === "waiting_for_teacher"),
      completed: liveClasses.filter((item) => item.uiStatus === "completed"),
      recordings: liveClasses.filter((item) => item.recordingEnabled),
    });
  } catch (error) {
    return jsonError(error);
  }
}

export async function POST(request: Request) {
  try {
    const staff = await requireStaff(request);
    const body = await request.json() as CreateLiveClassInput;
    if (!body.title?.trim() || !body.courseId || !body.teacherName?.trim() || !body.startTime || !body.endTime) {
      return NextResponse.json({ error: "Title, course, teacher, start time, and end time are required." }, { status: 400 });
    }
    const created = await createLiveClassRecord(body, staff.uid);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return jsonError(error);
  }
}
