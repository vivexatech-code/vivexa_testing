"use client";

import { Download, IndianRupee } from "lucide-react";
import { usePortalData } from "@/context/PortalDataContext";
import { usePortalAuth } from "@/context/PortalAuthContext";
import { buildReceiptHtml } from "@/lib/receiptHtml";

export default function FeesPage() {
  const { feeSummary } = usePortalData(); const { studentData } = usePortalAuth();
  function receipt(index: number) {
    if (!feeSummary || !studentData) return; const item = feeSummary.transactions[index] ?? feeSummary.installments[index]; if (!item) return;
    const payment = item as { id?: string; transactionId?: string; method?: string; amount: number; date: string };
    const amount = payment.amount; const date = payment.date; const method = payment.method ?? "Online"; const receiptNo = payment.id ?? payment.transactionId ?? `VIT-${index + 1}`;
    const windowRef = window.open("", "_blank"); if (!windowRef) return;
    windowRef.document.write(buildReceiptHtml({ receiptNo, date, studentName: studentData.fullName, studentId: studentData.studentId, courseName: feeSummary.course || studentData.course, paymentMode: method, amount, totalFee: feeSummary.totalFee, previouslyPaid: Math.max(0, feeSummary.paidAmount - amount), remainingBalance: feeSummary.remainingBalance })); windowRef.document.close();
  }
  if (!feeSummary) return <div className="rounded-2xl border border-dashed bg-white p-12 text-center"><IndianRupee className="mx-auto text-[#6C3CE9]" size={36} /><h2 className="mt-4 font-black">No fee record found</h2><p className="mt-2 text-sm text-slate-500">Contact administration if you believe this is incorrect.</p></div>;
  const payments = feeSummary.transactions.length ? feeSummary.transactions : feeSummary.installments;
  return <div className="space-y-6"><section className="grid gap-4 sm:grid-cols-3">{[["Total fee", feeSummary.totalFee], ["Paid", feeSummary.paidAmount], ["Remaining", feeSummary.remainingBalance]].map(([label, value]) => <div key={String(label)} className="rounded-2xl border bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-2xl font-black">₹{Number(value).toLocaleString("en-IN")}</p></div>)}</section><section className="rounded-2xl border bg-white p-6 shadow-sm"><div className="flex flex-wrap justify-between gap-3"><div><h2 className="text-xl font-black">Payment summary</h2><p className="mt-1 text-sm text-slate-500">Status: {feeSummary.paymentStatus}</p></div>{feeSummary.paymentUrl && <a href={feeSummary.paymentUrl} target="_blank" rel="noreferrer" className="rounded-xl bg-[#6C3CE9] px-4 py-2.5 text-sm font-bold text-white">Pay now</a>}</div><p className="mt-5 text-sm text-slate-500">Next due: {feeSummary.nextDueDate || "—"}</p></section><section className="rounded-2xl border bg-white p-6"><h3 className="font-black">Transactions</h3><div className="mt-4 space-y-3">{payments.map((item, index) => <div key={"id" in item ? item.id : `${item.date}-${index}`} className="flex items-center rounded-xl bg-slate-50 p-4"><div><p className="font-bold">₹{item.amount.toLocaleString("en-IN")}</p><p className="text-sm text-slate-500">{item.date} · {"method" in item ? item.method : "Installment"}</p></div><button onClick={() => receipt(index)} className="ml-auto rounded-lg border p-2 text-[#6C3CE9]" aria-label="Download receipt"><Download size={18} /></button></div>)}{!payments.length && <p className="text-sm text-slate-500">No transactions recorded.</p>}</div></section></div>;
}
