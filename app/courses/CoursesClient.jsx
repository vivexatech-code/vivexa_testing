"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Monitor, BookOpen, Calculator, Code, Palette, 
  Sparkles, Clock, BarChart, ArrowRight, CheckCircle, 
  Users, Award, Briefcase, FileText, PlayCircle, 
  GraduationCap, Cpu
} from "lucide-react";
import { usePublicCourses } from "@/hooks/usePublicCourses";
import { getCourseIcon } from "@/lib/courseIcons";
import { CourseCardSkeleton } from "@/app/components/Skeletons";

// --- Animation Variants ---
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

// --- Static page content (not course catalog data) ---
const FEATURES = [
  { title: "Practical Training", desc: "100% hands-on sessions with live projects.", icon: PlayCircle },
  { title: "Experienced Faculty", desc: "Learn directly from industry professionals.", icon: Users },
  { title: "Industry-Relevant", desc: "Curriculum aligned with current tech demands.", icon: Briefcase },
  { title: "Certification", desc: "Valuable certificates to boost your resume.", icon: Award },
  { title: "Affordable Fees", desc: "Premium education that fits your budget.", icon: Calculator },
  { title: "Career Guidance", desc: "Placement support and interview preparation.", icon: Sparkles },
];

const PROCESS_STEPS = [
  { step: "01", title: "Choose Your Course", desc: "Browse our premium catalog and select the path that aligns with your goals." },
  { step: "02", title: "Learn Practical Skills", desc: "Attend interactive classes and focus on 100% hands-on execution." },
  { step: "03", title: "Complete Projects", desc: "Build real-world projects to solidify your understanding and portfolio." },
  { step: "04", title: "Get Certified", desc: "Clear your assessments and earn an industry-recognized certificate." },
  { step: "05", title: "Career Guidance", desc: "Get dedicated support for resume building and job placements." },
];

const BENEFITS = [
  { title: "Live Practical Sessions", icon: PlayCircle },
  { title: "Notes & Study Material", icon: BookOpen },
  { title: "Career Support", icon: Briefcase },
  { title: "Real Projects", icon: Code },
  { title: "Skill-Based Learning", icon: Award },
];

export default function CoursesClient({ initialCourses = [] }) {
  const [activeCategory, setActiveCategory] = useState("All Courses");
  const { courses, categories, loading } = usePublicCourses(initialCourses);

  const filteredCourses = activeCategory === "All Courses"
    ? courses
    : courses.filter((course) => course.category === activeCategory);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-500/30 overflow-hidden pb-20">
      
      {/* 1. Premium Hero Section */}
      <section className="relative pt-32 pb-20 lg:pb-24 px-6 flex flex-col items-center justify-center text-center min-h-[60vh]">
        {/* Futuristic Glowing Background */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[150px] -z-10 animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-cyan-500/20 rounded-full blur-[150px] -z-10" />

        {/* Floating Elements (Desktop) */}
        <motion.div animate={{ y: [0, -15, 0] }} transition={{ duration: 5, repeat: Infinity }} className="absolute top-40 left-20 hidden lg:flex w-16 h-16 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl items-center justify-center text-blue-500 shadow-xl">
          <Code size={28} />
        </motion.div>
        <motion.div animate={{ y: [0, 20, 0] }} transition={{ duration: 6, repeat: Infinity, delay: 1 }} className="absolute bottom-32 right-20 hidden lg:flex w-20 h-20 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full items-center justify-center text-cyan-400 shadow-xl">
          <GraduationCap size={36} />
        </motion.div>

        <div className="container mx-auto max-w-4xl relative z-10">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
            <motion.div variants={fadeInUp} className="inline-block px-5 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-600 text-sm font-bold mb-8 tracking-widest uppercase backdrop-blur-sm">
              Accelerate Your Career
            </motion.div>
            <motion.h1 variants={fadeInUp} className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] mb-8 tracking-tight">
              Our Professional <span className="text-gradient">Courses</span>
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Learn practical digital skills and build your future with industry-relevant computer education at Vivexa Institute of Technology.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* 2 & 3. Course Categories & Grid */}
      <section className="py-12 px-6 relative z-10">
        <div className="container mx-auto max-w-7xl">
          
          {/* Category Tabs */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-3 mb-16"
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 backdrop-blur-sm border ${
                  activeCategory === cat 
                    ? "bg-blue-600 text-white border-blue-600 shadow-[0_0_20px_rgba(59,130,246,0.4)] scale-105" 
                    : "bg-white/50 text-slate-600 border-slate-200 hover:border-blue-500/50 hover:text-blue-600"
                }`}
              >
                {cat}
              </button>
            ))}
          </motion.div>

          {/* Courses Grid */}
          <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading &&
              [...Array(6)].map((_, i) => <CourseCardSkeleton key={i} />)}
            {!loading && filteredCourses.length === 0 && (
              <p className="col-span-full text-center text-slate-500 py-16">
                No courses in this category yet.{" "}
                <Link href="/admissions" className="text-blue-600 font-semibold">Apply for admission</Link> to get started.
              </p>
            )}
            <AnimatePresence mode="popLayout">
              {!loading && filteredCourses.map((course) => {
                const Icon = getCourseIcon(course.title, course.category);
                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    key={course.id}
                    className="group rounded-[2rem] p-1 bg-gradient-to-b from-slate-200 to-slate-100 hover:from-blue-600 hover:to-cyan-400 transition-all duration-500 h-full flex flex-col hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10"
                  >
                    <div className="h-full bg-white rounded-[31px] p-8 flex flex-col relative overflow-hidden">
                      {/* Inner Glow Hover */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      <div className="flex justify-between items-start mb-6 relative z-10">
                        <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <Icon size={28} />
                        </div>
                        <span className="px-3 py-1 bg-slate-100 text-slate-500 text-xs font-bold rounded-full border border-slate-200">
                          {course.category || "General"}
                        </span>
                      </div>
                      
                      <h3 className="text-2xl font-black mb-3 text-slate-900 relative z-10">{course.title}</h3>
                      <p className="text-slate-600 mb-8 flex-grow relative z-10 line-clamp-2">
                        {course.description}
                      </p>
                      
                      <div className="flex items-center gap-4 text-sm font-semibold text-slate-500 mb-8 relative z-10">
                        {course.duration && (
                        <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                          <Clock size={16} className="text-blue-500" /> {course.duration}
                        </div>
                        )}
                        {course.level && (
                        <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                          <BarChart size={16} className="text-cyan-500" /> {course.level}
                        </div>
                        )}
                      </div>

                      <Link href="/admissions" className="w-full py-4 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-700 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-cyan-500 group-hover:text-white group-hover:border-transparent transition-all duration-300 flex items-center justify-center gap-2 relative z-10">
                        Apply Now <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* 4. Why Learn With Us */}
      <section className="py-20 md:py-24 px-6 bg-white border-y border-slate-200 relative">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black mb-6">Why Learn With <span className="text-blue-600">Vivexa?</span></h2>
          </div>
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div key={i} variants={fadeInUp} className="flex items-start gap-5 p-6 rounded-3xl bg-slate-50 border border-slate-200 hover:-translate-y-1 transition-transform duration-300">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                    <Icon size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">{feature.desc}</p>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* 5. Course Learning Process */}
      <section className="py-24 px-6 relative">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-black mb-6">The Learning <span className="text-blue-600">Process</span></h2>
          </div>
          
          <div className="relative">
            {/* Desktop Timeline Line */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-600/20 via-cyan-400/20 to-transparent -translate-x-1/2 rounded-full"></div>
            
            <div className="space-y-12">
              {PROCESS_STEPS.map((step, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 30 }} 
                  whileInView={{ opacity: 1, y: 0 }} 
                  viewport={{ once: true, margin: "-100px" }}
                  className={`flex flex-col md:flex-row items-center gap-8 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
                >
                  <div className={`flex-1 w-full text-center ${i % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
                    <h3 className="text-2xl font-bold text-slate-900 mb-3">{step.title}</h3>
                    <p className="text-slate-600">{step.desc}</p>
                  </div>
                  
                  {/* Step Circle */}
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 p-1 shrink-0 z-10 shadow-[0_0_30px_rgba(59,130,246,0.3)]">
                    <div className="w-full h-full bg-slate-50 rounded-full flex items-center justify-center text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-400">
                      {step.step}
                    </div>
                  </div>
                  
                  <div className="flex-1 hidden md:block"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. Student Benefits */}
      <section className="py-20 px-6 bg-slate-900 text-white relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
        <div className="container mx-auto max-w-7xl relative z-10">
          <h2 className="text-3xl md:text-4xl font-black mb-12 text-center text-white">Student <span className="text-cyan-400">Benefits</span></h2>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            {BENEFITS.map((benefit, i) => {
              const Icon = benefit.icon;
              return (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }} 
                  whileInView={{ opacity: 1, scale: 1 }} 
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/10 px-6 py-4 rounded-2xl hover:bg-white/20 transition-colors cursor-default"
                >
                  <Icon size={20} className="text-cyan-400" />
                  <span className="font-semibold">{benefit.title}</span>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* 7. Final Admission CTA */}
      <section className="pt-32 px-6">
        <div className="container mx-auto max-w-5xl">
          <motion.div 
            initial={{ opacity: 0, y: 40 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            className="relative rounded-[2.5rem] overflow-hidden p-12 md:p-20 text-center bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 shadow-2xl shadow-blue-500/20"
          >
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/20 rounded-full blur-[120px] -z-0"></div>
            
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight">
                Start Your Tech Journey Today
              </h2>
              <p className="text-blue-100 text-lg md:text-xl mb-10 max-w-2xl mx-auto font-medium">
                Join Vivexa Institute of Technology and gain the future-ready skills required to excel in the modern digital world.
              </p>
              <Link href="/admissions" className="px-10 py-5 rounded-full bg-white text-blue-700 font-bold text-lg hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] transition-all duration-300 flex items-center justify-center gap-2 mx-auto group">
                Apply For Admission 
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </main>
  );
}