# DESIGN

**Principles:** mobile-first (design at 375 px, then scale up), white + green, light and dark mode, fast, accessible. Clarity beats decoration.

## Color tokens (CSS variables on :root and .dark, wired into Tailwind)
| Token | Light | Dark |
|---|---|---|
| --bg | #FFFFFF | #0B1512 |
| --surface | #F0FDF6 (mint) | #12201B |
| --surface-2 | #E3F7EC | #1A2C25 |
| --border | #D1E7DC | #274036 |
| --text | #0F1F18 | #E8F5EE |
| --text-muted | #4B6359 | #9BB5A9 |
| --primary | #059669 (emerald) | #34D399 |
| --primary-strong | #047857 | #10B981 |
| --on-primary | #FFFFFF | #05261B |

**Priority colors (reserved for priority only, never for decoration):**
critical `#DC2626` / high `#EA580C` / medium `#D97706` / low `#16A34A`. Always pair color with a text label (never color alone). Dark mode uses lighter tints of the same hues.
Contrast must meet WCAG AA for text.

## Dark mode
Class-based (`.dark` on html). Toggle in the top bar, default follows system preference, persisted in localStorage. No flash on load (inline script sets the class before paint).

## Typography and spacing
System font stack or Inter. Base 16 px. Scale: 12 / 14 / 16 / 20 / 24 / 32. 4 px spacing grid. Radius: 12 px cards, 999 px chips/badges.

## Layout
- **Mobile (< 768 px):** top bar (logo, role switcher, theme toggle), content, **bottom tab bar** with 4 items max. Citizen: Report, My Reports. Official: Dashboard, Map, Insights. Safe-area padding for notched phones.
- **Desktop (>= 768 px):** left sidebar replaces bottom bar; dashboard shows queue + map side by side.
- All tap targets >= 44 x 44 px. No horizontal scroll at 375 px. Inputs 16 px font to prevent iOS zoom.

## Role switcher (MOCKED)
Segmented control "Citizen | Official" in the top bar with a small "Demo mode (mocked login)" label. Switching changes the nav and landing page.

## Key components
- **ReportForm:** photo picker (camera on mobile via `capture`), textarea, category chips (AI pre-selects after typing, user can override), location block (map with draggable pin + "Use my location" + address text field). Single column, sticky submit button. Show a progress state "Analysing report..." then the result card.
- **AIResultCard:** category (+ badge if user override), summary, duplicate notice (if any) with similarity and distance, priority badge with score, "Why this priority" factor list. Badge "AI" or "Fallback (rule-based)".
- **PriorityBadge:** colored pill with label + score.
- **FactorBars:** one row per factor: label, horizontal bar (points / max), "+35" and a one-line reason. Total at the bottom.
- **StatusTimeline:** vertical stepper (Submitted, Under review, Assigned, In progress, Resolved) with timestamps and notes, current step highlighted.
- **ReportCard:** thumbnail, summary, category chip, priority badge, status chip, "+N similar" count.
- **MapView:** Leaflet, pins colored by priority, cluster circles (translucent, labelled), tap pin = mini card with link to detail. Legend. Works with touch.
- **KPI cards:** Open, Critical, Merged duplicates, Avg age, Resolved this week.
- **ClusterCard / ActionBrief:** headline, ranked "fix first" list, each with a one-line why. Badge "AI brief" or "Template brief".
- **Empty, loading (skeleton), and error states** for every list and request.

## Motion
Subtle only (150-200 ms). Respect `prefers-reduced-motion`.

## Labelling honesty in UI
- "Synthetic data" note in the footer or about section.
- "Mocked" labels on role switcher, landmark-based scores, and notifications.
- "Fallback mode" badge whenever AI was unavailable.
