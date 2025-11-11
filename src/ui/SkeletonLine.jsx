export function PostSkeleton() {
  return (
    <div className="space-y-3 rounded-2xl bg-zinc-800/70 p-4">
      <div className="relative h-48 w-full overflow-hidden rounded-xl bg-zinc-700">
        <div className="absolute inset-0 shimmer" />
      </div>
      <div className="space-y-2">
        <SkeletonLine className="h-4 w-32" />
        <SkeletonLine className="h-3 w-3/4" />
        <SkeletonLine className="h-3 w-1/2" />
      </div>
    </div>
  );
}

export function SkeletonLine({ className = "" }) {
  return (
    <div className={`relative overflow-hidden rounded-full bg-zinc-700/70 ${className}`}>
      <div className="absolute inset-0 shimmer" />
    </div>
  );
}
