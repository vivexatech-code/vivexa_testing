"use client";

import Link from "next/link";
import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { Bell, LogOut, Mail } from "lucide-react";
import { db } from "@/lib/firebase";
import { usePortalAuth } from "@/context/PortalAuthContext";
import type { UserPreferences } from "@/types/student";

export default function SettingsPage() {
  const { studentData, studentDocId, logout } = usePortalAuth(); const [preferences, setPreferences] = useState<UserPreferences>(studentData?.preferences ?? { inAppNotifications: true, emailAlerts: false }); const [saved, setSaved] = useState(false);
  async function toggle(key: keyof UserPreferences) { if (!studentDocId) return; const next = { ...preferences, [key]: !preferences[key] }; setPreferences(next); setSaved(false); await updateDoc(doc(db, "students", studentDocId), { preferences: next }); setSaved(true); }
  const options: Array<[keyof UserPreferences, string, string, typeof Bell]> = [["inAppNotifications", "In-app notifications", "Show course and institute updates", Bell], ["emailAlerts", "Email alerts", "Receive important updates by email", Mail]];
  return <div className="mx-auto max-w-3xl space-y-6"><section className="rounded-2xl border bg-white p-6 shadow-sm"><h2 className="text-xl font-black">Notification preferences</h2><div className="mt-5 divide-y">{options.map(([key, label, detail, Icon]) => <div key={key} className="flex items-center gap-4 py-4"><span className="rounded-xl bg-violet-50 p-3 text-[#6C3CE9]"><Icon /></span><div><p className="font-bold">{label}</p><p className="text-sm text-slate-500">{detail}</p></div><button role="switch" aria-checked={preferences[key]} onClick={() => void toggle(key)} className={`ml-auto h-7 w-12 rounded-full p-1 transition ${preferences[key] ? "bg-[#6C3CE9]" : "bg-slate-300"}`}><span className={`block size-5 rounded-full bg-white transition ${preferences[key] ? "translate-x-5" : ""}`} /></button></div>)}</div>{saved && <p className="text-sm text-emerald-600">Preferences saved.</p>}</section><section className="rounded-2xl border bg-white p-6"><h3 className="font-black">Legal</h3><div className="mt-4 flex gap-4 text-sm font-bold text-[#6C3CE9]"><Link href="/privacy">Privacy policy</Link><Link href="/terms">Terms</Link><Link href="/delete-account">Delete account</Link></div></section><button onClick={() => void logout()} className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 py-3 font-bold text-red-600"><LogOut size={18} />Sign out</button></div>;
}
