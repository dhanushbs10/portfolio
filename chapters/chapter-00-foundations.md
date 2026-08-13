# Chapter 0, Foundations & Design System

**Goal of this chapter:** stand up the project skeleton and lock in a real design system (not shadcn defaults) before a single section is built. Nothing here should require redoing later, this chapter's output is the foundation every other chapter builds on.

**Prerequisites:** none. This is the first chapter.

**Do not build in this chapter:** no home page sections, no motherboard scene, no data layer. Just scaffold + design tokens + base layout + one throwaway "kitchen sink" page to prove the tokens work.

---

## 0.1 Project Scaffold

- Next.js 15, App Router, TypeScript strict mode, Tailwind CSS, ESLint + Prettier.
- Install: `framer-motion`, `gsap`, `lucide-react`, `clsx`, `tailwind-merge`, `class-variance-authority`.
- Initialize shadcn/ui, but install components on-demand later (Chapter 6/7), not all upfront.
- Git: init repo, `.gitignore` for `.env*`, `/node_modules`, `/.next`. First commit = "chore: project scaffold."
- Node version pinned via `.nvmrc`.
- `tsconfig.json`: enable path aliases (`@/components`, `@/lib`, `@/data`, `@/content`).

## 0.2 Folder Structure to Create Now (empty dirs are fine)

```
/app
/components/ui
/components/shared
/components/sections
/components/homelab
/components/projects
/lib
/data
/content
/public/images
```

## 0.3 Design System, Concept Direction

Reject generic "hacker green matrix rain" and reject generic SaaS-startup gradient blobs. Direction: **"structured signal"**, the visual language of network diagrams, oscilloscope traces, and circuit board silkscreen, rendered clean and modern rather than kitschy.

- **Color system:** dark-mode-first. A near-black base (not pure `#000`), one desaturated accent for structure (e.g. steel blue / graphite), one saturated accent reserved *only* for interactive/highlight states (the same color used for "this component is now in focus" in the motherboard scene later, establish it here so it's consistent site-wide). Define as CSS variables in `globals.css`, referenced through Tailwind theme extension, never hardcode hex values in components.
- **Typography:** one geometric/technical sans for headings (something with a monospace-adjacent character), one highly readable sans for body. A true monospace font reserved for code, specs, labels, and stats (reinforces the technical identity without overusing it).
- **Spacing/rhythm:** define a consistent vertical rhythm scale for section padding now, this matters more than usual because sections need to visually "hand off" to each other later (Chapter 1).
- **Motion tokens:** define standard easing curves and durations in `/lib/animations.ts` now (e.g. `easeStandard`, `easeEmphasized`, `durationFast/Base/Slow`) so every future Framer Motion/GSAP call references the same handful of constants instead of inventing new easing per component.
- **Iconography:** Lucide only, consistent stroke width, sized off the same scale as type.

## 0.4 Base Layout

- `app/layout.tsx`: root layout with theme provider (dark-mode-first, but wire up light mode as a stretch, don't skip semantics), font loading (`next/font`), base `<html>`/`<body>` classes.
- `components/shared/Nav.tsx`: sticky/transparent-to-solid-on-scroll nav, links to all top-level routes (some will 404 until later chapters, that's fine, stub the routes with a "under construction" placeholder page each so nav doesn't break).
- `components/shared/Footer.tsx`: social links, quick nav, copyright.
- `components/shared/SectionHeading.tsx`: reusable heading component (eyebrow label + title + optional subtitle), every section in Chapter 1 will use this, build it well now.
- Metadata defaults in `layout.tsx` (site title template, default OG image placeholder, favicon).

## 0.5 Kitchen Sink Page (temporary, delete later)

Build `/app/dev/kitchen-sink/page.tsx` showing: color swatches, type scale, button variants, the `SectionHeading` component, spacing scale. This is how you visually confirm the design system reads correctly before building real content on top of it. Delete this route in Chapter 7 (polish pass).

---

## Acceptance Criteria for Chapter 0

- [ ] `npm run dev` runs clean, no TS errors, no console warnings.
- [ ] Nav renders all top-level routes; unbuilt routes show a placeholder, not a 404.
- [ ] Kitchen sink page visually confirms color, type, spacing, and motion tokens.
- [ ] No component anywhere hardcodes a color or font outside the token system.
- [ ] Repo is on GitHub with a real `README.md` describing the project (can be brief for now).

**Do not proceed to Chapter 1 until every box above is checked against the real running site, not just "the code looks right."**

---

## Prompt to give Claude Code for this chapter

```
Read chapter-00-foundations.md in this repo and implement everything in it.

Scaffold a Next.js 15 App Router + TypeScript (strict) + Tailwind project.
Build the design system described in section 0.3 as CSS variables + Tailwind
theme extension, a dark-mode-first "structured signal" aesthetic (network/
circuit-inspired, not matrix-rain cliché). Build the base layout, Nav, Footer,
and SectionHeading components per 0.4, with stub placeholder pages for every
route in the nav so nothing 404s. Build the /dev/kitchen-sink page per 0.5.

Do not build any home page section content, the motherboard scene, or any
data layer yet, those are later chapters. When done, list which acceptance
criteria in the "Acceptance Criteria" section are met and which aren't.
```
