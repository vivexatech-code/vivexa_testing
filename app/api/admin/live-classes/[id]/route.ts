import { NextResponse } from "next/server";
import { requireStaff } from "@/lib/portalAuth";
import { jsonError, routeParam } from "@/lib/api/respond";
import { loadLiveClass, updateLiveClass } from "@/lib/liveClasses/service";
import { getAdminDb } from "@/lib/firebaseAdmin";
import { LIVE_CLASSES_COLLECTION, LIVE_CLASS_SECRETS_COLLECTION } from "@/lib/liveClasses/serialize";

export const dynamic = "force-dynamic";

export async function GET(request: Request, context: { params: Promise<{ id: string }> | { id: string } }) {
  try {
    await requireStaff(request);
    const id = await routeParam(context.params);
    const { liveClass } = await loadLiveClass(id);
    return NextResponse.json({ liveClass });
  } catch (error) {
    return jsonError(error);
  }
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> | { id: string } }) {
  try {
    await requireStaff(request);
    const id = await routeParam(context.params);
    const body = await request.json();
    const liveClass = await updateLiveClass(id, body);
    return NextResponse.json({ liveClass });
  } catch (error) {
    return jsonError(error);
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> | { id: string } }) {
  try {
    await requireStaff(request);
    const id = await routeParam(context.params);
    const db = getAdminDb();
    await db.collection(LIVE_CLASS_SECRETS_COLLECTION).doc(id).delete().catch(() => undefined);
    await db.collection(LIVE_CLASSES_COLLECTION).doc(id).delete();
    return NextResponse.json({ ok: true });
  } catch (error) {
    return jsonError(error);
  }
}
