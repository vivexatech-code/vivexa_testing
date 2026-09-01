import { Suspense } from "react";
import VerifyClient from "@/app/verify/VerifyClient";

export const metadata = {
  title: "Certificate Verification | Vivexa Institute of Technology",
  description: "Verify certificates issued by Vivexa Institute of Technology.",
};

export default function VerifyPage() {
  return <Suspense fallback={<main className="min-h-screen grid place-items-center">Loading verification…</main>}><VerifyClient /></Suspense>;
}
