import { NextResponse } from "next/server";
import { getPortalStudent } from "@/lib/portalAuth";
import { jsonError, routeParam } from "@/lib/api/respond";
import { assertStudentCanAccess, loadLiveClass, toStudentLiveClass } from "@/lib/liveClasses/service";

export const dynamic = "force-dynamic";

export async function GET(request: Request, context: { params: Promise<{ id: string }> | { id: string } }) {
  try {
    const student = await getPortalStudent(request);
    const id = await routeParam(context.params);
    const { liveClass } = await loadLiveClass(id);
    await assertStudentCanAccess(student, liveClass);
    return NextResponse.json({ liveClass: toStudentLiveClass(liveClass) });
  } catch (error) {
    return jsonError(error);
  }
}
