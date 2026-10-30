'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useRole, useTheme } from '@/lib/store';
import type { Role } from '@/lib/types';

export function TopBar() {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, toggle } = useTheme();
  const { role, setRole } = useRole();

  const handleRoleChange = (newRole: Role) => {
    setRole(newRole);
    if (newRole === 'official' && (pathname === '/report' || pathname === '/my-reports')) {
      router.push('/dashboard');
    } else if (newRole === 'citizen' && (pathname === '/dashboard' || pathname === '/insights' || pathname.startsWith('/reports/'))) {
      router.push('/report');
    }
  };

  return (
    <header
      className="sticky top-0 z-40 flex h-14 items-center gap-3 px-4 border-b"
      style={{
        background: 'var(--surface)',
        borderColor: 'var(--border)',
      }}
    >
      {/* Logo */}
      <span
        className="font-bold text-lg tracking-tight flex-shrink-0"
        style={{ color: 'var(--primary)' }}
      >
        CivicLoop
      </span>

      <div className="flex-1" />

      {/* Role switcher */}
      <div className="flex flex-col items-center gap-0.5">
        <div
          className="flex rounded-full overflow-hidden border text-sm"
          style={{ borderColor: 'var(--border)' }}
          role="group"
          aria-label="Demo role switcher"
        >
          {(['citizen', 'official'] as Role[]).map((r) => (
            <button
              key={r}
              onClick={() => handleRoleChange(r)}
              className="px-3 h-8 capitalize font-medium transition-colors"
              style={
                role === r
                  ? { background: 'var(--primary)', color: 'var(--on-primary)' }
                  : { background: 'transparent', color: 'var(--text-muted)' }
              }
              aria-pressed={role === r}
            >
              {r === 'citizen' ? 'Citizen' : 'Official'}
            </button>
          ))}
        </div>
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
          Demo mode (mocked login)
        </span>
      </div>

      {/* Theme toggle */}
      <button
        onClick={toggle}
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        className="flex items-center justify-center w-11 h-11 rounded-full transition-colors flex-shrink-0"
        style={{ color: 'var(--text-muted)' }}
      >
        {theme === 'light' ? (
          /* Moon icon */
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        ) : (
          /* Sun icon */
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="5"/>
            <line x1="12" y1="1" x2="12" y2="3"/>
            <line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/>
            <line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
          </svg>
        )}
      </button>
    </header>
  );
}
