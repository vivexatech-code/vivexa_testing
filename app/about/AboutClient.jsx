"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Target, Eye, Cpu, MonitorPlay, Code, Users, 
  Award, Briefcase, Zap, CheckCircle, GraduationCap, 
  BookOpen, Rocket, ArrowRight 
} from "lucide-react";

// --- Reusable Animation Variants ---
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

// --- Data Arrays ---
const WHY_CHOOSE_US = [
  { title: "Experienced Faculty", icon: Users, desc: "Learn from industry experts with years of real-world technical experience." },
  { title: "Practical Training", icon: Code, desc: "100% hands-on learning with live projects, assignments, and case studies." },
  { title: "Updated Curriculum", icon: BookOpen, desc: "Syllabus constantly updated to match current tech industry requirements." },
  { title: "Affordable Fees", icon: Award, desc: "Premium education made accessible with highly competitive fee structures." },
  { title: "Certification", icon: GraduationCap, desc: "Get globally recognized certificates upon successful course completion." },
  { title: "Career Support", icon: Briefcase, desc: "Dedicated placement assistance, resume building, and interview prep." },
];

const VALUES = [
  { title: "Innovation", icon: Zap },
  { title: "Discipline", icon: Target },
  { title: "Quality Education", icon: Award },
  { title: "Student Success", icon: Users },
  { title: "Tech First", icon: Cpu },
];

const STATS = [
  { value: "500+", label: "Students Trained" },
  { value: "20+", label: "Professional Courses" },
  { value: "95%", label: "Student Satisfaction" },
  { value: "100%", label: "Career Support" },
];

export default function AboutClient() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-500/30 overflow-hidden">
      
      {/* 1. Premium Hero Banner */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 px-6 flex items-center justify-center min-h-[70vh]">
        {/* Futuristic Glowing Orbs */}
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-blue-600/20 rounded-full blur-[150px] -z-10 animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-[150px] -z-10" />

        {/* Floating Abstract Tech Elements (Desktop Only) */}
        <motion.div 
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }} 
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} 
          className="absolute top-32 left-20 hidden lg:flex w-16 h-16 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl items-center justify-center text-blue-500 shadow-xl"
        >
          <Code size={28} />
        </motion.div>
        <motion.div 
          animate={{ y: [0, 25, 0], rotate: [0, -10, 0] }} 
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }} 
          className="absolute bottom-32 right-20 hidden lg:flex w-20 h-20 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full items-center justify-center text-cyan-400 shadow-xl"
        >
          <Cpu size={36} />
        </motion.div>

        <div className="container mx-auto text-center max-w-4xl relative z-10">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
            <motion.div variants={fadeInUp} className="inline-block px-5 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-600 text-sm font-bold mb-8 tracking-widest uppercase backdrop-blur-sm shadow-[0_0_20px_rgba(59,130,246,0.15)]">
              Discover Our Story
            </motion.div>
            <motion.h1 variants={fadeInUp} className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] mb-8 tracking-tight">
              Empowering Future Through <span className="text-gradient drop-shadow-sm">Technology</span>
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Vivexa Institute of Technology is committed to providing practical computer education and future-ready digital skills for the innovators of tomorrow.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* 2. About Institute Section */}
      <section className="py-24 px-6 relative z-10 bg-white border-y border-slate-200">
        <div className="container mx-auto max-w-7xl grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Futuristic Abstract Image/Graphic */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="relative aspect-square md:aspect-[4/3] rounded-[2.5rem] overflow-hidden group shadow-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-cyan-400 opacity-90 mix-blend-multiply z-10 transition-opacity duration-500 group-hover:opacity-75"></div>
            <img 
              src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=1200" 
              alt="Vivexa Institute of Technology students learning practical computer skills" 
              className="object-cover w-full h-full scale-105 group-hover:scale-100 transition-transform duration-700"
            />
            {/* Overlay Glass Panel */}
            <div className="absolute bottom-8 left-8 right-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 z-20 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 opacity-0 group-hover:opacity-100">
              <p className="text-white font-semibold text-lg flex items-center gap-2">
                <Rocket className="text-cyan-400" /> Accelerating Careers
              </p>
            </div>
          </motion.div>

          {/* Right: Content */}
          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true, margin: "-100px" }} 
            variants={staggerContainer}
          >
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-black mb-6">
              Who We <span className="text-blue-600">Are</span>
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-slate-600 text-lg mb-8 leading-relaxed">
              Vivexa Institute of Technology is a modern computer education institute dedicated to empowering students with practical skills, industry-relevant knowledge, and career-focused training. Our mission is to bridge the gap between education and technology by offering premium learning experiences.
            </motion.p>
            
            <div className="grid sm:grid-cols-2 gap-4">
              {["Practical Learning", "Industry-Oriented Courses", "Career Guidance", "Skill Development"].map((item, i) => (
                <motion.div key={i} variants={fadeInUp} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                    <CheckCircle size={16} />
                  </div>
                  <span className="font-semibold text-slate-800">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. Mission & Vision Section */}
      <section className="py-24 px-6 relative">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Mission Card */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              className="p-10 md:p-14 rounded-[2rem] bg-gradient-to-br from-white to-slate-50 border border-slate-200 backdrop-blur-xl shadow-xl shadow-slate-200/50 hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white mb-8 shadow-lg shadow-blue-500/30">
                <Target size={32} />
              </div>
              <h3 className="text-3xl font-black mb-4">Our Mission</h3>
              <p className="text-slate-600 text-lg leading-relaxed">
                "To provide premium quality computer education and digital skills training that empowers students, bridges the industry gap, and prepares them for lucrative future career opportunities."
              </p>
            </motion.div>

            {/* Vision Card */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              transition={{ delay: 0.2 }}
              className="p-10 md:p-14 rounded-[2rem] bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 text-white backdrop-blur-xl shadow-xl hover:-translate-y-2 transition-transform duration-300 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/20 rounded-full blur-[80px] -z-10" />
              <div className="w-16 h-16 rounded-2xl bg-cyan-400 flex items-center justify-center text-slate-900 mb-8 shadow-lg shadow-cyan-400/30">
                <Eye size={32} />
              </div>
              <h3 className="text-3xl font-black mb-4">Our Vision</h3>
              <p className="text-slate-300 text-lg leading-relaxed">
                "To become a globally recognized leading institute of technology by nurturing talent, fostering innovation, and helping students build strong technical skills and unwavering confidence."
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. Why Choose Us Section */}
      <section className="py-24 px-6 bg-slate-100 relative">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black mb-6">Why Choose <span className="text-blue-600">Us?</span></h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg">
              We don't just teach software; we build careers. Here is why thousands of students trust Vivexa for their educational journey.
            </p>
          </div>

          <motion.div 
            variants={staggerContainer} 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true, margin: "-50px" }} 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {WHY_CHOOSE_US.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div 
                  key={i} 
                  variants={fadeInUp} 
                  className="group p-8 rounded-3xl bg-white border border-slate-200 hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-blue-500/10"
                >
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 text-blue-600 flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 shadow-sm">
                    <Icon size={28} />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-slate-900">{item.title}</h3>
                  <p className="text-slate-600 leading-relaxed">
                    {item.desc}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* 5. Institute Values Section */}
      <section className="py-24 px-6 border-b border-slate-200 relative z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-500/10 rounded-full blur-[120px] -z-10" />
        
        <div className="container mx-auto max-w-6xl text-center">
          <h2 className="text-3xl md:text-5xl font-black mb-16">Our Core <span className="text-blue-600">Values</span></h2>
          
          <motion.div 
            variants={staggerContainer} 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true }} 
            className="flex flex-wrap justify-center gap-6"
          >
            {VALUES.map((value, i) => {
              const Icon = value.icon;
              return (
                <motion.div 
                  key={i} 
                  variants={fadeInUp} 
                  className="w-40 h-40 md:w-48 md:h-48 rounded-[2rem] bg-white/50 border border-slate-200 backdrop-blur-md flex flex-col items-center justify-center gap-4 hover:bg-blue-600 hover:text-white transition-all duration-300 group cursor-default shadow-lg shadow-slate-200/20"
                >
                  <Icon size={40} className="text-blue-600 group-hover:text-white transition-colors" />
                  <span className="font-bold text-sm md:text-base text-slate-800 group-hover:text-white">{value.title}</span>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* 6. Student Success Highlight (Stats) */}
      <section className="py-20 px-6 bg-slate-900 text-white relative overflow-hidden">
        {/* Tech Grid Pattern */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 divide-x-0 md:divide-x divide-white/10 text-center">
            {STATS.map((stat, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, scale: 0.8 }} 
                whileInView={{ opacity: 1, scale: 1 }} 
                viewport={{ once: true }} 
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="px-4"
              >
                <div className="text-4xl md:text-5xl lg:text-6xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                  {stat.value}
                </div>
                <div className="text-sm md:text-base font-medium text-slate-400 uppercase tracking-wider">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Final CTA Section */}
      <section className="py-24 px-6 relative">
        <div className="container mx-auto max-w-5xl">
          <motion.div 
            initial={{ opacity: 0, y: 40 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            className="relative rounded-[2.5rem] overflow-hidden p-12 md:p-20 text-center bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 shadow-[0_20px_50px_rgba(59,130,246,0.25)]"
          >
            {/* Animated Glow in CTA */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 rounded-full blur-[100px] -z-0"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/20 rounded-full blur-[100px] -z-0"></div>
            
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight">
                Start Your Learning Journey With Vivexa
              </h2>
              <p className="text-blue-100 text-lg md:text-xl mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
                Join Vivexa Institute of Technology today and equip yourself with the future-ready skills demanded by top tech companies globally.
              </p>
              <Link href="/courses" className="px-10 py-5 rounded-full bg-white text-blue-700 font-bold text-lg hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] transition-all duration-300 flex items-center justify-center gap-2 mx-auto group">
                Explore Courses 
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </main>
  );
}