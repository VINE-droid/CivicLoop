import { PageSkeleton } from '@/components/Skeleton';

export const metadata = { title: 'My Reports — CivicLoop' };

export default function MyReportsPage() {
  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text)' }}>
        My Reports
      </h1>
      <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
        Track the status of your submitted reports.
      </p>
      {/* Placeholder — list + timeline built in Phase 3 */}
      <PageSkeleton count={4} />
    </div>
  );
}
