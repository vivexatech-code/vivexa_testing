import { NextResponse } from "next/server";
import { httpError } from "@/lib/portalAuth";

export function jsonError(error: unknown) {
  const { status, message } = httpError(error);
  return NextResponse.json({ error: message }, { status });
}

export async function routeParam(params: Promise<{ id: string }> | { id: string }): Promise<string> {
  const resolved = await params;
  return resolved.id;
}
