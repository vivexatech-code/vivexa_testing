"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { X, ArrowRight, Megaphone } from "lucide-react";
import { useNotices, type NoticeType } from "@/hooks/useNotices";

const STORAGE_KEY = "vit-notice-popup-dismissed";

const TYPE_LABELS: Record<NoticeType, string> = {
  offer: "Special Offer",
  notice: "Important Notice",
  popup: "Announcement",
  admission: "Admissions",
};

export default function NoticePopup() {
  const { popupNotice, loading } = useNotices();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (loading || !popupNotice) return;

    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { id?: string };
        if (parsed.id === popupNotice.id) return;
      }
    } catch {
      // ignore corrupt storage
    }

    setOpen(true);
  }, [loading, popupNotice]);

  const dismiss = () => {
    if (popupNotice) {
      try {
        sessionStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ id: popupNotice.id })
        );
      } catch {
        // ignore
      }
    }
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && popupNotice && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            aria-label="Close notice"
            onClick={dismiss}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="notice-popup-title"
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ type: "spring", damping: 26, stiffness: 320 }}
            className="relative w-full max-w-md rounded-[1.75rem] bg-white border border-slate-200 shadow-2xl overflow-hidden"
          >
            <div
              className="h-1.5 w-full"
              style={{ backgroundColor: popupNotice.color || "#2563eb" }}
            />

            <button
              type="button"
              onClick={dismiss}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 flex items-center justify-center transition-colors"
              aria-label="Dismiss"
            >
              <X size={18} />
            </button>

            <div className="p-8 pt-7">
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg"
                  style={{
                    backgroundColor: popupNotice.color || "#2563eb",
                  }}
                >
                  <Megaphone size={22} />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
                  {TYPE_LABELS[popupNotice.type] ?? "Announcement"}
                </span>
              </div>

              <h3
                id="notice-popup-title"
                className="text-2xl font-black text-slate-900 mb-3 tracking-tight"
              >
                {popupNotice.title}
              </h3>

              {popupNotice.description && (
                <p className="text-slate-600 leading-relaxed mb-7">
                  {popupNotice.description}
                </p>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href={popupNotice.link || "/admissions"}
                  onClick={dismiss}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold hover:shadow-lg hover:shadow-blue-500/30 hover:scale-[1.02] transition-all group"
                >
                  Learn More
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-0.5 transition-transform"
                  />
                </Link>
                <button
                  type="button"
                  onClick={dismiss}
                  className="px-5 py-3.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
