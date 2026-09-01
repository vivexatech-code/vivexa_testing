import type { LucideIcon } from "lucide-react";

export function ClassroomState({
  icon: Icon,
  title,
  description,
  tone = "neutral",
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  tone?: "neutral" | "danger" | "live" | "success";
}) {
  const colors = {
    neutral: "border-slate-200 bg-white text-[#6C3CE9]",
    danger: "border-red-200 bg-red-50 text-red-600",
    live: "border-red-200 bg-red-50 text-red-600",
    success: "border-emerald-200 bg-emerald-50 text-emerald-700",
  }[tone];

  return (
    <div className={`grid aspect-video place-items-center rounded-2xl border p-8 text-center shadow-sm ${colors}`}>
      <div>
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-white/80">
          <Icon />
        </span>
        <h3 className="mt-4 text-xl font-black text-slate-900">{title}</h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">{description}</p>
      </div>
    </div>
  );
}
