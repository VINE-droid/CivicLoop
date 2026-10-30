import { PageSkeleton } from '@/components/Skeleton';
import { Skeleton } from '@/components/Skeleton';

export const metadata = { title: 'Dashboard — CivicLoop' };

export default function DashboardPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text)' }}>
        Dashboard
      </h1>
      <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
        Priority queue, KPIs and live map.
      </p>

      {/* KPI row skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border p-4 flex flex-col gap-2"
            style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}
          >
            <Skeleton height={12} width="50%" />
            <Skeleton height={28} width="60%" />
          </div>
        ))}
      </div>

      {/* Report list skeleton */}
      <PageSkeleton count={5} />
    </div>
  );
}
