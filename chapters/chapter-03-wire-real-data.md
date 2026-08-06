# Chapter 3 — Wire Home Sections to Real Data

**Goal of this chapter:** replace every placeholder in the Chapter 1 section shell with the real data seeded in Chapter 2. No new components, no new animation — this is a rewiring chapter, and it should be a satisfying, low-risk one since the hard structural work is already done.

**Prerequisites:** Chapters 0, 1, 2 complete.

**Do not build in this chapter:** the full `/projects`, `/certifications`, `/homelab`, `/blog`/`/ctf`/`/research` routes — those are later chapters and get their own real data wiring there. This chapter is specifically about the **home page preview sections**.

---

## 3.1 Section-by-Section Rewiring

For each section, replace hardcoded/placeholder props with calls to the `/lib/data.ts` getters from Chapter 2, keeping the exact component structure and animation from Chapter 1 — if wiring real data breaks the layout (e.g. a longer real skill name than the placeholder), fix the layout to be robust to real content lengths, don't shorten your real content to fit.

- **`AboutMe.tsx`** — swap in your real copy (write this now if you haven't already — it doesn't need a data file, it can live as a constant in the component or a small `about.ts` in `/data/`).
- **`Journey.tsx`** — wire to `getJourneyMilestones()`.
- **`Education.tsx`** — wire to `getEducation()`.
- **`SkillsPreview.tsx`** — wire to `getSkills()`, grouped by category. Decide here: does the *preview* show all categories condensed, or a curated subset with "See full skills breakdown" (if you decide to give skills its own dedicated section/route later)? Recommendation: show all categories but cap visible chips per category with a "+N more" affordance, so the preview stays scannable.
- **`CertificationsPreview.tsx`** — wire to `getCertifications()`, sorted status-first (earned → in-progress → planned), cap to a reasonable preview count with "View all →" to `/certifications`.
- **`RoadmapPreview.tsx`** — wire to `getRoadmapItems()`.
- **`Achievements.tsx`** — wire to `getAchievements()`. If this array is genuinely empty right now, the section should degrade gracefully (either hide itself entirely if empty, or show a clearly-honest "building toward my first competition entries" state) — never render fake achievement cards.
- **`TechStack.tsx`** — this can stay closer to static/manual since it's really just your daily-driver tool logos, but move the list into `/data/tech-stack.ts` for consistency rather than leaving it inline in the component.

## 3.2 What Stays Deferred

- `ProjectsPreview.tsx` — leave wired to placeholder for now; gets wired for real in Chapter 4 once the MDX project system exists.
- `HomeLabTeaser.tsx` — leave as-is; gets its real image/link once Chapter 5 exists.
- `ContactSection.tsx` — no data wiring needed here, this chapter doesn't touch it (Chapter 7 handles the submit logic).

---

## Acceptance Criteria for Chapter 3

- [ ] Every section listed in 3.1 renders real, accurate content — no bracketed placeholders remain in those sections.
- [ ] Empty/thin data states (e.g. few or no achievements) render honestly, not with fabricated filler.
- [ ] No visual regression from Chapter 1 — animations and layout still behave correctly with real (differently-sized) content.
- [ ] `ProjectsPreview` and `HomeLabTeaser` are confirmed still using placeholders intentionally (not accidentally broken).

---

## Prompt to give Claude Code for this chapter

```
Read chapter-03-wire-real-data.md and implement everything in it. Rewire the
sections listed in 3.1 to pull from the /lib/data.ts getters built in
Chapter 2, keeping existing component structure and animations from Chapter 1
unless real content genuinely breaks the layout — in that case, make the
layout robust to real content rather than truncating real content to fit.
Leave ProjectsPreview, HomeLabTeaser, and ContactSection untouched per 3.2.

When done, report against the Acceptance Criteria, and flag any section
where the real data content (lengths, counts) required a layout adjustment
from what Chapter 1 assumed.
```
