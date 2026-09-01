import {
  MonitorPlay,
  BookOpen,
  Database,
  Code,
  PenTool,
  Award,
  Calculator,
  Cpu,
  Briefcase,
  GraduationCap,
  FileText,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

export function getCourseIcon(title = "", category = ""): LucideIcon {
  const key = `${title} ${category}`.toLowerCase();
  if (key.includes("web") || key.includes("mern") || key.includes("javascript")) return Code;
  if (key.includes("design") || key.includes("graphic") || key.includes("canva")) return PenTool;
  if (key.includes("tally") || key.includes("account") || key.includes("gst")) return Calculator;
  if (key.includes("ai") || key.includes("digital")) return Sparkles;
  if (key.includes("adca") || key.includes("diploma")) return GraduationCap;
  if (key.includes("office") || key.includes("ms ")) return FileText;
  if (key.includes("program") || key.includes("python") || key.includes("c++")) return Cpu;
  if (key.includes("intern")) return Briefcase;
  if (key.includes("data")) return Database;
  if (key.includes("basic") || key.includes("computer")) return MonitorPlay;
  if (key.includes("cert")) return Award;
  return BookOpen;
}
