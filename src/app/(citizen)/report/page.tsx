import { PageSkeleton } from '@/components/Skeleton';

export const metadata = { title: 'Submit Report — CivicLoop' };

export default function ReportPage() {
  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text)' }}>
        Submit a Report
      </h1>
      <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
        Describe a civic issue. AI will categorise, summarise and prioritise it.
      </p>
      {/* Placeholder — report form built in Phase 2 */}
      <PageSkeleton count={3} />
    </div>
  );
}
