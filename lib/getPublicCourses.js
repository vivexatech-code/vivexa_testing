/**
 * Server-safe Firestore read via REST API (avoids gRPC errors in Next.js SSR).
 * @returns {Promise<import("@/hooks/usePublicCourses").PublicCourse[]>}
 */
export async function getPublicCourses() {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

  if (!projectId || !apiKey) {
    return [];
  }

  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/courses?key=${apiKey}`;

  try {
    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) {
      console.error("Firestore REST error:", res.status, await res.text());
      return [];
    }

    const data = await res.json();
    const documents = data.documents ?? [];

    return documents
      .map((doc) => {
        const id = doc.name?.split("/").pop() ?? "";
        const fields = doc.fields ?? {};

        const str = (key) => fields[key]?.stringValue ?? "";
        const bool = (key) => Boolean(fields[key]?.booleanValue);

        return {
          id,
          title: str("title") || id,
          description: str("description"),
          category: str("category") || undefined,
          duration: str("duration") || undefined,
          level: str("level") || undefined,
          featured: bool("featured"),
          status: str("status") || "active",
        };
      })
      .filter((c) => (c.status ?? "active") === "active");
  } catch (error) {
    console.error("Failed to load public courses:", error);
    return [];
  }
}
