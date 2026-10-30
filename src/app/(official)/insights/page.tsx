import { PageSkeleton } from '@/components/Skeleton';
import { Skeleton } from '@/components/Skeleton';

export const metadata = { title: 'Insights — CivicLoop' };

export default function InsightsPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text)' }}>
        Insights
      </h1>
      <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
        Hotspot clusters, action brief and area patterns.
      </p>

      {/* Action brief skeleton */}
      <div
        className="rounded-xl border p-4 mb-6 flex flex-col gap-3"
        style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}
      >
        <Skeleton height={14} width="40%" />
        <Skeleton height={16} width="80%" />
        <Skeleton height={12} width="60%" />
      </div>

      {/* Cluster list skeleton */}
      <PageSkeleton count={3} />
    </div>
  );
}
