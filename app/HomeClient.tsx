"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  MonitorPlay,
  Code,
  Database,
  Award,
  Users,
  Briefcase,
  ArrowRight,
  ChevronRight,
  ChevronDown,
  CheckCircle2,
  ShieldCheck,
  Building2,
  Rocket,
  FileCheck,
  Search,
  Star,
} from "lucide-react";
import { usePublicCourses, type PublicCourse } from "@/hooks/usePublicCourses";
import { useBanners } from "@/hooks/useBanners";
import { getCourseIcon } from "@/lib/courseIcons";
import BannerCarousel from "@/app/components/BannerCarousel";
import NoticePopup from "@/app/components/NoticePopup";
import { CourseCardSkeleton } from "@/app/components/Skeletons";

const FEATURES = [
  {
    title: "Expert Faculty",
    icon: Users,
    desc: "Learn from industry veterans with years of real-world experience.",
  },
  {
    title: "Practical Training",
    icon: Code,
    desc: "100% hands-on learning with live projects and assignments.",
  },
  {
    title: "Industry Skills",
    icon: Briefcase,
    desc: "Curriculum designed to match current IT industry requirements.",
  },
  {
    title: "Career Guidance",
    icon: Award,
    desc: "Dedicated placement assistance and resume building workshops.",
  },
];

const TRUST_PILLARS = [
  {
    title: "Industry-Aligned Curriculum",
    desc: "Courses updated to match current IT and digital skill requirements.",
  },
  {
    title: "Hands-On Learning",
    desc: "Practical labs, assignments, and real-world projects in every program.",
  },
  {
    title: "Verified Credentials",
    desc: "Secure online certificate verification for employers and students.",
  },
];

const INTERNSHIP_BENEFITS = [
  "Real Project Experience",
  "Industry Exposure",
  "Practical Skill Development",
  "Portfolio Building",
  "Work Experience Certificate",
  "Career Growth Opportunities",
];

const VERIFY_FEATURES = [
  "Instant Certificate Verification",
  "Secure Verification System",
  "Unique Certificate ID",
  "Verified Student Information",
  "Authenticity Check",
];

const TESTIMONIALS = [
  {
    name: "Ananya Sharma",
    role: "Web Development Graduate",
    initials: "AS",
    rating: 5,
    quote:
      "The hands-on projects helped me land my first internship. Faculty support at Vivexa is exceptional.",
  },
  {
    name: "Rohit Verma",
    role: "ADCA Student",
    initials: "RV",
    rating: 5,
    quote:
      "Practical labs every day made concepts stick. I finally feel confident with office tools and accounting software.",
  },
  {
    name: "Priya Nair",
    role: "Graphic Design Batch",
    initials: "PN",
    rating: 5,
    quote:
      "From basics to portfolio-ready work — the curriculum is modern and career-focused.",
  },
  {
    name: "Aman Gupta",
    role: "Tally + GST",
    initials: "AG",
    rating: 4,
    quote:
      "Clear teaching, flexible batches, and real GST practice. Highly recommend for working professionals.",
  },
];

const HOME_FAQS = [
  {
    q: "What courses does Vivexa offer?",
    a: "We offer Basic Computers, DCA, ADCA, Tally Prime + GST, Web Development, Graphic Design, Programming Basics, and AI Tools training — with new programs added regularly.",
  },
  {
    q: "Is training practical or theory-based?",
    a: "Our programs are 100% practical-focused. You learn through labs, assignments, and real-world projects guided by experienced faculty.",
  },
  {
    q: "How do I apply for admission?",
    a: "Fill out the online admission form on our Admissions page or visit our Gurugram campus. Our counseling team will guide you through the next steps.",
  },
  {
    q: "Do you provide certificates?",
    a: "Yes. Upon successful course completion you receive a professional certificate that can be verified online via our Verify portal.",
  },
  {
    q: "Are internship opportunities available?",
    a: "Selected students may get internship opportunities through Vivexa Tech based on performance, project execution, and skill level during training.",
  },
  {
    q: "Where is the campus located?",
    a: "Ekta Tower, Basement, Main Road, Ashok Vihar Phase III Extension, Gurugram, Haryana 122006. Working hours: Mon–Sat, 9 AM – 6 PM.",
  },
];

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" as const },
  },
};

export default function HomeClient({
  initialCourses = [],
}: {
  initialCourses?: PublicCourse[];
}) {
  const { displayCourses, courses, loading: coursesLoading } =
    usePublicCourses(initialCourses);
  const { banners, loading: bannersLoading } = useBanners();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const showCarousel = !bannersLoading && banners.length > 0;

  const stats = [
    {
      value: courses.length > 0 ? `${courses.length}+` : "—",
      label: "Active Courses",
    },
    { value: "100%", label: "Practical Training" },
    { value: "Live", label: "Expert Faculty" },
    { value: "24/7", label: "Career Support" },
  ];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-500/30 overflow-hidden">
      <NoticePopup />

      {showCarousel && <BannerCarousel />}

      {/* 1. Hero Section — kept as fallback when no banners */}
      {!showCarousel && (
        <section
          className={`relative pb-20 lg:pb-32 px-6 ${
            showCarousel ? "pt-16 lg:pt-20" : "pt-32 lg:pt-40"
          }`}
        >
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[120px] -z-10 animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-[120px] -z-10" />

          <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="max-w-2xl z-10"
            >
              <motion.div
                variants={fadeInUp}
                className="inline-block px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-600 text-xs font-bold mb-6 tracking-wide uppercase backdrop-blur-sm"
              >
                Empowering the Next Generation
              </motion.div>

              <motion.h1
                variants={fadeInUp}
                className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black leading-[0.95] mb-6 tracking-tighter"
              >
                Build Your Future With{" "}
                <span className="text-gradient">Technology</span>
              </motion.h1>

              <motion.p
                variants={fadeInUp}
                className="text-lg text-slate-600 mb-8 max-w-lg leading-relaxed"
              >
                Join Vivexa Institute of Technology and master future-ready
                digital skills. Get practical training from industry experts and
                accelerate your career.
              </motion.p>

              <motion.div
                variants={fadeInUp}
                className="flex flex-wrap gap-4"
              >
                <Link
                  href="/courses"
                  className="px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/45 hover:scale-[1.03] transition-all flex items-center justify-center gap-2 group"
                >
                  Explore Courses{" "}
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Link>

                <Link
                  href="/contact"
                  className="px-8 py-4 rounded-full border border-slate-300 bg-white/70 backdrop-blur-sm hover:bg-white hover:border-blue-300 hover:shadow-md transition-all font-semibold flex items-center justify-center"
                >
                  Contact Us
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative hidden lg:block z-10"
            >
              <div className="w-full aspect-square bg-gradient-to-tr from-blue-600/10 to-cyan-400/10 rounded-[2.5rem] border border-white/20 backdrop-blur-xl flex items-center justify-center shadow-2xl overflow-hidden relative">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1000')] bg-cover bg-center opacity-10 mix-blend-overlay" />
                <div className="relative z-10 grid grid-cols-2 gap-6 p-8">
                  {[Code, MonitorPlay, Database, Award].map((Icon, i) => (
                    <div
                      key={i}
                      className="w-24 h-24 bg-white/80 backdrop-blur-xl border border-white/40 rounded-2xl flex items-center justify-center shadow-xl animate-bounce"
                      style={{
                        animationDelay: `${i * 0.2}s`,
                        animationDuration: "3s",
                      }}
                    >
                      <Icon className="text-blue-600" size={36} />
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Compact CTA strip when banners replace the hero */}
      {showCarousel && (
        <section className="relative py-14 px-6 border-b border-slate-200 bg-white/60">
          <div className="container mx-auto max-w-5xl text-center">
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-black tracking-tight mb-4"
            >
              Master Future-Ready{" "}
              <span className="text-gradient">Digital Skills</span>
            </motion.h2>
            <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
              Practical training, expert faculty, and career-focused programs at
              Vivexa Institute of Technology.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/courses"
                className="px-8 py-3.5 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/45 hover:scale-[1.03] transition-all inline-flex items-center gap-2 group"
              >
                Explore Courses{" "}
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
              <Link
                href="/admissions"
                className="px-8 py-3.5 rounded-full border border-slate-300 bg-white hover:border-blue-300 hover:shadow-md transition-all font-semibold"
              >
                Apply Now
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 2. Stats Section */}
      <section className="py-14 border-y border-slate-200 bg-white/70 backdrop-blur-md relative z-10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:divide-x divide-slate-200">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.08 }}
                className="text-center px-4"
              >
                <h3 className="text-4xl md:text-5xl font-black text-gradient tracking-tight">
                  {stat.value}
                </h3>
                <p className="text-sm font-semibold text-slate-500 mt-2 uppercase tracking-wide">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Courses */}
      <section className="py-24 px-6 bg-slate-100 relative border-y border-slate-200">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold mb-4 text-slate-900 tracking-tight">
                Popular <span className="text-blue-600">Courses</span>
              </h2>
              <p className="text-slate-600 max-w-xl text-lg">
                Master the most in-demand skills of 2026. From basic computing
                to advanced AI tools.
              </p>
            </div>
            <Link
              href="/courses"
              className="flex items-center gap-2 text-blue-600 font-semibold hover:gap-3 transition-all"
            >
              View All Courses <ChevronRight size={18} />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coursesLoading &&
              [...Array(3)].map((_, i) => <CourseCardSkeleton key={i} />)}
            {!coursesLoading && displayCourses.length === 0 && (
              <p className="col-span-full text-center text-slate-500 py-12">
                Courses are being updated. Please check back soon or{" "}
                <Link
                  href="/contact"
                  className="text-blue-600 font-semibold"
                >
                  contact us
                </Link>
                .
              </p>
            )}
            {!coursesLoading &&
              displayCourses.map((course, i) => {
                const Icon = getCourseIcon(course.title, course.category);
                return (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ delay: i * 0.08 }}
                    className="group h-full rounded-3xl p-[1px] bg-gradient-to-b from-slate-200 to-slate-100 hover:from-blue-600 hover:to-cyan-400 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10"
                  >
                    <div className="h-full min-h-[320px] bg-white rounded-[23px] p-8 flex flex-col">
                      <div className="flex items-start justify-between gap-3 mb-6">
                        <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 group-hover:text-white group-hover:bg-gradient-to-br group-hover:from-blue-600 group-hover:to-cyan-500 transition-all duration-300 shadow-sm">
                          <Icon size={28} />
                        </div>
                        {course.category && (
                          <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide bg-blue-50 text-blue-600 border border-blue-100">
                            {course.category}
                          </span>
                        )}
                      </div>
                      <h3 className="text-2xl font-bold mb-3 text-slate-900">
                        {course.title}
                      </h3>
                      <p className="text-slate-600 mb-8 flex-grow line-clamp-3">
                        {course.description}
                      </p>
                      <Link
                        href="/courses"
                        className="w-full py-3 rounded-xl border border-slate-200 font-semibold text-slate-700 group-hover:bg-blue-600 group-hover:text-white group-hover:border-transparent transition-all duration-300 flex items-center justify-center"
                      >
                        Learn More
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 px-6 relative">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-slate-900 tracking-tight">
              Why Choose <span className="text-blue-600">Vivexa</span>
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg">
              We provide an ecosystem designed for your rapid growth, combining
              theory with intensive practical application.
            </p>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {FEATURES.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={i}
                  variants={fadeInUp}
                  className="p-8 rounded-3xl bg-white border border-slate-200 hover:border-blue-500/50 transition-all duration-300 group hover:-translate-y-2 hover:shadow-xl hover:shadow-blue-500/5"
                >
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                    <Icon size={28} />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-slate-900">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {feature.desc}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Internship Program */}
      <section className="py-24 px-6 relative border-t border-slate-200 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] -z-10" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] -z-10" />

        <div className="container mx-auto max-w-7xl grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-600 text-xs font-bold mb-6 tracking-wide uppercase">
              <Rocket size={16} /> Exclusive For Students
            </div>

            <h2 className="text-4xl md:text-5xl font-black leading-tight mb-6 text-slate-900 tracking-tight">
              Internship Opportunities{" "}
              <span className="text-gradient">Also Available</span>
            </h2>

            <p className="text-lg text-slate-600 mb-10 leading-relaxed">
              Gain real-world experience through exclusive internship programs.
              Selected students may get opportunities to work on live projects
              after course completion through our parent company, Vivexa Tech.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 mb-10">
              {INTERNSHIP_BENEFITS.map((benefit, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                    <CheckCircle2 size={14} strokeWidth={3} />
                  </div>
                  <span className="font-semibold text-slate-700">{benefit}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="p-10 rounded-[2.5rem] bg-white/60 border border-slate-200 backdrop-blur-2xl shadow-2xl hover:shadow-blue-500/10 transition-shadow group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-500/20 to-cyan-400/0 rounded-full blur-2xl pointer-events-none transition-opacity group-hover:opacity-100 opacity-50" />

              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 mb-8">
                <Building2 size={32} />
              </div>

              <h3 className="text-3xl font-black text-slate-900 mb-4">
                Powered By Vivexa Tech
              </h3>
              <p className="text-slate-600 leading-relaxed mb-8">
                Selected students may get internship opportunities through
                Vivexa Tech based on overall performance, project execution, and
                skill level during the training program.
              </p>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center w-full py-4 rounded-xl bg-slate-900 text-white font-bold hover:shadow-lg hover:scale-[1.01] transition-all active:scale-95 group/btn"
              >
                Explore Opportunities{" "}
                <ArrowRight
                  size={18}
                  className="ml-2 group-hover/btn:translate-x-1 transition-transform"
                />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Pillars */}
      <section className="py-24 px-6 relative">
        <div className="container mx-auto max-w-6xl text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-16 text-slate-900 tracking-tight">
            Why Students <span className="text-blue-600">Choose Vivexa</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {TRUST_PILLARS.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:-translate-y-1 hover:shadow-lg hover:border-blue-200 transition-all"
              >
                <h4 className="font-bold text-xl text-slate-900 mb-3">
                  {item.title}
                </h4>
                <p className="text-slate-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 bg-white border-y border-slate-200">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
              Student <span className="text-blue-600">Stories</span>
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Hear from learners who built their skills with Vivexa Institute of
              Technology.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.article
                key={t.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="p-6 rounded-3xl bg-slate-50 border border-slate-200 hover:border-blue-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/5 transition-all flex flex-col"
              >
                <div className="flex gap-0.5 mb-4 text-amber-400">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star
                      key={s}
                      size={16}
                      className={
                        s < t.rating ? "fill-amber-400" : "text-slate-300"
                      }
                    />
                  ))}
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-grow">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 text-white font-bold text-sm flex items-center justify-center shadow-md">
                    {t.initials}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.role}</p>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Certificate Verification */}
      <section className="py-24 px-6 bg-slate-100 border-y border-slate-200 relative overflow-hidden">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] -z-10 pointer-events-none" />

        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-5 text-center lg:text-left"
            >
              <h2 className="text-3xl md:text-5xl font-black mb-6 text-slate-900 tracking-tight">
                Verify Certificates{" "}
                <span className="text-blue-600">Online</span>
              </h2>
              <p className="text-lg text-slate-600 mb-10 leading-relaxed">
                Vivexa Institute of Technology provides secure, online
                certificate verification for authenticity and trust. Students
                and organizations can verify credentials instantly.
              </p>

              <div className="space-y-5 mb-10 inline-block text-left">
                {VERIFY_FEATURES.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0">
                      <CheckCircle2 size={12} strokeWidth={4} />
                    </div>
                    <span className="font-semibold text-slate-700">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              <div className="text-center lg:text-left">
                <Link
                  href="/verify"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] hover:scale-[1.02] transition-all active:scale-95 gap-2 group"
                >
                  <ShieldCheck size={20} /> Verify Certificate
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7"
            >
              <div className="p-8 md:p-10 rounded-[2.5rem] bg-white border border-slate-200 shadow-2xl relative">
                <div className="absolute top-10 right-10 w-20 h-20 bg-green-500/10 rounded-full blur-2xl pointer-events-none" />

                <div className="flex items-center gap-4 mb-8 pb-8 border-b border-slate-100">
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                    <FileCheck size={28} />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-slate-900">
                      Certificate Search
                    </h4>
                    <p className="text-sm text-slate-500">
                      Enter unique ID to verify
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                      Certificate ID
                    </label>
                    <div className="flex items-center w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-400">
                      <Search size={18} className="mr-3 text-slate-400 shrink-0" />
                      <span className="font-mono tracking-wider text-sm">
                        Enter certificate ID on verify page
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                      Verification URL
                    </label>
                    <div className="flex items-center w-full px-5 py-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 break-all">
                      <span className="font-mono text-sm">
                        vit.vivexatech.in/verify
                      </span>
                    </div>
                  </div>

                  <div className="mt-8 p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-4">
                    <ShieldCheck className="text-blue-600 shrink-0" size={24} />
                    <div>
                      <p className="font-bold text-slate-700">
                        Secure verification portal
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Use your unique certificate ID to confirm authenticity
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-6 relative">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
              Frequently Asked <span className="text-blue-600">Questions</span>
            </h2>
            <p className="text-slate-600">
              Quick answers about courses, admissions, and campus life.
            </p>
          </div>

          <div className="space-y-4">
            {HOME_FAQS.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className={`border rounded-2xl overflow-hidden transition-colors duration-300 ${
                    isOpen
                      ? "bg-white border-blue-500/30 shadow-md"
                      : "bg-slate-50 border-slate-200 hover:border-blue-500/30"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full flex items-center justify-between p-6 text-left"
                  >
                    <span className="text-lg font-bold text-slate-900 pr-4">
                      {faq.q}
                    </span>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                        isOpen
                          ? "bg-blue-600 text-white rotate-180"
                          : "bg-slate-200 text-slate-500"
                      }`}
                    >
                      <ChevronDown size={18} />
                    </div>
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 text-slate-600 leading-relaxed border-t border-slate-100 mt-2 pt-4">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Admission CTA Banner */}
      <section className="py-12 px-6 pb-24">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-[2.5rem] overflow-hidden p-12 md:p-20 text-center bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 shadow-2xl shadow-blue-500/20"
          >
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />

            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
                Admissions Open for 2026
              </h2>
              <p className="text-blue-100 text-lg md:text-xl mb-10 max-w-2xl mx-auto font-medium">
                Take the first step towards a lucrative career in tech. Limited
                seats available for our upcoming premium batches.
              </p>
              <Link
                href="/admissions"
                className="inline-block px-10 py-4 rounded-full bg-white text-blue-700 font-bold text-lg hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all duration-300"
              >
                Enroll Today
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
