"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { useBanners, type Banner } from "@/hooks/useBanners";
import { useNotices } from "@/hooks/useNotices";

const INTERVAL_MS = 5000;

// Hosts allowed through the Next.js image optimizer (see next.config.ts).
// Admins can paste arbitrary image URLs in the Banner module, so anything
// else is rendered unoptimized instead of crashing the page.
const OPTIMIZED_HOSTS = new Set(["res.cloudinary.com"]);

function canOptimize(url: string): boolean {
  try {
    return OPTIMIZED_HOSTS.has(new URL(url).hostname);
  } catch {
    return false;
  }
}

function BannerSlide({ banner }: { banner: Banner }) {
  return (
    <div className="absolute inset-0">
      <Image
        src={banner.imageUrl}
        alt={banner.title || "Campus banner"}
        fill
        priority
        sizes="100vw"
        className="object-cover"
        unoptimized={!canOptimize(banner.imageUrl)}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-900/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-slate-900/20" />

      {(banner.title || banner.subtitle || banner.buttonText) && (
        <div className="absolute inset-0 flex items-end md:items-center">
          <div className="container mx-auto px-6 pb-16 md:pb-0 md:pt-8 max-w-7xl">
            <div className="max-w-xl md:max-w-2xl">
              {banner.title && (
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] mb-3 md:mb-4 drop-shadow-lg">
                  {banner.title}
                </h2>
              )}
              {banner.subtitle && (
                <p className="text-base md:text-lg text-slate-200/90 mb-6 md:mb-8 max-w-lg leading-relaxed">
                  {banner.subtitle}
                </p>
              )}
              {banner.buttonText && (
                <Link
                  href={banner.buttonLink || "/admissions"}
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.03] transition-all group"
                >
                  {banner.buttonText}
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BannerCarousel() {
  const { banners, loading } = useBanners();
  const { marqueeNotices } = useNotices();
  const hasMarquee = marqueeNotices.length > 0;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [direction, setDirection] = useState(1);

  const count = banners.length;

  const goTo = useCallback(
    (next: number, dir: number) => {
      if (count === 0) return;
      setDirection(dir);
      setIndex(((next % count) + count) % count);
    },
    [count]
  );

  const next = useCallback(() => goTo(index + 1, 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1, -1), [goTo, index]);

  useEffect(() => {
    if (count <= 1 || paused) return;
    const id = window.setInterval(() => {
      setDirection(1);
      setIndex((i) => (i + 1) % count);
    }, INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [count, paused]);

  useEffect(() => {
    if (index >= count && count > 0) setIndex(0);
  }, [count, index]);

  if (loading || count === 0) return null;

  const current = banners[index];

  return (
    <section
      className={`relative w-full ${
        hasMarquee ? "pt-[6.5rem] md:pt-[7.25rem]" : "pt-[4.5rem] md:pt-20"
      }`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Featured banners"
    >
      <div className="relative w-full aspect-[4/5] sm:aspect-[16/10] md:aspect-[16/9] max-h-[72vh] overflow-hidden bg-slate-900">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={current.id}
            custom={direction}
            initial={{ opacity: 0, x: direction * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -40 }}
            transition={{ duration: 0.55, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <BannerSlide banner={current} />
          </motion.div>
        </AnimatePresence>

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Previous banner"
              className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next banner"
              className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <ChevronRight size={22} />
            </button>

            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
              {banners.map((b, i) => (
                <button
                  key={b.id}
                  type="button"
                  aria-label={`Go to banner ${i + 1}`}
                  aria-current={i === index}
                  onClick={() => goTo(i, i > index ? 1 : -1)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === index
                      ? "w-8 bg-white"
                      : "w-2 bg-white/40 hover:bg-white/70"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
