'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import type { Role } from './types';

// ── Theme ──────────────────────────────────────────────────

type Theme = 'light' | 'dark';

interface ThemeCtx {
  theme: Theme;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeCtx | null>(null);

export function useTheme(): ThemeCtx {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be inside AppProvider');
  return ctx;
}

// ── Role ───────────────────────────────────────────────────

interface RoleCtx {
  role: Role;
  setRole: (r: Role) => void;
}

const RoleContext = createContext<RoleCtx | null>(null);

export function useRole(): RoleCtx {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error('useRole must be inside AppProvider');
  return ctx;
}

// ── Provider ───────────────────────────────────────────────

export function AppProvider({ children }: { children: React.ReactNode }) {
  // Theme: initialised by inline script (see layout.tsx) to avoid flash.
  // We read the current class on <html> as source of truth.
  const [theme, setTheme] = useState<Theme>('light');
  const [role, setRoleState] = useState<Role>('citizen');

  // Sync React state with the class already set by inline script
  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    if (isDark) {
      setTimeout(() => {
        setTheme('dark');
      }, 0);
    }
  }, []);

  // Persist role
  useEffect(() => {
    try {
      const saved = localStorage.getItem('civicloop:role') as Role | null;
      if (saved === 'citizen' || saved === 'official') {
        setTimeout(() => {
          setRoleState(saved);
        }, 0);
      }
    } catch {
      // localStorage unavailable — stay with default
    }
  }, []);

  const toggle = useCallback(() => {
    setTheme((prev) => {
      const next: Theme = prev === 'light' ? 'dark' : 'light';
      document.documentElement.classList.toggle('dark', next === 'dark');
      try { localStorage.setItem('civicloop:theme', next); } catch { /* ignore */ }
      return next;
    });
  }, []);

  const setRole = useCallback((r: Role) => {
    setRoleState(r);
    try { localStorage.setItem('civicloop:role', r); } catch { /* ignore */ }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      <RoleContext.Provider value={{ role, setRole }}>
        {children}
      </RoleContext.Provider>
    </ThemeContext.Provider>
  );
}
