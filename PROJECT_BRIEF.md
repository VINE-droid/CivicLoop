# PROJECT BRIEF: CivicLoop (working name)

**Event:** PromptWars x ASTRA, "From Complaints to Action". Solo, 8 hours, working prototype + 5-minute demo.
**Hard deadline:** 4:00 PM IST today. Build window for the agent: ~3.5 hours.

## Mission
An AI-powered platform that turns scattered citizen reports into **prioritized, explainable, trackable action**. Collecting complaints is not enough. The system must understand reports, detect patterns, surface hotspots, and help an official decide what to fix first and why.

## The four lifecycle stages (ALL must work end to end)
| Stage | Must do |
|---|---|
| 1. Capture | Submit text and/or image, choose category, give location (map pin / address / coordinates). Under 60 seconds. Works on a phone-sized screen. |
| 2. Understand | AI categorizes, summarizes, flags likely duplicates, assigns priority from urgency + impact, with reasoning. |
| 3. Reveal | Map + dashboard showing recurring problems, high-priority locations, area-level patterns (hotspots) that are hard to see in a list. |
| 4. Act | Review, assign, track each report from submission to resolution. Citizen sees status progress. |

## AI capabilities we are building (all three, in this priority order)
1. **Duplicate detection**: embeddings + geo-distance + category compatibility.
2. **Explainable prioritization**: LLM extracts features, a transparent rule-based score computes priority, UI shows every factor in plain language.
3. **Hotspot clustering + action brief**: geographic clusters with category mix, plus an LLM-written brief a decision-maker can read in under a minute.

## The demo journey (target 5 min). Everything we build serves this.
1. Dashboard: noisy list of reports, then the map.
2. Citizen submits a new report on a phone-sized screen (text + photo + pin + category).
3. AI result shown: category, summary, "Likely duplicate of #X (similarity 0.86, 40 m away)", priority with factor breakdown.
4. Insights: hotspot on the map + action brief.
5. Official assigns it, moves it to In Progress. Switch to citizen view, timeline updated.

## Judging priorities
Judges reward: it works, sensible decisions, honesty about limits. A polished UI alone will not win.
**Integrity rule:** never claim live integrations or AI capabilities we do not have. Anything mocked is labelled "mocked" in the UI and in LIMITATIONS.md.

## Scope control
- Pipeline first (ugly but working), polish later.
- No auth. A "Demo mode" role switcher (Citizen / Official) is used and is labelled mocked.
- No notifications, no real department routing, no real geocoding beyond simple address text (all mocked/labelled).

## Cut list (drop in this order if behind schedule)
1. Dark mode polish (keep toggle working, fix leftovers later)
2. Image analysis by vision model (keep image upload and display)
3. Per-cluster briefs (keep one overall brief)
4. Fancy cluster shapes (use circles)
**Never cut:** duplicate detection, priority explanation, status workflow, citizen timeline.

## Definition of done
- Hosted link on Vercel, mobile-friendly at 375px.
- ~45 synthetic reports seeded (see ARCHITECTURE.md section 7).
- Full demo journey runs without errors, including fallback mode when AI is unavailable.
- README, LIMITATIONS.md complete.
