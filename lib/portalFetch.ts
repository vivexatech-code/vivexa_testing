import { auth } from "@/lib/firebase";

export async function portalFetch(input: string, init: RequestInit = {}) {
  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new Error("Not authenticated");
  const response = await fetch(input, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(init.headers ?? {}),
    },
    cache: "no-store",
  });
  const data = await response.text();
  let parsed: Record<string, unknown> = {};
  try {
    parsed = data ? JSON.parse(data) as Record<string, unknown> : {};
  } catch {
    parsed = {};
  }
  if (!response.ok) {
    throw new Error(String(parsed.error || parsed.message || `Request failed (${response.status})`));
  }
  return parsed;
}
