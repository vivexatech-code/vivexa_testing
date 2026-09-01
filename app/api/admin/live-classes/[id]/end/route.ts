import { NextResponse } from "next/server";
import { requireStaff } from "@/lib/portalAuth";
import { jsonError, routeParam } from "@/lib/api/respond";
import { endLiveClass } from "@/lib/liveClasses/service";

export const dynamic = "force-dynamic";

export async function POST(request: Request, context: { params: Promise<{ id: string }> | { id: string } }) {
  try {
    await requireStaff(request);
    const id = await routeParam(context.params);
    const liveClass = await endLiveClass(id);
    return NextResponse.json({ liveClass });
  } catch (error) {
    return jsonError(error);
  }
}
