"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase"; 
import { 
  Search, ShieldCheck, XCircle, Loader2, 
  User, BookOpen, Calendar, Award, CheckCircle2, 
  ChevronLeft, Download, Clock, GraduationCap, Building
} from "lucide-react";

// --- Animation Variants ---
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function VerifyClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [searchInput, setSearchInput] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false); // Added state for download UX

  // Auto-verify if ID is present in the URL
  useEffect(() => {
    const idFromUrl = searchParams.get("id");
    if (idFromUrl) {
      setSearchInput(idFromUrl);
      verifyCertificate(idFromUrl);
    }
  }, [searchParams]);

  const verifyCertificate = async (idToVerify) => {
    if (!idToVerify.trim()) return;

    setIsVerifying(true);
    setResult(null);
    setError(false);

    try {
      const docRef = doc(db, "certificates", idToVerify.trim());
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setResult(docSnap.data());
      } else {
        setError(true);
      }
    } catch (err) {
      console.error("Error verifying certificate:", err);
      setError(true);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      router.push(`/verify?id=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  const resetSearch = () => {
    setResult(null);
    setError(false);
    setSearchInput("");
    router.push("/verify");
  };

  // --- Dynamic PDF Generator (Image to PDF) ---
  const downloadAsPDF = async () => {
    if (!result?.certificateImage) return;
    setIsDownloading(true);

    try {
      // Dynamically import jsPDF to avoid Next.js SSR issues
      const { jsPDF } = await import("jspdf");

      // Fetch the image and draw to canvas to avoid CORS/format issues
      const img = new Image();
      img.crossOrigin = "Anonymous"; // Crucial for Firebase Storage images
      img.src = result.certificateImage;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        
        // Compress slightly to keep PDF size manageable
        const imgData = canvas.toDataURL("image/jpeg", 0.9);

        // Determine orientation based on image dimensions
        const orientation = img.width > img.height ? "landscape" : "portrait";
        const pdf = new jsPDF({
          orientation: orientation,
          unit: "mm",
        });

        // Fit image into the PDF while maintaining aspect ratio
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (img.height * pdfWidth) / img.width;

        pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
        pdf.save(`${result.studentName.replace(/\s+/g, '_')}_Certificate.pdf`);
        setIsDownloading(false);
      };

      img.onerror = () => {
        console.error("Failed to load image for PDF generation");
        setIsDownloading(false);
        alert("Could not download the certificate. Please try again.");
      };
    } catch (error) {
      console.error("Error generating PDF:", error);
      setIsDownloading(false);
    }
  };

  // --- Dynamic LinkedIn URL Generator ---
  const getLinkedInUrl = () => {
    if (!result) return "#";
    
    const issueDateObj = new Date(result.issueDate);
    const issueYear = issueDateObj.getFullYear();
    const issueMonth = issueDateObj.getMonth() + 1;
    
    const currentUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const certUrl = encodeURIComponent(`${currentUrl}/verify?id=${result.certificateId}`);
    
    const orgName = encodeURIComponent(result.instituteName || "Vivexa Institute of Technology");
    const courseName = encodeURIComponent(result.course);

    return `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${courseName}&organizationName=${orgName}&issueYear=${issueYear}&issueMonth=${issueMonth}&certId=${result.certificateId}&certUrl=${certUrl}`;
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-500/30 overflow-hidden relative flex flex-col items-center py-20 px-4 md:px-6">
      
      {/* --- Futuristic Animated Background --- */}
      <div className="fixed top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[150px] -z-10 animate-pulse pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 w-[400px] h-[400px] bg-cyan-500/20 rounded-full blur-[150px] -z-10 pointer-events-none" />

      {/* Floating Tech Particles */}
      <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 5, repeat: Infinity }} className="absolute top-32 left-[10%] hidden lg:flex w-16 h-16 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl items-center justify-center text-blue-500 shadow-xl pointer-events-none">
        <ShieldCheck size={28} />
      </motion.div>
      <motion.div animate={{ y: [0, 20, 0] }} transition={{ duration: 6, repeat: Infinity, delay: 1 }} className="absolute bottom-40 right-[10%] hidden lg:flex w-20 h-20 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full items-center justify-center text-cyan-400 shadow-xl pointer-events-none">
        <Award size={36} />
      </motion.div>

      {/* --- Hero Section --- */}
      <div className="container mx-auto max-w-4xl relative z-10 w-full">
        <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="text-center mb-12">
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-600 text-sm font-bold mb-6 tracking-widest uppercase backdrop-blur-sm shadow-[0_0_20px_rgba(59,130,246,0.15)]">
            <ShieldCheck size={18} /> Official Portal
          </motion.div>
          <motion.h1 variants={fadeInUp} className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-6 tracking-tight">
            Certificate <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-400">Verification</span>
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Verify the authenticity of certificates issued by Vivexa Institute of Technology. Enter your unique Certificate ID below.
          </motion.p>
        </motion.div>

        <AnimatePresence mode="wait">
          {/* --- 1. Search Input State --- */}
          {!result && !error && (
            <motion.div 
              key="search"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}
              className="w-full max-w-2xl mx-auto p-2 rounded-2xl bg-white/60 border border-slate-200 backdrop-blur-xl shadow-2xl shadow-blue-500/10 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              
              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 relative z-10">
                <div className="relative flex-grow">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input 
                    type="text" 
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value.toUpperCase())}
                    placeholder="Example: VIT-2026-001" 
                    className="w-full pl-14 pr-5 py-4 rounded-xl bg-white border border-transparent focus:border-blue-500/50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all font-mono uppercase tracking-wide placeholder:normal-case placeholder:tracking-normal placeholder:text-slate-400 shadow-inner"
                    disabled={isVerifying}
                    required
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={isVerifying}
                  className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 whitespace-nowrap active:scale-95"
                >
                  {isVerifying ? <><Loader2 className="animate-spin" size={20} /> Verifying...</> : "Verify Now"}
                </button>
              </form>
            </motion.div>
          )}

          {/* --- 2. Success Result State --- */}
          {result && (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.5, type: "spring", bounce: 0.2 }}
              className="w-full mx-auto rounded-[2.5rem] bg-white/80 backdrop-blur-2xl border border-green-500/30 shadow-[0_0_60px_rgba(34,197,94,0.15)] relative overflow-hidden"
            >
              {/* Premium Inner Glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-32 bg-green-500/20 rounded-[100%] blur-[60px] pointer-events-none"></div>

              <div className="p-8 md:p-12 relative z-10">
                {/* Header Profile */}
                <div className="flex flex-col items-center text-center mb-10 pb-10 border-b border-slate-200">
                  <motion.div 
                    initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
                    className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center text-white mb-6 shadow-[0_0_40px_rgba(52,211,153,0.4)]"
                  >
                    <CheckCircle2 size={48} strokeWidth={2.5} />
                  </motion.div>
                  <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-3">Certificate Verified</h2>
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600 font-mono tracking-widest text-sm">
                    {result.certificateId}
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid md:grid-cols-2 gap-8 mb-12">
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-blue-50 text-blue-500"><User size={20}/></div>
                      <div>
                        <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Student Name</p>
                        <p className="text-xl font-bold text-slate-900">{result.studentName}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-blue-50 text-blue-500"><BookOpen size={20}/></div>
                      <div>
                        <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Course Enrolled</p>
                        <p className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">{result.course}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-blue-50 text-blue-500"><Clock size={20}/></div>
                      <div>
                        <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Duration</p>
                        <p className="text-xl font-bold text-slate-900">{result.duration}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-blue-50 text-blue-500"><Calendar size={20}/></div>
                      <div>
                        <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Issue Date</p>
                        <p className="text-xl font-bold text-slate-900">{new Date(result.issueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-blue-50 text-blue-500"><GraduationCap size={20}/></div>
                      <div>
                        <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Grade</p>
                        <p className="text-xl font-bold text-slate-900">{result.grade}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-blue-50 text-blue-500"><Award size={20}/></div>
                      <div>
                        <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Status</p>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-green-50 border border-green-200 text-green-700 font-bold">
                          <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                          </span>
                          Verified Authentic
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Certificate Image Preview Section */}
                {result.certificateImage && (
                  <div className="mb-12">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                      Certificate Preview
                    </h3>
                    <div className="w-full bg-slate-100 rounded-2xl p-2 border border-slate-200 shadow-inner">
                      <div className="relative w-full aspect-[1.414/1] overflow-hidden rounded-xl bg-slate-200 group">
                        <img 
                          src={result.certificateImage} 
                          alt={`Certificate for ${result.studentName}`} 
                          loading="lazy"
                          className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500 pointer-events-none"></div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions: Download (Now PDF from Image) & LinkedIn */}
                <div className="flex flex-col sm:flex-row gap-4 mb-10">
                  {result.certificateImage && (
                    <button 
                      onClick={downloadAsPDF}
                      disabled={isDownloading}
                      className="flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-lg hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] transition-all active:scale-95 group disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isDownloading ? <Loader2 className="animate-spin" size={22} /> : <Download size={22} className="group-hover:-translate-y-1 transition-transform" />}
                      {isDownloading ? "Generating PDF..." : "Download Certificate"}
                    </button>
                  )}
                  
                  <a 
                    href={getLinkedInUrl()} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-[#0077b5] text-white font-bold text-lg hover:shadow-[0_0_30px_rgba(0,119,181,0.5)] hover:bg-[#006097] transition-all active:scale-95 group"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                      <rect x="2" y="9" width="4" height="12"></rect>
                      <circle cx="4" cy="4" r="2"></circle>
                    </svg>
                    Add to LinkedIn
                  </a>
                </div>

                {/* Footer Section */}
                <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                      <Building size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5">Issued By</p>
                      <p className="text-sm font-bold text-slate-900">{result.instituteName || "Vivexa Institute of Technology"}</p>
                    </div>
                  </div>
                  <button onClick={resetSearch} className="px-6 py-2.5 rounded-full bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition-colors flex items-center gap-2 shadow-sm border border-slate-200">
                    <ChevronLeft size={18} /> Verify Another
                  </button>
                </div>

              </div>
            </motion.div>
          )}

          {/* --- 3. Error State --- */}
          {error && (
            <motion.div 
              key="error"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}
              className="w-full max-w-lg mx-auto p-10 rounded-[2rem] bg-white border border-red-500/30 text-center shadow-2xl relative overflow-hidden"
            >
               <div className="absolute top-0 right-0 w-40 h-40 bg-red-500/10 rounded-full blur-[60px] pointer-events-none"></div>

              <div className="w-20 h-20 mx-auto bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-6 relative z-10 shadow-inner border border-red-100">
                <XCircle size={40} strokeWidth={2.5} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-3 relative z-10">Certificate Not Found</h2>
              <p className="text-slate-600 mb-8 relative z-10 leading-relaxed">
                The certificate ID <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">"{searchInput}"</span> is invalid or does not exist in our secure database.
              </p>
              <button 
                onClick={resetSearch}
                className="w-full py-4 rounded-xl bg-slate-900 text-white font-bold text-lg hover:shadow-lg transition-all flex items-center justify-center gap-2 relative z-10 active:scale-95"
              >
                <ChevronLeft size={20} /> Try Again
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}