# AGENT RULES (read before every task)

You are building a hackathon prototype under a hard deadline. Read `PROJECT_BRIEF.md`, `ARCHITECTURE.md` and `DESIGN.md` before starting any phase. They are the source of truth. If they conflict with a prompt, tell me and ask. Do not silently choose.

## Working style
1. **One phase per prompt.** Do only what the phase asks. No extra features, no refactors, no renaming, no "improvements" I did not ask for.
2. **Working over pretty.** The pipeline must run end to end before polish.
3. **Verify before claiming done.** Run the app and the typecheck/build. For UI, check at **375 px width** (and desktop). For API/AI work, make at least one real request and show me the output. Never say "should work".
4. **Commit after each working state** with a clear message (`feat(p3): ...`). Never leave the repo broken at the end of a phase.
5. **If blocked for more than ~10 minutes** (API issue, library issue), stop, describe the problem and propose 2 options. Do not rabbit-hole.
6. **At the end of each phase** report: what works, what you verified, what is incomplete, and anything I must do manually (keys, env vars, SQL to run).

## Code rules
- TypeScript strict. No `any` unless commented why. No unused code.
- Validate every LLM output with zod. Treat LLM output as untrusted input.
- Model names, keys and thresholds come from env/config, not scattered literals. Put scoring weights and thresholds in one `config.ts`.
- Never expose `SUPABASE_SERVICE_ROLE_KEY` or `GEMINI_API_KEY` to the client. Never commit `.env*`.
- All API routes return `{ ok: true, data }` or `{ ok: false, error }` and never crash on bad input.
- Keep files small and named as in `ARCHITECTURE.md`.

## Honesty rules (judges penalize fake claims)
- **Never fake AI output.** No hardcoded "AI" results presented as real. If AI is unavailable, use the labelled fallback (`ai_mode='fallback'`) and show a visible badge.
- **Label everything mocked** in the UI and in `LIMITATIONS.md` (roles, landmarks, crews, notifications, synthetic data).
- Priority explanations are generated from the actual stored factors, so the numbers always match the text.
- Do not use real personal data. All seed data is synthetic and says so.

## UI rules
- Mobile-first at 375 px. Tap targets >= 44 px. No horizontal scroll.
- White + green theme with dark mode via CSS variables, per `DESIGN.md`. Priority colors only for priority, always with a text label.
- Every list/request has loading, empty and error states.

## Things you must NOT do
- Do not add authentication, payments, email/SMS, or extra pages not in the architecture.
- Do not swap the stack or add heavy dependencies without asking.
- Do not delete or rewrite working code outside the current phase.
- Do not use `localStorage` for report data (only for theme).

## Useful commands (update if they change)
`npm run dev`, `npm run build`, `npm run lint`, `npm run typecheck`, `npm run seed`
