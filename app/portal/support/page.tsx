"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { db } from "@/lib/firebase";

interface Faq { id: string; question: string; answer: string }
interface Support { supportEmail: string; supportPhone: string; supportWhatsApp: string; faqs: Faq[] }
const fallback: Support = { supportEmail: "contact@vivexatech.in", supportPhone: "+91 93544 86861", supportWhatsApp: "919354486861", faqs: [{ id: "classes", question: "I cannot join my class. What should I do?", answer: "Check your connection and class time, then contact support if the Join button remains unavailable." }, { id: "fees", question: "Where can I download receipts?", answer: "Open Fees and select the download button beside a completed transaction." }] };
export default function SupportPage() {
  const [support, setSupport] = useState(fallback); const [open, setOpen] = useState<string | null>(null);
  useEffect(() => { void getDoc(doc(db, "appConfig", "main")).then((snap) => { if (snap.exists()) setSupport({ supportEmail: String(snap.data().supportEmail ?? fallback.supportEmail), supportPhone: String(snap.data().supportPhone ?? fallback.supportPhone), supportWhatsApp: String(snap.data().supportWhatsApp ?? fallback.supportWhatsApp), faqs: Array.isArray(snap.data().faqs) ? snap.data().faqs : fallback.faqs }); }); }, []);
  return <div className="space-y-6"><section className="rounded-3xl bg-gradient-to-r from-[#6C3CE9] to-indigo-600 p-8 text-white"><h2 className="text-3xl font-black">How can we help?</h2><p className="mt-2 text-violet-100">Our student support team is ready to assist you.</p></section><div className="grid gap-4 sm:grid-cols-3">{[[Mail, "Email", `mailto:${support.supportEmail}`, support.supportEmail], [Phone, "Call", `tel:${support.supportPhone}`, support.supportPhone], [MessageCircle, "WhatsApp", `https://wa.me/${support.supportWhatsApp.replace(/\D/g, "")}`, "Start chat"]].map(([Icon, label, href, value]) => <a key={String(label)} href={String(href)} target="_blank" rel="noreferrer" className="rounded-2xl border bg-white p-5 shadow-sm"><Icon className="text-[#6C3CE9]" /><p className="mt-3 font-black">{String(label)}</p><p className="mt-1 truncate text-sm text-slate-500">{String(value)}</p></a>)}</div><section className="rounded-2xl border bg-white p-6"><h3 className="text-xl font-black">Frequently asked questions</h3><div className="mt-5 space-y-3">{support.faqs.map((faq) => <div key={faq.id} className="rounded-xl border"><button onClick={() => setOpen(open === faq.id ? null : faq.id)} className="w-full p-4 text-left font-bold">{faq.question}</button>{open === faq.id && <p className="border-t p-4 text-sm leading-6 text-slate-600">{faq.answer}</p>}</div>)}</div></section></div>;
}
