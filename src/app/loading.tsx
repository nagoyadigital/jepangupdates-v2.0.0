export default function Loading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header skeleton */}
      <div className="bg-white border-b border-slate-100">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <div className="h-12 w-40 animate-pulse rounded bg-slate-100" />
          <div className="h-10 w-64 animate-pulse rounded-full bg-slate-100 hidden sm:block" />
        </div>
        <div className="h-10 w-full animate-pulse bg-slate-100" />
      </div>

      {/* Content skeleton */}
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Headline skeleton */}
        <div className="h-[300px] sm:h-[400px] w-full animate-pulse rounded-lg bg-slate-100" />

        {/* Articles grid skeleton */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="aspect-[16/10] animate-pulse rounded-lg bg-slate-100" />
              <div className="h-3 w-20 animate-pulse rounded bg-slate-100" />
              <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-slate-100" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
