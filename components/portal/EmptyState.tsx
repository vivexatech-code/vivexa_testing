import type { LucideIcon } from "lucide-react";

export function EmptyState({ icon: Icon, title, description }: { icon: LucideIcon; title: string; description: string }) {
  return <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center"><span className="mx-auto grid size-14 place-items-center rounded-2xl bg-violet-50 text-[#6C3CE9]"><Icon /></span><h3 className="mt-4 font-bold text-slate-900">{title}</h3><p className="mx-auto mt-2 max-w-md text-sm text-slate-500">{description}</p></div>;
}
