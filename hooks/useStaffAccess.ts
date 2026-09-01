"use client";

import { useEffect, useState } from "react";
import { usePortalAuth } from "@/context/PortalAuthContext";
import { isStaffRole } from "@/lib/liveClasses/access";
import { portalFetch } from "@/lib/portalFetch";

export function useStaffAccess() {
  const { studentData, user } = usePortalAuth();
  const [isStaff, setIsStaff] = useState(isStaffRole(studentData?.role));

  useEffect(() => {
    setIsStaff(isStaffRole(studentData?.role));
    if (!user) return;
    void portalFetch("/api/portal/session")
      .then((data) => setIsStaff(Boolean(data.isStaff) || isStaffRole(studentData?.role)))
      .catch(() => setIsStaff(isStaffRole(studentData?.role)));
  }, [user, studentData?.role]);

  return isStaff;
}
