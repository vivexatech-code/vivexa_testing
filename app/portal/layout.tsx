import type { Metadata } from "next";
import { PortalAuthProvider } from "@/context/PortalAuthContext";
import { PortalShell } from "@/components/portal/PortalShell";

export const metadata: Metadata = {
  title: { default: "Student Portal", template: "%s | Vivexa Learn" },
  description: "Vivexa Learn student portal",
  robots: { index: false, follow: false },
};

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return <PortalAuthProvider><PortalShell>{children}</PortalShell></PortalAuthProvider>;
}
