"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { sendPasswordResetEmail } from "firebase/auth";
import { GraduationCap, LockKeyhole, Mail } from "lucide-react";
import { auth } from "@/lib/firebase";
import { usePortalAuth } from "@/context/PortalAuthContext";

export default function LoginPage() {
  const { login } = usePortalAuth(); const [busy, setBusy] = useState(false); const [message, setMessage] = useState(""); const [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError("");
    const data = new FormData(event.currentTarget);
    try { await login(String(data.get("email")), String(data.get("password"))); } catch (reason) { setError(reason instanceof Error ? reason.message.replace("Firebase: ", "") : "Unable to sign in."); } finally { setBusy(false); }
  }
  async function reset() {
    const email = (document.querySelector<HTMLInputElement>("#email")?.value ?? "").trim();
    if (!email) { setError("Enter your email first."); return; }
    try { await sendPasswordResetEmail(auth, email); setMessage("Password reset email sent."); setError(""); } catch { setError("Could not send the reset email."); }
  }
  return (
    <main className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_top_left,#ede9fe,transparent_45%),#f8fafc] p-5">
      <div className="w-full max-w-md rounded-3xl border border-white bg-white/90 p-7 shadow-2xl shadow-violet-200/50 backdrop-blur md:p-10">
        <div className="mb-8 text-center"><span className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#6C3CE9] text-white"><GraduationCap size={30} /></span><h1 className="mt-4 text-2xl font-black">Welcome to Vivexa Learn</h1><p className="mt-2 text-sm text-slate-500">Sign in to continue your learning journey</p></div>
        {error && <p className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}{message && <p className="mb-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">{message}</p>}
        <form onSubmit={submit} className="space-y-4">
          <label className="block text-sm font-semibold">Email<div className="mt-2 flex items-center rounded-xl border border-slate-300 px-3 focus-within:border-violet-500"><Mail size={18} className="text-slate-400" /><input id="email" name="email" type="email" required autoComplete="email" className="w-full bg-transparent px-3 py-3 outline-none" /></div></label>
          <label className="block text-sm font-semibold">Password<div className="mt-2 flex items-center rounded-xl border border-slate-300 px-3 focus-within:border-violet-500"><LockKeyhole size={18} className="text-slate-400" /><input name="password" type="password" required autoComplete="current-password" className="w-full bg-transparent px-3 py-3 outline-none" /></div></label>
          <button type="button" onClick={() => void reset()} className="text-sm font-semibold text-[#6C3CE9]">Forgot password?</button>
          <button disabled={busy} className="w-full rounded-xl bg-[#6C3CE9] px-4 py-3.5 font-bold text-white shadow-lg shadow-violet-200 disabled:opacity-60">{busy ? "Signing in…" : "Sign in"}</button>
        </form>
        <Link href="/" className="mt-7 block text-center text-sm text-slate-500 hover:text-[#6C3CE9]">← Back to public website</Link>
      </div>
    </main>
  );
}
