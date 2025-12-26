export function PostSkeleton() {
  return (
    <li className="flex flex-col gap-4 border-t border-gray-800/60 py-6 w-full ">
      <div className="flex items-center gap-3">
        <div className="relative h-14 w-14 overflow-hidden rounded-full border bg-zinc-900">
          <div className="absolute inset-0 shimmer" />
        </div>

        <div className="flex flex-col gap-1">
          <SkeletonLine className="h-3 w-12 rounded-full bg-amber-300/40" />
          <SkeletonLine className="h-4 w-32" />
          <SkeletonLine className="h-3 w-16" />
        </div>

        <div className="ml-auto relative h-5 w-2 overflow-hidden rounded-full bg-zinc-800/60">
          <div className="absolute inset-0 shimmer" />
        </div>
      </div>

      <div className="flex flex-col items-center">
        <div className="w-full max-w-sm space-y-4 rounded-3xl border border-amber-500/30 bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 p-4 shadow-[0_15px_40px_-25px_rgb(245_158_11)] sm:max-w-md lg:max-w-2xl">
          <div className="relative h-80 w-full overflow-hidden rounded-2xl bg-zinc-800/80">
            <div className="absolute inset-0 shimmer" />
          </div>

          <div className="flex flex-col gap-2">
            <SkeletonLine className="col-start-1 col-end-2 h-3 w-20 bg-amber-300/40" />
            <span className="flex gap-2">
              {" "}
              <SkeletonLine className="col-start-1 col-end-1 h-3 w-20" />{" "}
              <SkeletonLine className="col-start-2 col-end-3 h-3 w-4/6" />{" "}
            </span>
          </div>
        </div>
      </div>
    </li>
  );
}

export function SkeletonLine({ className = "" }) {
  return (
    <div
      className={`relative overflow-hidden rounded-full bg-zinc-700/70 ${className}`}
    >
      <div className="absolute inset-0 shimmer" />
    </div>
  );
}
