export function CourseCardSkeleton() {
  return (
    <div className="rounded-[2rem] p-1 bg-gradient-to-b from-slate-200 to-slate-100 h-full animate-pulse">
      <div className="h-full bg-white rounded-[31px] p-8 flex flex-col">
        <div className="flex justify-between items-start mb-6">
          <div className="w-14 h-14 rounded-2xl bg-slate-200" />
          <div className="h-6 w-20 rounded-full bg-slate-100" />
        </div>
        <div className="h-7 w-3/4 rounded-lg bg-slate-200 mb-3" />
        <div className="space-y-2 mb-8 flex-grow">
          <div className="h-4 w-full rounded bg-slate-100" />
          <div className="h-4 w-5/6 rounded bg-slate-100" />
        </div>
        <div className="flex gap-3 mb-8">
          <div className="h-8 w-24 rounded-lg bg-slate-100" />
          <div className="h-8 w-24 rounded-lg bg-slate-100" />
        </div>
        <div className="h-12 w-full rounded-xl bg-slate-100" />
      </div>
    </div>
  );
}

export function CourseGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <CourseCardSkeleton key={i} />
      ))}
    </>
  );
}
