import { NextResponse } from "next/server";
import { requireStaff } from "@/lib/portalAuth";
import { jsonError, routeParam } from "@/lib/api/respond";
import { getIngestForStaff } from "@/lib/liveClasses/service";

export const dynamic = "force-dynamic";

export async function GET(request: Request, context: { params: Promise<{ id: string }> | { id: string } }) {
  try {
    await requireStaff(request);
    const id = await routeParam(context.params);
    const ingest = await getIngestForStaff(id);
    return NextResponse.json({ ingest });
  } catch (error) {
    return jsonError(error);
  }
}
