import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import NoticeMarquee from "@/app/components/NoticeMarquee";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <NoticeMarquee />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}
