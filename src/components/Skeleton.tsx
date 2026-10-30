interface SkeletonProps {
  className?: string;
  height?: string | number;
  width?: string | number;
}

export function Skeleton({ className = '', height = 20, width = '100%' }: SkeletonProps) {
  return (
    <div
      className={`skeleton ${className}`}
      style={{ height, width }}
      aria-hidden="true"
    />
  );
}

export function SkeletonCard() {
  return (
    <div
      className="rounded-xl border p-4 flex flex-col gap-3"
      style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}
    >
      <Skeleton height={16} width="60%" />
      <Skeleton height={12} width="40%" />
      <Skeleton height={40} />
      <div className="flex gap-2">
        <Skeleton height={24} width={60} />
        <Skeleton height={24} width={80} />
      </div>
    </div>
  );
}

export function PageSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
