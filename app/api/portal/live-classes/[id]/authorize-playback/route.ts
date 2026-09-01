import { NextResponse } from "next/server";
import { getPortalStudent } from "@/lib/portalAuth";
import { jsonError, routeParam } from "@/lib/api/respond";
import { authorizeStudentPlayback } from "@/lib/liveClasses/service";

export const dynamic = "force-dynamic";

export async function POST(request: Request, context: { params: Promise<{ id: string }> | { id: string } }) {
  try {
    const student = await getPortalStudent(request);
    const id = await routeParam(context.params);
    const body = await request.json().catch(() => ({})) as { kind?: "live" | "recording" };
    const result = await authorizeStudentPlayback(student, id, body.kind === "recording" ? "recording" : "live");
    return NextResponse.json({
      liveClass: {
        id: result.liveClass.id,
        title: result.liveClass.title,
        teacherName: result.liveClass.teacherName,
        courseTitle: result.liveClass.courseTitle,
        uiStatus: result.liveClass.uiStatus,
        recordingStatus: result.liveClass.recordingStatus,
        startTime: result.liveClass.startTime,
        endTime: result.liveClass.endTime,
        description: result.liveClass.description,
        thumbnailUrl: result.liveClass.thumbnailUrl,
      },
      authorization: result.authorization,
      message: result.message,
    });
  } catch (error) {
    return jsonError(error);
  }
}
