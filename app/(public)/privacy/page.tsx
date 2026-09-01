export const metadata = { title: "Privacy Policy | Vivexa Institute of Technology" };

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-24">
      <article className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:p-14">
        <h1 className="text-4xl font-black text-slate-900">Privacy Policy</h1>
        <p className="mt-3 text-slate-500">Last updated May 2026</p>
        <div className="mt-10 space-y-8 leading-7 text-slate-700">
          <section><h2 className="text-xl font-bold text-slate-900">Information we collect</h2><p>We collect enrollment, contact, academic, attendance, assessment, and payment information needed to provide educational services.</p></section>
          <section><h2 className="text-xl font-bold text-slate-900">How we use data</h2><p>Data is used for admissions, classes, student support, progress tracking, certificates, payments, and important institute communication. We do not sell personal information.</p></section>
          <section><h2 className="text-xl font-bold text-slate-900">Security and retention</h2><p>We use reasonable safeguards and retain records only as required for educational, verification, legal, and accounting purposes.</p></section>
          <section><h2 className="text-xl font-bold text-slate-900">Your choices</h2><p>You may request corrections or account deletion. Contact contact@vivexatech.in or +91 93544 86861 for privacy requests.</p></section>
        </div>
      </article>
    </main>
  );
}
