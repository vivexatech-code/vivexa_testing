export const metadata = { title: "Terms & Conditions | Vivexa Institute of Technology" };

export default function TermsPage() {
  const sections = [
    ["Enrollment", "Admissions depend on seat availability and accurate student information."],
    ["Fees", "Fees are due on schedule and are non-refundable unless management approves an exceptional case."],
    ["Classes and attendance", "Students must attend regularly, participate respectfully, and never share private class links."],
    ["Certificates", "Certificates require successful curriculum completion, adequate attendance, and required assessments."],
    ["Intellectual property", "Course videos, PDFs, code, and materials may not be copied, resold, or publicly distributed."],
  ];
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-24">
      <article className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:p-14">
        <h1 className="text-4xl font-black text-slate-900">Terms & Conditions</h1>
        <p className="mt-3 text-slate-500">Last updated May 2026</p>
        <div className="mt-10 space-y-8 text-slate-700">
          {sections.map(([title, body]) => <section key={title}><h2 className="text-xl font-bold text-slate-900">{title}</h2><p className="mt-2 leading-7">{body}</p></section>)}
          <p>Questions: contact@vivexatech.in · +91 93544 86861</p>
        </div>
      </article>
    </main>
  );
}
