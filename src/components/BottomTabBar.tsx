'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRole } from '@/lib/store';

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

function ReportIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  );
}

function ListIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="8" y1="6" x2="21" y2="6"/>
      <line x1="8" y1="12" x2="21" y2="12"/>
      <line x1="8" y1="18" x2="21" y2="18"/>
      <line x1="3" y1="6" x2="3.01" y2="6"/>
      <line x1="3" y1="12" x2="3.01" y2="12"/>
      <line x1="3" y1="18" x2="3.01" y2="18"/>
    </svg>
  );
}

function DashboardIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="7" height="7"/>
      <rect x="14" y="3" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/>
      <rect x="3" y="14" width="7" height="7"/>
    </svg>
  );
}

function InsightsIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  );
}

const CITIZEN_NAV: NavItem[] = [
  { href: '/report',      label: 'Report',     icon: <ReportIcon /> },
  { href: '/my-reports',  label: 'My Reports', icon: <ListIcon /> },
];

const OFFICIAL_NAV: NavItem[] = [
  { href: '/dashboard',  label: 'Dashboard', icon: <DashboardIcon /> },
  { href: '/insights',   label: 'Insights',  icon: <InsightsIcon /> },
];

export function BottomTabBar() {
  const { role } = useRole();
  const pathname = usePathname();
  const items = role === 'citizen' ? CITIZEN_NAV : OFFICIAL_NAV;

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex border-t safe-area-bottom"
      style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
      aria-label="Bottom navigation"
    >
      {items.map((item) => {
        const active = pathname === item.href || pathname.startsWith(item.href + '/');
        return (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-col items-center justify-center flex-1 py-2 gap-0.5 min-h-[56px] transition-colors"
            style={{ color: active ? 'var(--primary)' : 'var(--text-muted)' }}
            aria-current={active ? 'page' : undefined}
          >
            {item.icon}
            <span className="text-xs font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
