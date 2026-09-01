"use client";

import { FormEvent, useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function DeleteAccountPage() {
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    const form = new FormData(event.currentTarget);
    await addDoc(collection(db, "accountDeletionRequests"), {
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      mobile: String(form.get("mobile") ?? ""),
      reason: String(form.get("reason") ?? ""),
      status: "pending",
      createdAt: serverTimestamp(),
    });
    setDone(true);
    setBusy(false);
  }
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-24">
      <div className="mx-auto max-w-xl rounded-3xl border bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-black">Delete your account</h1>
        <p className="mt-3 text-slate-600">Request permanent deletion of your Vivexa Learn account and associated personal data.</p>
        {done ? <p className="mt-8 rounded-xl bg-emerald-50 p-4 text-emerald-700">Request received. Our team will respond within 7 working days.</p> :
          <form onSubmit={submit} className="mt-8 space-y-4">
            {["name", "email", "mobile"].map((name) => <input key={name} name={name} type={name === "email" ? "email" : "text"} required placeholder={name[0].toUpperCase() + name.slice(1)} className="w-full rounded-xl border border-slate-300 px-4 py-3" />)}
            <textarea name="reason" placeholder="Reason (optional)" className="w-full rounded-xl border border-slate-300 px-4 py-3" />
            <button disabled={busy} className="w-full rounded-xl bg-red-600 px-4 py-3 font-bold text-white disabled:opacity-60">{busy ? "Submitting…" : "Submit deletion request"}</button>
          </form>}
      </div>
    </main>
  );
}
