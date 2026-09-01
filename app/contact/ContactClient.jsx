"use client";

import { useState } from "react";
import Script from "next/script";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MapPin, Phone, Mail, Clock, Send, 
  GraduationCap, BookOpen, Wrench, Briefcase, 
  ChevronDown, MessageSquare, ArrowRight, CheckCircle2, AlertCircle
} from "lucide-react";

// --- Animation Variants ---
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
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
const CONTACT_INFO = [
  { title: "Our Address", detail: "Ekta tower, Basement, Plot no 13, Main Rd, Block A, Ashok Vihar Phase III Extension, Gurugram, Haryana 122006", icon: MapPin },
  { title: "Phone Number", detail: "+91 95821 94338", icon: Phone },
  { title: "Email Address", detail: "info@vivexatech.in", icon: Mail },
  { title: "Working Hours", detail: "Mon - Sat | 9:00 AM - 6:00 PM", icon: Clock },
];

const SUPPORT_CARDS = [
  { title: "Admission Inquiry", desc: "Get help with enrollment.", icon: GraduationCap },
  { title: "Course Counseling", desc: "Choose the right career path.", icon: BookOpen },
  { title: "Technical Support", desc: "Help with student portal & apps.", icon: Wrench },
  { title: "Career Guidance", desc: "Placement & resume assistance.", icon: Briefcase },
];

const FAQS = [
  { question: "How can I apply for admission?", answer: "You can apply online by filling out the admission form on our website or by visiting our campus directly during working hours." },
  { question: "Which computer courses are available?", answer: "We offer a wide range of courses including Basic Computers, Web Development, DCA, ADCA, Tally Prime + GST, Graphic Design, and AI Tools Training." },
  { question: "Do you provide certificates?", answer: "Yes, we provide globally recognized certification upon the successful completion of all our professional courses." },
  { question: "Is practical training available?", answer: "Absolutely. 100% of our training involves hands-on practical sessions, live projects, and real-world case studies." },
];

export default function ContactClient() {
  const [openFaq, setOpenFaq] = useState(0);

  // --- Form State ---
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "",
    message: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null

  // --- Form Handlers ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // 1. Generate reCAPTCHA v3 token
      const token = await new Promise((resolve, reject) => {
        if (typeof window === "undefined" || !window.grecaptcha) {
          reject(new Error("reCAPTCHA script not loaded yet."));
          return;
        }
        
        window.grecaptcha.ready(() => {
          window.grecaptcha.execute(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY, { action: 'submit_contact_form' })
            .then((token) => resolve(token))
            .catch((error) => reject(error));
        });
      });

      // 2. Send form data + token to API
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, token }),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          name: "",
          phone: "",
          email: "",
          subject: "",
          message: ""
        });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      
      // Clear status message after 5 seconds
      setTimeout(() => {
        setSubmitStatus(null);
      }, 5000);
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
        <section className="relative pt-32 pb-20 lg:pb-24 px-6 flex flex-col items-center justify-center text-center min-h-[50vh]">
          {/* Futuristic Glowing Background */}
          <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-blue-600/20 rounded-full blur-[150px] -z-10 animate-pulse" />
          <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-[150px] -z-10" />

          {/* Floating Elements (Desktop) */}
          <motion.div animate={{ y: [0, -15, 0] }} transition={{ duration: 5, repeat: Infinity }} className="absolute top-32 left-24 hidden lg:flex w-16 h-16 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl items-center justify-center text-blue-500 shadow-xl">
            <MessageSquare size={28} />
          </motion.div>
          <motion.div animate={{ y: [0, 20, 0] }} transition={{ duration: 6, repeat: Infinity, delay: 1 }} className="absolute bottom-20 right-24 hidden lg:flex w-20 h-20 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full items-center justify-center text-cyan-400 shadow-xl">
            <Mail size={36} />
          </motion.div>

          <div className="container mx-auto max-w-3xl relative z-10">
            <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
              <motion.div variants={fadeInUp} className="inline-block px-5 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-600 text-sm font-bold mb-8 tracking-widest uppercase backdrop-blur-sm">
                We're Here To Help
              </motion.div>
              <motion.h1 variants={fadeInUp} className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] mb-6 tracking-tight">
                Get In Touch With <span className="text-gradient">Us</span>
              </motion.h1>
              <motion.p variants={fadeInUp} className="text-lg md:text-xl text-slate-600 leading-relaxed">
                We’re here to guide your learning journey. Reach out to Vivexa Institute of Technology for admissions, courses, and career guidance.
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* 2. Contact Information Section */}
        <section className="py-12 px-6 relative z-10 -mt-10">
          <div className="container mx-auto max-w-7xl">
            <motion.div 
              variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {CONTACT_INFO.map((info, i) => {
                const Icon = info.icon;
                return (
                  <motion.div 
                    key={i} variants={fadeInUp} 
                    className="p-8 rounded-[2rem] bg-white/60 border border-slate-200 backdrop-blur-xl shadow-lg shadow-slate-200/50 hover:-translate-y-2 hover:border-blue-300 hover:shadow-blue-500/10 transition-all duration-300 group"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                      <Icon size={28} />
                    </div>
                    <h3 className="text-lg font-bold mb-2 text-slate-900">{info.title}</h3>
                    <p className="text-slate-600 font-medium">{info.detail}</p>
                  </motion.div>
                )
              })}
            </motion.div>
          </div>
        </section>

        {/* 3 & 4. Contact Form & Google Maps Section */}
        <section className="py-24 px-6 relative">
          <div className="container mx-auto max-w-7xl grid lg:grid-cols-2 gap-12 items-start">
            
            {/* Left: Contact Form */}
            <motion.div 
              initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
              className="p-8 md:p-12 rounded-[2.5rem] bg-white border border-slate-200 shadow-2xl relative overflow-hidden"
            >
              {/* Form Inner Glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] -z-0 pointer-events-none"></div>
              
              <div className="relative z-10">
                <h2 className="text-3xl font-black mb-2 text-slate-900">Send Us a Message</h2>
                <p className="text-slate-600 mb-8">Fill out the form below and our team will get back to you within 24 hours.</p>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Full Name</label>
                      <input 
                        type="text" 
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Enter Your Name" 
                        className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-slate-400" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Phone Number</label>
                      <input 
                        type="tel" 
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        placeholder="Enter Your Phone Number" 
                        className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-slate-400" 
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Email Address</label>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="Enter Your Email Address" 
                      className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-slate-400" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Subject</label>
                    <input 
                      type="text" 
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      placeholder="Inquiry about Web Development Course" 
                      className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-slate-400" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Message</label>
                    <textarea 
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={4} 
                      placeholder="How can we help you?" 
                      className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all resize-none placeholder:text-slate-400"
                    ></textarea>
                  </div>

                  <button 
                    type="submit"
                    disabled={isSubmitting || submitStatus === 'success'}
                    className={`w-full py-4 rounded-xl ${submitStatus === 'success' ? 'bg-green-500' : 'bg-gradient-to-r from-blue-600 to-cyan-500'} text-white font-bold text-lg hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-75 disabled:cursor-not-allowed`}
                  >
                    {isSubmitting ? "Submitting..." : (submitStatus === 'success' ? "Submitted Successfully" : "Send Message")} 
                    {!isSubmitting && submitStatus !== 'success' && <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                    {submitStatus === 'success' && <CheckCircle2 size={20} />}
                  </button>

                  {/* Status Messages */}
                  <AnimatePresence>
                    {submitStatus === 'success' && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 flex items-start gap-3 text-green-600"
                      >
                        <CheckCircle2 className="shrink-0 mt-0.5" size={20} />
                        <p className="text-sm font-medium">Thank you! Your message has been sent successfully. We will get back to you soon.</p>
                      </motion.div>
                    )}
                    {submitStatus === 'error' && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3 text-red-600"
                      >
                        <AlertCircle className="shrink-0 mt-0.5" size={20} />
                        <p className="text-sm font-medium">Oops! Something went wrong. Please try again or contact us directly via phone.</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <p className="text-xs text-center text-slate-500 mt-4">
                    This site is protected by reCAPTCHA and the Google <a href="https://policies.google.com/privacy" className="text-blue-500 hover:underline">Privacy Policy</a> and <a href="https://policies.google.com/terms" className="text-blue-500 hover:underline">Terms of Service</a> apply.
                  </p>
                </form>
              </div>
            </motion.div>

            {/* Right: Google Maps */}
            <motion.div 
              initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
              className="flex flex-col h-full"
            >
              <div className="mb-8">
                <h2 className="text-3xl font-black mb-2 text-slate-900">Find Our Location</h2>
                <p className="text-slate-600">Visit Vivexa Institute of Technology and explore your future in technology directly at our campus.</p>
              </div>
              
              <div className="flex-grow w-full min-h-[400px] rounded-[2.5rem] overflow-hidden border-2 border-slate-200 shadow-2xl relative group">
                {/* Premium Glow around Map */}
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-cyan-400/20 mix-blend-overlay pointer-events-none z-10 group-hover:opacity-0 transition-opacity duration-500"></div>
                
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d219.14637592417543!2d77.02581636396627!3d28.499377788020958!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1781933375183!5m2!1sen!2sin" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen={false} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0 w-full h-full grayscale-[50%] contrast-125 transition-all duration-500 group-hover:grayscale-0 group-hover:dark:invert-0"
                ></iframe>
              </div>
            </motion.div>

          </div>
        </section>

        {/* 5. Quick Support Section */}
        <section className="py-24 px-6 bg-slate-100 border-y border-slate-200 relative">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-black mb-4">Quick <span className="text-blue-600">Support</span></h2>
              <p className="text-slate-600">Direct lines to the departments that can help you best.</p>
            </div>
            
            <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {SUPPORT_CARDS.map((card, i) => {
                const Icon = card.icon;
                return (
                  <motion.div key={i} variants={fadeInUp} className="p-8 rounded-3xl bg-white border border-slate-200 hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-2 group">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 text-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                      <Icon size={24} />
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-slate-900">{card.title}</h3>
                    <p className="text-slate-600 text-sm">{card.desc}</p>
                  </motion.div>
                )
              })}
            </motion.div>
          </div>
        </section>

        {/* 6. FAQ Quick Help Section */}
        <section className="py-24 px-6 relative">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-black mb-4">Frequently Asked <span className="text-blue-600">Questions</span></h2>
              <p className="text-slate-600">Find quick answers to common queries about our institute.</p>
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
                      <span className="text-lg font-bold text-slate-900 pr-4">{faq.question}</span>
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
                            {faq.answer}
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

        {/* 7. Final CTA Section */}
        <section className="pt-12 px-6">
          <div className="container mx-auto max-w-5xl">
            <motion.div 
              initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} 
              className="relative rounded-[2.5rem] overflow-hidden p-12 md:p-20 text-center bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 shadow-2xl shadow-blue-500/20"
            >
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/20 rounded-full blur-[120px] -z-0"></div>
              
              <div className="relative z-10">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight">
                  Ready To Start Your Career Journey?
                </h2>
                <p className="text-blue-100 text-lg md:text-xl mb-10 max-w-2xl mx-auto font-medium">
                  Contact Vivexa Institute of Technology today and begin learning future-ready skills that industry leaders demand.
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
    </>
  );
}