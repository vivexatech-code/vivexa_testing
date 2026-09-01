import { NextResponse } from "next/server";
import { applyProviderWebhook } from "@/lib/liveClasses/service";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const secret = process.env.CLOUDFLARE_STREAM_WEBHOOK_SECRET?.trim();
  if (secret) {
    const url = new URL(request.url);
    const provided = url.searchParams.get("secret") || request.headers.get("x-webhook-secret");
    if (provided !== secret) {
      return NextResponse.json({ error: "Unauthorized webhook." }, { status: 401 });
    }
  }

  const payload = await request.json().catch(() => ({})) as Record<string, unknown>;
  const data = (payload.data && typeof payload.data === "object" ? payload.data : payload) as Record<string, unknown>;

  await applyProviderWebhook({
    eventType: String(data.event_type ?? payload.event_type ?? payload.type ?? ""),
    inputId: String(data.input_id ?? data.live_input ?? data.uid ?? ""),
    videoUid: data.uid && data.live_input ? String(data.uid) : undefined,
    readyToStream: typeof data.readyToStream === "boolean" ? data.readyToStream : undefined,
  });

  return NextResponse.json({ ok: true });
}
