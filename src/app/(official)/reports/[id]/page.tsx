import { Skeleton, PageSkeleton } from '@/components/Skeleton';

export const metadata = { title: 'Report Detail — CivicLoop' };

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ReportDetailPage({ params }: Props) {
  const { id } = await params;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="mb-4 flex items-center gap-2">
        <span style={{ color: 'var(--text-muted)' }} className="text-sm">
          Report
        </span>
        <span style={{ color: 'var(--text-muted)' }}>/</span>
        <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>
          #{id}
        </span>
      </div>

      <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text)' }}>
        Report #{id}
      </h1>
      <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
        Detail view — priority breakdown, assign, status workflow.
      </p>

      {/* Priority skeleton */}
      <div
        className="rounded-xl border p-4 mb-4 flex flex-col gap-3"
        style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}
      >
        <Skeleton height={14} width="30%" />
        <Skeleton height={20} width="50%" />
        <Skeleton height={12} width="70%" />
        <Skeleton height={12} width="60%" />
      </div>

      {/* Status timeline skeleton */}
      <PageSkeleton count={2} />
    </div>
  );
}
