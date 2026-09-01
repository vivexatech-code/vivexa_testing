"use client";

import { useState } from "react";
import Script from "next/script";
import { motion, AnimatePresence } from "framer-motion";
import { usePublicCourses } from "@/hooks/usePublicCourses";
import { 
  Rocket, MousePointerClick, FileEdit, UserCheck, 
  CheckCircle, PlayCircle, Send, RotateCcw,
  MonitorPlay, Calculator, Code, Palette, 
  Sparkles, Clock, BarChart, ArrowRight,
  Image as ImageIcon, CreditCard, FileBadge, MapPin,
  ChevronDown, GraduationCap, Users, Briefcase, Award,
  CheckCircle2, AlertCircle
} from "lucide-react";

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

// --- Data Models ---
const PROCESS_STEPS = [
  { step: "1", title: "Choose Your Course", desc: "Select from our premium catalog.", icon: MousePointerClick },
  { step: "2", title: "Fill Admission Form", desc: "Submit your details online.", icon: FileEdit },
  { step: "3", title: "Counseling", desc: "Get expert career guidance.", icon: UserCheck },
  { step: "4", title: "Confirm Admission", desc: "Submit docs & complete fee.", icon: CheckCircle },
  { step: "5", title: "Start Learning", desc: "Begin your tech journey.", icon: PlayCircle },
];

const COURSES = [
  { title: "Basic Computer", duration: "2 Months", level: "Beginner", icon: MonitorPlay },
  { title: "DCA", duration: "6 Months", level: "Beginner", icon: GraduationCap },
  { title: "ADCA", duration: "12 Months", level: "Intermediate", icon: Award },
  { title: "Tally Prime + GST", duration: "3 Months", level: "Intermediate", icon: Calculator },
  { title: "Web Development", duration: "6 Months", level: "Intermediate", icon: Code },
  { title: "Graphic Design", duration: "4 Months", level: "Beginner", icon: Palette },
  { title: "AI Tools Training", duration: "1 Month", level: "All Levels", icon: Sparkles },
  { title: "Programming Basics", duration: "2 Months", level: "Beginner", icon: Code },
];

const DOCUMENTS = [
  { title: "Passport Size Photo", icon: ImageIcon },
  { title: "Aadhaar Card Copy", icon: CreditCard },
  { title: "Previous Qualification", icon: FileBadge },
  { title: "Address Proof", icon: MapPin },
];

const WHY_VIT = [
  { title: "Practical Training", icon: PlayCircle },
  { title: "Expert Faculty", icon: Users },
  { title: "Career Guidance", icon: Briefcase },
  { title: "Certification", icon: Award },
  { title: "Affordable Fees", icon: Calculator },
  { title: "Future-Ready Skills", icon: Sparkles },
];

const FAQS = [
  { q: "How do I apply?", a: "Fill out the online admission form on this page. Your enquiry goes straight to our Inquiry Management system, and a counselor will follow up with you. You can also visit our campus with the required documents." },
  { q: "Which courses are available?", a: "We offer Basic Computers, DCA, ADCA, Tally Prime + GST, Web Development, Graphic Design, and Future AI Tools training." },
  { q: "Are certificates provided?", a: "Yes, a professional certificate is provided upon successful completion of your course." },
  { q: "Is practical training included?", a: "100% of our training is practical. You will learn by working on real-world projects and case studies." },
  { q: "What are the admission fees?", a: "Fee structures vary depending on the course. Please submit an inquiry or call our counseling desk for detailed fee structures and installment plans." },
];

export default function AdmissionClient() {
  const { courses: liveCourses, loading: coursesLoading } = usePublicCourses();
  const [openFaq, setOpenFaq] = useState(0);

  // --- Form State ---
  const initialFormState = {
    fullName: "",
    fatherName: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    course: "",
    qualification: "",
    address: "",
    message: ""
  };

  const [formData, setFormData] = useState(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null
  const [submitError, setSubmitError] = useState("");

  // --- Form Handlers ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleReset = () => {
    setFormData(initialFormState);
    setSubmitStatus(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    setSubmitError("");

    try {
      // 1. Generate reCAPTCHA v3 token
      const token = await new Promise((resolve, reject) => {
        if (typeof window === "undefined" || !window.grecaptcha) {
          reject(new Error("reCAPTCHA script not loaded yet."));
          return;
        }
        
        window.grecaptcha.ready(() => {
          window.grecaptcha.execute(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY, { action: 'submit_admission_form' })
            .then((token) => resolve(token))
            .catch((error) => reject(error));
        });
      });

      // 2. Send form data + token to API
      const response = await fetch('/api/admission', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, token }),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData(initialFormState);
      } else {
        const data = await response.json().catch(() => ({}));
        setSubmitError(data.error || 'Submission failed. Please try again.');
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitError(error.message || 'Submission failed. Please try again.');
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      
      // Clear status message after 8 seconds
      setTimeout(() => {
        setSubmitStatus(null);
      }, 8000);
    }
  };

  return (
    <>
      {/* Load Google reCAPTCHA Script */}
      <Script 
        src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`} 
        strategy="afterInteractive"
      />

      <main className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-500/30 overflow-hidden pb-20">
        
        {/* 1. Premium Hero Section */}
        <section className="relative pt-32 pb-20 lg:pb-24 px-6 flex flex-col items-center justify-center text-center min-h-[60vh]">
          {/* Futuristic Glowing Background */}
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[150px] -z-10 animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-cyan-500/20 rounded-full blur-[150px] -z-10" />

          {/* Floating Elements */}
          <motion.div animate={{ y: [0, -15, 0] }} transition={{ duration: 5, repeat: Infinity }} className="absolute top-40 left-20 hidden lg:flex w-16 h-16 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl items-center justify-center text-blue-500 shadow-xl">
            <Rocket size={28} />
          </motion.div>
          <motion.div animate={{ y: [0, 20, 0] }} transition={{ duration: 6, repeat: Infinity, delay: 1 }} className="absolute bottom-32 right-20 hidden lg:flex w-20 h-20 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full items-center justify-center text-cyan-400 shadow-xl">
            <FileEdit size={36} />
          </motion.div>

          <div className="container mx-auto max-w-4xl relative z-10">
            <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
              <motion.div variants={fadeInUp} className="inline-block px-5 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-600 text-sm font-bold mb-8 tracking-widest uppercase backdrop-blur-sm">
                Session 2026-2027
              </motion.div>
              <motion.h1 variants={fadeInUp} className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] mb-8 tracking-tight">
                Admissions Open <span className="text-gradient">2026</span>
              </motion.h1>
              <motion.p variants={fadeInUp} className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
                Start your journey toward future-ready digital skills with Vivexa Institute of Technology. Enroll today and secure your seat.
              </motion.p>
              <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-4">
                <button onClick={() => window.scrollTo({ top: 600, behavior: "smooth" })} className="px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] hover:scale-[1.03] transition-all flex items-center gap-2 group">
                  Apply Now <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <a href="/courses" className="px-8 py-4 rounded-full border border-slate-300 bg-white/70 hover:bg-white hover:border-blue-300 transition-all font-bold">
                  Explore Courses
                </a>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* 2. Admission Process Section */}
        <section className="py-20 md:py-24 px-6 relative z-10 border-y border-slate-200 bg-white/50 backdrop-blur-lg">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-black mb-4">Admission <span className="text-blue-600">Process</span></h2>
              <p className="text-slate-600">5 simple steps to kickstart your tech career.</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 relative">
              {/* Desktop Connector Line */}
              <div className="hidden md:block absolute top-10 left-10 right-10 h-0.5 bg-gradient-to-r from-blue-600/20 via-cyan-400/20 to-transparent -z-10"></div>
              
              {PROCESS_STEPS.map((step, i) => {
                const Icon = step.icon;
                return (
                  <motion.div 
                    key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                    className="relative group text-center"
                  >
                    <div className="w-20 h-20 mx-auto rounded-2xl bg-white border border-slate-200 flex items-center justify-center mb-6 shadow-xl group-hover:-translate-y-2 group-hover:border-blue-500/50 transition-all duration-300 relative z-10">
                      <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-cyan-400 text-white flex items-center justify-center font-bold text-sm shadow-lg">
                        {step.step}
                      </div>
                      <Icon size={32} className="text-blue-600 group-hover:scale-110 transition-transform" />
                    </div>
                    <h3 className="font-bold mb-2 text-slate-900">{step.title}</h3>
                    <p className="text-xs text-slate-500 px-2">{step.desc}</p>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* 3. Admission Form Section */}
        <section id="admission-form" className="py-24 px-6 relative">
          <div className="container mx-auto max-w-4xl">
            <motion.div 
              initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="p-8 md:p-14 rounded-[2.5rem] bg-white border border-slate-200 shadow-2xl relative overflow-hidden"
            >
              {/* Form Inner Glow */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] -z-0 pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] -z-0 pointer-events-none"></div>
              
              <div className="relative z-10">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-black mb-3">Online Admission Form</h2>
                  <p className="text-slate-600">Please fill out all the required fields carefully.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Details */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Full Name *</label>
                      <input 
                        type="text" 
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="Student's Name" 
                        className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all" 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Father's Name *</label>
                      <input 
                        type="text" 
                        name="fatherName"
                        value={formData.fatherName}
                        onChange={handleChange}
                        placeholder="Father's Name" 
                        className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all" 
                        required 
                      />
                    </div>
                  </div>

                  {/* Contact Details */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Email Address</label>
                      <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="student@example.com" 
                        className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Phone Number *</label>
                      <input 
                        type="tel" 
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+91 XXXXX XXXXX" 
                        className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all" 
                        required 
                      />
                    </div>
                  </div>

                  {/* Demographics */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Date of Birth *</label>
                      <input 
                        type="date" 
                        name="dob"
                        value={formData.dob}
                        onChange={handleChange}
                        className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all" 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Gender *</label>
                      <select 
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all" 
                        required
                      >
                        <option value="" className="text-slate-900">Select Gender</option>
                        <option value="male" className="text-slate-900">Male</option>
                        <option value="female" className="text-slate-900">Female</option>
                        <option value="other" className="text-slate-900">Other</option>
                      </select>
                    </div>
                  </div>

                  {/* Course & Education */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Select Course *</label>
                      <select 
                        name="course"
                        value={formData.course}
                        onChange={handleChange}
                        className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all" 
                        required
                      >
                        <option value="" className="text-slate-900">{coursesLoading ? "Loading courses..." : "Choose a Course..."}</option>
                        {(liveCourses.length > 0 ? liveCourses : COURSES.map((c) => ({ title: c.title }))).map((c) => (
                          <option key={c.title} value={c.title} className="text-slate-900">{c.title}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Highest Qualification *</label>
                      <select 
                        name="qualification"
                        value={formData.qualification}
                        onChange={handleChange}
                        className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all" 
                        required
                      >
                        <option value="" className="text-slate-900">Select Qualification</option>
                        <option value="10th" className="text-slate-900">10th Pass</option>
                        <option value="12th" className="text-slate-900">12th Pass</option>
                        <option value="graduate" className="text-slate-900">Graduate</option>
                        <option value="post-graduate" className="text-slate-900">Post Graduate</option>
                      </select>
                    </div>
                  </div>

                  {/* Textareas */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Full Address *</label>
                    <textarea 
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows={2} 
                      placeholder="House No, Street, City, Pincode" 
                      className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all resize-none" 
                      required
                    ></textarea>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Additional Message (Optional)</label>
                    <textarea 
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={3} 
                      placeholder="Any specific questions or preferred batch timings?" 
                      className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all resize-none"
                    ></textarea>
                  </div>

                  {/* Actions */}
                  <div className="pt-6 grid md:grid-cols-2 gap-4">
                    <button 
                      type="submit" 
                      disabled={isSubmitting || submitStatus === 'success'}
                      className={`w-full py-4 rounded-xl ${submitStatus === 'success' ? 'bg-green-500' : 'bg-gradient-to-r from-blue-600 to-cyan-500'} text-white font-bold text-lg hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 group`}
                    >
                      {isSubmitting ? "Submitting..." : (submitStatus === 'success' ? "Submitted Successfully" : "Submit Application")} 
                      {!isSubmitting && submitStatus !== 'success' && <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                      {submitStatus === 'success' && <CheckCircle2 size={20} />}
                    </button>
                    <button 
                      type="button" 
                      onClick={handleReset}
                      disabled={isSubmitting}
                      className="w-full py-4 rounded-xl bg-slate-200 text-slate-700 font-bold text-lg hover:bg-slate-300 disabled:opacity-50 transition-all duration-300 flex items-center justify-center gap-2 group"
                    >
                      Reset Form <RotateCcw size={20} className="group-hover:-rotate-90 transition-transform duration-300" />
                    </button>
                  </div>

                  {/* Status Messages */}
                  <AnimatePresence>
                    {submitStatus === 'success' && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="p-5 rounded-xl bg-green-500/10 border border-green-500/20 flex items-start gap-3 text-green-700 mt-4"
                      >
                        <CheckCircle2 className="shrink-0 mt-0.5" size={24} />
                        <div>
                          <p className="font-bold">Application Received Successfully!</p>
                          <p className="text-sm mt-1 opacity-90">Thank you for choosing Vivexa Institute of Technology. Your enquiry is now with our counseling team — we will contact you shortly to complete admission.</p>
                        </div>
                      </motion.div>
                    )}
                    {submitStatus === 'error' && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="p-5 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3 text-red-700 mt-4"
                      >
                        <AlertCircle className="shrink-0 mt-0.5" size={24} />
                        <div>
                          <p className="font-bold">Submission Failed</p>
                          <p className="text-sm mt-1 opacity-90">{submitError || "Something went wrong while submitting your form. Please try again or contact us directly."}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <p className="text-xs text-center text-slate-500 mt-4">
                    This site is protected by reCAPTCHA and the Google <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">Privacy Policy</a> and <a href="https://policies.google.com/terms" target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">Terms of Service</a> apply.
                  </p>
                </form>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 4. Available Courses Preview Section */}
        <section className="py-20 px-6 bg-slate-100 border-y border-slate-200 relative">
          <div className="container mx-auto max-w-7xl">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
              <div>
                <h2 className="text-3xl md:text-4xl font-black mb-3">Available <span className="text-blue-600">Courses</span></h2>
                <p className="text-slate-600 max-w-xl">Find the perfect professional course to accelerate your career.</p>
              </div>
              <button className="flex items-center gap-2 text-blue-600 font-bold hover:underline">
                View Complete Syllabus <ArrowRight size={18} />
              </button>
            </div>

            <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {COURSES.map((course, i) => {
                const Icon = course.icon;
                return (
                  <motion.div key={i} variants={fadeInUp} className="group p-6 rounded-[2rem] bg-white border border-slate-200 hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-[30px] group-hover:bg-cyan-400/20 transition-colors"></div>
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                      <Icon size={24} />
                    </div>
                    <h3 className="font-bold text-lg mb-4 text-slate-900 line-clamp-1">{course.title}</h3>
                    <div className="flex items-center gap-3 text-xs font-semibold text-slate-500 mb-6">
                      <span className="flex items-center gap-1"><Clock size={14} className="text-blue-500"/> {course.duration}</span>
                      <span className="flex items-center gap-1"><BarChart size={14} className="text-cyan-500"/> {course.level}</span>
                    </div>
                    <button onClick={() => {
                        setFormData(prev => ({...prev, course: course.title}));
                        window.scrollTo({ top: document.getElementById('admission-form').offsetTop - 100, behavior: "smooth" });
                      }} 
                      className="w-full py-3 rounded-lg bg-slate-50 text-sm font-bold text-slate-700 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300"
                    >
                      Select Course
                    </button>
                  </motion.div>
                )
              })}
            </motion.div>
          </div>
        </section>

        {/* 5 & 6. Required Documents & Why Join VIT */}
        <section className="py-24 px-6 relative">
          <div className="container mx-auto max-w-7xl grid lg:grid-cols-12 gap-12">
            
            {/* Left: Required Documents */}
            <div className="lg:col-span-5">
              <h2 className="text-3xl font-black mb-4">Required <span className="text-blue-600">Documents</span></h2>
              <p className="text-slate-600 mb-8">Please bring these documents along with 2 sets of photocopies during physical verification.</p>
              
              <div className="space-y-4">
                {DOCUMENTS.map((doc, i) => {
                  const Icon = doc.icon;
                  return (
                    <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
                      <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                        <Icon size={20} />
                      </div>
                      <span className="font-bold text-slate-800">{doc.title}</span>
                    </motion.div>
                  )
                })}
              </div>
            </div>

            {/* Right: Why Join VIT */}
            <div className="lg:col-span-7">
              <h2 className="text-3xl font-black mb-4">Why Join <span className="text-blue-600">VIT?</span></h2>
              <p className="text-slate-600 mb-8">An ecosystem designed for intensive practical learning.</p>
              
              <div className="grid sm:grid-cols-2 gap-4">
                {WHY_VIT.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-r from-slate-50 to-white border border-slate-200 hover:border-blue-500/50 transition-colors">
                      <Icon size={24} className="text-blue-500 shrink-0" />
                      <span className="font-bold text-slate-800">{item.title}</span>
                    </motion.div>
                  )
                })}
              </div>
            </div>

          </div>
        </section>

        {/* 7. FAQ Section */}
        <section className="py-24 px-6 bg-slate-100 relative border-y border-slate-200">
          <div className="container mx-auto max-w-3xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-black mb-4">Admission <span className="text-blue-600">FAQs</span></h2>
              <p className="text-slate-600">Everything you need to know before joining.</p>
            </div>

            <div className="space-y-4">
              {FAQS.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <motion.div 
                    key={index} 
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}
                    className={`border rounded-2xl overflow-hidden transition-colors duration-300 ${isOpen ? "bg-white border-blue-500/30 shadow-md" : "bg-slate-50 border-slate-200 hover:border-blue-500/30"}`}
                  >
                    <button 
                      onClick={() => setOpenFaq(isOpen ? null : index)} 
                      className="w-full flex items-center justify-between p-6 text-left"
                    >
                      <span className="text-lg font-bold text-slate-900 pr-4">{faq.q}</span>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${isOpen ? "bg-blue-600 text-white rotate-180" : "bg-slate-200 text-slate-500"}`}>
                        <ChevronDown size={18} />
                      </div>
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-6 pt-0 text-slate-600 leading-relaxed border-t border-slate-100 mt-2 pt-4">
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

        {/* 8. Final CTA Banner */}
        <section className="pt-24 px-6">
          <div className="container mx-auto max-w-5xl">
            <motion.div 
              initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} 
              className="relative rounded-[2.5rem] overflow-hidden p-12 md:p-20 text-center bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 shadow-2xl shadow-blue-500/20"
            >
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/20 rounded-full blur-[120px] -z-0"></div>
              
              <div className="relative z-10">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight">
                  Ready To Build Your Future?
                </h2>
                <p className="text-blue-100 text-lg md:text-xl mb-10 max-w-2xl mx-auto font-medium">
                  Apply today and start learning professional computer skills at Vivexa Institute of Technology.
                </p>
                <button onClick={() => window.scrollTo({ top: document.getElementById('admission-form').offsetTop - 100, behavior: "smooth" })} className="px-10 py-5 rounded-full bg-white text-blue-700 font-bold text-lg hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] transition-all duration-300 flex items-center justify-center gap-2 mx-auto group">
                  Apply Now <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          </div>
        </section>

      </main>
    </>
  );
}