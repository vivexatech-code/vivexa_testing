import { auth } from "@/lib/firebase";

export interface GradeResult { score: number; maxScore: number; passed: boolean; passingMarks: number }
export async function gradeTest(testDocId: string, answers: (string | null)[]): Promise<GradeResult> {
  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new Error("Not authenticated");
  const base = process.env.NEXT_PUBLIC_ADMIN_API_URL || "https://vitpanel.vivexatech.in";
  const response = await fetch(`${base}/api/student/grade-test`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ testDocId, answers }) });
  const data = await response.json() as GradeResult & { error?: string };
  if (!response.ok) throw new Error(data.error || "Failed to submit test");
  return data;
}
