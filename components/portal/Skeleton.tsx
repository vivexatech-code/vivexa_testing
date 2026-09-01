export function Skeleton({ className = "" }: { className?: string }) { return <div className={`animate-pulse rounded-xl bg-slate-200 ${className}`} />; }
export function CardSkeleton() { return <div className="rounded-2xl border bg-white p-5"><Skeleton className="h-5 w-1/3" /><Skeleton className="mt-4 h-20 w-full" /><Skeleton className="mt-4 h-4 w-2/3" /></div>; }
export function ListSkeleton({ rows = 4 }: { rows?: number }) { return <div className="space-y-3">{Array.from({ length: rows }, (_, index) => <Skeleton key={index} className="h-20 w-full" />)}</div>; }
