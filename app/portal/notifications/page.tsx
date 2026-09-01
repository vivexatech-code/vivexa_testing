"use client";

import Link from "next/link";
import { Bell, CheckCheck } from "lucide-react";
import { doc, writeBatch } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { usePortalAuth } from "@/context/PortalAuthContext";
import { usePortalData } from "@/context/PortalDataContext";

function group(dateValue?: string) {
  if (!dateValue) return "Earlier"; const date = new Date(dateValue); const today = new Date(); const yesterday = new Date(); yesterday.setDate(today.getDate() - 1);
  return date.toDateString() === today.toDateString() ? "Today" : date.toDateString() === yesterday.toDateString() ? "Yesterday" : "Earlier";
}
export default function NotificationsPage() {
  const { studentDocId } = usePortalAuth(); const { notifications } = usePortalData();
  async function mark(ids: string[]) { if (!studentDocId) return; const batch = writeBatch(db); ids.forEach((id) => batch.update(doc(db, "students", studentDocId, "notifications", id), { isRead: true })); await batch.commit(); }
  const groups = ["Today", "Yesterday", "Earlier"] as const;
  return <div><header className="flex items-center justify-between"><div><h2 className="text-2xl font-black">Notifications</h2><p className="mt-1 text-sm text-slate-500">Updates from your learning journey</p></div><button onClick={() => void mark(notifications.filter((item) => !item.isRead).map((item) => item.id))} className="flex items-center gap-2 text-sm font-bold text-[#6C3CE9]"><CheckCheck size={18} />Mark all read</button></header><div className="mt-6 space-y-7">{groups.map((name) => { const items = notifications.filter((item) => group(item.createdAt) === name); return items.length ? <section key={name}><h3 className="mb-3 text-xs font-black uppercase tracking-wider text-slate-400">{name}</h3><div className="space-y-3">{items.map((item) => <Link href={item.route || "/portal/notifications"} onClick={() => void mark([item.id])} key={item.id} className={`flex gap-4 rounded-2xl border p-4 shadow-sm ${item.isRead ? "bg-white" : "border-violet-200 bg-violet-50/60"}`}><span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white text-[#6C3CE9]"><Bell size={19} /></span><div><h4 className="font-bold">{item.title}</h4><p className="mt-1 text-sm text-slate-600">{item.message}</p><p className="mt-2 text-xs text-slate-400">{item.time}</p></div></Link>)}</div></section> : null; })}{!notifications.length && <p className="rounded-2xl border border-dashed bg-white p-12 text-center text-slate-500">No notifications yet.</p>}</div></div>;
}
