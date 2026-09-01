"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, GraduationCap } from "lucide-react";

const NAV_LINKS = [
  { name: "About", path: "/about" },
  { name: "Courses", path: "/courses" },
  { name: "Admissions", path: "/admissions" },
  { name: "Verify Certificate", path: "/verify" },
  { name: "Contact", path: "/contact" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsMobileMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const isActive = (path) =>
    pathname === path || (path !== "/" && pathname?.startsWith(path));

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/85 backdrop-blur-xl shadow-sm border-b border-slate-200/80 py-3"
          : "bg-white/40 backdrop-blur-md border-b border-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3 group z-50">
          <div className="text-xl font-black tracking-tight text-slate-900">
            Vivexa
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
              {" "}
              Institute of Technology
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {NAV_LINKS.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.name}
                href={item.path}
                className={`relative px-3 py-2 text-sm font-semibold transition-colors ${
                  active
                    ? "text-blue-600"
                    : "text-slate-600 hover:text-blue-600"
                }`}
              >
                {item.name}
                <span
                  className={`absolute left-3 right-3 -bottom-0.5 h-0.5 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 transition-all duration-300 ${
                    active ? "opacity-100 scale-x-100" : "opacity-0 scale-x-50"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/portal/login"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-300 text-slate-700 text-sm font-bold hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50/50 transition-all"
          >
            <GraduationCap size={16} />
            Student Login
          </Link>
          <Link
            href="/admissions"
            className="px-6 py-2.5 rounded-full bg-slate-900 text-white text-sm font-bold hover:bg-blue-600 transition-all duration-300 shadow-md hover:shadow-blue-500/25 hover:scale-[1.02]"
          >
            Apply Now
          </Link>
        </div>

        <div className="flex items-center gap-3 md:hidden z-50">
          <button
            className="p-2 -mr-2 text-slate-900 transition-colors hover:bg-slate-100 rounded-full"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <div
        className={`md:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-2xl transition-all duration-300 origin-top overflow-hidden ${
          isMobileMenuOpen ? "max-h-[520px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col px-6 py-6 space-y-1">
          {NAV_LINKS.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.name}
                href={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-base font-semibold py-3 px-3 rounded-xl transition-colors ${
                  active
                    ? "text-blue-600 bg-blue-50"
                    : "text-slate-700 hover:text-blue-600 hover:bg-slate-50"
                }`}
              >
                {item.name}
              </Link>
            );
          })}

          <div className="pt-4 mt-2 border-t border-slate-100 flex flex-col gap-3">
            <Link
              href="/portal/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full border border-slate-300 text-slate-800 text-sm font-bold hover:border-blue-500 hover:text-blue-600 transition-all"
            >
              <GraduationCap size={16} />
              Student Login
            </Link>
            <Link
              href="/admissions"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm font-bold text-center shadow-md hover:shadow-lg transition-shadow"
            >
              Apply Now
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
