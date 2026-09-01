export function ProgressBar({ value, label, color = "bg-[#6C3CE9]" }: { value: number; label?: string; color?: string }) {
  const safe = Math.max(0, Math.min(100, value || 0));
  return <div>{label && <div className="mb-2 flex justify-between text-sm"><span className="font-medium text-slate-600">{label}</span><span className="font-bold text-slate-900">{safe}%</span></div>}<div className="h-2.5 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${safe}%` }} /></div></div>;
}
