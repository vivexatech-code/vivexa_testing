"use client";

import { createContext, useContext } from "react";
import { useStudentPortalData } from "@/hooks/useStudentPortalData";

type PortalData = ReturnType<typeof useStudentPortalData>;
const PortalDataContext = createContext<PortalData | null>(null);

export function PortalDataProvider({ children }: { children: React.ReactNode }) {
  const data = useStudentPortalData();
  return <PortalDataContext.Provider value={data}>{children}</PortalDataContext.Provider>;
}

export function usePortalData() {
  const data = useContext(PortalDataContext);
  if (!data) throw new Error("usePortalData must be used inside PortalDataProvider");
  return data;
}
