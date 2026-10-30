import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppProvider } from '@/lib/store';
import { TopBar } from '@/components/TopBar';
import { Sidebar } from '@/components/Sidebar';
import { BottomTabBar } from '@/components/BottomTabBar';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'CivicLoop — Citizen Reports, AI-Powered Action',
  description:
    'Submit, track and analyse civic issues. AI categorises reports, detects duplicates and surfaces hotspots for officials.',
};

/** Inline script — runs before paint, no flash of wrong theme */
const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem('civicloop:theme');var d=window.matchMedia('(prefers-color-scheme:dark)').matches;if(t==='dark'||(t===null&&d)){document.documentElement.classList.add('dark')}}catch(e){}})()`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full`} suppressHydrationWarning>
      {/* suppressHydrationWarning because inline script mutates className before hydration */}
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body
        className="min-h-full flex flex-col"
        style={{ background: 'var(--bg)', color: 'var(--text)' }}
      >
        <AppProvider>
          <TopBar />
          <div className="flex flex-1 min-h-0">
            <Sidebar />
            <main className="flex-1 min-w-0 pb-20 md:pb-0">
              {children}
            </main>
          </div>
          <BottomTabBar />
        </AppProvider>
      </body>
    </html>
  );
}
