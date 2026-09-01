"use client";

import { FormEvent, useState } from "react";
import { updatePassword } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { KeyRound } from "lucide-react";
import { db } from "@/lib/firebase";
import { usePortalAuth } from "@/context/PortalAuthContext";

export default function ChangePasswordPage() {
  const { user, studentDocId, logout } = usePortalAuth(); const router = useRouter(); const [busy, setBusy] = useState(false); const [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!user || !studentDocId) return;
    const data = new FormData(event.currentTarget); const password = String(data.get("password")); const confirm = String(data.get("confirm"));
    if (password.length < 8) { setError("Use at least 8 characters."); return; }
    if (password !== confirm) { setError("Passwords do not match."); return; }
    setBusy(true); setError("");
    try { await updatePassword(user, password); await updateDoc(doc(db, "students", studentDocId), { mustChangePassword: false }); router.replace("/portal"); }
    catch { setError("Unable to update password. Sign in again and retry."); } finally { setBusy(false); }
  }
  return <main className="grid min-h-screen place-items-center bg-slate-50 p-5"><div className="w-full max-w-md rounded-3xl border bg-white p-8 shadow-xl"><span className="grid size-14 place-items-center rounded-2xl bg-violet-50 text-[#6C3CE9]"><KeyRound /></span><h1 className="mt-5 text-2xl font-black">Create a new password</h1><p className="mt-2 text-sm text-slate-500">Your temporary password must be replaced before continuing.</p>{error && <p className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}<form onSubmit={submit} className="mt-6 space-y-4"><input name="password" type="password" required placeholder="New password" className="w-full rounded-xl border px-4 py-3" /><input name="confirm" type="password" required placeholder="Confirm new password" className="w-full rounded-xl border px-4 py-3" /><button disabled={busy} className="w-full rounded-xl bg-[#6C3CE9] py-3 font-bold text-white">{busy ? "Updating…" : "Update password"}</button></form><button onClick={() => void logout()} className="mt-4 w-full text-sm font-semibold text-slate-500">Sign out</button></div></main>;
}
