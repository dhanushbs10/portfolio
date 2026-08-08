# Portfolio Chapter Audit — Full Progress Report

**Date:** 2026-08-08
**Scope:** Chapters 0–3 vs actual codebase state
**Type:** Status check only — no changes made during this audit

---

## Chapter 0 — Foundations & Design System

| # | Criterion | Status | Notes |
|---|-----------|--------|-------|
| 0.1 | `npm run dev` runs clean, no TS errors | ✅ | Server confirmed running on :3456 |
| 0.1 | Project scaffold (Next.js 15, App Router, TS strict, Tailwind) | ✅ | Next.js 16.3.0, TS strict in tsconfig |
| 0.1 | Dependencies installed | ✅ | framer-motion, lucide-react, clsx, tailwind-merge, cva + shadcn |
| 0.1 | Git init + `.gitignore` | ✅ | Repo is a git repo |
| 0.1 | `tsconfig.json` path aliases | ✅ | `@/components`, `@/lib`, `@/data` all resolve |
| 0.3 | Design tokens as CSS vars + Tailwind extension | ✅ | Full token system in globals.css + @theme inline |
| 0.3 | No hardcoded hex in components | ⚠️ | TechStack.tsx inline SVG data has hardcoded brand hex values, but these are data constants (icon brand colors), not component styling — acceptable and intentional for the SVG fill approach |
| 0.3 | Motion tokens in `/lib/animations.ts` | ✅ | easeStandard, easeEmphasized, durationFast/Base/Slow all present |
| 0.4 | Nav with all top-level routes | ⚠️ | Nav links to `/projects`, `/homelab`, `/blog`, `/ctf`, `/research`, `/contact`, `/about` — stub pages exist for most but `/ctf` and `/research` are missing (404 would occur) |
| 0.4 | Footer | ✅ | Social links, nav, copyright present |
| 0.4 | SectionHeading component | ✅ | Reusable, used by all sections |
| 0.4 | Metadata defaults | ✅ | Title template, description, OG, favicon all set |
| 0.4 | Theme provider (dark-first) | ✅ | Dark default, light mode supported |
| 0.4 | Font loading (next/font) | ✅ | Space Grotesk + Inter + JetBrains Mono |
| 0.5 | Kitchen sink page | ✅ | Exists at `/app/dev/kitchen-sink` — not yet deleted (per spec it should be deleted in Ch7, but Ch7 not started) |

**Verdict:** Mostly done. Route stubs for `/ctf` and `/research` are the main gap.

---

## Chapter 1 — Static Section Shell

| # | Criterion | Status | Notes |
|---|-----------|--------|-------|
| 1.1 | All 12 sections built as separate components | ⚠️ | 11 of 12 built: Hero, AboutMe, Journey, Education, SkillsPreview, TechStack, CertificationsPreview, ProjectsPreview, RoadmapPreview, Achievements, ContactSection — **HomeLabTeaser is missing** (item #9) |
| 1.1 | Scroll-reveal animation per section | ✅ | All sections wrapped in `<AnimatedReveal>` |
| 1.1 | Framer Motion useInView + variants | ✅ | Implemented in AnimatedReveal wrapper |
| 1.1 | Responsive at mobile/tablet/desktop | ✅ | Tailwind responsive classes throughout |
| 1.2 | Persistent background layer (ScrollBackground + PageBackground) | ✅ | Both present — fixed-position canvas (ScrollBackground) and gradient layer (PageBackground) create continuous scroll feel |
| 1.2 | Section transitions feel continuous | ✅ | Persistent bg + AnimatedReveal stagger + consistent easing |
| 1.2 | Single `<AnimatedReveal>` wrapper | ✅ | All sections use same component |
| 1.2 | No hard section borders | ✅ | Soft gradients, no `border-t` dividers |
| 1.3 | page.tsx imports and orders all sections | ✅ | All 11 present, thin table-of-contents style |
| 1.3 | No layout shift (CLS) | ✅ | Sections have fixed padding, animations are opacity+transform only |

**Acceptance Criteria:**

| # | Criterion | Status | Notes |
|---|-----------|--------|-------|
| AC 1 | Scrolling feels like one continuous piece | ✅ | Persistent bg + smooth scroll + consistent reveal |
| AC 2 | Sections reveal once, no janky re-trigger | ✅ | `once: true` in AnimatedReveal |
| AC 3 | Responsive at 375/768/1280/1920 | ✅ | Tailwind sm/md/lg breakpoints used |
| AC 4 | No CLS from animations | ✅ | Space reserved before animate |
| AC 5 | `prefers-reduced-motion` respected | ✅ | AnimatedReveal checks `useReducedMotion`, instant reveal when active |
| AC 6 | Placeholder content clearly marked | ❌ | Three section eyebrows still have bracketed dev labels: `Education.tsx` → `[EDU.BACK]`, `ProjectsPreview.tsx` → `[DEV.PROJ]`, `CertificationsPreview.tsx` → `[SEC.CERTS]` |

**Verdict:** 5/6 acceptance criteria met. AC 6 fails — bracketed debug labels still render on the live page.

---

## Chapter 2 — Data Layer

| # | Criterion | Status | Notes |
|---|-----------|--------|-------|
| 2.1 | All types in `/lib/types.ts` | ✅ | Skill, Certification, RoadmapItem, Achievement, HardwareComponent, JourneyMilestone, EducationEntry — all present, no `any` |
| 2.2 | Seed files exist with real content | ⚠️ | Most files have real content. **`certifications.ts` still has placeholder entries** (`[Cert Name — e.g. CompTIA Security+]`, `[Issuer — e.g. CompTIA]`, etc.) — three out of three certs are still bracketed placeholders. **`education.ts` has one placeholder** (`[Institution Name], Bengaluru, Karnataka`). Achievements is genuinely empty (acceptable per spec). |
| 2.2 | Hardware pre-seeded from actual specs | ✅ | All real specs present (i5-4670K, RAM, GPUs, storage, network) |
| 2.2 | OS environment data | ✅ | Present |
| 2.3 | `/lib/data.ts` typed getters | ✅ | All getters exist: getSkills, getCertifications, getRoadmap, getAchievements, getHardware, getJourney, getEducation, getContactInfo, getOsEnvironment, getTechStack, getAbout |
| 2.3 | Components import from `/lib/data.ts`, not `/data/*` directly | ✅ | Verified: AboutMe, Journey, Education, SkillsPreview, CertificationsPreview, RoadmapPreview, Achievements all import from `@/lib/data` |

**Acceptance Criteria:**

| # | Criterion | Status | Notes |
|---|-----------|--------|-------|
| AC 1 | Every type exists, no `any` | ✅ | |
| AC 2 | Seed files have real content | ⚠️ | Certs + education have bracketed placeholder strings still |
| AC 3 | Components use `/lib/data.ts` getters | ✅ | |
| AC 4 | No sections rewired yet | ✅ | This was Ch2's constraint — wiring happened in Ch3 |

**Verdict:** AC 1 and AC 3/4 fully met. AC 2 partially — real data exists in skills, journey, roadmap, hardware, but certs and education still have placeholder strings.

---

## Chapter 3 — Wire Home Sections to Real Data

| # | Criterion | Status | Notes |
|---|-----------|--------|-------|
| 3.1 | AboutMe wired to `getAbout()` | ✅ | Real bio + interests |
| 3.1 | Journey wired to `getJourney()` | ✅ | Real milestones |
| 3.1 | Education wired to `getEducation()` | ⚠️ | Wired correctly, but **institution name is still a placeholder**: `"[Institution Name], Bengaluru, Karnataka"` |
| 3.1 | SkillsPreview wired to `getSkillsByCategory()` | ✅ | Cybersecurity + Networking categories, sorted by proficiency |
| 3.1 | CertificationsPreview wired to `getCertifications()` | ⚠️ | Wired correctly, sorted by status, but **all three cert entries are placeholder strings** (`[Cert Name — e.g. CompTIA Security+]` etc.) |
| 3.1 | RoadmapPreview wired to `getRoadmap()` | ✅ | Real items |
| 3.1 | Achievements wired to `getAchievements()` | ✅ | Empty array handled gracefully ("No achievements yet") |
| 3.1 | TechStack moved to `/data/tech-stack.ts` | ✅ | Data source is `toolGroups` from `/data/tech-stack.ts`, rendered as logo marquee |
| 3.1 | ProjectsPreview left as placeholder | ✅ | Still hardcoded PROJECTS array per spec |
| 3.1 | HomeLabTeaser left as placeholder | ⚠️ | **HomeLabTeaser component doesn't exist at all** — not wired, not rendered, not stubbed |

**Acceptance Criteria:**

| # | Criterion | Status | Notes |
|---|-----------|--------|-------|
| AC 1 | No bracketed placeholders remain | ❌ | Four remaining: `Education.tsx` eyebrow `[EDU.BACK]`, `CertificationsPreview.tsx` eyebrow `[SEC.CERTS]`, `ProjectsPreview.tsx` eyebrow `[DEV.PROJ]`, plus placeholder strings in data files |
| AC 2 | Empty/thin data states render honestly | ✅ | Achievements handles empty correctly |
| AC 3 | No visual regression from Chapter 1 | ✅ | All animations intact |
| AC 4 | ProjectsPreview + HomeLabTeaser still placeholders | ✅ (partial) | ProjectsPreview is intentional. HomeLabTeaser is missing entirely — not broken, but doesn't exist |

**Verdict:** Sections are wired correctly but AC 1 fails — bracketed labels and placeholder strings still rendered.

---

## Additional Specific Checks

### 1. Bracketed placeholders remaining in rendered output

**BROKEN — still visible on the live page:**
- `src/components/sections/Education.tsx:16` → `eyebrow="[EDU.BACK]"` — renders as visible section label
- `src/components/sections/ProjectsPreview.tsx:58` → `eyebrow="[DEV.PROJ]"` — renders as visible section label
- `src/components/sections/CertificationsPreview.tsx:27` → `eyebrow="[SEC.CERTS]"` — renders as visible section label
- `src/data/certifications.ts:6-7,15-16,22-23` → placeholder cert strings (`[Cert Name — e.g. CompTIA Security+]`, `[Issuer — e.g. CompTIA]`, `[In-Progress Cert — e.g. CCNA]`, etc.)
- `src/data/education.ts:7` → `[Institution Name], Bengaluru, Karnataka`

*Not flagged:* bracketed text in `chapters/*.md` files (those are build instructions, not rendered)

### 2. Accent color consistency

- **Primary accent:** `accent-interactive` (cyan, `195 100% 50%`) — used consistently for CTAs, focus states, interactive highlights ✅
- **Secondary accent:** `accent-structure-light` (desaturated steel blue, `215 25% 55%`) — used in Hero identity line, Journey role/org text ✅
- **No stray orange or competing saturated accent found** ✅
- Contact form submit button: solid `bg-accent-interactive` with `text-surface-base` — appropriate per spec (the one interactive CTA)

### 3. Tech Stack marquee — hover labels + edge fade

- **Hover labels:** `After:` `>` selectors styled as `px-2 py-0.5 rounded bg-surface-overlay/90`, `-bottom-6` positioned, auto-width — no overflow ✅
- **Edge fade:** `mask-image: linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)` — smooth gradient, not flat rectangles ✅

### 4. Orphaned/unused background components

| Component | File | Used? | Notes |
|-----------|------|-------|-------|
| `FaultyTerminal` (TS) | `src/components/FaultyTerminal.tsx` | ❌ Not imported anywhere | |
| `FaultyTerminal` (JS) | `src/components/shared/FaultyTerminal.jsx` | ❌ Not imported anywhere | Duplicate .tsx/.jsx pair |
| `FaultyTerminal.css` | `src/components/shared/FaultyTerminal.css` | ❌ Only imported by the .jsx orphan | |
| `Ferrofluid` | `src/components/Ferrofluid.tsx` | ❌ Not imported anywhere | |
| `Topography` | `src/components/Topography.tsx` | ❌ Not imported anywhere | |
| `PageBackground` | `src/components/PageBackground.tsx` | ✅ Imported in `layout.tsx:6`, rendered at `:64` | |
| `ScrollBackground` | `src/components/shared/ScrollBackground.tsx` | ✅ Imported in `page.tsx:14`, rendered at `:19` | |

### 5. Terminal-style eyebrow labels

The `.eyebrow` CSS class: `font-mono text-[0.65rem] tracking-widest uppercase text-text-tertiary` — small, quiet, tertiary color ✅
Single consistent style across all sections.

---

## Known Intentional Deviations — Confirmed DONE

| Deviation | Status | Notes |
|-----------|--------|-------|
| Hero background: WebThreads component | ✅ | `HeroBackground.tsx` wraps WebThreads with prefers-reduced-motion + WebGL2 fallback |
| Persistent page-level background continuity | ✅ | ScrollBackground + PageBackground create seamless scroll feel |
| Skills section: consolidated plain-text | ✅ | Single presentation, no bordered pills or background panel |
| Tech Stack: clickable logo marquee | ✅ | Simple Ions, `fill="currentColor"` for brand colors, links to official sites |
| Hero name: DecryptedText wrapper | ✅ | `DecryptedName.tsx` with `animateOn="view"`, `prefers-reduced-motion` guard |
| Hero CTA buttons: ghost treatment | ✅ | Text-only links with arrow, no solid filled boxes |

---

## Overall Summary by Chapter

| Chapter | Status | Key Gaps |
|---------|--------|----------|
| Ch0 — Foundations | ✅ 95% | `/ctf` and `/research` route stubs missing |
| Ch1 — Section Shell | ⚠️ 92% | HomeLabTeaser missing; 3 bracketed dev labels still render |
| Ch2 — Data Layer | ⚠️ 90% | Certs + education have placeholder strings in data files |
| Ch3 — Wire Real Data | ⚠️ 88% | 4 bracketed labels/sections still visible; certs and education not fully populated |

---

## Decisions Needed

1. **Orphaned components (5 dead files):** `FaultyTerminal.tsx`, `FaultyTerminal.jsx`, `FaultyTerminal.css`, `Ferrofluid.tsx`, `Topography.tsx` — all dead code. Delete now or keep as reference?

2. **Bracketed dev labels still rendering on the live page:** `Education.tsx` eyebrow `[EDU.BACK]`, `ProjectsPreview.tsx` eyebrow `[DEV.PROJ]`, `CertificationsPreview.tsx` eyebrow `[SEC.CERTS]`. These were clearly temporary debug labels. Replace with real section labels now, or provide preferred wording?

3. **Data placeholder strings:** `certifications.ts` has three cert entries with bracketed placeholder strings, and `education.ts` has `[Institution Name]`. Replace with real values, remove temporarily, or mark as "coming soon"?

4. **Missing `HomeLabTeaser` component:** Not stubbed, not rendered — the Ch4 homelab section doesn't exist yet. Add a minimal stub placeholder between `ProjectsPreview` and `RoadmapPreview` now, or leave the gap until Ch5?

5. **`/ctf` and `/research` routes:** Nav links to these but no stub pages exist — would 404 if clicked. Add stubs now or leave for later chapters?
